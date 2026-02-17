import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Navigation, MyLocation, Error as ErrorIcon } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import type { QiblaCompassProps, GeolocationCoordinates, QiblaDirection } from "./qibla-compass.types";

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

// Extend DeviceOrientationEvent for iOS webkitCompassHeading
interface DeviceOrientationEventWithWebkit extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

// Extend DeviceOrientationEvent constructor for iOS requestPermission
interface DeviceOrientationEventStatic {
  requestPermission?: () => Promise<"granted" | "denied">;
}

export function QiblaCompass({ className = "" }: QiblaCompassProps) {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<QiblaDirection | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Calculate Qibla direction using Haversine formula
  const calculateQiblaDirection = useCallback((lat: number, lng: number): QiblaDirection => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRad(lat);
    const lng1 = toRad(lng);
    const lat2 = toRad(KAABA_LAT);
    const lng2 = toRad(KAABA_LNG);

    const dLng = lng2 - lng1;

    // Calculate bearing (direction)
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    let bearing = toDeg(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    // Calculate distance
    const dLat = lat2 - lat1;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // Earth radius in km

    return { angle: bearing, distance };
  }, []);

  // Request location permission and get coordinates
  const requestLocation = useCallback(() => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError(t("prayer_times.qibla.geolocation_not_supported"));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: GeolocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(coords);
        const direction = calculateQiblaDirection(coords.latitude, coords.longitude);
        setQiblaDirection(direction);
        setLoading(false);
      },
      (err) => {
        let errorMessage = t("prayer_times.qibla.location_error");
        if (err.code === err.PERMISSION_DENIED) {
          errorMessage = t("prayer_times.qibla.permission_denied");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMessage = t("prayer_times.qibla.position_unavailable");
        } else if (err.code === err.TIMEOUT) {
          errorMessage = t("prayer_times.qibla.timeout");
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [t, calculateQiblaDirection]);

  // Handle device orientation for compass rotation
  useEffect(() => {
    if (!userLocation || !qiblaDirection) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading = 0;
      const webkitEvent = event as DeviceOrientationEventWithWebkit;

      if (event.alpha !== null) {
        // iOS uses webkitCompassHeading, Android uses alpha
        if (typeof webkitEvent.webkitCompassHeading !== "undefined") {
          heading = webkitEvent.webkitCompassHeading;
        } else if (event.alpha !== null) {
          heading = 360 - event.alpha;
        }
      }

      setDeviceHeading(heading);
    };

    // Request permission for iOS 13+
    const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as DeviceOrientationEventStatic;
    if (typeof DeviceOrientationEventTyped.requestPermission === "function") {
      DeviceOrientationEventTyped
        .requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
          } else {
            setError(t("prayer_times.qibla.compass_permission_denied"));
          }
        })
        .catch(() => {
          setError(t("prayer_times.qibla.compass_not_supported"));
        });
    } else {
      // Non-iOS devices
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [userLocation, qiblaDirection, t]);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const qiblaAngle = qiblaDirection ? qiblaDirection.angle - deviceHeading : 0;

  return (
    <div className={`bg-surface rounded-xl p-6 border border-border ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🕋</span>
          {t("prayer_times.qibla.title")}
        </h2>
        <p className="text-text-secondary text-sm">
          {t("prayer_times.qibla.subtitle")}
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <CircularProgress size={48} className="mb-4" />
          <p className="text-text-secondary text-sm">
            {t("prayer_times.qibla.getting_location")}
          </p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12">
          <ErrorIcon className="text-red-500 mb-4" style={{ fontSize: 48 }} />
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          <button
            onClick={requestLocation}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <MyLocation fontSize="small" />
            {t("prayer_times.qibla.retry")}
          </button>
        </div>
      )}

      {!loading && !error && userLocation && qiblaDirection && (
        <div className="flex flex-col items-center">
          {/* Compass Container */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
            {/* Compass Background Circle */}
            <div className="absolute inset-0 rounded-full border-4 border-border bg-linear-to-br from-surface to-background shadow-lg">
              {/* Cardinal Directions */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-text-primary font-bold text-sm">
                N
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-text-secondary font-bold text-sm">
                S
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">
                W
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">
                E
              </div>
            </div>

            {/* Kaaba Icon at Top (North) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="text-5xl md:text-6xl drop-shadow-lg">🕋</div>
            </div>

            {/* Rotating Arrow in Center - Points to Kaaba */}
            <div
              className="absolute top-1/2 left-1/2 transition-transform duration-300 ease-out"
              style={{
                transform: `translate(-50%, -50%) rotate(${qiblaAngle}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <Navigation
                className="text-primary drop-shadow-lg"
                style={{ fontSize: 100, transform: 'rotate(0deg)' }}
              />
            </div>

            {/* Degree Markers */}
            <div className="absolute inset-0">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <div
                  key={deg}
                  className="absolute top-1/2 left-1/2 w-1 h-2 bg-border origin-bottom"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${deg}deg) translateY(-${
                      deg % 90 === 0 ? "120" : "115"
                    }px)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Information Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-text-secondary text-xs mb-1">
                {t("prayer_times.qibla.direction")}
              </p>
              <p className="text-text-primary text-2xl font-bold">
                {Math.round(qiblaDirection.angle)}°
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="text-text-secondary text-xs mb-1">
                {t("prayer_times.qibla.distance")}
              </p>
              <p className="text-text-primary text-2xl font-bold">
                {Math.round(qiblaDirection.distance)} km
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-xs">
              {t("prayer_times.qibla.instruction")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
