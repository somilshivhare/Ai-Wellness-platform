# MindBridge AI: Architecture Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      MINDBRIDGEAI SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

CLIENT LAYER                    SIGNALING LAYER           SERVER LAYER
─────────────                   ──────────────            ────────────

Patient Browser              Socket.io Server (5000)    Express.js
├─ React App                 ├─ JWT Authentication      ├─ Routes
├─ WebRTC Engine             ├─ Room Management         ├─ Controllers
├─ Audio/Video               ├─ Message Relay           ├─ Models
└─ UI Controls               └─ State Coordination      └─ API Logic
   │                             │                          │
   ├─ auth Token                 ├─ Verification           ├─ JWT Verify
   │  (JWT)                      │  (Token)                ├─ Database Query
   │                             │                         └─ Response
   └─ emit()                     └─ to()
   │  WebRTC Offer              Forward to
   │  ICE Candidates            other socket
   │  Mute/Camera
   │  Chat Messages
   │
   ↓ Direct P2P (Media) ↓
   ─────────────────────────
   RTP/RTCP Streams
   (Not through server)
   ─────────────────────────

Doctor Browser              ↑                           Database
├─ React App           connect                         (MongoDB)
├─ WebRTC Engine       with                           ├─ users
├─ Audio/Video         Socket.io                      ├─ patients
└─ UI Controls         (JWT Auth)                     ├─ doctors
                                                      ├─ appointments
                                                      ├─ chatsessions
                                                      ├─ videosessions
                                                      └─ assessments

Third-Party Services
├─ Google STUN Servers (stun.l.google.com)
├─ OpenRelay TURN Servers (openrelay.metered.ca)
└─ Gemini API (AI summaries)
```

---

## 2. Socket.io Connection Flow

```
PATIENT BROWSER                    SOCKET.IO SERVER                    DOCTOR BROWSER
   │                                    │                                   │
   ├─ io('localhost:5000',             │                                   │
   │   { auth: { token } })            │                                   │
   │                                    │                                   │
   ├─ Send JWT Token ─────────────────►│                                   │
   │                                    │ Verify JWT                        │
   │                                    │ socket.user = decoded             │
   │                                    │                                   │
   │                                    │◄─ io('localhost:5000',           │
   │                                    │   { auth: { token } })           │
   │                                    │                                   │
   │                                    │ Verify JWT                        │
   │                                    │ socket.user = decoded             │
   │                                    │                                   │
   ├─ emit('join_video') ─────────────►│                                   │
   │ { videoSessionId: appt_789 }      │ socket.join('video_appt_789')    │
   │                                    │ notify other users in room        │
   │                                    ├─ emit('user_joined_video')────────┤
   │                                    │                                   │
   │                                    │                                   │
   │                                    │◄──── emit('join_video') ─────────┤
   │                                    │                                   │
   │                                    │ socket.join('video_appt_789')    │
   │                                    │ notify other users in room        │
   ├─ on('user_joined_video')◄──────────┤                                   │
   │ { userId: doctor_456 }             │ emit('user_joined_video')        │
   │                                    │                                   │
   │ [Now initiate WebRTC]              │                                   │
   │                                    │                                   │
   │◄─────── ROOM ESTABLISHED ─────────────────────────────────────────────┤
   │         video_appt_789                                                 │
   │         Both users ready for media                                     │
   │                                    │                                   │
   └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. WebRTC Connection Sequence

```
PATIENT'S BROWSER                          DOCTOR'S BROWSER

┌──────────────────┐                       ┌──────────────────┐
│ Create PeerConn  │                       │ Create PeerConn  │
│ with ICE Servers │                       │ with ICE Servers │
└────────┬─────────┘                       └──────────┬───────┘
         │                                            │
         ├─ STUN: stun.l.google.com                  │
         ├─ TURN: openrelay.metered.ca              │
         │                                            │
         │                                            │
Get Local Stream                            Get Local Stream
├─ getUserMedia()                          ├─ getUserMedia()
└─ { audio: true,                         └─ { audio: true,
    video: {1280x720} }                      video: {1280x720} }
         │                                            │
Add Tracks to PC                           Add Tracks to PC
├─ pc.addTrack(audioTrack)                ├─ pc.addTrack(audioTrack)
└─ pc.addTrack(videoTrack)                └─ pc.addTrack(videoTrack)
         │                                            │
         │ Listen for local ICE                      │
         ├─ pc.onicecandidate = (event)             │
         │                                            │
         │ Create Offer                               │
         ├─ const offer = await                      │
         │   pc.createOffer()                         │
         │                                            │
         ├─ pc.setLocalDescription(offer)           │
         │                                            │
         ├─ emit('webrtc_offer')───────────►        │
         │  { videoSessionId, offer }                │
         │                                    ├─ Receive Offer
         │                                    │
         │                                    ├─ pc.setRemoteDesc(offer)
         │                                    │
         │                                    ├─ Create Answer
         │                                    │  const answer = await
         │                                    │    pc.createAnswer()
         │                                    │
         │                                    ├─ pc.setLocalDescription(answer)
         │                                    │
         │                                    ├─ emit('webrtc_answer')
         │◄─────────────────────────────────┤  { videoSessionId, answer }
         │ Receive Answer
         │
         ├─ pc.setRemoteDescription(answer)
         │
         ├─ Connection negotiated!
         │
         │ Exchange ICE Candidates (many times)
         │
         ├─ onicecandidate events────────────►emit/receive ICE
         │                                    candidates
         │                                    multiple times
         │
         │                                    ◄─ onicecandidate events
         │
         │
         ├─ ontrack event fires
         │  Receive remote video/audio
         │
         ├─ remoteVideoRef.srcObject = 
         │  event.streams[0]
         │
         └─ CONNECTED! ✓──────────────────────────✓ CONNECTED!
            Remote video appears              Remote video appears
            Audio transmits both directions   Audio transmits both directions
```

---

## 4. Media Streaming Architecture

```
PATIENT'S SPEAKER SETUP              DOCTOR'S SPEAKER SETUP

Patient's Microphone                 Doctor's Microphone
├─ Captures voice                   ├─ Captures voice
└─ Audio Tracks (PCM)               └─ Audio Tracks (PCM)
        │                                    │
        ├─ Encode (OPUS Codec)              ├─ Encode (OPUS Codec)
        │                                   │
        ├─ RTP Packet                      ├─ RTP Packet
        │  [SRTP Encrypted]                │  [SRTP Encrypted]
        │                                   │
        ├─ Network Path                     ├─ Network Path
        │  ├─ Direct (if possible)         │  ├─ Direct (if possible)
        │  ├─ Via STUN                     │  ├─ Via STUN
        │  └─ Via TURN (fallback)         └─ Via TURN (fallback)
        │                                    │
        ↓                                    ↓
       ╔════════════════════════════════════╗
       ║   Direct P2P RTP Connection        ║
       ║   (Encrypted DTLS-SRTP)            ║
       ╚════════════════════════════════════╝
        │                                    │
        │                                    │
Doctor's Speakers                    Patient's Speakers
├─ Receive RTP packets              ├─ Receive RTP packets
├─ SRTP Decrypt                     ├─ SRTP Decrypt
├─ RTP Decode                       ├─ RTP Decode
├─ OPUS Decode                      ├─ OPUS Decode
├─ PCM Audio                        ├─ PCM Audio
└─ Output to speakers               └─ Output to speakers

VIDEO PATH (Same as above)
Patient's Camera ──RTP──► Doctor's Screen
Doctor's Camera  ──RTP──► Patient's Screen
```

---

## 5. Database Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                        USERS                                  │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ _id: ObjectId                                          │  │
│ │ firstName, lastName, email, role (patient/doctor)     │  │
│ │ passwordHash, isActive, createdAt                     │  │
│ └────────────────────────────────────────────────────────┘  │
└──────────┬───────────────────────────────────────────────────┘
           │
           ├──────────────────┬──────────────────┐
           │                  │                  │
           ↓                  ↓                  ↓
    ┌─────────────┐    ┌──────────────┐  ┌──────────────┐
    │  PATIENTS   │    │   DOCTORS    │  │ (Other Users)│
    ├─────────────┤    ├──────────────┤  └──────────────┘
    │ userId (FK) │    │ userId (FK)  │
    │ DOB, gender │    │ license      │
    │ history     │    │ specialist   │
    │ medications │    │ education    │
    │ allergies   │    │ ratings      │
    │ emergency   │    │ availability │
    └─────────────┘    └──────────────┘
           │                  │
           └──────────┬───────┘
                      │
                      ↓
         ┌───────────────────────────┐
         │    APPOINTMENTS           │
         ├───────────────────────────┤
         │ _id: ObjectId             │
         │ patientId (FK to Users)   │
         │ doctorId (FK to Users)    │
         │ appointmentDate           │
         │ duration, status          │
         │ videoSessionId (FK)       │
         │ chatSessionId (FK)        │
         │ createdAt                 │
         └───────────────────────────┘
            │                │
            ├────────┬───────┤
            │        │       │
            ↓        ↓       ↓
    ┌──────────────┐ │ ┌──────────────┐
    │VIDEO SESSION │ │ │CHAT SESSION  │
    ├──────────────┤ │ ├──────────────┤
    │ _id          │ │ │ _id          │
    │ status       │ │ │ messages[]   │
    │ quality      │ │ │   -senderId  │
    │ codecs       │ │ │   -message   │
    │ bandwidth    │ │ │   -timestamp │
    │ duration     │ │ │ summary      │
    │ startedAt    │ │ │ createdAt    │
    │ endedAt      │ │ └──────────────┘
    └──────────────┘ │
                     │
                     └─ (One-to-One)
                        (One Appointment)
                        (One Video Call)
                        (One Chat)
```

---

## 6. Video Call State Machine

```
                    ┌─────────────────────┐
                    │   NO CALL STATE     │
                    │                     │
                    │ • User logged in    │
                    │ • No call started   │
                    └────────────┬────────┘
                                 │
                    Click "Join Video Call"
                                 │
                                 ↓
                    ┌─────────────────────┐
                    │   CONNECTING STATE  │
                    │                     │
                    │ • Getting stream    │
                    │ • Socket.io joining │
                    │ • Creating PC       │
                    └────────────┬────────┘
                                 │
                    Both users joined room
                    WebRTC negotiating
                                 │
                                 ↓
                    ┌─────────────────────┐
                    │   CONNECTED STATE   │
                    │                     │
                    │ • Video showing     │
                    │ • Audio transmitting│
                    │ • Can mute/camera  │
                    │ • Can chat         │
                    └────────────┬────────┘
                                 │
                                 │ (Can toggle controls)
                                 │ • Mute ←→ Unmute
                                 │ • Camera ←→ Camera Off
                                 │
                    Click "End Call"
                                 │
                                 ↓
                    ┌─────────────────────┐
                    │   DISCONNECTING     │
                    │                     │
                    │ • Stop tracks       │
                    │ • Close peer conn   │
                    │ • Leave Socket room │
                    │ • Update database   │
                    └────────────┬────────┘
                                 │
                                 ↓
                    ┌─────────────────────┐
                    │   CALL ENDED STATE  │
                    │                     │
                    │ • Show summary      │
                    │ • Allow new calls   │
                    │ • Generate AI data  │
                    └─────────────────────┘
```

---

## 7. Message Flow Timing Diagram

```
TIME   PATIENT                  SOCKET.IO           DOCTOR
────────────────────────────────────────────────────────────
0ms    │                           │                   │
       ├─ join_video              │                   │
       ├──────────────────────────►│                   │
       │                           ├─ user_joined_video
       │                           ├──────────────────►│
       │                           │                   ├─ on received
       │
10ms   ├─ webrtc_offer             │
       ├──────────────────────────►│
       │                           ├─ webrtc_offer
       │                           ├──────────────────►│
       │                           │                   ├─ setRemote(offer)
       │                           │                   ├─ createAnswer
       │                           │                   │
20ms   │                           │◄──── webrtc_answer
       │                           │      ◄────────────┤
       │◄──────────────────────────┤
       ├─ setRemote(answer)        │
       │
30-100ms Rapid ICE candidate exchange (10-50 messages)
       ├───► ice_candidate ──────────►                │
       │                           ├───────────────►  │
       │                           │                   │
       │◄──────────────── ice_candidate               │
       │              ◄─────────────┤
       │
150ms  ┌──────────────────────────┐
       │ P2P CONNECTED            │
       │ RTP Streams Active       │
       │ Video & Audio Flowing    │
       └──────────────────────────┘
       │                           │                   │
       │                           │                   │
   (call duration)
       │                           │                   │
       ├─ toggle_audio             │                   │
       ├──────────────────────────►│                   │
       │                           ├─ user_toggled_audio
       │                           ├──────────────────►│
       │                           │                   │
       ├─ toggle_video             │                   │
       ├──────────────────────────►│                   │
       │                           ├─ user_toggled_video
       │                           ├──────────────────►│
       │                           │                   │
       ├─ end_video                │                   │
       ├──────────────────────────►│                   │
       │                           ├─ video_ended
       │                           ├──────────────────►│
       │                           │                   │
       └─ [Cleanup & Update DB]    └─ [Cleanup]       └─ [Cleanup]
```

---

## 8. Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
└─────────────────────────────────────────────────────────────┘

LAYER 1: HTTP/HTTPS
┌────────────────────────────────────────────────┐
│ Socket.io over Secure WebSocket (WSS)         │
│ CORS Configured (Frontend origin only)         │
└────────────────────────────────────────────────┘
                    │
                    ↓
LAYER 2: JWT Authentication
┌────────────────────────────────────────────────┐
│ Client sends JWT token in auth header          │
│ Server verifies signature using JWT_SECRET     │
│ If invalid: Reject connection                  │
│ If valid: Set socket.user = decoded payload    │
└────────────────────────────────────────────────┘
                    │
                    ↓
LAYER 3: Role-Based Access Control
┌────────────────────────────────────────────────┐
│ Patient can only:                              │
│ • View own data                                │
│ • Book appointments with doctors               │
│ • Join video calls for own appointments        │
│                                                 │
│ Doctor can only:                               │
│ • View own data                                │
│ • Accept/reject appointments                   │
│ • Join video calls for own appointments        │
└────────────────────────────────────────────────┘
                    │
                    ↓
LAYER 4: Appointment Verification
┌────────────────────────────────────────────────┐
│ Before joining video call:                     │
│ • Verify appointment exists                    │
│ • Verify user is patient OR doctor in appt     │
│ • Verify appointment status is confirmed       │
│ • Verify appointment time is current           │
└────────────────────────────────────────────────┘
                    │
                    ↓
LAYER 5: WebRTC Media Encryption
┌────────────────────────────────────────────────┐
│ DTLS-SRTP Encryption                           │
│ • All media encrypted in transit               │
│ • Keys exchanged via SRTP protocol             │
│ • Per-packet authentication                    │
│ • Perfect forward secrecy                      │
└────────────────────────────────────────────────┘
                    │
                    ↓
LAYER 6: Database Access Control
┌────────────────────────────────────────────────┐
│ MongoDB queries:                               │
│ • Only query user's own records                │
│ • Filter appointments by userID                │
│ • Only doctor can view own reviews             │
│ • Only patient can view own assessments        │
└────────────────────────────────────────────────┘
```

---

## 9. Deployment Architecture (For Production)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   User's Browser     │ ◄─ Hosted on Vercel/Netlify
│   (React Frontend)   │    https://mindbridgeai.com
└──────────┬───────────┘
           │
      HTTPS/WSS
           │
           ├─────────────────────────────────────┐
           │                                     │
           ↓                                     ↓
    ┌─────────────────┐              ┌─────────────────┐
    │ Express Backend │◄──────────┐  │ Socket.io Port  │
    │ (Node.js)       │           │  │ (Separate)      │
    │ Port 5000       │           │  │ Port 443        │
    └────────┬────────┘ CORS OK   └─────────────────┘
             │
             ├──────────────────────────────────┐
             │                                  │
             ↓                                  ↓
    ┌─────────────────────┐       ┌──────────────────┐
    │  MongoDB Atlas      │       │  TURN Server     │
    │  (Managed DB)       │       │  (Metered.ca)    │
    │  mongodb+srv://...  │       │  openrelay...    │
    └─────────────────────┘       └──────────────────┘
             │
             ├──────────────────────────────────┐
             │                                  │
             ↓                                  ↓
    ┌─────────────────────┐       ┌──────────────────┐
    │  Google STUN Servers│       │  Gemini API      │
    │  (Primary ICE)      │       │  (AI Summaries)  │
    │  stun.l.google...   │       │  generativeai... │
    └─────────────────────┘       └──────────────────┘

SSL/TLS Certificates: LetsEncrypt or similar
CDN: CloudFlare
Monitoring: Sentry, DataDog
Analytics: PostHog
```

---

## 10. Bandwidth & Performance

```
TYPICAL VIDEO CALL BANDWIDTH USAGE

┌────────────────────────────────────────┐
│  Scenario: 1-on-1 HD Video Call        │
│  Duration: 30 minutes                  │
└────────────────────────────────────────┘

Video Stream
├─ Codec: VP8 (adaptive)
├─ Resolution: 1280x720 (adjusts down if needed)
├─ Frame Rate: 30 fps
├─ Bitrate: 1.5-2.5 Mbps (per direction)
│
Audio Stream
├─ Codec: OPUS
├─ Sample Rate: 48kHz
├─ Bitrate: 32-128 kbps (per direction)
│
WebRTC Overhead
├─ RTP Headers: ~10-15 kbps
├─ RTCP Reports: ~5-10 kbps
└─ TCP/IP Headers: ~5%

TOTAL USAGE PER DIRECTION:
├─ Video: 1.5-2.5 Mbps
├─ Audio: 0.04-0.128 Mbps
└─ Overhead: ~100 kbps
   ═════════════════════
   1.6-2.7 Mbps per direction

FOR 30-MINUTE CALL:
├─ Upload: 1.6-2.7 Mbps × 1800 sec = ~360-600 MB
├─ Download: 1.6-2.7 Mbps × 1800 sec = ~360-600 MB
└─ Total: ~720-1200 MB (< 1.5 GB)

MINIMUM REQUIREMENTS:
├─ Upload: 3 Mbps (for 1080p)
├─ Download: 3 Mbps (for 1080p)
├─ Ping: < 100ms (latency)
└─ Packet Loss: < 1%

QUALITY ADAPTS:
├─ Good connection: 720p, 30 fps, full audio
├─ Fair connection: 480p, 15 fps, opus audio
└─ Poor connection: 360p, 15 fps, audio only

Socket.io Overhead (Signaling):
├─ Messages per call: ~50-200
├─ Avg message size: ~500 bytes
├─ Total: ~25-100 KB (negligible)
```

These diagrams provide a complete visual understanding of how MindBridge AI's video call system works!
