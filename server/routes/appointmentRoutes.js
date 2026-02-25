import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getUpcomingAppointments,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/patient/list', protect, authorize('patient'), getPatientAppointments);
router.get('/patient/upcoming', protect, authorize('patient'), getUpcomingAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

export default router;
