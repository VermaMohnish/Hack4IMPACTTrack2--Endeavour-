export const MOCK_SECTORS = [
  { id: 1, name: "Patia", coords: [20.355, 85.818], risk: "Low", radius: 1500, color: "#10b981", policeStations: 2, hospitals: 3, fireStations: 1, crpfCamps: 1 },
  { id: 2, name: "Nayapalli", coords: [20.295, 85.810], risk: "Low", radius: 1500, color: "#10b981", policeStations: 1, hospitals: 2, fireStations: 1, crpfCamps: 0 },
  { id: 3, name: "Old Town", coords: [20.245, 85.835], risk: "Low", radius: 1500, color: "#10b981", policeStations: 3, hospitals: 1, fireStations: 2, crpfCamps: 1 },
  { id: 4, name: "Rasulgarh", coords: [20.300, 85.850], risk: "Low", radius: 1500, color: "#10b981", policeStations: 1, hospitals: 1, fireStations: 1, crpfCamps: 0 },
  { id: 5, name: "Khandagiri", coords: [20.260, 85.780], risk: "Low", radius: 1500, color: "#10b981", policeStations: 2, hospitals: 2, fireStations: 1, crpfCamps: 1 }
];

export const MOCK_ASSETS = [];
let assetIdCounter = 100;

MOCK_SECTORS.forEach(sector => {
  // Police Jeeps (3 per station)
  for (let i = 0; i < sector.policeStations * 3; i++) {
    MOCK_ASSETS.push({ 
      id: ++assetIdCounter, 
      type: "PoliceJeep", 
      location: { ...sector.coords }, 
      status: Math.random() > 0.3 ? "AVAILABLE" : "BUSY", 
      sectorId: sector.id 
    });
  }
  
  // Ambulances (3 per hospital)
  for (let i = 0; i < sector.hospitals * 3; i++) {
    MOCK_ASSETS.push({ 
      id: ++assetIdCounter, 
      type: "Ambulance", 
      location: { ...sector.coords }, 
      status: Math.random() > 0.3 ? "AVAILABLE" : "BUSY", 
      sectorId: sector.id 
    });
  }
  
  // Fire Trucks (3 per fire station)
  for (let i = 0; i < sector.fireStations * 3; i++) {
    MOCK_ASSETS.push({ 
      id: ++assetIdCounter, 
      type: "FireTruck", 
      location: { ...sector.coords }, 
      status: Math.random() > 0.3 ? "AVAILABLE" : "BUSY", 
      sectorId: sector.id 
    });
  }
  
  // Helicopters (2 per crpf camp)
  for (let i = 0; i < sector.crpfCamps * 2; i++) {
    MOCK_ASSETS.push({ 
      id: ++assetIdCounter, 
      type: "Helicopter", 
      location: { ...sector.coords }, 
      status: Math.random() > 0.3 ? "AVAILABLE" : "BUSY", 
      sectorId: sector.id 
    });
  }
});

export const MOCK_ALERTS = [
  { id: 1001, message: "System initialized. Monitoring all infrastructure.", time: new Date().toISOString(), type: "info" },
];
