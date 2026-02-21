const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    // Day of the week doctor is available.
    day: {
        type: String,
        required: true,
        trim: true
    },
    // Appointment window start (e.g., "09:00").
    startTime: {
        type: String,
        required: true
    },
    // Appointment window end (e.g., "17:00").
    endTime: {
        type: String,
        required: true
    }
}, { _id: false });

const doctorSchema = new mongoose.Schema({
    // Links profile to the authenticated user record.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Field of medicine practiced by the doctor.
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    // Years of clinical practice.
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    // Highest degree or certification earned.
    qualification: {
        type: String,
        trim: true
    },
    // Standard fee charged per consultation.
    consultationFee: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    // Short introduction or specialties text shown to patients.
    bio: {
        type: String,
        trim: true
    },
    // URL for the doctor's profile picture.
    profileImage: {
        type: String,
        trim: true
    },
    // Average rating aggregated from completed sessions.
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    // Count of reviews received for display/calculations.
    totalReviews: {
        type: Number,
        min: 0,
        default: 0
    },
    // Weekly availability windows for appointment booking.
    availability: {
        type: [availabilitySchema],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('DoctorProfile', doctorSchema);
