export interface User {
  id: string;
  name: string;
  avatar: string;
  position: Position;
  color: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Room {
  id: string;
  name: string;
  users: User[];
  maxUsers: number;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export interface PeerConnection {
  userId: string;
  peer: any;
  stream?: MediaStream;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  proximityRadius: number;
}

export interface VideoSettings {
  enabled: boolean;
  quality: 'low' | 'medium' | 'high';
}

export interface ScreenShareSettings {
  enabled: boolean;
  userId?: string;
}

