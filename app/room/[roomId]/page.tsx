'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoomStore } from '@/store/useRoomStore';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import Canvas from '@/components/VirtualSpace/Canvas';
import ControlPanel from '@/components/VirtualSpace/ControlPanel';
import Minimap from '@/components/VirtualSpace/Minimap';
import AreaInfo from '@/components/VirtualSpace/AreaInfo';
import NearbyUsers from '@/components/VirtualSpace/NearbyUsers';
import { generateId } from '@/lib/utils';
import { User } from '@/types';
import { Copy, Check } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const [copied, setCopied] = useState(false);
  
  const { setCurrentUser, setRoomId, currentUser } = useRoomStore();
  const { socket } = useSocket(roomId);
  const { 
    getLocalStream, 
    startScreenShare, 
    stopScreenShare,
    updateSpatialAudio,
  } = useWebRTC(socket);

  useEffect(() => {
    // Load user data from localStorage
    const userDataStr = localStorage.getItem('virtualMeet_user');
    if (!userDataStr) {
      router.push('/');
      return;
    }

    const userData = JSON.parse(userDataStr);
    const user: User = {
      id: generateId(),
      name: userData.name,
      avatar: userData.avatar,
      color: userData.color,
      position: {
        x: Math.random() * 1000 + 460,
        y: Math.random() * 500 + 290,
      },
    };

    setCurrentUser(user);
    setRoomId(roomId);
  }, [roomId, router, setCurrentUser, setRoomId]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveRoom = () => {
    router.push('/');
  };

  const handleStartScreenShare = async () => {
    const screenStream = await startScreenShare();
    if (screenStream) {
      useRoomStore.getState().startScreenShare();
    }
  };

  const handleStopScreenShare = async () => {
    await stopScreenShare();
    useRoomStore.getState().stopScreenShare();
  };

  // Update spatial audio when users move
  useEffect(() => {
    const users = useRoomStore.getState().users;
    users.forEach((user) => {
      // Update audio for each user
      // This would be called from the WebRTC hook
    });
  }, [useRoomStore.getState().users]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8">
          <div className="text-white text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Virtual Meet
              </h1>
              <p className="text-white/70 text-sm">
                Bem-vindo, {currentUser.name}!
              </p>
            </div>
            
            {/* Current Area Info */}
            <AreaInfo />
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-effect px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-white/70 text-sm">Código da sala:</span>
              <code className="text-white font-mono font-semibold">{roomId}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyRoomId}
                className="!p-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Virtual Space with Minimap */}
      <div className="flex-1 min-h-0 flex gap-4">
        {/* Canvas */}
        <div className="flex-1">
          <Canvas />
        </div>

        {/* Sidebar - Minimap and Nearby Users */}
        <div className="flex flex-col gap-4 w-64">
          <Minimap />
          <NearbyUsers />
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel
        onLeave={handleLeaveRoom}
        onStartScreenShare={handleStartScreenShare}
        onStopScreenShare={handleStopScreenShare}
      />
    </main>
  );
}

