'use client';

import { useRoomStore } from '@/store/useRoomStore';
import { isInProximity } from '@/lib/utils';
import { Users } from 'lucide-react';

export default function NearbyUsers() {
  const { currentUser, users, audioSettings } = useRoomStore();

  if (!currentUser) return null;

  // Encontrar usuários próximos
  const nearbyUsers = Array.from(users.values()).filter((user) =>
    isInProximity(currentUser.position, user.position, audioSettings.proximityRadius)
  );

  if (nearbyUsers.length === 0) return null;

  return (
    <div className="glass-effect rounded-xl p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-primary-400" />
        <h3 className="text-white text-sm font-semibold">
          Pessoas por perto ({nearbyUsers.length})
        </h3>
      </div>

      <div className="space-y-2">
        {nearbyUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg border-2"
              style={{
                backgroundColor: user.color,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user.name}
              </p>
              <p className="text-white/50 text-xs">
                {audioSettings.enabled ? '🎙️ Conectado' : '🔇 Mudo'}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

