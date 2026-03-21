import React, { useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup, Tooltip, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useAegisStore from "../store/useAegisStore";
import L from "leaflet";
import bhubaneswarBoundary from "../data/bhubaneswar.json";

// Fix for default Leaflet icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const SectorMap = () => {
  const { sectors } = useAegisStore();
  const center = [20.35, 85.81]; // Bhubaneswar Approx Center

  return (
    <div className="bg-military-800 border border-military-700 rounded-xl p-2 shadow-xl w-full h-full relative overflow-hidden flex flex-col">
      <div className="absolute top-4 left-4 z-[400] bg-military-900/90 text-white p-2 rounded max-w-xs text-xs pointer-events-none border border-military-700 backdrop-blur-sm font-exo">
        <h3 className="font-bold mb-1 text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-military-green font-rajdhani">Map Legend</h3>
        <div className="flex items-center mt-1"><span className="w-3 h-3 rounded bg-military-green mr-2 opacity-80 border border-military-green/50"></span> Stable Zone</div>
        <div className="flex items-center mt-1"><span className="w-3 h-3 rounded bg-red-500 mr-2 opacity-80 border border-red-500/50"></span> Critical Zone</div>
      </div>

      <div className="rounded-lg overflow-hidden flex-1 z-0 w-full h-full min-h-[400px]">
        <MapContainer center={center} zoom={11} className="w-full h-full bg-military-800">
          {/* Base imagery: Esri Satellite for rich color */}
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {/* Overlay: CartoDB Labels to bring back street and city names */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
          />

          {/* Bhubaneswar Border */}
          <GeoJSON
            data={bhubaneswarBoundary}
            interactive={false}
            style={{
              color: "#efe144ff",
              weight: 2,
              fillColor: "transparent",
              fillOpacity: 0,
              opacity: 1,
              dashArray: "4, 6"
            }}
          />

          {sectors.map((sector) => (
            <Circle
              key={sector.id}
              center={sector.coords}
              radius={sector.radius}
              pathOptions={{
                color: sector.risk === "High" ? "#ef4444" : "#2ecc71",
                fillColor: sector.risk === "High" ? "#ef4444" : "#2ecc71",
                fillOpacity: sector.risk === "High" ? 0.4 : 0.2,
                weight: 2
              }}
            >
              <Tooltip direction="center" className="bg-transparent border-0 shadow-none text-white font-rajdhani font-bold text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {sector.name}
              </Tooltip>
              <Popup className="bg-military-900 text-slate-800 border-military-700">
                <div className="font-exo">
                  <h3 className="font-bold text-sm mb-1 text-white">{sector.name}</h3>
                  <p className="text-xs text-slate-300">Status: <span className={sector.risk === "High" ? "text-red-500 font-bold" : "text-military-green font-bold"}>{sector.risk}</span></p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default SectorMap;
