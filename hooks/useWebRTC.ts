import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { useRoomStore } from '@/store/useRoomStore';
import { calculateAudioVolume, isInProximity } from '@/lib/utils';

interface PeerConnection {
  userId: string;
  peer: SimplePeer.Instance;
  stream?: MediaStream;
}

export function useWebRTC(socket: any) {
  console.log('🔌 useWebRTC hook inicializado');
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const currentUserRef = useRef(useRoomStore.getState().currentUser);
  const initializedRef = useRef(false);
  
  console.log('   Socket disponível?', !!socket);
  console.log('   Peers atuais:', peers.size);
  console.log('   CurrentUser ID:', currentUserRef.current?.id);
  console.log('   Já inicializado?', initializedRef.current);

  useEffect(() => {
    currentUserRef.current = useRoomStore.getState().currentUser;
  });

  useEffect(() => {
    if (!socket || !currentUserRef.current) return;
    
    if (initializedRef.current) {
      console.log('⚠️ Hook já inicializado, pulando...');
      return;
    }
    
    initializedRef.current = true;
    console.log('🎧 Começando a escutar sinais WebRTC...');

    // Listen for WebRTC signals
    socket.on('signal', ({ userId, signal }: { userId: string; signal: any }) => {
      console.log(`🔔 Evento 'signal' recebido do socket para userId: ${userId}`);
      handleSignal(userId, signal);
    });

    // Listen for user leaving to cleanup audio elements
    socket.on('user:left', (userId: string) => {
      console.log('👋 Usuário saiu:', userId, '- Limpando áudio e peer...');
      
      // Remove audio element
      const audioElement = document.getElementById(`audio-${userId}`);
      if (audioElement) {
        audioElement.remove();
        console.log('   ✅ Elemento de áudio removido');
      }
      
      // Destroy and remove peer
      setPeers((prev) => {
        const updated = new Map(prev);
        const peerConnection = updated.get(userId);
        if (peerConnection) {
          peerConnection.peer.destroy();
          console.log('   ✅ Peer destruído');
          updated.delete(userId);
          console.log('   ✅ Peer removido do mapa');
        }
        return updated;
      });
    });

    return () => {
      socket.off('signal');
      socket.off('user:left');
      // Cleanup peers
      peers.forEach(({ peer, userId }) => {
        peer.destroy();
        // Remove audio element
        const audioElement = document.getElementById(`audio-${userId}`);
        if (audioElement) {
          audioElement.remove();
        }
      });
    };
  }, [socket]);

  // Get local media stream
  const getLocalStream = useCallback(async (audio = true, video = false) => {
    try {
      // Pelo menos um deve ser true
      if (!audio && !video) {
        console.warn('⚠️ Pelo menos um de audio ou video deve ser true');
        return null;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } : false,
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        } : false,
      });
      
      localStreamRef.current = stream;
      console.log('🔧 Stream local salvo no ref:', {
        hasStream: !!stream,
        audioTracks: stream?.getAudioTracks().length,
        active: stream?.active,
        id: stream?.id
      });
      return stream;
    } catch (error) {
      console.error('Error getting local stream:', error);
      return null;
    }
  }, []);

  // Create peer connection
  const createPeer = useCallback((userId: string, initiator: boolean, stream?: MediaStream) => {
    console.log(`🔧 Criando peer para ${userId}:`);
    console.log(`   - Iniciador: ${initiator}`);
    console.log(`   - Tem stream: ${!!stream}`);
    console.log(`   - Tracks de áudio no stream: ${stream?.getAudioTracks().length || 0}`);
    console.log(`   - Stream ativo: ${stream?.active}`);
    console.log(`   - Stream ID: ${stream?.id}`);
    
    // Verifica se já existe um peer para este usuário
    const existingPeer = peers.get(userId);
    if (existingPeer && !existingPeer.peer.destroyed) {
      console.log(`   ⚠️ Peer já existe e não está destruído, destruindo primeiro...`);
      existingPeer.peer.destroy();
    }
    
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      console.log(`📤 Enviando sinal para ${userId}:`, signal.type);
      console.log(`   - Sinal completo:`, signal);
      socket.emit('signal', {
        targetUserId: userId,
        signal,
      });
    });

    peer.on('stream', (remoteStream) => {
      console.log('📡 Stream recebido de:', userId);
      console.log('   - Tracks de áudio:', remoteStream.getAudioTracks().length);
      console.log('   - Tracks de vídeo:', remoteStream.getVideoTracks().length);
      console.log('   - Stream ativo:', remoteStream.active);
      console.log('   - Stream ID:', remoteStream.id);
      
      setPeers((prev) => {
        const updated = new Map(prev);
        const existing = updated.get(userId);
        if (existing) {
          updated.set(userId, { ...existing, stream: remoteStream });
        }
        return updated;
      });
      
      // Apply spatial audio IMEDIATAMENTE
      setTimeout(() => {
        const users = useRoomStore.getState().users;
        const currentUser = useRoomStore.getState().currentUser;
        const audioSettings = useRoomStore.getState().audioSettings;
        
        const otherUser = users.get(userId);
        if (!otherUser || !currentUser) return;

        const audioTracks = remoteStream.getAudioTracks();
        if (audioTracks.length === 0) {
          console.log('❌ Nenhum track de áudio encontrado para', userId);
          return;
        }

        // Procura ou cria elemento de áudio para este usuário
        let audioElement = document.getElementById(`audio-${userId}`) as HTMLAudioElement;
        
        if (!audioElement) {
          console.log('🔊 Criando elemento de áudio para', otherUser.name);
          audioElement = document.createElement('audio');
          audioElement.id = `audio-${userId}`;
          audioElement.autoplay = true;
          document.body.appendChild(audioElement);
        }
        
        // Sempre atualiza o srcObject com o stream mais recente
        if (audioElement.srcObject !== remoteStream) {
          console.log('🔄 Atualizando srcObject do elemento de áudio para', otherUser.name);
          audioElement.srcObject = remoteStream;
        }

        // Calculate volume based on distance
        const inProximity = isInProximity(
          currentUser.position,
          otherUser.position,
          audioSettings.proximityRadius
        );

        if (inProximity) {
          const distance = Math.sqrt(
            Math.pow(currentUser.position.x - otherUser.position.x, 2) +
            Math.pow(currentUser.position.y - otherUser.position.y, 2)
          );
          const volume = calculateAudioVolume(distance, audioSettings.proximityRadius);
          audioElement.volume = volume * audioSettings.volume;
          console.log(`🔊 Áudio de ${otherUser.name}: volume=${Math.round(volume * 100)}%, distância=${Math.round(distance)}px`);
        } else {
          audioElement.volume = 0;
        }
      }, 100);
    });

    peer.on('connect', () => {
      console.log(`✅ Peer conectado com ${userId}!`);
      console.log(`   - Conexão estabelecida, aguardando stream...`);
    });

    peer.on('error', (err) => {
      console.error(`❌ Erro no peer com ${userId}:`, err);
      console.log(`   - Tipo do erro:`, err.name);
      console.log(`   - Mensagem:`, err.message);
      
      // Se for erro de estado, destroi o peer e recria
      if (err.name === 'InvalidStateError' || err.message.includes('wrong state')) {
        console.log(`   🔄 Recriando peer devido a erro de estado...`);
        peer.destroy();
        
        // Recria o peer após um pequeno delay
        setTimeout(() => {
          const newPeer = createPeer(userId, initiator, stream);
          console.log(`   ✅ Peer recriado:`, !!newPeer);
        }, 100);
      }
    });

    peer.on('close', () => {
      console.log(`🔌 Peer fechado com ${userId}`);
    });

    setPeers((prev) => new Map(prev).set(userId, { userId, peer }));
    
    return peer;
  }, [socket]);

  const handleSignal = (userId: string, signal: any) => {
    console.log(`📥 Recebeu sinal de ${userId}:`, signal.type);
    console.log(`   - Sinal completo:`, signal);
    
    let peerConnection = peers.get(userId);
    let peer = peerConnection?.peer;
    
    if (!peer) {
      console.log(`   ⚠️ Peer não existe, criando como RECEPTOR para ${userId}`);
      console.log(`   Stream local disponível:`, !!localStreamRef.current);
      if (localStreamRef.current) {
        console.log(`   Tracks de áudio no stream local:`, localStreamRef.current.getAudioTracks().length);
        console.log(`   Stream local ativo:`, localStreamRef.current.active);
      }
      peer = createPeer(userId, false, localStreamRef.current || undefined);
      console.log(`   ✅ Peer receptor criado:`, !!peer);
    } else {
      console.log(`   ✅ Peer já existe, processando sinal`);
      // Verifica se o peer não está em estado de erro
      if (peer.destroyed) {
        console.log(`   ⚠️ Peer destruído, recriando...`);
        peer = createPeer(userId, false, localStreamRef.current || undefined);
      }
    }
    
    try {
      peer.signal(signal);
      console.log(`   ✅ Sinal processado com sucesso`);
      console.log(`   - Peer estado:`, peer.connected ? 'conectado' : 'conectando');
    } catch (err) {
      console.error(`   ❌ Erro ao processar sinal:`, err);
    }
  };

  // Update spatial audio based on distance
  const updateSpatialAudio = useCallback((userId: string, stream: MediaStream) => {
    const users = useRoomStore.getState().users;
    const currentUser = useRoomStore.getState().currentUser;
    const audioSettings = useRoomStore.getState().audioSettings;
    
    const otherUser = users.get(userId);
    if (!otherUser || !currentUser) return;

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      console.log('❌ Nenhum track de áudio encontrado para', userId);
      return;
    }

    // Procura ou cria elemento de áudio para este usuário
    let audioElement = document.getElementById(`audio-${userId}`) as HTMLAudioElement;
    
    if (!audioElement) {
      console.log('🔊 Criando elemento de áudio para', otherUser.name);
      audioElement = document.createElement('audio');
      audioElement.id = `audio-${userId}`;
      audioElement.autoplay = true;
      document.body.appendChild(audioElement);
    }
    
    // Sempre atualiza o srcObject com o stream mais recente
    if (audioElement.srcObject !== stream) {
      console.log('🔄 Atualizando srcObject do elemento de áudio para', otherUser.name);
      audioElement.srcObject = stream;
    }

    // Calculate volume based on distance
    const inProximity = isInProximity(
      currentUser.position,
      otherUser.position,
      audioSettings.proximityRadius
    );

    if (inProximity) {
      const distance = Math.sqrt(
        Math.pow(currentUser.position.x - otherUser.position.x, 2) +
        Math.pow(currentUser.position.y - otherUser.position.y, 2)
      );
      const volume = calculateAudioVolume(distance, audioSettings.proximityRadius);
      audioElement.volume = volume * audioSettings.volume;
      console.log(`🔊 Áudio de ${otherUser.name}: volume=${Math.round(volume * 100)}%, distância=${Math.round(distance)}px`);
    } else {
      audioElement.volume = 0;
    }
  }, []);

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always' as any,
        } as any,
        audio: false,
      });

      // Replace video track in all peer connections
      peers.forEach(({ peer }) => {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = (peer as any)._pc.getSenders().find((s: any) => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      return screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return null;
    }
  };

  // Stop screen sharing
  const stopScreenShare = async () => {
    if (!localStreamRef.current) return;

    // Replace screen track with camera track
    const cameraStream = await getLocalStream(false, true);
    if (!cameraStream) return;

    peers.forEach(({ peer }) => {
      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = (peer as any)._pc.getSenders().find((s: any) => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    });
  };

  return {
    peers,
    localStream: localStreamRef.current,
    getLocalStream,
    createPeer,
    updateSpatialAudio,
    startScreenShare,
    stopScreenShare,
  };
}

