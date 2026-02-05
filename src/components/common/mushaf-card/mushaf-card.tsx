import type { MushafCardProps } from "./mushaf-card.types";

export const MushafCard: React.FC<MushafCardProps> = ({
  name,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-2xl border transition-all text-left
      ${
        active
          ? "bg-primary text-white border-primary shadow-lg"
          : "bg-surface border-border hover:border-primary"
      }
    `}
  >
    <p className="font-semibold">{name}</p>
  </button>
);
