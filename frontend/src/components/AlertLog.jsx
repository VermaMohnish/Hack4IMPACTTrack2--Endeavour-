import React from "react";
import useAegisStore from "../store/useAegisStore";
import { Activity, AlertOctagon, Info, Zap } from "lucide-react";

const AlertLog = () => {
  const { alerts } = useAegisStore();

  const getStyle = (type) => {
    switch (type) {
      case "critical":
        return "bg-rose-950/30 border-rose-500/50 text-rose-400";
      case "warning":
        return "bg-amber-950/30 border-amber-500/50 text-amber-400";
      case "success":
        return "bg-emerald-950/30 border-emerald-500/50 text-emerald-400";
      default:
        return "bg-slate-800/40 border-slate-700 text-blue-400";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "critical":
        return <AlertOctagon className="w-4 h-4 mr-2 flex-shrink-0" />;
      case "warning":
        return <Zap className="w-4 h-4 mr-2 flex-shrink-0" />;
      case "success":
        return <Activity className="w-4 h-4 mr-2 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 mr-2 flex-shrink-0" />;
    }
  };

  return (
    // FIX 1 & 2: h-full ensures it matches SectorPanel height (both are in a h-[800px] grid).
    // overflow-hidden on the outer container prevents the card itself from growing.
    // The inner feed div gets flex-1 + overflow-y-auto so only IT scrolls.
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl text-slate-200 h-full flex flex-col font-exo overflow-hidden">
      <h2 className="text-lg font-bold mb-3 flex items-center border-b border-slate-700/50 pb-3 text-white font-rajdhani tracking-wider flex-shrink-0">
        <Activity className="w-4 h-4 mr-2 text-emerald-400 animate-pulse" />
        Live Intel Feed
        <span className="ml-auto text-xs font-share text-slate-500 font-normal">
          {alerts.length} entries
        </span>
      </h2>

      {/* FIX 2: flex-1 makes this div take all remaining height; overflow-y-auto + custom-scrollbar gives the scrollbar */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-1 custom-scrollbar min-h-0">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 py-10">
            <Activity className="w-8 h-8 mb-2 opacity-30" />
            <span className="text-xs">No intel yet</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border flex items-start transition-all duration-300 hover:-translate-x-1 hover:shadow-md ${getStyle(alert.type)}`}
            >
              {getIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 font-rajdhani">
                    {alert.type} SIGNAL
                  </span>
                  <span className="text-[10px] opacity-60 font-share truncate pl-2">
                    {new Date(alert.time).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-[13px] opacity-90 leading-snug">
                  {alert.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertLog;
