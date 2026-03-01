import React, { useState } from 'react';
import { MindMapCanvas } from './components/MindMap/Canvas';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { Dashboard } from './components/Dashboard/Dashboard';

interface MapData {
  id: string;
  title: string;
  layout: string;
  mode: 'ai' | 'manual';
  tone?: string;
  depth?: string;
  theme: string;
  lastEdited: string;
}

const mockMaps: MapData[] = [
  { id: '1', title: 'Project Roadmap 2024', layout: 'timeline', mode: 'manual', theme: 'classic', lastEdited: '2 hours ago' },
  { id: '2', title: 'Marketing Campaign', layout: 'radial', mode: 'ai', theme: 'anime', lastEdited: 'Yesterday' },
  { id: '3', title: 'System Architecture', layout: 'hierarchical', mode: 'manual', theme: 'monochrome', lastEdited: '3 days ago' },
];

function App() {
  const [view, setView] = useState<'onboarding' | 'dashboard' | 'editor'>('dashboard');
  const [maps, setMaps] = useState<MapData[]>(mockMaps);
  const [currentMap, setCurrentMap] = useState<MapData | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(true);

  const handleOnboardingComplete = (data: { 
    topic: string; 
    layout: string; 
    mode: 'ai' | 'manual';
    tone?: string;
    depth?: string;
    theme?: string;
  }) => {
    const newMap: MapData = {
        id: crypto.randomUUID(),
        title: data.topic,
        layout: data.layout,
        mode: data.mode,
        tone: data.tone,
        depth: data.depth,
        theme: data.theme || 'monochrome',
        lastEdited: 'Just now'
    };
    setMaps(prev => [newMap, ...prev]);
    setCurrentMap(newMap);
    setHasOnboarded(true);
    setView('editor');
  };

  const handleOpenMap = (map: MapData) => {
      setCurrentMap(map);
      setView('editor');
  };

  const handleDeleteMap = (id: string) => {
      setMaps(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="w-full h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {view === 'onboarding' && (
        <OnboardingFlow 
            onComplete={handleOnboardingComplete} 
            initialStep={hasOnboarded ? 3 : 0}
            onCancel={hasOnboarded ? () => setView('dashboard') : undefined}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard 
            maps={maps} 
            onOpenMap={handleOpenMap}
            onCreateNew={() => setView('onboarding')}
            onDeleteMap={handleDeleteMap}
        />
      )}

      {view === 'editor' && currentMap && (
        <MindMapCanvas 
            initialTopic={currentMap.title} 
            layout={currentMap.layout} 
            mode={currentMap.mode}
            tone={currentMap.tone}
            depth={currentMap.depth}
            theme={currentMap.theme}
            onExit={() => setView('dashboard')}
        />
      )}
    </div>
  );
}

export default App;