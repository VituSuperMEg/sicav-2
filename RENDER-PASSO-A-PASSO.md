# 🚀 Deploy no Render - Passo a Passo com Imagens

## ❌ Erro que você teve

```
Module not found: Can't resolve '@/lib/utils'
```

**Causa**: O Render tentou fazer build do Next.js em vez do servidor.

**Solução**: Configurar o **Root Directory** corretamente!

---

## ✅ Passo a Passo Correto

### 1. Acesse o Render

1. Vá em [render.com](https://render.com)
2. Faça login com GitHub
3. Clique em **"New +"** no topo
4. Selecione **"Web Service"**

### 2. Conecte o Repositório

1. Procure pelo repositório: `sicav-2` (ou o nome do seu repo)
2. Clique em **"Connect"**

### 3. Configurações IMPORTANTES ⚠️

Preencha EXATAMENTE assim:

**Nome do Serviço:**
```
virtual-meet-server
```

**Region:**
```
Oregon (US West)
```
(Escolha o mais próximo do Brasil para melhor performance)

**Branch:**
```
main
```
(ou `master` se for o nome da sua branch principal)

**🔴 ROOT DIRECTORY (MUITO IMPORTANTE!):**
```
server
```
**⚠️ SEM essa configuração, dá o erro que você teve!**

**Environment:**
```
Node
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Plan:**
```
Free
```

### 4. Variáveis de Ambiente

Clique em **"Advanced"** e adicione:

**Variável 1:**
```
Name: NODE_ENV
Value: production
```

**Variável 2:**
```
Name: FRONTEND_URL  
Value: https://seu-app.vercel.app
```
(Substitua pela URL REAL da sua app na Vercel!)

**Variável 3:**
```
Name: PORT
Value: 10000
```

### 5. Criar Serviço

1. Clique em **"Create Web Service"**
2. Aguarde 3-5 minutos
3. Você verá logs do deploy
4. Quando aparecer "Deploy live", está pronto! ✅

### 6. Copiar URL

No topo da página, você verá a URL:
```
https://virtual-meet-server.onrender.com
```

**COPIE essa URL!** Você vai precisar dela.

---

## 📝 Configurar na Vercel

### 1. Acessar Projeto na Vercel

1. Vá em [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto

### 2. Adicionar Variável de Ambiente

1. Clique em **"Settings"**
2. No menu lateral, clique em **"Environment Variables"**
3. Clique em **"Add New"**
4. Preencha:

```
Name: NEXT_PUBLIC_SOCKET_URL
Value: https://virtual-meet-server.onrender.com
```
(Use a URL que você copiou do Render)

5. Selecione: **Production**, **Preview**, **Development**
6. Clique em **"Save"**

### 3. Redeploy

1. Vá em **"Deployments"** no menu lateral
2. No deployment mais recente, clique nos **3 pontinhos** (⋯)
3. Clique em **"Redeploy"**
4. Confirme

Aguarde 1-2 minutos e pronto!

---

## 🧪 Testar

1. Abra sua URL da Vercel em **2 abas diferentes**
2. Entre na **mesma sala** nas duas
3. Você deve ver:
   - ✅ Os avatares dos outros usuários
   - ✅ No minimapa (canto direito)
   - ✅ Na lista "Pessoas por perto" quando aproximar

---

## 🐛 Troubleshooting

### Servidor não responde

**Causa**: Render Free desliga após 15 min sem uso

**Solução**: 
- Aguarde 30 segundos na primeira conexão
- O servidor vai "acordar" automaticamente
- Depois funciona normalmente

### Erro de CORS

**Causa**: URL do frontend não configurada

**Solução**:
1. Volte no Render
2. Vá em Environment
3. Edite `FRONTEND_URL` com a URL correta da Vercel
4. Salve (vai redeployar)

### "Failed to connect"

**Causa**: URL do servidor errada na Vercel

**Solução**:
1. Verifique se `NEXT_PUBLIC_SOCKET_URL` está correta
2. Faça redeploy na Vercel

---

## ✅ Checklist Final

- [ ] Servidor deployado no Render com Root Directory = `server`
- [ ] URL do servidor copiada
- [ ] Variável NEXT_PUBLIC_SOCKET_URL adicionada na Vercel
- [ ] Redeploy feito na Vercel
- [ ] Testado em 2 abas diferentes
- [ ] Usuários aparecem uns para os outros

---

## 🎉 Pronto!

Sua aplicação está 100% funcional na nuvem!

**URLs:**
- Frontend: `https://seu-app.vercel.app`
- Servidor: `https://virtual-meet-server.onrender.com`

