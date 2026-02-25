import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/authStore';
import io from 'socket.io-client';
import { createPeerConnection, getLocalStream, stopStream, toggleAudio, toggleVideo } from '../utils/webrtc';

export default function VideoCall() {
  const { appointmentId } = useParams();
  const { token } = useAuthStore();
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Get local stream
        const stream = await getLocalStream();
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const peerConnection = createPeerConnection();
        peerConnectionRef.current = peerConnection;

        // Add local stream tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit('webrtc_ice_candidate', {
              videoSessionId: appointmentId,
              candidate: event.candidate,
            });
          }
        };

        // Connect to Socket.io with error handling
        socketRef.current = io('http://localhost:5000', {
          auth: { token },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 10,
        });

        socketRef.current.on('connect', () => {
          console.log('[v0] Socket.io connected:', socketRef.current.id);
          socketRef.current.emit('join_video', {
            videoSessionId: appointmentId,
            role: 'user',
          });
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('[v0] Socket.io connection error:', error);
        });

        socketRef.current.on('disconnect', (reason) => {
          console.log('[v0] Socket.io disconnected:', reason);
        });

        socketRef.current.on('user_joined_video', async (data) => {
          console.log('[v0] Other user joined video:', data);
          try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log('[v0] Sending WebRTC offer');
            socketRef.current.emit('webrtc_offer', {
              videoSessionId: appointmentId,
              offer,
            });
          } catch (error) {
            console.error('[v0] Error creating offer:', error);
          }
        });

        socketRef.current.on('webrtc_offer', async (data) => {
          console.log('[v0] Received WebRTC offer from:', data.from);
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            console.log('[v0] Sending WebRTC answer');
            socketRef.current.emit('webrtc_answer', {
              videoSessionId: appointmentId,
              answer,
            });
          } catch (error) {
            console.error('[v0] Error handling offer:', error);
          }
        });

        socketRef.current.on('webrtc_answer', async (data) => {
          console.log('[v0] Received WebRTC answer from:', data.from);
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log('[v0] WebRTC connection established');
          } catch (error) {
            console.error('[v0] Error handling answer:', error);
          }
        });

        socketRef.current.on('webrtc_ice_candidate', async (data) => {
          try {
            console.log('[v0] Adding ICE candidate');
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (error) {
            console.error('[v0] Error adding ICE candidate:', error);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize call:', error);
        setLoading(false);
      }
    };

    initializeCall();

    return () => {
      if (localStreamRef.current) {
        stopStream(localStreamRef.current);
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [appointmentId, token]);

  const handleToggleAudio = () => {
    if (localStreamRef.current) {
      console.log('[v0] Toggling audio:', !isAudioOn ? 'ON' : 'OFF');
      toggleAudio(localStreamRef.current, !isAudioOn);
      setIsAudioOn(!isAudioOn);
      socketRef.current?.emit('toggle_audio', {
        videoSessionId: appointmentId,
        enabled: !isAudioOn,
      });
    }
  };

  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      console.log('[v0] Toggling video:', !isVideoOn ? 'ON' : 'OFF');
      toggleVideo(localStreamRef.current, !isVideoOn);
      setIsVideoOn(!isVideoOn);
      socketRef.current?.emit('toggle_video', {
        videoSessionId: appointmentId,
        enabled: !isVideoOn,
      });
    }
  };

  const handleEndCall = () => {
    console.log('[v0] Ending video call');
    socketRef.current?.emit('end_video', {
      videoSessionId: appointmentId,
    });
    if (localStreamRef.current) {
      stopStream(localStreamRef.current);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Initializing video call...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900">
            {/* Local Video */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                You
              </div>
            </div>

            {/* Remote Video */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                Therapist
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-6 flex justify-center gap-6">
            <button
              onClick={handleToggleAudio}
              className={`p-4 rounded-full transition ${
                isAudioOn
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isAudioOn ? 'Mute' : 'Unmute'}
            >
              {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={handleToggleVideo}
              className={`p-4 rounded-full transition ${
                isVideoOn
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isVideoOn ? 'Stop Camera' : 'Start Camera'}
            >
              {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
              title="End Call"
            >
              <Phone size={24} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
