import express from 'express';
import {
  getChatSession,
  getSessionMessages,
  endChatSession,
  generateChatSummary,
  getSummary,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', protect, getChatSession);
router.get('/:id/messages', protect, getSessionMessages);
router.get('/:id/summary', protect, getSummary);
router.post('/:id/end', protect, endChatSession);
router.post('/:id/generate-summary', protect, generateChatSummary);

export default router;
