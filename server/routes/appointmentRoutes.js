import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getUpcomingAppointments,
  clearVideoSession,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/patient/list', protect, authorize('patient'), getPatientAppointments);
router.get('/patient/upcoming', protect, authorize('patient'), getUpcomingAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

// allow deleting an appointment
router.delete('/:id', protect, authorize('patient','doctor'), deleteAppointment);

// allow clearing the video session metadata (doctors and patients)
router.post('/:id/video/clear', protect, clearVideoSession);

export default router;
