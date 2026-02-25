// WebRTC Configuration and Utilities
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
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
