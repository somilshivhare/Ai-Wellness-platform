# MindBridge AI - Mental Wellness Platform

A full-stack mental health platform connecting patients with licensed therapists through real-time video calls, text chat, and AI-powered wellness assessments.

## Overview

MindBridge AI is a comprehensive telemedicine platform built with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + MongoDB
- **Real-time**: Socket.io for chat and WebRTC signaling
- **AI**: Google Gemini API for chat summaries
- **Email**: NodeMailer for notifications

## Project Structure

```
mindbridge-ai/
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/               # Mongoose schemas
│   ├── controllers/          # Request handlers
│   ├── routes/               # API routes
│   ├── middleware/           # Auth & authorization
│   ├── server.js             # Express server with Socket.io
│   ├── package.json
│   └── .env
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── store/            # Zustand stores
│   │   ├── services/         # API services
│   │   ├── utils/            # Utilities (WebRTC, etc)
│   │   ├── App.jsx           # Router setup
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env
└── README.md
```

## Features

### For Patients
- **Assessment Form**: Multi-step wellness questionnaire with AI recommendations
- **Doctor Discovery**: Search and filter therapists by specialization, rating, and rate
- **Booking**: Easy appointment scheduling
- **Real-time Chat**: Text-based therapy sessions with Socket.io
- **Video Calls**: HD video consultations with WebRTC, mute/camera controls
- **Session Summary**: AI-generated summaries via Gemini API
- **Dashboard**: View all appointments and upcoming sessions

### For Therapists/Doctors
- **Profile Management**: Set specialization, rates, availability, qualifications
- **Appointment Management**: View and manage patient appointments
- **Doctor Dashboard**: Statistics on completed/upcoming appointments
- **Real-time Chat**: Secure communication with patients
- **Video Consultations**: Professional WebRTC video capabilities

### Platform Features
- **JWT Authentication**: Role-based access control (patient/doctor)
- **Real-time Messaging**: Socket.io-powered instant messaging
- **WebRTC Video**: Peer-to-peer video calls with Google STUN servers
- **Email Notifications**: Appointment confirmations via NodeMailer with Gmail
- **AI Chat Summary**: Automatic session notes using Google Gemini API
- **Contact Form**: Support messaging system with email responses

## Prerequisites

- Node.js 16+
- MongoDB (local or cloud Atlas)
- Gmail account with App Password (for email)
- Google Gemini API key
- Modern browser with WebRTC support

## Installation & Setup

### 1. Clone Repository

```bash
git clone <repo-url>
cd mindbridge-ai
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/mindbridgeai
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
PORT=5000

# Gmail Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password_here

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

Start MongoDB:
```bash
mongod
```

Start backend server:
```bash
npm run dev
# or
npm start
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file:
```env
# backend URL (must include /api path)
VITE_API_BASE_URL=http://localhost:5000/api
# optional override for socket.io server (defaults to same host/port as API)
# VITE_SOCKET_URL=http://localhost:5000

# For email notifications you need valid credentials (Gmail or other SMTP)
# if these are not set the server will fall back to an Ethereal test account
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-password-or-smtp-password

# Gemini API key for chat summarization
GEMINI_API_KEY=your_gemini_key_here
```

Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Doctors
- `GET /api/doctors` - Get all verified doctors
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/profile` - Update doctor profile
- `GET /api/doctors/appointments` - Get doctor appointments
- `GET /api/doctors/dashboard` - Doctor dashboard stats

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/patient/list` - Patient appointments
- `GET /api/appointments/patient/upcoming` - Upcoming appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update status
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Assessment
- `POST /api/assessment` - Create wellness assessment
- `GET /api/assessment/latest` - Get latest assessment
- `GET /api/assessment/history` - Assessment history
- `PUT /api/assessment/:id` - Update assessment

### Chat
- `GET /api/chat/:id` - Get chat session
- `GET /api/chat/:id/messages` - Get messages
- `GET /api/chat/:id/summary` - Get session summary
- `POST /api/chat/:id/end` - End chat session
- `POST /api/chat/:id/generate-summary` - Generate AI summary

### Contact
- `POST /api/contact` - Submit contact message

## Socket.io Events

### Chat Events
- `join_chat` - Join chat room
- `send_message` - Send message
- `typing` - User typing indicator
- `stop_typing` - Stop typing indicator
- `receive_message` - Receive message (broadcast)
- `user_typing` - User typing status (broadcast)

### Video Events
- `join_video` - Join video room
- `webrtc_offer` - WebRTC SDP offer
- `webrtc_answer` - WebRTC SDP answer
- `webrtc_ice_candidate` - ICE candidate for NAT traversal
- `toggle_audio` - Mute/unmute audio
- `toggle_video` - Turn video on/off
- `end_video` - End video call
- `user_joined_video` - User joined (broadcast)
- `user_toggled_audio` - User toggled audio (broadcast)
- `user_toggled_video` - User toggled video (broadcast)
- `video_ended` - Video ended (broadcast)

## Authentication Flow

1. User signs up with email, password, and role (patient/doctor)
2. Backend creates User account and role-specific profile (Doctor/Patient)
3. JWT token issued on successful login
4. Token stored in localStorage and Zustand store
5. Token included in all API requests via axios interceptor
6. Protected routes require valid token and matching role

## WebRTC Video Implementation

- Uses Google STUN servers (stun.l.google.com, stun1.l.google.com, stun2.l.google.com)
- Peer-to-peer connection with ICE candidate handling
- Automatic negotiation via Socket.io signaling
- Mute/camera controls with remote user notification
- Automatic cleanup on disconnect or call end
- Supports both audio and video tracks

## AI Features

### Gemini Chat Summaries
- Automatically triggered when chat session ends
- Analyzes full conversation for key insights
- Extracts concerns, therapeutic approaches, and recommendations
- Available for download as text file
- Can be regenerated by user at any time
- Requires GEMINI_API_KEY in environment

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on Gmail account
2. Generate App Password (Settings → Security → App passwords)
3. Set `EMAIL_USER` and `EMAIL_PASS` in server `.env`

### Supported Email Features
- Appointment confirmations sent to patient
- Doctor support inquiries receive acknowledgment
- Contact form submissions get auto-response

## Security

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens expire in 7 days
- Role-based access control on all protected routes
- CORS enabled with frontend origin only
- Protected routes with `protect` and `authorize` middleware
- MongoDB data validation with Mongoose schemas
- Secure WebRTC signaling via Socket.io authentication

## Database Models

### User
- email, password, role, fullName, phone, profileImage
- isVerified, verificationToken

### Doctor
- userId (ref), specialization, license, experience
- bio, qualifications, hourlyRate, availability
- rating, totalReviews, languages, consultationMode, verified

### Patient
- userId (ref), age, gender, medicalHistory, currentMedications
- allergies, emergencyContact, wellness data
- assessmentCompleted, preferredDoctorSpecialization

### Appointment
- patientId, doctorId, appointmentDate, duration
- consultationType, status, notes, cost, paymentStatus
- chatSessionId, videoSessionId

### ChatSession
- appointmentId, patientId, doctorId
- status (active/ended), messages with timestamps
- summaryGenerated, summary (AI text)

### VideoSession
- appointmentId, patientId, doctorId
- status (pending/active/completed/cancelled), duration
- patientJoined, doctorJoined flags, recordingUrl

### Assessment
- patientId, stressLevel, sleepQuality, anxietyLevel
- mood, mainConcerns, exerciseFrequency, dietQuality
- socialConnections, workLifeBalance
- suicidalThoughts, harmfulBehavior, substanceUse
- recommendedSpecialization (AI-determined)

### Contact
- name, email, phone, subject, message
- status (new/responded/resolved), response, respondedAt

## Development

### Create a New Page
1. Create file in `client/src/pages/YourPage.jsx`
2. Import Layout wrapper component
3. Use useEffect for data fetching, useState for form state
4. Export component as default
5. Add route in `App.jsx` with ProtectedRoute if needed

### Create a New API Endpoint
1. Create route in `server/routes/yourRoutes.js`
2. Add controller function in `server/controllers/yourController.js`
3. Import and register route in `server/server.js`
4. Use `protect` middleware for auth, `authorize` for roles

### Add Socket.io Event
1. Add listener in `server/server.js` io.on('connection')
2. Use `socket.to(roomName).emit()` for broadcasting
3. Add listener in frontend component
4. Emit event via socket.current?.emit()

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI connection string in `.env`
- For MongoDB Atlas, verify IP whitelist

### Video Call Not Working
- Check browser supports WebRTC (Chrome, Firefox, Safari, Edge)
- Grant microphone and camera permissions
- Check backend server and Socket.io running
- Verify FRONTEND_URL in server `.env`

### Email Not Sending
- Verify Gmail credentials in server `.env`
- **Must use App Password** (not regular password)
- 2FA must be enabled on Gmail account
- Check spam folder for messages
- Verify EMAIL_USER and EMAIL_PASS are exactly correct

### Socket.io Connection Refused
- Ensure backend server running on port 5000
- Check CORS settings allow frontend origin
- Verify Socket.io client version matches server
- Check browser console for connection errors

## Deployment

### Environment Variables

**Server (.env)**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mindbridgeai
JWT_SECRET=use_a_very_long_random_string_here
NODE_ENV=production
PORT=5000
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=https://yourdomain.com
```

**Client (.env.production)**
```
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Build Commands

Backend:
```bash
cd server
npm install
npm start
```

Frontend:
```bash
cd client
npm install
npm run build
# Deploy dist/ folder
```

## Future Enhancements

- Payment integration (Stripe)
- Video recording and playback
- Insurance verification
- Prescription management
- Patient medication tracking
- Advanced analytics dashboard
- Mobile app (React Native)
- Multi-language support
- PDF export for session notes
- Health records integration

## License

MIT License

## Support

For issues, please submit through the contact form or open an issue on GitHub.

## Credits

Built with modern web technologies:
- React, Vite, Tailwind CSS
- Express.js, MongoDB, Mongoose
- Socket.io, WebRTC, Google Gemini API
- Created as a comprehensive full-stack mental health platform
