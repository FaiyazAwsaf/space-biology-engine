// Static knowledge graphs for the 6 space biology domains

export interface KnowledgeNode {
  id: string;
  label: string;
  type: "concept" | "mechanism" | "outcome" | "countermeasure";
  description: string;
  connections: string[]; // IDs of connected nodes
}

export interface KnowledgeGraph {
  domain: string;
  icon: string;
  nodes: KnowledgeNode[];
  description: string;
}

// 🦴 BONE DOMAIN KNOWLEDGE GRAPH
export const boneKnowledgeGraph: KnowledgeGraph = {
  domain: "bone",
  icon: "🦴",
  description: "Bone and musculoskeletal system responses to microgravity",
  nodes: [
    {
      id: "microgravity",
      label: "Microgravity Environment",
      type: "concept",
      description: "Absence of gravitational loading on skeletal system",
      connections: ["unloading", "fluid_shifts", "calcium_loss"],
    },
    {
      id: "unloading",
      label: "Mechanical Unloading",
      type: "mechanism",
      description: "Loss of weight-bearing forces on bones",
      connections: ["osteoblast_decrease", "osteoclast_increase", "bone_loss"],
    },
    {
      id: "osteoblast_decrease",
      label: "Decreased Osteoblast Activity",
      type: "mechanism",
      description: "Reduced bone formation due to lack of mechanical stimuli",
      connections: ["bone_loss", "wnt_signaling"],
    },
    {
      id: "osteoclast_increase",
      label: "Increased Osteoclast Activity",
      type: "mechanism",
      description: "Enhanced bone resorption via RANKL/OPG pathway",
      connections: ["bone_loss", "calcium_release"],
    },
    {
      id: "bone_loss",
      label: "Bone Mineral Density Loss",
      type: "outcome",
      description: "1-2% BMD loss per month in weight-bearing bones",
      connections: [
        "fracture_risk",
        "exercise_countermeasure",
        "bisphosphonates",
      ],
    },
    {
      id: "exercise_countermeasure",
      label: "ARED Exercise Protocol",
      type: "countermeasure",
      description: "Advanced Resistive Exercise Device - 2.5hr daily",
      connections: ["bone_preservation", "muscle_maintenance"],
    },
    {
      id: "bisphosphonates",
      label: "Bisphosphonate Therapy",
      type: "countermeasure",
      description: "Alendronate administration to reduce bone resorption",
      connections: ["osteoclast_inhibition", "bone_preservation"],
    },
  ],
};

// 🧬 IMMUNE DOMAIN KNOWLEDGE GRAPH
export const immuneKnowledgeGraph: KnowledgeGraph = {
  domain: "immune",
  icon: "🧬",
  description: "Immune system alterations in space environment",
  nodes: [
    {
      id: "space_environment",
      label: "Space Environment",
      type: "concept",
      description: "Combined effects of microgravity, radiation, and stress",
      connections: [
        "immune_suppression",
        "stress_response",
        "radiation_exposure",
      ],
    },
    {
      id: "immune_suppression",
      label: "Immune System Suppression",
      type: "mechanism",
      description: "Decreased immune cell function and proliferation",
      connections: [
        "t_cell_dysfunction",
        "cytokine_imbalance",
        "infection_risk",
      ],
    },
    {
      id: "t_cell_dysfunction",
      label: "T-Cell Dysfunction",
      type: "mechanism",
      description: "Altered T-cell activation and proliferation",
      connections: ["immune_suppression", "viral_reactivation"],
    },
    {
      id: "viral_reactivation",
      label: "Viral Reactivation",
      type: "outcome",
      description: "Reactivation of latent viruses (EBV, CMV, VZV)",
      connections: ["antiviral_therapy", "immune_monitoring"],
    },
    {
      id: "antiviral_therapy",
      label: "Antiviral Medications",
      type: "countermeasure",
      description: "Prophylactic antiviral treatment protocols",
      connections: ["viral_suppression"],
    },
    {
      id: "immune_monitoring",
      label: "Immune Function Monitoring",
      type: "countermeasure",
      description: "Regular assessment of immune biomarkers",
      connections: ["early_detection"],
    },
  ],
};

// 🧠 NEURO DOMAIN KNOWLEDGE GRAPH
export const neuroKnowledgeGraph: KnowledgeGraph = {
  domain: "neuro",
  icon: "🧠",
  description: "Neurological and cognitive impacts of spaceflight",
  nodes: [
    {
      id: "microgravity_neuro",
      label: "Microgravity Effects on Brain",
      type: "concept",
      description: "Structural and functional brain changes in weightlessness",
      connections: [
        "brain_volume_changes",
        "vestibular_changes",
        "cognitive_changes",
      ],
    },
    {
      id: "brain_volume_changes",
      label: "Brain Volume Changes",
      type: "mechanism",
      description: "Upward fluid shift causing brain swelling",
      connections: ["intracranial_pressure", "vision_changes"],
    },
    {
      id: "vestibular_changes",
      label: "Vestibular System Adaptation",
      type: "mechanism",
      description: "Inner ear adaptation to microgravity environment",
      connections: ["space_motion_sickness", "spatial_disorientation"],
    },
    {
      id: "space_motion_sickness",
      label: "Space Motion Sickness",
      type: "outcome",
      description: "Nausea and disorientation in early spaceflight",
      connections: ["antiemetic_medication", "adaptation_training"],
    },
    {
      id: "cognitive_changes",
      label: "Cognitive Performance Changes",
      type: "outcome",
      description: "Alterations in attention, memory, and decision-making",
      connections: ["cognitive_training", "sleep_optimization"],
    },
    {
      id: "cognitive_training",
      label: "Cognitive Countermeasures",
      type: "countermeasure",
      description: "Training programs to maintain cognitive function",
      connections: ["performance_maintenance"],
    },
  ],
};

// 🌱 PLANTS DOMAIN KNOWLEDGE GRAPH
export const plantsKnowledgeGraph: KnowledgeGraph = {
  domain: "plants",
  icon: "🌱",
  description: "Plant biology and growth in microgravity conditions",
  nodes: [
    {
      id: "microgravity_plants",
      label: "Microgravity Plant Environment",
      type: "concept",
      description: "Loss of gravitational cues for plant growth orientation",
      connections: [
        "gravitropism_loss",
        "cell_wall_changes",
        "gene_expression_changes",
      ],
    },
    {
      id: "gravitropism_loss",
      label: "Loss of Gravitropism",
      type: "mechanism",
      description:
        "Inability to sense gravity direction for root/shoot orientation",
      connections: ["random_growth", "starch_granule_disruption"],
    },
    {
      id: "starch_granule_disruption",
      label: "Starch Granule (Amyloplast) Disruption",
      type: "mechanism",
      description: "Loss of statoliths that normally sense gravity",
      connections: ["gravitropism_loss", "auxin_transport_changes"],
    },
    {
      id: "auxin_transport_changes",
      label: "Altered Auxin Transport",
      type: "mechanism",
      description: "Randomized auxin distribution affecting growth patterns",
      connections: ["growth_abnormalities", "cell_elongation_changes"],
    },
    {
      id: "growth_abnormalities",
      label: "Abnormal Growth Patterns",
      type: "outcome",
      description: "Reduced growth rates and altered morphology",
      connections: ["artificial_gravity", "light_stimulation"],
    },
    {
      id: "artificial_gravity",
      label: "Centrifugal Force Application",
      type: "countermeasure",
      description: "Rotating growth chambers to simulate gravity",
      connections: ["growth_normalization"],
    },
    {
      id: "light_stimulation",
      label: "Enhanced Light Cues",
      type: "countermeasure",
      description: "LED lighting to enhance phototropism responses",
      connections: ["directional_growth"],
    },
  ],
};

// 🦠 MICROBIOME DOMAIN KNOWLEDGE GRAPH
export const microbiomeKnowledgeGraph: KnowledgeGraph = {
  domain: "microbiome",
  icon: "🦠",
  description: "Microbial ecosystem changes in space environment",
  nodes: [
    {
      id: "space_microbiome",
      label: "Space Microbiome Environment",
      type: "concept",
      description: "Altered microbial communities in spacecraft and human body",
      connections: [
        "microbial_selection",
        "biofilm_formation",
        "pathogen_virulence",
      ],
    },
    {
      id: "microbial_selection",
      label: "Microbial Selection Pressure",
      type: "mechanism",
      description: "Environmental factors selecting for specific microbes",
      connections: ["antibiotic_resistance", "virulence_increase"],
    },
    {
      id: "biofilm_formation",
      label: "Enhanced Biofilm Formation",
      type: "mechanism",
      description: "Increased biofilm production in microgravity",
      connections: ["surface_contamination", "antimicrobial_resistance"],
    },
    {
      id: "pathogen_virulence",
      label: "Increased Pathogen Virulence",
      type: "outcome",
      description: "Enhanced virulence of pathogenic bacteria in space",
      connections: ["infection_risk", "antimicrobial_protocols"],
    },
    {
      id: "gut_microbiome_changes",
      label: "Gut Microbiome Alterations",
      type: "outcome",
      description: "Changes in human gut microbial composition",
      connections: ["digestive_issues", "probiotic_supplementation"],
    },
    {
      id: "antimicrobial_protocols",
      label: "Enhanced Cleaning Protocols",
      type: "countermeasure",
      description: "Intensified surface disinfection procedures",
      connections: ["contamination_control"],
    },
    {
      id: "probiotic_supplementation",
      label: "Probiotic Interventions",
      type: "countermeasure",
      description: "Targeted probiotic supplementation for gut health",
      connections: ["microbiome_restoration"],
    },
  ],
};

// ⚙️ METHODS DOMAIN KNOWLEDGE GRAPH
export const methodsKnowledgeGraph: KnowledgeGraph = {
  domain: "methods",
  icon: "⚙️",
  description: "Research methodologies and techniques for space biology",
  nodes: [
    {
      id: "space_research_methods",
      label: "Space Biology Research Methods",
      type: "concept",
      description: "Specialized techniques for studying biology in space",
      connections: [
        "ground_analog",
        "flight_experiment",
        "computational_modeling",
      ],
    },
    {
      id: "ground_analog",
      label: "Ground-Based Analog Studies",
      type: "mechanism",
      description: "Simulated microgravity using clinostats, bed rest, etc.",
      connections: [
        "hindlimb_suspension",
        "rotating_wall_vessel",
        "bed_rest_studies",
      ],
    },
    {
      id: "flight_experiment",
      label: "Spaceflight Experiments",
      type: "mechanism",
      description: "Direct experiments conducted in space environment",
      connections: ["iss_research", "automated_systems", "sample_return"],
    },
    {
      id: "computational_modeling",
      label: "Computational Biology Models",
      type: "mechanism",
      description: "Mathematical models predicting space biology responses",
      connections: ["systems_biology", "machine_learning", "predictive_models"],
    },
    {
      id: "omics_technologies",
      label: "Multi-Omics Approaches",
      type: "outcome",
      description: "Genomics, proteomics, metabolomics integration",
      connections: ["biomarker_discovery", "pathway_analysis"],
    },
    {
      id: "biomarker_discovery",
      label: "Biomarker Identification",
      type: "countermeasure",
      description: "Identifying molecular indicators of space adaptation",
      connections: ["early_detection", "personalized_medicine"],
    },
  ],
};

// Export all knowledge graphs
export const knowledgeGraphs = {
  bone: boneKnowledgeGraph,
  immune: immuneKnowledgeGraph,
  neuro: neuroKnowledgeGraph,
  plants: plantsKnowledgeGraph,
  microbiome: microbiomeKnowledgeGraph,
  methods: methodsKnowledgeGraph,
};

// Helper function to get knowledge graph by domain
export const getKnowledgeGraph = (domain: string): KnowledgeGraph | null => {
  return knowledgeGraphs[domain as keyof typeof knowledgeGraphs] || null;
};
