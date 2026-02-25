import express from 'express';
import {
  createAssessment,
  getLatestAssessment,
  getAssessmentHistory,
  updateAssessment,
} from '../controllers/assessmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), createAssessment);
router.get('/latest', protect, authorize('patient'), getLatestAssessment);
router.get('/history', protect, authorize('patient'), getAssessmentHistory);
router.put('/:id', protect, authorize('patient'), updateAssessment);

export default router;
