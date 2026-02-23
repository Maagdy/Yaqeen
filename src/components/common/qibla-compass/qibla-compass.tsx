import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MyLocation, Error as ErrorIcon } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import type {
  QiblaCompassProps,
  QiblaDirection,
  AccuracyLevel,
  CompassPhase,
} from "./qibla-compass.types";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const SMOOTH = 0.25;

interface DeviceOrientationExt extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}
interface DeviceOrientationStatic {
  requestPermission?: () => Promise<"granted" | "denied">;
}

function norm(deg: number) {
  return ((deg % 360) + 360) % 360;
}
function delta(prev: number, next: number) {
  return ((next - prev + 540) % 360) - 180;
}

function calcQibla(lat: number, lng: number): QiblaDirection {
  const r = (d: number) => (d * Math.PI) / 180;
  const φ1 = r(lat), λ1 = r(lng), φ2 = r(KAABA_LAT), λ2 = r(KAABA_LNG);
  const Δλ = λ2 - λ1;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const bearing = norm(Math.atan2(y, x) * (180 / Math.PI));
  const a = Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { angle: bearing, distance };
}

export function QiblaCompass({ className = "" }: QiblaCompassProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<CompassPhase>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [qiblaInfo, setQiblaInfo] = useState<QiblaDirection | null>(null);
  const [accuracy, setAccuracy] = useState<AccuracyLevel>("none");
  const [needsPermission, setNeedsPermission] = useState(false);

  const needleRef = useRef<HTMLDivElement>(null);
  const smoothedRef = useRef(0);
  const rotRef = useRef(0);
  const qiblaRef = useRef(0);
  const animRef = useRef(0);
  const headingRef = useRef<number | null>(null);
  const sensorActiveRef = useRef(false);

  // ── rAF animation loop ──────────────────────────────────────────────────
  const startAnim = useCallback(() => {
    const tick = () => {
      const h = headingRef.current;
      if (h !== null) {
        const d = delta(smoothedRef.current, h);
        smoothedRef.current += SMOOTH * d;
        const target = qiblaRef.current - smoothedRef.current;
        rotRef.current += delta(rotRef.current, target);
        if (needleRef.current) {
          needleRef.current.style.transform = `rotate(${rotRef.current}deg)`;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ── Sensor setup ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;

    const stopAnim = startAnim();
    const cleanups: (() => void)[] = [stopAnim];
    let absoluteFired = false;

    // 1) deviceorientationabsolute (Android — true-north referenced)
    const onAbsolute = (e: Event) => {
      const ev = e as DeviceOrientationEvent;
      if (ev.alpha === null) return;
      absoluteFired = true;
      headingRef.current = norm(360 - ev.alpha);
      if (!sensorActiveRef.current) {
        sensorActiveRef.current = true;
        setAccuracy("high");
      }
    };
    window.addEventListener("deviceorientationabsolute", onAbsolute as EventListener, true);
    cleanups.push(() => window.removeEventListener("deviceorientationabsolute", onAbsolute as EventListener, true));

    // 2) deviceorientation fallback (iOS webkitCompassHeading / Android alpha)
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (absoluteFired) return;
      const ext = e as DeviceOrientationExt;
      if (typeof ext.webkitCompassHeading === "number") {
        headingRef.current = ext.webkitCompassHeading;
        if (!sensorActiveRef.current) { sensorActiveRef.current = true; setAccuracy("medium"); }
      } else if (e.alpha !== null) {
        headingRef.current = norm(360 - e.alpha);
        if (!sensorActiveRef.current) { sensorActiveRef.current = true; setAccuracy("low"); }
      }
    };

    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationStatic;
    if (typeof DOE.requestPermission === "function") {
      setNeedsPermission(true); // iOS — need user gesture
    } else {
      window.addEventListener("deviceorientation", onOrientation, true);
      cleanups.push(() => window.removeEventListener("deviceorientation", onOrientation, true));
    }

    // If nothing fires in 3s → mark as no-compass
    const timer = setTimeout(() => {
      if (!sensorActiveRef.current) setAccuracy("none");
    }, 3000);
    cleanups.push(() => clearTimeout(timer));

    return () => { sensorActiveRef.current = false; cleanups.forEach((fn) => fn()); };
  }, [phase, startAnim]);

  // ── iOS compass permission (must come from user tap) ────────────────────
  const requestCompassPermission = useCallback(() => {
    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationStatic;
    if (typeof DOE.requestPermission !== "function") return;
    DOE.requestPermission()
      .then((r) => {
        if (r === "granted") {
          setNeedsPermission(false);
          const handler = (e: DeviceOrientationEvent) => {
            const ext = e as DeviceOrientationExt;
            if (typeof ext.webkitCompassHeading === "number") {
              headingRef.current = ext.webkitCompassHeading;
              if (!sensorActiveRef.current) { sensorActiveRef.current = true; setAccuracy("medium"); }
            }
          };
          window.addEventListener("deviceorientation", handler, true);
        }
      })
      .catch(() => { setAccuracy("none"); setNeedsPermission(false); });
  }, []);

  // ── Geolocation ─────────────────────────────────────────────────────────
  const requestLocation = useCallback(() => {
    setPhase("loading");
    setErrorMsg("");
    if (!navigator.geolocation) {
      setErrorMsg(t("prayer_times.qibla.geolocation_not_supported"));
      setPhase("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const info = calcQibla(coords.latitude, coords.longitude);
        qiblaRef.current = info.angle;
        rotRef.current = info.angle;
        setQiblaInfo(info);
        setPhase("active");
      },
      (err) => {
        let msg = t("prayer_times.qibla.location_error");
        if (err.code === err.PERMISSION_DENIED) msg = t("prayer_times.qibla.permission_denied");
        else if (err.code === err.POSITION_UNAVAILABLE) msg = t("prayer_times.qibla.position_unavailable");
        else if (err.code === err.TIMEOUT) msg = t("prayer_times.qibla.timeout");
        setErrorMsg(msg);
        setPhase("error");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [t]);

  useEffect(() => { requestLocation(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className={`bg-surface rounded-xl p-4 sm:p-6 border border-border ${className}`}>
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1 flex items-center justify-center gap-2">
          <span role="img" aria-label="Kaaba">🕋</span>
          {t("prayer_times.qibla.title")}
        </h2>
        <p className="text-text-secondary text-xs sm:text-sm">{t("prayer_times.qibla.subtitle")}</p>
      </div>

      {phase === "loading" && (
        <div className="flex flex-col items-center py-8 sm:py-12 gap-4">
          <CircularProgress size={48} />
          <p className="text-text-secondary text-sm">{t("prayer_times.qibla.getting_location")}</p>
        </div>
      )}

      {phase === "error" && (
        <div className="flex flex-col items-center py-8 sm:py-12 gap-4">
          <ErrorIcon className="text-red-500" style={{ fontSize: 48 }} />
          <p className="text-red-500 text-sm text-center max-w-xs">{errorMsg}</p>
          <button
            onClick={requestLocation}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <MyLocation fontSize="small" />
            {t("prayer_times.qibla.retry")}
          </button>
        </div>
      )}

      {phase === "active" && qiblaInfo && (
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          {/* ── Compass ─────────────────────────────────────────────── */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full border-[3px] border-primary/20 bg-background">
            {/* Static cardinal markers */}
            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-primary font-bold text-sm select-none">N</span>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-text-secondary font-semibold text-xs select-none">S</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary font-semibold text-xs select-none">E</span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-semibold text-xs select-none">W</span>

            {/* Fixed Kaaba icon at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 text-2xl sm:text-3xl select-none z-20">🕋</div>

            {/* Rotating needle */}
            <div
              ref={needleRef}
              className="absolute inset-0"
              style={{ transform: `rotate(${qiblaInfo.angle}deg)`, willChange: "transform" }}
            >
              {/* Arrow body (center → up) */}
              <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[3px] h-[36%] bg-primary rounded-full" />
              {/* Arrowhead */}
              <div
                className="absolute top-[8%] left-1/2 -translate-x-1/2"
                style={{
                  width: 0, height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "16px solid var(--color-primary)",
                }}
              />
              {/* Tail (center → down) */}
              <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[2px] h-[20%] bg-border rounded-full" />
            </div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white z-10" />
          </div>

          {/* iOS permission button */}
          {needsPermission && (
            <button
              onClick={requestCompassPermission}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            >
              {t("prayer_times.qibla.enable_compass")}
            </button>
          )}

          {/* Info cards */}
          <div className="w-full grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-background rounded-lg p-3 sm:p-4 border border-border text-center">
              <p className="text-text-secondary text-xs mb-1">{t("prayer_times.qibla.direction")}</p>
              <p className="text-text-primary text-lg sm:text-2xl font-bold">{Math.round(qiblaInfo.angle)}°</p>
            </div>
            <div className="bg-background rounded-lg p-3 sm:p-4 border border-border text-center">
              <p className="text-text-secondary text-xs mb-1">{t("prayer_times.qibla.distance")}</p>
              <p className="text-text-primary text-lg sm:text-2xl font-bold">{Math.round(qiblaInfo.distance).toLocaleString()} km</p>
            </div>
          </div>

          {/* Accuracy */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            accuracy === "high"   ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
            accuracy === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
            accuracy === "low"    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                                    "bg-border text-text-secondary"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              accuracy === "high" ? "bg-green-500 animate-pulse" :
              accuracy === "medium" ? "bg-yellow-500" :
              accuracy === "low" ? "bg-orange-500" : "bg-gray-400"
            }`} />
            {accuracy === "high"   ? t("prayer_times.qibla.sensor_high") :
             accuracy === "medium" ? t("prayer_times.qibla.sensor_medium") :
             accuracy === "low"    ? t("prayer_times.qibla.sensor_low") :
                                     t("prayer_times.qibla.sensor_none")}
          </div>

          <p className="text-text-secondary text-xs text-center max-w-xs">
            {accuracy === "none" ? t("prayer_times.qibla.instruction") : t("prayer_times.qibla.calibrate_tip")}
          </p>
        </div>
      )}
    </div>
  );
}
