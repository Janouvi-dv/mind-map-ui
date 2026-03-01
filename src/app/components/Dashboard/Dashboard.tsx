import React from 'react';
import { motion } from 'motion/react';
import { Plus, Clock, FileText, Trash2, Search, LayoutGrid, List, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavedMap {
  id: string;
  title: string;
  lastEdited: string;
  theme: string;
  layout: string;
}

interface DashboardProps {
  maps: SavedMap[];
  onOpenMap: (map: SavedMap) => void;
  onCreateNew: () => void;
  onDeleteMap: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ maps, onOpenMap, onCreateNew, onDeleteMap }) => {
  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
            backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }} 
      />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Mind Maps</h1>
            <p className="text-slate-500 text-lg font-medium">Manage your ideas and projects.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-slate-900 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search maps..." 
                    className="h-12 pl-10 pr-4 rounded-xl bg-white border-2 border-slate-900 focus:shadow-[4px_4px_0px_0px_#0f172a] outline-none w-full md:w-64 transition-all"
                />
            </div>
            <button 
                onClick={onCreateNew}
                className="h-12 px-6 bg-slate-900 text-white font-bold rounded-xl border-2 border-slate-900 hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#0f172a]"
            >
                <Plus size={20} strokeWidth={3} />
                <span>New Map</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <motion.button
                onClick={onCreateNew}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative h-64 bg-white rounded-3xl border-2 border-dashed border-slate-400 hover:border-slate-900 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer hover:bg-slate-50"
            >
                <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-300 group-hover:bg-slate-900 group-hover:border-slate-900 flex items-center justify-center transition-colors">
                    <Plus className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" strokeWidth={3} />
                </div>
                <span className="font-bold text-slate-500 group-hover:text-slate-900 text-lg">Create New Map</span>
            </motion.button>

            {maps.map((map, i) => (
                <motion.div
                    key={map.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onOpenMap(map)}
                    className="group relative h-64 bg-white rounded-3xl border-2 border-slate-900 transition-all cursor-pointer shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col"
                >
                    {/* Preview Area Mockup */}
                    <div className={cn(
                        "flex-1 w-full relative p-6 flex items-center justify-center overflow-hidden border-b-2 border-slate-900",
                        map.theme === 'anime' ? "bg-pink-50" : map.theme === 'classic' ? "bg-blue-50" : map.theme === 'professional' ? "bg-slate-50" : "bg-slate-50"
                    )}>
                        <div className={cn(
                            "absolute inset-0 opacity-10",
                            map.theme === 'anime' 
                                ? "bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px]" 
                                : map.theme === 'classic'
                                    ? "bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]"
                                    : map.theme === 'professional'
                                        ? "bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:16px_16px]"
                                        : "bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]"
                        )}/>
                        
                        {/* Mini Map Representation */}
                        <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                            <div className={cn(
                                "px-4 py-2 font-bold z-10 relative text-sm",
                                map.theme === 'professional' ? "bg-white border border-slate-300 text-slate-700 shadow-sm rounded-lg" : "rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]",
                                map.theme === 'anime' ? "bg-white border-pink-400 text-pink-700" : 
                                map.theme === 'classic' ? "bg-white border-blue-400 text-blue-700" : 
                                map.theme === 'professional' ? "" :
                                "bg-white border-slate-900 text-slate-900"
                            )}>
                                {map.title.length > 15 ? map.title.substring(0, 15) + '...' : map.title}
                            </div>
                            {/* Decorative Lines */}
                            <div className={cn("absolute top-1/2 left-full w-6 h-0.5 -translate-y-1/2", map.theme === 'anime' ? "bg-pink-300" : map.theme === 'classic' ? "bg-blue-300" : map.theme === 'professional' ? "bg-slate-300" : "bg-slate-900")} />
                            <div className={cn("absolute top-1/2 right-full w-6 h-0.5 -translate-y-1/2", map.theme === 'anime' ? "bg-pink-300" : map.theme === 'classic' ? "bg-blue-300" : map.theme === 'professional' ? "bg-slate-300" : "bg-slate-900")} />
                            <div className={cn("absolute top-full left-1/2 h-6 w-0.5 -translate-x-1/2", map.theme === 'anime' ? "bg-pink-300" : map.theme === 'classic' ? "bg-blue-300" : map.theme === 'professional' ? "bg-slate-300" : "bg-slate-900")} />
                        </div>
                    </div>

                    {/* Info Footer */}
                    <div className="p-4 bg-white relative z-20">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{map.title}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{map.layout}</p>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteMap(map.id); }}
                                className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mt-2">
                            <Clock size={14} />
                            <span>Edited {map.lastEdited}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};