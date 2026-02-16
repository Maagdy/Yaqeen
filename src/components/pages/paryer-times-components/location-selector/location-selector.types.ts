export interface LocationSelectorProps {
  city: string;
  country: string;
  onLocationChange: (city: string, country: string) => void;
  onGeolocationChange?: (latitude: number, longitude: number) => void;
}
