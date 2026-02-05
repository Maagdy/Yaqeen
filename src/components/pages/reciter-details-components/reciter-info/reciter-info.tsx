import { MushafCard } from "../../../common";
import type { ReciterInfoProps } from "./reciter-info.types";

export const ReciterInfo: React.FC<ReciterInfoProps> = ({
  reciter,
  selectedMoshafIndex,
  onMoshafSelect,
}) => {
  const selectedMoshaf = reciter?.moshaf[selectedMoshafIndex];

  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">{reciter?.name}</h1>
        <p className="text-text-secondary text-base lg:text-lg">
          {selectedMoshaf?.name}
        </p>
      </div>

      {/* Moshaf Selection Chips */}
      {reciter?.moshaf && reciter.moshaf.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {reciter.moshaf.map((m, index) => (
            <MushafCard
              key={m.id}
              name={m.name}
              active={selectedMoshafIndex === index}
              onClick={() => onMoshafSelect(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
