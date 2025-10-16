'use client';

import { User } from '@/types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, AVATAR_SIZE, PROXIMITY_RADIUS } from '@/lib/constants';
import { useRoomStore } from '@/store/useRoomStore';
import { isInProximity } from '@/lib/utils';

interface AvatarProps {
  user: User;
  isCurrentUser: boolean;
}

export default function Avatar({ user, isCurrentUser }: AvatarProps) {
  const currentUser = useRoomStore((state) => state.currentUser);
  const audioSettings = useRoomStore((state) => state.audioSettings);

  // Calculate if user is in proximity
  const inProximity = currentUser && !isCurrentUser
    ? isInProximity(currentUser.position, user.position, audioSettings.proximityRadius)
    : false;

  const shouldShowProximityCircle = isCurrentUser && audioSettings.enabled;

  return (
    <>
      {/* Proximity circle for current user */}
      {shouldShowProximityCircle && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(user.position.x / CANVAS_WIDTH) * 100}%`,
            top: `${(user.position.y / CANVAS_HEIGHT) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="rounded-full border-2 border-primary-400/30 bg-primary-500/5"
            style={{
              width: (audioSettings.proximityRadius * 2),
              height: (audioSettings.proximityRadius * 2),
            }}
          />
        </div>
      )}

      {/* Avatar */}
      <div
        className="absolute transition-all duration-75 ease-linear"
        style={{
          left: `${(user.position.x / CANVAS_WIDTH) * 100}%`,
          top: `${(user.position.y / CANVAS_HEIGHT) * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Connection indicator for users in proximity */}
        {inProximity && (
          <div className="absolute inset-0 animate-ping">
            <div
              className="w-full h-full rounded-full bg-green-400/30"
              style={{ width: AVATAR_SIZE + 10, height: AVATAR_SIZE + 10 }}
            />
          </div>
        )}

        {/* Avatar circle */}
        <div
          className={`
            flex items-center justify-center rounded-full border-4 shadow-lg
            transition-all duration-200
            ${isCurrentUser 
              ? 'border-primary-400 shadow-primary-500/50 ring-4 ring-primary-500/30' 
              : inProximity
                ? 'border-green-400 shadow-green-500/50'
                : 'border-white/50'
            }
          `}
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            backgroundColor: user.color,
          }}
        >
          <span className="text-2xl">{user.avatar}</span>
        </div>

        {/* Username */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="glass-effect px-3 py-1 rounded-lg">
            <span className={`text-xs font-semibold ${isCurrentUser ? 'text-primary-300' : 'text-white'}`}>
              {user.name}
              {isCurrentUser && ' (você)'}
            </span>
          </div>
        </div>

        {/* Speaking indicator */}
        {!isCurrentUser && inProximity && audioSettings.enabled && (
          <div className="absolute -top-2 -right-2">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </>
  );
}

