'use client';

import { useEffect, useState } from 'react';
import { useRoomStore } from '@/store/useRoomStore';
import { officeAreas, OfficeArea } from './OfficeLayout';
import { MapPin } from 'lucide-react';

export default function AreaInfo() {
  const currentUser = useRoomStore((state) => state.currentUser);
  const [currentArea, setCurrentArea] = useState<OfficeArea | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Verificar em qual área o usuário está
    const area = officeAreas.find((area) => {
      const { x, y } = currentUser.position;
      return (
        x >= area.x &&
        x <= area.x + area.width &&
        y >= area.y &&
        y <= area.y + area.height
      );
    });

    setCurrentArea(area || null);
  }, [currentUser?.position]);

  if (!currentArea) {
    return (
      <div className="glass-effect rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
        <MapPin className="w-4 h-4 text-white/50" />
        <span className="text-white/70 text-sm">Área livre</span>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{currentArea.icon}</div>
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-400" />
            <span className="text-white font-semibold text-sm">
              {currentArea.label}
            </span>
          </div>
          <span className="text-white/60 text-xs">
            {currentArea.type === 'desk' && 'Área de trabalho individual'}
            {currentArea.type === 'meeting-room' && 'Espaço para reuniões'}
            {currentArea.type === 'coffee' && 'Área de descanso e café'}
            {currentArea.type === 'lounge' && 'Espaço de relaxamento'}
            {currentArea.type === 'presentation' && 'Área de apresentações'}
          </span>
        </div>
      </div>
    </div>
  );
}

