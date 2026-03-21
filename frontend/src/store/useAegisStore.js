import { create } from 'zustand';
import { io } from 'socket.io-client';
import { MOCK_SECTORS, MOCK_ASSETS, MOCK_ALERTS } from '../utils/mockData.js';

const useAegisStore = create((set, get) => ({
  sectors: MOCK_SECTORS,
  assets: MOCK_ASSETS,
  alerts: MOCK_ALERTS,
  socket: null,
  isConnected: false,

  initSocket: () => {
    if (get().socket) return; // Prevent multiple connections

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const newSocket = io(backendUrl, {
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      timeout: 20000,
    });

    set({ socket: newSocket });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket Server");
      set({ isConnected: true });
    });

    const handleSignal = (severity, data, color, riskLabel, alertType) => {
      if (data && data.sector_id) {
        set((state) => {
          const updatedSectors = state.sectors.map((s) =>
            s.id === data.sector_id ? { ...s, risk: riskLabel, color: color } : s
          );
          
          const newAlert = {
            id: Date.now(),
            message: data.message || `${severity} condition in Sector ${data.sector_id}`,
            time: new Date().toISOString(),
            type: alertType
          };

          return { sectors: updatedSectors, alerts: [newAlert, ...state.alerts].slice(0, 50) };
        });
      }
    };

    newSocket.on("Critical", (data) => handleSignal("Critical", data, "#ef4444", "High", "critical"));
    newSocket.on("Warning",  (data) => handleSignal("Warning", data, "#eab308", "Warning", "warning"));
    newSocket.on("Stable",   (data) => handleSignal("Stable", data, "#10b981", "Low", "info"));

    // Handle component unmount logic properly on client
    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket Server");
      set({ isConnected: false });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      set({ isConnected: false });
    });
  },

  dispatchAsset: (assetId, targetSectorId) => {
    set((state) => {
      const updatedAssets = state.assets.map((a) =>
        a.id === assetId ? { ...a, status: "BUSY", sectorId: targetSectorId } : a
      );

      const newAlert = {
        id: Date.now(),
        message: `Dispatched Unit #${assetId} to SEC-0${targetSectorId}`,
        time: new Date().toISOString(),
        type: "success"
      };

      return { assets: updatedAssets, alerts: [newAlert, ...state.alerts] };
    });
  }
}));

export default useAegisStore;
