import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';

const SERVER_URL = 'https://localhost:8181';

const VideoCall = () => {
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState(null);
    const [roomId, setRoomId] = useState(searchParams.get('roomId') || '');
    const [isJoined, setIsJoined] = useState(false);
    const [callStatus, setCallStatus] = useState('Idle');
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoStopped, setIsVideoStopped] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(new MediaStream());
    const pendingIceCandidatesRef = useRef([]);
    const hasSentOfferRef = useRef(false);
    const isJoinedRef = useRef(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const token = localStorage.getItem('token');
        socketRef.current = io(SERVER_URL, {
            transports: ['websocket'],
            auth: {
                token,
                userId: user.id,
                userName: user.email
            }
        });

        socketRef.current.on('connect_error', (err) => {
            setCallStatus(`Socket error: ${err.message}`);
        });

        socketRef.current.on('error', (payload) => {
            setCallStatus(payload?.message || 'Socket error');
        });

        socketRef.current.on('ready', async () => {
            if (hasSentOfferRef.current) return;
            await startOffer();
        });

        socketRef.current.on('offer', async (offer) => {
            await answerOffer(offer);
        });

        socketRef.current.on('answer', async (answer) => {
            await addAnswer(answer);
        });

        socketRef.current.on('ice-candidate', async (candidate) => {
            await addIceCandidate(candidate);
        });

        return () => {
            isJoinedRef.current = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            if (peerConnectionRef.current) peerConnectionRef.current.close();
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
                localStreamRef.current = null;
            }
        };
    }, [user]);

    const ensureLocalMedia = async () => {
        if (localStreamRef.current) return;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
    };

    const ensurePeerConnection = async () => {
        if (peerConnectionRef.current) return;

        const peerConfiguration = {
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302']
                }
            ]
        };

        peerConnectionRef.current = new RTCPeerConnection(peerConfiguration);

        remoteStreamRef.current = new MediaStream();
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }

        localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });

        peerConnectionRef.current.addEventListener('icecandidate', (event) => {
            if (event.candidate && isJoinedRef.current) {
                socketRef.current?.emit('ice-candidate', event.candidate);
            }
        });

        peerConnectionRef.current.addEventListener('track', (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        });
    };

    const flushPendingIceCandidates = async () => {
        if (!peerConnectionRef.current?.remoteDescription) return;
        while (pendingIceCandidatesRef.current.length > 0) {
            const candidate = pendingIceCandidatesRef.current.shift();
            await peerConnectionRef.current.addIceCandidate(candidate);
        }
    };

    const joinRoom = async () => {
        if (!roomId || !socketRef.current || !user) {
            setCallStatus('Room ID is required');
            return;
        }

        try {
            await ensureLocalMedia();
            socketRef.current.emit('join-room', { roomId, userName: user.email });
            isJoinedRef.current = true;
            setIsJoined(true);
            setCallStatus('Joined room, waiting for peer');
        } catch (error) {
            setCallStatus(`Media error: ${error.message}`);
        }
    };

    const startOffer = async () => {
        if (!isJoinedRef.current) return;
        await ensureLocalMedia();
        await ensurePeerConnection();

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socketRef.current?.emit('offer', offer);
        hasSentOfferRef.current = true;
        setCallStatus('Calling');
    };

    const answerOffer = async (offer) => {
        if (!isJoinedRef.current) return;
        await ensureLocalMedia();
        await ensurePeerConnection();

        await peerConnectionRef.current.setRemoteDescription(offer);
        await flushPendingIceCandidates();

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socketRef.current?.emit('answer', answer);
        setCallStatus('Connected');
    };

    const addAnswer = async (answer) => {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.setRemoteDescription(answer);
        await flushPendingIceCandidates();
        setCallStatus('Connected');
    };

    const addIceCandidate = async (candidate) => {
        if (peerConnectionRef.current?.remoteDescription) {
            await peerConnectionRef.current.addIceCandidate(candidate);
        } else {
            pendingIceCandidatesRef.current.push(candidate);
        }
    };

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoStopped(!videoTrack.enabled);
            }
        }
    };

    const leaveCall = () => {
        // Reloading is the simplest way to fully clear WebRTC state and socket connections
        window.location.reload();
    };

    return (
        <div className="container mt-4" style={{ padding: '20px' }}>
            <div className="row justify-content-center mb-4">
                <div className="col-md-8 text-center">
                    <h3>User: {user ? user.name : 'Loading...'}</h3>
                    <p>Status: {callStatus}</p>
                    <div className="d-flex justify-content-center gap-2 my-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Appointment Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            style={{ maxWidth: '300px' }}
                        />
                        <button onClick={joinRoom} className="btn btn-primary" disabled={isJoined}>
                            {isJoined ? 'Joined' : 'Join'}
                        </button>
                        {isJoined && (
                            <>
                                <button onClick={startOffer} className="btn btn-success">
                                    Call
                                </button>
                                <button onClick={toggleAudio} className="btn btn-secondary">
                                    {isAudioMuted ? 'Unmute' : 'Mute'}
                                </button>
                                <button onClick={toggleVideo} className="btn btn-secondary">
                                    {isVideoStopped ? 'Start Video' : 'Stop Video'}
                                </button>
                                <button onClick={leaveCall} className="btn btn-danger">
                                    Leave
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="row justify-content-center" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div className="col-md-6 mb-3">
                    <h3>Local Video</h3>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', maxWidth: '500px', backgroundColor: 'black', borderRadius: '8px' }}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <h3>Remote Video</h3>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', maxWidth: '500px', backgroundColor: 'black', borderRadius: '8px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
