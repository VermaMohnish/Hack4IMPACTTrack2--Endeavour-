import React, { useState, useRef, useEffect } from "react";
import { ShieldAlert, Activity, Bell, WifiOff, AlertOctagon, Zap, CheckCircle, Info, X } from "lucide-react";
import useAegisStore from "../store/useAegisStore";

const Topbar = () => {
  const { alerts, isConnected } = useAegisStore();
  const [isOpen, setIsOpen] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const panelRef = useRef(null);

  const unreadCount = Math.max(0, alerts.length - readCount);
  const criticalAlertsCount = alerts.filter(a => a.type === "critical").length;

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keep readCount from exceeding total alerts if alerts get cleared
  useEffect(() => {
    if (readCount > alerts.length) setReadCount(alerts.length);
  }, [alerts.length]);

  const handleMarkAllRead = () => {
    setReadCount(alerts.length);
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "critical": return <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />;
      case "warning":  return <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case "success":  return <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      default:         return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case "critical": return "border-rose-500/40 bg-rose-950/30";
      case "warning":  return "border-amber-500/40 bg-amber-950/30";
      case "success":  return "border-emerald-500/40 bg-emerald-950/30";
      default:         return "border-slate-700 bg-slate-800/40";
    }
  };

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
        {/* Dynamic Socket Status Badge */}
        {isConnected ? (
          <div className="hidden md:flex items-center px-4 py-1.5 bg-emerald-950/30 border border-emerald-500/30 rounded-full shadow-inner">
            <Activity className="w-4 h-4 text-emerald-400 mr-2 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 tracking-wider">System Online</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center px-4 py-1.5 bg-rose-950/30 border border-rose-500/30 rounded-full shadow-inner">
            <WifiOff className="w-4 h-4 text-rose-400 mr-2" />
            <span className="text-xs font-bold text-rose-400 tracking-wider">Disconnected</span>
          </div>
        )}

        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="relative cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-colors"
          >
            <Bell className={`w-5 h-5 transition-colors ${isOpen ? 'text-white' : 'text-slate-400 hover:text-white'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-slate-900 shadow-md">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {isOpen && (
            <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl z-[999] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                <span className="text-sm font-bold text-white font-rajdhani tracking-wider">
                  Notifications <span className="text-slate-400 font-normal">({alerts.length})</span>
                </span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider"
                    >
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alert List */}
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                    <Bell className="w-8 h-8 mb-2 opacity-30" />
                    <span className="text-xs">No notifications</span>
                  </div>
                ) : (
                  alerts.slice(0, 50).map((alert, i) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-slate-800/60 transition-colors hover:bg-slate-800/40 ${getBadgeStyle(alert.type)} ${i < unreadCount ? 'border-l-2' : ''}`}
                    >
                      <div className="mt-0.5">{getIcon(alert.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-slate-200 leading-snug">{alert.message}</p>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          {new Date(alert.time).toLocaleTimeString()} · <span className="uppercase font-bold">{alert.type}</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {unreadCount === 0 && alerts.length > 0 && (
                <div className="px-4 py-2.5 text-center border-t border-slate-800">
                  <span className="text-[11px] text-slate-500">All notifications read</span>
                </div>
              )}
            </div>
          )}
        </div>


      </div>
    </header>
  );
};

export default Topbar;

