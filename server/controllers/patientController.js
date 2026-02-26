import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';

// returns number of patient profiles (optionally unfiltered)
export const getPatientCount = async (req, res) => {
  try {
    // no filtering for now; could add includeInactive etc
    const count = await Patient.countDocuments({});
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// return array of all patient IDs (for logging/analytics)
export const getPatientIds = async (req, res) => {
  try {
    const patients = await Patient.find({}, '_id');
    const ids = patients.map((p) => p._id);
    res.status(200).json({ ids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// returns a simplified dashboard for patients, including unread notifications
export const getPatientDashboard = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // count upcoming appointments for stats
    const upcomingCount = await Appointment.countDocuments({
      patientId: patient._id,
      status: { $ne: 'cancelled' },
      appointmentDate: { $gte: new Date() },
    });

    const unreadNotifications = (patient.notifications || []).filter((n) => !n.seen);

    res.status(200).json({
      patient,
      notifications: unreadNotifications,
      stats: {
        upcomingAppointments: upcomingCount,
      },
    });

    // mark them seen afterwards
    if (unreadNotifications.length > 0) {
      await Patient.updateOne(
        { _id: patient._id },
        { $set: { 'notifications.$[elem].seen': true } },
        { arrayFilters: [{ 'elem.seen': false }] }
      );
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
