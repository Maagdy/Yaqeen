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
            <button
              key={m.id}
              onClick={() => onMoshafSelect(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer ${
                selectedMoshafIndex === index
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-surface text-text-secondary border-border hover:border-primary hover:text-primary"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
