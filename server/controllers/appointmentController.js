import Appointment from '../models/Appointment.js';
import ChatSession from '../models/ChatSession.js';
import VideoSession from '../models/VideoSession.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, consultationType, notes } = req.body;

    // Get patient
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Get doctor and their rate
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patientId: patient._id,
      doctorId: doctorId,
      appointmentDate: new Date(appointmentDate),
      consultationType,
      notes,
      cost: doctor.hourlyRate,
    });

    await appointment.save();

    // Create chat or video session based on type
    if (consultationType === 'chat') {
      const chatSession = new ChatSession({
        appointmentId: appointment._id,
        patientId: patient._id,
        doctorId: doctorId,
      });
      await chatSession.save();
      appointment.chatSessionId = chatSession._id;
      await appointment.save();
    } else if (consultationType === 'video') {
      const videoSession = new VideoSession({
        appointmentId: appointment._id,
        patientId: patient._id,
        doctorId: doctorId,
      });
      await videoSession.save();
      appointment.videoSessionId = videoSession._id;
      await appointment.save();
    }

    const populatedAppointment = await appointment.populate(['patientId', 'doctorId']);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate('doctorId')
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .populate('chatSessionId')
      .populate('videoSessionId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate(['patientId', 'doctorId']);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment status updated',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason;
    appointment.cancelledBy = req.user.role;
    appointment.cancelledAt = new Date();

    await appointment.save();

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointments = await Appointment.find({
      patientId: patient._id,
      status: { $ne: 'cancelled' },
      appointmentDate: { $gte: new Date() },
    })
      .populate('doctorId')
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
