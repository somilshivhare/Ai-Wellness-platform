# Complete WebRTC + Socket.io Video Call Implementation Guide

## How Socket.io Works Between Patient and Doctor

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MINDBRIDGEAI VIDEO CALL FLOW                  │
└─────────────────────────────────────────────────────────────────┘

PATIENT BROWSER                  SOCKET.IO SERVER               DOCTOR BROWSER
(localhost:5173)                 (localhost:5000)               (localhost:5173)

     │                                 │                              │
     ├──── JWT Token Auth ────────────>│<──── JWT Token Auth ────────┤
     │                                 │                              │
     ├──── join_video ────────────────>│<──── join_video ────────────┤
     │   {appointmentId, role}        │   {appointmentId, role}     │
     │                                 │                              │
     ├──────────────────────────────────────────────────────────────┤
     │              Room: video_${appointmentId}                     │
     │              Both users now in same Socket.io room            │
     │                                                                │
     ├──── webrtc_offer ──────────────>│<──── webrtc_offer ─────────┤
     │   (SDP Offer with local ICE)    │                              │
     │                                 │                              │
     │<──── webrtc_answer ─────────────────── webrtc_answer ────────┤
     │      (SDP Answer with ICE)                                    │
     │                                                                │
     ├──── webrtc_ice_candidate ─────>│<── webrtc_ice_candidate ───┤
     │    (Multiple ICE candidates)    │                              │
     │                                 │                              │
     │ ============ Direct P2P Connection Established ============   │
     │   (Encrypted RTP media streams)                               │
     │ =========================================================== │
     │                                                                │
     ├──── toggle_audio ──────────────>│<──── toggle_audio ────────┤
     ├──── toggle_video ──────────────>│<──── toggle_video ────────┤
     │                                 │                              │
     ├──── end_video ─────────────────>│<──── end_video ───────────┤
     │                                 │                              │
     └─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Connection Process

### Phase 1: Authentication & Connection

**1. Patient & Doctor Both Open MindBridge**
```javascript
// Browser connects to Socket.io with JWT token
const socket = io('http://localhost:5000', {
  auth: { 
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
  }
});
```

**Server Verifies Token:**
```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  socket.user = decoded; // Contains: userId, role (patient/doctor), email
  next();
});
```

### Phase 2: Appointment Booking & Room Creation

**1. Patient Books Doctor**
```javascript
// POST /api/appointments
{
  patientId: "patient_123",
  doctorId: "doctor_456",
  appointmentDate: "2024-02-25T15:00:00Z",
  duration: 30,
  appointmentId: "appt_789"
}
```

**2. Appointment Created in MongoDB**
```javascript
{
  _id: "appt_789",
  patientId: "patient_123",
  doctorId: "doctor_456",
  status: "scheduled",
  videoSessionId: "video_session_789"
}
```

### Phase 3: Video Call Initiation

**Patient Click "Join Video Call"**
```javascript
// Patient joins video room
socket.emit('join_video', {
  videoSessionId: 'appt_789',  // appointmentId
  role: 'patient'
});
```

**Socket.io Server Action:**
```javascript
socket.on('join_video', (data) => {
  const roomName = `video_${data.videoSessionId}`; // video_appt_789
  socket.join(roomName);
  
  // Notify other user in room (Doctor)
  socket.to(roomName).emit('user_joined_video', {
    userId: socket.user.id,      // patient_123
    role: 'patient'
  });
});
```

**Doctor Receives Notification**
```javascript
socket.on('user_joined_video', async (data) => {
  console.log(`${data.role} joined: ${data.userId}`);
  // Doctor's browser can now create WebRTC offer
});
```

---

## WebRTC Signaling Phase (Establishing Peer Connection)

### Step 1: Patient Creates Offer

**Patient Browser:**
```javascript
const peerConnection = new RTCPeerConnection({
  iceServers: [
    // STUN servers (for NAT traversal)
    { urls: 'stun:stun.l.google.com:19302' },
    // TURN servers (fallback for restrictive NAT)
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ]
});

// Get local stream (camera + microphone)
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: { width: 1280, height: 720 }
});

// Add tracks to peer connection
stream.getTracks().forEach(track => {
  peerConnection.addTrack(track, stream);
});

// Listen for ICE candidates
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('webrtc_ice_candidate', {
      videoSessionId: 'appt_789',
      candidate: event.candidate
    });
  }
};

// Create SDP Offer
const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);

// Send offer to Doctor
socket.emit('webrtc_offer', {
  videoSessionId: 'appt_789',
  offer: offer  // SDP: Contains codecs, encryption keys, etc.
});
```

**Socket.io Transmits Offer:**
```javascript
socket.on('webrtc_offer', (data) => {
  const roomName = `video_${data.videoSessionId}`;
  
  // Forward offer to Doctor in the room
  socket.to(roomName).emit('webrtc_offer', {
    offer: data.offer,
    from: socket.user.id  // patient_123
  });
});
```

### Step 2: Doctor Receives Offer & Creates Answer

**Doctor Browser Receives Offer:**
```javascript
socket.on('webrtc_offer', async (data) => {
  // Set remote description (Patient's offer)
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
  
  // Create answer
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  
  // Send answer back to Patient
  socket.emit('webrtc_answer', {
    videoSessionId: 'appt_789',
    answer: answer
  });
});
```

**Socket.io Transmits Answer:**
```javascript
socket.on('webrtc_answer', (data) => {
  const roomName = `video_${data.videoSessionId}`;
  
  socket.to(roomName).emit('webrtc_answer', {
    answer: data.answer,
    from: socket.user.id  // doctor_456
  });
});
```

### Step 3: Patient Receives Answer

**Patient Browser Receives Answer:**
```javascript
socket.on('webrtc_answer', async (data) => {
  // Set remote description (Doctor's answer)
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );
  // Connection now established!
});
```

### Step 4: ICE Candidate Exchange (Connection Optimization)

Both browsers continuously send ICE candidates to find best path:

```javascript
socket.on('webrtc_ice_candidate', async (data) => {
  try {
    await peerConnection.addIceCandidate(
      new RTCIceCandidate(data.candidate)
    );
  } catch (error) {
    console.error('Failed to add ICE candidate:', error);
  }
});
```

**ICE Candidates Path:**
```
Patient's Local IP: 192.168.1.100:54321
         ↓
Patient's Public IP: 203.0.113.45:54321 (via STUN)
         ↓
Relay Server: turn:openrelay.metered.ca:80 (if needed)

Doctor's Side:
Relay Server: turn:openrelay.metered.ca:80
         ↓
Doctor's Public IP: 198.51.100.89:55555
         ↓
Doctor's Local IP: 192.168.2.50:55555

✓ Best path selected automatically by WebRTC
```

---

## Live Connection Features

### Real-time Media Streaming

```
Patient's Microphone ──┐
Patient's Camera    ──┼──> RTP Stream (Encrypted)
                       │
                       ├──> [STUN/TURN Server]
                       │
                       └──> Doctor's Browser
                             ├─> Speaker Output
                             └─> Video Display

Doctor's Microphone ──┐
Doctor's Camera    ──┼──> RTP Stream (Encrypted)
                      │
                      ├──> [STUN/TURN Server]
                      │
                      └──> Patient's Browser
                            ├─> Speaker Output
                            └─> Video Display
```

### Mute/Unmute Control

```javascript
// Patient mutes microphone
socket.emit('toggle_audio', {
  videoSessionId: 'appt_789',
  enabled: false
});

// Doctor receives notification
socket.on('user_toggled_audio', (data) => {
  console.log(`Patient audio: ${data.enabled ? 'ON' : 'OFF'}`);
  // Update UI to show mute status
});
```

### Camera Toggle

```javascript
socket.emit('toggle_video', {
  videoSessionId: 'appt_789',
  enabled: false
});
```

### End Call

```javascript
socket.emit('end_video', {
  videoSessionId: 'appt_789'
});

// Server updates database
await VideoSession.findByIdAndUpdate(videoSessionId, {
  status: 'completed',
  endedAt: new Date(),
  duration: calculateDuration()
});

// Notifies both users
io.to(`video_${videoSessionId}`).emit('video_ended', {
  userId: socket.user.id
});
```

---

## Demo: Patient & Doctor Flow

### Setup (Localhost)

```bash
Terminal 1: mongod
Terminal 2: cd server && npm run dev
Terminal 3: cd client && npm run dev
```

### Demo Scenario

```
1. BROWSER TAB 1 (Patient)
   - Go to http://localhost:5173
   - Click "Sign Up" → Select "Patient"
   - Email: alice@example.com, Password: test123
   - Click "Create Account"
   
2. BROWSER TAB 2 (Doctor)
   - Go to http://localhost:5173
   - Click "Sign Up" → Select "Therapist"
   - Email: bob@example.com, Password: test123
   - Complete doctor profile
   
3. SWITCH TO TAB 1 (Patient)
   - Login as alice@example.com
   - Click "Find Doctors"
   - Find Doctor Bob
   - Click "View Profile"
   - Click "Book Appointment"
   - Select date/time
   - Click "Confirm Booking"
   
4. SWITCH TO TAB 2 (Doctor)
   - Login as bob@example.com
   - Go to Dashboard
   - See Patient's appointment request
   - Click "Accept" or "View Details"
   
5. SWITCH TO TAB 1 (Patient)
   - Go to Dashboard
   - See appointment confirmed
   - Click "Join Video Call"
   
6. SWITCH TO TAB 2 (Doctor)
   - See "Patient Joined" notification
   - Click "Join Video Call"
   
7. BOTH TABS
   - Video call establishes
   - See each other's video/audio
   - Can mute/toggle camera
   - Chat messages appear
   - End call when done
   - AI generates summary
```

---

## Complete Data Flow Example

### Patient: Alice (ID: patient_123)
- Email: alice@example.com
- Token: eyJhbGc...patient_token...
- JWT Payload: { userId: 'patient_123', role: 'patient', email: 'alice@example.com' }

### Doctor: Bob (ID: doctor_456)
- Email: bob@example.com
- Token: eyJhbGc...doctor_token...
- JWT Payload: { userId: 'doctor_456', role: 'doctor', email: 'bob@example.com' }

### Appointment Created
```javascript
{
  _id: ObjectId("appt_789"),
  patientId: 'patient_123',     // Alice
  doctorId: 'doctor_456',       // Bob
  appointmentDate: 2024-02-25T15:00:00Z,
  status: 'confirmed',
  videoSessionId: ObjectId("video_sess_789")
}
```

### Socket.io Room Name
```javascript
video_appt_789  // Both Alice and Bob join this room
```

### WebRTC Connection Summary
```
Alice's Browser ──[Offer: SDP + Audio/Video Codec]──> Bob's Browser
     │
     │ [ICE Candidates: Possible connection paths]
     │
Alice's Browser <──[Answer: SDP + Codec]────── Bob's Browser
     │
     ├──> Direct P2P via STUN (Same Network) ✓
     └──> Via TURN (Different Networks) ✓

MEDIA STREAMS:
Alice's Microphone ──[RTP Encrypted]──> Bob's Speaker
Alice's Camera    ──[RTP Encrypted]──> Bob's Video
     │
Bob's Microphone  ──[RTP Encrypted]──> Alice's Speaker
Bob's Camera      ──[RTP Encrypted]──> Alice's Video
```

---

## Key Points for Classroom Demo

1. **No External Dependencies**: Uses free Google STUN + OpenRelay TURN servers
2. **Appointment-Based Rooms**: Each call is isolated using appointmentId
3. **Role-Based Access**: Patient can only call Doctor via confirmed appointment
4. **JWT Authentication**: Socket.io verifies token on connection
5. **Automatic Fallback**: If direct P2P fails, TURN relay handles it
6. **Local Testing**: Works perfectly on localhost without any fees

---

## Troubleshooting

### Video Not Showing
1. Check browser camera permissions
2. Verify both users joined video call
3. Check browser console for errors
4. Ensure MongoDB is running

### No Audio
1. Check microphone permissions
2. Both users need audio enabled
3. Check volume levels
4. Verify Socket.io connection (check Network tab)

### Connection Drops
1. STUN servers may be blocked (check firewall)
2. TURN fallback should handle it
3. Check internet connection stability
4. Try refreshing page

### Socket.io Not Connecting
1. Verify backend running on port 5000
2. Check CORS settings in server
3. Verify JWT token valid
4. Check browser console for auth errors
