# Step-by-Step Classroom Demo: MindBridge AI Video Call

## Pre-Demo Setup (5 minutes before demo)

### Prerequisites
- MongoDB running: `mongod`
- Backend running: `cd server && npm run dev` (port 5000)
- Frontend running: `cd client && npm run dev` (port 5173)
- Two browser windows/tabs ready
- Browser DevTools Console open on both tabs

### What We're Demonstrating
- Patient & Doctor registration with role selection
- Finding and booking appointments
- Real-time video call using WebRTC + Socket.io
- Mute/Camera/End Call controls
- AI-generated session summaries

---

## Demo Script (15 minutes)

### Part 1: Setup (2 minutes)

**Announce to class:**
> "We're going to demonstrate MindBridge AI - a platform that connects patients with therapists for real-time video consultations. I'll show you how two users (a patient and a doctor) connect and have a video call using WebRTC technology and Socket.io for real-time signaling."

**Open Three Windows:**
1. Browser Tab 1: http://localhost:5173 (for Patient)
2. Browser Tab 2: http://localhost:5173 (for Doctor)
3. Terminal: showing backend logs

---

### Part 2: Patient Registration (2 minutes)

**Tab 1 - Patient Browser:**

1. Click "Get Started" (top-right)
2. Select "Sign Up" tab
3. Select "Patient" role
4. Fill form:
   - Full Name: `Alice Johnson`
   - Email: `alice@example.com`
   - Password: `test123`
5. Click "Create Account"

**Show to Class:**
- "Watch the browser console - Socket.io is establishing a JWT-authenticated connection"
- Look at backend terminal: See `✓ Server running on port 5000`
- Backend console shows: `User created and authenticated`

---

### Part 3: Doctor Registration (2 minutes)

**Tab 2 - Doctor Browser:**

1. Click "Get Started"
2. Select "Sign Up" tab
3. Select "Therapist" role
4. Fill form:
   - Full Name: `Dr. Bob Smith`
   - Email: `bob@example.com`
   - Password: `test123`
5. Click "Create Account"

**Show Database Impact:**
```javascript
// MongoDB now contains:
db.users.find()  // 2 users: Alice (patient) & Bob (doctor)
db.patients.find()  // Alice's patient profile
db.doctors.find()  // Bob's doctor profile with specialization
```

---

### Part 4: Patient Finding Therapist (2 minutes)

**Tab 1 - Patient:**

1. You should be logged in as Alice
2. Click "Find Doctors" in navbar
3. Filter by specialization (optional)
4. Find "Dr. Bob Smith"
5. Click "View Profile"
6. Review doctor details: experience, rating, hourly rate
7. Click "Book Appointment"
8. Select date/time
9. Click "Confirm Booking"

**Show to Class:**
```javascript
// Backend creates appointment:
db.appointments.findOne()
// Result:
{
  _id: ObjectId("..."),
  patientId: alice_id,      // Patient's MongoDB ID
  doctorId: bob_id,         // Doctor's MongoDB ID
  appointmentDate: ISODate("..."),
  status: "confirmed",
  videoSessionId: ObjectId("...") // This is the room ID
}
```

**Browser Console Shows:**
```javascript
POST /api/appointments
// Status: 201 Created
// Appointment ID returned in response
```

---

### Part 5: Doctor Accepts Appointment (1 minute)

**Tab 2 - Doctor:**

1. Login as bob@example.com / test123
2. Go to Dashboard
3. See Alice's appointment request
4. Click "Accept Appointment"
5. Appointment status changed to "confirmed"

---

### Part 6: MAIN EVENT - Video Call (5 minutes)

#### Step A: Patient Joins Video Call (1.5 minutes)

**Tab 1 - Patient (Alice):**

1. Go to Dashboard
2. See confirmed appointment with Dr. Bob
3. Click "Join Video Call"
4. **IMPORTANT**: Check browser console!

**Console Output Shows WebRTC Flow:**
```
[v0] Socket.io connected: socket_id_12345
[v0] Joining video room: video_appt_789
[v0] Getting local stream...
[v0] Local stream obtained - camera & mic enabled
[v0] PeerConnection created with ICE servers:
     - stun:stun.l.google.com:19302
     - stun:stun1.l.google.com:19302
     - turn:openrelay.metered.ca:80
```

**What's Happening Behind the Scenes:**
```javascript
// Socket.io authentication
socket.on('connection') {
  // Verify JWT token: Alice's token
  socket.user = {
    id: 'patient_123',
    role: 'patient',
    email: 'alice@example.com'
  }
}

// Join video room
socket.emit('join_video', {
  videoSessionId: 'appt_789',  // Appointment ID
  role: 'patient'
})

// Backend creates room
const roomName = 'video_appt_789'
socket.join(roomName)

// Notifies other users in room (initially none)
// Room is ready for Doctor
```

**Video Status:**
- You see your own camera (local video)
- Remote video area shows "Waiting for other user..."
- Mute and Camera buttons are active
- Console shows ICE candidates being gathered

#### Step B: Doctor Joins Video Call (1.5 minutes)

**Tab 2 - Doctor (Bob):**

1. Go to Dashboard
2. See Alice's appointment
3. Click "Join Video Call"
4. **Console shows similar flow**

**Console Output:**
```
[v0] Socket.io connected: socket_id_67890
[v0] Joining video room: video_appt_789
[v0] Getting local stream...
```

**Backend Console Shows:**
```
[Socket.io] patient_123 joined video room video_appt_789
[Socket.io] doctor_456 joined video room video_appt_789
[Socket.io] Both users in room - initiating signaling
```

#### Step C: WebRTC Handshake (Automatic) (1 minute)

**Console Flow (Automatic - No Manual Steps):**

```
ALICE'S CONSOLE:
[v0] Other user joined video: { userId: doctor_456, role: 'doctor' }
[v0] Creating WebRTC offer...
[v0] Sending WebRTC offer

BOB'S CONSOLE:
[v0] Received WebRTC offer from: patient_123
[v0] Setting remote description (Alice's offer)
[v0] Creating WebRTC answer...
[v0] Sending WebRTC answer

ALICE'S CONSOLE:
[v0] Received WebRTC answer from: doctor_456
[v0] WebRTC connection established ✓

[v0] Adding ICE candidate (multiple times)
[v0] ICE connection established

BOB'S CONSOLE:
[v0] Adding ICE candidate (multiple times)
[v0] ICE connection established
```

**Network Tab Shows:**
- Multiple `turn:openrelay.metered.ca` connections (STUN/TURN)
- WebSocket (Socket.io) connection active
- RTP streams flowing (media)

#### Step D: Video Call Active (1 minute)

**Both Screens Should Now Show:**
- Your own camera feed (local)
- Other person's camera feed (remote)
- Both audio and video working

**Interaction Demo:**

1. **Mute Microphone (Alice)**
   - Click Mic OFF button
   - Console: `[v0] Toggling audio: OFF`
   - Backend notifies Bob
   - Bob sees "Alice is muted" indicator
   ```javascript
   socket.to(roomName).emit('user_toggled_audio', {
     userId: 'patient_123',
     enabled: false
   })
   ```

2. **Toggle Camera (Bob)**
   - Click Camera OFF button
   - Alice's screen shows Bob's video goes black
   - Console: `[v0] Toggling video: OFF`
   ```javascript
   socket.to(roomName).emit('user_toggled_video', {
     userId: 'doctor_456',
     enabled: false
   })
   ```

3. **Re-enable Controls**
   - Both click buttons again to turn on
   - Video feeds restore

4. **End Call (Either User)**
   - Click Red Phone button
   - Console: `[v0] Ending video call`
   ```javascript
   socket.emit('end_video', {
     videoSessionId: 'appt_789'
   })
   ```
   - Backend updates database:
   ```javascript
   await VideoSession.updateOne(
     { _id: 'video_sess_789' },
     { status: 'completed', endedAt: new Date() }
   )
   ```
   - Both screens show "Call Ended"
   - Chat summary button appears

---

### Part 7: AI Chat Summary (2 minutes)

**After Call Ends:**

1. Click "Generate Summary" button
2. Show loading state
3. Gemini API processes the conversation
4. Summary appears:
   ```
   Session Summary:
   - Topics Discussed: anxiety management, sleep issues
   - Therapeutic Approach: CBT techniques discussed
   - Recommendations: Daily breathing exercises, sleep hygiene
   - Follow-up: Schedule 2-week check-in
   ```

**Behind the Scenes:**
```javascript
POST /api/chat/appt_789/generate-summary

// Server sends to Gemini API:
{
  "messages": [
    { role: "patient", text: "I've been having trouble sleeping..." },
    { role: "doctor", text: "Let's discuss some CBT techniques..." }
  ]
}

// Gemini returns:
{
  "summary": "Clinical notes...",
  "keyPoints": [...],
  "recommendations": [...]
}

// Stored in database:
db.chatSessions.updateOne(
  { _id: 'appt_789' },
  {
    summaryGenerated: true,
    summary: "...",
    summarizedAt: new Date()
  }
)
```

---

## Key Points to Highlight to Class

### 1. WebRTC Technology
- Direct P2P connection (peer-to-peer)
- Media flows directly between browsers
- Not going through server for video/audio
- Uses STUN/TURN for NAT traversal

### 2. Socket.io for Signaling
- Handles initial handshake (Offer/Answer)
- Exchanges ICE candidates
- Coordinates mute/camera controls
- Room-based isolation (only 2 users per appointment)

### 3. Security & Privacy
- JWT authentication on all Socket.io connections
- Appointment-based room access (can't join random calls)
- End-to-end encrypted (TLS for Socket.io, DTLS-SRTP for WebRTC)

### 4. Free Services Used
- Google STUN servers (free, public)
- OpenRelay TURN servers (free, public)
- No paid services needed for demo

### 5. Database Schema
```
User (Alice & Bob)
  ├── Patient Profile (Alice)
  ├── Doctor Profile (Bob with specialization)
  └── Appointments (Links Patient & Doctor)
      ├── ChatSession (Messages)
      └── VideoSession (Call metadata)
          └── AI Summary (Gemini generated)
```

---

## Troubleshooting During Demo

### Video Not Showing
- **Solution**: Check camera permissions in browser
- **Show**: Settings → Privacy → Camera → Allow

### Audio Not Working
- **Solution**: Check microphone permissions
- **Show**: Settings → Privacy → Microphone → Allow

### Socket.io Not Connecting
- **Solution**: Backend might have crashed
- **Check**: Terminal running `npm run dev`
- **Fix**: Restart with `npm run dev`

### Latency/Lag
- **Explanation**: This is normal on localhost
- **Explain**: In production, video compression reduces bandwidth

---

## Post-Demo Discussion

### Questions to Raise
1. "What happens if Doctor rejects appointment?"
2. "How does the system prevent unauthorized access?"
3. "Can multiple patients join same call?"
4. "What's the difference between STUN and TURN servers?"
5. "Why do we need both for reliability?"

### Technical Points
- Socket.io provides low-latency signaling
- WebRTC provides high-quality media
- Together = Real-time video conferencing
- Used by: Google Meet, Zoom, Skype, Discord

### Cost Consideration
- This demo: $0 (completely free)
- Production: ~$0-20/month for TURN servers (optional)
- Scalability: 100s of concurrent calls possible

---

## Demo File Locations

- Frontend: `/client/src/pages/VideoCall.jsx`
- Backend: `/server/server.js` (Socket.io handlers)
- WebRTC Utility: `/client/src/utils/webrtc.js`
- Models: `/server/models/VideoSession.js`

**All code includes detailed logging for educational purposes.**
