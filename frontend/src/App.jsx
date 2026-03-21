import React, { useEffect } from "react";
import Topbar from "./components/Topbar";
import SectorMap from "./components/SectorMap";
import SectorPanel from "./components/SectorPanel";
import AssetTracker from "./components/AssetTracker";
import AlertLog from "./components/AlertLog";
import useAegisStore from "./store/useAegisStore";
import "./App.css";

function App() {
  const initSocket = useAegisStore((state) => state.initSocket);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <>
      <div className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 flex flex-col font-exo selection:bg-blue-500/30 overflow-x-hidden">
        <div className="sticky top-0 z-[9999] shadow-2xl">
          <Topbar />
        </div>

        <main className="flex-1 p-4 space-y-8 max-w-[1600px] mx-auto w-full pb-16">
          {/* Section 1: Map */}
          <div className="w-full h-[calc(100vh-100px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/60 to-transparent z-[400] pointer-events-none"></div>
            <SectorMap />
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/60 to-transparent z-[400] pointer-events-none"></div>
          </div>

          {/* Section 2: Sector Intelligence & Live Feed
              KEY FIX: The grid itself has a fixed h-[800px].
              Each column div MUST have overflow-hidden + min-h-0 so the
              child component (which uses h-full) is actually capped at 800px
              and doesn't bleed through. Without overflow-hidden the glowing
              pseudo-element wrapper lets the inner card grow unbounded. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[800px]">
            <div className="relative group min-h-0 overflow-hidden rounded-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
              {/* h-full here fills the column, which is capped at 800px by the grid */}
              <div className="h-full relative">
                <SectorPanel />
              </div>
            </div>

            <div className="relative group min-h-0 overflow-hidden rounded-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
              <div className="h-full relative">
                <AlertLog />
              </div>
            </div>
          </div>

          {/* Section 3: Live Asset Telemetry */}
          <div className="h-[700px] relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <AssetTracker />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
