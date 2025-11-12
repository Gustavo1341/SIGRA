# Configuração de Email de Recuperação de Senha

## Problema Identificado

O botão "Esqueci minha senha" não está funcionando em produção porque:

1. ✅ O código frontend está correto
2. ✅ As variáveis de ambiente do EmailJS estão configuradas
3. ❌ **O Supabase Auth precisa ser configurado para enviar emails**

## Solução Implementada

Alteramos o serviço para usar **Supabase Auth** como método principal, que é mais confiável e já está integrado ao sistema.

### Mudanças no Código

- `requestPasswordReset()` agora usa Supabase Auth (antes usava EmailJS)
- `requestPasswordResetWithEmailJS()` mantém o método EmailJS como alternativa

## Configuração Necessária no Supabase

### 1. Acessar o Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: `sbxrzkmscujbvcwzmnfv`

### 2. Configurar Email Templates

1. No menu lateral, vá em **Authentication** → **Email Templates**
2. Selecione **Reset Password**
3. Configure o template:

```html
<h2>Redefinir Senha - SIGRA</h2>
<p>Olá,</p>
<p>Você solicitou a redefinição de senha para sua conta no SIGRA.</p>
<p>Clique no botão abaixo para redefinir sua senha:</p>
<p><a href="{{ .ConfirmationURL }}">Redefinir Senha</a></p>
<p>Este link é válido por 1 hora.</p>
<p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
<p>Atenciosamente,<br>Equipe SIGRA</p>
```

### 3. Configurar URL de Redirecionamento

1. Vá em **Authentication** → **URL Configuration**
2. Adicione a URL de redirecionamento:
   - **Site URL**: `https://sigra-seven.vercel.app`
   - **Redirect URLs**: Adicione `https://sigra-seven.vercel.app/#/reset-password`

### 4. Configurar SMTP (Opcional - Para Email Customizado)

Por padrão, o Supabase usa seu próprio servidor SMTP. Para usar um servidor customizado:

1. Vá em **Project Settings** → **Auth**
2. Role até **SMTP Settings**
3. Configure:
   - **SMTP Host**: seu servidor SMTP
   - **SMTP Port**: 587 (ou 465 para SSL)
   - **SMTP User**: seu usuário
   - **SMTP Password**: sua senha
   - **Sender Email**: email@seudominio.com
   - **Sender Name**: SIGRA

## Testando a Funcionalidade

### 1. Teste Local

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

1. Acesse http://localhost:5173/login
2. Clique em "Esqueci minha senha"
3. Digite um email cadastrado
4. Verifique o email recebido

### 2. Teste em Produção

1. Faça o deploy da nova versão
2. Acesse a página de login em produção
3. Teste o fluxo de recuperação de senha

## Verificação de Logs

Para verificar se os emails estão sendo enviados:

1. Acesse o Dashboard do Supabase
2. Vá em **Logs** → **Auth Logs**
3. Procure por eventos de tipo `password_recovery`

## Troubleshooting

### Email não está chegando

1. **Verifique a pasta de spam**
2. **Verifique os logs do Supabase** (Auth Logs)
3. **Verifique se o email está cadastrado** no sistema
4. **Verifique as configurações de SMTP** (se customizado)

### Link de redefinição não funciona

1. **Verifique a URL de redirecionamento** nas configurações do Supabase
2. **Verifique se o token não expirou** (válido por 1 hora)
3. **Limpe o cache do navegador**

### Erro de CORS

1. Adicione o domínio de produção nas **Redirect URLs** do Supabase
2. Verifique se a URL está correta (com ou sem `#`)

## Alternativa: Usar EmailJS

Se preferir continuar usando EmailJS, reverta a mudança e use:

```typescript
// Em ForgotPasswordPage.tsx, linha 21
const response = await passwordResetService.requestPasswordResetWithEmailJS(email);
```

Mas lembre-se de verificar:
- ✅ Variáveis de ambiente carregadas no build
- ✅ Serviço EmailJS ativo
- ✅ Template configurado corretamente
- ✅ Domínio autorizado no EmailJS

## Próximos Passos

1. ✅ Código atualizado para usar Supabase Auth
2. ⏳ Configurar Email Templates no Supabase
3. ⏳ Configurar URLs de redirecionamento
4. ⏳ Testar em produção
5. ⏳ Monitorar logs de autenticação

## Suporte

Se o problema persistir, verifique:
- Console do navegador (F12) para erros JavaScript
- Network tab para ver requisições falhando
- Logs do Supabase para erros de autenticação
