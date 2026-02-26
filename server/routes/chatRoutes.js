import express from 'express';
import {
  getChatSession,
  getChatByAppointment,
  getSessionMessages,
  endChatSession,
  clearChat,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// appointment-specific chat lookup must come before the generic id route to prevent
// the '/:id' matcher from capturing the word "appointment" as an id.
router.get('/appointment/:id', protect, getChatByAppointment);

router.get('/:id', protect, getChatSession);
router.get('/:id/messages', protect, getSessionMessages);
router.post('/:id/end', protect, endChatSession);
router.post('/:id/clear', protect, clearChat);

export default router;
