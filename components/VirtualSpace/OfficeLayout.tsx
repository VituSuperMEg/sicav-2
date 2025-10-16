'use client';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';

interface OfficeArea {
  id: string;
  type: 'desk' | 'meeting-room' | 'coffee' | 'lounge' | 'presentation';
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  label: string;
  color: string;
}

const officeAreas: OfficeArea[] = [
  // Sala de Reunião Principal
  {
    id: 'meeting-1',
    type: 'meeting-room',
    x: 100,
    y: 100,
    width: 300,
    height: 200,
    icon: '🏢',
    label: 'Sala de Reunião',
    color: 'rgba(59, 130, 246, 0.2)',
  },
  // Área de Apresentação
  {
    id: 'presentation',
    type: 'presentation',
    x: 500,
    y: 100,
    width: 350,
    height: 250,
    icon: '📊',
    label: 'Área de Apresentação',
    color: 'rgba(139, 92, 246, 0.2)',
  },
  // Estações de Trabalho (Mesas)
  {
    id: 'desk-1',
    type: 'desk',
    x: 100,
    y: 400,
    width: 180,
    height: 150,
    icon: '💻',
    label: 'Mesa 1',
    color: 'rgba(34, 197, 94, 0.2)',
  },
  {
    id: 'desk-2',
    type: 'desk',
    x: 320,
    y: 400,
    width: 180,
    height: 150,
    icon: '💻',
    label: 'Mesa 2',
    color: 'rgba(34, 197, 94, 0.2)',
  },
  {
    id: 'desk-3',
    type: 'desk',
    x: 540,
    y: 400,
    width: 180,
    height: 150,
    icon: '💻',
    label: 'Mesa 3',
    color: 'rgba(34, 197, 94, 0.2)',
  },
  // Área de Café
  {
    id: 'coffee',
    type: 'coffee',
    x: 950,
    y: 100,
    width: 200,
    height: 200,
    icon: '☕',
    label: 'Café',
    color: 'rgba(245, 158, 11, 0.2)',
  },
  // Lounge / Área de Descanso
  {
    id: 'lounge',
    type: 'lounge',
    x: 950,
    y: 350,
    width: 200,
    height: 200,
    icon: '🛋️',
    label: 'Lounge',
    color: 'rgba(236, 72, 153, 0.2)',
  },
  // Mais Mesas
  {
    id: 'desk-4',
    type: 'desk',
    x: 100,
    y: 600,
    width: 180,
    height: 150,
    icon: '💻',
    label: 'Mesa 4',
    color: 'rgba(34, 197, 94, 0.2)',
  },
  {
    id: 'desk-5',
    type: 'desk',
    x: 320,
    y: 600,
    width: 180,
    height: 150,
    icon: '💻',
    label: 'Mesa 5',
    color: 'rgba(34, 197, 94, 0.2)',
  },
  {
    id: 'desk-6',
    type: 'desk',
    x: 540,
    y: 600,
    width: 180,
    height: 150,
    icon: '💻',
    label: 'Mesa 6',
    color: 'rgba(34, 197, 94, 0.2)',
  },
  // Sala de Reunião Pequena
  {
    id: 'meeting-2',
    type: 'meeting-room',
    x: 100,
    y: 800,
    width: 250,
    height: 180,
    icon: '👥',
    label: 'Sala Privada',
    color: 'rgba(59, 130, 246, 0.2)',
  },
  // Área de Brainstorm
  {
    id: 'brainstorm',
    type: 'meeting-room',
    x: 400,
    y: 800,
    width: 320,
    height: 180,
    icon: '💡',
    label: 'Brainstorm',
    color: 'rgba(245, 158, 11, 0.2)',
  },
  // Área de Games/Descontração
  {
    id: 'games',
    type: 'lounge',
    x: 950,
    y: 600,
    width: 200,
    height: 200,
    icon: '🎮',
    label: 'Área de Games',
    color: 'rgba(168, 85, 247, 0.2)',
  },
];

export default function OfficeLayout() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Renderizar áreas do escritório */}
      {officeAreas.map((area) => (
        <div
          key={area.id}
          className="absolute rounded-2xl border-2 border-white/30 transition-all hover:border-white/50"
          style={{
            left: `${(area.x / CANVAS_WIDTH) * 100}%`,
            top: `${(area.y / CANVAS_HEIGHT) * 100}%`,
            width: `${(area.width / CANVAS_WIDTH) * 100}%`,
            height: `${(area.height / CANVAS_HEIGHT) * 100}%`,
            backgroundColor: area.color,
          }}
        >
          {/* Ícone e Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl mb-2 opacity-60">{area.icon}</div>
            <div className="glass-effect px-4 py-2 rounded-lg">
              <span className="text-white font-semibold text-sm">
                {area.label}
              </span>
            </div>
          </div>

          {/* Decoração baseada no tipo */}
          {area.type === 'desk' && (
            <>
              {/* Cadeira */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-3xl opacity-50">
                🪑
              </div>
            </>
          )}

          {area.type === 'meeting-room' && (
            <>
              {/* Mesa de reunião */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
                <div className="text-4xl">🪑🪑</div>
              </div>
            </>
          )}

          {area.type === 'coffee' && (
            <>
              {/* Itens de café */}
              <div className="absolute bottom-4 left-4 text-2xl opacity-40">☕</div>
              <div className="absolute bottom-4 right-4 text-2xl opacity-40">🍰</div>
            </>
          )}

          {area.type === 'presentation' && (
            <>
              {/* Tela de apresentação */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-5xl opacity-40">
                🖥️
              </div>
            </>
          )}

          {area.type === 'lounge' && (
            <>
              {/* Plantas decorativas */}
              <div className="absolute top-2 left-2 text-2xl opacity-40">🪴</div>
              <div className="absolute top-2 right-2 text-2xl opacity-40">🪴</div>
            </>
          )}
        </div>
      ))}

      {/* Paredes/Divisórias */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        {/* Parede superior */}
        <line
          x1="0"
          y1="0"
          x2={CANVAS_WIDTH}
          y2="0"
          stroke="white"
          strokeWidth="4"
        />
        {/* Parede inferior */}
        <line
          x1="0"
          y1={CANVAS_HEIGHT}
          x2={CANVAS_WIDTH}
          y2={CANVAS_HEIGHT}
          stroke="white"
          strokeWidth="4"
        />
        {/* Parede esquerda */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={CANVAS_HEIGHT}
          stroke="white"
          strokeWidth="4"
        />
        {/* Parede direita */}
        <line
          x1={CANVAS_WIDTH}
          y1="0"
          x2={CANVAS_WIDTH}
          y2={CANVAS_HEIGHT}
          stroke="white"
          strokeWidth="4"
        />

        {/* Divisórias internas */}
        <line
          x1="450"
          y1="350"
          x2="900"
          y2="350"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="10,10"
        />
      </svg>

      {/* Elementos decorativos */}
      <div className="absolute" style={{ left: '20px', top: '20px' }}>
        <div className="text-4xl opacity-40">🪴</div>
      </div>
      <div className="absolute" style={{ right: '20px', top: '20px' }}>
        <div className="text-4xl opacity-40">🪴</div>
      </div>
      <div className="absolute" style={{ left: '20px', bottom: '80px' }}>
        <div className="text-4xl opacity-40">🪴</div>
      </div>
      <div className="absolute" style={{ right: '20px', bottom: '80px' }}>
        <div className="text-4xl opacity-40">🪴</div>
      </div>

      {/* Porta de entrada */}
      <div className="absolute" style={{ left: '50%', bottom: '20px', transform: 'translateX(-50%)' }}>
        <div className="glass-effect px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="text-2xl">🚪</span>
          <span className="text-white font-semibold text-xs">Entrada</span>
        </div>
      </div>
    </div>
  );
}

export { officeAreas };
export type { OfficeArea };

