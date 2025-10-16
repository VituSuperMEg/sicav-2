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
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

console.log('🔒 CORS configurado para:', allowedOrigins);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Permite requisições sem origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Permite se está na lista OU em desenvolvimento
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.log('❌ Origem bloqueada:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  console.log('\n🔌 User connected:', socket.id);

  const { roomId, userId } = socket.handshake.query as { roomId: string; userId: string };
  console.log(`   Room ID: ${roomId}`);
  console.log(`   User ID: ${userId}`);

  if (!roomId) {
    console.error('❌ No room ID provided');
    return;
  }

  // Join room
  socket.join(roomId);
  console.log(`   ✅ Joined room: ${roomId}`);

  // Initialize room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
    console.log(`   🆕 Created new room: ${roomId}`);
  }

  const room = rooms.get(roomId)!;
  console.log(`   👥 Current users in room: ${room.size}`);

  // Handle user joined
  socket.on('user:joined', (user: User) => {
    console.log(`\n🆕 User ${user.name} (${user.id}) joined room ${roomId}`);
    console.log(`   Socket ID: ${socket.id}`);
    
    // Add user to room
    room.set(user.id, user);
    console.log(`   👥 Total users in room now: ${room.size}`);
    console.log(`   📋 Users: ${Array.from(room.values()).map(u => u.name).join(', ')}`);

    // Send current users to the new user
    const users = Array.from(room.values());
    socket.emit('users:update', users);
    console.log(`   ✅ Sent ${users.length} users to ${user.name}`);

    // Notify other users
    socket.to(roomId).emit('user:joined', user);
    console.log(`   📢 Notified other users in room about ${user.name}`);
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

