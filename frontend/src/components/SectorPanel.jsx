import React, { useState, useRef, useEffect } from "react";
import useAegisStore from "../store/useAegisStore";
import { Layers, Shield, Send, PlusSquare, Flame, Truck, Navigation, X, Crosshair } from "lucide-react";

const ASSET_TYPES = [
  { type: "PoliceJeep", label: "Police Jeep", icon: Shield,     color: "text-blue-400" },
  { type: "Helicopter", label: "Helicopter",  icon: Navigation, color: "text-emerald-400" },
  { type: "Ambulance",  label: "Ambulance",   icon: PlusSquare, color: "text-rose-400" },
  { type: "FireTruck",  label: "Fire Truck",  icon: Truck,      color: "text-orange-400" },
];

const SectorPanel = () => {
  const { sectors, assets, dispatchAsset } = useAegisStore();
  const [openSectorId, setOpenSectorId] = useState(null);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpenSectorId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Static total of assets physically stationed in this sector
  const getAssetCount = (sectorId, type) =>
    assets.filter(a => a.sectorId === sectorId && a.type === type).length;

  // Dynamic count of "AVAILABLE" assets physically stationed in this sector 
  const getAvailableCount = (sectorId, type) =>
    assets.filter(a => a.sectorId === sectorId && a.type === type && a.status === "AVAILABLE").length;

  const totalAvailable = assets.filter(a => a.status === "AVAILABLE").length;

  const handleDispatch = (sectorId, type) => {
    // Only dispatch an asset that is in this exact sector
    const unit = assets.find(a => a.sectorId === sectorId && a.type === type && a.status === "AVAILABLE");
    if (unit) {
      dispatchAsset(unit.id, sectorId);
    }
    setOpenSectorId(null);
  };

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
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar relative z-10 p-1">
        {sectors.map((sector) => {
          // Check if this specific sector has ANY available units of ANY type
          const sectorHasAvailableUnits = assets.some(a => a.sectorId === sector.id && a.status === 'AVAILABLE');

          return (
            <div 
              key={sector.id} 
              className={`p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg relative ${
                openSectorId === sector.id ? "z-50" : "z-10"
              } ${
                sector.risk === "High" 
                  ? "bg-red-950/30 border-red-500/50 shadow-red-900/20" 
                  : sector.risk === "Warning"
                    ? "bg-yellow-950/30 border-yellow-500/50 shadow-yellow-900/20"
                    : "bg-slate-800/40 border-slate-700/50 hover:border-blue-500/50"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${sector.risk === "High" ? "bg-red-500 shadow-red-500 animate-pulse" : sector.risk === "Warning" ? "bg-yellow-500 shadow-yellow-500 animate-pulse" : "bg-emerald-500 shadow-emerald-500"}`}></div>
                  <h3 className="font-bold text-white text-md font-rajdhani tracking-wide">{sector.name}</h3>
                  <span className="text-[10px] text-slate-500 font-share font-bold ml-1">SEC-0{sector.id}</span>
                </div>
                
                {/* COMMAND button with picker */}
                <div className="relative" ref={openSectorId === sector.id ? pickerRef : null}>
                  <button
                    onClick={() => setOpenSectorId(openSectorId === sector.id ? null : sector.id)}
                    disabled={!sectorHasAvailableUnits}
                    className="bg-blue-600/10 hover:bg-blue-500 hover:text-white text-blue-400 border border-blue-500/20 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center group shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3 h-3 mr-1.5 group-hover:translate-x-0.5 transition-transform" /> COMMAND
                  </button>

                  {/* Type Picker Dropdown */}
                  {openSectorId === sector.id && (
                    <div className="absolute right-0 top-9 w-44 bg-slate-900 border border-slate-700/70 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dispatch to {sector.name}</span>
                        <button onClick={() => setOpenSectorId(null)} className="text-slate-600 hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {ASSET_TYPES.map(({ type, label, icon: Icon, color }) => {
                        const available = getAvailableCount(sector.id, type);
                        return (
                          <button
                            key={type}
                            onClick={() => handleDispatch(sector.id, type)}
                            disabled={available === 0}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-b border-slate-800/50 last:border-none"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`w-3.5 h-3.5 ${color}`} />
                              <span className="text-[11px] text-slate-200 font-bold">{label}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${available > 0 ? "text-emerald-400 bg-emerald-950/40" : "text-slate-500 bg-slate-800"}`}>
                              {available} avail
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
               <div className="flex flex-col gap-2">
                 {/* Infrastructure Badges */}
                 <div className="flex gap-2">
                    <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/60 border border-slate-700/50 py-1.5 rounded-lg text-[10px] sm:text-xs text-slate-300 shadow-inner">
                      <Shield className="w-3 h-3 text-blue-400"/> {sector.policeStations}
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/60 border border-slate-700/50 py-1.5 rounded-lg text-[10px] sm:text-xs text-slate-300 shadow-inner">
                      <Crosshair className="w-3 h-3 text-emerald-400"/> {sector.crpfCamps}
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/60 border border-slate-700/50 py-1.5 rounded-lg text-[10px] sm:text-xs text-slate-300 shadow-inner">
                      <PlusSquare className="w-3 h-3 text-rose-400"/> {sector.hospitals}
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/60 border border-slate-700/50 py-1.5 rounded-lg text-[10px] sm:text-xs text-slate-300 shadow-inner">
                      <Flame className="w-3 h-3 text-orange-400"/> {sector.fireStations}
                    </div>
                 </div>

                 {/* Resourcing Badges */}
                 <div className="flex gap-2">
                    <div className="flex-1 flex items-center justify-center gap-1 bg-blue-950/20 border border-blue-900/30 py-1 rounded-lg text-[9px] sm:text-xs text-slate-400 font-share">
                      <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500/70"/><span className="text-blue-400">{getAvailableCount(sector.id, 'PoliceJeep')}</span> Jeep
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1 bg-emerald-950/20 border border-emerald-900/30 py-1 rounded-lg text-[9px] sm:text-xs text-slate-400 font-share">
                      <Navigation className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500/70"/><span className="text-emerald-400">{getAvailableCount(sector.id, 'Helicopter')}</span> Heli
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1 bg-rose-950/20 border border-rose-900/30 py-1 rounded-lg text-[9px] sm:text-xs text-slate-400 font-share">
                      <PlusSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500/70"/><span className="text-rose-400">{getAvailableCount(sector.id, 'Ambulance')}</span> Amb
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1 bg-orange-950/20 border border-orange-900/30 py-1 rounded-lg text-[9px] sm:text-xs text-slate-400 font-share">
                      <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500/70"/><span className="text-orange-400">{getAvailableCount(sector.id, 'FireTruck')}</span> Fire
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorPanel;


