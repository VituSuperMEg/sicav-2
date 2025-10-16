import { create } from 'zustand';
import { User, Position, AudioSettings, VideoSettings, ScreenShareSettings } from '@/types';

interface RoomState {
  // User state
  currentUser: User | null;
  users: Map<string, User>;
  
  // Room state
  roomId: string | null;
  isConnected: boolean;
  
  // Media settings
  audioSettings: AudioSettings;
  videoSettings: VideoSettings;
  screenShareSettings: ScreenShareSettings;
  
  // Actions
  setCurrentUser: (user: User) => void;
  updateUserPosition: (userId: string, position: Position) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  setUsers: (users: User[]) => void;
  setRoomId: (roomId: string) => void;
  setConnected: (connected: boolean) => void;
  
  // Media actions
  toggleAudio: () => void;
  toggleVideo: () => void;
  setAudioVolume: (volume: number) => void;
  setProximityRadius: (radius: number) => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentUser: null,
  users: new Map(),
  roomId: null,
  isConnected: false,
  
  audioSettings: {
    enabled: false,
    volume: 1.0,
    proximityRadius: 200,
  },
  
  videoSettings: {
    enabled: false,
    quality: 'medium',
  },
  
  screenShareSettings: {
    enabled: false,
  },
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  updateUserPosition: (userId, position) =>
    set((state) => {
      const newUsers = new Map(state.users);
      const user = newUsers.get(userId);
      if (user) {
        newUsers.set(userId, { ...user, position });
      }
      
      // Se for o usuário atual, atualiza também o currentUser
      const updates: any = { users: newUsers };
      if (state.currentUser && state.currentUser.id === userId) {
        updates.currentUser = { ...state.currentUser, position };
      }
      
      return updates;
    }),
  
  addUser: (user) =>
    set((state) => {
      const newUsers = new Map(state.users);
      newUsers.set(user.id, user);
      return { users: newUsers };
    }),
  
  removeUser: (userId) =>
    set((state) => {
      const newUsers = new Map(state.users);
      newUsers.delete(userId);
      return { users: newUsers };
    }),
  
  setUsers: (users) =>
    set(() => {
      const newUsers = new Map();
      users.forEach((user) => newUsers.set(user.id, user));
      return { users: newUsers };
    }),
  
  setRoomId: (roomId) => set({ roomId }),
  setConnected: (connected) => set({ isConnected: connected }),
  
  toggleAudio: () =>
    set((state) => ({
      audioSettings: {
        ...state.audioSettings,
        enabled: !state.audioSettings.enabled,
      },
    })),
  
  toggleVideo: () =>
    set((state) => ({
      videoSettings: {
        ...state.videoSettings,
        enabled: !state.videoSettings.enabled,
      },
    })),
  
  setAudioVolume: (volume) =>
    set((state) => ({
      audioSettings: {
        ...state.audioSettings,
        volume,
      },
    })),
  
  setProximityRadius: (radius) =>
    set((state) => ({
      audioSettings: {
        ...state.audioSettings,
        proximityRadius: radius,
      },
    })),
  
  startScreenShare: () =>
    set((state) => ({
      screenShareSettings: {
        enabled: true,
        userId: state.currentUser?.id,
      },
    })),
  
  stopScreenShare: () =>
    set({
      screenShareSettings: {
        enabled: false,
      },
    }),
}));

