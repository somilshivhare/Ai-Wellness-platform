# MindBridge AI - Complete WebRTC Video Call Implementation 🚀

## ✅ Complete Implementation Status

### Core Features Implemented
- ✅ **MongoDB Database** - Users, Patients, Doctors, Appointments, ChatSessions, VideoSessions, Assessments
- ✅ **User Authentication** - JWT-based signup/login for Patients and Doctors
- ✅ **Appointment System** - Booking, confirmation, management
- ✅ **WebRTC Video Calls** - Peer-to-peer video/audio with STUN/TURN servers
- ✅ **Socket.io Signaling** - Real-time signaling between Patient and Doctor (appointment-based rooms)
- ✅ **Real-time Chat** - Messages during calls with persistent storage
- ✅ **AI Chat Summary** - Gemini API generates clinical summaries automatically
- ✅ **Console Logging** - Detailed `[v0]` logs showing Socket.io flow with Patient ID & Doctor ID

### All Free Infrastructure
- Google STUN Servers (free)
- OpenRelay TURN Servers (free)
- Local MongoDB (free)
- Socket.io (free, open source)
- WebRTC (free, browser native)

---

## 📚 New Comprehensive Documentation (10 Files!)

All documentation files are in the project root. Start with one based on your goal:

| Goal | File | Time |
|------|------|------|
| **Just demo it NOW** | QUICK_START_GUIDE.md | 10 min |
| **Understand Socket.io with Patient/Doctor IDs** | SOCKET_IO_MESSAGE_FLOW.md | 20 min |
| **Understand complete WebRTC flow** | COMPLETE_VIDEO_CALL_GUIDE.md | 20 min |
| **Teach this to a class** | STEP_BY_STEP_DEMO.md | 25 min |
| **Understand database schema** | MONGODB_SCHEMA.md | 20 min |
| **See system architecture** | ARCHITECTURE_DIAGRAMS.md | 25 min |
| **Debug console logs** | CONSOLE_DEBUGGING_GUIDE.md | 15 min |
| **All details & checklist** | IMPLEMENTATION_COMPLETE.md | 15 min |
| **Find what to read** | DOCUMENTATION_INDEX.md | 10 min |
| **Free services info** | FREE_VIDEO_CALL_DEMO.md | 10 min |

---

## 🎯 How Socket.io Works Between Patient & Doctor

### Quick Explanation (The User Asked For This! 👇)

```
PATIENT BROWSER (Alice)              DOCTOR BROWSER (Bob)
         │                                    │
         ├─ Connect with JWT Token           │
         │ socket = io('localhost:5000',     │
         │ { auth: { token } })              │
         │                                    │
         ├─ emit('join_video') ────────────────────────►
         │ { videoSessionId: 'appt_789' }    │
         │ (This is the appointment ID)      │
         │                                    │
         │                    ◄─ emit('join_video')
         │                                    │
         ├─ on('user_joined_video') ◄────────┤
         │ Doctor is now in the room!        │
         │                                    │
         ├─ Create WebRTC Offer ────────────────────────►
         │ (Patient initiates connection)    │
         │                                    │
         │                    ◄─ Create Answer
         │                     (Doctor responds)
         │                                    │
         ├─ Exchange ICE Candidates ◄───────────────────►
         │ (Finding best connection path)    │
         │                                    │
         └─ DIRECT P2P CONNECTION ESTABLISHED
            Video/Audio flows directly
            Socket.io handles mute/camera/end call signals
```

**Key Points:**
- Both users in room: `video_${appointmentId}`
- Only Patient and Doctor for THIS appointment can join
- Video/Audio NOT through server (direct P2P)
- All Socket.io messages include appointmentId for routing
- Secure: JWT authenticates every Socket.io message

See **SOCKET_IO_MESSAGE_FLOW.md** for detailed message flow with actual Patient/Doctor IDs!

---

## Quick Start (5 Minutes)

### Step 1: Start MongoDB

**macOS/Linux**:
```bash
mongod
```

**Windows**:
Open Command Prompt and run:
```bash
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**With Homebrew (Mac)**:
```bash
brew services start mongodb-community
```

Leave this running.

---

### Step 2: Start Backend Server

Open a NEW terminal window:

```bash
cd server
npm install   # (only needed first time)
npm run dev
```

Expected output:
```
✓ Server running on port 5000
✓ MongoDB connected to mindbridgeai
```

If port 5000 is busy, it will auto-use 5001. That's fine!

---

### Step 3: Start Frontend

Open ANOTHER NEW terminal window:

```bash
cd client
npm install   # (only needed first time)
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

### Step 4: Visit the App

Open browser to: **http://localhost:5173**

You should see:
- MindBridge AI Landing Page
- Hero section with "Your Path to Mental Wellness"
- Get Started button
- Beautiful gradient background

---

## Test the App

### 1. Create Account
- Click "Get Started"
- Fill signup form
- Choose "Patient" or "Doctor" role
- Submit

### 2. Login
- Enter email and password
- You'll be logged in!

### 3. Patient Flow
- Go to Assessment
- Fill out wellness questionnaire
- Browse available doctors
- Book an appointment

### 4. Doctor Flow
- Update profile
- View patient appointments
- Accept/manage appointments

### 5. Real-time Features
- **Chat**: Start a text conversation with Gemini AI summarization
- **Video**: Click to start WebRTC video call
- **Email**: Check spam folder for confirmation emails

---

## Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Backend config (MongoDB, APIs) |
| `client/.env` | Frontend config (API base URL) |
| `server/server.js` | Main backend entry point |
| `client/src/App.jsx` | Frontend router |
| `client/src/index.css` | Global styles |

---

## Environment Variables

### Backend (.env file in `/server` directory)

```env
# Database
MONGO_URI=mongodb://localhost:27017/mindbridgeai
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# APIs
GEMINI_API_KEY=AIzaSyBR_2saieDNOcltKuzUSoUAM0HaFRp10MM
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password_16_chars

# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env file in `/client` directory)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Note**: If backend uses port 5001 instead of 5000, update both the API URL and FRONTEND_URL accordingly.

---

## Commands Cheatsheet

```bash
# Start everything
mongod                    # Terminal 1
cd server && npm run dev  # Terminal 2
cd client && npm run dev  # Terminal 3

# Free up port 5000 if needed
./kill-port.sh

# Install dependencies (first time)
cd server && npm install
cd client && npm install

# Build for production
cd client && npm run build
cd server && npm install --production

# Remove node_modules and reinstall (if issues)
rm -rf node_modules package-lock.json
npm install
```

---

## Verify Everything Works

### ✅ Frontend
- [ ] Page loads at http://localhost:5173
- [ ] No white screen
- [ ] Landing page visible with styling
- [ ] Can navigate to Login page
- [ ] Responsive on mobile

### ✅ Backend
- [ ] Server running on port 5000 or 5001
- [ ] MongoDB connected
- [ ] No error messages in console

### ✅ Database
- [ ] MongoDB running
- [ ] Can create new users
- [ ] Users appear in database

### ✅ Real-time (Optional for now)
- [ ] Socket.io connections working
- [ ] Chat messages appear
- [ ] Video calls initialize

### ✅ APIs
- [ ] Signup works
- [ ] Login works
- [ ] API calls succeed (check Network tab in F12)

---

## Troubleshooting

### White Screen on Frontend
```bash
# Clear cache and rebuild
cd client
rm -rf .vite
npm run dev
```

### Port 5000 Already in Use
```bash
# Kill the process
./kill-port.sh

# Or manually
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed
```bash
# Start MongoDB
mongod

# Or with Homebrew
brew services start mongodb-community
```

### Backend Crashes Immediately
```bash
# Check error message (usually in red)
# Most common: Port in use or MongoDB not running

# Try different port
PORT=5001 npm run dev
```

### Dependencies Missing
```bash
# Reinstall everything
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Still broken?
See `TROUBLESHOOTING.md` for comprehensive debugging guide!

---

## Project Structure

```
mindbridge-ai/
├── server/                 # Express backend
│   ├── models/            # MongoDB schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation
│   ├── config/            # Database config
│   ├── .env               # Configuration
│   ├── server.js          # Entry point
│   └── package.json       # Dependencies
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API calls
│   │   ├── App.jsx        # Router
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite config
│   ├── .env               # Configuration
│   └── package.json       # Dependencies
│
└── README.md              # Full documentation
```

---

## Next Steps

1. ✅ Get frontend and backend running
2. ✅ Create a test account
3. ✅ Explore all pages and features
4. ✅ Test chat and video (real-time features)
5. ✅ Check email notifications
6. 📝 Customize colors, text, and styling
7. 🚀 Deploy to production (Vercel, Heroku, etc.)

---

## Support

- Check `TROUBLESHOOTING.md` for common issues
- Check `README.md` for full documentation
- Check browser console (F12) for errors
- Check backend terminal for server logs
- Add `console.log("[v0] ...")` to debug code

---

## Technology Stack

**Frontend**:
- React 18
- Vite (fast bundler)
- React Router (routing)
- Zustand (state management)
- Socket.io (real-time)
- Tailwind CSS (styling)
- Lucide Icons

**Backend**:
- Express.js (server framework)
- MongoDB + Mongoose (database)
- Socket.io (WebRTC signaling)
- JWT (authentication)
- Nodemon (auto-reload)
- Google Gemini API (AI summaries)
- NodeMailer (emails)

**Deployment Ready**:
- Can deploy to Vercel, Heroku, AWS, DigitalOcean
- MongoDB Atlas for cloud database
- Gmail for email service
- Google Cloud for Gemini API

---

---

## 🎬 What's New: Complete Socket.io + WebRTC Implementation

### Enhanced VideoCall.jsx Component
- Added detailed console logging showing Socket.io flow
- Every message logged with `[v0]` prefix for educational visibility
- Shows Patient ID and Doctor ID in messages
- Display ICE candidate gathering
- Show connection establishment step-by-step

### Socket.io Events (All Implemented)
```javascript
// Join video room
emit('join_video', { videoSessionId: appt_789, role: 'patient' })

// WebRTC signaling
emit('webrtc_offer', { videoSessionId, offer })
emit('webrtc_answer', { videoSessionId, answer })
emit('webrtc_ice_candidate', { videoSessionId, candidate })

// Controls
emit('toggle_audio', { videoSessionId, enabled: false })
emit('toggle_video', { videoSessionId, enabled: false })

// End call
emit('end_video', { videoSessionId })
```

### Room-Based Isolation
```javascript
// Room name based on appointment
const roomName = `video_${appointmentId}`  // e.g., video_appt_789

// Only Patient & Doctor for THIS appointment can join
// Cannot join random calls
// Cannot eavesdrop on other appointments
```

### Database Integration Complete
- **users**: Auth & role management (patient/doctor)
- **patients**: Patient profiles with health data
- **doctors**: Doctor credentials, specialization, ratings
- **appointments**: Links Patient ↔ Doctor, includes video/chat session IDs
- **chatsessions**: Messages during call + AI summary
- **videosessions**: Call metadata, bandwidth, duration
- **assessments**: Mental health assessments (PHQ-9)

### Free Infrastructure Configured
```javascript
// WebRTC ICE Servers (in client/src/utils/webrtc.js)
iceServers: [
  { urls: 'stun:stun.l.google.com:19302' },        // Google (free)
  { urls: 'stun:stun1.l.google.com:19302' },       // Google (free)
  {
    urls: 'turn:openrelay.metered.ca:80',          // OpenRelay (free)
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  // ... more STUN/TURN options
]
```

### AI-Powered Features
- Gemini API integration ready
- Auto-generates session summaries
- Extracts key points and recommendations
- Stores in MongoDB for doctor review

---

## 🚀 Demo to See It All Work

### Tab 1: Patient (Alice)
```
Sign up as Patient
  → Dashboard
    → Find Doctors
      → Select Dr. Bob
        → Book Appointment
          → Dashboard
            → Join Video Call
```

### Tab 2: Doctor (Bob)
```
Sign up as Doctor
  → Complete Profile
    → Dashboard
      → Accept Appointment
        → Dashboard
          → Join Video Call
```

### Console Shows Beautiful Socket.io Flow
```javascript
[v0] Socket.io connected: socket_id_12345
[v0] Joining video room: video_appt_789
[v0] Other user joined video: { userId: doctor_456, role: 'doctor' }
[v0] Creating WebRTC offer...
[v0] Received WebRTC answer from: doctor_456
[v0] WebRTC connection established ✓
[v0] Adding ICE candidate
[v0] ICE connection established
// Video appears!
```

---

## 📖 Documentation for Your Request

**You asked**: "Show me how Socket.io will work with patient id and one with doctor id with each other"

**Answer**: Check these files:
1. **SOCKET_IO_MESSAGE_FLOW.md** - Complete message flow with Patient/Doctor IDs
2. **COMPLETE_VIDEO_CALL_GUIDE.md** - Step-by-step connection process
3. **ARCHITECTURE_DIAGRAMS.md** - Visual diagrams of the flow
4. **STEP_BY_STEP_DEMO.md** - Classroom presentation (shows it working)

All files show exact Patient ID (e.g., `patient_123`) and Doctor ID (e.g., `doctor_456`) throughout the flow!

---

Let's build something amazing! 🎯

Good luck, and feel free to customize everything to match your vision!

**Start with**: QUICK_START_GUIDE.md or SOCKET_IO_MESSAGE_FLOW.md depending on if you want to run it or understand it first! 🚀
