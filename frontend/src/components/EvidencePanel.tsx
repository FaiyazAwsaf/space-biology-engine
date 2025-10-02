import { useState } from 'react';
import { createPortal } from 'react-dom';
import { EvidenceCard } from '../App';
import { 
  Activity, 
  Microscope, 
  Shield, 
  AlertTriangle, 
  ChevronDown,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Zap,
  Brain,
  CircuitBoard,
  Expand,
  X
} from 'lucide-react';
import { KnowledgeGraph } from './KnowledgeGraph';

interface EvidencePanelProps {
  evidenceCard: EvidenceCard;
}

export function EvidencePanel({ evidenceCard }: EvidencePanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set() // All sections collapsed by default
  );
  const [showKnowledgeGraphModal, setShowKnowledgeGraphModal] = useState(false);
  const [currentView, setCurrentView] = useState<'graph' | 'omics'>('graph');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Determine strength of evidence based on available data
  const getStrengthOfEvidence = () => {
    const totalEvidence = evidenceCard.impacts.length + evidenceCard.mechanisms.length + 
                         evidenceCard.countermeasures.length + evidenceCard.caveats.length;
    
    if (totalEvidence >= 12) return { 
      level: 'Strong', 
      color: 'text-green-400', 
      icon: TrendingUp, 
      bg: 'bg-green-500/15', 
      border: 'border-green-500/30',
      emoji: '🟢',
      glow: 'shadow-green-400/50'
    };
    if (totalEvidence >= 8) return { 
      level: 'Moderate', 
      color: 'text-yellow-400', 
      icon: Zap, 
      bg: 'bg-yellow-500/15', 
      border: 'border-yellow-500/30',
      emoji: '🟡',
      glow: 'shadow-yellow-400/50'
    };
    return { 
      level: 'Weak', 
      color: 'text-orange-400', 
      icon: Brain, 
      bg: 'bg-orange-500/15', 
      border: 'border-orange-500/30',
      emoji: '🟠',
      glow: 'shadow-orange-400/50'
    };
  };

  const strengthOfEvidence = getStrengthOfEvidence();

  const sections = [
    {
      id: 'impacts',
      title: 'Impacts',
      icon: Activity,
      data: evidenceCard.impacts.map(item => item.split(' ').slice(0, 10).join(' ')),
      color: 'text-red-400',
      bgColor: 'bg-red-500/15',
      borderColor: 'border-red-500/30',
      emoji: '⚡'
    },
    {
      id: 'mechanisms',
      title: 'Mechanisms',
      icon: Microscope,
      data: evidenceCard.mechanisms.map(item => item.split(' ').slice(0, 10).join(' ')),
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/15',
      borderColor: 'border-cyan-500/30',
      emoji: '🔬'
    },
    {
      id: 'countermeasures',
      title: 'Countermeasures',
      icon: Shield,
      data: evidenceCard.countermeasures.map(item => item.split(' ').slice(0, 10).join(' ')),
      color: 'text-green-400',
      bgColor: 'bg-green-500/15',
      borderColor: 'border-green-500/30',
      emoji: '🛡️'
    },
    {
      id: 'methods',
      title: 'Methods',
      icon: RefreshCw,
      data: evidenceCard.methods.map(item => item.split(' ').slice(0, 10).join(' ')),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/15',
      borderColor: 'border-purple-500/30',
      emoji: '⚙️'
    },
    {
      id: 'caveats',
      title: 'Caveats',
      icon: AlertTriangle,
      data: evidenceCard.caveats.map(item => item.split(' ').slice(0, 10).join(' ')),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/15',
      borderColor: 'border-orange-500/30',
      emoji: '⚠️'
    }
  ];

  return (
    <div className="h-screen bg-slate-800/40 backdrop-blur-sm border-l border-cyan-500/20">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-slate-800/80 to-slate-800/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="text-cyan-100 text-xl tracking-wide">Evidence Panel</h2>
                <p className="text-cyan-300/70 text-sm">Structured biological insights</p>
              </div>
            </div>
            
            {/* Strength of Evidence Indicator */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${strengthOfEvidence.bg} ${strengthOfEvidence.border} border backdrop-blur-sm shadow-lg ${strengthOfEvidence.glow}`}>
              <span className="text-lg">{strengthOfEvidence.emoji}</span>
              <div className="text-right">
                <div className={`text-sm ${strengthOfEvidence.color} tracking-wide`}>
                  {strengthOfEvidence.level}
                </div>
                <div className="text-xs text-cyan-300/60">Evidence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Sections - Equal space */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3 space-y-2">
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              const Icon = section.icon;
              
              return (
                <div
                  key={section.id}
                  className={`rounded-xl border transition-all duration-300 ${section.borderColor} ${section.bgColor} backdrop-blur-sm overflow-hidden`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-700/20 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="text-lg">{section.emoji}</span>
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 rounded-full blur animate-pulse"></div>
                      </div>
                      <div className="text-left">
                        <h3 className={`text-sm ${section.color} tracking-wide`}>
                          {section.title}
                        </h3>
                        <div className="text-xs text-cyan-300/50">
                          {section.data.length} entries
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${section.bgColor} ${section.borderColor} border backdrop-blur-sm`}>
                        <Icon className={`w-4 h-4 ${section.color}`} />
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      {section.data.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-600/20 text-sm text-cyan-100/90 leading-relaxed hover:bg-slate-700/30 transition-colors duration-200"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Knowledge Graph / Omics Lens Section - Equal space */}
        <div className="flex-1 p-3 border-t border-cyan-500/10 bg-gradient-to-r from-slate-800/80 to-slate-800/60 min-h-0">
          {/* Knowledge Graph / Omics Lens Toggle */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center bg-slate-700/50 rounded-lg p-1 border border-cyan-500/20">
              <button
                onClick={() => setCurrentView('graph')}
                className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                  currentView === 'graph'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 shadow-sm'
                    : 'text-cyan-400/70 hover:text-cyan-300'
                }`}
              >
                Knowledge Graph
              </button>
              <button
                onClick={() => setCurrentView('omics')}
                className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                  currentView === 'omics'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 shadow-sm'
                    : 'text-cyan-400/70 hover:text-cyan-300'
                }`}
              >
                Omics Lens
              </button>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowKnowledgeGraphModal(true)}
                className="p-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200 group"
                title={currentView === 'graph' ? 'Expand Knowledge Graph' : 'Expand Omics Lens'}
              >
                <Expand className="w-3 h-3 text-cyan-300 group-hover:text-cyan-200" />
              </button>
              <div className="flex items-center gap-1 text-xs text-cyan-300/60">
                <CircuitBoard className="w-3 h-3" />
                <span>{currentView === 'graph' ? 'Neural Map' : 'Multi-Omics'}</span>
              </div>
            </div>
          </div>

          {/* Knowledge Graph / Omics Lens Visualization - Fit remaining space */}
          <div className="flex-1 flex flex-col" style={{ minHeight: '200px' }}>
            {currentView === 'graph' ? (
              <div className="relative flex-1 bg-slate-900/20 rounded-xl border border-cyan-500/20 overflow-hidden" style={{ minHeight: '180px' }}>
                <div className="absolute inset-2 flex items-center justify-center">
                <div className="relative w-full max-w-xs h-full">
                  {/* Central node - smaller */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse">
                    <span className="text-white text-sm">🦴</span>
                  </div>
                  
                  {/* Surrounding nodes - smaller */}
                  <div className="absolute top-2 left-4 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md shadow-orange-500/40">
                    <span className="text-white text-xs">🚀</span>
                  </div>
                  <div className="absolute top-2 right-4 w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-green-500/40">
                    <span className="text-white text-xs">🍇</span>
                  </div>
                  <div className="absolute bottom-2 left-6 w-5 h-5 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-md shadow-purple-500/40">
                    <span className="text-white text-xs">📊</span>
                  </div>
                  <div className="absolute bottom-2 right-6 w-5 h-5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-md shadow-yellow-500/40">
                    <span className="text-white text-xs">⚗️</span>
                  </div>
                  
                  {/* Connection lines - thinner */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                    <line x1="50%" y1="50%" x2="25%" y2="15%" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1">
                      <animate attributeName="stroke-dashoffset" values="0;2" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50%" y1="50%" x2="75%" y2="15%" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1">
                      <animate attributeName="stroke-dashoffset" values="0;2" dur="2.5s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50%" y1="50%" x2="30%" y2="85%" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="1,1">
                      <animate attributeName="stroke-dashoffset" values="0;2" dur="3s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50%" y1="50%" x2="70%" y2="85%" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="1,1">
                      <animate attributeName="stroke-dashoffset" values="0;2" dur="2.2s" repeatCount="indefinite"/>
                    </line>
                  </svg>
                  </div>
                </div>
                
                <div className="absolute bottom-1 left-1 right-1 text-center">
                  <div className="text-xs text-cyan-300/60 bg-slate-800/60 backdrop-blur-sm rounded px-2 py-0.5">
                    Network • {evidenceCard.impacts.length + evidenceCard.mechanisms.length} nodes
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-slate-900/20 rounded-xl border border-cyan-500/20 p-3 overflow-hidden" style={{ minHeight: '180px' }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                <span>🧬</span>
                <span className="text-cyan-200 text-sm">Gene Expression</span>
                <div className="text-cyan-400/50 text-xs ml-1">
                  GLDS-104
                </div>
              </div>
              
              {/* Ultra Compact Heatmap Preview */}
              <div className="mb-3">
                <div className="grid grid-cols-10 gap-0.5 max-w-48 mx-auto mb-2">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-sm ${
                        Math.random() > 0.8 ? 'bg-red-500/90' :
                        Math.random() > 0.6 ? 'bg-yellow-500/90' :
                        Math.random() > 0.3 ? 'bg-green-500/90' :
                        'bg-blue-500/90'
                      } shadow-sm`}
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        animation: 'pulse 4s infinite'
                      }}
                    />
                  ))}
                </div>
                <div className="text-center text-xs text-cyan-300/60 mb-2">
                  Gene expression heatmap
                </div>
              </div>

              {/* Ultra Mini Bar Charts */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/40 rounded p-2">
                  <div className="text-xs text-cyan-200 mb-1 text-center">Pathways</div>
                  <div className="flex items-end justify-center gap-0.5 h-4">
                    {[70, 85, 55, 78].map((height, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-800/40 rounded p-2">
                  <div className="text-xs text-cyan-200 mb-1 text-center">Proteins</div>
                  <div className="flex items-end justify-center gap-0.5 h-4">
                    {[65, 45, 82, 55].map((height, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
                <div className="text-center text-xs text-cyan-400/40 mt-2">
                  Expand for full analysis
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Semi-Transparent Modal - Rendered at Document Level via Portal */}
        {showKnowledgeGraphModal && createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-8">
            <div className="relative bg-slate-900/95 backdrop-blur-lg rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 max-w-7xl w-full max-h-[85vh] overflow-hidden">
              {/* Modal Header */}
              <div className="relative p-6 border-b border-cyan-500/20 bg-slate-800/60 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{currentView === 'graph' ? '🕸️' : '🧬'}</span>
                    <div>
                      <h2 className="text-white text-2xl tracking-wide">
                        {currentView === 'graph' ? 'Space Biology Knowledge Graph' : 'Omics Lens'}
                      </h2>
                      <p className="text-cyan-300/80 text-base">
                        {currentView === 'graph' 
                          ? 'Interactive Network Visualization • Bone Remodeling Pathway' 
                          : 'NASA GLDS Multi-Omics Data Visualization'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowKnowledgeGraphModal(false)}
                    className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200 group"
                  >
                    <X className="w-6 h-6 text-cyan-300 group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Horizontally Optimized */}
              <div className="relative p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto" style={{ height: '600px' }}>
                {currentView === 'graph' ? (
                  <div className="w-full h-full">
                    <KnowledgeGraph graphType="bone" className="w-full h-full" />
                  </div>
                ) : (
                  /* Expanded Omics Lens - Horizontally Optimized */
                  <div className="w-full h-full overflow-y-auto">
                    <div className="space-y-6">
                      {/* Large Heatmap Visualization - Full Width */}
                      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
                        <h3 className="text-cyan-100 text-xl mb-6 flex items-center justify-center gap-3">
                          <span>🧬</span>
                          <span>Gene Expression Heatmap</span>
                        </h3>
                        <div className="grid grid-cols-24 gap-1 mb-6 mx-auto">
                          {Array.from({ length: 192 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-sm ${ 
                                Math.random() > 0.8 ? 'bg-red-500/90 shadow-red-500/40' :
                                Math.random() > 0.6 ? 'bg-yellow-500/90 shadow-yellow-500/40' :
                                Math.random() > 0.3 ? 'bg-green-500/90 shadow-green-500/40' :
                                'bg-blue-500/90 shadow-blue-500/40'
                              } shadow-sm`}
                              style={{ 
                                animationDelay: `${i * 0.01}s`,
                                animation: 'pulse 3s infinite'
                              }}
                            />
                          ))}
                        </div>
                        <div className="text-center text-sm text-cyan-300/60">
                          NASA GLDS-104 • Microgravity vs Ground Control • 1,536 genes analyzed
                        </div>
                      </div>
                      
                      {/* Side by Side Charts - Full Width */}
                      <div className="grid grid-cols-2 gap-8">
                        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
                          <h4 className="text-cyan-100 text-lg mb-6 flex items-center justify-center gap-2">
                            <span>📊</span>
                            <span>Pathway Enrichment</span>
                          </h4>
                          <div className="flex items-end justify-center gap-3 h-40">
                            {[85, 92, 67, 78, 95, 81, 73, 89, 76, 88, 94, 82].map((height, i) => (
                              <div
                                key={i}
                                className="w-8 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg shadow-lg shadow-cyan-500/30"
                                style={{ 
                                  height: `${height}%`,
                                  animationDelay: `${i * 0.2}s`,
                                  animation: 'pulse 2s infinite'
                                }}
                              />
                            ))}
                          </div>
                          <div className="text-center text-sm text-cyan-300/60 mt-4">
                            Top enriched biological pathways
                          </div>
                        </div>

                        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
                          <h4 className="text-cyan-100 text-lg mb-6 flex items-center justify-center gap-2">
                            <span>🔬</span>
                            <span>Protein Expression</span>
                          </h4>
                          <div className="flex items-end justify-center gap-3 h-40">
                            {[72, 58, 91, 64, 87, 75, 82, 69, 79, 85, 71, 93].map((height, i) => (
                              <div
                                key={i}
                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg shadow-lg shadow-purple-500/30"
                                style={{ 
                                  height: `${height}%`,
                                  animationDelay: `${i * 0.15}s`,
                                  animation: 'pulse 2.5s infinite'
                                }}
                              />
                            ))}
                          </div>
                          <div className="text-center text-sm text-cyan-300/60 mt-4">
                            Differential protein abundance
                          </div>
                        </div>
                      </div>
                      
                      {/* Omics Legend - Bottom */}
                      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
                        <h4 className="text-cyan-100 text-lg mb-4 flex items-center justify-center gap-2">
                          <CircuitBoard className="w-5 h-5" />
                          Multi-Omics Data Legend
                        </h4>
                        <div className="grid grid-cols-4 gap-6 text-sm">
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl">🔴</span>
                            <span className="text-red-300">Upregulated</span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl">🟢</span>
                            <span className="text-green-300">Downregulated</span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl">🟡</span>
                            <span className="text-yellow-300">Moderate Change</span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl">🔵</span>
                            <span className="text-blue-300">No Significant Change</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}