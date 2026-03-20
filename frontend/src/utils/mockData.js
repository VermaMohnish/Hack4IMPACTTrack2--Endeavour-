export const MOCK_SECTORS = [
  { id: 1, name: "Patia", coords: [20.355, 85.818], risk: "Low", radius: 1500, color: "#10b981", policeStations: 2, hospitals: 3, fireStations: 1 },
  { id: 2, name: "Nayapalli", coords: [20.295, 85.810], risk: "Low", radius: 1500, color: "#10b981", policeStations: 1, hospitals: 2, fireStations: 1 },
  { id: 3, name: "Old Town", coords: [20.245, 85.835], risk: "High", radius: 1500, color: "#ef4444", policeStations: 3, hospitals: 1, fireStations: 2 },
  { id: 4, name: "Rasulgarh", coords: [20.300, 85.850], risk: "Low", radius: 1500, color: "#10b981", policeStations: 1, hospitals: 1, fireStations: 1 },
  { id: 5, name: "Khandagiri", coords: [20.260, 85.780], risk: "Low", radius: 1500, color: "#10b981", policeStations: 2, hospitals: 2, fireStations: 1 }
];

export const MOCK_ASSETS = [
  { id: 101, type: "Helicopter", location: { lat: 20.35, lng: 85.81 }, status: "AVAILABLE", sectorId: 1 },
  { id: 102, type: "Ambulance", location: { lat: 20.30, lng: 85.85 }, status: "BUSY", sectorId: 4 },
  { id: 103, type: "FireTruck", location: { lat: 20.26, lng: 85.78 }, status: "AVAILABLE", sectorId: 3 },
  { id: 104, type: "Helicopter", location: { lat: 20.245, lng: 85.835 }, status: "BUSY", sectorId: 3 }
];

export const MOCK_ALERTS = [
  { id: 1001, message: "System initialized. Monitoring all infrastructure.", time: new Date().toISOString(), type: "info" },
  { id: 1002, message: "Helicopter units put on standby.", time: new Date(Date.now() - 3600000).toISOString(), type: "warning" },
  { id: 1003, message: "Emergency reported in Old Town.", time: new Date(Date.now() - 1800000).toISOString(), type: "critical" }
];
