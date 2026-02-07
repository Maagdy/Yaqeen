import { useAudio } from "@/hooks/useAudio";
import { Play, Pause, Radio as RadioIcon } from "lucide-react";
import { cn } from "@/lib/cn";

import type { RadioCardProps } from "./radio-card.types";
import { useTranslation } from "react-i18next";

export function RadioCard({ radio }: RadioCardProps) {
  const { t } = useTranslation();
  const { play, toggle, isPlaying, currentAudio } = useAudio();

  const isCurrent = currentAudio === radio.url;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrent) {
      toggle();
    } else {
      play(radio.url);
    }
  };

  return (
    <div
      onClick={handlePlay}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md",
        isCurrent
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/50",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full transition-colors shadow-sm",
            isCurrent
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
          )}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <h3
            className={cn(
              "font-semibold text-sm sm:text-base transition-colors line-clamp-1",
              isCurrent
                ? "text-primary"
                : "text-foreground group-hover:text-primary",
            )}
          >
            {radio.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RadioIcon className="w-3 h-3" />
            <span>{t("radio.station")}</span>
          </div>
        </div>
      </div>

      {/* Visualizer bars */}
      {isCurrentlyPlaying && (
        <div className="flex items-end gap-0.5 h-5 ml-auto pl-2">
          <span
            className="w-1 bg-primary/60 rounded-t-sm animate-[pulse_0.6s_ease-in-out_infinite]"
            style={{ height: "40%" }}
          />
          <span
            className="w-1 bg-primary/80 rounded-t-sm animate-[pulse_0.8s_ease-in-out_infinite]"
            style={{ height: "80%" }}
          />
          <span
            className="w-1 bg-primary/60 rounded-t-sm animate-[pulse_1.1s_ease-in-out_infinite]"
            style={{ height: "50%" }}
          />
          <span
            className="w-1 bg-primary/40 rounded-t-sm animate-[pulse_0.9s_ease-in-out_infinite]"
            style={{ height: "30%" }}
          />
        </div>
      )}
    </div>
  );
}
