import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import jwt from 'jsonwebtoken';

// Routes
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Models
import ChatSession from './models/ChatSession.js';
import VideoSession from './models/VideoSession.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Events for Chat
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] User connected: ${socket.user.id}`);

  // Join chat room
  socket.on('join_chat', async (data) => {
    const { chatSessionId } = data;
    const roomName = `chat_${chatSessionId}`;

    socket.join(roomName);
    console.log(`[Socket.io] User ${socket.user.id} joined room ${roomName}`);

    // Notify others
    socket.to(roomName).emit('user_joined', {
      userId: socket.user.id,
      message: 'User joined the chat',
    });
  });

  // Send message
  socket.on('send_message', async (data) => {
    try {
      const { chatSessionId, message } = data;
      const roomName = `chat_${chatSessionId}`;

      // Save message to database
      const chatSession = await ChatSession.findByIdAndUpdate(
        chatSessionId,
        {
          $push: {
            messages: {
              senderId: socket.user.id,
              senderRole: socket.user.role,
              message: message,
              timestamp: new Date(),
              isRead: false,
            },
          },
        },
        { new: true }
      );

      // Broadcast message to room
      io.to(roomName).emit('receive_message', {
        senderId: socket.user.id,
        senderRole: socket.user.role,
        message: message,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('[Socket.io] Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { chatSessionId } = data;
    const roomName = `chat_${chatSessionId}`;
    socket.to(roomName).emit('user_typing', {
      userId: socket.user.id,
      isTyping: true,
    });
  });

  socket.on('stop_typing', (data) => {
    const { chatSessionId } = data;
    const roomName = `chat_${chatSessionId}`;
    socket.to(roomName).emit('user_typing', {
      userId: socket.user.id,
      isTyping: false,
    });
  });

  // WebRTC Signaling for Video
  socket.on('join_video', (data) => {
    const { videoSessionId, role } = data;
    const roomName = `video_${videoSessionId}`;

    socket.join(roomName);
    console.log(`[Socket.io] ${role} joined video room ${roomName}`);

    // Notify other user
    socket.to(roomName).emit('user_joined_video', {
      userId: socket.user.id,
      role: role,
    });
  });

  // WebRTC Signaling
  socket.on('webrtc_offer', (data) => {
    const { videoSessionId, offer } = data;
    const roomName = `video_${videoSessionId}`;

    socket.to(roomName).emit('webrtc_offer', {
      offer,
      from: socket.user.id,
    });
  });

  socket.on('webrtc_answer', (data) => {
    const { videoSessionId, answer } = data;
    const roomName = `video_${videoSessionId}`;

    socket.to(roomName).emit('webrtc_answer', {
      answer,
      from: socket.user.id,
    });
  });

  socket.on('webrtc_ice_candidate', (data) => {
    const { videoSessionId, candidate } = data;
    const roomName = `video_${videoSessionId}`;

    socket.to(roomName).emit('webrtc_ice_candidate', {
      candidate,
      from: socket.user.id,
    });
  });

  // Mute/Unmute
  socket.on('toggle_audio', (data) => {
    const { videoSessionId } = data;
    const roomName = `video_${videoSessionId}`;

    socket.to(roomName).emit('user_toggled_audio', {
      userId: socket.user.id,
      enabled: data.enabled,
    });
  });

  socket.on('toggle_video', (data) => {
    const { videoSessionId } = data;
    const roomName = `video_${videoSessionId}`;

    socket.to(roomName).emit('user_toggled_video', {
      userId: socket.user.id,
      enabled: data.enabled,
    });
  });

  // End call
  socket.on('end_video', async (data) => {
    const { videoSessionId } = data;
    const roomName = `video_${videoSessionId}`;

    // Update video session
    await VideoSession.findByIdAndUpdate(videoSessionId, {
      status: 'completed',
      endedAt: new Date(),
    });

    io.to(roomName).emit('video_ended', {
      userId: socket.user.id,
    });

    socket.leave(roomName);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] User disconnected: ${socket.user.id}`);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
