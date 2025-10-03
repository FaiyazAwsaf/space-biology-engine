export interface Node {
  id: string;
  label: string;
  category:
    | "space-exposure"
    | "biological-mechanism"
    | "physiological-outcome"
    | "countermeasure"
    | "method"
    | "model";
  x?: number;
  y?: number;
}

export interface Connection {
  from: string;
  to: string;
  label: string;
}

export interface GraphData {
  id: string;
  title: string;
  subtitle: string;
  nodes: Node[];
  connections: Connection[];
}
