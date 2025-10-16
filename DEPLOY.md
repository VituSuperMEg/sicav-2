# 🚀 Guia de Deploy - Virtual Meet

Este guia explica como fazer deploy da aplicação Virtual Meet na Vercel (frontend) e Render (servidor WebSocket).

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Conta na [Render](https://render.com) (gratuita)
- Código no GitHub (recomendado)

## 🎯 Arquitetura de Deploy

A aplicação tem dois componentes:
1. **Frontend (Next.js)** → Deploy na Vercel
2. **Servidor WebSocket** → Deploy no Render (ou Railway/Heroku)

---

## 1️⃣ Deploy do Servidor WebSocket no Render

### Passo 1: Preparar o repositório

Certifique-se de que o código está no GitHub.

### Passo 2: Criar Web Service no Render

1. Acesse [render.com](https://render.com) e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure o serviço:

**Configurações básicas:**
```
Name: virtual-meet-server
Region: Oregon (ou mais próximo)
Branch: main
Root Directory: server
Runtime: Node
```

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```
FRONTEND_URL=https://seu-app.vercel.app
PORT=3001
```

5. Clique em "Create Web Service"
6. Aguarde o deploy (pode levar alguns minutos)
7. **Copie a URL do servidor** (ex: `https://virtual-meet-server.onrender.com`)

### Nota sobre Render Free Tier
⚠️ O plano gratuito do Render desliga o servidor após 15 minutos de inatividade. 
O servidor leva ~30 segundos para reiniciar na primeira conexão.

---

## 2️⃣ Deploy do Frontend na Vercel

### Opção A: Deploy via Dashboard Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New..." → "Project"
3. Importe seu repositório do GitHub
4. Configure o projeto:

**Framework Preset:** Next.js

**Build & Development Settings:**
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**
```
NEXT_PUBLIC_SOCKET_URL=https://virtual-meet-server.onrender.com
```
*(Use a URL do servidor do passo anterior)*

5. Clique em "Deploy"
6. Aguarde o build completar

### Opção B: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Adicionar variável de ambiente
vercel env add NEXT_PUBLIC_SOCKET_URL production
# Cole a URL: https://virtual-meet-server.onrender.com

# Deploy em produção
vercel --prod
```

---

## 3️⃣ Atualizar CORS no Servidor

Após obter a URL da Vercel (ex: `https://virtual-meet.vercel.app`):

1. Volte ao Render Dashboard
2. Vá em seu serviço → "Environment"
3. Atualize a variável `FRONTEND_URL`:
```
FRONTEND_URL=https://virtual-meet.vercel.app
```
4. Salve (o serviço vai redeployar automaticamente)

---

## 4️⃣ Testar a Aplicação

1. Acesse sua URL da Vercel: `https://seu-app.vercel.app`
2. Crie uma sala
3. Abra em outra aba/navegador e entre na mesma sala
4. Teste a movimentação e proximidade

---

## 🔄 Alternativas ao Render

### Railway (Recomendado)

1. Acesse [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Selecione seu repositório
4. Configure:
   - Root Directory: `server`
   - Start Command: `npm start`
   - Variáveis de ambiente: `FRONTEND_URL`
5. Deploy!

**Vantagens:** Mais rápido que Render, sem cold starts no free tier (créditos mensais)

### Heroku

1. Crie um `Procfile` na pasta `server`:
```
web: npm start
```

2. Deploy:
```bash
cd server
heroku create virtual-meet-server
git subtree push --prefix server heroku main
```

---

## 📝 Checklist Final

- [ ] Servidor WebSocket deployado e rodando
- [ ] URL do servidor copiada
- [ ] Frontend deployado na Vercel
- [ ] Variável `NEXT_PUBLIC_SOCKET_URL` configurada
- [ ] CORS atualizado com URL da Vercel
- [ ] Testado em produção

---

## 🐛 Troubleshooting

### Erro: "Failed to connect to WebSocket"

**Solução:** Verifique se:
1. A variável `NEXT_PUBLIC_SOCKET_URL` está correta
2. O servidor Render está ativo (acesse `/health` para testar)
3. CORS está configurado com a URL correta

### Servidor Render muito lento

**Causa:** Cold start do free tier

**Soluções:**
1. Aguardar 30 segundos na primeira conexão
2. Usar Railway (sem cold starts)
3. Upgrade para Render paid tier ($7/mês)

### Build falhou na Vercel

**Solução:** Verifique:
1. Todas as dependências estão no `package.json`
2. TypeScript sem erros: `npm run build` localmente
3. Versão do Node compatível (18+)

---

## 💡 Melhorias Futuras

- [ ] Adicionar Redis para persistência de salas
- [ ] Implementar autenticação
- [ ] CDN para assets
- [ ] Monitoring com Sentry
- [ ] Analytics

---

## 🆘 Precisa de Ajuda?

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Render](https://render.com/docs)
- [Socket.io Docs](https://socket.io/docs/v4/)

---

**Dica:** Para desenvolvimento local, continue usando:
```bash
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

