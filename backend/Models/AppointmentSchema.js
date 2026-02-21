const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Patient associated with the booking.
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Doctor assigned to the appointment.
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Scheduled date for the consultation.
    appointmentDate: {
        type: Date,
        required: true
    },
    // Slot start time (e.g., "15:30").
    startTime: {
        type: String,
        required: true
    },
    // Slot end time (e.g., "16:00").
    endTime: {
        type: String,
        required: true
    },
    // Workflow status for the booking.
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    // Fee charged for this consultation.
    consultationFee: {
        type: Number,
        required: true,
        min: 0
    },
    // Tracks whether payment is outstanding or settled.
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
