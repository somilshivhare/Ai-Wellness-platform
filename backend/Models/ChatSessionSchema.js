const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    // Patient who started the conversation.
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Timestamp when AI chat began.
    startedAt: {
        type: Date,
        default: () => Date.now()
    },
    // Optional end timestamp to mark completion.
    endedAt: {
        type: Date
    },
    // Stress score aggregated over the session.
    overallStressScore: {
        type: Number,
        min: 0,
        max: 100
    },
    // Mood label detected from the conversation.
    moodDetected: {
        type: String,
        trim: true
    },
    // AI recommendation for next steps.
    aiRecommendation: {
        type: String,
        trim: true
    },
    // Link to the single chat summary/cache used for charts.
    summaryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSummary'
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
