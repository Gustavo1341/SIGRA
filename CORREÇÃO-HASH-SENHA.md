# 🔐 Correção: Hash de Senha no Banco de Dados

## Problema Identificado

As senhas estão sendo salvas em texto plano no banco de dados ao criar usuários manualmente, pois não existe um trigger para fazer o hash automaticamente.

## Solução

Foi criado um trigger SQL que faz o hash automático das senhas usando bcrypt antes de armazenar no banco.

## Como Aplicar a Correção

### Passo 1: Acesse o Supabase Dashboard

1. Vá para https://app.supabase.com
2. Selecione seu projeto SIGRA
3. Clique em **SQL Editor** no menu lateral

### Passo 2: Execute a Migration

1. Clique em **New Query**
2. Copie e cole o código abaixo:

```sql
-- =====================================================
-- Trigger para fazer hash de senha automaticamente
-- =====================================================

-- Função para fazer hash da senha
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se password_hash foi modificado e não começa com $2
    -- (senhas bcrypt começam com $2a$, $2b$, etc.)
    IF NEW.password_hash IS NOT NULL AND 
       (TG_OP = 'INSERT' OR NEW.password_hash != OLD.password_hash) AND
       NOT (NEW.password_hash LIKE '$2%') THEN
        -- Fazer hash da senha usando bcrypt (gen_salt com 10 rounds)
        NEW.password_hash := crypt(NEW.password_hash, gen_salt('bf', 10));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar antes de INSERT ou UPDATE
DROP TRIGGER IF EXISTS trigger_hash_password ON users;
CREATE TRIGGER trigger_hash_password
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION hash_password();

-- Comentário
COMMENT ON FUNCTION hash_password() IS 'Faz hash automático da senha usando bcrypt antes de armazenar';
COMMENT ON TRIGGER trigger_hash_password ON users IS 'Trigger que executa hash_password() antes de INSERT/UPDATE';
```

3. Clique em **Run** (ou Ctrl+Enter)

### Passo 3: Verificar se Funcionou

Execute esta query para testar:

```sql
-- Criar usuário de teste
INSERT INTO users (name, email, password_hash, role)
VALUES ('Teste Hash', 'teste.hash@example.com', 'minhasenha123', 'student')
RETURNING id, email, password_hash;
```

✅ **Sucesso**: Se o `password_hash` começar com `$2a$` ou `$2b$`, está funcionando!

Depois delete o usuário de teste:
```sql
DELETE FROM users WHERE email = 'teste.hash@example.com';
```

### Passo 4: Atualizar Senhas Existentes (Se Necessário)

Se você já tem usuários com senhas em texto plano, execute:

```sql
-- Fazer hash de todas as senhas que ainda não estão hasheadas
UPDATE users 
SET password_hash = password_hash 
WHERE NOT (password_hash LIKE '$2%');
```

⚠️ **ATENÇÃO**: Isso só funciona se as senhas atuais forem texto plano. Se forem hashes de outro formato, você precisará resetar as senhas manualmente.

## Como Funciona

O trigger `trigger_hash_password`:
- Executa automaticamente **antes** de INSERT ou UPDATE na tabela `users`
- Detecta se a senha já está hasheada (começa com `$2`)
- Se não estiver hasheada, aplica bcrypt com 10 rounds
- Se já estiver hasheada, não faz nada (evita hash duplo)

## Resultado

✅ Agora ao criar ou atualizar usuários via `usersService`, as senhas serão automaticamente hasheadas com bcrypt

✅ A função `authenticate_user` continuará funcionando normalmente para verificar as senhas

✅ Segurança das senhas garantida no banco de dados

## Arquivos Criados

- `supabase-migrations/add-password-hash-trigger.sql` - Migration SQL
- `supabase-migrations/README.md` - Documentação das migrations
- `scripts/apply-password-hash-migration.md` - Guia detalhado de aplicação

## Próximos Passos

Após aplicar a migration, teste criando um novo usuário pela interface do SIGRA e verifique no banco que a senha está hasheada.
