import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { NodeData, Position } from '../../types';
import { Plus, Trash2, GripVertical, Type, Palette, Calendar, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NodeProps {
  data: NodeData;
  onDragStart: (id: string, startPos: Position) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onAiGenerate?: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onUpdateContent: (id: string, newContent: string) => void;
  onUpdateColor: (id: string, color: string) => void;
  theme?: string;
}

const colors = [
  'bg-white border-slate-900 text-slate-900',
  'bg-slate-900 border-slate-900 text-white',
  'bg-slate-100 border-slate-900 text-slate-900',
  'bg-white border-dashed border-slate-400 text-slate-500', 
];

export const NodeComponent: React.FC<NodeProps> = ({
  data,
  onDragStart,
  onDelete,
  onAddChild,
  onAiGenerate,
  onSelect,
  isSelected,
  onUpdateContent,
  onUpdateColor,
  theme = 'monochrome'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const shadowColor = theme === 'professional' ? '#cbd5e1' : theme === 'anime' ? '#ec4899' : theme === 'classic' ? '#2563eb' : '#0f172a';
  const ringColor = theme === 'professional' ? 'ring-slate-400 border-slate-400' : theme === 'anime' ? 'ring-pink-500 border-pink-500' : theme === 'classic' ? 'ring-blue-600 border-blue-600' : 'ring-slate-900 border-slate-900';

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (isEditing) return;
    
    onDragStart(data.id, { x: e.clientX, y: e.clientY });
    onSelect(data.id);
  };

  return (
    <motion.div
      ref={nodeRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        left: data.position.x,
        top: data.position.y,
        position: 'absolute',
        zIndex: isSelected ? 50 : 10,
        transform: 'translate(-50%, -50%)', 
      }}
      className={cn(
        "group absolute flex flex-col items-center justify-center p-4 transition-all cursor-grab active:cursor-grabbing min-w-[140px] max-w-[320px]",
        // Theme-specific border and radius
        theme === 'professional' ? "rounded-lg border" : "rounded-2xl border-2",
        // Default colors if not overridden
        data.color || (theme === 'professional' ? "bg-white border-slate-300 text-slate-800" : theme === 'anime' ? "bg-white border-pink-300 text-pink-800" : theme === 'classic' ? "bg-white border-blue-200 text-blue-900" : "bg-white border-slate-900 text-slate-900"),
        // Selection and Shadow Logic
        isSelected
            ? theme === 'professional' 
                ? `ring-2 ring-offset-2 ${ringColor.split(' ')[0]} shadow-none`
                : `shadow-none translate-x-[4px] translate-y-[4px] ring-2 ring-offset-2 ${ringColor.split(' ')[0]}`
            : theme === 'professional'
                ? `shadow-sm hover:shadow-md hover:-translate-y-0.5`
                : `shadow-[4px_4px_0px_0px_${shadowColor}] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_${shadowColor}]`
      )}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Controls */}
      <div className={cn(
        "absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 bg-white p-1.5 transition-opacity z-50",
        theme === 'professional' ? "rounded-lg shadow-sm border border-slate-200" : "rounded-xl shadow-[2px_2px_0px_0px_#0f172a] border-2 border-slate-900",
        isSelected ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onAddChild(data.id); }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-900 transition-colors border border-transparent hover:border-slate-200"
            title="Add Child"
        >
            <Plus size={16} strokeWidth={2.5} />
        </button>
        <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-900 transition-colors border border-transparent hover:border-slate-200"
            title="Edit Text"
        >
            <Type size={16} strokeWidth={2.5} />
        </button>
        <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { 
                e.stopPropagation(); 
                if (onAiGenerate) onAiGenerate(data.id); 
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-900 transition-colors border border-transparent hover:border-slate-200"
            title="Generate with AI"
        >
            <Sparkles size={16} strokeWidth={2.5} />
        </button>
        <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation();
                const now = new Date();
                const start = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:${start}\r\nDTEND:${end}\r\nSUMMARY:${data.content}\r\nDESCRIPTION:Task created from Mind Map\r\nEND:VEVENT\r\nEND:VCALENDAR`;
                const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${data.content || 'event'}.ics`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-900 transition-colors border border-transparent hover:border-slate-200"
            title="Add to Calendar"
        >
            <Calendar size={16} strokeWidth={2.5} />
        </button>
         <div className="relative group/color">
            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-900 transition-colors border border-transparent hover:border-slate-200">
                <Palette size={16} strokeWidth={2.5} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 flex flex-wrap gap-2 bg-white p-3 rounded-xl shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 z-50 invisible group-hover/color:visible w-[160px]">
                {[
                    'bg-white border-slate-900 text-slate-900',
                    'bg-slate-900 border-slate-900 text-white',
                    'bg-slate-100 border-slate-900 text-slate-900',
                    'bg-white border-dashed border-slate-400 text-slate-500',
                    'bg-blue-100 border-slate-900 text-slate-900',
                    'bg-yellow-100 border-slate-900 text-slate-900',
                    'bg-green-100 border-slate-900 text-slate-900',
                    'bg-pink-100 border-slate-900 text-slate-900',
                    'bg-purple-100 border-slate-900 text-slate-900',
                    'bg-orange-100 border-slate-900 text-slate-900'
                ].map((c, i) => (
                    <button
                        key={i}
                        onPointerDown={(e) => e.stopPropagation()}
                        className={cn("w-6 h-6 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform", c.split(' ')[0])}
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateColor(data.id, c);
                        }}
                    />
                ))}
            </div>
         </div>
        <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
            title="Delete"
        >
            <Trash2 size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Content */}
      <div className="text-center w-full px-1 min-h-[24px] flex items-center justify-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            defaultValue={data.content}
            onBlur={(e) => {
                setIsEditing(false);
                onUpdateContent(data.id, e.target.value);
            }}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    setIsEditing(false);
                    onUpdateContent(data.id, e.currentTarget.value);
                }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full bg-transparent border-b-2 border-slate-900 outline-none text-center font-bold text-lg"
          />
        ) : (
          <span className={cn(
              "font-bold text-lg select-none block break-words pointer-events-none",
              data.color?.includes('bg-slate-900') ? "text-white" : "text-slate-900"
          )}>
            {data.content}
          </span>
        )}
      </div>

      {/* Handle Icon */}
      <div className={cn(
          "absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity",
          data.color?.includes('bg-slate-900') ? "text-slate-400" : "text-slate-300"
      )}>
        <GripVertical size={16} />
      </div>
    </motion.div>
  );
};