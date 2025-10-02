import { useState } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  organism: string[];
  exposureType: string[];
  tissueSystem: string[];
  duration: string[];
  studyType: string[];
  missionContext: string[];
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const filterCategories = {
  organism: {
    title: 'Organism',
    icon: '🧬',
    options: [
      { value: 'human', label: 'Human', icon: '👩‍🚀' },
      { value: 'mouse', label: 'Mouse', icon: '🐭' },
      { value: 'rat', label: 'Rat', icon: '🐀' },
      { value: 'drosophila', label: 'Drosophila', icon: '🪰' },
      { value: 'c_elegans', label: 'C. elegans', icon: '🪱' },
      { value: 'arabidopsis', label: 'Arabidopsis', icon: '🌱' },
      { value: 'microbe', label: 'Microbe', icon: '🦠' },
      { value: 'cell_line', label: 'Cell line', icon: '🧪' }
    ]
  },
  exposureType: {
    title: 'Exposure Type',
    icon: '🚀',
    options: [
      { value: 'microgravity_spaceflight', label: 'Microgravity (spaceflight)', icon: '🛰️' },
      { value: 'simulated_microgravity', label: 'Simulated microgravity (hindlimb suspension / RWV)', icon: '⚖️' },
      { value: 'partial_gravity', label: 'Partial gravity (Moon / Mars analog)', icon: '🌙' },
      { value: 'radiation', label: 'Radiation (gamma / heavy ion)', icon: '☢️' },
      { value: 'combined', label: 'Combined (µg + radiation)', icon: '⚡' },
      { value: 'hypergravity', label: 'Hypergravity', icon: '🌀' }
    ]
  },
  tissueSystem: {
    title: 'Tissue/System',
    icon: '🫀',
    options: [
      { value: 'bone', label: 'Bone', icon: '🦴' },
      { value: 'muscle', label: 'Muscle', icon: '💪' },
      { value: 'immune', label: 'Immune', icon: '🛡️' },
      { value: 'brain_retina', label: 'Brain / Retina', icon: '🧠' },
      { value: 'heart', label: 'Heart', icon: '❤️' },
      { value: 'microbiome', label: 'Microbiome', icon: '🦠' },
      { value: 'plant_root_leaf', label: 'Plant root / leaf', icon: '🌿' }
    ]
  },
  duration: {
    title: 'Duration of Experiment',
    icon: '⏱️',
    options: [
      { value: 'acute', label: 'Acute (≤7 days)', icon: '⚡' },
      { value: 'short', label: 'Short (≤30 days)', icon: '📅' },
      { value: 'mid', label: 'Mid (31–180 days)', icon: '🗓️' },
      { value: 'long', label: 'Long (>180 days)', icon: '📆' }
    ]
  },
  studyType: {
    title: 'Study Type',
    icon: '📊',
    options: [
      { value: 'omics', label: 'Omics (RNAseq, proteomics)', icon: '🧬' },
      { value: 'physiology', label: 'Physiology', icon: '📈' },
      { value: 'imaging', label: 'Imaging', icon: '🖼️' },
      { value: 'review_method', label: 'Review / Method', icon: '📋' }
    ]
  },
  missionContext: {
    title: 'Mission Context',
    icon: '🚀',
    options: [
      { value: 'iss', label: 'ISS', icon: '🛰️' },
      { value: 'shuttle', label: 'Shuttle', icon: '🚀' },
      { value: 'suborbital', label: 'Suborbital', icon: '🌌' },
      { value: 'ground_analog', label: 'Ground analog (bedrest, clinostat, etc.)', icon: '🏥' }
    ]
  }
};

export function FilterPanel({ isOpen, onClose, onApplyFilters, initialFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      organism: [],
      exposureType: [],
      tissueSystem: [],
      duration: [],
      studyType: [],
      missionContext: []
    }
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearCategory = (category: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [category]: []
    }));
  };

  const clearAllFilters = () => {
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

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 lg:flex-none lg:w-96" onClick={onClose} />
      
      {/* Filter Panel */}
      <div className="bg-slate-900/95 backdrop-blur-md border-l border-cyan-500/20 w-full lg:w-[480px] h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-slate-800/80 to-slate-900/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-6 h-6 text-cyan-400" />
              <div>
                <h2 className="text-white text-xl">Research Filters</h2>
                <p className="text-cyan-300/70 text-sm">
                  Refine your space biology search
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-cyan-300 group-hover:text-white" />
            </button>
          </div>
          
          {/* Active Filters Summary */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-cyan-200">
                {getActiveFilterCount()} filters active
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter Categories */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.entries(filterCategories).map(([categoryKey, category]) => {
            const isExpanded = expandedSections.has(categoryKey);
            const categoryFilters = filters[categoryKey as keyof FilterState];
            const hasActiveFilters = categoryFilters.length > 0;

            return (
              <div key={categoryKey} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleSection(categoryKey)}
                    className="flex items-center gap-3 hover:text-cyan-300 transition-colors duration-200 flex-1"
                  >
                    <span className="text-xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="text-white text-sm font-medium">{category.title}</h3>
                      {hasActiveFilters && (
                        <div className="text-cyan-400 text-xs">
                          {categoryFilters.length} selected
                        </div>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                  
                  {hasActiveFilters && (
                    <button
                      onClick={() => clearCategory(categoryKey as keyof FilterState)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline ml-2"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Options */}
                {isExpanded && (
                  <div className="space-y-2 pl-10">
                    {category.options.map((option) => {
                      const isSelected = categoryFilters.includes(option.value);
                      
                      return (
                        <button
                          key={option.value}
                          onClick={() => toggleFilter(categoryKey as keyof FilterState, option.value)}
                          className={`
                            w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left
                            ${isSelected 
                              ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-100' 
                              : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-700/40 hover:border-slate-600/50'
                            }
                          `}
                        >
                          <span className="text-lg">{option.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{option.label}</div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-cyan-500/20 bg-slate-800/40">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-600/50 text-slate-300 hover:bg-slate-700/40 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 font-medium"
            >
              Apply Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}