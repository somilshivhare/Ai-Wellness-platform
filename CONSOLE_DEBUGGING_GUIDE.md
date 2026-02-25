# Console Debugging Guide: Understanding the Logs

When you open the browser console during a video call, you'll see detailed `[v0]` logs showing exactly what's happening. This guide explains each log message.

---

## What to Watch In Console

### 1. Connection Phase (First 1-2 seconds)

```javascript
[v0] Socket.io connected: socket_id_abc123
```
✅ **Meaning**: Socket.io connection established to backend
**What it means**: The WebSocket connection was successful, JWT was verified, user authenticated

---

### 2. Room Joining Phase

```javascript
[v0] Joining video room: video_appt_789
```
✅ **Meaning**: Socket.io joining the appointment's video room
**What it means**: This user is now in the room waiting for the other person

```javascript
[v0] Getting local stream...
```
✅ **Meaning**: Requesting camera and microphone access
**What it means**: Browser is asking for permissions to access hardware

---

### 3. Peer Connection Setup

```javascript
[v0] PeerConnection created with ICE servers
```
✅ **Meaning**: WebRTC peer connection initialized with STUN/TURN servers
**What it means**: Ready to establish direct connection with other user

---

### 4. Other User Joins (Key Event!)

```javascript
[v0] Other user joined video: { userId: doctor_456, role: 'doctor' }
```
✅ **Meaning**: The other person is now in the video room
**What it means**: WebRTC handshake can now begin

```javascript
[v0] Creating WebRTC offer...
[v0] Sending WebRTC offer
```
✅ **Meaning**: Creating SDP offer (local session description)
**What it means**: First person is initiating the WebRTC connection

---

### 5. Offer/Answer Exchange (Most Critical!)

```javascript
[v0] Received WebRTC offer from: patient_123
```
✅ **Meaning**: Received offer from the other person
**What it means**: Now need to create an answer

```javascript
[v0] Setting remote description (offer)
[v0] Creating WebRTC answer...
[v0] Sending WebRTC answer
```
✅ **Meaning**: Creating SDP answer in response
**What it means**: Sending back agreement to connect

```javascript
[v0] Received WebRTC answer from: doctor_456
[v0] WebRTC connection established ✓
```
✅ **Meaning**: Connection negotiation complete!
**What it means**: Both sides agreed on connection parameters (codecs, encryption, etc.)

---

### 6. ICE Candidate Exchange (Rapid Messages)

```javascript
[v0] Adding ICE candidate
```
✅ **Meaning**: Adding a possible network path for connection
**What it means**: (Multiple messages) Testing different routes (direct, via STUN, via TURN)

```javascript
[v0] ICE connection established
```
✅ **Meaning**: Best network path found and connected
**What it means**: Now on the optimal route (direct P2P or through relay)

---

### 7. Media Streaming Active (No logs expected!)

```
[Video appears on screen]
[Audio can be heard]
```
✅ **Meaning**: Video/audio flowing directly P2P
**What it means**: Call is active! No server involvement for media.

---

### 8. Control Messages (During Call)

```javascript
[v0] Toggling audio: OFF
```
✅ **Meaning**: Microphone turned off
**What it means**: Other person is now muted

```javascript
[v0] Toggling audio: ON
```
✅ **Meaning**: Microphone turned back on
**What it means**: Other person can hear you again

```javascript
[v0] Toggling video: OFF
```
✅ **Meaning**: Camera turned off
**What it means**: Other person sees black screen

```javascript
[v0] Toggling video: ON
```
✅ **Meaning**: Camera turned back on
**What it means**: Other person sees your video again

---

### 9. Call Ending

```javascript
[v0] Ending video call
```
✅ **Meaning**: Call terminated
**What it means**: Next: cleanup and database update

---

## Error Messages & What They Mean

### Socket.io Errors

```javascript
[v0] Socket.io connection error: Invalid token
```
❌ **Problem**: JWT token not recognized
**Solution**: 
- Refresh page and login again
- Check browser cookies for token
- Verify backend is running

```javascript
[v0] Socket.io disconnected: Server went away
```
❌ **Problem**: Backend crashed or stopped
**Solution**: 
- Restart backend: `cd server && npm run dev`
- Check terminal for error messages

```javascript
[v0] Socket.io disconnected: Network error
```
❌ **Problem**: Network connectivity issue
**Solution**:
- Check internet connection
- Try refreshing page
- Check if backend port 5000 accessible

### WebRTC Errors

```javascript
[v0] Error creating offer: ...
```
❌ **Problem**: Can't create WebRTC offer
**Solution**:
- Check camera permissions
- Browser might not support WebRTC
- Try Chrome/Firefox/Edge instead

```javascript
[v0] Error adding ICE candidate: ...
```
❌ **Problem**: Network issue during ICE gathering
**Solution**:
- Usually temporary - retries automatically
- Could indicate restrictive firewall
- TURN server will handle it

```javascript
[v0] Error handling offer: ...
```
❌ **Problem**: Offer was malformed or invalid
**Solution**:
- Very rare - usually network glitch
- Try refreshing page

### Media Errors

```
Camera shows black screen
```
❌ **Problem**: Camera permission not granted
**Solution**:
- Click browser permission prompt
- Check Settings → Privacy → Camera
- Verify no other app using camera
- Restart browser

```
No audio
```
❌ **Problem**: Microphone not accessible
**Solution**:
- Check Settings → Privacy → Microphone
- Verify microphone not muted in OS
- Check volume not at 0
- Try different microphone

---

## Expected Console Output Sequence

Here's what a successful call should show:

```
[PHASE 1: Connection]
[v0] Socket.io connected: socket_123456

[PHASE 2: Setup]
[v0] Joining video room: video_appt_789
[v0] Getting local stream...
[v0] PeerConnection created with ICE servers

[PHASE 3: Wait for other user]
... (might be silent for a few seconds) ...

[PHASE 4: Other user joins]
[v0] Other user joined video: { userId: doctor_456, role: 'doctor' }

[PHASE 5: WebRTC Handshake]
[v0] Creating WebRTC offer...
[v0] Sending WebRTC offer
[v0] Received WebRTC answer from: doctor_456
[v0] WebRTC connection established ✓

[PHASE 6: ICE Gathering]
[v0] Adding ICE candidate (multiple times)
[v0] ICE connection established

[PHASE 7: Call Active]
[Video/Audio streaming - no logs expected]

[PHASE 8: Control]
[v0] Toggling audio: OFF
[v0] Toggling video: OFF
[v0] Toggling audio: ON
[v0] Toggling video: ON

[PHASE 9: End Call]
[v0] Ending video call
```

---

## Monitoring Backend Console

While frontend shows `[v0]` logs, backend shows Socket.io events:

```
[Socket.io] patient_123 joined video_appt_789
[Socket.io] doctor_456 joined video_appt_789
[Socket.io] Offer/Answer messages flowing
[Socket.io] Video session: video_appt_789 completed
```

---

## Network Tab Inspection

In DevTools → Network tab, watch for:

**Socket.io Messages:**
- Type: `websocket`
- URL: `ws://localhost:5000/socket.io/?...`
- Status: `101 Switching Protocols` (WebSocket)

**WebRTC Media (shows in graphs):**
- Not visible as HTTP requests
- Check Network → RTC tab (in Chrome)
- Look at upload/download rates

---

## Performance Monitoring

In DevTools → Performance tab:

**Good Connection Indicators:**
- Video frame rate: 24-30 fps
- CPU usage: < 30%
- Memory stable: No increasing trend

**Poor Connection Indicators:**
- Video stuttering
- Frame drops < 15 fps
- High CPU (> 80%)
- Memory growing continuously

---

## Common Scenarios & What to Expect

### Scenario 1: Fast Network (Ideal)

```javascript
[v0] Socket.io connected: socket_123456
[v0] Joining video room: video_appt_789
[v0] Other user joined video: {...}
[v0] Creating WebRTC offer...
[v0] Received WebRTC answer from: ...
[v0] WebRTC connection established ✓
[v0] Adding ICE candidate
[v0] Adding ICE candidate (2-3 times)
[v0] ICE connection established
[Video shows immediately]
```
✅ **Expected**: Direct P2P connection (STUN successful)

---

### Scenario 2: Restrictive Network (Corporate Firewall)

```javascript
[v0] Socket.io connected: socket_123456
[v0] Joining video room: video_appt_789
[v0] Other user joined video: {...}
[v0] Creating WebRTC offer...
[v0] Received WebRTC answer from: ...
[v0] WebRTC connection established ✓
[v0] Adding ICE candidate (5-10 times)
[v0] Adding ICE candidate (via relay...)
[v0] ICE connection established
[Video shows after slight delay]
```
✅ **Expected**: TURN relay fallback (OpenRelay used)

---

### Scenario 3: Network Interruption During Call

```javascript
[Video/Audio fine]
[Network drops for 2 seconds]
[v0] Socket.io disconnected: Network error
[v0] Socket.io reconnecting...
[v0] Socket.io connected: socket_654321
[v0] Adding ICE candidate
[Video/Audio resumes]
```
✅ **Expected**: Automatic reconnection (WebRTC handles it)

---

## Debugging Checklist

Use this to troubleshoot issues:

```
☐ Both users see [v0] logs?
  → Yes: Socket.io working
  → No: Check backend is running

☐ Both show "Other user joined"?
  → Yes: Both in room
  → No: One user click Join Video yet?

☐ "WebRTC connection established ✓" appears?
  → Yes: Offer/answer working
  → No: WebRTC handshake failed

☐ "ICE connection established" appears?
  → Yes: Connection path found
  → No: Firewall issue (TURN should help)

☐ Video appears on screen?
  → Yes: Everything working!
  → No: Media streaming issue

☐ Audio transmits?
  → Yes: Perfect!
  → No: Microphone permissions issue

☐ Mute button works?
  → Yes: Controls working
  → No: Socket.io control channel issue

☐ End call works?
  → Yes: All features functional!
  → No: Cleanup issue
```

---

## Pro Debugging Tips

1. **Keep console visible**: Press F12 while on call
2. **Check timestamp**: [v0] logs show order of events
3. **Look for patterns**: Successful calls follow predictable pattern
4. **Monitor both browsers**: Compare logs side-by-side
5. **Save logs**: Copy console and save for debugging
6. **Check backend**: Backend console shows socket events
7. **Network tab**: Watch WebSocket and RTC stats

---

## Real Demo Walkthrough with Logs

```javascript
// PATIENT BROWSER CONSOLE

[v0] Socket.io connected: socket_patient_abc
[v0] Joining video room: video_appt_789
[v0] Getting local stream...
[v0] PeerConnection created with ICE servers

// ... waiting for doctor to join ...

[v0] Other user joined video: { userId: doctor_456, role: 'doctor' }
[v0] Creating WebRTC offer...
[v0] Sending WebRTC offer
[v0] Received WebRTC answer from: doctor_456
[v0] WebRTC connection established ✓
[v0] Adding ICE candidate
[v0] Adding ICE candidate
[v0] Adding ICE candidate
[v0] ICE connection established

// Video appears on both screens!

// Patient mutes
[v0] Toggling audio: OFF

// Doctor sees patient is muted (his console shows):
// [v0] User toggled audio: OFF

// Patient unmutes
[v0] Toggling audio: ON

// Doctor toggles camera off
[v0] Toggling video: OFF

// Patient sees doctor's video gone (his console shows):
// [v0] User toggled video: OFF

// After 5 minutes, patient ends call
[v0] Ending video call

// Doctor sees call ended (his console shows):
// [v0] Video ended

// Database updated, AI summary generated
// "Generate Summary" button appears
```

---

## Summary

**Good signs:**
- ✅ Socket.io connected
- ✅ Both users joined room
- ✅ Offer/Answer messages exchanged
- ✅ ICE connection established
- ✅ Video/Audio streams active

**Bad signs:**
- ❌ Socket.io connection error
- ❌ Only one user in room
- ❌ No WebRTC connection established
- ❌ ICE candidates failing
- ❌ No video/audio appearing

Use this guide to monitor your video calls and understand exactly what's happening under the hood!
