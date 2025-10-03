import { TrendingUp, Clock, Users } from 'lucide-react';

export function TrendingInsights() {
  const insights = [
    {
      id: 1,
      headline: "80% of rodent studies show cancellous bone loss in ≤30 days",
      description: "Meta-analysis of 47 microgravity experiments reveals rapid onset of trabecular bone deterioration",
      metric: "47 studies",
      timeframe: "Last 6 months",
      icon: TrendingUp,
      color: "text-orange-400"
    },
    {
      id: 2,
      headline: "Plant root gravitropism completely altered within 72 hours",
      description: "Recent ISS experiments show fundamental changes in root growth patterns and cell wall development",
      metric: "12 species",
      timeframe: "ISS Expeditions 67-69",
      icon: Clock,
      color: "text-green-400"
    },
    {
      id: 3,
      headline: "Immune cell function recovers 90% within 30 days post-flight",
      description: "Longitudinal study of astronaut immune markers shows resilient recovery patterns",
      metric: "24 astronauts",
      timeframe: "5-year study",
      icon: Users,
      color: "text-blue-400"
    }
  ];

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className="group relative p-6 rounded-xl bg-slate-900/20 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:bg-slate-800/30 overflow-hidden"
        >
          {/* DNA-inspired pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
            <div className="absolute inset-0 border-2 border-current rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute inset-2 border border-current rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          </div>
          
          <div className="relative flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 ${insight.color}`}>
              <insight.icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-emerald-100 mb-2 group-hover:text-emerald-200 transition-colors">
                {insight.headline}
              </h3>
              <p className="text-emerald-200/80 text-sm mb-3 leading-relaxed">
                {insight.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  {insight.metric}
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  {insight.timeframe}
                </span>
              </div>
            </div>
          </div>
          
          {/* Bioluminescent hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-cyan-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
          
          {/* Organic growth line */}
          <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-emerald-500/20 via-emerald-400/40 to-emerald-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
      ))}
    </div>
  );
}