'use client';

import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Users, Settings } from 'lucide-react';
import { useRoomStore } from '@/store/useRoomStore';
import IconButton from '@/components/ui/IconButton';
import QuickNavigation from './QuickNavigation';
import { useState } from 'react';

interface ControlPanelProps {
  onLeave: () => void;
  onStartScreenShare: () => void;
  onStopScreenShare: () => void;
}

export default function ControlPanel({ onLeave, onStartScreenShare, onStopScreenShare }: ControlPanelProps) {
  const { 
    audioSettings, 
    videoSettings, 
    screenShareSettings,
    toggleAudio, 
    toggleVideo,
    users
  } = useRoomStore();
  
  const [showSettings, setShowSettings] = useState(false);

  const handleScreenShare = () => {
    if (screenShareSettings.enabled) {
      onStopScreenShare();
    } else {
      onStartScreenShare();
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-4 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - User count */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
          <Users className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">
            {users.size + 1} {users.size === 0 ? 'pessoa' : 'pessoas'}
          </span>
        </div>

        {/* Center - Main controls */}
        <div className="flex items-center gap-3">
          <IconButton
            onClick={toggleAudio}
            active={audioSettings.enabled}
            variant={audioSettings.enabled ? 'primary' : 'secondary'}
            size="lg"
            title={audioSettings.enabled ? 'Desativar microfone' : 'Ativar microfone'}
          >
            {audioSettings.enabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </IconButton>

          <IconButton
            onClick={toggleVideo}
            active={videoSettings.enabled}
            variant={videoSettings.enabled ? 'primary' : 'secondary'}
            size="lg"
            title={videoSettings.enabled ? 'Desativar vídeo' : 'Ativar vídeo'}
          >
            {videoSettings.enabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </IconButton>

          <IconButton
            onClick={handleScreenShare}
            active={screenShareSettings.enabled}
            variant={screenShareSettings.enabled ? 'primary' : 'secondary'}
            size="lg"
            title={screenShareSettings.enabled ? 'Parar compartilhamento' : 'Compartilhar tela'}
          >
            <MonitorUp className="w-6 h-6" />
          </IconButton>

          <div className="w-px h-10 bg-white/20" />

          <QuickNavigation />

          <IconButton
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="lg"
            title="Configurações"
          >
            <Settings className="w-6 h-6" />
          </IconButton>

          <IconButton
            onClick={onLeave}
            variant="danger"
            size="lg"
            title="Sair da sala"
          >
            <PhoneOff className="w-6 h-6" />
          </IconButton>
        </div>

        {/* Right side - Spacer */}
        <div className="w-[180px]" />
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-white font-semibold mb-4">Configurações</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Volume do áudio
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={audioSettings.volume * 100}
                onChange={(e) => {
                  const volume = parseInt(e.target.value) / 100;
                  useRoomStore.getState().setAudioVolume(volume);
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Raio de proximidade: {audioSettings.proximityRadius}px
              </label>
              <input
                type="range"
                min="100"
                max="400"
                value={audioSettings.proximityRadius}
                onChange={(e) => {
                  const radius = parseInt(e.target.value);
                  useRoomStore.getState().setProximityRadius(radius);
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Qualidade do vídeo
              </label>
              <select
                value={videoSettings.quality}
                onChange={(e) => {
                  // Update video quality
                }}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

