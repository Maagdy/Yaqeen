export interface ReciterControlsProps {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  sortAscending: boolean;
  onSortToggle: () => void;
}
