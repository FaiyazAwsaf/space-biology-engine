// API service for Space Biology Backend Integration
// Handles communication with the FastAPI hybrid RAG system

export interface APIQuery {
  question: string;
  filters?: {
    organism?: string[];
    exposureType?: string[];
    tissueSystem?: string[];
    duration?: string[];
    studyType?: string[];
    missionContext?: string[];
  };
}

export interface APIResponse {
  answer: string;
  source_type: string;
  confidence_warning: boolean;
  citations: Citation[];
  knowledge_graph_data: Record<string, any>;
}

export interface Citation {
  source: string;
  filename: string;
  chunk_index: number;
  text: string;
}

class SpaceBiologyAPI {
  private baseURL: string;

  constructor() {
    // Use environment variable or fallback to localhost for development
    this.baseURL =
      (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";
  }

  /**
   * Query the space biology knowledge base
   */
  async queryKnowledgeBase(query: APIQuery): Promise<APIResponse> {
    try {
      const response = await fetch(`${this.baseURL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to query knowledge base: ${error.message}`
          : "Unknown API error occurred"
      );
    }
  }

  /**
   * Health check endpoint to verify backend connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  /**
   * Get available domains from the backend
   */
  async getDomains(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/domains`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.domains || [];
    } catch (error) {
      console.error("Failed to fetch domains:", error);
      // Return default domains as fallback
      return ["bone", "immune", "neuro", "plants", "microbiome", "methods"];
    }
  }
}

// Create singleton instance
export const spaceBiologyAPI = new SpaceBiologyAPI();

// Export default for easy importing
export default spaceBiologyAPI;
