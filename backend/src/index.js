import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';

import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import resourceRoutes from './routes/resourceRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
const server = http.createServer(app);

// Initialize DB and Socket
connectDB();
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/resources', resourceRoutes);
app.use('/api', webhookRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`AEGISGRID MVC BACKEND ONLINE`);
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`Websocket Server on ws://localhost:${PORT}`);
});
