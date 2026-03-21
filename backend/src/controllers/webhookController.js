import { getIO } from '../services/socketService.js';

export const processFlaskSignal = (req, res) => {
  const { signal, sector_id, message } = req.body;
  
  if (['Critical', 'Warning', 'Stable'].includes(signal) && sector_id) {
    console.log(`--> Received [${signal}] Webhook from Flask for Sector ${sector_id}. Dispatching over Sockets.`);
    
    const io = getIO();
    io.emit(signal, { 
      sector_id: parseInt(sector_id), 
      message: message || `${signal} Risk Level detected in Sector ${sector_id}` 
    });
    
    return res.status(200).json({ success: true, message: `${signal} signal relayed to frontend UI.` });
  }

  // If signal is unknown, just return 200 so Flask doesn't complain
  res.status(200).json({ success: true, message: 'Signal ignored.' });
};
