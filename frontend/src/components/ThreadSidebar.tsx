import { useState } from 'react';
import { Thread } from '../App';
import { Home, Plus, Clock, Filter, ChevronDown, RefreshCw, ChevronUp, X } from 'lucide-react';
import { FilterState } from './FilterPanel';

interface ThreadSidebarProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onNavigateToHomepage: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

export function ThreadSidebar({ 
  threads, 
  activeThreadId, 
  onSelectThread, 
  onNavigateToHomepage,
  onApplyFilters 
}: ThreadSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [filters, setFilters] = useState<FilterState>({
    organism: [],
    exposureType: [],
    tissueSystem: [],
    duration: [],
    studyType: [],
    missionContext: []
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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
        { value: 'simulated_microgravity', label: 'Simulated microgravity', icon: '⚖️' },
        { value: 'partial_gravity', label: 'Partial gravity', icon: '🌙' },
        { value: 'radiation', label: 'Radiation', icon: '☢️' },
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
      title: 'Duration',
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
        { value: 'omics', label: 'Omics', icon: '🧬' },
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
        { value: 'ground_analog', label: 'Ground analog', icon: '🏥' }
      ]
    }
  };

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
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInMinutes / 1440);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const getDomainFromThread = (thread: Thread) => {
    const content = thread.title.toLowerCase();
    if (content.includes('bone') || content.includes('muscle') || content.includes('skeletal')) return 'bone';
    if (content.includes('immune') || content.includes('antibody') || content.includes('infection')) return 'immune';
    if (content.includes('neuro') || content.includes('brain') || content.includes('circadian')) return 'neuro';
    if (content.includes('plant') || content.includes('root') || content.includes('growth')) return 'plants';
    if (content.includes('microbiome') || content.includes('bacteria') || content.includes('microbe')) return 'microbiome';
    if (content.includes('method') || content.includes('technique') || content.includes('protocol')) return 'methods';
    return 'general';
  };

  const getDomainLabel = (domain: string) => {
    const domainMap: Record<string, { icon: string; label: string; color: string }> = {
      bone: { icon: '🦴', label: 'Bone', color: 'text-orange-400' },
      immune: { icon: '🧬', label: 'Immune', color: 'text-emerald-400' },
      neuro: { icon: '🧠', label: 'Neuro', color: 'text-purple-400' },
      plants: { icon: '🌱', label: 'Plant', color: 'text-green-400' },
      microbiome: { icon: '🦠', label: 'Microbiome', color: 'text-cyan-400' },
      methods: { icon: '⚙️', label: 'Methods', color: 'text-slate-400' },
      general: { icon: '🔬', label: 'General', color: 'text-emerald-300' }
    };
    return domainMap[domain] || domainMap.general;
  };

  const filteredThreads = threads.filter(thread => {
    if (selectedFilter === 'all') return true;
    return getDomainFromThread(thread) === selectedFilter;
  });

  return (
    <div className="h-full flex flex-col relative">
      {/* Bio-tech pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-8 right-4 w-16 h-16 border border-emerald-400 rounded-full"></div>
        <div className="absolute bottom-20 left-4 w-8 h-8 border border-cyan-400 rounded-full rotate-45"></div>
      </div>

      {/* Header */}
      <div className="relative p-4 border-b border-emerald-900/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <span className="text-white">🧬</span>
          </div>
          <h2 className="text-emerald-100">Space Biology AI</h2>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={onNavigateToHomepage}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white transition-all duration-200 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
          
          <button
            onClick={onNavigateToHomepage}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-emerald-300 hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Homepage
          </button>
        </div>

        {/* Research Filters Section */}
        <div className="mt-3">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-emerald-300/70 hover:bg-emerald-900/10 border border-emerald-700/20 hover:border-emerald-600/30 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-1.5 py-0.5 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {filterOpen && (
            <div className="mt-2 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-emerald-700/20 overflow-hidden">
              {/* Filter Header */}
              <div className="p-3 border-b border-emerald-700/20 bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <div className="text-emerald-200 text-sm">Research Filters</div>
                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter Categories */}
              <div className="max-h-96 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {Object.entries(filterCategories).map(([categoryKey, category]) => {
                    const isExpanded = expandedSections.has(categoryKey);
                    const categoryFilters = filters[categoryKey as keyof FilterState];
                    const hasActiveFilters = categoryFilters.length > 0;

                    return (
                      <div key={categoryKey}>
                        {/* Category Header */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleSection(categoryKey)}
                            className="flex items-center gap-2 py-2 px-2 hover:bg-emerald-900/20 rounded-lg transition-colors duration-200 flex-1 text-left"
                          >
                            <span className="text-sm">{category.icon}</span>
                            <div className="flex-1">
                              <div className="text-emerald-200 text-xs">{category.title}</div>
                              {hasActiveFilters && (
                                <div className="text-emerald-400 text-xs">
                                  {categoryFilters.length} selected
                                </div>
                              )}
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-emerald-400" />
                            )}
                          </button>
                          
                          {hasActiveFilters && (
                            <button
                              onClick={() => clearCategory(categoryKey as keyof FilterState)}
                              className="p-1 text-emerald-400 hover:text-emerald-300 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Category Options */}
                        {isExpanded && (
                          <div className="ml-6 space-y-1 pb-2">
                            {category.options.map((option) => {
                              const isSelected = categoryFilters.includes(option.value);
                              
                              return (
                                <button
                                  key={option.value}
                                  onClick={() => toggleFilter(categoryKey as keyof FilterState, option.value)}
                                  className={`
                                    w-full flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-left text-xs
                                    ${isSelected 
                                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200' 
                                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-700/40 hover:border-slate-600/50'
                                    }
                                  `}
                                >
                                  <span className="text-sm">{option.icon}</span>
                                  <div className="flex-1 truncate">{option.label}</div>
                                  {isSelected && (
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
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
              </div>
              
              {/* Apply Filters Button */}
              {getActiveFilterCount() > 0 && (
                <div className="p-3 border-t border-emerald-700/20 bg-slate-800/40">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-sm hover:from-emerald-500 hover:to-cyan-500 transition-all duration-200"
                  >
                    Apply Filters ({getActiveFilterCount()})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <div className="mt-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center px-2 py-1 rounded-lg text-emerald-400/70 hover:bg-emerald-900/10 transition-all duration-200"
          >
            <ChevronDown className={`w-4 h-4 transform transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        </div>
      </div>

      {/* Threads List */}
      <div className="relative flex-1 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <div className="p-4 text-center text-emerald-400/70">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs text-emerald-500/50 mt-1">Start exploring space biology</p>
          </div>
        ) : (
          <div className={`p-2 space-y-1 transition-all duration-300 ${isCollapsed ? 'max-h-32 overflow-hidden' : ''}`}>
            {filteredThreads.map((thread) => {
              const domain = getDomainFromThread(thread);
              const domainInfo = getDomainLabel(domain);
              
              return (
                <button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={`
                    relative w-full p-3 rounded-xl text-left transition-all duration-200 overflow-hidden group
                    ${activeThreadId === thread.id 
                      ? 'bg-gradient-to-r from-emerald-600/20 to-cyan-600/15 border border-emerald-500/40 text-emerald-100' 
                      : 'text-emerald-300 hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30'
                    }
                  `}
                >
                  {/* Active thread glow effect */}
                  {activeThreadId === thread.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl"></div>
                  )}
                  
                  <div className="relative flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="text-base p-1 bg-slate-800/30 rounded-lg">
                        {domainInfo.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="truncate text-sm">
                          {thread.title}
                        </h4>
                        {activeThreadId === thread.id && (
                          <RefreshCw className="w-3 h-3 text-emerald-400/70" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`${domainInfo.color} font-medium`}>
                          {domainInfo.label}
                        </span>
                        <div className="w-1 h-1 bg-emerald-400/50 rounded-full"></div>
                        <span className="text-emerald-400/70">{formatTimeAgo(thread.lastActivity)}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-emerald-500/50">
                        <span>{thread.messages.length} messages</span>
                      </div>
                    </div>
                  </div>

                  {/* Connection line for active thread */}
                  {activeThreadId === thread.id && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-l-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative p-4 border-t border-emerald-900/40">
        <div className="text-xs text-emerald-400/70 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Space Biology Knowledge Engine</span>
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="text-emerald-500/50 text-xs">Biological Futurism</div>
        </div>
      </div>
    </div>
  );
}