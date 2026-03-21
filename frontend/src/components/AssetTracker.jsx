import React from "react";
import useAegisStore from "../store/useAegisStore";
import { Truck, Crosshair, Navigation, Activity, Shield, PlusSquare } from "lucide-react";

const AssetTracker = () => {
  const { assets } = useAegisStore();

  const getStatusColor = (status) => {
    switch(status.toUpperCase()) {
      case "AVAILABLE": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "BUSY": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl text-slate-200 h-full flex flex-col font-exo">
      <h2 className="text-lg font-bold mb-3 flex items-center border-b border-slate-700/50 pb-3 text-white font-rajdhani tracking-wider">
        <Crosshair className="w-4 h-4 mr-2 text-rose-500" />
        Live Asset Telemetry
      </h2>
      
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/50 font-rajdhani tracking-widest sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-3 py-2 rounded-tl-lg">ID</th>
              <th className="px-3 py-2">Entity</th>
              <th className="px-3 py-2">LOC</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2 rounded-tr-lg">Cmd</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-3 py-2.5 font-share font-bold text-slate-300 text-xs">#{asset.id}</td>
                <td className="px-3 py-2.5 flex items-center text-[11px] font-bold text-slate-200 uppercase tracking-wide">
                  {asset.type === 'Helicopter' && <Navigation className="w-3 h-3 mr-2 text-emerald-400" />}
                  {asset.type === 'PoliceJeep' && <Shield className="w-3 h-3 mr-2 text-blue-400" />}
                  {asset.type === 'Ambulance' && <PlusSquare className="w-3 h-3 mr-2 text-rose-400" />}
                  {asset.type === 'FireTruck' && <Truck className="w-3 h-3 mr-2 text-orange-400" />}
                  {asset.type}
                </td>
                <td className="px-3 py-2.5 font-share text-slate-400 text-[11px] text-center">
                   <div className="bg-slate-800/80 rounded border border-slate-700 px-1.5 py-0.5 inline-block">S-{asset.sectorId}</div>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider rounded border ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <button className="text-slate-500 hover:text-blue-400 transition-colors p-1" title="Initialize Ping">
                    <Activity className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTracker;
