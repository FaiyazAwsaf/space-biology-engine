interface QuickStartTilesProps {
  onQuickStart: (domain: string, defaultQuery: string) => void;
}

export function QuickStartTiles({ onQuickStart }: QuickStartTilesProps) {
  const domains = [
    {
      id: 'bone',
      icon: '🦴',
      title: 'Bone & Muscle',
      description: 'Skeletal system adaptations and muscle atrophy in microgravity',
      defaultQuery: 'What are the effects of microgravity on bone and muscle systems?',
      gradient: 'from-orange-500/20 via-red-500/15 to-pink-500/20',
      border: 'border-orange-400/40',
      glow: 'shadow-orange-500/20'
    },
    {
      id: 'immune',
      icon: '🧬',
      title: 'Immune System',
      description: 'Immunological responses and adaptation to space environment',
      defaultQuery: 'How does spaceflight affect the human immune system?',
      gradient: 'from-emerald-500/25 via-green-500/20 to-cyan-500/20',
      border: 'border-emerald-400/40',
      glow: 'shadow-emerald-500/25'
    },
    {
      id: 'neuro',
      icon: '🧠',
      title: 'Neuro & Circadian',
      description: 'Neurological changes and circadian rhythm disruption',
      defaultQuery: 'What are the neurological and circadian effects of space travel?',
      gradient: 'from-purple-500/20 via-violet-500/15 to-blue-500/20',
      border: 'border-purple-400/40',
      glow: 'shadow-purple-500/20'
    },
    {
      id: 'plants',
      icon: '🌱',
      title: 'Plant Biology',
      description: 'Plant growth, development, and adaptation in space',
      defaultQuery: 'How do plants grow and develop in microgravity conditions?',
      gradient: 'from-green-500/25 via-emerald-500/20 to-lime-500/20',
      border: 'border-green-400/40',
      glow: 'shadow-green-500/25'
    },
    {
      id: 'microbiome',
      icon: '🦠',
      title: 'Microbiome',
      description: 'Microbial ecology and host-microbe interactions',
      defaultQuery: 'How does the human microbiome change during spaceflight?',
      gradient: 'from-cyan-500/20 via-teal-500/15 to-blue-500/20',
      border: 'border-cyan-400/40',
      glow: 'shadow-cyan-500/20'
    },
    {
      id: 'methods',
      icon: '⚙️',
      title: 'Methods & Tech',
      description: 'Research methodologies and space biology techniques',
      defaultQuery: 'What are the latest methods and technologies in space biology research?',
      gradient: 'from-slate-500/20 via-gray-500/15 to-zinc-500/20',
      border: 'border-slate-400/40',
      glow: 'shadow-slate-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {domains.map((domain) => (
        <button
          key={domain.id}
          onClick={() => onQuickStart(domain.id, domain.defaultQuery)}
          className={`
            group relative p-6 rounded-xl border ${domain.border} 
            bg-gradient-to-br ${domain.gradient} hover:bg-slate-800/20
            backdrop-blur-sm transition-all duration-300 hover:scale-105 
            hover:shadow-xl ${domain.glow} text-left overflow-hidden
          `}
        >
          {/* Bio-tech pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-8 h-8 border border-current rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border border-current rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-current rotate-45"></div>
          </div>
          
          <div className="relative flex items-start gap-4">
            <div className="text-3xl p-2 bg-slate-900/30 rounded-lg backdrop-blur-sm border border-white/10">
              {domain.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-emerald-100 mb-2 group-hover:text-emerald-200 transition-colors">
                {domain.title}
              </h3>
              <p className="text-emerald-200/80 text-sm leading-relaxed">
                {domain.description}
              </p>
            </div>
          </div>
          
          {/* Bioluminescent hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
          
          {/* Organic connection lines */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent group-hover:via-emerald-400/60 transition-colors"></div>
        </button>
      ))}
    </div>
  );
}