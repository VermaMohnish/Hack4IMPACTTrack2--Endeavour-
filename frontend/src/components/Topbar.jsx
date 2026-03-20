import React from "react";
import { ShieldAlert, Activity, Bell } from "lucide-react";
import useAegisStore from "../store/useAegisStore";

const Topbar = () => {
  const { alerts } = useAegisStore();
  const criticalAlertsCount = alerts.filter(a => a.type === "critical").length;

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-lg px-6 py-4 flex justify-between items-center z-50">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <ShieldAlert className="w-8 h-8 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
          {criticalAlertsCount > 0 && (
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
             </span>
          )}
        </div>
        <h1 className="text-2xl font-black tracking-widest text-white font-rajdhani">
          AEGIS<span className="text-rose-500">GRID</span>
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center px-4 py-1.5 bg-emerald-950/30 border border-emerald-500/30 rounded-full shadow-inner">
          <Activity className="w-4 h-4 text-emerald-400 mr-2 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 tracking-wider">System Online</span>
        </div>
        
        <div className="relative cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-slate-900 shadow-md">
              {alerts.length > 9 ? '9+' : alerts.length}
            </span>
          )}
        </div>

        <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full border border-slate-500 flex items-center justify-center font-bold text-sm shadow-lg overflow-hidden relative group cursor-pointer ring-2 ring-slate-800">
           <span className="relative z-10 text-white font-share">OP</span>
           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
