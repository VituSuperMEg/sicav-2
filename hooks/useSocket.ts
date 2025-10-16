import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRoomStore } from '@/store/useRoomStore';
import { User } from '@/types';
import { SOCKET_EVENTS } from '@/lib/constants';

export function useSocket(roomId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const currentUser = useRoomStore((state) => state.currentUser);

  useEffect(() => {
    if (!roomId || !currentUser) return;

    // Connect to socket server
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket = io(socketUrl, {
      query: { roomId, userId: currentUser.id },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      useRoomStore.getState().setConnected(true);
      
      // Emit user joined event
      socket.emit(SOCKET_EVENTS.USER_JOINED, currentUser);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      useRoomStore.getState().setConnected(false);
    });

    // Listen for other users updates
    socket.on(SOCKET_EVENTS.USERS_UPDATE, (users: User[]) => {
      useRoomStore.getState().setUsers(users.filter(u => u.id !== currentUser.id));
    });

    socket.on(SOCKET_EVENTS.USER_JOINED, (user: User) => {
      if (user.id !== currentUser.id) {
        useRoomStore.getState().addUser(user);
      }
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, (userId: string) => {
      useRoomStore.getState().removeUser(userId);
    });

    socket.on(SOCKET_EVENTS.USER_MOVED, ({ userId, position }: { userId: string; position: { x: number; y: number } }) => {
      if (userId !== currentUser.id) {
        useRoomStore.getState().updateUserPosition(userId, position);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, currentUser]);

  const emitMove = (position: { x: number; y: number }) => {
    if (socketRef.current && currentUser) {
      socketRef.current.emit(SOCKET_EVENTS.USER_MOVED, {
        userId: currentUser.id,
        position,
      });
    }
  };

  return { socket: socketRef.current, emitMove };
}

