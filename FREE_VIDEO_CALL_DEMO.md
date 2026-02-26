# Free WebRTC Video Call Demo - MindBridge AI

## Quick Start (5 minutes)

### Scenario 1: Local Network Demo (Best for Showcase)

This is the easiest and works perfectly for demonstrating locally.

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd server
npm run dev
# Should show: ✓ Server running on port 5000

# Terminal 3: Start Frontend  
cd client
npm run dev
# Should show: ➜ Local: http://localhost:5173/
```

### Testing Steps

**User A (Patient - Browser Tab 1):**
1. Go to http://localhost:5173
2. Click "Get Started" → Sign Up
3. Enter: email: `alice@test.com`, password: `test123`
4. Select **Patient** role
5. Complete profile

**User B (Doctor - Browser Tab 2):**
1. Go to http://localhost:5173 (separate tab/window)
2. Click "Get Started" → Sign Up  
3. Enter: email: `bob@test.com`, password: `test123`
4. Select **Therapist** role
5. Complete profile with specialization (e.g., "Therapist")

**Patient Books Appointment:**
1. Alice (Patient) clicks "Find Doctors"
2. Finds Bob's profile
3. Clicks "View Profile" → "Book Appointment"
4. Selects date/time → Confirms booking

**Start Video Call:**
1. Both users see appointment in dashboard
2. At scheduled time, click "Join Video Call"
3. Grant camera/microphone permissions
4. Video call starts!

**Features to Test:**
- Mute/Unmute audio (microphone button)
- Turn camera on/off (video button)  
- See both video streams
- End call (phone button)

---

## Scenario 2: Remote Testing (Using ngrok - Free)

For testing with someone remotely without expensive servers.

### Setup ngrok (Free Tier)

```bash
# Install ngrok globally
npm install -g ngrok

# OR download from https://ngrok.com/download (free account required)
```

### Expose Services

```bash
# Terminal 4: Expose Backend
ngrok http 5000
# Copy the URL: https://abc123.ngrok.io

# Terminal 5: Expose Frontend (in another terminal)
ngrok http 5173
# Copy the URL: https://xyz789.ngrok.io
```

### Update Frontend

```bash
# Edit client/.env
VITE_API_BASE_URL=https://abc123.ngrok.io/api

# Restart frontend
cd client
npm run dev
```

### Share with Someone

1. Share your ngrok frontend URL: `https://xyz789.ngrok.io`
2. You use: `http://localhost:5173` (Patient)
3. They use: `https://xyz789.ngrok.io` (Doctor)
4. Same login/booking flow as above

---

## Scenario 3: Multiple Tabs on Same Machine

Simplest way to verify the feature works.

```bash
# With servers running (localhost:5000 and 5173)

# Tab 1: http://localhost:5173 → Sign up as Patient
# Tab 2: http://localhost:5173 → Sign up as Doctor

# Patient books → Both join call → Instant testing!
```

---

## Free ICE Servers Used

The platform automatically uses these free servers (no configuration needed):

### STUN Servers (Primary - Works 80% of time)
- Google STUN (free, no authentication)
  - stun.l.google.com:19302
  - stun1.l.google.com:19302
  - stun2.l.google.com:19302
  - stun3.l.google.com:19302
  - stun4.l.google.com:19302

### TURN Servers (Fallback - Works 100% of time)
- OpenRelay by Metered.ca (completely free)
  - openrelay.metered.ca:80
  - openrelay.metered.ca:443
  - Username: `openrelayproject`
  - Password: `openrelayproject`
  - No rate limits for demo/development

---

## Troubleshooting

### "No camera/microphone access"
- Browser needs camera/mic permissions
- Click "Allow" when browser prompts
- Check System Settings → Privacy → Camera/Microphone

### "Video doesn't work on remote connection"
- Make sure ngrok URLs are correctly set in `.env`
- Restart frontend after env changes
- Check browser console for errors

### "Can't connect to other user"
- Verify Socket.io is running on backend
- Check browser console for connection logs
- Ensure both users joined the same appointment

### "Audio/Video stutters"
- Check internet connection speed
- Lower video quality (resolution auto-adjusts)
- Close other bandwidth-heavy apps
- Move closer to WiFi router

### "Connection keeps dropping"
- Free TURN servers may have occasional issues
- Refresh page and rejoin
- Try local network (same WiFi) for stability

---

## Video Call Statistics

Monitor real-time connection quality:

```javascript
// Add to VideoCall.jsx to see stats
peerConnection.getStats().then(report => {
  report.forEach(stat => {
    if (stat.type === 'inbound-rtp') {
      console.log('Bitrate:', stat.bytesReceived);
      console.log('Packets Lost:', stat.packetsLost);
    }
  });
});
```

---

## Production Upgrade Path

When ready to deploy with real money (optional):

| Feature | Free Option | Paid Option | Cost |
|---------|------------|-------------|------|
| STUN | Google (works) | Twilio | Free |
| TURN | OpenRelay (limited) | Metered.ca | $3-5/month |
| TURN | Self-hosted | AWS | $10-50/month |
| Recording | Client-side only | AWS S3 | $0.023/GB |
| Advanced Stats | Browser stats | Metered Analytics | Custom pricing |

---

## Key Files Modified

- `client/src/utils/webrtc.js` - Added free TURN servers
- `client/src/pages/VideoCall.jsx` - Video call UI
- `server/server.js` - Socket.io signaling
- `server/models/VideoSession.js` - Session storage

---

## Demo Script (1 Hour)

Perfect for showing investors/users:

1. **Homepage Demo (5 min)**
   - Show landing page features
   - Explain the platform mission

2. **Authentication (5 min)**
   - Sign up as patient
   - Sign up as therapist
   - Show role-based differentiation

3. **Doctor Discovery (10 min)**
   - Show doctors listing
   - Filter by specialization
   - View doctor profile

4. **Booking (5 min)**
   - Select appointment time
   - Confirm booking
   - Show in dashboard

5. **Video Call (20 min)**
   - Join call from both sides
   - Test mute/camera toggle
   - Show smooth video stream
   - Demonstrate end call

6. **Chat & Summary (10 min)**
   - Show real-time chat (if implemented)
   - Generate AI summary
   - Download summary PDF

---

## Cost Analysis for Showcase

**Free tier costs:** $0
- Google STUN: Free forever
- OpenRelay TURN: Free forever
- Socket.io: Free (self-hosted)
- MongoDB: Free tier (500MB)
- Frontend: Free (localhost)
- Backend: Free (localhost)

**Total: $0 for local demo**

---

## Next Steps

1. Run the 3 terminals (MongoDB, Backend, Frontend)
2. Open 2 browser tabs
3. Sign up patient + doctor
4. Book appointment
5. Join video call
6. Test all features
7. Share ngrok URL with others to test remote

Enjoy the free video calling! 🎥

