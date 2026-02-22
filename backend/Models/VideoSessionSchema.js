const mongoose = require('mongoose');

const videoSessionSchema = new mongoose.Schema({
    // Connects the session to its appointment.
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true
    },
    // Identifier for the meeting room or call.
    roomId: {
        type: String,
        required: true,
        trim: true
    },
    // Actual URL used to join the video call.
    meetingLink: {
        type: String,
        required: true,
        trim: true
    },
    // When the video session was started.
    sessionStart: {
        type: Date
    },
    // When the video session ended.
    sessionEnd: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('VideoSession', videoSessionSchema);
