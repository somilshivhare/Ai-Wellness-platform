# Socket.io Message Flow: Patient ↔ Doctor Video Call

## Connection Sequence Diagram

```
TIME    PATIENT BROWSER              SOCKET.IO SERVER              DOCTOR BROWSER
───────────────────────────────────────────────────────────────────────────────────

0.0s    Connect with JWT token
        socket = io('localhost:5000',   
        { auth: { token: '...' } })
        
        Server receives connection
        Verifies JWT                ──────────────────────────►  
        socket.user = patient_123
        
1.0s                                                             Doctor accesses
                                                                 dashboard
                                                                 Patient booked
                                                                 appointment

2.0s    Click "Join Video"
        emit('join_video', {
          videoSessionId: appt_789,
          role: 'patient'
        })                          ──────────────────────────►
                                    
                                    socket.join('video_appt_789')
                                    Room created
                                    socket.to(room).emit(
                                      'user_joined_video'
                                    )
                                    ◄── (no one in room yet)

2.5s                                                             Click "Join Video"
                                                                 Connect with JWT
                                                                 
                                                                 socket = io(...)
                                                                 emit('join_video')
                                                                 ──────────────────────────►
                                    
                                    socket.join('video_appt_789')
                                    socket.to(room).emit(
                                      'user_joined_video',
                                      { userId: doctor_456 }
                                    )
                                    ◄──────────────────────────

3.0s    on('user_joined_video')
        Doctor joined! Create offer
        
        const offer = await pc.createOffer()
        pc.setLocalDescription(offer)
        
        emit('webrtc_offer', {
          videoSessionId: appt_789,
          offer: {...SDP...}
        })                          ──────────────────────────►
                                    
                                    socket.to(room).emit(
                                      'webrtc_offer',
                                      { offer, from: patient_123 }
                                    )
                                    ◄──────────────────────────

3.2s                                                             on('webrtc_offer')
                                                                 Received offer from Alice
                                                                 
                                                                 pc.setRemoteDescription(offer)
                                                                 const answer = 
                                                                   await pc.createAnswer()
                                                                 pc.setLocalDescription(answer)
                                                                 
                                                                 emit('webrtc_answer', {
                                                                   videoSessionId: appt_789,
                                                                   answer: {...SDP...}
                                                                 })
                                                                 ──────────────────────────►
                                    
                                    socket.to(room).emit(
                                      'webrtc_answer',
                                      { answer, from: doctor_456 }
                                    )
                                    ◄──────────────────────────

3.4s    on('webrtc_answer')
        Received answer from Bob
        
        pc.setRemoteDescription(answer)
        ✓ Connection ready!
        
        Gathering ICE candidates...
        
        onicecandidate = (event) => {
          emit('webrtc_ice_candidate', {
            videoSessionId: appt_789,
            candidate: event.candidate
          })
        }                           ──────────────────────────►
        (multiple candidates sent)  
                                    ◄─── (Doctor also sending ICE)

3.5s    on('webrtc_ice_candidate')
        ──────────────────────────►  socket.to(room).emit(
                                      'webrtc_ice_candidate',
                                      { candidate, from }
                                    )
                                    ◄──────────────────────────

4.0s    pc.ontrack = (event) => {
          remoteVideoRef.current
            .srcObject = event.streams[0]
        }                           
        ✓ Remote video visible!
        ═══════════════════════════════════════════════════════
        VIDEO/AUDIO FLOWING DIRECTLY P2P (Not through server)
        ═══════════════════════════════════════════════════════

        [RTP Media Streams]
        Alice's mic ─────────────────────────────► Bob's speaker
        Alice's camera ─────────────────────────► Bob's display
        Bob's mic ──────────────────────────────► Alice's speaker
        Bob's camera ─────────────────────────► Alice's display

5.0s    Alice clicks MUTE button
        emit('toggle_audio', {
          videoSessionId: appt_789,
          enabled: false
        })                          ──────────────────────────►
                                    
                                    socket.to(room).emit(
                                      'user_toggled_audio',
                                      { userId: patient_123,
                                        enabled: false }
                                    )
                                    ◄──────────────────────────

5.1s                                                             on('user_toggled_audio')
                                                                 Display "Alice is muted"
                                                                 indicator

6.0s    Alice clicks END CALL
        emit('end_video', {
          videoSessionId: appt_789
        })                          ──────────────────────────►
                                    
                                    VideoSession.updateOne({
                                      status: 'completed',
                                      endedAt: new Date()
                                    })
                                    
                                    io.to(room).emit(
                                      'video_ended',
                                      { userId: patient_123 }
                                    )
                                    ◄──────────────────────────

6.1s    video_ended event received
        Cleanup:
        - Close peer connection
        - Stop all tracks
        - Leave Socket.io room
        
        Show "Call ended" message
                                                                 video_ended event
                                                                 Cleanup & show
                                                                 "Call ended"

6.5s    Show "Generate Summary"
        Button appears after call
                                                                 Same on doctor side
```

---

## Message Details

### 1. Authentication (Connection)

**Patient Browser Sends:**
```javascript
socket = io('http://localhost:5000', {
  auth: { 
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwYXRpZW50XzEyMyIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNzExMzI1NjAwfQ.xY9z...'
  }
})
```

**Backend Middleware:**
```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = {
      id: 'patient_123',
      role: 'patient',
      email: 'alice@example.com',
      iat: 1711325600
    };
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});
```

---

### 2. Join Video Room

**Patient Emits:**
```javascript
emit('join_video', {
  videoSessionId: 'appt_789',
  role: 'patient'
})
```

**Server Receives & Processes:**
```javascript
socket.on('join_video', (data) => {
  const roomName = `video_${data.videoSessionId}`; // video_appt_789
  socket.join(roomName);
  
  console.log(`[Socket.io] patient_123 joined video_appt_789`);
  
  // Notify other users already in room
  socket.to(roomName).emit('user_joined_video', {
    userId: socket.user.id,        // patient_123
    role: data.role,               // patient
    timestamp: new Date()
  });
});
```

**Doctor (if already in room) Receives:**
```javascript
socket.on('user_joined_video', (data) => {
  console.log(`${data.role} joined: ${data.userId}`);
  // Update UI: "Patient is here, initiate video call"
});
```

---

### 3. WebRTC Offer (Initiator → Answerer)

**Patient Creates & Sends Offer:**
```javascript
const offer = await peerConnection.createOffer({
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
});

await peerConnection.setLocalDescription(offer);

socket.emit('webrtc_offer', {
  videoSessionId: 'appt_789',
  offer: {
    type: 'offer',
    sdp: 'v=0\r\no=- 12345 2 IN IP4 127.0.0.1\r\n...' // Contains codec info, keys
  }
});
```

**Server Forwards to Doctor:**
```javascript
socket.on('webrtc_offer', (data) => {
  const roomName = `video_${data.videoSessionId}`;
  
  socket.to(roomName).emit('webrtc_offer', {
    offer: data.offer,           // SDP object
    from: socket.user.id,        // patient_123
    timestamp: new Date()
  });
});
```

**Doctor Receives Offer:**
```javascript
socket.on('webrtc_offer', async (data) => {
  console.log(`Offer from: ${data.from}`);
  
  // Set remote description
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
  
  // Create answer
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  
  // Send answer back
  socket.emit('webrtc_answer', {
    videoSessionId: 'appt_789',
    answer: answer
  });
});
```

---

### 4. WebRTC Answer (Answerer → Initiator)

**Doctor Sends Answer:**
```javascript
emit('webrtc_answer', {
  videoSessionId: 'appt_789',
  answer: {
    type: 'answer',
    sdp: 'v=0\r\no=- 67890 2 IN IP4 192.168.1.50\r\n...'
  }
})
```

**Server Forwards to Patient:**
```javascript
socket.on('webrtc_answer', (data) => {
  const roomName = `video_${data.videoSessionId}`;
  
  socket.to(roomName).emit('webrtc_answer', {
    answer: data.answer,         // SDP object
    from: socket.user.id,        // doctor_456
    timestamp: new Date()
  });
});
```

**Patient Receives Answer:**
```javascript
socket.on('webrtc_answer', async (data) => {
  console.log(`Answer from: ${data.from}`);
  
  // Set remote description
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );
  
  console.log('Connection negotiation complete');
  // Video should start showing now
});
```

---

### 5. ICE Candidates (Multiple, rapid)

**Patient Sends ICE Candidate:**
```javascript
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('webrtc_ice_candidate', {
      videoSessionId: 'appt_789',
      candidate: {
        candidate: 'candidate:842163053 1 udp 1677729535 203.0.113.45 54321 typ srflx raddr 192.168.1.100 rport 54321 generation 0 ufrag abc123 pwd xyz789==',
        sdpMLineIndex: 0,
        sdpMid: 'video'
      }
    });
  }
};
```

**Server Forwards (Many Times):**
```javascript
socket.on('webrtc_ice_candidate', (data) => {
  const roomName = `video_${data.videoSessionId}`;
  
  socket.to(roomName).emit('webrtc_ice_candidate', {
    candidate: data.candidate,   // ICE candidate
    from: socket.user.id,
    index: data.candidate.sdpMLineIndex,
    timestamp: new Date()
  });
});
```

**Doctor Receives & Adds:**
```javascript
socket.on('webrtc_ice_candidate', async (data) => {
  try {
    await peerConnection.addIceCandidate(
      new RTCIceCandidate(data.candidate)
    );
    console.log('ICE candidate added');
  } catch (error) {
    console.error('Failed to add ICE candidate:', error);
  }
});

// This happens 10-50 times as candidates are gathered
```

---

### 6. Mute/Unmute

**Patient Clicks Mute:**
```javascript
socket.emit('toggle_audio', {
  videoSessionId: 'appt_789',
  enabled: false  // Microphone OFF
});
```

**Server Notifies Doctor:**
```javascript
socket.on('toggle_audio', (data) => {
  const roomName = `video_${data.videoSessionId}`;
  
  socket.to(roomName).emit('user_toggled_audio', {
    userId: socket.user.id,      // patient_123
    enabled: data.enabled,       // false
    timestamp: new Date()
  });
});
```

**Doctor Sees Notification:**
```javascript
socket.on('user_toggled_audio', (data) => {
  const status = data.enabled ? 'ON' : 'OFF';
  console.log(`Patient audio: ${status}`);
  // Update UI: Show mute badge/indicator
});
```

---

### 7. End Call

**Patient or Doctor Clicks End Call:**
```javascript
socket.emit('end_video', {
  videoSessionId: 'appt_789'
});
```

**Server Updates Database & Notifies:**
```javascript
socket.on('end_video', async (data) => {
  const { videoSessionId } = data;
  const roomName = `video_${videoSessionId}`;
  
  // Update database
  await VideoSession.findByIdAndUpdate(videoSessionId, {
    status: 'completed',
    endedAt: new Date(),
    duration: calculateDuration(startTime, endTime)
  });
  
  // Notify both users
  io.to(roomName).emit('video_ended', {
    userId: socket.user.id,
    timestamp: new Date()
  });
  
  // Remove users from room
  socket.leave(roomName);
});
```

**Both Browsers Receive:**
```javascript
socket.on('video_ended', (data) => {
  console.log(`Call ended by ${data.userId}`);
  
  // Cleanup
  peerConnection.close();
  localStream.getTracks().forEach(track => track.stop());
  socket.leave(`video_${videoSessionId}`);
  
  // Show call ended screen
  // Show "Generate Summary" button
});
```

---

## Key Points

1. **Room Isolation**: Only 2 users per room (appointment-based)
2. **JWT Auth**: Every connection verified
3. **Offer/Answer**: Patient initiates, Doctor responds
4. **ICE Candidates**: Multiple candidates for best connection path
5. **Media Flow**: Direct P2P after handshake (not through server)
6. **Control Messages**: All mute/video/end commands via Socket.io

## Total Messages Per Call

- 1x Authentication
- 2x Join Video
- 1x Offer
- 1x Answer
- 10-50x ICE Candidates (depends on network)
- 10-100x Mute/Video Toggle (user controlled)
- 1x End Call
- **Total: ~25-250 messages depending on call duration**
