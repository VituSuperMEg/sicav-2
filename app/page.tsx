'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { generateId, getRandomColor } from '@/lib/utils';
import { AVATARS } from '@/lib/constants';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(true);

  const handleJoinRoom = () => {
    if (!name.trim()) return;

    const finalRoomId = isCreatingRoom ? generateId() : roomId;
    const userColor = getRandomColor();

    // Store user data in localStorage
    localStorage.setItem('virtualMeet_user', JSON.stringify({
      name,
      avatar: selectedAvatar,
      color: userColor,
    }));

    router.push(`/room/${finalRoomId}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4">
            Virtual Meet
          </h1>
          <p className="text-xl text-white/80">
            Reuniões online com espaço virtual interativo
          </p>
        </div>

        {/* Main Card */}
        <Card className="animate-slide-up">
          <div className="space-y-6">
            {/* Name Input */}
            <Input
              label="Seu nome"
              placeholder="Digite seu nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />

            {/* Avatar Selection */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Escolha seu avatar
              </label>
              <div className="grid grid-cols-8 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`
                      w-12 h-12 rounded-xl text-2xl
                      transition-all duration-200
                      ${selectedAvatar === avatar
                        ? 'bg-primary-500 scale-110 shadow-lg ring-4 ring-primary-400/50'
                        : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                      }
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Mode Toggle */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsCreatingRoom(true)}
                className={`
                  flex-1 px-6 py-4 rounded-xl font-semibold transition-all
                  ${isCreatingRoom
                    ? 'bg-white/20 border-2 border-primary-400 text-white'
                    : 'bg-white/5 border-2 border-transparent text-white/60 hover:bg-white/10'
                  }
                `}
              >
                Criar nova sala
              </button>
              <button
                onClick={() => setIsCreatingRoom(false)}
                className={`
                  flex-1 px-6 py-4 rounded-xl font-semibold transition-all
                  ${!isCreatingRoom
                    ? 'bg-white/20 border-2 border-primary-400 text-white'
                    : 'bg-white/5 border-2 border-transparent text-white/60 hover:bg-white/10'
                  }
                `}
              >
                Entrar em sala
              </button>
            </div>

            {/* Room ID Input */}
            {!isCreatingRoom && (
              <Input
                label="Código da sala"
                placeholder="Digite o código da sala..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            )}

            {/* Join Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleJoinRoom}
              disabled={!name.trim() || (!isCreatingRoom && !roomId.trim())}
              className="w-full"
            >
              {isCreatingRoom ? 'Criar e entrar' : 'Entrar na sala'}
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="bordered" className="text-center">
            <div className="text-4xl mb-2">🚶</div>
            <h3 className="text-white font-semibold mb-1">Movimentação Livre</h3>
            <p className="text-white/70 text-sm">Ande pelo espaço virtual</p>
          </Card>
          <Card variant="bordered" className="text-center">
            <div className="text-4xl mb-2">🎙️</div>
            <h3 className="text-white font-semibold mb-1">Áudio Espacial</h3>
            <p className="text-white/70 text-sm">Ouça quem está perto</p>
          </Card>
          <Card variant="bordered" className="text-center">
            <div className="text-4xl mb-2">🖥️</div>
            <h3 className="text-white font-semibold mb-1">Compartilhar Tela</h3>
            <p className="text-white/70 text-sm">Apresente para o grupo</p>
          </Card>
        </div>
      </div>
    </main>
  );
}

