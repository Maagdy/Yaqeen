import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { MyLocation } from "@mui/icons-material";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { LocationSelectorProps } from "./location-selector.types";
import { IconButton } from "@/components/common";

const POPULAR_CITIES = [
  {
    city: "Cairo",
    country: "Egypt",
    cityKey: "prayer_times.cities.cairo" as const,
    countryKey: "prayer_times.countries.egypt" as const,
  },
  {
    city: "Mecca",
    country: "Saudi Arabia",
    cityKey: "prayer_times.cities.mecca" as const,
    countryKey: "prayer_times.countries.saudi_arabia" as const,
  },
  {
    city: "Medina",
    country: "Saudi Arabia",
    cityKey: "prayer_times.cities.medina" as const,
    countryKey: "prayer_times.countries.saudi_arabia" as const,
  },
  {
    city: "Riyadh",
    country: "Saudi Arabia",
    cityKey: "prayer_times.cities.riyadh" as const,
    countryKey: "prayer_times.countries.saudi_arabia" as const,
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    cityKey: "prayer_times.cities.dubai" as const,
    countryKey: "prayer_times.countries.uae" as const,
  },
  {
    city: "Kuwait City",
    country: "Kuwait",
    cityKey: "prayer_times.cities.kuwait_city" as const,
    countryKey: "prayer_times.countries.kuwait" as const,
  },
  {
    city: "Amman",
    country: "Jordan",
    cityKey: "prayer_times.cities.amman" as const,
    countryKey: "prayer_times.countries.jordan" as const,
  },
  {
    city: "Beirut",
    country: "Lebanon",
    cityKey: "prayer_times.cities.beirut" as const,
    countryKey: "prayer_times.countries.lebanon" as const,
  },
  {
    city: "Damascus",
    country: "Syria",
    cityKey: "prayer_times.cities.damascus" as const,
    countryKey: "prayer_times.countries.syria" as const,
  },
  {
    city: "Baghdad",
    country: "Iraq",
    cityKey: "prayer_times.cities.baghdad" as const,
    countryKey: "prayer_times.countries.iraq" as const,
  },
  {
    city: "Doha",
    country: "Qatar",
    cityKey: "prayer_times.cities.doha" as const,
    countryKey: "prayer_times.countries.qatar" as const,
  },
  {
    city: "Manama",
    country: "Bahrain",
    cityKey: "prayer_times.cities.manama" as const,
    countryKey: "prayer_times.countries.bahrain" as const,
  },
  {
    city: "Muscat",
    country: "Oman",
    cityKey: "prayer_times.cities.muscat" as const,
    countryKey: "prayer_times.countries.oman" as const,
  },
  {
    city: "Istanbul",
    country: "Turkey",
    cityKey: "prayer_times.cities.istanbul" as const,
    countryKey: "prayer_times.countries.turkey" as const,
  },
  {
    city: "London",
    country: "United Kingdom",
    cityKey: "prayer_times.cities.london" as const,
    countryKey: "prayer_times.countries.uk" as const,
  },
  {
    city: "New York",
    country: "United States",
    cityKey: "prayer_times.cities.new_york" as const,
    countryKey: "prayer_times.countries.usa" as const,
  },
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  city,
  country,
  onLocationChange,
  onGeolocationChange,
}) => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState(
    `${city}, ${country}`,
  );
  const { loading, getCurrentPosition, error } = useGeolocation();

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    const selectedCity = POPULAR_CITIES.find(
      (loc) => `${loc.city}, ${loc.country}` === value,
    );
    if (selectedCity) {
      onLocationChange(selectedCity.city, selectedCity.country);
    }
  };

  const handleUseMyLocation = async () => {
    try {
      const position = await getCurrentPosition();
      if (position && onGeolocationChange) {
        onGeolocationChange(position.latitude, position.longitude);
      }
    } catch (err) {
      console.error("Error getting location:", err);
    }
  };

  const getDisplayName = (
    cityKey: (typeof POPULAR_CITIES)[number]["cityKey"],
    countryKey: (typeof POPULAR_CITIES)[number]["countryKey"],
  ) => {
    const cityName = t(cityKey);
    const countryName = t(countryKey);
    return `${cityName}, ${countryName}`;
  };

  return (
    <div className="bg-surface rounded-xl p-4 md:p-6 border border-border">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <FormControl fullWidth size="medium">
          <InputLabel id="location-select-label">
            {t("prayer_times.select_location")}
          </InputLabel>
          <Select
            labelId="location-select-label"
            id="location-select"
            value={selectedLocation}
            label={t("prayer_times.select_location")}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="bg-background"
          >
            {POPULAR_CITIES.map((loc) => (
              <MenuItem
                key={`${loc.city}-${loc.country}`}
                value={`${loc.city}, ${loc.country}`}
              >
                {getDisplayName(loc.cityKey, loc.countryKey)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          icon={loading ? <CircularProgress size={20} /> : <MyLocation />}
          size="md"
          variant="primary"
          label={loading ? t("common.loading") : t("prayer_times.use_location")}
          className="ml-2"
          onClick={handleUseMyLocation}
          disabled={loading}
        />
      </div>

      <div className="mt-4 text-sm text-text-secondary">
        <p>
          {t("prayer_times.current_location")}:{" "}
          <span className="font-semibold text-primary">
            {(() => {
              const currentCity = POPULAR_CITIES.find(
                (loc) => loc.city === city && loc.country === country,
              );
              return currentCity
                ? getDisplayName(currentCity.cityKey, currentCity.countryKey)
                : `${city}, ${country}`;
            })()}
          </span>
        </p>
        {error && (
          <p className="mt-2 text-red-600 dark:text-red-400 text-xs">{error}</p>
        )}
      </div>
    </div>
  );
};
