# Franca Academy - Guia de Setup Completo

## Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (grátis): https://supabase.com
- Conta no Bunny.net (Stream): https://bunny.net
- Conta no Resend: https://resend.com
- Conta na Vercel: https://vercel.com

---

## 1. SUPABASE (Banco de Dados + Auth)

### 1.1 Criar Projeto
1. Acesse https://supabase.com e crie uma nova conta (ou logue)
2. Clique em "New Project"
3. Escolha um nome (ex: `franca-academy`)
4. Defina uma senha forte para o banco
5. Escolha a região mais próxima (São Paulo - South America)
6. Clique "Create new project"

### 1.2 Executar Schema SQL
1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em "New query"
3. Copie TODO o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor e clique "Run"
5. Deve mostrar "Success. No rows returned" (normal)

### 1.3 Inserir Dados de Exemplo (Seed)
1. Ainda no SQL Editor, crie uma nova query
2. Copie o conteúdo de `supabase/seed-example.sql`
3. **ANTES de executar**, substitua:
   - `COLE_SEU_KIWIFY_PRODUCT_ID_AQUI` → pelo ID do seu produto na Kiwify
   - `BUNNY_VIDEO_ID_AQUI` → pelos IDs reais dos vídeos no Bunny Stream
4. Execute

### 1.4 Pegar as Chaves
1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** → será `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → será `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NUNCA exponha no frontend)

### 1.5 Configurar Auth
1. Vá em **Authentication** → **Providers**
2. Certifique-se de que **Email** está habilitado
3. Vá em **Authentication** → **URL Configuration**
4. Em **Site URL**, coloque: `https://academy.francaassessoria.com`
5. Em **Redirect URLs**, adicione:
   - `https://academy.francaassessoria.com/api/auth/callback`
   - `http://localhost:3000/api/auth/callback` (para desenvolvimento)

### 1.6 Configurar Email Templates (Opcional)
1. Vá em **Authentication** → **Email Templates**
2. Para o template "Reset Password", ajuste o redirect URL:
   - Mude o link para: `{{ .SiteURL }}/api/auth/callback?next=/redefinir-senha&code={{ .Token }}`

---

## 2. BUNNY STREAM (Vídeos)

### 2.1 Criar Conta e Biblioteca
1. Acesse https://bunny.net e crie uma conta
2. No painel, vá em **Stream** → **Video Libraries**
3. Clique "Add Video Library"
4. Nome: `franca-academy`
5. Selecione a região (São Paulo se disponível, ou US)

### 2.2 Upload de Vídeos
1. Dentro da biblioteca, clique "Upload"
2. Faça upload de cada vídeo do curso
3. Após o upload, clique no vídeo
4. Copie o **Video ID** (formato: `xxxx-xxxx-xxxx-xxxx`)
5. Use este ID no campo `video_id` ao inserir aulas no banco

### 2.3 Pegar as Chaves
1. Na biblioteca de vídeos, vá em **API**
2. Copie:
   - **API Key** → será `BUNNY_STREAM_API_KEY`
   - **Library ID** → será `BUNNY_STREAM_LIBRARY_ID`
   - **CDN Hostname** → será `BUNNY_STREAM_CDN_HOSTNAME`
3. Em **Security**, habilite "Token Authentication" (opcional mas recomendado)
   - Copie a **Token Authentication Key** → será `BUNNY_STREAM_TOKEN_KEY`

### 2.4 Personalizar Player (Opcional)
1. Na biblioteca, vá em **Player**
2. Mude a cor do player para `#7de08d` (verde da marca)
3. Pode personalizar watermark, controles, etc.

---

## 3. RESEND (Emails)

### 3.1 Criar Conta
1. Acesse https://resend.com e crie uma conta
2. Vá em **API Keys** e crie uma nova key
3. Copie → será `RESEND_API_KEY`

### 3.2 Configurar Domínio
1. Vá em **Domains** → **Add Domain**
2. Adicione: `francaassessoria.com`
3. Siga as instruções para adicionar os registros DNS (MX, TXT, DKIM)
4. Aguarde a verificação (pode levar até 72h, geralmente minutos)
5. Depois de verificado, os emails sairão como `noreply@francaassessoria.com`

> **Nota**: Enquanto o domínio não estiver verificado, use o email de teste do Resend.

---

## 4. KIWIFY (Webhook)

### 4.1 Configurar Webhook
1. Acesse o painel da Kiwify
2. Vá no seu produto → **Configurações** → **Webhooks**
3. Adicione um novo webhook:
   - **URL**: `https://academy.francaassessoria.com/api/webhooks/kiwify`
   - **Eventos**: Selecione `order_approved` e `order_refunded`
4. Se a Kiwify fornecer um **Secret/Token**, copie-o → será `KIWIFY_WEBHOOK_SECRET`

### 4.2 Mapear Produto ao Curso
1. Pegue o **product_id** do seu produto na Kiwify
2. Certifique-se de que é o MESMO valor que você colocou no campo `kiwify_product_id` da tabela `courses` no Supabase

---

## 5. PROJETO (Instalação Local)

### 5.1 Instalar
```bash
cd franca-academy
npm install
```

### 5.2 Configurar Variáveis de Ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` e preencha todas as variáveis com os valores obtidos acima.

### 5.3 Rodar Localmente
```bash
npm run dev
```

Acesse: http://localhost:3000

### 5.4 Testar Login
Para testar sem o webhook da Kiwify, crie um usuário de teste:
1. Vá no Supabase → **Authentication** → **Users**
2. Clique "Add User" → "Create User"
3. Preencha email e senha
4. Depois, no SQL Editor, adicione a compra manualmente:
```sql
INSERT INTO public.user_purchases (user_id, course_id)
VALUES ('UUID_DO_USER', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890');
```

---

## 6. VERCEL (Deploy)

### 6.1 Subir para GitHub
```bash
cd franca-academy
git init
git add .
git commit -m "Initial commit - Franca Academy"
```
Crie um repositório no GitHub e faça push.

### 6.2 Conectar na Vercel
1. Acesse https://vercel.com
2. Importe o repositório do GitHub
3. Em **Environment Variables**, adicione TODAS as variáveis do `.env.local`
4. Clique "Deploy"

### 6.3 Configurar Domínio
1. No projeto na Vercel, vá em **Settings** → **Domains**
2. Adicione: `academy.francaassessoria.com`
3. A Vercel vai te mostrar os registros DNS necessários
4. No seu provedor de domínio, adicione:
   - **Tipo**: CNAME
   - **Nome**: academy
   - **Valor**: `cname.vercel-dns.com`
5. Aguarde propagação (até 48h, geralmente minutos)

### 6.4 Atualizar URLs
Depois do deploy, atualize:
- Supabase → Site URL e Redirect URLs
- Kiwify → URL do Webhook
- `.env.local` na Vercel → `NEXT_PUBLIC_APP_URL`

---

## 7. FLUXO COMPLETO (Como Funciona)

```
1. Cliente compra na Kiwify
   ↓
2. Kiwify envia webhook POST → /api/webhooks/kiwify
   ↓
3. Webhook processa:
   a. Encontra o curso pelo kiwify_product_id
   b. Verifica se usuário já existe (por email)
   c. Se NÃO existe: cria no Supabase + gera senha
   d. Cria registro em user_purchases
   e. Envia email de boas-vindas com login/senha (Resend)
   ↓
4. Cliente recebe email com credenciais
   ↓
5. Cliente acessa academy.francaassessoria.com/login
   ↓
6. Após login, vê seus cursos desbloqueados
   ↓
7. Assiste aulas (vídeos via Bunny Stream)
   ↓
8. Seções bloqueadas (Serviços/Consultoria) → WhatsApp
```

---

## Custos Estimados (mensal)

| Serviço | Plano | Custo |
|---------|-------|-------|
| Supabase | Free | R$ 0 |
| Bunny Stream | Pay-as-you-go | ~R$ 5-15 |
| Resend | Free (3k emails/mês) | R$ 0 |
| Vercel | Free (hobby) | R$ 0 |
| **Total** | | **~R$ 5-15/mês** |

---

## Troubleshooting

### Webhook não funciona
- Verifique se a URL do webhook está correta na Kiwify
- Confira se `SUPABASE_SERVICE_ROLE_KEY` está configurada na Vercel
- Veja os logs no Vercel: **Logs** → filtre por `/api/webhooks/kiwify`

### Email não chega
- Verifique se o domínio está verificado no Resend
- Confira `RESEND_API_KEY` e `RESEND_FROM_EMAIL`
- Verifique a pasta de spam

### Vídeo não carrega
- Confirme que o `video_id` está correto no banco
- Verifique `BUNNY_STREAM_LIBRARY_ID` e `BUNNY_STREAM_TOKEN_KEY`
- Certifique-se de que o vídeo foi processado no Bunny Stream

### Login não funciona
- Verifique se o Redirect URL está configurado no Supabase
- Confira as chaves `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
