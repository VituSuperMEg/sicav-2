# Virtual Meet - Servidor WebSocket

Servidor Node.js com Socket.io para comunicação em tempo real.

## Executar Localmente

```bash
npm install
npm start
```

O servidor rodará em `http://localhost:3001`

## Deploy no Render

Este servidor está configurado para deploy automático no Render.

### Configuração Manual:

1. **New Web Service** no Render
2. Configurações:
   - **Name**: virtual-meet-server
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Variáveis de Ambiente:
   - `FRONTEND_URL`: URL do frontend na Vercel
   - `NODE_ENV`: production

## Endpoints

- `GET /health` - Health check (retorna status do servidor)
- Socket.io na raiz para comunicação WebSocket

## Eventos Socket.io

- `user:joined` - Usuário entrou na sala
- `user:left` - Usuário saiu da sala
- `user:moved` - Usuário se moveu
- `users:update` - Atualização de lista de usuários
- `signal` - Sinalização WebRTC
- `screen:share:start` - Compartilhamento de tela iniciado
- `screen:share:stop` - Compartilhamento de tela parado

