import express from 'express';
import {
  createContactMessage,
  getAllMessages,
  respondToMessage,
  deleteMessage,
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', protect, getAllMessages);
router.put('/:id/respond', protect, respondToMessage);
router.delete('/:id', protect, deleteMessage);

export default router;
