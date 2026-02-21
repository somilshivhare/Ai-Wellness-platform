const mongoose = require('mongoose');
const crypto = require('crypto');

const DOCTOR_ID_PREFIX = 'DOC-';

const generateDoctorUniqueIdCandidate = () => {
    // 48 bits of entropy, encoded into base36 for compact A-Z0-9 string.
    const buf = crypto.randomBytes(6);
    const asBigInt = BigInt(`0x${buf.toString('hex')}`);
    const base36 = asBigInt.toString(36).toUpperCase();
    // Ensure a consistent length (7 chars) similar to example: DOC-8F3K29X
    const token = base36.padStart(7, '0').slice(0, 7);
    return `${DOCTOR_ID_PREFIX}${token}`;
};

const userSchema = new mongoose.Schema({
    // Full name displayed across the platform.
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Unique email used for authentication and notifications.
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // Hashed password for account security.
    password: {
        type: String,
        required: true
    },
    // Role determines which dashboards/features the user can access.
    role: {
        type: String,
        enum: ['patient', 'doctor', 'superadmin'],
        default: 'patient'
    },
    // Non-guessable public doctor identifier patients can use to request sessions.
    // Only present for doctor accounts.
    doctorUniqueId: {
        type: String,
        unique: true,
        sparse: true,
        immutable: true,
        trim: true
    },
    // Mirrors whether onboarding/verification steps are complete.
    isVerified: {
        type: Boolean,
        default: false
    },
    // Socket.IO identifier to track realtime presence.
    socketId: {
        type: String,
        default: null
    }
}, { timestamps: true });

userSchema.pre('save', async function ensureDoctorUniqueId() {
    if (this.role !== 'doctor') return;
    if (this.doctorUniqueId) return;

    // Retry on the extremely unlikely chance of collision.
    for (let attempt = 0; attempt < 8; attempt += 1) {
        const candidate = generateDoctorUniqueIdCandidate();
        // `this.constructor` is the Mongoose Model.
        const existing = await this.constructor.findOne({ doctorUniqueId: candidate }).select('_id').lean();
        if (!existing) {
            this.doctorUniqueId = candidate;
            return;
        }
    }

    throw new Error('Failed to generate unique doctorUniqueId');
});

userSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function preventDoctorUniqueIdUpdates() {
    const update = this.getUpdate() || {};

    // Direct update: { doctorUniqueId: '...' }
    if (Object.prototype.hasOwnProperty.call(update, 'doctorUniqueId')) {
        delete update.doctorUniqueId;
    }

    // Operator update: { $set: { doctorUniqueId: '...' } }
    if (update.$set && Object.prototype.hasOwnProperty.call(update.$set, 'doctorUniqueId')) {
        delete update.$set.doctorUniqueId;
    }

    this.setUpdate(update);
});

module.exports = mongoose.model('User', userSchema);
