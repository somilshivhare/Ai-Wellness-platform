const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/AuthRoutes');
const initVideoChat = require('./VideoChat/VideoChatLogic');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
mongoose
    .connect(process.env.MongoDB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err.message));

// SSL Certificates
const keyPath = path.join(__dirname, 'VideoChat', 'cert.key');
const certPath = path.join(__dirname, 'VideoChat', 'cert.crt');

const key = fs.readFileSync(keyPath);
const cert = fs.readFileSync(certPath);
const expressServer = https.createServer({ key, cert }, app);

const io = socketio(expressServer, {
    cors: {
        origin: [
            /^https?:\/\/localhost(:\d+)?$/,
            /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
        ],
        methods: ["GET", "POST"]
    }
});

// Initialize Video Chat Logic
initVideoChat(io);

const PORT = 8181;
expressServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
