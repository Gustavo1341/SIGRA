# Configuração de Deploy no Vercel

## Variáveis de Ambiente Necessárias

Para que o sistema de recuperação de senha funcione corretamente em produção, você precisa configurar as seguintes variáveis de ambiente no Vercel:

### 1. Acessar Configurações do Projeto

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **sigra-seven**
3. Vá em **Settings** → **Environment Variables**

### 2. Adicionar Variáveis de Ambiente

Adicione as seguintes variáveis:

#### Supabase (Obrigatório)
```
VITE_SUPABASE_URL=https://sbxrzkmscujbvcwzmnfv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNieHJ6a21zY3VqYnZjd3ptbmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTIxNzUsImV4cCI6MjA3Nzg2ODE3NX0.z-JgJcBf1-ClY9zoHhDTbNqrMRVywIen7HLgweP2TkY
```

#### URL do Site (Obrigatório para recuperação de senha)
```
VITE_SITE_URL=https://sigra-seven.vercel.app
```

#### EmailJS (Opcional - se usar método alternativo)
```
VITE_EMAILJS_SERVICE_ID=service_eyc3gfr
VITE_EMAILJS_TEMPLATE_ID=template_aet7zn8
VITE_EMAILJS_PUBLIC_KEY=LwczwCL-FhlNqpFNL
```

### 3. Configurar para Todos os Ambientes

Certifique-se de marcar as opções:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Fazer Redeploy

Após adicionar as variáveis:
1. Vá em **Deployments**
2. Clique nos três pontos do último deploy
3. Selecione **Redeploy**

## Configuração do Supabase

Além das variáveis de ambiente, você precisa configurar o Supabase:

### 1. Email Templates

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto
3. Vá em **Authentication** → **Email Templates** → **Reset Password**
4. Configure o template (veja CONFIGURACAO-EMAIL-RECUPERACAO-SENHA.md)

### 2. URL Configuration

1. Vá em **Authentication** → **URL Configuration**
2. Configure:
   - **Site URL**: `https://sigra-seven.vercel.app`
   - **Redirect URLs**: Adicione `https://sigra-seven.vercel.app/#/reset-password`

## Testando em Produção

Após o deploy:

1. Acesse: https://sigra-seven.vercel.app/login
2. Clique em "Esqueci minha senha"
3. Digite um email cadastrado
4. Verifique se o email chegou
5. Clique no link e redefina a senha

## Troubleshooting

### Email não chega

1. Verifique os logs do Supabase (Auth Logs)
2. Verifique a pasta de spam
3. Confirme que `VITE_SITE_URL` está configurado corretamente

### Link de redefinição não funciona

1. Verifique se a URL de redirecionamento está configurada no Supabase
2. Limpe o cache do navegador
3. Verifique se o token não expirou (válido por 1 hora)

### Variáveis de ambiente não carregam

1. Certifique-se de que todas começam com `VITE_`
2. Faça um redeploy após adicionar variáveis
3. Verifique no console do navegador se as variáveis estão undefined

## Comandos Úteis

### Build local para testar produção
```bash
npm run build
npm run preview
```

### Ver logs do Vercel
```bash
vercel logs
```

### Forçar novo deploy
```bash
git commit --allow-empty -m "Trigger deploy"
git push
```
