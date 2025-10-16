'use client';

import { useRoomStore } from '@/store/useRoomStore';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';

const MINIMAP_WIDTH = 240;
const MINIMAP_HEIGHT = 135;

export default function Minimap() {
  const { currentUser, users } = useRoomStore();
  const scaleX = MINIMAP_WIDTH / CANVAS_WIDTH;
  const scaleY = MINIMAP_HEIGHT / CANVAS_HEIGHT;

  if (!currentUser) return null;

  return (
    <div className="glass-effect rounded-xl p-3 shadow-2xl">
      <div className="mb-2">
        <h3 className="text-white text-xs font-semibold">Mapa do Escritório</h3>
      </div>
      
      <div
        className="relative bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-lg border border-white/20"
        style={{
          width: MINIMAP_WIDTH,
          height: MINIMAP_HEIGHT,
        }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Current user */}
        <div
          className="absolute w-3 h-3 rounded-full border-2 border-primary-400 bg-primary-500 shadow-lg z-10"
          style={{
            left: currentUser.position.x * scaleX - 6,
            top: currentUser.position.y * scaleY - 6,
          }}
        />

        {/* Other users */}
        {Array.from(users.values()).map((user) => (
          <div
            key={user.id}
            className="absolute w-2 h-2 rounded-full border border-white/50 shadow-md"
            style={{
              left: user.position.x * scaleX - 4,
              top: user.position.y * scaleY - 4,
              backgroundColor: user.color,
            }}
            title={user.name}
          />
        ))}

        {/* Compass */}
        <div className="absolute top-1 right-1 text-white/40 text-[10px] font-bold">
          ⬆️ N
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 border border-primary-400" />
          <span className="text-white/70 text-[10px]">Você</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 border border-white/50" />
          <span className="text-white/70 text-[10px]">Outros usuários</span>
        </div>
      </div>
    </div>
  );
}

