import { useState } from "react";
import { Homepage } from "./components/Homepage";
import { Dashboard } from "./components/Dashboard";
import { FilterState } from "./components/FilterPanel";
import { spaceBiologyAPI, detectDomain, getDomainIcon } from "./services/api";

export interface Thread {
  id: string;
  title: string;
  icon: string;
  messages: Message[];
  lastActivity: Date;
  appliedFilters?: FilterState;
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  evidenceCard?: EvidenceCard;
}

export interface EvidenceCard {
  impacts: string[];
  mechanisms: string[];
  methods: string[];
  countermeasures: string[];
  caveats: string[];
  citations: Citation[];
}

export interface Citation {
  id: string;
  title: string;
  authors: string;
  pmcId?: string;
  snippet: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<"homepage" | "dashboard">(
    "homepage"
  );
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const handleStartConversation = (
    query: string,
    domain?: string,
    filters?: FilterState
  ) => {
    // Auto-detect domain using API service
    if (!domain) {
      domain = detectDomain(query, filters);
    }

    const newThread: Thread = {
      id: Date.now().toString(),
      title: query.slice(0, 50) + (query.length > 50 ? "..." : ""),
      icon: getDomainIcon(domain),
      messages: [
        {
          id: Date.now().toString(),
          type: "user",
          content: query,
          timestamp: new Date(),
        },
      ],
      lastActivity: new Date(),
      appliedFilters: filters,
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setCurrentView("dashboard");
  };

  const handleSendMessage = async (
    threadId: string,
    message: string,
    filters?: FilterState
  ) => {
    // Add user message immediately
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          const newMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: message,
            timestamp: new Date(),
          };
          return {
            ...thread,
            messages: [...thread.messages, newMessage],
            lastActivity: new Date(),
            appliedFilters: filters,
          };
        }
        return thread;
      })
    );

    // Make API call for AI response
    try {
      const domain = detectDomain(message, filters);
      const apiResponse = await spaceBiologyAPI.querySpaceBiology({
        query: message,
        domain,
        filters,
      });

      // Add AI response from API
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: apiResponse.summary,
              timestamp: new Date(),
              evidenceCard: apiResponse.evidenceCard,
            };
            return {
              ...thread,
              messages: [...thread.messages, aiMessage],
              lastActivity: new Date(),
            };
          }
          return thread;
        })
      );
    } catch (error) {
      console.error("API call failed:", error);

      // Add error message to chat
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content:
                "Sorry, I encountered an error while processing your request. Please try again later.",
              timestamp: new Date(),
            };
            return {
              ...thread,
              messages: [...thread.messages, errorMessage],
              lastActivity: new Date(),
            };
          }
          return thread;
        })
      );
    }
  };

  // Mock functions removed - now using real API integration

  if (currentView === "homepage") {
    return (
      <Homepage
        onStartConversation={handleStartConversation}
        onNavigateToDashboard={() => setCurrentView("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      threads={threads}
      activeThreadId={activeThreadId}
      onSelectThread={setActiveThreadId}
      onSendMessage={handleSendMessage}
      onNavigateToHomepage={() => setCurrentView("homepage")}
    />
  );
}
