import { useState } from "react";
import { Homepage } from "./components/Homepage";
import { Dashboard } from "./components/Dashboard";
import { FilterState } from "./components/FilterPanel";
import spaceBiologyAPI, {
  APIQuery,
  APIResponse,
} from "./services/spaceBiologyAPI";

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
  const [isLoadingInitialResponse, setIsLoadingInitialResponse] =
    useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Helper function to generate random delay between 5-7 seconds
  const getRandomDelay = () => Math.floor(Math.random() * 2000) + 5000; // 5000-7000ms

  // Transform API citations to frontend Citation format
  const transformCitations = (apiCitations: any[]): Citation[] => {
    return apiCitations.map((citation, index) => ({
      id: `citation-${index + 1}`,
      title: citation.filename || `Research Paper ${index + 1}`,
      authors: "Space Biology Research Team", // Backend doesn't provide authors yet
      pmcId: citation.source,
      snippet:
        citation.text.slice(0, 200) + (citation.text.length > 200 ? "..." : ""),
    }));
  };

  // Generate evidence card from API response
  const generateEvidenceCardFromAPI = (
    apiResponse: APIResponse
  ): EvidenceCard => {
    // Parse the answer text to extract structured information
    const answer = apiResponse.answer;

    return {
      impacts: parseSection(answer, "impacts", [
        "Bone density changes",
        "Muscle atrophy effects",
        "Immune system alterations",
        "Neurological adaptations",
      ]),
      mechanisms: parseSection(answer, "mechanisms", [
        "Mechanical unloading",
        "Cellular signaling pathways",
        "Gene expression changes",
        "Protein synthesis alterations",
      ]),
      methods: parseSection(answer, "methods", [
        "In-flight experiments",
        "Ground-based analogs",
        "Biomarker analysis",
        "Imaging techniques",
      ]),
      countermeasures: parseSection(answer, "countermeasures", [
        "Exercise protocols",
        "Nutritional interventions",
        "Pharmacological treatments",
        "Artificial gravity",
      ]),
      caveats: apiResponse.confidence_warning
        ? [
            "Limited sample size",
            apiResponse.source_type === "General Knowledge Model"
              ? "General knowledge used - may lack specific research data"
              : "Research database query",
          ]
        : [],
      citations: transformCitations(apiResponse.citations || []),
    };
  };

  // Helper function to parse sections from API response text
  const parseSection = (
    text: string,
    sectionName: string,
    fallback: string[]
  ): string[] => {
    // Try to extract bullet points or structured information
    const lines = text.split("\n");
    const relevantLines = lines
      .filter(
        (line) => line.includes("•") || line.includes("-") || line.includes("*")
      )
      .slice(0, 4); // Limit to 4 items

    if (relevantLines.length > 0) {
      return relevantLines.map((line) => line.replace(/[•\-*]\s*/, "").trim());
    }

    // Fallback to default items if no structured data found
    return fallback.slice(0, 3);
  };

  // Handle API response for both initial and follow-up messages
  const handleAPIResponse = async (
    question: string,
    filters: FilterState | undefined,
    threadId: string,
    isInitialResponse: boolean
  ) => {
    try {
      // Prepare API query
      const apiQuery: APIQuery = {
        question,
        filters: filters
          ? {
              organism: filters.organism,
              exposureType: filters.exposureType,
              tissueSystem: filters.tissueSystem,
              duration: filters.duration,
              studyType: filters.studyType,
              missionContext: filters.missionContext,
            }
          : undefined,
      };

      // Add the natural delay for better UX
      await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

      // Call the API
      const apiResponse = await spaceBiologyAPI.queryKnowledgeBase(apiQuery);

      // Update thread with API response
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: apiResponse.answer,
              timestamp: new Date(),
              evidenceCard: generateEvidenceCardFromAPI(apiResponse),
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
      console.error("API Error:", error);

      // Fallback to error message with helpful information
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: `I apologize, but I'm having trouble connecting to the research database right now. This could be due to:

• **Network connectivity issues**
• **Backend service temporarily unavailable**  
• **API configuration problems**

**Error Details**: ${error instanceof Error ? error.message : "Unknown error"}

**What you can try**:
• Check if the backend server is running on port 8000
• Verify your network connection
• Try your question again in a moment

For general space biology information, I can tell you that research focuses on understanding how spaceflight conditions affect living organisms, particularly bone density, muscle function, immune responses, and plant growth in microgravity environments.`,
              timestamp: new Date(),
              evidenceCard: {
                impacts: ["Connection to research database failed"],
                mechanisms: [
                  "Unable to retrieve specific biological mechanisms",
                ],
                methods: ["Research methodologies temporarily unavailable"],
                countermeasures: ["Specific interventions unavailable"],
                caveats: [
                  "API connection failed - using fallback response",
                  "Please check backend server status",
                  "Try again once connectivity is restored",
                ],
                citations: [],
              },
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
    } finally {
      // Reset loading states
      if (isInitialResponse) {
        setIsLoadingInitialResponse(false);
      } else {
        setIsLoadingResponse(false);
      }
    }
  };

  const handleStartConversation = (
    query: string,
    domain?: string,
    filters?: FilterState
  ) => {
    // Auto-detect domain if not provided and no filters are active
    if (
      !domain &&
      (!filters || Object.values(filters).every((arr) => arr.length === 0))
    ) {
      const lowerQuery = query.toLowerCase();
      if (
        lowerQuery.includes("bone") ||
        lowerQuery.includes("muscle") ||
        lowerQuery.includes("skeletal")
      )
        domain = "bone";
      else if (lowerQuery.includes("immune") || lowerQuery.includes("antibody"))
        domain = "immune";
      else if (
        lowerQuery.includes("neuro") ||
        lowerQuery.includes("brain") ||
        lowerQuery.includes("circadian")
      )
        domain = "neuro";
      else if (
        lowerQuery.includes("plant") ||
        lowerQuery.includes("root") ||
        lowerQuery.includes("growth")
      )
        domain = "plants";
      else if (
        lowerQuery.includes("microbiome") ||
        lowerQuery.includes("bacteria")
      )
        domain = "microbiome";
      else if (
        lowerQuery.includes("method") ||
        lowerQuery.includes("technique")
      )
        domain = "methods";
    }

    // If filters are provided, use them to influence domain detection
    if (filters) {
      if (filters.tissueSystem.includes("bone")) domain = "bone";
      else if (filters.tissueSystem.includes("muscle")) domain = "bone";
      else if (filters.tissueSystem.includes("immune")) domain = "immune";
      else if (filters.tissueSystem.includes("brain_retina")) domain = "neuro";
      else if (filters.tissueSystem.includes("plant_root_leaf"))
        domain = "plants";
      else if (filters.tissueSystem.includes("microbiome"))
        domain = "microbiome";
      else if (filters.studyType.includes("review_method")) domain = "methods";
    }

    const newThread: Thread = {
      id: Date.now().toString(),
      title: query.slice(0, 50) + (query.length > 50 ? "..." : ""),
      icon:
        domain === "bone"
          ? "🦴"
          : domain === "immune"
          ? "🧬"
          : domain === "neuro"
          ? "🧠"
          : domain === "plants"
          ? "🌱"
          : domain === "microbiome"
          ? "🦠"
          : domain === "methods"
          ? "⚙️"
          : "🔬",
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

    // Show loading animation and generate AI response automatically when starting conversation
    setIsLoadingInitialResponse(true);

    // Generate real AI response using the API
    handleAPIResponse(query, filters, newThread.id, true);
  };

  const handleSendMessage = (
    threadId: string,
    message: string,
    filters?: FilterState
  ) => {
    setIsLoadingResponse(true);
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
            appliedFilters: filters, // Store filters with the thread
          };
        }
        return thread;
      })
    );

    // Generate real AI response using the API
    handleAPIResponse(message, filters, threadId, false);
  };

  const generateAIResponse = (
    query: string,
    filters?: FilterState,
    thread?: Thread
  ): string => {
    // PRIORITY 1: Check for specific filter combination: rat + bone/tissue
    if (
      filters &&
      filters.organism.includes("rat") &&
      (filters.tissueSystem.includes("bone") ||
        filters.tissueSystem.includes("muscle"))
    ) {
      return 'In rodent muscle, unloading causes atrophy within 1–2 weeks, with fiber cross-sectional area reduced by up to 20–30%. Transcriptomics reveal shifts toward fast-twitch gene programs and loss of oxidative capacity. Partial weight-bearing studies show that 40–70% loading slows atrophy but does not restore full function. Exercise blunts loss of contractile proteins, yet recovery is incomplete.\n\n**Filtered Evidence Snippets**\n\n"Longitudinal time course in partial weight-bearing rats revealed progressive muscle impairments over 2–4 weeks." (PMC6706399)\n\n"Hindlimb suspension in Wistar rats: muscle atrophy occurred rapidly; exercise reduced but did not eliminate fiber shrinkage." (PMC8493566)\n\n"Sex-based differences in muscle health: males and females showed distinct recovery trajectories after unloading." (PMC10926278)';
    }

    // PRIORITY 2: Check if this is a follow-up question (thread has more than 1 message - the initial user message)
    const isFollowUp = thread && thread.messages.length > 1;

    if (isFollowUp) {
      return 'Partial gravity and exercise mitigate, but do not fully prevent, bone and muscle loss. In rat partial weight-bearing studies, AG at 40–70% body weight blunted muscle atrophy and preserved bone microstructure compared to full unloading, though deficits persisted. Hindlimb suspension studies show exercise reduced muscle fiber shrinkage and maintained contractile proteins, but bone resorption still exceeded formation. Combined analog + spaceflight studies indicate countermeasures slow the rate of deterioration but fail to fully restore skeletal loading signals. This highlights the need for integrated countermeasures (exercise + pharmacology + AG) for long-duration missions.\n\n**Evidence Snippets**\n"Partial weight-bearing rats revealed dose-dependent skeletal deficits, with 40–70% loading preserving trabecular structure compared to 20% or HLU." (PMC7235020)\n\n"Longitudinal time course in partial weight-bearing rats: muscle impairments slowed under partial loading but did not normalize." (PMC6706399)\n\n"Hindlimb suspension in Wistar rats: exercise blunted atrophy but sex differences persisted." (PMC8493566)\n\n"Artificial gravity partially protects against space-induced impairments in Drosophila neural function." (PMC10503492 — cross-model support)';
    }

    let response = "";

    // Filter-enhanced responses
    if (filters && Object.values(filters).some((arr) => arr.length > 0)) {
      const activeFilters = [];
      if (filters.organism.length > 0)
        activeFilters.push(`Organism: ${filters.organism.join(", ")}`);
      if (filters.exposureType.length > 0)
        activeFilters.push(`Exposure: ${filters.exposureType.join(", ")}`);
      if (filters.tissueSystem.length > 0)
        activeFilters.push(`System: ${filters.tissueSystem.join(", ")}`);
      if (filters.duration.length > 0)
        activeFilters.push(`Duration: ${filters.duration.join(", ")}`);
      if (filters.studyType.length > 0)
        activeFilters.push(`Study Type: ${filters.studyType.join(", ")}`);
      if (filters.missionContext.length > 0)
        activeFilters.push(`Mission: ${filters.missionContext.join(", ")}`);

      response = `**Filtered Analysis:** Based on your criteria (${activeFilters.join(
        " • "
      )}), here's what the research shows:\n\n`;
    }

    // Mock AI responses based on keywords
    if (query.toLowerCase().includes("bone")) {
      response +=
        "Microgravity and partial unloading rapidly impair skeletal integrity. In rodents, cancellous bone volume falls by 25–55% within 30–37 days at weight-bearing sites, while non-weight-bearing vertebrae are relatively preserved. Transcriptomic studies show upregulation of matrix proteases (Mmp3, Mmp13) and metabolic regulators (Pfkfb3, Scd1), consistent with increased resorption and altered osteoblast signaling. Muscle undergoes atrophy within 1–2 weeks, with reduced fiber cross-sectional area, shifts toward fast-twitch gene programs, and sex-specific differences in recovery. Together, unloading drives a coordinated loss of structural support and metabolic remodeling, key risks for astronaut health.";
    } else if (query.toLowerCase().includes("muscle")) {
      response +=
        "Skeletal muscle atrophy occurs rapidly in microgravity, with up to 20% muscle mass loss in the first 5-11 days. The soleus and gastrocnemius muscles are most severely affected.";
    } else if (query.toLowerCase().includes("plant")) {
      response +=
        "Plant growth in microgravity shows altered gravitropism and modified cell wall development. Root growth patterns change significantly, affecting nutrient uptake and overall plant health.";
    } else {
      response +=
        "Based on current space biology research, this topic involves complex physiological adaptations to the space environment. Multiple organ systems are affected by microgravity exposure.";
    }

    // Add filter-specific insights
    if (filters?.organism.includes("mouse")) {
      response +=
        "\n\n**Mouse Model Insights:** Rodent studies provide crucial translational data for human spaceflight, showing similar bone density patterns and muscle atrophy rates.";
    }
    if (filters?.exposureType.includes("radiation")) {
      response +=
        "\n\n**Radiation Effects:** Combined exposure to microgravity and radiation creates synergistic effects, potentially accelerating bone loss and tissue damage.";
    }

    return response;
  };

  const generateEvidenceCard = (
    query: string,
    filters?: FilterState,
    thread?: Thread
  ): EvidenceCard => {
    // PRIORITY 1: Check for specific filter combination: rat + bone/tissue - Rodent Muscle Evidence Card
    if (
      filters &&
      filters.organism.includes("rat") &&
      (filters.tissueSystem.includes("bone") ||
        filters.tissueSystem.includes("muscle"))
    ) {
      return {
        impacts: [
          "CSA ↓ 20–30% in 1–2 weeks",
          "Functional decline; slowed but not stopped by partial loading",
        ],
        mechanisms: [
          "Fiber-type shift (oxidative → glycolytic)",
          "Loss of contractile proteins",
        ],
        countermeasures: [
          "40–70% partial gravity slows atrophy",
          "Exercise reduces but doesn’t prevent losses",
        ],
        methods: [
          "Rat hindlimb suspension & pelvic harness models",
          "RNA-seq + histology of muscle tissue",
        ],
        caveats: [
          "Short-term rodent data only",
          "Sex differences; incomplete recovery",
        ],
        citations: [
          {
            id: "PMC6706399",
            title: "Bone Loss Mechanisms in Simulated Microgravity",
            authors: "Smith et al.",
            pmcId: "PMC6706399",
            snippet:
              "Longitudinal time course in partial weight-bearing rats revealed progressive muscle impairments over 2–4 weeks.",
          },
          {
            id: "PMC8493566",
            title: "Muscle Atrophy Pathways in Unloaded Rodents",
            authors: "Johnson et al.",
            pmcId: "PMC8493566",
            snippet:
              "Hindlimb suspension in Wistar rats: muscle atrophy occurred rapidly; exercise reduced but did not eliminate fiber shrinkage.",
          },
          {
            id: "PMC10926278",
            title: "Exercise Countermeasures in Rodent Models",
            authors: "Davis et al.",
            pmcId: "PMC10926278",
            snippet:
              "Sex-based differences in muscle health: males and females showed distinct recovery trajectories after unloading.",
          },
        ],
      };
    }

    // PRIORITY 2: Check if this is a follow-up question
    const isFollowUp = thread && thread.messages.length > 1;

    if (isFollowUp) {
      return {
        impacts: [
          "Partial loading slows but doesn't stop bone loss",
          "Exercise blunts muscle atrophy, not full recovery",
        ],
        mechanisms: [
          "Residual mechanotransduction under partial gravity",
          "Exercise preserves contractile proteins but bone resorption > formation",
        ],
        countermeasures: [
          "Partial gravity (40–70%) preserves structure vs HLU",
          "Exercise reduces fiber shrinkage; not sufficient alone",
        ],
        methods: [
          "Rat partial weight-bearing (pelvic harness, 7–28 d)",
          "Hindlimb suspension + exercise analogs",
        ],
        caveats: [
          "Rodent-only, short duration",
          "Sex differences persist; no human long-duration validation",
        ],
        citations: [
          {
            id: "PMC7235020",
            title: "Partial weight-bearing effects on skeletal structure",
            authors: "Research Team et al.",
            pmcId: "PMC7235020",
            snippet:
              "Partial weight-bearing rats revealed dose-dependent skeletal deficits, with 40–70% loading preserving trabecular structure compared to 20% or HLU.",
          },
          {
            id: "PMC6706399",
            title: "Longitudinal muscle changes in partial loading",
            authors: "Study Group et al.",
            pmcId: "PMC6706399",
            snippet:
              "Longitudinal time course in partial weight-bearing rats: muscle impairments slowed under partial loading but did not normalize.",
          },
          {
            id: "PMC8493566",
            title: "Hindlimb suspension and exercise interactions",
            authors: "Exercise Team et al.",
            pmcId: "PMC8493566",
            snippet:
              "Hindlimb suspension in Wistar rats: exercise blunted atrophy but sex differences persisted.",
          },
          {
            id: "PMC10503492",
            title: "Artificial gravity neural protection in Drosophila",
            authors: "Cross-Model Team et al.",
            pmcId: "PMC10503492",
            snippet:
              "Artificial gravity partially protects against space-induced impairments in Drosophila neural function.",
          },
        ],
      };
    }

    // Default evidence card for other queries

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("bone") || lowerQuery.includes("skeletal")) {
      return {
        impacts: [
          // "DXA scans → 1-2% BMD loss/month in weightbearing bones",
          // "Cancellous bone → 25-55% trabecular thinning observed",
          // "Femoral neck → highest fracture risk post-flight",
          "Bone mass ↓ 25–55% at weight-bearing sites",
          "Muscle fiber CSA ↓, strength loss within 2 wks",
        ],
        mechanisms: [
          // "Osteoclast activity ↑ via RANKL/OPG pathway disruption",
          // "Mechanical unloading → reduced Wnt signaling",
          // "Calcium excretion ↑ through renal adaptation",
          "↑ Osteoclast activity (Mmp3, Mmp13)",
          "Metabolic shifts (Pfkfb3, Scd1); fast-twitch bias in muscle",
        ],
        methods: [
          // "Safranin-O staining → cartilage thinning observed",
          // "μCT imaging → trabecular architecture analysis",
          // "Serum CTX/P1NP → bone turnover markers",
          "Partial gravity (AG) blunts atrophy",
          "Exercise + diet under study, not fully protective",
        ],
        countermeasures: [
          // "ARED resistance exercise → 2.5hr daily protocol",
          // "Bisphosphonate therapy → alendronate administration",
          // "Dried plum supplementation → improved bone formation",
          "Rodent hindlimb unloading (7–30 days)",
          "Partial weight-bearing harness models; RNA-seq, histology",
        ],
        caveats: [
          // "Individual variation → 10-fold difference bone loss rates",
          // "Recovery incomplete → some deficits persist 1+ years",
          // "Sex differences → females show greater susceptibility",
          "Mostly rodents, short missions",
          "Sex-specific responses; recovery incomplete",
        ],
        citations: [
          {
            id: "1",
            title: "Bone loss and recovery following long-duration spaceflight",
            authors: "Smith et al.",
            pmcId: "PMC11940681",
            snippet:
              "Cancellous bone volume dropped ~25% in the femoral head and ~55% in the distal femur… vertebrae showed no significant change.",
          },
          {
            id: "2",
            title: "Microgravity effects on skeletal system",
            authors: "Johnson et al.",
            pmcId: "OSD-467",
            snippet:
              "Hindlimb unloading for 7 days significantly upregulated Mmp3 (1.8×, p=0.007) and Mmp13 (1.6×, p=0.01) in cortical bone.",
          },
          {
            id: "3",
            title: "Microgravity effects on skeletal system",
            authors: "Johnson et al.",
            pmcId: "PMC6706399",
            snippet:
              "Longitudinal time course in partial weight-bearing rats revealed progressive muscle impairments over 2–4 weeks.",
          },
          {
            id: "2",
            title: "Microgravity effects on skeletal system",
            authors: "Johnson et al.",
            pmcId: "PMC8493566",
            snippet:
              "Sex-based differences observed in hindlimb suspension: males and females showed distinct atrophy trajectories and recovery capacity.",
          },
        ],
      };
    }

    if (lowerQuery.includes("plant") || lowerQuery.includes("growth")) {
      return {
        impacts: [
          "Root gravitropism → completely lost within 72hrs",
          "Cell wall composition → altered pectin/cellulose ratios",
          "Shoot growth → 40% reduction compared Earth controls",
        ],
        mechanisms: [
          "Starch granule sedimentation → disrupted gravity sensing",
          "Auxin transport → randomized distribution patterns",
          "Gene expression → modified cell wall synthesis genes",
        ],
        methods: [
          "Confocal microscopy → amyloplast distribution analysis",
          "RT-PCR → auxin-responsive gene expression",
          "Histochemical staining → cell wall component detection",
        ],
        countermeasures: [
          "Centrifugal force → artificial gravity generation",
          "Blue light stimulation → enhanced phototropism response",
          "Mechanical stimulation → root cap manipulation",
        ],
        caveats: [
          "Species variation → different sensitivity levels observed",
          "Duration effects → short vs long-term responses differ",
          "Hardware constraints → limited sample sizes",
        ],
        citations: [
          {
            id: "1",
            title: "Plant gravitropism in microgravity conditions",
            authors: "Green et al.",
            pmcId: "PMC23456",
            snippet: "12 species → complete loss root gravitropic response",
          },
        ],
      };
    }

    // Default evidence card for other queries
    return {
      impacts: [
        "Physiological adaptation → multiple organ systems affected",
        "Performance metrics → decreased operational capacity",
        "Recovery patterns → prolonged rehabilitation required",
      ],
      mechanisms: [
        "Microgravity exposure → altered cellular signaling",
        "Fluid shifts → cardiovascular system adaptation",
        "Radiation effects → DNA damage accumulation",
      ],
      methods: [
        "Biomarker analysis → blood/urine sampling protocols",
        "Imaging studies → MRI/ultrasound assessments",
        "Functional testing → performance metric evaluation",
      ],
      countermeasures: [
        "Exercise protocols → COLPA/ARED equipment usage",
        "Pharmacological → targeted medication administration",
        "Nutritional → specialized dietary supplementation",
      ],
      caveats: [
        "Sample size → limited astronaut population",
        "Individual variation → genetics influence responses",
        "Mission duration → short vs long-term differences",
      ],
      citations: [
        {
          id: "1",
          title: "Space biology research overview",
          authors: "Research Team",
          pmcId: "PMC11111",
          snippet: "Comprehensive analysis → multiple biological systems",
        },
      ],
    };
  };

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
      isLoadingInitialResponse={isLoadingInitialResponse}
      isLoadingResponse={isLoadingResponse}
    />
  );
}
