export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  position: Position;
  content: string;
  type: 'root' | 'child' | 'image';
  color?: string; // Tailwind class or hex
  parentId?: string; // Helpful for auto-organizing if needed, but we'll use connections mainly
}

export interface ConnectionData {
  id: string;
  fromId: string;
  toId: string;
}

export type ToolType = 'select' | 'node' | 'hand';
