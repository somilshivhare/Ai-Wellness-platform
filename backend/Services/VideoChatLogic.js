module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('join-room', ({ roomId, userName }) => {
            // NOTE: DB Authorization check removed for testing purposes.
            // In production, verify if the user is allowed in this roomId.

            socket.join(roomId);
            socket.roomId = roomId;
            socket.userName = userName;
            
            console.log(`User ${userName} joined room: ${roomId}`);

            const clients = io.sockets.adapter.rooms.get(roomId);
            if (clients && clients.size > 1) {
                socket.to(roomId).emit('ready');
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
