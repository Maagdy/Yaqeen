import { RecitersHeader } from "../reciter-header";
import { ReciterSearchBar } from "../reciter-search-bar";
import { ReciterSortButton } from "../reciter-sort-button";
import type { ReciterControlsProps } from "./reciter-controls.types";

export const ReciterControls: React.FC<ReciterControlsProps> = ({
  totalCount,
  searchQuery,
  onSearchChange,
  onSearchClear,
  sortAscending,
  onSortToggle,
}) => {
  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Left: Title & Meta */}
      <RecitersHeader totalCount={totalCount} />

      {/* Right: Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        <ReciterSearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
        />
        <ReciterSortButton
          sortAscending={sortAscending}
          onToggle={onSortToggle}
        />
      </div>
    </div>
  );
};
