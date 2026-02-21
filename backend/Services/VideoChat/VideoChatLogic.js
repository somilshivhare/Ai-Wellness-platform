const jwt = require('jsonwebtoken');

const Session = require('../../Models/SessionSchema');

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

module.exports = (io) => {
    // Authenticate Socket.IO connections using the JWT from handshake auth.
    io.use((socket, next) => {
        try {
            const token = socket.handshake?.auth?.token;
            if (!token) {
                return next(new Error('Unauthorized'));
            }
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err || !decoded?.id) {
                    return next(new Error('Unauthorized'));
                }
                socket.user = { id: decoded.id, role: decoded.role };
                return next();
            });
        } catch (e) {
            return next(new Error('Unauthorized'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('join-room', async (payload = {}) => {
            try {
            const sessionId = typeof payload === 'string' ? payload : payload?.sessionId;

                // Explicitly forbid joining via raw roomId.
                if (!sessionId || typeof sessionId !== 'string') {
                    socket.emit('error', { message: 'sessionId is required' });
                    return socket.disconnect(true);
                }

                const session = await Session.findById(sessionId).select('doctorId patientId roomId status endedAt');
                if (!session) {
                    socket.emit('error', { message: 'Invalid session' });
                    return socket.disconnect(true);
                }

                if (session.status === 'ended') {
                    socket.emit('error', { message: 'Session has ended' });
                    return socket.disconnect(true);
                }

                const userId = String(socket.user?.id);
                const isDoctor = String(session.doctorId) === userId && socket.user?.role === 'doctor';
                const isPatient = String(session.patientId) === userId && socket.user?.role === 'patient';

                if (!isDoctor && !isPatient) {
                    socket.emit('error', { message: 'Forbidden' });
                    return socket.disconnect(true);
                }

                const roomId = session.roomId;
                const clients = io.sockets.adapter.rooms.get(roomId);
                if (clients && clients.size >= 2) {
                    socket.emit('error', { message: 'Room is full' });
                    return socket.disconnect(true);
                }

                await socket.join(roomId);
                socket.roomId = roomId;
                socket.sessionId = sessionId;

                // Update session status when the first participant joins.
                if (session.status === 'pending') {
                    session.status = 'active';
                    await session.save();
                    console.log(`[session] activated sessionId=${sessionId}`);
                }

                console.log(`User ${socket.user?.id} joined sessionId=${sessionId}`);

                const updatedClients = io.sockets.adapter.rooms.get(roomId);
                if (updatedClients && updatedClients.size > 1) {
                    socket.to(roomId).emit('ready');
                }
            } catch (err) {
                console.error('join-room error:', err);
                socket.emit('error', { message: 'Join failed' });
                return socket.disconnect(true);
            }
        });

        socket.on('offer', (offer) => {
            if (!socket.roomId) return;
            socket.to(socket.roomId).emit('offer', offer);
        });

        socket.on('answer', (answer) => {
            if (!socket.roomId) return;
            socket.to(socket.roomId).emit('answer', answer);
        });

        socket.on('ice-candidate', (candidate) => {
            if (!socket.roomId) return;
            socket.to(socket.roomId).emit('ice-candidate', candidate);
        });
    });
};
