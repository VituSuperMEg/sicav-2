'use client';

import { useEffect, useRef, useState } from 'react';
import { useRoomStore } from '@/store/useRoomStore';
import { useSocket } from '@/hooks/useSocket';
import { CANVAS_WIDTH, CANVAS_HEIGHT, AVATAR_SIZE, MOVE_SPEED } from '@/lib/constants';
import Avatar from './Avatar';
import OfficeLayout from './OfficeLayout';
import { Position } from '@/types';

export default function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [targetPosition, setTargetPosition] = useState<Position | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const { currentUser, users, updateUserPosition } = useRoomStore();
  const { emitMove } = useSocket(useRoomStore((state) => state.roomId));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Auto-navegação para o alvo
  useEffect(() => {
    if (!currentUser || !targetPosition || !isNavigating) return;

    const interval = setInterval(() => {
      const dx = targetPosition.x - currentUser.position.x;
      const dy = targetPosition.y - currentUser.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Se chegou perto do destino, para
      if (distance < MOVE_SPEED * 2) {
        setIsNavigating(false);
        setTargetPosition(null);
        return;
      }

      // Calcula direção normalizada
      const dirX = dx / distance;
      const dirY = dy / distance;

      // Move na direção do alvo
      let newX = currentUser.position.x + dirX * MOVE_SPEED;
      let newY = currentUser.position.y + dirY * MOVE_SPEED;

      // Mantém dentro dos limites
      newX = Math.max(AVATAR_SIZE, Math.min(CANVAS_WIDTH - AVATAR_SIZE, newX));
      newY = Math.max(AVATAR_SIZE, Math.min(CANVAS_HEIGHT - AVATAR_SIZE, newY));

      const newPosition: Position = { x: newX, y: newY };
      updateUserPosition(currentUser.id, newPosition);
      emitMove(newPosition);
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [currentUser, targetPosition, isNavigating, emitMove, updateUserPosition]);

  // Movimento manual com teclado
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      // Se está navegando automaticamente, cancela ao pressionar tecla
      if (keys.size > 0 && isNavigating) {
        setIsNavigating(false);
        setTargetPosition(null);
      }

      let newX = currentUser.position.x;
      let newY = currentUser.position.y;
      let moved = false;

      if (keys.has('w') || keys.has('arrowup')) {
        newY = Math.max(AVATAR_SIZE, newY - MOVE_SPEED);
        moved = true;
      }
      if (keys.has('s') || keys.has('arrowdown')) {
        newY = Math.min(CANVAS_HEIGHT - AVATAR_SIZE, newY + MOVE_SPEED);
        moved = true;
      }
      if (keys.has('a') || keys.has('arrowleft')) {
        newX = Math.max(AVATAR_SIZE, newX - MOVE_SPEED);
        moved = true;
      }
      if (keys.has('d') || keys.has('arrowright')) {
        newX = Math.min(CANVAS_WIDTH - AVATAR_SIZE, newX + MOVE_SPEED);
        moved = true;
      }

      if (moved) {
        const newPosition: Position = { x: newX, y: newY };
        updateUserPosition(currentUser.id, newPosition);
        emitMove(newPosition);
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [currentUser, keys, isNavigating, emitMove, updateUserPosition]);

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentUser || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Inicia navegação automática
    setTargetPosition({ x, y });
    setIsNavigating(true);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Evita que o clique simples interfira com o duplo clique
    e.stopPropagation();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl overflow-hidden">
      <div
        ref={canvasRef}
        className="relative bg-gradient-to-br from-indigo-50/5 to-purple-50/5 rounded-xl shadow-2xl backdrop-blur-sm"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: CANVAS_WIDTH,
          maxHeight: CANVAS_HEIGHT,
          cursor: isNavigating ? 'wait' : 'pointer',
        }}
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Office Layout */}
        <OfficeLayout />

        {/* Indicador de destino quando navegando */}
        {targetPosition && isNavigating && (
          <div
            className="absolute pointer-events-none animate-pulse"
            style={{
              left: `${(targetPosition.x / CANVAS_WIDTH) * 100}%`,
              top: `${(targetPosition.y / CANVAS_HEIGHT) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              {/* Círculos pulsantes */}
              <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary-400 animate-ping opacity-75" />
              <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-500 bg-primary-500/20" />
              {/* X marcador */}
              <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-primary-300 font-bold text-xl">
                ✕
              </div>
            </div>
          </div>
        )}

        {/* Current user */}
        {currentUser && (
          <Avatar
            user={currentUser}
            isCurrentUser={true}
          />
        )}

        {/* Other users */}
        {Array.from(users.values()).map((user) => (
          <Avatar
            key={user.id}
            user={user}
            isCurrentUser={false}
          />
        ))}

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass-effect rounded-xl px-6 py-3">
          <p className="text-white text-sm font-medium text-center">
            <span className="font-bold">WASD</span> ou <span className="font-bold">↑↓←→</span> para mover • 
            <span className="font-bold">Clique 2x</span> para ir até o local
            {isNavigating && <span className="ml-2 text-primary-300 animate-pulse">🚶 Navegando...</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

