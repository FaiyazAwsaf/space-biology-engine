import { useState } from 'react';
import { SearchBox } from './SearchBox';
import { FilterState } from './FilterPanel';

interface AdvancedSearchProps {
  onSearch: (query: string, filters?: FilterState) => void;
  placeholder?: string;
}

export function AdvancedSearch({ onSearch, placeholder }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string, filters?: FilterState) => {
    if (query.trim()) {
      onSearch(query.trim(), filters);
      setSearchQuery(''); // Clear search after submission
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <SearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder={placeholder || "Search space biology research..."}
        showFilters={true}
      />
    </div>
  );
}