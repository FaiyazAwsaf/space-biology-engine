import { GraphData } from "../types/graph";

export const knowledgeGraphs: GraphData[] = [
  {
    id: "bone-radiation",
    title: "Bone & Radiation",
    subtitle: "Interactive Network Visualization • Bone Remodeling Pathway",
    nodes: [
      { id: "microgravity", label: "Microgravity", category: "space-exposure" },
      {
        id: "mechanical-unloading",
        label: "Mechanical unloading",
        category: "biological-mechanism",
      },
      {
        id: "osteoclast-activity",
        label: "Osteoclast activity ↑",
        category: "biological-mechanism",
      },
      {
        id: "bone-loss",
        label: "Bone loss (Femur/Distal)",
        category: "physiological-outcome",
      },
      {
        id: "bv-tv",
        label: "BV/TV ↓ (25–55%)",
        category: "physiological-outcome",
      },
      {
        id: "dried-plum",
        label: "Dried plum diet",
        category: "countermeasure",
      },
      { id: "radiation", label: "Radiation", category: "space-exposure" },
    ],
    connections: [
      { from: "microgravity", to: "mechanical-unloading", label: "induces" },
      {
        from: "mechanical-unloading",
        to: "osteoclast-activity",
        label: "drives",
      },
      { from: "osteoclast-activity", to: "bone-loss", label: "causes" },
      { from: "bone-loss", to: "bv-tv", label: "measured_by" },
      { from: "radiation", to: "bone-loss", label: "synergizes_with" },
      { from: "dried-plum", to: "bone-loss", label: "mitigates" },
    ],
  },
  {
    id: "immune-radiation",
    title: "Immune & Radiation",
    subtitle: "Interactive Network Visualization • Immune Response Pathway",
    nodes: [
      { id: "microgravity", label: "Microgravity", category: "space-exposure" },
      {
        id: "mechanical-unloading",
        label: "Mechanical unloading",
        category: "biological-mechanism",
      },
      {
        id: "osteoclast-activity",
        label: "Osteoclast activity ↑",
        category: "biological-mechanism",
      },
      {
        id: "bone-loss",
        label: "Bone loss (Femur/Distal)",
        category: "physiological-outcome",
      },
      {
        id: "bv-tv",
        label: "BV/TV ↓ (25–55%)",
        category: "physiological-outcome",
      },
      {
        id: "dried-plum",
        label: "Dried plum diet",
        category: "countermeasure",
      },
      { id: "radiation", label: "Radiation", category: "space-exposure" },
    ],
    connections: [
      { from: "microgravity", to: "mechanical-unloading", label: "induces" },
      {
        from: "mechanical-unloading",
        to: "osteoclast-activity",
        label: "drives",
      },
      { from: "osteoclast-activity", to: "bone-loss", label: "causes" },
      { from: "bone-loss", to: "bv-tv", label: "measured_by" },
      { from: "radiation", to: "bone-loss", label: "synergizes_with" },
      { from: "dried-plum", to: "bone-loss", label: "mitigates" },
    ],
  },
  {
    id: "neuro-circadian",
    title: "Neuro/Circadian",
    subtitle: "Interactive Network Visualization • Neurological Pathways",
    nodes: [
      { id: "microgravity", label: "Microgravity", category: "space-exposure" },
      {
        id: "ca-leak",
        label: "Ca²⁺ leak (SR/neurons)",
        category: "biological-mechanism",
      },
      {
        id: "neurotransmission",
        label: "Neurotransmission",
        category: "biological-mechanism",
      },
      {
        id: "circadian-clocks",
        label: "Circadian clocks",
        category: "biological-mechanism",
      },
      {
        id: "hypergravity",
        label: "Hypergravity / µg",
        category: "space-exposure",
      },
      {
        id: "neuroinflammation",
        label: "Neuroinflammation ↑",
        category: "physiological-outcome",
      },
      {
        id: "cognitive-decline",
        label: "Cognitive decline",
        category: "physiological-outcome",
      },
      {
        id: "artificial-gravity",
        label: "Artificial gravity (Countermeasure)",
        category: "countermeasure",
      },
      {
        id: "drosophila-rodent",
        label: "Drosophila / Rodent brains",
        category: "model",
      },
      {
        id: "human-risk",
        label: "Human risk",
        category: "physiological-outcome",
      },
    ],
    connections: [
      { from: "microgravity", to: "ca-leak", label: "induces" },
      { from: "ca-leak", to: "neurotransmission", label: "disrupts" },
      { from: "circadian-clocks", to: "hypergravity", label: "phase_shift" },
      {
        from: "neuroinflammation",
        to: "cognitive-decline",
        label: "associated_with",
      },
      {
        from: "artificial-gravity",
        to: "neuroinflammation",
        label: "mitigates",
      },
      { from: "drosophila-rodent", to: "human-risk", label: "models" },
    ],
  },
  {
    id: "plants-agriculture",
    title: "Plants/Space Agriculture",
    subtitle: "Interactive Network Visualization • Plant Biology in Space",
    nodes: [
      { id: "microgravity", label: "Microgravity", category: "space-exposure" },
      {
        id: "root-response",
        label: "Root transcriptional response",
        category: "biological-mechanism",
      },
      { id: "radiation", label: "Radiation", category: "space-exposure" },
      {
        id: "arabidopsis",
        label: "Arabidopsis transcriptome",
        category: "model",
      },
      {
        id: "lunar-regolith",
        label: "Lunar regolith growth",
        category: "space-exposure",
      },
      {
        id: "stress-pathways",
        label: "Stress pathways ↑",
        category: "physiological-outcome",
      },
      {
        id: "photosynthesis",
        label: "Photosynthesis genes",
        category: "biological-mechanism",
      },
      {
        id: "ug-stress",
        label: "µg stress",
        category: "physiological-outcome",
      },
      { id: "iss-veggie", label: "ISS Veggie lettuce", category: "model" },
      {
        id: "metatranscriptome",
        label: "Metatranscriptome",
        category: "method",
      },
      {
        id: "crop-selection",
        label: "Crop selection (Countermeasure)",
        category: "countermeasure",
      },
    ],
    connections: [
      { from: "microgravity", to: "root-response", label: "alters" },
      { from: "radiation", to: "arabidopsis", label: "stresses" },
      { from: "lunar-regolith", to: "stress-pathways", label: "induces" },
      { from: "photosynthesis", to: "ug-stress", label: "repressed_by" },
      { from: "iss-veggie", to: "metatranscriptome", label: "sequenced_by" },
      { from: "crop-selection", to: "stress-pathways", label: "improves" },
    ],
  },
  {
    id: "microbiome",
    title: "Microbiome",
    subtitle: "Interactive Network Visualization • Microbial Ecosystems",
    nodes: [
      { id: "spaceflight", label: "Spaceflight", category: "space-exposure" },
      {
        id: "gut-microbiome",
        label: "Gut microbiome",
        category: "biological-mechanism",
      },
      {
        id: "iss-environment",
        label: "ISS environment",
        category: "space-exposure",
      },
      {
        id: "amr-genes",
        label: "AMR genes",
        category: "physiological-outcome",
      },
      {
        id: "dust-surfaces",
        label: "Dust / surfaces",
        category: "space-exposure",
      },
      {
        id: "enterobacter",
        label: "Enterobacter & Klebsiella",
        category: "biological-mechanism",
      },
      {
        id: "metabolic-modeling",
        label: "Metabolic modeling",
        category: "method",
      },
      {
        id: "microbial-interactions",
        label: "Microbial interactions",
        category: "biological-mechanism",
      },
      {
        id: "fungal-species",
        label: "Fungal species",
        category: "biological-mechanism",
      },
      { id: "iss-air", label: "ISS air/surfaces", category: "space-exposure" },
      {
        id: "monitoring-probiotics",
        label: "Monitoring / probiotics (Countermeasure)",
        category: "countermeasure",
      },
    ],
    connections: [
      { from: "spaceflight", to: "gut-microbiome", label: "shifts" },
      { from: "iss-environment", to: "amr-genes", label: "harbors" },
      { from: "dust-surfaces", to: "enterobacter", label: "contain" },
      {
        from: "metabolic-modeling",
        to: "microbial-interactions",
        label: "reveals",
      },
      { from: "fungal-species", to: "iss-air", label: "persist_in" },
      { from: "monitoring-probiotics", to: "amr-genes", label: "mitigates" },
    ],
  },
  {
    id: "methods-validity",
    title: "Methods and Validity",
    subtitle: "Interactive Network Visualization • Research Methodology",
    nodes: [
      {
        id: "rnaseq-timing",
        label: "RNAseq sample timing",
        category: "method",
      },
      { id: "rodent-flight", label: "Rodent flight data", category: "model" },
      {
        id: "housing-type",
        label: "Housing type (VIV vs RH)",
        category: "method",
      },
      { id: "outcomes", label: "Outcomes", category: "physiological-outcome" },
      {
        id: "iss-analogs",
        label: "ISS vs Ground Analogs",
        category: "space-exposure",
      },
      {
        id: "gravity-profile",
        label: "Gravity profile",
        category: "space-exposure",
      },
      {
        id: "animal-enclosure",
        label: "Animal Enclosure Module",
        category: "method",
      },
      {
        id: "flights-35day",
        label: "35-day flights",
        category: "space-exposure",
      },
      { id: "open-science", label: "Open Science OSDR", category: "method" },
      { id: "data-reuse", label: "Data re-use", category: "method" },
      {
        id: "best-practice",
        label: "Best practice",
        category: "countermeasure",
      },
      {
        id: "evidence-confidence",
        label: "Evidence confidence",
        category: "physiological-outcome",
      },
    ],
    connections: [
      { from: "rnaseq-timing", to: "rodent-flight", label: "confounded" },
      { from: "housing-type", to: "outcomes", label: "biases" },
      { from: "iss-analogs", to: "gravity-profile", label: "differ_by" },
      { from: "animal-enclosure", to: "flights-35day", label: "validated_for" },
      { from: "open-science", to: "data-reuse", label: "enables" },
      {
        from: "best-practice",
        to: "evidence-confidence",
        label: "strengthens",
      },
    ],
  },
];
