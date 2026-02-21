const crypto = require('crypto');

const Session = require('../Models/SessionSchema');
const User = require('../Models/UserSchema');

const requestSession = async (req, res) => {
    try {
        const { doctorUniqueId } = req.body || {};
        if (!doctorUniqueId || typeof doctorUniqueId !== 'string') {
            return res.status(400).json({ message: 'doctorUniqueId is required' });
        }

        // Validate doctor exists and has doctor role
        const doctorUser = await User.findOne({ doctorUniqueId: doctorUniqueId.trim(), role: 'doctor' })
            .select('_id role doctorUniqueId')
            .lean();

        if (!doctorUser) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Optional: prevent multiple active/pending sessions per doctor
        const existingActive = await Session.findOne({
            doctorId: doctorUser._id,
            status: { $in: ['pending', 'active'] }
        })
            .select('_id status')
            .lean();

        if (existingActive) {
            return res.status(409).json({
                message: 'Doctor already has an active session',
                sessionId: existingActive._id
            });
        }

        const roomId = crypto.randomUUID();

        const session = await Session.create({
            doctorId: doctorUser._id,
            patientId: req.userId,
            roomId,
            status: 'pending'
        });

        console.log(`[session] created sessionId=${session._id} roomId=${roomId} doctorId=${doctorUser._id} patientId=${req.userId}`);

        return res.status(201).json({
            sessionId: session._id,
            status: session.status
        });
    } catch (error) {
        console.error('Session request error:', error);
        return res.status(500).json({ message: 'Server error while creating session' });
    }
};

const endSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const userId = String(req.userId);
        const isDoctor = String(session.doctorId) === userId;
        const isPatient = String(session.patientId) === userId;

        if (!isDoctor && !isPatient) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (session.status === 'ended') {
            return res.json({ sessionId: session._id, status: session.status, endedAt: session.endedAt });
        }

        session.status = 'ended';
        session.endedAt = new Date();
        await session.save();

        console.log(`[session] ended sessionId=${session._id} endedAt=${session.endedAt?.toISOString()}`);

        return res.json({ sessionId: session._id, status: session.status, endedAt: session.endedAt });
    } catch (error) {
        console.error('Session end error:', error);
        return res.status(500).json({ message: 'Server error while ending session' });
    }
};

module.exports = {
    requestSession,
    endSession
};
