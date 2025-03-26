import { useState } from "react";
import { Search } from "lucide-react";
var searchTimeout: NodeJS.Timeout;

type CustomSearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

const CustomSearch = ({ search, setSearch }: CustomSearchProps) => {
  const [localSearch, setLocalSearch] = useState(search || "");
  return (
    <div className="flex items-center bg-background border border-border-input rounded-lg px-3 py-1.5 w-full max-w-md">
      <Search size={16} className="text-gray-500 flex-shrink-0" />
      <input
        type="text"
        placeholder="Search tasks..."
        value={localSearch}
        onChange={(e) => {
          setLocalSearch(e.target.value);
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            setSearch(e.target.value);
          }, 500);
        }}
        className="w-full bg-transparent border-none text-sm px-2 focus:outline-none focus:ring-0 placeholder:text-gray-500 truncate"
      />
    </div>
  );
};

export default CustomSearch;
