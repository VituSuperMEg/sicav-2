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
  
  const { setCurrentUser, setRoomId, currentUser, audioSettings, videoSettings } = useRoomStore();
  const { socket } = useSocket(roomId);
  const { 
    getLocalStream, 
    startScreenShare, 
    stopScreenShare,
    updateSpatialAudio,
    createPeer,
    peers,
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

  // Handle toggle audio - REALMENTE ativa o microfone
  const handleToggleAudio = async () => {
    const store = useRoomStore.getState();
    const newAudioState = !audioSettings.enabled;
    
    if (newAudioState) {
      console.log('🎤 Ativando microfone...');
      const stream = await getLocalStream(true, videoSettings.enabled);
      if (stream) {
        console.log('✅ Microfone ativado!');
        console.log('📊 Usuários na sala:', store.users.size);
        
        store.toggleAudio(); // Atualiza o estado visual
        
        // Cria peers com todos os usuários conectados
        store.users.forEach((user) => {
          console.log('👤 Processando usuário:', user.name, user.id);
          console.log('   - Já tenho peer?', peers.has(user.id));
          
          if (!peers.has(user.id)) {
            console.log('🔗 Criando peer INICIADOR com', user.name);
            createPeer(user.id, true, stream);
          } else {
            console.log('⏭️ Peer já existe, pulando');
          }
        });
        
        if (store.users.size === 0) {
          console.log('ℹ️ Nenhum outro usuário na sala ainda');
        }
      } else {
        console.error('❌ Falha ao ativar microfone');
      }
    } else {
      console.log('🔇 Desativando microfone...');
      store.toggleAudio(); // Atualiza o estado visual
      
      // Para todos os tracks de áudio do stream local
      // TODO: implementar parada de tracks e remoção de peers
    }
  };

  // Handle toggle video - REALMENTE ativa a câmera
  const handleToggleVideo = async () => {
    const store = useRoomStore.getState();
    const newVideoState = !videoSettings.enabled;
    
    if (newVideoState) {
      console.log('📹 Ativando vídeo...');
      const stream = await getLocalStream(audioSettings.enabled, true);
      if (stream) {
        console.log('✅ Vídeo ativado!');
        store.toggleVideo(); // Atualiza o estado visual
        
        // Cria peers com todos os usuários conectados
        const users = store.users;
        users.forEach((user) => {
          if (!peers.has(user.id)) {
            console.log('🔗 Criando peer com', user.name);
            createPeer(user.id, true, stream);
          }
        });
      } else {
        console.error('❌ Falha ao ativar vídeo');
      }
    } else {
      console.log('🎥 Desativando vídeo...');
      store.toggleVideo(); // Atualiza o estado visual
      
      // Para todos os tracks de vídeo do stream local
      // TODO: implementar parada de tracks
    }
  };

  // Quando um novo usuário entra, cria peer automaticamente SE o áudio estiver ativado
  useEffect(() => {
    if (!socket || !currentUser) {
      console.log('⏸️ Socket ou currentUser não disponível');
      return;
    }

    const handleUserJoined = (user: User) => {
      console.log('🆕 Evento user:joined recebido:', user.name, user.id);
      console.log('   - Meu ID:', currentUser.id);
      console.log('   - Áudio ativado?', audioSettings.enabled);
      console.log('   - Já tenho peer?', peers.has(user.id));
      
      if (user.id === currentUser.id) {
        console.log('⏭️ Ignorando - sou eu mesmo');
        return;
      }
      
      if (peers.has(user.id)) {
        console.log('⏭️ Ignorando - peer já existe');
        return;
      }
      
      // Só cria peer se o áudio estiver ativado
      if (!audioSettings.enabled) {
        console.log('🔇 Áudio desativado, não criando peer ainda');
        return;
      }
      
      console.log('✅ Criando peer INICIADOR para:', user.name);
      // Pega o stream local atual e cria peer
      getLocalStream(true, videoSettings.enabled).then(stream => {
        if (stream) {
          console.log('📡 Stream local obtido, criando peer...');
          createPeer(user.id, true, stream);
        } else {
          console.error('❌ Falha ao obter stream local');
        }
      });
    };

    console.log('👂 Escutando evento user:joined... (áudio:', audioSettings.enabled, ')');
    socket.on('user:joined', handleUserJoined);

    return () => {
      console.log('🔇 Parando de escutar user:joined');
      socket.off('user:joined', handleUserJoined);
    };
  }, [socket, currentUser, audioSettings.enabled, videoSettings.enabled, peers, createPeer, getLocalStream]);

  // Update spatial audio when users move
  useEffect(() => {
    const users = useRoomStore.getState().users;
    users.forEach((user) => {
      const peerConnection = peers.get(user.id);
      if (peerConnection?.stream) {
        updateSpatialAudio(user.id, peerConnection.stream);
      }
    });
  }, [currentUser?.position, peers, updateSpatialAudio]);

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
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
      />
    </main>
  );
}

