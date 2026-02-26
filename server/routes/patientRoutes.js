import express from 'express';
import { getPatientCount, getPatientIds, getPatientDashboard } from '../controllers/patientController.js';

const router = express.Router();

// public endpoint for total patients
router.get('/count', getPatientCount);
// debugging/analytics list of ids
router.get('/ids', getPatientIds);

// authenticated dashboard (shows notifications/stats)
import { protect } from '../middleware/auth.js';
router.get('/dashboard', protect, getPatientDashboard);

export default router;
