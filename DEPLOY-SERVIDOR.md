# 🚀 Deploy Rápido do Servidor WebSocket

Como você já fez deploy do frontend na Vercel, agora precisa fazer deploy do servidor WebSocket.

## 1️⃣ Deploy no Render (GRATUITO)

### Passo 1: Criar conta
1. Acesse [render.com](https://render.com)
2. Faça login com GitHub

### Passo 2: Criar Web Service
1. Clique em "New +" → "Web Service"
2. Conecte seu repositório do GitHub
3. **IMPORTANTE**: Configure EXATAMENTE assim:

```
Name: virtual-meet-server
Region: Oregon (ou mais próximo do Brasil)
Branch: main (ou master)

⚠️ ROOT DIRECTORY: server (MUITO IMPORTANTE!)

Environment: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

**ATENÇÃO**: Se você não colocar `server` no Root Directory, vai dar erro!

### Passo 3: Variáveis de Ambiente
Adicione estas variáveis:

```
NODE_ENV=production
FRONTEND_URL=https://seu-app.vercel.app
```
*(Substitua pela URL real da sua aplicação na Vercel)*

### Passo 4: Deploy
1. Clique em "Create Web Service"
2. Aguarde 3-5 minutos
3. **Copie a URL** que aparece (ex: `https://virtual-meet-server.onrender.com`)

---

## 2️⃣ Configurar Vercel

### Passo 1: Adicionar Variável de Ambiente
1. Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em "Settings" → "Environment Variables"
4. Adicione:

```
Key: NEXT_PUBLIC_SOCKET_URL
Value: https://virtual-meet-server.onrender.com
```
*(Use a URL do Render que você copiou)*

### Passo 2: Redeploy
1. Vá em "Deployments"
2. Clique nos 3 pontinhos do último deployment
3. Clique em "Redeploy"

---

## 3️⃣ Atualizar CORS no Render

1. Volte ao Render
2. Vá em seu serviço → "Environment"
3. Edite `FRONTEND_URL`:

```
FRONTEND_URL=https://seu-app-real.vercel.app
```

4. Salve (vai redeployar automaticamente)

---

## ✅ Testar

1. Acesse sua URL da Vercel
2. Abra em 2 abas/navegadores diferentes
3. Entre na mesma sala
4. Você deve ver os outros usuários!

---

## ⚠️ Importante - Render Free Tier

O plano gratuito do Render:
- ✅ É totalmente funcional
- ⚠️ Desliga após 15 minutos sem uso
- ⏱️ Leva ~30 segundos para reiniciar na primeira conexão
- 💡 Depois disso funciona normalmente

Se precisar de um servidor sempre ativo, considere Railway (tem créditos grátis mensais).

---

## 🐛 Problemas?

**Erro "Failed to connect":**
- Aguarde 30 segundos (cold start)
- Verifique se a URL está correta
- Verifique se o CORS está configurado

**Usuários não aparecem:**
- Verifique no Console (F12) se conectou ao servidor
- Deve aparecer "Connected to server"

---

## 🎉 Pronto!

Agora sua aplicação está 100% funcional na nuvem!

