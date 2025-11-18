# Migrations do Supabase

Este diretório contém as migrations SQL para o banco de dados do SIGRA.

## Como Aplicar as Migrations

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo SQL da migration
6. Clique em **Run** para executar

### Opção 2: Via Supabase CLI

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Fazer login
supabase login

# Linkar ao projeto
supabase link --project-ref your-project-ref

# Aplicar migration
supabase db push
```

## Migrations Disponíveis

### add-password-hash-trigger.sql

**Descrição**: Adiciona trigger automático para fazer hash de senhas usando bcrypt.

**Quando aplicar**: Imediatamente, antes de criar novos usuários.

**O que faz**:
- Cria função `hash_password()` que usa bcrypt para fazer hash de senhas
- Cria trigger `trigger_hash_password` que executa automaticamente antes de INSERT/UPDATE na tabela `users`
- Detecta se a senha já está hasheada (começa com $2) e não faz hash novamente
- Usa 10 rounds de bcrypt para segurança adequada

**Importante**: Após aplicar esta migration, todas as senhas serão automaticamente hasheadas ao criar ou atualizar usuários.

## Verificação

Para verificar se o trigger foi criado corretamente, execute no SQL Editor:

```sql
-- Verificar se a função existe
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'hash_password';

-- Verificar se o trigger existe
SELECT tgname, tgtype, tgenabled 
FROM pg_trigger 
WHERE tgname = 'trigger_hash_password';

-- Testar criando um usuário de teste
INSERT INTO users (name, email, password_hash, role)
VALUES ('Teste', 'teste@example.com', 'senha123', 'student')
RETURNING id, email, password_hash;

-- A senha deve aparecer hasheada (começando com $2a$ ou $2b$)
-- Depois delete o usuário de teste:
DELETE FROM users WHERE email = 'teste@example.com';
```
