import { X } from 'lucide-react';
import { FilterState } from './FilterPanel';

interface FilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (category: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

const filterLabels = {
  organism: {
    human: { label: 'Human', icon: '👩‍🚀' },
    mouse: { label: 'Mouse', icon: '🐭' },
    rat: { label: 'Rat', icon: '🐀' },
    drosophila: { label: 'Drosophila', icon: '🪰' },
    c_elegans: { label: 'C. elegans', icon: '🪱' },
    arabidopsis: { label: 'Arabidopsis', icon: '🌱' },
    microbe: { label: 'Microbe', icon: '🦠' },
    cell_line: { label: 'Cell line', icon: '🧪' }
  },
  exposureType: {
    microgravity_spaceflight: { label: 'Microgravity (spaceflight)', icon: '🛰️' },
    simulated_microgravity: { label: 'Simulated microgravity', icon: '⚖️' },
    partial_gravity: { label: 'Partial gravity', icon: '🌙' },
    radiation: { label: 'Radiation', icon: '☢️' },
    combined: { label: 'Combined (µg + radiation)', icon: '⚡' },
    hypergravity: { label: 'Hypergravity', icon: '🌀' }
  },
  tissueSystem: {
    bone: { label: 'Bone', icon: '🦴' },
    muscle: { label: 'Muscle', icon: '💪' },
    immune: { label: 'Immune', icon: '🛡️' },
    brain_retina: { label: 'Brain / Retina', icon: '🧠' },
    heart: { label: 'Heart', icon: '❤️' },
    microbiome: { label: 'Microbiome', icon: '🦠' },
    plant_root_leaf: { label: 'Plant root / leaf', icon: '🌿' }
  },
  duration: {
    acute: { label: 'Acute (≤7 days)', icon: '⚡' },
    short: { label: 'Short (≤30 days)', icon: '📅' },
    mid: { label: 'Mid (31–180 days)', icon: '🗓️' },
    long: { label: 'Long (>180 days)', icon: '📆' }
  },
  studyType: {
    omics: { label: 'Omics', icon: '🧬' },
    physiology: { label: 'Physiology', icon: '📈' },
    imaging: { label: 'Imaging', icon: '🖼️' },
    review_method: { label: 'Review / Method', icon: '📋' }
  },
  missionContext: {
    iss: { label: 'ISS', icon: '🛰️' },
    shuttle: { label: 'Shuttle', icon: '🚀' },
    suborbital: { label: 'Suborbital', icon: '🌌' },
    ground_analog: { label: 'Ground analog', icon: '🏥' }
  }
};

export function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  const getAllActiveFilters = () => {
    const activeFilters: Array<{ category: keyof FilterState; value: string; label: string; icon: string }> = [];
    
    Object.entries(filters).forEach(([category, values]) => {
      values.forEach(value => {
        const filterInfo = filterLabels[category as keyof FilterState]?.[value as keyof typeof filterLabels.organism];
        if (filterInfo) {
          activeFilters.push({
            category: category as keyof FilterState,
            value,
            label: filterInfo.label,
            icon: filterInfo.icon
          });
        }
      });
    });
    
    return activeFilters;
  };

  const activeFilters = getAllActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="text-sm text-cyan-300 mr-2">Active filters:</div>
      
      {activeFilters.map(({ category, value, label, icon }) => (
        <div
          key={`${category}-${value}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-100 text-sm"
        >
          <span className="text-xs">{icon}</span>
          <span>{label}</span>
          <button
            onClick={() => onRemoveFilter(category, value)}
            className="hover:bg-cyan-400/20 rounded-full p-0.5 transition-colors duration-200"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-cyan-400 hover:text-cyan-300 underline ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}