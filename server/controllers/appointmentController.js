import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import ChatSession from '../models/ChatSession.js';
import VideoSession from '../models/VideoSession.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import transporterPromise from '../utils/mailer.js';

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

    // create notification for doctor
    try {
      const notifMsg = `New appointment on ${new Date(appointmentDate).toLocaleString()}${
        notes ? ` – "${notes}"` : ''
      }`;
      await Doctor.findByIdAndUpdate(doctorId, {
        $push: {
          notifications: {
            message: notifMsg,
            appointmentId: appointment._id,
          },
        },
      });
    } catch (notifErr) {
      console.error('Failed to push doctor notification:', notifErr);
    }

    // fetch doctor user record so we can reference their name in notifications
    let doctorUserForNotif = null;
    try {
      doctorUserForNotif = await User.findById(doctor.userId);
    } catch {}

    // create notification for patient (so they also see the booking in their dashboard)
    try {
      const patientNotif = `Appointment confirmed with Dr. ${
        doctorUserForNotif?.fullName || ''
      } on ${new Date(appointmentDate).toLocaleString()}`;
      await Patient.findByIdAndUpdate(patient._id, {
        $push: {
          notifications: {
            message: patientNotif,
            appointmentId: appointment._id,
          },
        },
      });
    } catch (notifErr) {
      console.error('Failed to push patient notification:', notifErr);
    }

    // send email notifications to both parties
    try {
      // load user records for email addresses
      const doctorUser = await User.findById(doctor.userId);
      const patientUser = await User.findById(req.user.id);
      const frontendHost = process.env.FRONTEND_URL || 'http://localhost:5173';
      const link = `${frontendHost}/${consultationType === 'video' ? `video/${appointment._id}` : `chat/${appointment._id}`}`;

      if (doctorUser?.email) {
        const transporter = await transporterPromise;
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'no-reply@mindbridge.ai',
          to: doctorUser.email,
          subject: 'New appointment scheduled',
          html: `<p>Hi ${doctorUser.fullName || 'Doctor'},</p>
                 <p>A new appointment has been booked by ${patientUser?.fullName || 'a patient'}. </p>
                 <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleString()}</p>
                 <p><strong>Type:</strong> ${consultationType}</p>
                 <p>${notes ? `<strong>Notes:</strong> ${notes}` : ''}</p>
                 <p><a href="${link}">Click here to join the ${consultationType} session</a></p>
                 <p>Best regards,<br/>MindBridge AI</p>`,
        });
      }
      if (patientUser?.email) {
        const transporter = await transporterPromise;
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'no-reply@mindbridge.ai',
          to: patientUser.email,
          subject: 'Appointment confirmation',
          html: `<p>Hi ${patientUser.fullName || 'Patient'},</p>
                 <p>Your appointment with Dr. ${doctorUser?.fullName || ''} is confirmed.</p>
                 <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleString()}</p>
                 <p><strong>Type:</strong> ${consultationType}</p>
                 <p><a href="${link}">Join the session</a></p>
                 <p>Best regards,<br/>MindBridge AI</p>`,
        });
      }
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr);
    }

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
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'fullName profileImage' },
      })
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'fullName profileImage' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'fullName profileImage' },
      })
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

// send daily reminders for tomorrow's appointments
export const sendDailyReminders = async () => {
  try {
    // ensure mongoose is connected before querying
    if (mongoose.connection.readyState !== 1) {
      console.warn('sendDailyReminders skipped: mongoose not connected');
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: tomorrow, $lt: dayAfter },
    })
      .populate('patientId')
      .populate('doctorId');

    for (const apt of appointments) {
      const doctorUser = await User.findById(apt.doctorId.userId);
      const patientUser = await User.findById(apt.patientId.userId);
      const subject = 'Reminder: appointment scheduled for tomorrow';
      const html = `<p>This is a reminder that you have an appointment scheduled for ${new Date(
        apt.appointmentDate
      ).toLocaleString()}.</p>`;

      if (doctorUser?.email) {
        const transporter = await transporterPromise;
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'no-reply@mindbridge.ai',
          to: doctorUser.email,
          subject,
          html,
        });
      }
      if (patientUser?.email) {
        const transporter = await transporterPromise;
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'no-reply@mindbridge.ai',
          to: patientUser.email,
          subject,
          html,
        });
      }
    }
  } catch (err) {
    console.error('Daily reminders failed:', err);
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

// allow deleting an appointment record
export const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment id' });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // only patient who created or doctor can delete? keep simple: allow patient owning it
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id });
      if (!patient || String(patient._id) !== String(appointment.patientId)) {
        return res.status(403).json({ message: 'Not authorized to delete this appointment' });
      }
    }

    await appointment.remove();
    res.status(200).json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('[deleteAppointment] error', error);
    res.status(500).json({ message: error.message });
  }
};

// clear/delete a video session record for the given appointment
export const clearVideoSession = async (req, res) => {
  try {
    console.log('[clearVideoSession] called with appointmentId', req.params.id, 'user', req.user);
    const appointmentId = req.params.id;

    // use mongoose to ensure valid ObjectId (will throw if invalid)
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment id' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.warn('[clearVideoSession] appointment not found', appointmentId);
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!appointment.videoSessionId) {
      return res.status(400).json({ message: 'No video session to clear' });
    }

    await VideoSession.findByIdAndDelete(appointment.videoSessionId);
    appointment.videoSessionId = undefined;
    await appointment.save();

    res.status(200).json({ message: 'Video session cleared' });
  } catch (error) {
    console.error('[clearVideoSession] error', error);
    res.status(500).json({ message: error.message });
  }
};
