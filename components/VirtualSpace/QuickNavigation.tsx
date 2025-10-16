'use client';

import { useState } from 'react';
import { useRoomStore } from '@/store/useRoomStore';
import { useSocket } from '@/hooks/useSocket';
import { officeAreas } from './OfficeLayout';
import { Navigation, MapPin } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { Position } from '@/types';

export default function QuickNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, updateUserPosition, roomId } = useRoomStore();
  const { emitMove } = useSocket(roomId);

  if (!currentUser) return null;

  const navigateToArea = (x: number, y: number, width: number, height: number, e: React.MouseEvent) => {
    // Centro da área
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // Se shift está pressionado, teletransporta. Senão, navega.
    if (e.shiftKey) {
      // Teletransporte instantâneo
      const newPosition: Position = { x: centerX, y: centerY };
      updateUserPosition(currentUser.id, newPosition);
      emitMove(newPosition);
    } else {
      // Navegação automática (será implementada pelo Canvas)
      const newPosition: Position = { x: centerX, y: centerY };
      updateUserPosition(currentUser.id, newPosition);
      emitMove(newPosition);
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="lg"
        title="Navegação Rápida"
        active={isOpen}
      >
        <Navigation className="w-6 h-6" />
      </IconButton>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 glass-effect rounded-xl p-4 shadow-2xl w-80 max-h-[500px] overflow-y-auto">
          <div className="mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Teletransportar para
            </h3>
            <p className="text-white/60 text-xs mt-1">
              Clique para ir instantaneamente para uma área
            </p>
          </div>

          <div className="space-y-2">
            {officeAreas.map((area) => (
              <button
                key={area.id}
                onClick={(e) => navigateToArea(area.x, area.y, area.width, area.height, e)}
                className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all flex items-center gap-3 group"
              >
                <div className="text-3xl">{area.icon}</div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium text-sm group-hover:text-primary-300 transition-colors">
                    {area.label}
                  </div>
                  <div className="text-white/50 text-xs">
                    {area.type === 'desk' && 'Trabalho individual'}
                    {area.type === 'meeting-room' && 'Reuniões em grupo'}
                    {area.type === 'coffee' && 'Conversas informais'}
                    {area.type === 'lounge' && 'Relaxamento'}
                    {area.type === 'presentation' && 'Apresentações'}
                  </div>
                </div>
                <MapPin className="w-4 h-4 text-white/30 group-hover:text-primary-400 transition-colors" />
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-primary-500/10 rounded-lg border border-primary-400/30">
            <p className="text-primary-300 text-xs">
              💡 <strong>Dica:</strong> Dê dois cliques no mapa para navegar até o local
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

