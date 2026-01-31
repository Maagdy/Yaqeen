export interface HomeSearchBarProps {
  onSearch: (query: string) => void;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
  placeholder?: string;
}
