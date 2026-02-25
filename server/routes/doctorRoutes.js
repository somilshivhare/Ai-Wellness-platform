import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorAppointments,
  getDoctorDashboard,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.get('/appointments', protect, authorize('doctor'), getDoctorAppointments);
router.get('/dashboard', protect, authorize('doctor'), getDoctorDashboard);

export default router;
