import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users } from 'lucide-react';

interface MiniActiveResearchProps {
  onViewMore: () => void;
}

export function MiniActiveResearch({ onViewMore }: MiniActiveResearchProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const highlights = [
    {
      id: 1,
      headline: "80% of rodent studies show cancellous bone loss in ≤30 days",
      metric: "47 studies",
      icon: TrendingUp,
      color: "text-orange-400"
    },
    {
      id: 2,
      headline: "Plant root gravitropism completely altered within 72 hours",
      metric: "12 species",
      icon: Clock,
      color: "text-green-400"
    },
    {
      id: 3,
      headline: "Immune cell function recovers 90% within 30 days post-flight",
      metric: "24 astronauts",
      icon: Users,
      color: "text-blue-400"
    }
  ];

  // Auto-rotate insights every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % highlights.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [highlights.length]);

  const currentHighlight = highlights[currentIndex];

  return (
    <div className="space-y-3">
      {/* Single rotating insight */}
      <div className="relative h-20 overflow-hidden">
        <div
          key={currentHighlight.id}
          className="group relative p-4 rounded-lg bg-slate-900/15 backdrop-blur-sm border border-emerald-500/15 hover:border-emerald-400/30 transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-2"
        >
          {/* Subtle pattern */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-3">
            <div className="absolute inset-0 border border-current rounded-full animate-spin" style={{ animationDuration: '25s' }}></div>
          </div>
          
          <div className="relative flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-emerald-500/15 ${currentHighlight.color}`}>
              <currentHighlight.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-emerald-100/90 text-sm leading-tight mb-1 group-hover:text-emerald-200/95 transition-colors">
                {currentHighlight.headline}
              </h3>
              <span className="text-xs px-2 py-0.5 bg-emerald-500/15 text-emerald-300/80 rounded border border-emerald-500/25">
                {currentHighlight.metric}
              </span>
            </div>
          </div>
          
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 via-cyan-500/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center gap-1">
        {highlights.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-emerald-400 w-6' 
                : 'bg-emerald-500/30'
            }`}
          />
        ))}
      </div>
      
      {/* View More Link */}
      <button
        onClick={onViewMore}
        className="w-full text-center text-emerald-300/70 hover:text-emerald-200 transition-colors text-sm py-2"
      >
        See more active research ↓
      </button>
    </div>
  );
}