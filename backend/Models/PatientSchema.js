const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    // Links the profile to the user account.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Age recorded for patient demographics.
    age: {
        type: Number,
        min: 0
    },
    // Gender selected by the patient for personalization.
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        lowercase: true,
        trim: true
    },
    // Contact number for reminders or follow-ups.
    phone: {
        type: String,
        trim: true
    },
    // Optional avatar/profile image URL.
    profileImage: {
        type: String,
        trim: true
    },
    // Aggregate stress score used for tracking progress.
    averageStressScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    // Latest reported stress category used in dashboards.
    lastStressLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    // Flag that indicates whether the AI flagged any urgent risk.
    aiRiskFlag: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('PatientProfile', patientSchema);
