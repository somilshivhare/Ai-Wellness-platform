const express = require('express');
const rateLimit = require('express-rate-limit');

const { verifyToken } = require('../Controller/Login');
const requireRole = require('../Middleware/requireRole');
const { requestSession, endSession } = require('../Controller/SessionController');

const router = express.Router();

const sessionRequestLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 10, // per IP per window
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: 'Too many session requests, please try again later.' }
});

// Patient requests a new session with a doctorUniqueId
router.post('/request', sessionRequestLimiter, verifyToken, requireRole('patient'), requestSession);

// Doctor or patient ends a session
router.post('/:sessionId/end', verifyToken, endSession);

module.exports = router;
