# MindBridge AI: Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Step 1: Start Services

**Terminal 1 - Database:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```
✅ Backend ready at `http://localhost:5000`

**Terminal 3 - Frontend:**
```bash
cd client
npm run dev
```
✅ Frontend ready at `http://localhost:5173`

---

## 📱 Demo Flow (5 minutes)

### Setup: Open 2 Browser Tabs

**Browser Tab 1 & 2:** http://localhost:5173

---

### 1️⃣ Patient Registration (Tab 1)

1. Click **"Get Started"** (top right)
2. Select **"Sign Up"** tab
3. Choose **"Patient"** role
4. Fill in:
   ```
   Name: Alice Johnson
   Email: alice@example.com
   Password: test123
   ```
5. Click **"Create Account"**

---

### 2️⃣ Doctor Registration (Tab 2)

1. Click **"Get Started"**
2. Select **"Sign Up"** tab
3. Choose **"Therapist"** role
4. Fill in:
   ```
   Name: Dr. Bob Smith
   Email: bob@example.com
   Password: test123
   ```
5. Complete doctor profile
6. Click **"Create Account"**

---

### 3️⃣ Patient Books Doctor (Tab 1)

1. Should be logged in as Alice
2. Click **"Find Doctors"** in navbar
3. Find **"Dr. Bob Smith"**
4. Click **"Book Appointment"**
5. Select date/time
6. Click **"Confirm"**

---

### 4️⃣ Doctor Accepts (Tab 2)

1. Login as bob@example.com
2. Go to **Dashboard**
3. See Alice's appointment
4. Click **"Accept Appointment"**

---

### 5️⃣ Video Call (Both Tabs) 🎥

**Tab 1 (Alice):**
1. Dashboard → Confirmed appointment
2. Click **"Join Video Call"**
3. Watch browser console (exciting logs!)
4. Wait for Bob to join

**Tab 2 (Bob):**
1. Dashboard → Alice's appointment
2. Click **"Join Video Call"**
3. Watch console logs
4. Video call starts automatically!

---

## 🎬 What Happens in Console

Open **DevTools → Console** (F12)

```javascript
// When joining video
[v0] Socket.io connected: socket_id_12345
[v0] Joining video room: video_appt_789
[v0] Getting local stream...
[v0] Other user joined video: { userId: doctor_456 }
[v0] Creating WebRTC offer...
[v0] Sending WebRTC offer
[v0] Received WebRTC answer
[v0] WebRTC connection established ✓
[v0] Adding ICE candidate (multiple times)
[v0] ICE connection established

// During call
[v0] Toggling audio: OFF
[v0] Toggling video: OFF
[v0] Ending video call
```

---

## 🎮 During Video Call

| Button | Action |
|--------|--------|
| 🔴 Mute | Turn microphone off/on |
| 📹 Camera | Turn camera off/on |
| ☎️ End | End the call |

---

## 📊 Behind the Scenes

```
1. JWT Authentication ✓
   Both users authenticated via JWT token

2. Socket.io Connection ✓
   WebSocket connection established

3. Room Creation ✓
   Video room created: video_appt_789
   Only Alice & Bob in this room

4. WebRTC Handshake ✓
   Offer → Answer → ICE Candidates
   (Automatic, no manual steps)

5. Direct P2P Connection ✓
   Video/Audio streams flow directly
   Bandwidth: 2-5 Mbps (auto-adjusts)

6. Database Updates ✓
   VideoSession created
   ChatSession created for messages

7. AI Summary (Optional) ✓
   Click "Generate Summary" after call
   Gemini API analyzes conversation
   Stores recommendations in database
```

---

## 🔍 Monitoring Backend

**Backend Console Shows:**
```
[Socket.io] patient_123 joined video_appt_789
[Socket.io] doctor_456 joined video_appt_789
[Socket.io] Offer/Answer/ICE messages flowing
[Socket.io] Video session: video_appt_789 completed
```

---

## 🆘 Troubleshooting

### ❌ "Can't see other person's video"

**Check:**
1. Both clicked "Join Video Call"
2. Browser camera permissions allowed
3. Check browser console for errors
4. Try refreshing page

### ❌ "No audio"

**Check:**
1. Both have microphone enabled
2. Click unmute button (🔴)
3. Check browser microphone permissions
4. Volume levels not at 0

### ❌ "Video call button not showing"

**Check:**
1. Appointment is "confirmed" status
2. Refresh page
3. Check backend is running (port 5000)

### ❌ "Socket.io not connecting"

**Check:**
1. Backend running: `cd server && npm run dev`
2. Is it on port 5000?
3. Check browser console for errors
4. Restart backend

---

## 📚 Documentation

For detailed information:

- **COMPLETE_VIDEO_CALL_GUIDE.md** - Full technical deep dive
- **SOCKET_IO_MESSAGE_FLOW.md** - How messages flow
- **STEP_BY_STEP_DEMO.md** - Classroom presentation script
- **MONGODB_SCHEMA.md** - Database structure
- **IMPLEMENTATION_COMPLETE.md** - What's implemented

---

## 🎯 Key Concepts (30-second version)

### WebRTC
- Peer-to-peer video/audio
- Direct connection (not through server)
- Uses STUN/TURN servers for NAT traversal

### Socket.io
- Handles initial handshake
- Exchanges SDP (Offer/Answer)
- Exchanges ICE candidates
- Controls (mute/camera/end)

### Together
- Socket.io = Control channel
- WebRTC = Media channel
- = Real-time video conferencing

---

## 💡 What's Actually Free?

✅ **Google STUN Servers** - Public, no auth needed
✅ **OpenRelay TURN Servers** - Public, no auth needed
✅ **Socket.io** - Open source, free
✅ **WebRTC** - Browser native, free
✅ **MongoDB** - Local/free tier, free
✅ **Node.js** - Open source, free

**Total Cost: $0 for demo**

---

## 🚀 Next Steps

### For Production:
1. Deploy MongoDB (Atlas, Neon, etc.)
2. Deploy Backend (Vercel, Heroku, etc.)
3. Deploy Frontend (Vercel, Netlify, etc.)
4. Add TURN server (Metered.ca $3-5/month)
5. Setup SSL/HTTPS certificates
6. Configure domain names
7. Add payment processing (Stripe)
8. Setup email notifications

### For Right Now:
Just run the 3 commands above and demo away! 🎉

---

## 📞 API Endpoints Cheat Sheet

```javascript
// Auth
POST /api/auth/signup
POST /api/auth/login

// Doctors
GET /api/doctors
GET /api/doctors/:id
GET /api/doctors/search?specialization=...

// Appointments
POST /api/appointments
GET /api/appointments/:id
GET /api/appointments/patient/:patientId

// Chat
GET /api/chat/:appointmentId
POST /api/chat/:appointmentId/send
POST /api/chat/:appointmentId/generate-summary

// Assessment
POST /api/assessment/phq9
GET /api/assessment/:patientId
```

---

## 🎓 For Classroom Teaching

**Show students:**
1. Two real browser tabs connecting
2. Browser console with logs showing connection flow
3. Backend console with Socket.io messages
4. Video streaming directly P2P
5. MongoDB data being created
6. AI-generated summary

**Highlight:**
- Real-time communication
- Security (JWT + role-based access)
- Scalability (room-based isolation)
- Free services (STUN/TURN)

---

## ✨ Demo Highlights

```
Alice (Patient)          →    Bob (Doctor)
Joins Video             →    Joins Video
     ↓
  [Socket.io]  ←→  [Socket.io]
     ↓                    ↓
  [Offer]  ─────────→  [Answer]
     ↓                    ↓
[ICE Candidates] ←────────→
     ↓
┌──────────────────────────────┐
│    DIRECT P2P VIDEO CALL    │
│  (Video/Audio streaming)     │
└──────────────────────────────┘
     ↓
  [Mute/Camera Control via Socket.io]
     ↓
  [End Call & Database Update]
     ↓
  [AI Summary Generation]
```

---

**You're ready! Let's demo! 🚀**

```bash
# Run these 3 commands
mongod
cd server && npm run dev
cd client && npm run dev
```

Then open: http://localhost:5173
