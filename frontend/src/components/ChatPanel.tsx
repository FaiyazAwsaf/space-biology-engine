import { useState, useRef, useEffect } from "react";
import { Thread } from "../App";
import {
  Send,
  User,
  Bot,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { SearchBox } from "./SearchBox";
import { FilterState } from "./FilterPanel";

interface ChatPanelProps {
  thread: Thread;
  onSendMessage: (
    threadId: string,
    message: string,
    filters?: FilterState,
  ) => void;
}

export function ChatPanel({
  thread,
  onSendMessage,
}: ChatPanelProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [showOffTopicDialog, setShowOffTopicDialog] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [thread.messages]);

  const handleSendMessage = (
    message: string,
    filters?: FilterState,
  ) => {
    if (message.trim()) {
      // Simulate off-topic detection (simplified)
      const isOffTopic =
        message.toLowerCase().includes("weather") ||
        message.toLowerCase().includes("sports") ||
        message.toLowerCase().includes("cooking");

      if (isOffTopic) {
        setShowOffTopicDialog(true);
        return;
      }

      setIsLoading(true);
      onSendMessage(thread.id, message.trim(), filters);
      setInputMessage("");

      // Reset loading state after AI response
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleLegacySendMessage = () => {
    handleSendMessage(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleLegacySendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/40 backdrop-blur-sm relative">
      {/* Bio-pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 border border-emerald-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 border border-cyan-400 rotate-45"></div>
      </div>

      {/* Chat Header */}
      <div className="relative p-4 border-b border-emerald-900/30 bg-slate-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="text-xl p-2 bg-slate-800/50 rounded-lg border border-emerald-500/20">
            {thread.icon}
          </div>
          <div>
            <h3 className="text-emerald-100">{thread.title}</h3>
            <div className="text-emerald-400/70 text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              {thread.messages.length} messages
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.type === "assistant" && (
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-2xl ${message.type === "user" ? "order-1" : ""}`}
            >
              <div
                className={`
                p-4 rounded-xl backdrop-blur-sm border
                ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white ml-auto shadow-lg shadow-emerald-500/20 border-emerald-500/30"
                    : "bg-slate-800/60 text-emerald-100 border-emerald-500/20"
                }
              `}
              >
                <p className="leading-relaxed">
                  {message.content}
                  {/* Add inline citations for assistant messages */}
                  {message.type === "assistant" &&
                    message.evidenceCard &&
                    message.evidenceCard.citations.length >
                      0 && (
                      <span className="ml-2">
                        <sup className="text-cyan-300 hover:text-cyan-200 cursor-pointer text-xs">
                          [
                          {message.evidenceCard.citations
                            .map((_, index) => index + 1)
                            .join(",")}
                          ]
                        </sup>
                      </span>
                    )}
                </p>
              </div>

              {/* Citations Snippets - Outside message bubble */}
              {message.type === "assistant" &&
                message.evidenceCard &&
                message.evidenceCard.citations.length > 0 && (
                  <div className="mt-3 bg-slate-900/40 rounded-xl border border-emerald-500/10 p-3">
                    <div className="text-xs text-emerald-400/80 mb-2 flex items-center gap-1">
                      <span>📚</span>
                      <span>Evidence Snippets</span>
                    </div>
                    <div className="space-y-2">
                      {message.evidenceCard.citations.map(
                        (citation, index) => (
                          <div
                            key={citation.id}
                            className="p-2 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/20"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-cyan-300 text-xs font-mono bg-cyan-500/20 px-1.5 py-0.5 rounded">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-cyan-100/90 text-xs leading-relaxed">
                                  "{citation.snippet}"
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                  <p className="text-cyan-300/70 text-xs">
                                    {citation.authors}
                                  </p>
                                  {citation.pmcId && (
                                    <span className="bg-cyan-500/15 border border-cyan-500/30 rounded px-1.5 py-0.5">
                                      <span className="text-cyan-300 text-xs">
                                        {citation.pmcId}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              <div className="mt-1 text-xs text-emerald-400/70 flex items-center gap-2">
                {message.type === "user" && (
                  <User className="w-3 h-3" />
                )}
                <span>{formatTime(message.timestamp)}</span>
              </div>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 bg-slate-700/60 border border-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <User className="w-4 h-4 text-emerald-300" />
              </div>
            )}
          </div>
        ))}

        {/* Loading message */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
              <Bot className="w-4 h-4 text-white" />
            </div>

            <div className="max-w-2xl">
              <div className="p-4 rounded-xl backdrop-blur-sm border bg-slate-800/60 text-emerald-100 border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-emerald-300/80">
                    Searching PubSpace...
                  </span>
                </div>
                <div className="mt-2 text-sm text-emerald-400/70">
                  Analyzing space biology research papers
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Off-topic Dialog */}
      {showOffTopicDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 max-w-md mx-4 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              </div>
              <div>
                <h3 className="text-emerald-100 mb-2">
                  Off-topic Question Detected
                </h3>
                <p className="text-emerald-200/80 text-sm leading-relaxed">
                  This question seems unrelated to space
                  biology. Would you like to start a new
                  conversation channel?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onSendMessage(thread.id, inputMessage.trim());
                  setInputMessage("");
                  setShowOffTopicDialog(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-lg transition-all duration-200"
              >
                Continue Here
              </button>
              <button
                onClick={() => {
                  // Would create new channel in full implementation
                  setShowOffTopicDialog(false);
                  setInputMessage("");
                }}
                className="px-4 py-2 bg-slate-700/60 hover:bg-slate-600/60 text-emerald-200 rounded-lg border border-emerald-700/30 transition-all duration-200"
              >
                New Channel
              </button>
              <button
                onClick={() => setShowOffTopicDialog(false)}
                className="px-4 py-2 text-emerald-400/70 hover:text-emerald-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Suggestions */}
      <div className="relative px-4 py-3 bg-slate-800/40 backdrop-blur-sm border-t border-emerald-900/20">
        <div className="flex flex-wrap gap-2 mb-2">
          {[
            "→ Compare with humans",
            "→ Show countermeasures",
            "→ Explore mechanisms",
            "→ View similar studies",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() =>
                handleSendMessage(suggestion.replace("→ ", ""))
              }
              className="px-3 py-1.5 bg-emerald-900/20 hover:bg-emerald-800/30 text-emerald-300 hover:text-emerald-200 text-sm rounded-full border border-emerald-700/30 hover:border-emerald-600/40 transition-all duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="relative p-4 border-t border-emerald-900/30 bg-slate-800/60 backdrop-blur-sm">
        {/* Organic connection lines */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>

        <SearchBox
          value={inputMessage}
          onChange={setInputMessage}
          onSearch={handleSendMessage}
          placeholder="Ask a follow-up question about space biology..."
          showFilters={false}
        />
      </div>
    </div>
  );
}