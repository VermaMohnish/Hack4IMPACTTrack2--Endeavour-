import { getIO } from '../services/socketService.js';

export const processFlaskSignal = (req, res) => {
  // Expected Payload: { signal: "Critical", sector_id: 1, message: "Flood detected" }
  const { signal, sector_id, message } = req.body;
  
  if (signal === "Critical" && sector_id) {
    console.log(`--> Received [CRITICAL] Webhook from Flask for Sector ${sector_id}. Dispatching over Sockets.`);
    
    const io = getIO();
    io.emit('Critical', { 
      sector_id: parseInt(sector_id), 
      message: message || `Critical Risk Level detected in Sector ${sector_id}` 
    });
    
    return res.status(200).json({ success: true, message: 'Critical signal relayed to frontend UI.' });
  }

  res.status(400).json({ success: false, message: 'Invalid payload.' });
};
