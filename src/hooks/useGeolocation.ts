import { useState, useCallback } from "react";

interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
  getCurrentPosition: () => Promise<GeolocationPosition | null>;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(async (): Promise<GeolocationPosition | null> => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            },
            (err) => {
              reject(err);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }
      );

      setPosition(position);
      setLoading(false);
      return position;
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable");
            break;
          case err.TIMEOUT:
            setError("Location request timed out");
            break;
          default:
            setError("An unknown error occurred");
        }
      } else {
        setError("Failed to get location");
      }
      setLoading(false);
      return null;
    }
  }, []);

  return { position, error, loading, getCurrentPosition };
};
