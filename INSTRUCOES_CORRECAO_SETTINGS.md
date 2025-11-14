# Instruções para Corrigir a Página de Configurações

## Problemas Corrigidos

### 1. ✅ Erro de Acessibilidade (Labels)
- **Problema**: Labels com `htmlFor` não correspondiam aos IDs dos inputs
- **Solução**: Adicionados prefixos únicos aos IDs:
  - Campos de perfil: `profile-name`, `profile-email`, `profile-bio`
  - Campos de senha: `password-current_password`, `password-new_password`, `password-confirm_password`

### 2. ✅ Salvamento de Perfil
- **Problema**: Dados não eram salvos no Supabase (apenas simulação)
- **Solução**: Integrado com `authService.updateProfile()` para salvar no banco de dados
- **Validações adicionadas**:
  - Nome não pode estar vazio
  - Email deve ser válido
  - Email não pode estar em uso por outro usuário

### 3. ✅ Alteração de Senha
- **Problema**: Função não implementada
- **Solução**: Criada função SQL `change_user_password` e integrada com o serviço

## Passo a Passo para Aplicar as Correções

### Etapa 1: Executar as Funções SQL no Supabase

Execute os seguintes arquivos SQL no Supabase Dashboard (SQL Editor):

1. **add-update-profile-function.sql**
   - Função para atualizar perfil (nome e email)
   - Valida se o email está disponível

2. **add-change-password-function.sql**
   - Função para alterar senha
   - Valida senha atual e faz hash bcrypt

**Como executar:**
1. Abra o Supabase Dashboard
2. Vá em **SQL Editor**
3. Para cada arquivo:
   - Abra o arquivo
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **Run** para executar

### Etapa 2: Testar a Página de Configurações

1. Faça login no sistema
2. Acesse **Configurações**
3. Teste a aba **Perfil**:
   - Altere seu nome
   - Altere seu email
   - Clique em "Salvar Alterações"
   - Verifique se aparece a mensagem de sucesso
   - Recarregue a página e confirme que as alterações foram salvas

4. Teste a aba **Segurança**:
   - Clique em "Alterar Senha"
   - Digite a senha atual
   - Digite uma nova senha forte
   - Confirme a nova senha
   - Clique em "Alterar Senha"
   - Verifique se aparece a mensagem de sucesso
   - Faça logout e tente fazer login com a nova senha

## Validações Implementadas

### Perfil
- ✅ Nome não pode estar vazio
- ✅ Email deve conter "@"
- ✅ Email não pode estar em uso por outro usuário
- ✅ Mensagens de erro claras

### Senha
- ✅ Todos os campos obrigatórios
- ✅ Senha atual deve estar correta
- ✅ Nova senha e confirmação devem coincidir
- ✅ Força da senha (mínimo 50% - média)
- ✅ Indicador visual de força da senha
- ✅ Dicas de senha forte

## Melhorias de Acessibilidade

- ✅ Todos os labels têm `htmlFor` correspondente ao `id` do input
- ✅ Botão de mostrar/ocultar senha tem `aria-label`
- ✅ IDs únicos para evitar conflitos
- ✅ Estrutura semântica correta

## Arquivos Criados/Modificados

### Arquivos SQL (EXECUTAR NO SUPABASE)
1. `add-update-profile-function.sql` - Função para atualizar perfil
2. `add-change-password-function.sql` - Função para alterar senha
3. `add-check-email-function.sql` - Função auxiliar (opcional)

### Arquivos TypeScript
1. `pages/SettingsPage.tsx` - Componente principal
2. `services/auth.service.ts` - Serviço de autenticação

## Observações Importantes

- A função SQL usa `crypt()` com bcrypt para hash seguro de senhas
- A senha atual é validada antes de permitir a alteração
- Todas as operações são feitas de forma segura no backend
- Mensagens de erro são claras e específicas
- A interface não fica mais em branco após salvar
