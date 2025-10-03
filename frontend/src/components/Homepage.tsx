import { useState, useRef } from "react";
import { SearchBox } from "./SearchBox";
import { QuickStartTiles } from "./QuickStartTiles";
import { TrendingInsights } from "./TrendingInsights";
import { MiniActiveResearch } from "./MiniActiveResearch";
import { FilterState } from "./FilterPanel";

interface HomepageProps {
  onStartConversation: (
    query: string,
    domain?: string,
    filters?: FilterState
  ) => void;
  onNavigateToDashboard: () => void;
}

export function Homepage({
  onStartConversation,
  onNavigateToDashboard,
}: HomepageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const domainsRef = useRef<HTMLElement>(null);
  const activeResearchRef = useRef<HTMLElement>(null);

  const handleSearch = (query: string, filters?: FilterState) => {
    if (query.trim()) {
      onStartConversation(query.trim(), undefined, filters);
    }
  };

  const handleQuickStart = (domain: string, defaultQuery: string) => {
    onStartConversation(defaultQuery, domain);
  };

  // Track the current sample question index
  const [sampleIndex, setSampleIndex] = useState(0);

  const sampleQuestions = [
    "How does microgravity affect bone and muscle at the molecular and physiological level?",
    "What are the neurological effects of long-duration spaceflight?",
    "How do plants adapt their growth patterns in space?",
    "What changes occur in the immune system during space missions?",
    "How does the microbiome change in space environments?",
    "What research methods are most effective for space biology studies?",
  ];

  const handleStartExploring = () => {
    const nextQuestion = sampleQuestions[sampleIndex];
    setSearchQuery(nextQuestion);
    setSampleIndex((prev) => (prev + 1) % sampleQuestions.length);

    // Focus the search box to show the user the injected question
    const searchInput = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      // Add a subtle animation to draw attention to the search bar
      searchInput.parentElement?.parentElement?.classList.add("animate-pulse");
      setTimeout(() => {
        searchInput.parentElement?.parentElement?.classList.remove(
          "animate-pulse"
        );
      }, 2000);
    }
  };

  const handleViewMoreResearch = () => {
    activeResearchRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 dark">
      {/* Breathing Live Wallpaper Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Breathing Orb */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-emerald-500/8 via-emerald-500/4 to-transparent rounded-full blur-3xl"
          style={{
            animation: "breathe-primary 8s ease-in-out infinite",
          }}
        ></div>

        {/* Secondary Breathing Orb */}
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-cyan-500/6 via-cyan-500/3 to-transparent rounded-full blur-3xl"
          style={{
            animation: "breathe-secondary 10s ease-in-out infinite",
          }}
        ></div>

        {/* Tertiary Breathing Orb */}
        <div
          className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-gradient-radial from-green-400/4 via-green-400/2 to-transparent rounded-full blur-2xl"
          style={{
            animation: "breathe-tertiary 12s ease-in-out infinite",
          }}
        ></div>

        {/* Ambient Background Breathing */}
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent via-emerald-950/20 to-slate-950/40"
          style={{
            animation: "breathe-ambient 15s ease-in-out infinite",
          }}
        ></div>
      </div>

      <style>{`
        @keyframes breathe-primary {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.3) rotate(2deg);
            opacity: 0.8;
          }
        }
        
        @keyframes breathe-secondary {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.5;
          }
          50% { 
            transform: scale(1.4) rotate(-1deg);
            opacity: 0.7;
          }
        }
        
        @keyframes breathe-tertiary {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.4;
          }
          50% { 
            transform: scale(1.2) rotate(1deg);
            opacity: 0.6;
          }
        }
        
        @keyframes breathe-ambient {
          0%, 100% { 
            opacity: 0.3;
          }
          50% { 
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🧬</span>
            </div>
            <span className="text-emerald-200 tracking-wide">
              <a href="https://www.spaceappschallenge.org/2025/find-a-team/pulse-planet/?tab=members">
                TEAM PULSE PLANET{" "}
              </a>
            </span>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <button className="text-emerald-300/70 hover:text-emerald-200 transition-colors tracking-wide">
              <a href="">About</a>
            </button>
            <button className="text-emerald-300/70 hover:text-emerald-200 transition-colors tracking-wide">
              <a href="https://www.spaceappschallenge.org/2025/challenges/build-a-space-biology-knowledge-engine/?tab=resources">
                Resources
              </a>
            </button>
            <button className="text-emerald-300/70 hover:text-emerald-200 transition-colors tracking-wide">
              <a href="https://www.spaceappschallenge.org/2025/find-a-team/pulse-planet/?tab=members">
                Team
              </a>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-4 tracking-tight">
            Kepler Bio-Engine
          </h1>
          <p className="text-emerald-200/80 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Explore the convergence of life and cosmos through AI-powered
            insights from cutting-edge space biology research
          </p>

          {/* Search Interface */}
          <div className="mb-8">
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Query biological adaptations, physiological responses, or space biology phenomena..."
              showFilters={false}
            />
          </div>

          {/* Start Exploring Button */}
          <div className="mb-16">
            <button
              onClick={handleStartExploring}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105"
            >
              <span className="tracking-wide">Start Exploring</span>
            </button>
          </div>

          {/* Mini Active Research Feed */}
          <div className="max-w-md mx-auto">
            <div className="mb-4 text-center">
              <div className="text-emerald-200/70 text-sm tracking-wide mb-3">
                Live Research Insights
              </div>
            </div>
            <MiniActiveResearch onViewMore={handleViewMoreResearch} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-8 pb-16">
        {/* Research Domains */}
        <section ref={domainsRef} className="mb-16 scroll-mt-8">
          <div className="mb-8 border-l-2 border-emerald-500/30 pl-4">
            <h2 className="text-emerald-100/90 tracking-wide">
              Research Domains
            </h2>
            <div className="text-emerald-400/60 text-sm mt-1">
              // Six primary biological systems
            </div>
          </div>
          <QuickStartTiles onQuickStart={handleQuickStart} />
        </section>

        {/* Full Active Research */}
        <section ref={activeResearchRef} className="mb-12 scroll-mt-8">
          <div className="mb-8 border-l-2 border-cyan-500/30 pl-4">
            <h2 className="text-emerald-100/90 tracking-wide">
              Active Research
            </h2>
            <div className="text-cyan-400/60 text-sm mt-1">
              // Current biological discoveries
            </div>
          </div>
          <TrendingInsights />
        </section>

        {/* System Access */}
        <section className="text-center pt-8 border-t border-emerald-500/10">
          <button
            onClick={onNavigateToDashboard}
            className="text-emerald-300/80 hover:text-emerald-200 transition-colors text-sm tracking-wider"
          >
            ACCESS ANALYSIS TERMINAL
          </button>
        </section>
      </main>

      {/* Copyright */}
      <div className="border-t border-gray-700/30 pt-8  ">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white text-sm">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://www.spaceappschallenge.org/2025/find-a-team/pulse-planet/?tab=members"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Team Pulse Planet
            </a>
            . All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-white">
            <span>Built for NASA Space Apps Challenge</span>
          </div>
        </div>

        {/* Additional Copyright Notice */}
        <div className="mt-4 text-center">
          <p className="text-white text-xs">
            This project and all associated intellectual property are owned by
            Team Pulse Planet.
            <br />
            Developed as part of the NASA Space Apps Challenge 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
