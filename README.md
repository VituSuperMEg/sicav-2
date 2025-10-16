# 🎮 Virtual Meet

Sistema de reuniões online com espaço virtual interativo, similar ao Gather, onde usuários podem se movimentar livremente, conversar por proximidade e compartilhar tela.

## ✨ Funcionalidades

- 🏢 **Layout de Escritório Virtual**: Ambiente com diferentes áreas (mesas, salas de reunião, café, lounge)
- 🚶 **Movimentação Livre**: Ande pelo espaço virtual usando WASD ou setas do teclado
- 🎙️ **Áudio Espacial**: Ouça apenas quem está próximo de você (proximidade configurável)
- 🎥 **Vídeo em Tempo Real**: Compartilhe sua câmera com outros participantes
- 🖥️ **Compartilhamento de Tela**: Apresente sua tela para o grupo
- 🗺️ **Minimapa**: Visualize sua posição e a de outros usuários em tempo real
- 📍 **Detecção de Área**: Saiba em qual área do escritório você está
- 👥 **Lista de Pessoas Próximas**: Veja quem está ao seu redor
- 🎨 **Design Moderno**: Interface bonita e moderna inspirada no Expo
- 🌈 **Avatares Personalizados**: Escolha seu emoji favorito como avatar

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS com design system customizado
- **Estado**: Zustand para gerenciamento de estado
- **Comunicação em Tempo Real**: Socket.io
- **WebRTC**: Simple-peer para áudio/vídeo P2P
- **Animações**: Framer Motion
- **Ícones**: Lucide React

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto

2. Instale as dependências:
```bash
npm install
```

### Executar o Projeto

O projeto possui dois servidores que devem ser executados simultaneamente:

1. **Servidor WebSocket** (porta 3001):
```bash
npm run server
```

2. **Aplicação Next.js** (porta 3000):
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🌐 Deploy em Produção

Para fazer deploy na Vercel e Render, siga o guia completo em **[DEPLOY.md](./DEPLOY.md)**

**Resumo rápido:**
1. Deploy do servidor WebSocket no [Render](https://render.com) (gratuito)
2. Deploy do frontend na [Vercel](https://vercel.com) (gratuito)
3. Configure a variável `NEXT_PUBLIC_SOCKET_URL` na Vercel

Leia o [DEPLOY.md](./DEPLOY.md) para instruções detalhadas passo a passo.

## 📖 Como Usar

### Criar uma Sala

1. Digite seu nome
2. Escolha um avatar
3. Clique em "Criar e entrar"
4. Compartilhe o código da sala com outros participantes

### Entrar em uma Sala

1. Digite seu nome
2. Escolha um avatar
3. Selecione "Entrar em sala"
4. Digite o código da sala
5. Clique em "Entrar na sala"

### Controles

- **WASD** ou **Setas**: Mover seu avatar manualmente pelo escritório
- **Duplo Clique no Mapa**: Navegar automaticamente até a posição (seu avatar caminha)
- **Botão de Navegação**: Menu rápido para ir a qualquer área do escritório
- **Botão de Microfone**: Ativar/desativar áudio (ouça quem está perto)
- **Botão de Vídeo**: Ativar/desativar câmera
- **Botão de Tela**: Iniciar/parar compartilhamento de tela
- **Configurações**: Ajustar volume e raio de proximidade

**Dicas:**
- Pressione qualquer tecla de movimento para cancelar a navegação automática
- O avatar mostra "🚶 Navegando..." quando está em movimento automático
- Um marcador ✕ aparece no destino durante a navegação

### Áreas do Escritório

- **🏢 Salas de Reunião**: Espaços para reuniões em grupo
- **📊 Área de Apresentação**: Local para compartilhar tela e apresentar
- **💻 Mesas de Trabalho**: Áreas individuais de foco
- **☕ Café**: Espaço informal para conversas
- **🛋️ Lounge**: Área de relaxamento
- **💡 Brainstorm**: Espaço para ideação
- **🎮 Área de Games**: Espaço de descontração

## 🎨 Design System

O projeto utiliza um design system moderno com:

- **Cores**: Paleta de cores gradiente (primary, secondary, accent)
- **Componentes**: Button, Input, Card, IconButton
- **Efeitos**: Glass morphism, sombras suaves, animações
- **Tipografia**: Inter como fonte principal
- **Responsividade**: Layout adaptável para diferentes telas

## 📁 Estrutura do Projeto

```
virtual-meet/
├── app/                      # Páginas Next.js
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página inicial
│   └── room/[roomId]/       # Página da sala
├── components/              # Componentes React
│   ├── ui/                  # Componentes do design system
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── IconButton.tsx
│   └── VirtualSpace/        # Componentes do espaço virtual
│       ├── Canvas.tsx       # Área de movimentação
│       ├── Avatar.tsx       # Avatar do usuário
│       └── ControlPanel.tsx # Controles de mídia
├── hooks/                   # Hooks customizados
│   ├── useSocket.ts         # Hook para Socket.io
│   └── useWebRTC.ts         # Hook para WebRTC
├── lib/                     # Utilitários
│   ├── utils.ts             # Funções auxiliares
│   └── constants.ts         # Constantes
├── store/                   # Estado global
│   └── useRoomStore.ts      # Store da sala
├── types/                   # Tipos TypeScript
│   └── index.ts
└── server/                  # Servidor WebSocket
    └── index.ts
```

## 🔧 Configurações Avançadas

### Ajustar Raio de Proximidade

No painel de configurações (ícone de engrenagem), você pode ajustar:
- Volume do áudio (0-100%)
- Raio de proximidade (100-400px)
- Qualidade do vídeo (baixa/média/alta)

### Personalizar o Canvas

Edite `lib/constants.ts` para alterar:
- Tamanho do canvas
- Tamanho dos avatares
- Velocidade de movimentação
- Raio de proximidade padrão

## 🌟 Funcionalidades Futuras

- [ ] Chat de texto
- [ ] Salas privadas com senha
- [ ] Histórico de mensagens
- [ ] Reações e emojis
- [ ] Gravação de reuniões
- [ ] Whiteboard colaborativo
- [ ] Breakout rooms
- [ ] Integração com calendário

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

Feito com ❤️ usando Next.js, Socket.io e WebRTC
