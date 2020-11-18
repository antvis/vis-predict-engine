export interface PlainObject {
  [key: string]: any;
}

export interface Node {
  id: string;
  label: string;
  properties?: PlainObject;
  [key: string]: any;
}

export interface Edge {
  id: string;
  name?: string;
  label?: string;
  source: string;
  target: string;
  properties?: PlainObject;
  [key: string]: any;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export enum Layout {
  force = 'force',
  radial = 'radial',
}

export interface FinalNode {
  id: string;
}

export interface FinalEdge {
  source: string;
  target: string;
  from: string;
  to: string;
}

export interface PredictGraphData {
  nodes: FinalNode[];
  edges: FinalEdge[];
}

