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

// ── Constants ────────────────────────────────────────────────────────────────
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
/** How aggressively to smooth sensor noise (0 = frozen, 1 = raw). */
const SMOOTH = 0.18;

// ── Sensor type augmentations ────────────────────────────────────────────────
interface DeviceOrientationEventExtended extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface DeviceOrientationEventStatic {
  requestPermission?: () => Promise<"granted" | "denied">;
}

/** Minimal AbsoluteOrientationSensor interface (not in TS lib yet). */
interface AbsOrientSensor extends EventTarget {
  quaternion: [number, number, number, number] | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    AbsoluteOrientationSensor?: new (opts?: {
      frequency?: number;
      referenceFrame?: string;
    }) => AbsOrientSensor;
  }
}

// ── Pure math helpers ────────────────────────────────────────────────────────
function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Returns the signed shortest angular difference from `prev` to `next`,
 * so we always rotate the shortest way (no 359° → 0° full spin).
 */
function shortestDelta(prev: number, next: number): number {
  return ((next - prev + 540) % 360) - 180;
}

/** Quaternion [x,y,z,w] → compass heading (degrees, 0=north, CW). */
function quaternionToHeading(q: [number, number, number, number]): number {
  const [qx, qy, qz, qw] = q;
  // Yaw around the Z-axis of the Earth frame
  const sinYaw = 2 * (qw * qz + qx * qy);
  const cosYaw = 1 - 2 * (qy * qy + qz * qz);
  const yaw = Math.atan2(sinYaw, cosYaw) * (180 / Math.PI);
  return normalize(yaw);
}

/** Great-circle bearing from user to Kaaba (degrees). */
function calcQibla(lat: number, lng: number): QiblaDirection {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const φ1 = toRad(lat),
    λ1 = toRad(lng);
  const φ2 = toRad(KAABA_LAT),
    λ2 = toRad(KAABA_LNG);
  const Δλ = λ2 - λ1;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const bearing = normalize(Math.atan2(y, x) * (180 / Math.PI));

  const a =
    Math.sin((φ2 - φ1) / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return { angle: bearing, distance };
}

// ── SVG tick-mark data ───────────────────────────────────────────────────────
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const angle = i * 5;
  const isCardinal = angle % 90 === 0;
  const isMajor = angle % 30 === 0;
  const isSemi = angle % 15 === 0;
  const outer = 128;
  const inner = isCardinal ? 111 : isMajor ? 117 : isSemi ? 121 : 124;
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x1: outer * Math.cos(rad),
    y1: outer * Math.sin(rad),
    x2: inner * Math.cos(rad),
    y2: inner * Math.sin(rad),
    isCardinal,
    isMajor,
  };
});

// ── Component ────────────────────────────────────────────────────────────────
export function QiblaCompass({ className = "" }: QiblaCompassProps) {
  const { t } = useTranslation();

  // React state (coarse, infrequent)
  const [phase, setPhase] = useState<CompassPhase>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [qiblaInfo, setQiblaInfo] = useState<QiblaDirection | null>(null);
  const [accuracy, setAccuracy] = useState<AccuracyLevel>("none");

  // Refs for high-frequency sensor data (avoids re-renders)
  const compassRef = useRef<SVGGElement>(null); // rotating compass disc
  const needleRef = useRef<SVGGElement>(null); // rotating Qibla needle
  const smoothedRef = useRef(0); // smoothed device heading
  const compassRotRef = useRef(0); // continuous compass rotation (no jumps)
  const needleRotRef = useRef(0); // continuous needle rotation
  const qiblaAngleRef = useRef(0); // qibla bearing (set once per location)
  const animFrameRef = useRef<number>(0);
  const pendingHeadingRef = useRef<number | null>(null);

  // ── Animation loop (decoupled from sensor events) ──────────────────────────
  const startAnimLoop = useCallback(() => {
    const tick = () => {
      const raw = pendingHeadingRef.current;
      if (raw !== null) {
        // Low-pass exponential moving average
        const delta = shortestDelta(smoothedRef.current, raw);
        smoothedRef.current = smoothedRef.current + SMOOTH * delta;

        // Compass disc: rotates opposite to device heading so N stays on North
        const cTarget = -smoothedRef.current;
        compassRotRef.current += shortestDelta(compassRotRef.current, cTarget);

        // Qibla needle: fixed in world space, corrected for device rotation
        const nTarget = qiblaAngleRef.current - smoothedRef.current;
        needleRotRef.current += shortestDelta(needleRotRef.current, nTarget);

        // Direct SVG DOM updates (zero React overhead)
        compassRef.current?.setAttribute(
          "transform",
          `rotate(${compassRotRef.current})`
        );
        needleRef.current?.setAttribute(
          "transform",
          `rotate(${needleRotRef.current})`
        );
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ── Sensor strategy 1: AbsoluteOrientationSensor ─────────────────────────
  const tryAbsoluteSensor = useCallback((): (() => void) | null => {
    if (!window.AbsoluteOrientationSensor) return null;
    try {
      const sensor = new window.AbsoluteOrientationSensor({ frequency: 60 });
      const onReading = () => {
        if (sensor.quaternion) {
          pendingHeadingRef.current = quaternionToHeading(sensor.quaternion);
        }
      };
      const onError = () => {
        /* will fall through to other sensors */
      };
      sensor.addEventListener("reading", onReading);
      sensor.addEventListener("error", onError);

      const tryStart = () => {
        try {
          sensor.start();
          setAccuracy("high");
        } catch {
          /* not available */
        }
      };

      // Chrome 67+: request permissions first
      const perms = ["accelerometer", "magnetometer", "gyroscope"];
      if (navigator.permissions) {
        Promise.all(perms.map((n) => navigator.permissions.query({ name: n as PermissionName })))
          .then((results) => {
            if (results.some((r) => r.state === "denied")) return;
            tryStart();
          })
          .catch(() => tryStart());
      } else {
        tryStart();
      }

      return () => {
        sensor.removeEventListener("reading", onReading);
        sensor.removeEventListener("error", onError);
        try {
          sensor.stop();
        } catch {
          /* ignore */
        }
      };
    } catch {
      return null;
    }
  }, []);

  // ── Sensor strategy 2: deviceorientationabsolute ──────────────────────────
  const tryAbsoluteEvent = useCallback((): (() => void) => {
    const handler = (e: Event) => {
      const ev = e as DeviceOrientationEvent;
      if (!ev.absolute || ev.alpha === null) return;
      pendingHeadingRef.current = normalize(360 - ev.alpha);
      setAccuracy((prev) => (prev === "high" ? "high" : "medium"));
    };
    window.addEventListener(
      "deviceorientationabsolute",
      handler as EventListener,
      true
    );
    return () =>
      window.removeEventListener(
        "deviceorientationabsolute",
        handler as EventListener,
        true
      );
  }, []);

  // ── Sensor strategy 3: deviceorientation (iOS webkit / Android alpha) ──────
  const tryRelativeEvent = useCallback((): (() => void) => {
    const handler = (e: DeviceOrientationEvent) => {
      const ext = e as DeviceOrientationEventExtended;
      if (
        typeof ext.webkitCompassHeading === "number" &&
        ext.webkitCompassHeading !== null
      ) {
        // iOS – already compass-referenced
        pendingHeadingRef.current = ext.webkitCompassHeading;
        setAccuracy((prev) =>
          prev === "high" || prev === "medium" ? prev : "medium"
        );
      } else if (e.alpha !== null) {
        pendingHeadingRef.current = normalize(360 - e.alpha);
        setAccuracy((prev) => (prev !== "none" ? prev : "low"));
      }
    };

    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventStatic;
    if (typeof DOE.requestPermission === "function") {
      // iOS 13+ — must call from user gesture; we trigger on location grant success
      DOE.requestPermission()
        .then((r) => {
          if (r === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          }
        })
        .catch(() => {
          /* compass unavailable on this iOS device */
        });
    } else {
      window.addEventListener("deviceorientation", handler, true);
    }

    return () => window.removeEventListener("deviceorientation", handler, true);
  }, []);

  // ── Geolocation ──────────────────────────────────────────────────────────
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
        qiblaAngleRef.current = info.angle;

        // Seed the needle at static angle (before any compass data)
        needleRotRef.current = info.angle;
        needleRef.current?.setAttribute("transform", `rotate(${info.angle})`);

        setQiblaInfo(info);
        setPhase("active");
      },
      (err) => {
        let msg = t("prayer_times.qibla.location_error");
        if (err.code === err.PERMISSION_DENIED)
          msg = t("prayer_times.qibla.permission_denied");
        else if (err.code === err.POSITION_UNAVAILABLE)
          msg = t("prayer_times.qibla.position_unavailable");
        else if (err.code === err.TIMEOUT)
          msg = t("prayer_times.qibla.timeout");
        setErrorMsg(msg);
        setPhase("error");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [t]);

  // ── Lifecycle ────────────────────────────────────────────────────────────
  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "active") return;

    const stopAnim = startAnimLoop();
    const cleanups: Array<() => void> = [stopAnim];

    const sensorCleanup = tryAbsoluteSensor();
    if (sensorCleanup) cleanups.push(sensorCleanup);

    cleanups.push(tryAbsoluteEvent());
    cleanups.push(tryRelativeEvent());

    return () => cleanups.forEach((fn) => fn());
  }, [phase, startAnimLoop, tryAbsoluteSensor, tryAbsoluteEvent, tryRelativeEvent]);

  // ── Accuracy badge ────────────────────────────────────────────────────────
  const accuracyBadge: Record<
    AccuracyLevel,
    { label: string; color: string }
  > = {
    high: {
      label: t("prayer_times.qibla.sensor_high"),
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    medium: {
      label: t("prayer_times.qibla.sensor_medium"),
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    low: {
      label: t("prayer_times.qibla.sensor_low"),
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    },
    none: {
      label: t("prayer_times.qibla.sensor_none"),
      color: "bg-border text-text-secondary",
    },
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`bg-surface rounded-xl p-6 border border-border ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <span className="text-2xl" role="img" aria-label="Kaaba">🕋</span>
          {t("prayer_times.qibla.title")}
        </h2>
        <p className="text-text-secondary text-sm">
          {t("prayer_times.qibla.subtitle")}
        </p>
      </div>

      {/* Loading */}
      {phase === "loading" && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <CircularProgress size={48} />
          <p className="text-text-secondary text-sm">
            {t("prayer_times.qibla.getting_location")}
          </p>
        </div>
      )}

      {/* Error */}
      {phase === "error" && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
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

      {/* Active compass */}
      {phase === "active" && qiblaInfo && (
        <div className="flex flex-col items-center gap-6">
          {/* ── SVG Compass ─────────────────────────────────────────────── */}
          <svg
            viewBox="-140 -140 280 280"
            className="w-72 h-72 md:w-80 md:h-80 select-none"
            aria-label={t("prayer_times.qibla.title")}
          >
            <defs>
              <radialGradient id="qc-disc-grad" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  style={{ stopColor: "var(--color-surface)", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{
                    stopColor: "var(--color-background)",
                    stopOpacity: 1,
                  }}
                />
              </radialGradient>
              <radialGradient id="qc-glow" cx="50%" cy="30%" r="60%">
                <stop
                  offset="0%"
                  style={{
                    stopColor: "var(--color-primary)",
                    stopOpacity: 0.12,
                  }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "transparent", stopOpacity: 0 }}
                />
              </radialGradient>
            </defs>

            {/* Outer decorative rings */}
            <circle
              r="138"
              style={{
                fill: "none",
                stroke: "var(--color-primary)",
                strokeOpacity: 0.25,
                strokeWidth: 3,
              }}
            />
            <circle
              r="133"
              style={{
                fill: "none",
                stroke: "var(--color-border)",
                strokeOpacity: 0.6,
                strokeWidth: 0.8,
              }}
            />

            {/* ── Rotating compass disc ──────────────────────────────────── */}
            <g ref={compassRef}>
              {/* Disc background */}
              <circle r="129" style={{ fill: "url(#qc-disc-grad)" }} />
              {/* Subtle glow overlay */}
              <circle r="129" style={{ fill: "url(#qc-glow)" }} />
              {/* Border ring on disc */}
              <circle
                r="129"
                style={{
                  fill: "none",
                  stroke: "var(--color-border)",
                  strokeOpacity: 0.4,
                  strokeWidth: 1,
                }}
              />

              {/* Tick marks */}
              {TICKS.map(({ x1, y1, x2, y2, isCardinal, isMajor }, i) => (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  style={{
                    stroke: isCardinal
                      ? "var(--color-primary)"
                      : isMajor
                        ? "var(--color-textSecondary)"
                        : "var(--color-border)",
                    strokeOpacity: isCardinal ? 0.9 : isMajor ? 0.7 : 0.5,
                    strokeWidth: isCardinal ? 2.5 : isMajor ? 1.2 : 0.7,
                    strokeLinecap: "round",
                  }}
                />
              ))}

              {/* Cardinal labels */}
              <text
                x="0"
                y="-95"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: "var(--color-primary)",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                N
              </text>
              <text
                x="0"
                y="100"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: "var(--color-textSecondary)",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                S
              </text>
              <text
                x="100"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: "var(--color-textSecondary)",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                E
              </text>
              <text
                x="-100"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: "var(--color-textSecondary)",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                W
              </text>

              {/* Intercardinal labels (smaller) */}
              {(
                [
                  [70, -70, "NE"],
                  [70, 70, "SE"],
                  [-70, 70, "SW"],
                  [-70, -70, "NW"],
                ] as [number, number, string][]
              ).map(([x, y, label]) => (
                <text
                  key={label}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fill: "var(--color-textSecondary)",
                    fontSize: 8,
                    opacity: 0.7,
                  }}
                >
                  {label}
                </text>
              ))}

              {/* North triangle marker */}
              <polygon
                points="0,-86 -4.5,-76 4.5,-76"
                style={{ fill: "var(--color-primary)", opacity: 0.9 }}
              />
            </g>

            {/* ── Qibla needle (fixed in world space) ─────────────────────── */}
            <g ref={needleRef}>
              {/* Needle shadow for depth */}
              <line
                x1="0"
                y1="18"
                x2="0"
                y2="-104"
                style={{
                  stroke: "rgba(0,0,0,0.15)",
                  strokeWidth: 5,
                  strokeLinecap: "round",
                }}
              />
              {/* Main needle body — two-tone: upper primary, lower muted */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-104"
                style={{
                  stroke: "var(--color-primary)",
                  strokeWidth: 3,
                  strokeLinecap: "round",
                }}
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="18"
                style={{
                  stroke: "var(--color-border)",
                  strokeWidth: 3,
                  strokeLinecap: "round",
                }}
              />
              {/* Arrowhead */}
              <polygon
                points="0,-116 -6,-100 6,-100"
                style={{ fill: "var(--color-primary)" }}
              />
              {/* Kaaba icon at tip */}
              <text
                x="0"
                y="-124"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 20 }}
              >
                🕋
              </text>
            </g>

            {/* Center pivot */}
            <circle
              r="8"
              style={{ fill: "var(--color-primary)", opacity: 0.9 }}
            />
            <circle r="3.5" style={{ fill: "white", opacity: 0.85 }} />
          </svg>

          {/* ── Info cards ──────────────────────────────────────────────────── */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-background rounded-lg p-4 border border-border text-center">
              <p className="text-text-secondary text-xs mb-1">
                {t("prayer_times.qibla.direction")}
              </p>
              <p className="text-text-primary text-2xl font-bold">
                {Math.round(qiblaInfo.angle)}°
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border text-center">
              <p className="text-text-secondary text-xs mb-1">
                {t("prayer_times.qibla.distance")}
              </p>
              <p className="text-text-primary text-2xl font-bold">
                {Math.round(qiblaInfo.distance).toLocaleString()} km
              </p>
            </div>
          </div>

          {/* ── Accuracy badge ──────────────────────────────────────────────── */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${accuracyBadge[accuracy].color}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                accuracy === "high"
                  ? "bg-green-500 animate-pulse"
                  : accuracy === "medium"
                    ? "bg-yellow-500"
                    : accuracy === "low"
                      ? "bg-orange-500"
                      : "bg-gray-400"
              }`}
            />
            {accuracyBadge[accuracy].label}
          </div>

          {/* ── Calibration tip ─────────────────────────────────────────────── */}
          <p className="text-text-secondary text-xs text-center max-w-xs">
            {accuracy === "none"
              ? t("prayer_times.qibla.instruction")
              : t("prayer_times.qibla.calibrate_tip")}
          </p>
        </div>
      )}
    </div>
  );
}
