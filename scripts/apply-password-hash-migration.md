# Como Aplicar a Migration de Hash de Senha

## Passo a Passo

### 1. Acesse o Dashboard do Supabase

Vá para: https://app.supabase.com

### 2. Selecione seu Projeto

Clique no projeto SIGRA na lista de projetos.

### 3. Abra o SQL Editor

No menu lateral esquerdo, clique em **SQL Editor**.

### 4. Crie uma Nova Query

Clique no botão **New Query** no canto superior direito.

### 5. Cole o SQL da Migration

Copie todo o conteúdo do arquivo `supabase-migrations/add-password-hash-trigger.sql` e cole no editor.

### 6. Execute a Migration

Clique no botão **Run** (ou pressione Ctrl+Enter / Cmd+Enter).

### 7. Verifique o Resultado

Você deve ver uma mensagem de sucesso. Para confirmar que funcionou, execute:

```sql
-- Verificar se o trigger existe
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'trigger_hash_password';
```

Deve retornar uma linha mostrando o trigger ativo.

### 8. Teste (Opcional)

Para testar se está funcionando:

```sql
-- Criar usuário de teste
INSERT INTO users (name, email, password_hash, role)
VALUES ('Teste Hash', 'teste.hash@example.com', 'minhasenha123', 'student')
RETURNING id, email, password_hash;
```

A coluna `password_hash` deve mostrar algo como:
```
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOP
```

Se começar com `$2a$` ou `$2b$`, o hash está funcionando! 

Depois delete o usuário de teste:
```sql
DELETE FROM users WHERE email = 'teste.hash@example.com';
```

## Pronto!

Agora todas as senhas serão automaticamente hasheadas ao criar ou atualizar usuários através do `usersService`.

## Atualizar Senhas Existentes (Se Necessário)

Se você já tem usuários com senhas em texto plano no banco, execute:

```sql
-- ATENÇÃO: Isso vai fazer hash de todas as senhas que ainda não estão hasheadas
UPDATE users 
SET password_hash = password_hash 
WHERE NOT (password_hash LIKE '$2%');
```

**IMPORTANTE**: Isso só funciona se as senhas atuais forem as senhas reais em texto plano. Se forem hashes de outro formato, você precisará resetar as senhas manualmente.
