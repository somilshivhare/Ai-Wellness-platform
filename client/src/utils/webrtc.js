// WebRTC Configuration and Utilities
// Free STUN/TURN servers for demo and testing
const ICE_SERVERS = {
  iceServers: [
    // Google's free STUN servers (primary)
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    
    // Free TURN servers (OpenRelay by Metered.ca)
    // Works great for NAT traversal, completely free
    {
      urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443'],
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: ['turn:openrelay.metered.ca:80?transport=udp', 'turn:openrelay.metered.ca:443?transport=tcp'],
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

export const createPeerConnection = () => {
  const peerConnection = new RTCPeerConnection({
    iceServers: ICE_SERVERS.iceServers,
  });

  return peerConnection;
};

export const getLocalStream = async (options = {}) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: options.video !== false ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      audio: options.audio !== false,
    });
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
};

export const stopStream = (stream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

export const toggleAudio = (stream, enabled) => {
  stream.getAudioTracks().forEach((track) => {
    track.enabled = enabled;
  });
};

export const toggleVideo = (stream, enabled) => {
  stream.getVideoTracks().forEach((track) => {
    track.enabled = enabled;
  });
};
