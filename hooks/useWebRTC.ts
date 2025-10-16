import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { useRoomStore } from '@/store/useRoomStore';
import { calculateAudioVolume, isInProximity } from '@/lib/utils';

interface PeerConnection {
  userId: string;
  peer: SimplePeer.Instance;
  stream?: MediaStream;
}

export function useWebRTC(socket: any) {
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const { currentUser, users, audioSettings } = useRoomStore();

  useEffect(() => {
    if (!socket || !currentUser) return;

    // Listen for WebRTC signals
    socket.on('signal', ({ userId, signal }: { userId: string; signal: any }) => {
      handleSignal(userId, signal);
    });

    // Listen for user leaving to cleanup audio elements
    socket.on('user-left', (userId: string) => {
      console.log('👋 Usuário saiu:', userId, '- Limpando áudio...');
      const audioElement = document.getElementById(`audio-${userId}`);
      if (audioElement) {
        audioElement.remove();
      }
    });

    return () => {
      socket.off('signal');
      socket.off('user-left');
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
  }, [socket, currentUser]);

  // Get local media stream
  const getLocalStream = async (audio = true, video = false) => {
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
      return stream;
    } catch (error) {
      console.error('Error getting local stream:', error);
      return null;
    }
  };

  // Create peer connection
  const createPeer = (userId: string, initiator: boolean, stream?: MediaStream) => {
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('signal', {
        targetUserId: userId,
        signal,
      });
    });

    peer.on('stream', (remoteStream) => {
      console.log('📡 Stream recebido de:', userId);
      console.log('   - Tracks de áudio:', remoteStream.getAudioTracks().length);
      console.log('   - Tracks de vídeo:', remoteStream.getVideoTracks().length);
      
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
        updateSpatialAudio(userId, remoteStream);
      }, 100);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
    });

    setPeers((prev) => new Map(prev).set(userId, { userId, peer }));
    
    return peer;
  };

  const handleSignal = (userId: string, signal: any) => {
    let peer = peers.get(userId)?.peer;
    
    if (!peer) {
      peer = createPeer(userId, false, localStreamRef.current || undefined);
    }
    
    peer.signal(signal);
  };

  // Update spatial audio based on distance
  const updateSpatialAudio = (userId: string, stream: MediaStream) => {
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
      audioElement.srcObject = stream;
      document.body.appendChild(audioElement);
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
  };

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

