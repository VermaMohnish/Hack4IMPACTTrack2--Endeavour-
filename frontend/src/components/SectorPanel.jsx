import React from "react";
import useAegisStore from "../store/useAegisStore";
import { Layers, Shield, Send, PlusSquare, Flame, Truck, Navigation } from "lucide-react";

const SectorPanel = () => {
  const { sectors, assets } = useAegisStore();

  const getAssetCount = (sectorId, type) => {
    return assets.filter(a => a.sectorId === sectorId && a.type === type).length;
  };

  const totalAvailable = assets.filter(a => a.status === 'AVAILABLE').length;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl h-full flex flex-col font-exo relative overflow-hidden">
      {/* Dynamic Glow Layer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-blue-500/20 blur-2xl rounded-full pointer-events-none"></div>

      <div className="flex justify-between items-end mb-4 border-b border-slate-700/50 pb-3 relative z-10">
        <div>
          <h2 className="text-xl font-bold flex items-center text-white font-rajdhani tracking-wider">
            <Layers className="w-5 h-5 mr-2 text-blue-400" />
            Sector Intelligence
          </h2>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] uppercase font-share text-slate-400 tracking-wider">Active Fleet</span>
           <span className="text-lg font-rajdhani font-bold text-emerald-400 leading-none">{totalAvailable} Ready</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar relative z-10">
        {sectors.map((sector) => (
          <div 
            key={sector.id} 
            className={`p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
              sector.risk === "High" 
                ? "bg-red-950/30 border-red-500/50 shadow-red-900/20" 
                : "bg-slate-800/40 border-slate-700/50 hover:border-blue-500/50"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${sector.risk === "High" ? "bg-red-500 shadow-red-500 animate-pulse" : "bg-emerald-500 shadow-emerald-500"}`}></div>
                <h3 className="font-bold text-white text-md font-rajdhani tracking-wide">{sector.name}</h3>
                <span className="text-[10px] text-slate-500 font-share font-bold ml-1">SEC-0{sector.id}</span>
              </div>
              
              <button title="Dispatch Unit" className="bg-blue-600/10 hover:bg-blue-500 hover:text-white text-blue-400 border border-blue-500/20 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center group shadow-sm">
                <Send className="w-3 h-3 mr-1.5 group-hover:translate-x-0.5 transition-transform" /> COMMAND
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
               {/* Infrastructure Badges */}
               <div className="flex gap-2">
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/60 border border-slate-700/50 py-1.5 rounded-lg text-xs text-slate-300 shadow-inner">
                    <Shield className="w-3 h-3 text-blue-400"/> {sector.policeStations}
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/60 border border-slate-700/50 py-1.5 rounded-lg text-xs text-slate-300 shadow-inner">
                    <PlusSquare className="w-3 h-3 text-rose-400"/> {sector.hospitals}
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/60 border border-slate-700/50 py-1.5 rounded-lg text-xs text-slate-300 shadow-inner">
                    <Flame className="w-3 h-3 text-orange-400"/> {sector.fireStations}
                  </div>
               </div>

               {/* Resourcing Badges */}
               <div className="flex gap-2">
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-950/20 border border-emerald-900/30 py-1 rounded-lg text-xs text-slate-400 font-share">
                    <Navigation className="w-3 h-3 text-emerald-500/70"/> <span className="text-emerald-400">{getAssetCount(sector.id, 'Helicopter')}</span> Heli
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-950/20 border border-emerald-900/30 py-1 rounded-lg text-xs text-slate-400 font-share">
                    <PlusSquare className="w-3 h-3 text-emerald-500/70"/> <span className="text-emerald-400">{getAssetCount(sector.id, 'Ambulance')}</span> Amb
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-950/20 border border-emerald-900/30 py-1 rounded-lg text-xs text-slate-400 font-share">
                    <Truck className="w-3 h-3 text-emerald-500/70"/> <span className="text-emerald-400">{getAssetCount(sector.id, 'FireTruck')}</span> Fire
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorPanel;
