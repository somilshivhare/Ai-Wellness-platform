const mongoose = require('mongoose');

const stressLogSchema = new mongoose.Schema({
    // Patient whose stress is being recorded.
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Date when the log entry was captured.
    date: {
        type: Date,
        required: true,
        default: () => Date.now()
    },
    // Numerical stress score for trend charts.
    stressScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    // Mood label associated with this snapshot.
    mood: {
        type: String,
        trim: true
    },
    // AI commentary or notes explaining the score.
    aiComment: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('StressLog', stressLogSchema);
