# ⚡ Deploy Rápido - 5 Minutos

## 1. Deploy do Servidor (Render)

1. Acesse [render.com](https://render.com) → Login com GitHub
2. "New +" → "Web Service"
3. Conecte seu repositório
4. Configure:
   - **Name:** `virtual-meet-server`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Clique "Create Web Service"
6. **Copie a URL** (ex: `https://virtual-meet-server.onrender.com`)

## 2. Deploy do Frontend (Vercel)

### Via Dashboard:

1. Acesse [vercel.com](https://vercel.com) → Login com GitHub
2. "Add New..." → "Project"
3. Importe seu repositório
4. **IMPORTANTE:** Antes de clicar Deploy, adicione:
   - Em "Environment Variables"
   - Key: `NEXT_PUBLIC_SOCKET_URL`
   - Value: `https://virtual-meet-server.onrender.com` (a URL do passo 1)
5. Clique "Deploy"

### Via CLI (Alternativa):

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Adicionar variável
vercel env add NEXT_PUBLIC_SOCKET_URL
# Cole a URL do servidor Render

# Deploy produção
vercel --prod
```

## 3. Atualizar CORS

1. Volte ao Render
2. Seu serviço → "Environment"
3. Adicione variável:
   - Key: `FRONTEND_URL`
   - Value: `https://seu-app.vercel.app` (a URL da Vercel)
4. Salvar (vai redeployar)

## ✅ Pronto!

Acesse `https://seu-app.vercel.app` e teste!

---

## 🐛 Problemas?

**Erro de conexão WebSocket:**
- Aguarde 30 segundos (cold start do Render)
- Verifique se `NEXT_PUBLIC_SOCKET_URL` está correto na Vercel

**Leia o [DEPLOY.md](./DEPLOY.md) completo para mais detalhes**

