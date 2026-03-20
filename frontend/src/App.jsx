import React, { useEffect } from 'react';
import Topbar from './components/Topbar';
import SectorMap from './components/SectorMap';
import SectorPanel from './components/SectorPanel';
import AssetTracker from './components/AssetTracker';
import AlertLog from './components/AlertLog';
import useAegisStore from './store/useAegisStore';
import './App.css';

function App() {
  const initSocket = useAegisStore((state) => state.initSocket);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <>
      <div className="h-screen w-screen overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 flex flex-col font-exo selection:bg-blue-500/30">
        <Topbar />
        
        <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-73px)]">
          
          {/* Left Navigation Context (Map) */}
          <div className="lg:col-span-7 xl:col-span-8 h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl relative">
             <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/60 to-transparent z-[400] pointer-events-none"></div>
             <SectorMap />
             <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/60 to-transparent z-[400] pointer-events-none"></div>
          </div>

          {/* Right Metrics Panel */}
          <div className="lg:col-span-5 xl:col-span-4 h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex-[4] min-h-0">
              <SectorPanel />
            </div>
            
            <div className="flex-[3] min-h-0">
              <AlertLog />
            </div>

            <div className="flex-[3] min-h-0">
              <AssetTracker />
            </div>
          </div>

        </main>
      </div>
    </>
  );
}

export default App;
