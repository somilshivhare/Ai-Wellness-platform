const express = require('express');
const router = express.Router();
const {
    verifyToken,
    register,
    login,
    getCurrentUser,
    logout
} = require('../Controller/Login');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getCurrentUser);
router.post('/logout', logout);

module.exports = router;
