import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Sparkles, Brain, Check, Briefcase, GraduationCap, User, Layout, Share2, GitCommitHorizontal, Wand2, PenTool, RotateCcw, ArrowLeft, X } from 'lucide-react';
import { 
  DoodleBrain, 
  DoodleStar, 
  DoodleArrow, 
  DoodleUnderline, 
  DoodleCheck, 
  DoodleCrown, 
  DoodleSparkle, 
  DoodleCircle,
  DoodleTree,
  DoodleRadial,
  DoodleFlow,
  DoodleTimeline,
  DoodleFishbone,
  DoodleCycle,
  DoodleDraft,
  DoodleComplexMindMap,
  DoodleComplexAI,
  DoodleComplexUseCases,
  DoodleComplexInput,
  DoodleComplexPremium,
  DoodleLamp,
  DoodleMagicAI,
  DoodleIdeaInput,
  DoodlePremiumLock,
  DoodleStudy,
  DoodleWork,
  DoodlePersonal
} from './Doodles';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
  initialStep?: number;
  onComplete: (data: { 
    topic: string; 
    layout: string; 
    mode: 'ai' | 'manual';
    tone: string;
    depth: string;
    theme: string;
  }) => void;
  onCancel?: () => void;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onCancel, initialStep = 0 }) => {
  const [[page, direction], setPage] = useState([initialStep, 0]);
  const [selectedUse, setSelectedUse] = useState<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('monochrome');
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("creative");
  const [depth, setDepth] = useState("medium");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const nextStep = () => {
    if (page < 7) {
      paginate(1);
    } else {
      onComplete({ 
        topic, 
        layout: selectedLayout || 'hierarchical', 
        mode,
        tone,
        depth,
        theme: selectedTheme
      });
    }
  };

  const prevStep = () => {
    if (page > initialStep) {
      paginate(-1);
    } else if (onCancel) {
      onCancel();
    }
  };

  // Content for each screen
  const renderScreen = () => {
    switch (page) {
      case 0: // Welcome
        return (
          <div className="flex flex-col h-full items-center justify-center relative p-6 text-center pt-10">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="w-full max-w-[360px] aspect-[4/3] mb-8 flex items-center justify-center"
             >
                <DoodleComplexMindMap className="w-full h-full" color="#0f172a" delay={0.2} />
             </motion.div>
            
             <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="relative z-10 mb-4 max-w-xs mx-auto"
            >
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">
                Think Clearly.
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Transform chaotic thoughts into structured plans.
              </p>
            </motion.div>
            
            <div className="absolute bottom-12 w-full px-6">
              <button 
                onClick={nextStep}
                className="group w-full h-14 bg-white text-slate-900 border-2 border-slate-900 font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );

      case 1: // AI Feature
        return (
          <div className="flex flex-col h-full items-center justify-center relative p-6 text-center">
             <motion.div 
                className="w-full max-w-[360px] aspect-[4/3] mb-6 flex items-center justify-center mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
             >
                <DoodleComplexAI className="w-full h-full" color="#0f172a" delay={0.2} />
             </motion.div>
                
             <motion.div 
               className="relative mb-10"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
             >
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  AI <span className="relative inline-block">organizes<DoodleUnderline className="absolute top-full left-0 w-full h-4 text-blue-400 opacity-70" delay={0.6} /></span> your thoughts.
                </h2>
                
                <div className="relative mt-8 px-8">
                    <p className="text-slate-500 text-lg">
                        Just type a topic, and we'll build the map for you.
                    </p>
                    <DoodleArrow className="absolute -right-2 -top-6 w-12 h-12 text-green-400 rotate-45" delay={0.8} />
                </div>
             </motion.div>

             <div className="absolute bottom-12 w-full px-6">
              <button 
                onClick={nextStep}
                className="w-full h-14 bg-white text-slate-900 border-2 border-slate-900 font-bold rounded-2xl hover:bg-slate-50 active:scale-95 transition-transform shadow-sm"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 2: // Personalization
        return (
          <div className="flex flex-col h-full pt-10 px-6 relative">
             <motion.div 
                className="w-full max-w-[320px] aspect-[4/3] mb-4 flex items-center justify-center mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
             >
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] aspect-[4/3] -z-10 opacity-10">
                   <DoodleComplexUseCases className="w-full h-full scale-150" color="#0f172a" delay={0.2} />
                </div>
                <div className="w-24 h-24 bg-white border-2 border-slate-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#0f172a] mb-6 mx-auto rotate-3 hover:rotate-6 transition-transform">
                   <DoodleCheck className="w-12 h-12 text-slate-900" />
                </div>
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-3xl font-bold text-slate-900 mb-8 text-center"
             >
               What will you use it for?
             </motion.h2>

             <div className="flex flex-col gap-4">
                {[
                    { id: 'study', label: 'Study', icon: GraduationCap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                    { id: 'work', label: 'Work', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { id: 'personal', label: 'Personal', icon: User, color: 'text-pink-500', bg: 'bg-pink-50' }
                ].map((item, i) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setSelectedUse(item.id)}
                        className={cn(
                            "relative w-full p-4 rounded-2xl border-2 border-slate-900 flex items-center gap-4 transition-all text-left group",
                            selectedUse === item.id 
                                ? "bg-slate-900 text-white shadow-none translate-x-[4px] translate-y-[4px]" 
                                : "bg-white text-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f172a]"
                        )}
                    >
                        <div className={cn(
                            "p-3 rounded-xl border-2 transition-colors duration-300",
                            selectedUse === item.id 
                                ? "bg-white text-slate-900 border-white" 
                                : "bg-slate-100 text-slate-900 border-slate-900 group-hover:bg-white"
                        )}>
                            <item.icon size={24} strokeWidth={2} />
                        </div>
                        <span className="text-lg font-bold flex-1">{item.label}</span>
                        
                        {selectedUse === item.id && (
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="text-white"
                            >
                                <DoodleCheck className="w-6 h-6" />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
             </div>

             <div className="absolute bottom-12 w-full left-0 px-6">
              <button 
                onClick={nextStep}
                disabled={!selectedUse}
                className={cn(
                    "w-full h-14 font-bold rounded-2xl transition-all flex items-center justify-center border-2 shadow-sm",
                    selectedUse 
                        ? "bg-white text-slate-900 border-slate-900 hover:bg-slate-50 active:scale-95 opacity-100" 
                        : "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                )}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3: // AI Setup - Topic Input
        return (
          <div className="flex flex-col h-full pt-10 px-6 relative items-center text-center">
             <motion.div 
                className="w-full max-w-[360px] aspect-[4/3] mb-6 flex items-center justify-center mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
             >
                <DoodleLamp className="w-full h-full" color="#0f172a" delay={0.2} />
             </motion.div>

             <motion.h2 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="text-2xl font-bold text-slate-900 mb-6"
             >
               What's on your mind?
             </motion.h2>

             <div className="w-full relative max-w-sm">
                 <input 
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., 'Space Exploration')"
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all text-center text-lg placeholder:text-slate-400"
                    autoFocus
                 />
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="w-full max-w-sm mt-6 flex flex-col gap-5"
             >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-left ml-1">Tone</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Creative', 'Professional', 'Academic', 'Simple'].map((t) => (
                       <button
                         key={t}
                         onClick={() => setTone(t.toLowerCase())}
                         className={cn(
                           "px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border-2",
                           tone === t.toLowerCase() 
                             ? "bg-slate-900 text-white border-slate-900" 
                             : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                         )}
                       >
                         {t}
                       </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-left ml-1">Depth</label>
                  <div className="flex gap-2">
                    {['Basic', 'Medium', 'Advanced'].map((d) => (
                       <button
                         key={d}
                         onClick={() => setDepth(d.toLowerCase())}
                         className={cn(
                           "flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border-2",
                           depth === d.toLowerCase() 
                             ? "bg-slate-900 text-white border-slate-900" 
                             : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                         )}
                       >
                         {d}
                       </button>
                    ))}
                  </div>
                </div>
             </motion.div>

             <div className="flex-1 w-full" />

             <div className="absolute bottom-12 w-full left-0 px-6">
              <button 
                onClick={nextStep}
                disabled={!topic}
                className={cn(
                    "w-full h-14 font-bold rounded-2xl transition-all border-2 shadow-sm",
                    topic
                        ? "bg-white text-slate-900 border-slate-900 hover:bg-slate-50 active:scale-95" 
                        : "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                )}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 4: // Template Selection
        const layouts = [
            { id: 'hierarchical', label: 'Hierarchical', sub: 'Top-down', doodle: DoodleTree, color: '#0A84FF' },
            { id: 'radial', label: 'Radial', sub: 'Brainstorm', doodle: DoodleRadial, color: '#FF9F0A' },
            { id: 'left-to-right', label: 'Left-to-Right', sub: 'Process Flow', doodle: DoodleFlow, color: '#30D158' },
            { id: 'timeline', label: 'Timeline', sub: 'Chronological', doodle: DoodleTimeline, color: '#AF52DE' },
            { id: 'concept-map', label: 'Concept Map', sub: 'Network', doodle: DoodleFishbone, color: '#FF2D55' },
            { id: 'cycle', label: 'Cycle', sub: 'Looping', doodle: DoodleCycle, color: '#5AC8FA' }
        ];

        return (
            <div className="flex flex-col h-full pt-12 px-6 relative items-center text-center">
                {!isAiLoading ? (
                    <>
                        <motion.h2 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-slate-900 mb-2"
                        >
                            Choose a layout
                        </motion.h2>
                        <p className="text-slate-500 mb-6">How should we organize "{topic}"?</p>

                        <div className="w-full h-[50vh] overflow-y-auto pr-2 pb-24 grid grid-cols-1 gap-4 no-scrollbar">
                            {layouts.map((layout, i) => (
                                <motion.button
                                    key={layout.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelectedLayout(layout.id)}
                                    className={cn(
                                        "relative w-full p-4 rounded-2xl border-2 border-slate-900 flex items-center gap-4 transition-all text-left shrink-0",
                                        selectedLayout === layout.id
                                            ? "bg-slate-900 text-white shadow-none translate-x-[4px] translate-y-[4px]"
                                            : "bg-white text-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f172a]"
                                    )}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                                        <layout.doodle className="w-full h-full" color={selectedLayout === layout.id ? "#ffffff" : "#0f172a"} delay={0.2} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn("font-bold text-lg", selectedLayout === layout.id ? "text-white" : "text-slate-900")}>{layout.label}</h3>
                                        <p className={cn("text-xs font-medium", selectedLayout === layout.id ? "text-slate-300" : "text-slate-500")}>{layout.sub}</p>
                                    </div>
                                    {selectedLayout === layout.id && (
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-slate-900">
                                            <Check size={16} className="text-slate-900 stroke-[3]" />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        <div className="absolute bottom-12 w-full left-0 px-6 bg-gradient-to-t from-white via-white to-transparent pt-8 flex gap-3">
                            <button
                                onClick={() => {
                                    if (!selectedLayout) return;
                                    setMode('manual');
                                    nextStep();
                                }}
                                disabled={!selectedLayout}
                                className={cn(
                                    "flex-1 h-14 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 hover:border-slate-300 hover:bg-slate-50 active:scale-95 shadow-sm",
                                    !selectedLayout && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <DoodleDraft className="w-8 h-8 text-current" />
                                Manual
                            </button>
                            <button 
                                onClick={() => {
                                    if (!selectedLayout) return;
                                    setMode('ai');
                                    setIsAiLoading(true);
                                    setTimeout(() => {
                                        setIsAiLoading(false);
                                        nextStep();
                                    }, 2500);
                                }}
                                disabled={!selectedLayout}
                                className={cn(
                                    "flex-1 h-14 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border-2 shadow-sm",
                                    selectedLayout
                                        ? "bg-white text-slate-900 border-slate-900 hover:bg-slate-50 active:scale-95" 
                                        : "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                                )}
                            >
                                <Wand2 size={18} />
                                Generate
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 w-full flex flex-col items-center justify-center">
                        <div className="relative w-64 h-64">
                             <DoodleCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-blue-200" />
                             
                             {/* Dynamic Loading Doodle */}
                             {selectedLayout === 'hierarchical' && <DoodleTree className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-[#0A84FF]" />}
                             {selectedLayout === 'radial' && <DoodleRadial className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-[#FF9F0A]" />}
                             {selectedLayout === 'left-to-right' && <DoodleFlow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-[#30D158]" />}
                             {selectedLayout === 'timeline' && <DoodleTimeline className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-[#AF52DE]" />}
                             {selectedLayout === 'concept-map' && <DoodleFishbone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-[#FF2D55]" />}
                             {selectedLayout === 'cycle' && <DoodleCycle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-[#5AC8FA]" />}
                             
                             <motion.div 
                                className="absolute inset-0"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                             >
                                <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full" />
                                <div className="absolute bottom-12 right-12 w-2 h-2 bg-green-400 rounded-full" />
                                <div className="absolute bottom-12 left-12 w-2 h-2 bg-pink-400 rounded-full" />
                             </motion.div>
                             <p className="absolute -bottom-10 left-0 w-full text-center text-slate-500 font-medium animate-pulse">
                                 Sketching your {selectedLayout} map...
                             </p>
                        </div>
                    </div>
                )}
            </div>
        );

      case 5: // Theme Selection
        return (
          <div className="flex flex-col h-full pt-12 px-6 relative items-center text-center">
            <motion.h2 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-slate-900 mb-2"
            >
                Choose a Style
            </motion.h2>
            <p className="text-slate-500 mb-8">How should your map look?</p>

            <div className="w-full flex flex-col gap-4 max-w-sm">
                {[
                    { id: 'monochrome', label: 'Monochrome', sub: 'Minimal & Clean', color: 'bg-white', border: 'border-slate-900', text: 'text-slate-900' },
                    { id: 'anime', label: 'Anime', sub: 'Vibrant & Playful', color: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-600' },
                    { id: 'classic', label: 'Classic', sub: 'Professional Blue', color: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600' },
                    { id: 'professional', label: 'Professional', sub: 'Corporate & Sleek', color: 'bg-slate-50', border: 'border-slate-400', text: 'text-slate-700' }
                ].map((theme, i) => (
                    <motion.button
                        key={theme.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={cn(
                            "relative w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left group",
                            selectedTheme === theme.id
                                ? "bg-slate-900 text-white border-slate-900 shadow-none translate-x-[4px] translate-y-[4px]"
                                : "bg-white text-slate-900 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f172a]"
                        )}
                    >
                         <div className={cn(
                             "w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 transition-colors",
                             selectedTheme === theme.id ? "bg-white border-white" : `${theme.color} ${theme.border}`
                         )}>
                             <div className={cn("w-6 h-6 rounded-full border-2 border-current", selectedTheme === theme.id ? theme.text : "text-current")} />
                         </div>
                         <div className="flex-1">
                             <h3 className={cn("font-bold text-lg", selectedTheme === theme.id ? "text-white" : "text-slate-900")}>{theme.label}</h3>
                             <p className={cn("text-xs font-medium", selectedTheme === theme.id ? "text-slate-300" : "text-slate-500")}>{theme.sub}</p>
                         </div>
                         {selectedTheme === theme.id && (
                             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-slate-900">
                                 <Check size={16} className="text-slate-900 stroke-[3]" />
                             </div>
                         )}
                    </motion.button>
                ))}
            </div>

            <div className="absolute bottom-12 w-full left-0 px-6">
              <button 
                onClick={nextStep}
                className="w-full h-14 bg-white text-slate-900 border-2 border-slate-900 font-bold rounded-2xl hover:bg-slate-50 active:scale-95 transition-transform shadow-sm"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 6: // Proposal Preview
        return (
            <div className="flex flex-col h-full pt-10 px-6 relative items-center text-center">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.8 }}
                   className="mt-14 mb-4 relative w-48 h-48 flex items-center justify-center"
                 >
                    <div className="absolute inset-0 bg-blue-50/60 rounded-full blur-3xl transform scale-75" />
                    <DoodleMagicAI className="w-full h-full relative z-10" color="#0f172a" delay={0.2} />
                 </motion.div>

                 <motion.h2 
                   initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                   className="text-2xl font-bold text-slate-900 mb-2"
                 >
                   Here's a starting point
                 </motion.h2>
                 <p className="text-slate-500 mb-8">We've outlined the main structure for "{topic}".</p>

                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-sm bg-white rounded-2xl p-6 text-left border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] overflow-y-auto max-h-[40vh]"
                 >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-5 h-5 rounded-full border-[3px] border-slate-900 bg-white shadow-sm" />
                        <span className="font-bold text-xl text-slate-900">{topic}</span>
                    </div>
                    <div className="pl-2.5 ml-2.5 border-l-[3px] border-dashed border-slate-200 space-y-6 pb-2">
                        {['Key Concept 1', 'Key Concept 2', 'Key Concept 3'].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[13px] top-3.5 w-3 h-[3px] bg-slate-200" />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-900 ring-2 ring-slate-100" />
                                    <span className="font-bold text-slate-800 text-lg">{item}</span>
                                </div>
                                <div className="pl-6 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <div className="h-2 w-32 bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <div className="h-2 w-24 bg-slate-100 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </motion.div>

                 <div className="absolute bottom-12 w-full left-0 px-6 flex gap-3">
                    <button
                        onClick={() => {
                            setIsAiLoading(true);
                            setTimeout(() => setIsAiLoading(false), 1500);
                        }}
                        className="flex-1 h-14 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-50 active:scale-95 shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Regenerate
                    </button>
                    <button 
                        onClick={nextStep}
                        className="flex-1 h-14 bg-white text-slate-900 border-2 border-slate-900 font-bold rounded-2xl hover:bg-slate-50 active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Check className="w-5 h-5" />
                        Looks Good
                    </button>
                 </div>
                 
                 {isAiLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                         <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"/>
                         <p className="text-slate-600 font-medium">Refining structure...</p>
                    </div>
                 )}
            </div>
        );

      case 7: // Premium
        return (
          <div className="flex flex-col h-full items-center justify-center relative p-6 text-center">
             <motion.div 
                className="w-full max-w-[360px] aspect-[4/3] mb-6 flex items-center justify-center mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
             >
                <DoodleComplexPremium className="w-full h-full" color="#0f172a" delay={0.2} />
             </motion.div>

             <h2 className="text-3xl font-bold text-slate-900 mb-4">
                 Unlock Everything
             </h2>
             
             <ul className="text-left space-y-4 mb-8">
                 {['Unlimited Mind Maps', 'AI Brainstorming', 'Export to PDF & PNG', 'Cloud Sync'].map((feat, i) => (
                     <motion.li 
                        key={feat}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="flex items-center gap-3 text-lg text-slate-600"
                     >
                         <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                             <Check size={14} className="text-[#0A84FF]" />
                         </div>
                         {feat}
                     </motion.li>
                 ))}
             </ul>

             <div className="absolute bottom-12 w-full px-6 flex flex-col gap-4">
              <button 
                onClick={nextStep}
                className="w-full h-14 bg-white text-slate-900 border-2 border-slate-900 font-bold rounded-2xl hover:bg-slate-50 active:scale-95 transition-transform shadow-sm"
              >
                Try Pro for Free
              </button>
              <button 
                onClick={nextStep}
                className="text-slate-400 font-medium text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-white text-slate-900 font-sans overflow-hidden relative selection:bg-blue-100">
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
          {(page > initialStep || (onCancel && page === initialStep)) && (
            <button 
                onClick={prevStep}
                className="p-3 rounded-full hover:bg-slate-100 transition-colors active:scale-95"
            >
                {page === initialStep && onCancel ? <X size={24} /> : <ArrowLeft size={24} />}
            </button>
          )}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute top-12 left-0 w-full flex justify-center gap-2 px-6 pointer-events-none z-40">
         {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
             <div 
                key={i}
                className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === page ? "w-8 bg-slate-900" : "w-2 bg-slate-200",
                    i < initialStep ? "hidden" : "block"
                )}
             />
         ))}
      </div>
    </div>
  );
};