import { FilterState } from "../components/FilterPanel";
import { EvidenceCard } from "../App";

// API Response interface matching your backend structure
export interface SpaceBiologyAPIResponse {
  summary: string;
  evidenceCard: EvidenceCard;
  domain: "bone" | "immune" | "neuro" | "plants" | "microbiome" | "methods";
}

// API Request interface
export interface SpaceBiologyAPIRequest {
  query: string;
  domain?: string;
  filters?: FilterState;
}

class SpaceBiologyAPI {
  private baseURL: string;

  constructor() {
    // Set your API base URL here - you can change this to your backend URL
    this.baseURL = "http://localhost:3001/api";
  }

  /**
   * Send a POST request to get AI response for space biology query
   */
  async querySpaceBiology(
    request: SpaceBiologyAPIRequest
  ): Promise<SpaceBiologyAPIResponse> {
    try {
      const response = await fetch(`${this.baseURL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SpaceBiologyAPIResponse = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  /**
   * Get domain-specific knowledge graph data (static)
   */
  async getKnowledgeGraph(domain: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseURL}/knowledge-graph/${domain}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Knowledge graph request failed:", error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
      });
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const spaceBiologyAPI = new SpaceBiologyAPI();

// Domain detection helper (moved from App.tsx)
export const detectDomain = (query: string, filters?: FilterState): string => {
  // If filters are provided, use them to influence domain detection
  if (filters) {
    if (filters.tissueSystem.includes("bone")) return "bone";
    if (filters.tissueSystem.includes("muscle")) return "bone";
    if (filters.tissueSystem.includes("immune")) return "immune";
    if (filters.tissueSystem.includes("brain_retina")) return "neuro";
    if (filters.tissueSystem.includes("plant_root_leaf")) return "plants";
    if (filters.tissueSystem.includes("microbiome")) return "microbiome";
    if (filters.studyType.includes("review_method")) return "methods";
  }

  // Auto-detect domain from query content
  const lowerQuery = query.toLowerCase();
  if (
    lowerQuery.includes("bone") ||
    lowerQuery.includes("muscle") ||
    lowerQuery.includes("skeletal")
  )
    return "bone";
  if (lowerQuery.includes("immune") || lowerQuery.includes("antibody"))
    return "immune";
  if (
    lowerQuery.includes("neuro") ||
    lowerQuery.includes("brain") ||
    lowerQuery.includes("circadian")
  )
    return "neuro";
  if (
    lowerQuery.includes("plant") ||
    lowerQuery.includes("root") ||
    lowerQuery.includes("growth")
  )
    return "plants";
  if (lowerQuery.includes("microbiome") || lowerQuery.includes("bacteria"))
    return "microbiome";
  if (lowerQuery.includes("method") || lowerQuery.includes("technique"))
    return "methods";

  // Default fallback
  return "methods";
};

// Domain icon mapping
export const getDomainIcon = (domain: string): string => {
  const iconMap: { [key: string]: string } = {
    bone: "🦴",
    immune: "🧬",
    neuro: "🧠",
    plants: "🌱",
    microbiome: "🦠",
    methods: "⚙️",
  };
  return iconMap[domain] || "🔬";
};
