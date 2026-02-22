const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // Random, backend-generated room identifier. Never user-defined.
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'ended'],
        default: 'pending',
        index: true
    },
    endedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
