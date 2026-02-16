import { useEffect, useRef, useState } from 'react';
import type { Ayah } from '@/api/domains/chapter/chapter.types';

interface VisibilityOptions {
  threshold?: number; // % of element visible (default: 0.5 = 50%)
  minVisibleDuration?: number; // milliseconds (default: 3000 = 3 seconds)
}

/**
 * Track which ayahs are actually read (visible for minimum duration)
 * More accurate than unmount tracking - only counts ayahs user actually saw
 */
export const useAyahVisibilityTracker = (
  ayahs: Ayah[],
  options: VisibilityOptions = {}
) => {
  const { threshold = 0.5, minVisibleDuration = 3000 } = options;

  const [visibleAyahs, setVisibleAyahs] = useState<Set<number>>(new Set());
  const visibilityTimers = useRef<Map<number, number>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ayahNumber = parseInt(entry.target.getAttribute('data-ayah-number') || '0');

          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            // Ayah became visible - start timer
            if (!visibilityTimers.current.has(ayahNumber)) {
              const timer = setTimeout(() => {
                // Ayah was visible for required duration - mark as read
                setVisibleAyahs((prev) => new Set(prev).add(ayahNumber));
              }, minVisibleDuration);

              visibilityTimers.current.set(ayahNumber, timer);
            }
          } else {
            // Ayah left viewport - clear timer
            const timer = visibilityTimers.current.get(ayahNumber);
            if (timer) {
              clearTimeout(timer);
              visibilityTimers.current.delete(ayahNumber);
            }
          }
        });
      },
      { threshold }
    );

    return () => {
      // Cleanup timers and observer
      visibilityTimers.current.forEach((timer) => clearTimeout(timer));
      visibilityTimers.current.clear();
      observerRef.current?.disconnect();
    };
  }, [threshold, minVisibleDuration]);

  // Observe ayah elements when they mount
  const observeAyah = (element: HTMLElement | null, ayahNumber: number) => {
    if (element && observerRef.current) {
      element.setAttribute('data-ayah-number', ayahNumber.toString());
      observerRef.current.observe(element);
    }
  };

  // Get unique pages from visible ayahs
  const getVisiblePages = (): number => {
    const pages = new Set<number>();
    ayahs.forEach((ayah) => {
      if (visibleAyahs.has(ayah.number)) {
        pages.add(ayah.page);
      }
    });
    return pages.size;
  };

  return {
    observeAyah,
    visibleAyahs,
    visibleAyahCount: visibleAyahs.size,
    visiblePageCount: getVisiblePages(),
  };
};
