export interface QiblaCompassProps {
  className?: string;
}

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface QiblaDirection {
  angle: number;
  distance: number;
}

export type AccuracyLevel = "high" | "medium" | "low" | "none";
export type CompassPhase = "loading" | "error" | "active";
