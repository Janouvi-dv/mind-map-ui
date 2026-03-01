import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NodeData, ConnectionData, Position } from '../../types';
import { NodeComponent } from './Node';
import { Connection } from './Connection';
import { Plus, Minus, MousePointer2, Move, ZoomIn, ZoomOut, RotateCcw, Download, Home, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MindMapCanvasProps {
  initialTopic?: string;
  layout?: string;
  mode?: 'ai' | 'manual';
  tone?: string;
  depth?: string;
  theme?: string;
  onExit?: () => void;
}

// Default fallback
const defaultNodes: NodeData[] = [
  { id: 'root', position: { x: 0, y: 0 }, content: 'Central Idea', type: 'root', color: 'bg-white border-slate-900 text-slate-900' },
  { id: '1', position: { x: 200, y: -100 }, content: 'Concept A', type: 'child' },
  { id: '2', position: { x: 200, y: 100 }, content: 'Concept B', type: 'child' },
];

const defaultConnections: ConnectionData[] = [
  { id: 'c1', fromId: 'root', toId: '1' },
  { id: 'c2', fromId: 'root', toId: '2' },
];

const generateLayout = (topic: string, layout: string, mode: 'ai' | 'manual', tone: string = 'creative', depth: string = 'medium', theme: string = 'monochrome') => {
  const rootId = 'root';
  const nodes: NodeData[] = [];
  const connections: ConnectionData[] = [];

  // Helper to add node
  const addNode = (id: string, x: number, y: number, content: string, type: 'root' | 'child' = 'child', parentId?: string, color?: string) => {
     let nodeColor = color;
     
     // Apply theme & tone-based styling
     if (!nodeColor) {
        if (theme === 'professional') {
             if (type === 'root') nodeColor = 'bg-slate-800 border-slate-700 text-white shadow-lg rounded-xl';
             else nodeColor = 'bg-white border-slate-200 text-slate-700 shadow-sm hover:shadow-md rounded-lg';
        } else if (theme === 'anime') {
            if (type === 'root') nodeColor = 'bg-pink-100 border-pink-500 text-pink-900 shadow-[4px_4px_0px_0px_#ec4899]';
            else nodeColor = 'bg-white border-pink-300 text-pink-800';
        } else if (theme === 'classic') {
            if (type === 'root') nodeColor = 'bg-blue-50 border-blue-600 text-blue-900 shadow-[4px_4px_0px_0px_#2563eb]';
            else nodeColor = 'bg-white border-blue-200 text-blue-900';
        } else {
            // Monochrome (Default)
            if (type === 'root') {
                if (tone === 'creative') nodeColor = 'bg-white border-slate-900 text-slate-900 shadow-[4px_4px_0px_0px_#0f172a]';
                else if (tone === 'professional') nodeColor = 'bg-slate-900 border-slate-900 text-white';
                else if (tone === 'academic') nodeColor = 'bg-white border-slate-900 text-slate-900 border-dashed';
                else nodeColor = 'bg-white border-slate-900 text-slate-900';
            } else {
                nodeColor = 'bg-white border-slate-900 text-slate-900';
            }
        }
     }

     nodes.push({ 
         id, 
         position: { x, y }, 
         content, 
         type,
         parentId,
         color: nodeColor
     });
     if (parentId) {
         connections.push({ id: `conn-${parentId}-${id}`, fromId: parentId, toId: id });
     }
  };

  // Root Node (Default Center)
  addNode(rootId, 0, 0, topic, 'root');
  
  // If Manual Mode, provide minimal structure with placeholders
  const isManual = mode === 'manual';
  
  // Depth multiplier
  const depthLevel = depth === 'basic' ? 1 : depth === 'medium' ? 2 : 3;

  switch (layout) {
      case 'hierarchical': // Classic Tree
          addNode('1', -250, 100, isManual ? 'Branch 1' : 'Main Concept 1', 'child', rootId);
          addNode('2', 0, 200, isManual ? 'Branch 2' : 'Main Concept 2', 'child', rootId);
          addNode('3', 250, 100, isManual ? 'Branch 3' : 'Main Concept 3', 'child', rootId);
          
          if (!isManual && depthLevel > 1) {
            addNode('1-1', -300, 250, 'Detail A', 'child', '1');
            addNode('1-2', -200, 250, 'Detail B', 'child', '1');
            addNode('3-1', 200, 250, 'Detail C', 'child', '3');
            addNode('3-2', 300, 250, 'Detail D', 'child', '3');
          }
          
          if (!isManual && depthLevel > 2) {
             addNode('1-1-1', -320, 350, 'Sub-point', 'child', '1-1');
             addNode('3-2-1', 320, 350, 'Example', 'child', '3-2');
          }
          break;
      
      case 'radial': // Radial Star
          const radius = 220;
          const count = isManual ? 4 : (depthLevel === 3 ? 8 : 6);
          
          for (let i = 0; i < count; i++) {
              const angle = (i / count) * Math.PI * 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              addNode(`n-${i}`, x, y, isManual ? `Idea ${i+1}` : `Perspective ${i+1}`, 'child', rootId);
              
              // Add a sub-node to some if AI
              if (!isManual && depthLevel > 1 && i % 2 === 0) {
                 const subX = Math.cos(angle) * (radius + 120);
                 const subY = Math.sin(angle) * (radius + 120);
                 addNode(`sub-${i}`, subX, subY, `Detail`, 'child', `n-${i}`);
                 
                 if (depthLevel > 2) {
                    addNode(`sub-${i}-2`, subX + 50, subY + 50, `Note`, 'child', `sub-${i}`);
                 }
              }
          }
          break;

      case 'left-to-right': // Vertical Flowchart -> actually Left-to-Right based on name update
          // Repurposing 'process' logic but rotating 90 degrees or adjusting for left-to-right
          // The previous code was vertical. Let's make it truly left-to-right.
          nodes[0].position = { x: -300, y: 0 }; // Start left
          
          addNode('step1', -100, 0, isManual ? 'Step 1' : 'Phase 1', 'child', rootId);
          addNode('step2', 100, 0, isManual ? 'Step 2' : 'Phase 2', 'child', 'step1');
          addNode('step3', 300, 0, isManual ? 'Step 3' : 'Phase 3', 'child', 'step2');
          
          if (!isManual && depthLevel > 1) {
            // Side notes
            addNode('note1', -100, -100, 'Input', 'child', 'step1');
            addNode('note2', 100, 100, 'Review', 'child', 'step2');
            addNode('note3', 300, -100, 'Output', 'child', 'step3');
          }
          break;

      case 'timeline': // Horizontal Timeline
          nodes[0].position = { x: -400, y: 0 }; // Start left
          
          addNode('t1', -150, 0, isManual ? 'Time 1' : 'Milestone 1', 'child', rootId);
          addNode('t2', 100, 0, isManual ? 'Time 2' : 'Milestone 2', 'child', 't1');
          addNode('t3', 350, 0, isManual ? 'Time 3' : 'Milestone 3', 'child', 't2');
          
          if (!isManual && depthLevel > 1) {
            // Events
            addNode('e1', -150, -120, 'Jan Event', 'child', 't1');
            addNode('e2', -150, 120, 'Task A', 'child', 't1');
            addNode('e3', 100, -120, 'Feb Event', 'child', 't2');
            addNode('e4', 350, 120, 'Launch', 'child', 't3');
          }
          break;

      case 'concept-map': // Cause & Effect / Fishbone
          nodes[0].position = { x: 450, y: 0 }; // Head at right
          
          // Backbone nodes
          addNode('spine1', 200, 0, '', 'child', rootId);
          addNode('spine2', 0, 0, '', 'child', 'spine1');
          addNode('spine3', -200, 0, '', 'child', 'spine2');
          
          // Ribs (Categories)
          addNode('cat1', 200, -150, isManual ? 'Category 1' : 'People', 'child', 'spine1');
          addNode('cat2', 200, 150, isManual ? 'Category 2' : 'Methods', 'child', 'spine1');
          
          addNode('cat3', 0, -150, isManual ? 'Category 3' : 'Machines', 'child', 'spine2');
          addNode('cat4', 0, 150, isManual ? 'Category 4' : 'Materials', 'child', 'spine2');
          
          if (!isManual && depthLevel > 1) {
             addNode('cat5', -200, -150, 'Environment', 'child', 'spine3');
             addNode('cat6', -200, 150, 'Measurement', 'child', 'spine3');
          }
          break;

       case 'cycle': // Circular Loop
          nodes[0].position = { x: 0, y: 0 }; // Center Topic
          const cRadius = 250;
          const steps = isManual ? ['Step 1', 'Step 2', 'Step 3', 'Step 4'] : ['Plan', 'Do', 'Check', 'Act'];
          
          let prevId = null;
          const firstId = 'cycle-0';
          
          steps.forEach((step, i) => {
              const angle = (i / steps.length) * Math.PI * 2 - (Math.PI/2);
              const id = `cycle-${i}`;
              const x = Math.cos(angle) * cRadius;
              const y = Math.sin(angle) * cRadius;
              
              addNode(id, x, y, step, 'child', rootId);
              
              if (prevId) {
                  connections.push({ id: `ring-${i}`, fromId: prevId, toId: id });
              }
              prevId = id;
          });
          
          // Close loop
          if (prevId) {
             connections.push({ id: `ring-close`, fromId: prevId, toId: firstId });
          }
          break;
      
      default:
           addNode('1', 200, -100, 'Concept A', 'child', rootId);
           addNode('2', 200, 100, 'Concept B', 'child', rootId);
           break;
  }
  
  return { nodes, connections };
};

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({ initialTopic, layout, mode = 'ai', tone, depth, theme = 'monochrome', onExit }) => {
  const [nodes, setNodes] = useState<NodeData[]>(defaultNodes);
  const [connections, setConnections] = useState<ConnectionData[]>(defaultConnections);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const borderColor = theme === 'professional' ? 'border-slate-300' : theme === 'anime' ? 'border-pink-500' : theme === 'classic' ? 'border-blue-600' : 'border-slate-900';
  const textColor = theme === 'professional' ? 'text-slate-700' : theme === 'anime' ? 'text-pink-600' : theme === 'classic' ? 'text-blue-700' : 'text-slate-900';
  const bgColor = theme === 'professional' ? 'bg-slate-800' : theme === 'anime' ? 'bg-pink-500' : theme === 'classic' ? 'bg-blue-600' : 'bg-slate-900';
  const shadowClass = theme === 'professional' ? 'shadow-md' : theme === 'anime' ? 'shadow-[4px_4px_0px_0px_#ec4899]' : theme === 'classic' ? 'shadow-[4px_4px_0px_0px_#2563eb]' : 'shadow-[4px_4px_0px_0px_#0f172a]';
  const hoverBg = theme === 'professional' ? 'hover:bg-slate-100' : theme === 'anime' ? 'hover:bg-pink-50' : theme === 'classic' ? 'hover:bg-blue-50' : 'hover:bg-slate-100';
  const dividerColor = theme === 'professional' ? 'border-slate-200' : theme === 'anime' ? 'border-pink-200' : theme === 'classic' ? 'border-blue-200' : 'border-slate-200';
  
  // Initialization Effect
  useEffect(() => {
    if (initialTopic && layout) {
        const { nodes: newNodes, connections: newConns } = generateLayout(initialTopic, layout, mode, tone, depth, theme);
        setNodes(newNodes);
        setConnections(newConns);
    }
  }, [initialTopic, layout, mode, tone, depth, theme]);

  // Viewport state
  const [view, setView] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 1 });
  const [isPanning, setIsPanning] = useState(false);
  
  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Tools
  const [interactionMode, setInteractionMode] = useState<'select' | 'pan'>('select');

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = -e.deltaY * 0.001;
      const newZoom = Math.max(0.1, Math.min(5, view.zoom + zoomFactor));
      setView(v => ({ ...v, zoom: newZoom }));
    } else {
        setView(v => ({
            ...v,
            x: v.x - e.deltaX,
            y: v.y - e.deltaY
        }));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (interactionMode === 'pan' || (e.button === 1) || (e.button === 0 && e.target === containerRef.current)) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      containerRef.current?.setPointerCapture(e.pointerId);
    }
  };

  const handleNodeDragStart = (id: string, startPos: Position) => {
    if (interactionMode === 'pan') return;
    setDraggingNodeId(id);
    setSelectedId(id);
    lastMousePos.current = { x: startPos.x, y: startPos.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else if (draggingNodeId) {
      const dx = (e.clientX - lastMousePos.current.x) / view.zoom;
      const dy = (e.clientY - lastMousePos.current.y) / view.zoom;
      
      setNodes(prev => prev.map(n => 
        n.id === draggingNodeId 
          ? { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } } 
          : n
      ));
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
    setDraggingNodeId(null);
    if(containerRef.current) containerRef.current.releasePointerCapture(e.pointerId);
  };

  const addNode = (parentId: string) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    const offset = 150;
    const angle = Math.random() * Math.PI * 2;
    const newPos = {
      x: parent.position.x + Math.cos(angle) * offset,
      y: parent.position.y + Math.sin(angle) * offset
    };

    const newNode: NodeData = {
      id: crypto.randomUUID(),
      position: newPos,
      content: 'New Idea',
      type: 'child',
      parentId,
      color: theme === 'anime' ? 'bg-white border-pink-300 text-pink-800' : theme === 'classic' ? 'bg-white border-blue-200 text-blue-900' : 'bg-white border-slate-900 text-slate-900'
    };

    const newConnection: ConnectionData = {
      id: crypto.randomUUID(),
      fromId: parentId,
      toId: newNode.id
    };

    setNodes(prev => [...prev, newNode]);
    setConnections(prev => [...prev, newConnection]);
    setSelectedId(newNode.id);
  };

  const handleAiGenerate = (parentId: string) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    // Simulate AI generation with more context-aware solutions
    const solutions = [
        "Simplify Process",
        "Automate Steps",
        "Delegate Tasks"
    ];
    
    const newNodes: NodeData[] = [];
    const newConnections: ConnectionData[] = [];
    
    // Spread them in a fan shape relative to parent
    const baseRadius = 200;
    const spreadAngle = Math.PI / 3; // 60 degrees spread
    const startAngle = Math.random() * Math.PI * 2; // Random direction for variety

    solutions.forEach((solution, i) => {
        const angle = startAngle + (i - 1) * (spreadAngle / 2);
        const newNodeId = crypto.randomUUID();
        
        newNodes.push({
            id: newNodeId,
            position: {
                x: parent.position.x + Math.cos(angle) * baseRadius,
                y: parent.position.y + Math.sin(angle) * baseRadius
            },
            content: solution,
            type: 'child',
            parentId,
            color: theme === 'professional' 
                ? 'bg-white border-slate-300 text-slate-700' 
                : theme === 'anime' 
                    ? 'bg-white border-purple-300 text-purple-800' 
                    : 'bg-white border-purple-500 text-purple-900 shadow-[4px_4px_0px_0px_#a855f7]'
        });
        
        newConnections.push({
            id: crypto.randomUUID(),
            fromId: parentId,
            toId: newNodeId
        });
    });
    
    setNodes(prev => [...prev, ...newNodes]);
    setConnections(prev => [...prev, ...newConnections]);
  };

  const deleteNode = (id: string) => {
    if (id === 'root') return;
    
    const getDescendants = (nodeId: string): string[] => {
        const children = connections.filter(c => c.fromId === nodeId).map(c => c.toId);
        return [...children, ...children.flatMap(getDescendants)];
    };
    
    const nodesToDelete = [id, ...getDescendants(id)];
    
    setNodes(prev => prev.filter(n => !nodesToDelete.includes(n.id)));
    setConnections(prev => prev.filter(c => !nodesToDelete.includes(c.fromId) && !nodesToDelete.includes(c.toId)));
    setSelectedId(null);
  };

  const updateContent = (id: string, content: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
  };
  
  const updateColor = (id: string, color: string) => {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, color } : n));
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-white touch-none select-none">
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        style={{ cursor: interactionMode === 'pan' ? 'grab' : 'default' }}
      >
        <motion.div
          className="w-full h-full origin-top-left absolute top-0 left-0"
          style={{
            x: view.x,
            y: view.y,
            scale: view.zoom,
          }}
          transition={{ type: "tween", duration: 0 }}
        >
            <div 
                className="absolute -inset-[5000px] opacity-10 pointer-events-none" 
                style={{
                    backgroundImage: `radial-gradient(${theme === 'professional' ? '#cbd5e1' : theme === 'anime' ? '#ec4899' : theme === 'classic' ? '#2563eb' : '#0f172a'} 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }} 
            />

          <AnimatePresence>
            <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" style={{ width: 0, height: 0 }}>
              {connections.map(conn => {
                const start = nodes.find(n => n.id === conn.fromId)?.position;
                const end = nodes.find(n => n.id === conn.toId)?.position;
                if (!start || !end) return null;
                return (
                  <Connection
                    key={conn.id}
                    id={conn.id}
                    start={start}
                    end={end}
                    color={theme === 'professional' ? '#94a3b8' : theme === 'anime' ? '#db2777' : theme === 'classic' ? '#2563eb' : '#0f172a'}
                  />
                );
              })}
            </svg>

            {nodes.map(node => (
              <NodeComponent
                key={node.id}
                data={node}
                onDragStart={handleNodeDragStart}
                onDelete={deleteNode}
                onAddChild={addNode}
                onAiGenerate={handleAiGenerate}
                onSelect={setSelectedId}
                isSelected={selectedId === node.id}
                onUpdateContent={updateContent}
                onUpdateColor={updateColor}
                theme={theme}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className={cn("absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-2 flex items-center gap-2 z-50 border-2", shadowClass, borderColor)}>
        <div className={cn("flex items-center gap-1 border-r-2 pr-2", dividerColor)}>
            <button 
                onClick={() => setInteractionMode('select')}
                className={cn("p-2 rounded-xl transition-all border-2 border-transparent", interactionMode === 'select' ? `${bgColor} text-white shadow-sm` : `${textColor} ${hoverBg}`)}
                title="Select Mode (Drag Nodes)"
            >
                <MousePointer2 size={20} strokeWidth={2.5} />
            </button>
            <button 
                onClick={() => setInteractionMode('pan')}
                className={cn("p-2 rounded-xl transition-all border-2 border-transparent", interactionMode === 'pan' ? `${bgColor} text-white shadow-sm` : `${textColor} ${hoverBg}`)}
                title="Pan Mode (Move Canvas)"
            >
                <Move size={20} strokeWidth={2.5} />
            </button>
        </div>
        
        <div className={cn("flex items-center gap-1 px-2 border-r-2", dividerColor)}>
            <button 
                onClick={() => setView(v => ({ ...v, zoom: v.zoom - 0.1 }))}
                className={cn("p-2 rounded-xl active:scale-95 transition-transform", hoverBg, textColor)}
            >
                <ZoomOut size={20} strokeWidth={2.5} />
            </button>
            <span className={cn("text-sm font-bold w-12 text-center", textColor)}>{Math.round(view.zoom * 100)}%</span>
            <button 
                onClick={() => setView(v => ({ ...v, zoom: v.zoom + 0.1 }))}
                className={cn("p-2 rounded-xl active:scale-95 transition-transform", hoverBg, textColor)}
            >
                <ZoomIn size={20} strokeWidth={2.5} />
            </button>
             <button 
                onClick={() => setView({ x: window.innerWidth/2, y: window.innerHeight/2, zoom: 1 })}
                className={cn("p-2 rounded-xl active:scale-95 transition-transform", hoverBg, textColor)}
                title="Reset View"
            >
                <RotateCcw size={18} strokeWidth={2.5} />
            </button>
        </div>

        <div className="flex items-center gap-1 pl-1">
             <button 
                onClick={() => { /* Export logic */ }}
                className={cn("p-2 rounded-xl active:scale-95 transition-transform", hoverBg, textColor)}
                title="Export Mind Map"
            >
                <Download size={20} strokeWidth={2.5} />
            </button>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-50">
        <button 
            onClick={onExit}
            className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-2xl border-2 font-bold transition-all shadow-sm active:scale-95",
                theme === 'professional' ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm" :
                theme === 'anime' ? "bg-white border-pink-200 text-pink-600 hover:border-pink-400" : 
                theme === 'classic' ? "bg-white border-blue-200 text-blue-600 hover:border-blue-400" : 
                "bg-white border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900"
            )}
        >
            <Home size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
        {showInfoPanel && (
          <div className={cn("bg-white rounded-2xl p-4 w-64 border-2 relative", shadowClass, borderColor)}>
            <button 
                onClick={() => setShowInfoPanel(false)}
                className={cn("absolute top-2 right-2 p-1.5 rounded-xl transition-colors active:scale-95", hoverBg, textColor)}
            >
                <X size={16} strokeWidth={2.5} />
            </button>
           <h2 className={cn("font-bold text-xl mb-2", textColor)}>Mind Map</h2>
           <div className={cn("flex items-center gap-2 text-xs font-bold mb-2", textColor)}>
             <span className={cn("bg-white px-2 py-1 rounded-lg border-2", dividerColor)}>
                {layout ? layout.charAt(0).toUpperCase() + layout.slice(1) : 'Default'}
             </span>
             <span className={cn("bg-white px-2 py-1 rounded-lg border-2", dividerColor)}>
                {mode === 'manual' ? 'Manual' : 'AI Generated'}
             </span>
           </div>
           <p className={cn("text-sm font-medium", theme === 'monochrome' ? "text-slate-500" : textColor + " opacity-70")}>
             Double click text to edit. Drag nodes to move.
           </p>
        </div>
        )}
      </div>
    </div>
  );
};