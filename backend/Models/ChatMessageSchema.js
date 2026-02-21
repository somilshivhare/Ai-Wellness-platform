const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    // Reference to the chat session the message belongs to.
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true
    },
    // Indicates whether the patient or AI sent the message.
    sender: {
        type: String,
        enum: ['patient', 'ai'],
        required: true
    },
    // Actual text content exchanged.
    message: {
        type: String,
        required: true,
        trim: true
    },
    // Optional mood label captured per message.
    detectedMood: {
        type: String,
        trim: true
    },
    // Stress value inferred from this message, if available.
    stressScore: {
        type: Number,
        min: 0,
        max: 100
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
