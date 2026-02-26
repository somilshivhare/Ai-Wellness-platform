import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorAppointments,
  getDoctorDashboard,
  getDoctorCount,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/dashboard', protect, authorize('doctor'), getDoctorDashboard);
router.get('/count', getDoctorCount); // public count endpoint
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.get('/appointments', protect, authorize('doctor'), getDoctorAppointments);
router.get('/:id', getDoctorById);

export default router;
