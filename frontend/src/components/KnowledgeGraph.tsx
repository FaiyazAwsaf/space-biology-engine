import { useEffect, useState } from "react";

interface Node {
  id: string;
  label: string;
  category:
    | "exposure"
    | "mechanism"
    | "outcome"
    | "countermeasure"
    | "method"
    | "resource"
    | "trust";
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  label: string;
  type:
    | "induces"
    | "drives"
    | "causes"
    | "measured_by"
    | "synergizes_with"
    | "mitigates"
    | "confounded"
    | "biases"
    | "differ_by"
    | "validated_for"
    | "enables"
    | "strengthens"
    | "shifts"
    | "harbors"
    | "contain"
    | "reveals"
    | "persist_in";
}

interface KnowledgeGraphProps {
  graphType: "bone" | "microbiome" | "methods";
  className?: string;
}

export function KnowledgeGraph({
  graphType,
  className = "",
}: KnowledgeGraphProps) {
  const [animationOffset, setAnimationOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset((prev) => (prev + 1) % 10);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const getGraphData = () => {
    switch (graphType) {
      case "bone":
        return {
          nodes: [
            {
              id: "microgravity",
              label: "Microgravity",
              category: "exposure" as const,
              x: 200,
              y: 250,
            },
            {
              id: "radiation",
              label: "Radiation",
              category: "exposure" as const,
              x: 180,
              y: 80,
            },
            {
              id: "mechanical",
              label: "Mechanical\nunloading",
              category: "mechanism" as const,
              x: 500,
              y: 180,
            },
            {
              id: "osteoclast",
              label: "Osteoclast\nactivity ↑",
              category: "mechanism" as const,
              x: 800,
              y: 120,
            },
            {
              id: "boneloss",
              label: "Bone loss\n(Femur/Distal)",
              category: "outcome" as const,
              x: 950,
              y: 280,
            },
            {
              id: "bvtv",
              label: "BV/TV ↓\n(25–55%)",
              category: "outcome" as const,
              x: 1100,
              y: 180,
            },
            {
              id: "driedplum",
              label: "Dried plum\ndiet",
              category: "countermeasure" as const,
              x: 650,
              y: 400,
            },
          ],
          connections: [
            {
              from: "microgravity",
              to: "mechanical",
              label: "induces",
              type: "induces" as const,
            },
            {
              from: "mechanical",
              to: "osteoclast",
              label: "drives",
              type: "drives" as const,
            },
            {
              from: "osteoclast",
              to: "boneloss",
              label: "causes",
              type: "causes" as const,
            },
            {
              from: "boneloss",
              to: "bvtv",
              label: "measured_by",
              type: "measured_by" as const,
            },
            {
              from: "radiation",
              to: "boneloss",
              label: "synergizes_with",
              type: "synergizes_with" as const,
            },
            {
              from: "driedplum",
              to: "boneloss",
              label: "mitigates",
              type: "mitigates" as const,
            },
          ],
        };

      case "microbiome":
        return {
          nodes: [
            {
              id: "spaceflight",
              label: "Spaceflight",
              category: "exposure" as const,
              x: 150,
              y: 200,
            },
            {
              id: "gutmicrobiome",
              label: "Gut\nmicrobiome",
              category: "outcome" as const,
              x: 400,
              y: 200,
            },
            {
              id: "issenvironment",
              label: "ISS\nenvironment",
              category: "exposure" as const,
              x: 150,
              y: 350,
            },
            {
              id: "amrgenes",
              label: "AMR genes",
              category: "mechanism" as const,
              x: 400,
              y: 350,
            },
            {
              id: "dust",
              label: "Dust /\nsurfaces",
              category: "exposure" as const,
              x: 150,
              y: 500,
            },
            {
              id: "enterobacter",
              label: "Enterobacter &\nKlebsiella",
              category: "mechanism" as const,
              x: 400,
              y: 500,
            },
            {
              id: "metabolic",
              label: "Metabolic\nmodeling",
              category: "method" as const,
              x: 650,
              y: 300,
            },
            {
              id: "microbial",
              label: "Microbial\ninteractions",
              category: "outcome" as const,
              x: 900,
              y: 300,
            },
            {
              id: "fungal",
              label: "Fungal\nspecies",
              category: "mechanism" as const,
              x: 650,
              y: 450,
            },
            {
              id: "issair",
              label: "ISS air/\nsurfaces",
              category: "outcome" as const,
              x: 900,
              y: 450,
            },
            {
              id: "monitoring",
              label: "Monitoring /\nprobiotics",
              category: "countermeasure" as const,
              x: 650,
              y: 150,
            },
          ],
          connections: [
            {
              from: "spaceflight",
              to: "gutmicrobiome",
              label: "shifts",
              type: "shifts" as const,
            },
            {
              from: "issenvironment",
              to: "amrgenes",
              label: "harbors",
              type: "harbors" as const,
            },
            {
              from: "dust",
              to: "enterobacter",
              label: "contain",
              type: "contain" as const,
            },
            {
              from: "metabolic",
              to: "microbial",
              label: "reveals",
              type: "reveals" as const,
            },
            {
              from: "fungal",
              to: "issair",
              label: "persist_in",
              type: "persist_in" as const,
            },
            {
              from: "monitoring",
              to: "gutmicrobiome",
              label: "mitigates",
              type: "mitigates" as const,
            },
          ],
        };

      case "methods":
        return {
          nodes: [
            {
              id: "rnaseq",
              label: "RNAseq sample\ntiming",
              category: "method" as const,
              x: 150,
              y: 200,
            },
            {
              id: "rodent",
              label: "Rodent flight\ndata",
              category: "outcome" as const,
              x: 450,
              y: 200,
            },
            {
              id: "housing",
              label: "Housing type\n(VIV vs RH)",
              category: "method" as const,
              x: 150,
              y: 350,
            },
            {
              id: "outcomes",
              label: "Outcomes",
              category: "outcome" as const,
              x: 450,
              y: 350,
            },
            {
              id: "issground",
              label: "ISS vs Ground\nAnalogs",
              category: "method" as const,
              x: 150,
              y: 500,
            },
            {
              id: "gravity",
              label: "Gravity\nprofile",
              category: "outcome" as const,
              x: 450,
              y: 500,
            },
            {
              id: "aem",
              label: "Animal Enclosure\nModule",
              category: "resource" as const,
              x: 750,
              y: 200,
            },
            {
              id: "flights",
              label: "35-day\nflights",
              category: "resource" as const,
              x: 950,
              y: 200,
            },
            {
              id: "osdr",
              label: "Open Science\nOSDR",
              category: "resource" as const,
              x: 750,
              y: 350,
            },
            {
              id: "datareuse",
              label: "Data\nre-use",
              category: "resource" as const,
              x: 950,
              y: 350,
            },
            {
              id: "bestpractice",
              label: "Best\npractice",
              category: "trust" as const,
              x: 750,
              y: 500,
            },
            {
              id: "evidence",
              label: "Evidence\nconfidence",
              category: "trust" as const,
              x: 950,
              y: 500,
            },
          ],
          connections: [
            {
              from: "rnaseq",
              to: "rodent",
              label: "confounded",
              type: "confounded" as const,
            },
            {
              from: "housing",
              to: "outcomes",
              label: "biases",
              type: "biases" as const,
            },
            {
              from: "issground",
              to: "gravity",
              label: "differ_by",
              type: "differ_by" as const,
            },
            {
              from: "aem",
              to: "flights",
              label: "validated_for",
              type: "validated_for" as const,
            },
            {
              from: "osdr",
              to: "datareuse",
              label: "enables",
              type: "enables" as const,
            },
            {
              from: "bestpractice",
              to: "evidence",
              label: "strengthens",
              type: "strengthens" as const,
            },
          ],
        };

      default:
        return { nodes: [], connections: [] };
    }
  };

  const getCategoryColor = (category: Node["category"]) => {
    switch (category) {
      case "exposure":
        return {
          bg: "from-blue-500 to-blue-600",
          text: "text-white",
          glow: "shadow-blue-500/50",
          border: "border-blue-400/80",
        };
      case "mechanism":
        return {
          bg: "from-orange-500 to-orange-600",
          text: "text-white",
          glow: "shadow-orange-500/50",
          border: "border-orange-400/80",
        };
      case "outcome":
        return {
          bg: "from-red-500 to-red-600",
          text: "text-white",
          glow: "shadow-red-500/50",
          border: "border-red-400/80",
        };
      case "countermeasure":
        return {
          bg: "from-green-500 to-green-600",
          text: "text-white",
          glow: "shadow-green-500/50",
          border: "border-green-400/80",
        };
      case "method":
        return {
          bg: "from-yellow-500 to-yellow-600",
          text: "text-black",
          glow: "shadow-yellow-500/50",
          border: "border-yellow-400/80",
        };
      case "resource":
        return {
          bg: "from-blue-500 to-blue-600",
          text: "text-white",
          glow: "shadow-blue-500/50",
          border: "border-blue-400/80",
        };
      case "trust":
        return {
          bg: "from-green-500 to-green-600",
          text: "text-white",
          glow: "shadow-green-500/50",
          border: "border-green-400/80",
        };
      default:
        return {
          bg: "from-gray-500 to-gray-600",
          text: "text-white",
          glow: "shadow-gray-500/50",
          border: "border-gray-400/80",
        };
    }
  };

  const getConnectionColor = (type: Connection["type"]) => {
    switch (type) {
      case "induces":
      case "drives":
      case "causes":
        return "#3b82f6"; // blue
      case "measured_by":
        return "#8b5cf6"; // purple
      case "synergizes_with":
        return "#ef4444"; // red
      case "mitigates":
        return "#22c55e"; // green
      case "shifts":
      case "harbors":
      case "contain":
        return "#f59e0b"; // orange
      case "reveals":
      case "persist_in":
        return "#06b6d4"; // cyan
      default:
        return "#64748b"; // gray
    }
  };

  const { nodes, connections } = getGraphData();

  // Debug fallback
  if (nodes.length === 0) {
    return (
      <div
        className={`relative bg-black rounded-xl border border-cyan-500/20 overflow-hidden ${className} flex items-center justify-center`}
        style={{ minHeight: "500px" }}
      >
        <div className="text-cyan-300 text-center">
          <div className="text-lg mb-2">⚠️</div>
          <div>No graph data for: {graphType}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-slate-950 rounded-2xl border border-cyan-500/20 overflow-hidden ${className}`}
      style={{ minHeight: "500px" }}
    >
      {/* Network Statistics */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/20">
          <div className="text-cyan-100 text-sm mb-1">Network Analysis</div>
          <div className="text-cyan-300 text-xs space-y-1">
            <div>
              {nodes.length} nodes • {connections.length} connections
            </div>
            <div>
              Pathway: {graphType.charAt(0).toUpperCase() + graphType.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* SVG for curved connections */}
      <svg
        className="absolute inset-0 w-full h-full z-10"
        viewBox="0 0 1400 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glowing filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connections.map((connection, index) => {
          const fromNode = nodes.find((n) => n.id === connection.from);
          const toNode = nodes.find((n) => n.id === connection.to);
          if (!fromNode || !toNode) return null;

          const color = getConnectionColor(connection.type);

          // Calculate curved path
          const startX = fromNode.x + 75;
          const startY = fromNode.y + 40;
          const endX = toNode.x + 75;
          const endY = toNode.y + 40;

          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2 - 30; // Curve upward

          const pathData = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

          return (
            <g key={index}>
              <path
                d={pathData}
                stroke={color}
                strokeWidth="3"
                fill="none"
                opacity="0.8"
                filter="url(#glow)"
                style={{
                  strokeDasharray: "8,4",
                  strokeDashoffset: animationOffset * 2,
                  animation: "dash 3s linear infinite",
                }}
              />

              {/* Arrow head */}
              <polygon
                points={`${endX - 8},${endY - 4} ${endX - 8},${endY + 4} ${
                  endX + 4
                },${endY}`}
                fill={color}
                opacity="0.9"
                filter="url(#glow)"
              />

              {/* Connection label with background */}
              <rect
                x={midX - 25}
                y={midY - 8}
                width="50"
                height="16"
                fill="rgba(0,0,0,0.8)"
                rx="8"
                opacity="0.9"
              />
              <text
                x={midX}
                y={midY + 4}
                fill="#cbd5e1"
                fontSize="10"
                textAnchor="middle"
                className="font-mono"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))" }}
              >
                {connection.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Clean nodes with hover effects */}
      <div className="absolute inset-0 z-20">
        {nodes.map((node) => {
          const colors = getCategoryColor(node.category);
          return (
            <div
              key={node.id}
              className={`absolute rounded-full border-2 bg-gradient-to-br ${colors.bg} ${colors.border} ${colors.text} backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer group`}
              style={{
                left: node.x,
                top: node.y,
                width: "150px",
                height: "80px",
              }}
              onMouseEnter={(e) => {
                const shadowColor = colors.glow.includes("blue")
                  ? "#3b82f6"
                  : colors.glow.includes("orange")
                  ? "#f59e0b"
                  : colors.glow.includes("red")
                  ? "#ef4444"
                  : colors.glow.includes("green")
                  ? "#22c55e"
                  : colors.glow.includes("yellow")
                  ? "#eab308"
                  : "#6b7280";
                e.currentTarget.style.boxShadow = `0 0 40px ${shadowColor}60, 0 0 80px ${shadowColor}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="flex items-center justify-center h-full px-4">
                <span className="text-sm text-center leading-tight font-semibold group-hover:scale-105 transition-transform duration-200">
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional Legend */}
      <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm rounded-xl p-5 border border-cyan-500/20 z-30 min-w-[200px]">
        <div className="text-cyan-100 text-base mb-4 font-semibold">
          Node Categories
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm">
          {graphType === "bone" && (
            <>
              <div className="flex items-center gap-3 py-1">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30"></div>
                <span className="text-blue-200 font-medium">
                  Space Exposure
                </span>
              </div>
              <div className="flex items-center gap-3 py-1">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30"></div>
                <span className="text-orange-200 font-medium">
                  Biological Mechanism
                </span>
              </div>
              <div className="flex items-center gap-3 py-1">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/30"></div>
                <span className="text-red-200 font-medium">
                  Physiological Outcome
                </span>
              </div>
              <div className="flex items-center gap-3 py-1">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>
                <span className="text-green-200 font-medium">
                  Countermeasure
                </span>
              </div>
            </>
          )}
          {graphType === "microbiome" && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-blue-300">Exposure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-orange-300">Microbes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-red-300">Outcome</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-300">Countermeasure</span>
              </div>
            </>
          )}
          {graphType === "methods" && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-yellow-300">Methods</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-red-300">Outcomes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-blue-300">Resources</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-300">Trust/Confidence</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
