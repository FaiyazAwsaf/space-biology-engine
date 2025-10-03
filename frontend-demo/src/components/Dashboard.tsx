import { Thread, Message } from "../App";
import { ThreadSidebar } from "./ThreadSidebar";
import { ChatPanel } from "./ChatPanel";
import { EvidencePanel } from "./EvidencePanel";
import { FilterState } from "./FilterPanel";

interface DashboardProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (
    threadId: string,
    message: string,
    filters?: FilterState
  ) => void;
  onNavigateToHomepage: () => void;
  isLoadingInitialResponse?: boolean;
  isLoadingResponse?: boolean;
}

export function Dashboard({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  onNavigateToHomepage,
  isLoadingInitialResponse = false,
  isLoadingResponse = false,
}: DashboardProps) {
  const activeThread = threads.find((t) => t.id === activeThreadId);
  const lastAssistantMessage = activeThread?.messages
    .filter((m) => m.type === "assistant")
    .slice(-1)[0];

  const handleApplyFilters = (filters: FilterState) => {
    // Apply filters to the active thread if exists
    if (activeThread) {
      // For now, we'll simulate applying filters by sending a message
      // In a real implementation, this would filter the research results
      const filterSummary = [];
      if (filters.organism.length > 0)
        filterSummary.push(`Organism: ${filters.organism.join(", ")}`);
      if (filters.exposureType.length > 0)
        filterSummary.push(`Exposure: ${filters.exposureType.join(", ")}`);
      if (filters.tissueSystem.length > 0)
        filterSummary.push(`System: ${filters.tissueSystem.join(", ")}`);
      if (filters.duration.length > 0)
        filterSummary.push(`Duration: ${filters.duration.join(", ")}`);
      if (filters.studyType.length > 0)
        filterSummary.push(`Study Type: ${filters.studyType.join(", ")}`);
      if (filters.missionContext.length > 0)
        filterSummary.push(`Mission: ${filters.missionContext.join(", ")}`);

      if (filterSummary.length > 0) {
        onSendMessage(
          activeThread.id,
          `Apply these research filters: ${filterSummary.join(" • ")}`,
          filters
        );
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-emerald-950/50 to-slate-900 flex dark">
      {/* Organic background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Left Sidebar - Threads */}
      <div className="relative w-80 border-r border-emerald-900/30 bg-slate-900/60 backdrop-blur-sm">
        <ThreadSidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onSelectThread={onSelectThread}
          onNavigateToHomepage={onNavigateToHomepage}
          onApplyFilters={handleApplyFilters}
        />
      </div>

      {/* Center Panel - Chat */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {activeThread ? (
          <ChatPanel
            thread={activeThread}
            onSendMessage={onSendMessage}
            isLoadingInitialResponse={isLoadingInitialResponse}
            isLoadingResponse={isLoadingResponse}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-emerald-500/30">
                  <span className="text-3xl">🧬</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-lg -z-10"></div>
              </div>
              <h3 className="text-xl text-emerald-100 mb-2">
                No conversation selected
              </h3>
              <p className="text-emerald-300/70 mb-6 max-w-md">
                Choose a thread from the sidebar or start exploring the frontier
                of space biology research
              </p>
              <button
                onClick={onNavigateToHomepage}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Evidence Cards & Knowledge Graph */}
      {activeThread && lastAssistantMessage?.evidenceCard && (
        <div className="relative w-96 border-l border-emerald-900/30 bg-slate-900/60 backdrop-blur-sm">
          <EvidencePanel evidenceCard={lastAssistantMessage.evidenceCard} />
        </div>
      )}
    </div>
  );
}
