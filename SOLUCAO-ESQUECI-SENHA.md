# Solução: Botão "Esqueci Minha Senha" Não Funciona em Produção

## Problema Identificado

O botão estava usando `requestPasswordReset()` que depende do Supabase Auth, mas o Supabase não está configurado para enviar emails.

## ✅ Solução Aplicada

Alteramos o código para usar `requestPasswordResetWithEmailJS()` que usa o EmailJS já configurado.

## Próximos Passos

### 1. Verificar Variáveis de Ambiente no Vercel

Acesse: https://vercel.com/dashboard → Seu Projeto → Settings → Environment Variables

Confirme que estas variáveis estão configuradas:

```
VITE_EMAILJS_SERVICE_ID=service_eyc3gfr
VITE_EMAILJS_TEMPLATE_ID=template_aet7zn8
VITE_EMAILJS_PUBLIC_KEY=LwczwCL-FhlNqpFNL
VITE_SITE_URL=https://sigra-seven.vercel.app
```

**IMPORTANTE:** Marque todas as opções (Production, Preview, Development)

### 2. Fazer Redeploy

Após confirmar as variáveis:

```bash
git add .
git commit -m "fix: usar EmailJS para recuperação de senha"
git push
```

Ou no Vercel:
1. Vá em **Deployments**
2. Clique nos três pontos do último deploy
3. Selecione **Redeploy**

### 3. Testar em Produção

1. Acesse: https://sigra-seven.vercel.app/login
2. Clique em "Esqueci minha senha"
3. Digite um email cadastrado
4. Verifique se o email chegou (também na pasta de spam)

## Como Funciona Agora

1. Usuário digita o email
2. Sistema cria um token de recuperação no Supabase
3. EmailJS envia o email com o link de recuperação
4. Usuário clica no link e redefine a senha

## Verificar se EmailJS Está Funcionando

Se o email não chegar, verifique:

1. **Console do navegador** (F12) para erros
2. **Logs do EmailJS**: https://dashboard.emailjs.com/admin
3. **Cota do EmailJS**: Plano gratuito tem limite de 200 emails/mês

## Alternativa: Configurar Supabase Auth

Se preferir usar o Supabase Auth (recomendado para longo prazo):

1. Acesse: https://supabase.com/dashboard
2. Vá em **Authentication** → **Email Templates** → **Reset Password**
3. Configure o template de email
4. Vá em **Authentication** → **URL Configuration**
5. Adicione:
   - Site URL: `https://sigra-seven.vercel.app`
   - Redirect URLs: `https://sigra-seven.vercel.app/#/reset-password`
6. Reverta o código para usar `requestPasswordReset()`

## Troubleshooting

### Email não chega
- ✅ Verifique spam
- ✅ Confirme que o email está cadastrado no sistema
- ✅ Verifique cota do EmailJS
- ✅ Veja logs no console do navegador

### Erro "EmailJS não configurado"
- ✅ Confirme variáveis de ambiente no Vercel
- ✅ Faça redeploy após adicionar variáveis
- ✅ Limpe cache do navegador

### Link de redefinição não funciona
- ✅ Token expira em 1 hora
- ✅ Limpe cache do navegador
- ✅ Solicite novo link

## Suporte

Se o problema persistir:
1. Abra o console do navegador (F12)
2. Vá na aba Network
3. Tente recuperar a senha
4. Veja se há erros nas requisições
5. Compartilhe os erros para análise
