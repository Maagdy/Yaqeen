import SearchIcon from "@mui/icons-material/Search";
import type { HomeSearchBarProps } from "./home-search-bar.types";

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  onSearch,
  onChange,
  value,
  className = "",
  placeholder = "Search...",
}) => {
  return (
    <div
      className={`relative flex items-center pt-2 w-full max-w-2xl mx-auto ${className}`}
    >
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-text-secondary">
          <SearchIcon className="w-5 h-5 text-primary-muted group-focus-within:text-primary transition-colors duration-200" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch(e.currentTarget.value);
            }
          }}
          className="w-full py-4 pl-12 pr-4 text-lg transition-all duration-200 border rounded-2xl outline-none bg-surface border-border text-text-primary placeholder:text-text-secondary focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm hover:shadow-md focus:shadow-lg"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            onClick={() => {
              if (value) onSearch(value);
            }}
            className="p-2 mr-1 transition-colors rounded-xl hover:bg-background/50 text-primary opacity-0 group-focus-within:opacity-100"
          >
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeSearchBar;
