import express from 'express';
import { processFlaskSignal } from '../controllers/webhookController.js';

const router = express.Router();

router.post('/flask-webhook', processFlaskSignal);

export default router;
