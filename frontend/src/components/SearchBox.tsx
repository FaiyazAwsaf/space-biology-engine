import { useState } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { FilterPanel, FilterState } from './FilterPanel';
import { FilterChips } from './FilterChips';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string, filters?: FilterState) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export function SearchBox({ value, onChange, onSearch, placeholder, showFilters = false }: SearchBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    organism: [],
    exposureType: [],
    tissueSystem: [],
    duration: [],
    studyType: [],
    missionContext: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value, filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(value, filters);
    }
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setShowFilterPanel(false);
  };

  const handleRemoveFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(v => v !== value)
    }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      organism: [],
      exposureType: [],
      tissueSystem: [],
      duration: [],
      studyType: [],
      missionContext: []
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, categoryFilters) => count + categoryFilters.length, 0);
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Filter Chips */}
      {showFilters && (
        <FilterChips
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative bg-slate-900/40 backdrop-blur-md rounded-2xl border transition-all duration-300
          ${isFocused 
            ? 'shadow-xl shadow-emerald-500/25 border-emerald-400/50 bg-slate-900/60' 
            : 'shadow-lg border-emerald-500/20'
          }
        `}>
          {/* Bioluminescent glow effect */}
          <div className={`
            absolute inset-0 rounded-2xl transition-opacity duration-300
            ${isFocused ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-emerald-500/10 rounded-2xl blur-sm"></div>
          </div>
          
          <div className="relative flex items-center gap-4 p-4">
            <Search className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder || "Ask me anything about space biology..."}
              className="flex-1 bg-transparent text-emerald-100 placeholder-emerald-300/70 outline-none text-lg"
            />

            {/* Filter Button */}
            {showFilters && (
              <button
                type="button"
                onClick={() => setShowFilterPanel(true)}
                className={`
                  relative px-4 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 border
                  ${getActiveFilterCount() > 0
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-100 hover:bg-cyan-500/30' 
                    : 'bg-slate-800/40 border-slate-600/50 text-slate-300 hover:bg-slate-700/40'
                  }
                `}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">
                  {getActiveFilterCount() > 0 ? `Filters (${getActiveFilterCount()})` : 'Filters'}
                </span>
              </button>
            )}

            <button
              type="submit"
              disabled={!value.trim()}
              className={`
                relative px-8 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 overflow-hidden group
                ${value.trim() 
                  ? 'bg-gradient-to-r from-emerald-700 via-cyan-600 to-emerald-700 hover:from-emerald-600 hover:via-cyan-500 hover:to-emerald-600 text-emerald-50 shadow-xl shadow-emerald-500/30 border border-emerald-400/40' 
                  : 'bg-slate-800/40 text-emerald-400/40 cursor-not-allowed border border-emerald-500/10'
                }
              `}
            >
              {/* Bio-circuit pattern overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1 left-2 w-2 h-2 border border-current rounded-full"></div>
                <div className="absolute bottom-1 right-2 w-1.5 h-1.5 border border-current rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-px bg-current"></div>
              </div>
              
              {/* Pulsing bio-effect */}
              {value.trim() && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-cyan-400/10 to-emerald-400/20 animate-pulse"></div>
              )}
              
              <div className="relative flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="tracking-wide">Synthesize</span>
              </div>
              
              {/* DNA helix animation */}
              {value.trim() && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-1 h-6 relative">
                    <div className="absolute inset-0 border-l border-current opacity-60 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-2 h-1 border-t border-current rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-0 left-0 w-2 h-1 border-b border-current -rotate-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Filter Panel Modal */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
}