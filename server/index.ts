import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

interface User {
  id: string;
  name: string;
  avatar: string;
  position: Position;
  color: string;
}

interface Position {
  x: number;
  y: number;
}

const app = express();
const httpServer = createServer(app);

// Configurar CORS para permitir requisições do frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Store rooms and users
const rooms = new Map<string, Map<string, User>>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  const { roomId, userId } = socket.handshake.query as { roomId: string; userId: string };

  if (!roomId) {
    console.error('No room ID provided');
    return;
  }

  // Join room
  socket.join(roomId);

  // Initialize room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }

  const room = rooms.get(roomId)!;

  // Handle user joined
  socket.on('user:joined', (user: User) => {
    console.log(`User ${user.name} joined room ${roomId}`);
    
    // Add user to room
    room.set(user.id, user);

    // Send current users to the new user
    const users = Array.from(room.values());
    socket.emit('users:update', users);

    // Notify other users
    socket.to(roomId).emit('user:joined', user);
  });

  // Handle user moved
  socket.on('user:moved', ({ userId, position }: { userId: string; position: Position }) => {
    const user = room.get(userId);
    if (user) {
      user.position = position;
      room.set(userId, user);

      // Broadcast to other users in the room
      socket.to(roomId).emit('user:moved', { userId, position });
    }
  });

  // Handle WebRTC signaling
  socket.on('signal', ({ targetUserId, signal }: { targetUserId: string; signal: any }) => {
    // Find target user's socket
    const targetSocketId = Array.from(io.sockets.sockets.values())
      .find(s => s.handshake.query.userId === targetUserId)?.id;

    if (targetSocketId) {
      io.to(targetSocketId).emit('signal', {
        userId,
        signal,
      });
    }
  });

  // Handle screen share
  socket.on('screen:share:start', ({ userId }: { userId: string }) => {
    socket.to(roomId).emit('screen:share:start', { userId });
  });

  socket.on('screen:share:stop', ({ userId }: { userId: string }) => {
    socket.to(roomId).emit('screen:share:stop', { userId });
  });

  // Handle messages
  socket.on('message:sent', (message: any) => {
    io.to(roomId).emit('message:sent', message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove user from room
    room.delete(userId);

    // Notify other users
    socket.to(roomId).emit('user:left', userId);

    // Clean up empty rooms
    if (room.size === 0) {
      rooms.delete(roomId);
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

