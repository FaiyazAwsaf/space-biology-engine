import React, { useEffect, useRef, useState, useMemo } from "react";
import { Node, Connection, GraphData } from "../types/graph";

interface KnowledgeGraphProps {
  data: GraphData;
}

interface PositionedNode extends Node {
  x: number;
  y: number;
  width: number;
  height: number;
}

const categoryColors = {
  "space-exposure": "#4F8EFF",
  "biological-mechanism": "#FF8243",
  "physiological-outcome": "#FF4757",
  countermeasure: "#5CB85C",
  method: "#9B59B6",
  model: "#F39C12",
};

const categoryLabels = {
  "space-exposure": "Space Exposure",
  "biological-mechanism": "Biological Mechanism",
  "physiological-outcome": "Physiological Outcome",
  countermeasure: "Countermeasure",
  method: "Method",
  model: "Model",
};

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(
    null
  );

  // Specific positioning for each graph to avoid crowding
  const positionedNodes = useMemo(() => {
    if (data.id === "bone-radiation" || data.id === "immune-radiation") {
      return [
        {
          ...data.nodes.find((n) => n.id === "radiation")!,
          x: 200,
          y: 120,
          width: 120,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "microgravity")!,
          x: 200,
          y: 260,
          width: 120,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "mechanical-unloading")!,
          x: 460,
          y: 190,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "osteoclast-activity")!,
          x: 720,
          y: 120,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "bone-loss")!,
          x: 720,
          y: 280,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "bv-tv")!,
          x: 980,
          y: 200,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "dried-plum")!,
          x: 580,
          y: 380,
          width: 140,
          height: 50,
        },
      ].filter(Boolean) as PositionedNode[];
    }

    if (data.id === "neuro-circadian") {
      return [
        {
          ...data.nodes.find((n) => n.id === "microgravity")!,
          x: 600,
          y: 400,
          width: 130,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "ca-leak")!,
          x: 800,
          y: 280,
          width: 160,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "neurotransmission")!,
          x: 400,
          y: 320,
          width: 150,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "circadian-clocks")!,
          x: 400,
          y: 380,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "hypergravity")!,
          x: 200,
          y: 280,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "neuroinflammation")!,
          x: 200,
          y: 180,
          width: 170,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "cognitive-decline")!,
          x: 200,
          y: 120,
          width: 150,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "artificial-gravity")!,
          x: 200,
          y: 380,
          width: 180,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "drosophila-rodent")!,
          x: 600,
          y: 120,
          width: 180,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "human-risk")!,
          x: 800,
          y: 120,
          width: 120,
          height: 50,
        },
      ].filter(Boolean) as PositionedNode[];
    }

    if (data.id === "plants-agriculture") {
      return [
        {
          ...data.nodes.find((n) => n.id === "microgravity")!,
          x: 150,
          y: 200,
          width: 130,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "root-response")!,
          x: 380,
          y: 120,
          width: 180,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "radiation")!,
          x: 150,
          y: 300,
          width: 120,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "arabidopsis")!,
          x: 380,
          y: 300,
          width: 180,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "lunar-regolith")!,
          x: 150,
          y: 400,
          width: 160,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "stress-pathways")!,
          x: 380,
          y: 400,
          width: 150,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "photosynthesis")!,
          x: 650,
          y: 120,
          width: 160,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "ug-stress")!,
          x: 650,
          y: 200,
          width: 120,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "iss-veggie")!,
          x: 650,
          y: 300,
          width: 150,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "metatranscriptome")!,
          x: 900,
          y: 300,
          width: 160,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "crop-selection")!,
          x: 580,
          y: 450,
          width: 180,
          height: 50,
        },
      ].filter(Boolean) as PositionedNode[];
    }

    if (data.id === "microbiome") {
      return [
        {
          ...data.nodes.find((n) => n.id === "spaceflight")!,
          x: 150,
          y: 180,
          width: 120,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "gut-microbiome")!,
          x: 350,
          y: 120,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "iss-environment")!,
          x: 150,
          y: 280,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "amr-genes")!,
          x: 350,
          y: 280,
          width: 120,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "dust-surfaces")!,
          x: 150,
          y: 380,
          width: 130,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "enterobacter")!,
          x: 350,
          y: 380,
          width: 180,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "metabolic-modeling")!,
          x: 600,
          y: 120,
          width: 160,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "microbial-interactions")!,
          x: 600,
          y: 200,
          width: 170,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "fungal-species")!,
          x: 600,
          y: 300,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "iss-air")!,
          x: 850,
          y: 300,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "monitoring-probiotics")!,
          x: 500,
          y: 450,
          width: 220,
          height: 50,
        },
      ].filter(Boolean) as PositionedNode[];
    }

    if (data.id === "methods-validity") {
      return [
        {
          ...data.nodes.find((n) => n.id === "rnaseq-timing")!,
          x: 150,
          y: 120,
          width: 170,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "rodent-flight")!,
          x: 400,
          y: 120,
          width: 150,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "housing-type")!,
          x: 150,
          y: 220,
          width: 180,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "outcomes")!,
          x: 400,
          y: 220,
          width: 120,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "iss-analogs")!,
          x: 150,
          y: 320,
          width: 180,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "gravity-profile")!,
          x: 400,
          y: 320,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "animal-enclosure")!,
          x: 650,
          y: 120,
          width: 180,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "flights-35day")!,
          x: 650,
          y: 220,
          width: 130,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "open-science")!,
          x: 650,
          y: 320,
          width: 160,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "data-reuse")!,
          x: 900,
          y: 320,
          width: 120,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "best-practice")!,
          x: 400,
          y: 420,
          width: 140,
          height: 50,
        },
        {
          ...data.nodes.find((n) => n.id === "evidence-confidence")!,
          x: 600,
          y: 420,
          width: 170,
          height: 50,
        },
      ].filter(Boolean) as PositionedNode[];
    }

    // Fallback for any other graphs
    const width = 1200;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const nodes: PositionedNode[] = data.nodes.map((node, index) => {
      const angle = (index / data.nodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.25;

      const textWidth = Math.max(120, node.label.length * 8);

      return {
        ...node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        width: textWidth,
        height: 50,
      };
    });

    return nodes;
  }, [data]);

  const getConnectedNodes = (nodeId: string) => {
    const connected = new Set<string>();
    data.connections.forEach((conn) => {
      if (conn.from === nodeId) connected.add(conn.to);
      if (conn.to === nodeId) connected.add(conn.from);
    });
    return connected;
  };

  const getNodeConnections = (nodeId: string) => {
    return data.connections.filter(
      (conn) => conn.from === nodeId || conn.to === nodeId
    );
  };

  const uniqueCategories = [...new Set(data.nodes.map((n) => n.category))];

  return (
    <div
      className="w-full h-screen text-white overflow-hidden"
      style={{ backgroundColor: "#0a0e27" }}
    >
      {/* Left Legend */}
      <div className="absolute top-12 left-8 z-10">
        <div className="text-white">
          <h3 className="text-sm mb-4">Node Categories</h3>
          <div className="space-y-3">
            {uniqueCategories.map((category) => (
              <div key={category} className="flex items-center gap-3 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                />
                <span className="text-gray-300">
                  {categoryLabels[category]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Network Analysis */}
      <div className="absolute top-12 right-8 z-10">
        <div className="text-white text-right">
          <h3 className="text-sm mb-2">Network Analysis</h3>
          <div className="text-sm text-gray-300 mb-1">
            {data.nodes.length} nodes • {data.connections.length} connections
          </div>
          <div className="text-sm text-blue-400">Pathway: {data.title}</div>
        </div>
      </div>

      {/* Graph */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ background: "transparent" }}
      >
        {/* Definitions for glowing effects */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {data.connections.map((connection, index) => {
          const fromNode = positionedNodes.find(
            (n) => n.id === connection.from
          );
          const toNode = positionedNodes.find((n) => n.id === connection.to);

          if (!fromNode || !toNode) return null;

          const isHighlighted =
            hoveredNode &&
            (hoveredNode === connection.from || hoveredNode === connection.to);

          const connectionId = `${connection.from}-${connection.to}`;
          const isHovered = hoveredConnection === connectionId;

          // Calculate connection points from edge of rectangles
          const fromCenterX = fromNode.x + fromNode.width / 2;
          const fromCenterY = fromNode.y + fromNode.height / 2;
          const toCenterX = toNode.x + toNode.width / 2;
          const toCenterY = toNode.y + toNode.height / 2;

          const dx = toCenterX - fromCenterX;
          const dy = toCenterY - fromCenterY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const unitX = dx / length;
          const unitY = dy / length;

          // Calculate edge points
          let startX, startY, endX, endY;

          if (Math.abs(unitX) > Math.abs(unitY)) {
            // Horizontal connection
            if (unitX > 0) {
              startX = fromNode.x + fromNode.width;
              startY = fromCenterY;
              endX = toNode.x;
              endY = toCenterY;
            } else {
              startX = fromNode.x;
              startY = fromCenterY;
              endX = toNode.x + toNode.width;
              endY = toCenterY;
            }
          } else {
            // Vertical connection
            if (unitY > 0) {
              startX = fromCenterX;
              startY = fromNode.y + fromNode.height;
              endX = toCenterX;
              endY = toNode.y;
            } else {
              startX = fromCenterX;
              startY = fromNode.y;
              endX = toCenterX;
              endY = toNode.y + toNode.height;
            }
          }

          // Arrow head
          const arrowLength = 8;
          const arrowWidth = 5;
          const arrowX1 = endX - unitX * arrowLength - unitY * arrowWidth;
          const arrowY1 = endY - unitY * arrowLength + unitX * arrowWidth;
          const arrowX2 = endX - unitX * arrowLength + unitY * arrowWidth;
          const arrowY2 = endY - unitY * arrowLength - unitX * arrowWidth;

          return (
            <g key={`connection-${index}`}>
              {/* Connection line */}
              <line
                x1={startX}
                y1={startY}
                x2={endX - unitX * arrowLength}
                y2={endY - unitY * arrowLength}
                stroke={isHighlighted || isHovered ? "#60A5FA" : "#6B7280"}
                strokeWidth="1.5"
                strokeDasharray="3,3"
                opacity={isHighlighted || isHovered ? 1 : 0.8}
                onMouseEnter={() => setHoveredConnection(connectionId)}
                onMouseLeave={() => setHoveredConnection(null)}
                className="cursor-pointer"
              />

              {/* Arrow head */}
              <polygon
                points={`${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
                fill={isHighlighted || isHovered ? "#60A5FA" : "#6B7280"}
                opacity={isHighlighted || isHovered ? 1 : 0.8}
                onMouseEnter={() => setHoveredConnection(connectionId)}
                onMouseLeave={() => setHoveredConnection(null)}
                className="cursor-pointer"
              />

              {/* Connection label - always visible */}
              <text
                x={(startX + endX) / 2}
                y={(startY + endY) / 2 - 8}
                textAnchor="middle"
                className="text-xs fill-blue-300"
                style={{ fontSize: "11px" }}
              >
                {connection.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {positionedNodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const connectedNodes = getConnectedNodes(node.id);
          const isConnected = hoveredNode && connectedNodes.has(hoveredNode);
          const isDimmed = hoveredNode && !isHovered && !isConnected;

          return (
            <g key={node.id}>
              {/* Node pill shape */}
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={25}
                ry={25}
                fill={categoryColors[node.category]}
                opacity={isDimmed ? 0.4 : 0.9}
                stroke={isHovered ? "#FFFFFF" : "transparent"}
                strokeWidth={isHovered ? 2 : 0}
                filter={isHovered || isConnected ? "url(#nodeGlow)" : "none"}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />

              {/* Node label */}
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white pointer-events-none select-none"
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  opacity: isDimmed ? 0.6 : 1,
                }}
              >
                {node.label.length > 16 ? (
                  <>
                    <tspan x={node.x + node.width / 2} dy="-6">
                      {node.label.substring(0, 16)}
                    </tspan>
                    <tspan x={node.x + node.width / 2} dy="14">
                      {node.label.substring(16)}
                    </tspan>
                  </>
                ) : (
                  node.label
                )}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
