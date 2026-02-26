import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';

export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, minRate, maxRate, includeUnverified } = req.query;

    // by default only show verified doctors; passing includeUnverified=true returns all
    let filter = {};
    if (!includeUnverified) {
      filter.verified = true;
    }

    if (specialization) {
      filter.specialization = specialization;
    }

    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = parseInt(minRate);
      if (maxRate) filter.hourlyRate.$lte = parseInt(maxRate);
    }

    const doctors = await Doctor.find(filter)
      .populate('userId', 'fullName email profileImage phone')
      .lean();

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// return total number of doctors matching filter
export const getDoctorCount = async (req, res) => {
  try {
    const { includeUnverified } = req.query;
    let filter = {};
    if (!includeUnverified) filter.verified = true;
    const count = await Doctor.countDocuments(filter);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'fullName email profileImage phone');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, license, experience, bio, qualifications, hourlyRate, availability, languages, consultationMode } = req.body;

    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Update user info
    await User.findByIdAndUpdate(req.user.id, {
      fullName: req.body.fullName,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    });

    // Update doctor info
    Object.assign(doctor, {
      specialization: specialization || doctor.specialization,
      license: license || doctor.license,
      experience: experience !== undefined ? experience : doctor.experience,
      bio: bio || doctor.bio,
      qualifications: qualifications || doctor.qualifications,
      hourlyRate: hourlyRate !== undefined ? hourlyRate : doctor.hourlyRate,
      availability: availability || doctor.availability,
      languages: languages || doctor.languages,
      consultationMode: consultationMode || doctor.consultationMode,
      // mark as verified when doctor completes profile
      verified: true,
    });

    await doctor.save();

    res.status(200).json({
      message: 'Doctor profile updated successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'fullName email profileImage' },
      })
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const totalAppointments = await Appointment.countDocuments({ doctorId: doctor._id });
    const completedAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'completed',
    });
    const upcomingAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'scheduled',
      appointmentDate: { $gte: new Date() },
    });

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId')
      .sort({ appointmentDate: 1 })
      .limit(5);

    // count total patients in the system (for analytics)
    const totalPatients = await Patient.countDocuments();

    // filter unread notifications to send back
    const unreadNotifications = (doctor.notifications || []).filter((n) => !n.seen);

    res.status(200).json({
      doctor,
      notifications: unreadNotifications,
      stats: {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        totalPatients,
      },
      recentAppointments: appointments,
    });

    // mark unread notifications as seen so they won't show again
    if (unreadNotifications.length > 0) {
      await Doctor.updateOne(
        { _id: doctor._id },
        { $set: { 'notifications.$[elem].seen': true } },
        { arrayFilters: [{ 'elem.seen': false }] }
      );
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
