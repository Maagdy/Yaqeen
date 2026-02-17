import { useEffect, useRef, useCallback } from 'react';
import { useRamadanTracking } from './useRamadanTracking';
import { useAuth } from './useAuth';
import type { Ayah } from '@/api/domains/chapter/chapter.types';
import type { MushafAyah } from '@/api/domains/mushafs/mushafs.types';

const PENDING_TRACKING_KEY = 'yaqeen_viewport_page_tracking';
const SESSION_ID_KEY = 'yaqeen_viewport_session_id';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const MAX_PAGES_PER_SESSION = 60; // Safety cap: longest surah (Al-Baqarah) ≈ 48 pages
const DWELL_TIME = 1000; // Element must be visible for 1 second to count as "viewed" (BALANCED)
const SCROLL_DEBOUNCE = 500; // Wait 500ms after scroll stops before tracking

interface TrackingSession {
  sessionId: string;
  viewedPages: Set<number>;
  tracked: boolean;
  lastSyncedCount: number;
  startTime: number;
}

interface PendingTrackingData {
  userId: string;
  sessionId: string;
  pages: number[];
  timestamp: number;
}

interface TrackerOptions {
  enabled?: boolean;
}

/**
 * BALANCED Viewport-based page tracker using Intersection Observer + MutationObserver + Polling
 *
 * BALANCED APPROACH:
 * 1. 30% threshold (not 60%) - works with ayah card padding/spacing
 * 2. -20px rootMargin (not -100px) - doesn't exclude visible content
 * 3. 1s dwell time (not 2s) - easier to trigger when user stops
 * 4. Cancel timers on scroll (not block) - allows tracking but filters quick scrolling
 * 5. Polling fallback every 3s - catches pages if IntersectionObserver events missed
 * 6. Real-time auto-save every 30s - user sees progress while reading
 * 7. Incremental tracking - only sends NEW pages, not re-sending old ones
 *
 * USER EXPECTATION:
 * - Stop and read for 5-6 seconds → pages ARE tracked ✅
 * - Scroll quickly past pages → pages NOT tracked ✅
 *
 * @param _ayahs - Array of ayahs (kept for API compatibility, not used)
 * @param options - Configuration options
 */
export const useViewportPageTracker = (
  _ayahs: Ayah[] | MushafAyah[],
  options: TrackerOptions = {}
) => {
  const { enabled = true } = options;
  const { trackPagesRead, isLoggedIn } = useRamadanTracking();
  const { user } = useAuth();

  const sessionRef = useRef<TrackingSession | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const autoSaveIntervalRef = useRef<number | null>(null);
  const observedElementsRef = useRef<Set<Element>>(new Set());
  const currentSurahRef = useRef<string | null>(null); // Track current surah to detect changes
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const dwellTimersRef = useRef<Map<number, number>>(new Map()); // Track elements waiting to be marked as viewed

  // Generate or retrieve session ID
  const getSessionId = useCallback((): string => {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }, []);

  // Initialize session (reset when ayahs change = new surah loaded)
  useEffect(() => {
    if (!enabled || !isLoggedIn) return;

    // Detect surah change by checking first ayah's surah number
    const firstAyah = _ayahs[0];
    const surahId = firstAyah && 'surah' in firstAyah
      ? typeof firstAyah.surah === 'object'
        ? firstAyah.surah.number?.toString()
        : firstAyah.surah?.toString()
      : null;

    currentSurahRef.current = surahId;

    sessionRef.current = {
      sessionId: getSessionId(),
      viewedPages: new Set<number>(),
      tracked: false,
      lastSyncedCount: 0,
      startTime: Date.now(),
    };
  }, [enabled, isLoggedIn, getSessionId, _ayahs]);

  // Process pending tracking data from previous session
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const pendingData = localStorage.getItem(PENDING_TRACKING_KEY);
    if (!pendingData) return;

    try {
      const data: PendingTrackingData = JSON.parse(pendingData);
      const age = Date.now() - data.timestamp;
      const currentSessionId = getSessionId();

      if (
        data.userId === user.id &&
        age < 5 * 60 * 1000 &&
        data.pages.length > 0 &&
        data.sessionId !== currentSessionId
      ) {
        trackPagesRead(data.pages.length, false)
          .then(() => {
            localStorage.removeItem(PENDING_TRACKING_KEY);
          })
          .catch(error => {
            console.error('[ViewportTracker] ❌ Failed to track pending pages:', error);
          });
      } else {
        localStorage.removeItem(PENDING_TRACKING_KEY);
      }
    } catch (error) {
      console.error('[ViewportTracker] ❌ Failed to parse pending tracking data:', error);
      localStorage.removeItem(PENDING_TRACKING_KEY);
    }
  }, [isLoggedIn, user?.id, trackPagesRead, getSessionId]);

  // Track pages function (INCREMENTAL - only new pages)
  const trackPages = useCallback((isFinal: boolean = false) => {
    if (!enabled || !isLoggedIn || !user?.id || !sessionRef.current) return;

    const session = sessionRef.current;
    const viewedPages = Array.from(session.viewedPages).sort((a, b) => a - b);
    const totalCount = viewedPages.length;
    const newPagesCount = totalCount - session.lastSyncedCount;

    if (newPagesCount === 0) {
      return;
    }

    // Prevent final tracking if already done
    if (isFinal && session.tracked) {
      return;
    }

    // Store in localStorage as backup
    const pendingData: PendingTrackingData = {
      userId: user.id,
      sessionId: session.sessionId,
      pages: viewedPages,
      timestamp: Date.now(),
    };

    localStorage.setItem(PENDING_TRACKING_KEY, JSON.stringify(pendingData));

    // Fire tracking call with ONLY new pages
    trackPagesRead(newPagesCount, false)
      .then(() => {
        localStorage.removeItem(PENDING_TRACKING_KEY);
        session.lastSyncedCount = totalCount; // Update synced count

        if (isFinal) {
          session.tracked = true;
        }
      })
      .catch(error => {
        console.error(`[ViewportTracker] Failed to track pages:`, error);
        // Keep in localStorage for retry on next page load
      });
  }, [enabled, isLoggedIn, user?.id, trackPagesRead]);

  // Intersection callback with DWELL TIME (element must stay visible)
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (!sessionRef.current) return;

    entries.forEach(entry => {
      const pageAttr = entry.target.getAttribute('data-page');
      if (!pageAttr) return;

      const pageNumber = parseInt(pageAttr, 10);

      // Validate page number
      if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 700) {
        return;
      }

      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        // Element is NOW visible (30%+ in viewport)
        // Don't track if already viewed
        if (sessionRef.current!.viewedPages.has(pageNumber)) {
          return;
        }

        // Check if already has dwell timer
        if (dwellTimersRef.current.has(pageNumber)) {
          return; // Already waiting
        }

        // Start dwell timer: element must stay visible for DWELL_TIME
        const timerId = window.setTimeout(() => {
          // After DWELL_TIME, check if still visible and mark as viewed
          if (!sessionRef.current) return;

          // Safety cap check
          if (sessionRef.current.viewedPages.size >= MAX_PAGES_PER_SESSION) {
            console.error(`[ViewportTracker] SAFETY CAP REACHED: ${MAX_PAGES_PER_SESSION} pages!`);
            return;
          }

          // Mark as viewed
          sessionRef.current.viewedPages.add(pageNumber);
          dwellTimersRef.current.delete(pageNumber);
        }, DWELL_TIME);

        dwellTimersRef.current.set(pageNumber, timerId);
      } else {
        // Element is NO LONGER visible - cancel dwell timer
        const timerId = dwellTimersRef.current.get(pageNumber);
        if (timerId) {
          clearTimeout(timerId);
          dwellTimersRef.current.delete(pageNumber);
        }
      }
    });
  }, []);

  // Observe an element
  const observeElement = useCallback((element: Element) => {
    if (!observerRef.current || observedElementsRef.current.has(element)) return;

    observerRef.current.observe(element);
    observedElementsRef.current.add(element);
  }, []);

  // Set up Intersection Observer + MutationObserver
  useEffect(() => {
    if (!enabled || !isLoggedIn || !sessionRef.current) return;

    // Create Intersection Observer with BALANCED settings
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.3, // 30% of element must be visible (BALANCED - works with padding)
      rootMargin: '-20px 0px', // Small margin, only exclude viewport edges
    });

    // Create Mutation Observer to watch for NEW elements with data-page
    mutationObserverRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Check if element itself has data-page
            if (element.hasAttribute('data-page')) {
              observeElement(element);
            }

            // Check descendants for data-page
            const descendants = element.querySelectorAll('[data-page]');
            descendants.forEach(observeElement);
          }
        });
      });
    });

    // Start watching for DOM changes
    mutationObserverRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Observe existing elements
    const existingElements = document.querySelectorAll('[data-page]');

    existingElements.forEach(observeElement);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
        mutationObserverRef.current = null;
      }

      // Clear all pending dwell timers
      dwellTimersRef.current.forEach(timerId => clearTimeout(timerId));
      dwellTimersRef.current.clear();

      observedElementsRef.current.clear();
    };
  }, [enabled, isLoggedIn, handleIntersection, observeElement]);

  // Detect scrolling to pause tracking
  useEffect(() => {
    if (!enabled || !isLoggedIn) return;

    const handleScroll = () => {
      isScrollingRef.current = true;

      // Cancel all pending dwell timers (user is scrolling - don't track these pages)
      if (dwellTimersRef.current.size > 0) {
        dwellTimersRef.current.forEach(timerId => {
          clearTimeout(timerId);
        });
        dwellTimersRef.current.clear();
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout - mark as "stopped scrolling" after SCROLL_DEBOUNCE
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, SCROLL_DEBOUNCE);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [enabled, isLoggedIn]);

  // Set up auto-save interval (every 30 seconds)
  useEffect(() => {
    if (!enabled || !isLoggedIn || !sessionRef.current) return;

    autoSaveIntervalRef.current = setInterval(() => {
      if (sessionRef.current && sessionRef.current.viewedPages.size > sessionRef.current.lastSyncedCount) {
        trackPages(false); // Not final, just periodic save
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    };
  }, [enabled, isLoggedIn, trackPages]);

  // Polling fallback: Check for visible elements every 3 seconds
  useEffect(() => {
    if (!enabled || !isLoggedIn || !sessionRef.current) return;

    const pollingInterval = setInterval(() => {
      if (!sessionRef.current || isScrollingRef.current) return;

      // Find all elements with data-page in viewport
      const allElements = document.querySelectorAll('[data-page]');
      const visiblePages: number[] = [];

      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Check if element is in viewport (with same -20px margin as IntersectionObserver)
        const isInViewport =
          rect.top >= -20 &&
          rect.bottom <= viewportHeight + 20 &&
          rect.left >= -20 &&
          rect.right <= viewportWidth + 20;

        if (isInViewport) {
          const pageAttr = el.getAttribute('data-page');
          if (pageAttr) {
            const pageNum = parseInt(pageAttr, 10);
            if (!isNaN(pageNum)) {
              visiblePages.push(pageNum);
            }
          }
        }
      });

      // Start dwell timers for visible pages that aren't already tracked or waiting
      visiblePages.forEach(pageNumber => {
        if (
          sessionRef.current &&
          !sessionRef.current.viewedPages.has(pageNumber) &&
          !dwellTimersRef.current.has(pageNumber)
        ) {
          // Safety cap check
          if (sessionRef.current.viewedPages.size >= MAX_PAGES_PER_SESSION) {
            return;
          }

          // Start dwell timer
          const timerId = window.setTimeout(() => {
            if (!sessionRef.current) return;

            sessionRef.current.viewedPages.add(pageNumber);
            dwellTimersRef.current.delete(pageNumber);
          }, DWELL_TIME);

          dwellTimersRef.current.set(pageNumber, timerId);
        }
      });
    }, 3000); // Check every 3 seconds

    return () => {
      clearInterval(pollingInterval);
    };
  }, [enabled, isLoggedIn]);

  // Handle page refresh/close using beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionRef.current && sessionRef.current.viewedPages.size > 0) {
        trackPages(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function for navigation (SPA routing)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Track on unmount ONLY if not already tracked
      if (sessionRef.current && !sessionRef.current.tracked && sessionRef.current.viewedPages.size > 0) {
        trackPages(true);
      }
    };
  }, [trackPages]);

  return {
    isTracking: isLoggedIn && enabled,
    viewedPageCount: sessionRef.current?.viewedPages.size || 0,
    lastSyncedCount: sessionRef.current?.lastSyncedCount || 0,
  };
};
