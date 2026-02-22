const mongoose = require('mongoose');

const chartPointSchema = new mongoose.Schema({
    // Label used in chart legends (e.g., "stress", "mood").
    label: {
        type: String,
        required: true,
        trim: true
    },
    // Numeric value plotted on the chart.
    value: {
        type: Number,
        required: true
    }
}, { _id: false });

const importantMomentSchema = new mongoose.Schema({
    // Time of the highlighted event within the chat.
    timestamp: {
        type: Date,
        default: () => Date.now()
    },
    // Brief explanation of why the moment matters.
    note: {
        type: String,
        trim: true
    }
}, { _id: false });

const chatSummarySchema = new mongoose.Schema({
    // One-to-one link back to the session the summary covers.
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true,
        unique: true
    },
    // Patient consuming the AI chat.
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Concise summary text of the conversation.
    summaryText: {
        type: String,
        required: true,
        trim: true
    },
    // Additional AI-generated insights for charts or notes.
    aiInsights: {
        type: String,
        trim: true
    },
    // Final stress score derived for this summary.
    stressScore: {
        type: Number,
        min: 0,
        max: 100
    },
    // Mood label to simplify trend displays.
    mood: {
        type: String,
        trim: true
    },
    // Array of key chart points (value + label) for dashboards.
    chartData: {
        type: [chartPointSchema],
        default: []
    },
    // Noteworthy moments pulled from the conversation.
    importantMoments: {
        type: [importantMomentSchema],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatSummary', chatSummarySchema);
