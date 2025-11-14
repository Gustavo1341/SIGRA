# Troubleshooting - Alteração de Senha

## Problema
A funcionalidade de alterar senha não está funcionando.

## Checklist de Verificação

### 1. ✅ Verificar se a função SQL foi executada

Execute no Supabase SQL Editor:

```sql
SELECT proname 
FROM pg_proc 
WHERE proname = 'change_user_password';
```

**Se retornar vazio**: A função não existe. Execute o arquivo `add-change-password-function.sql`

### 2. ✅ Verificar se a extensão pgcrypto está habilitada

Execute no Supabase SQL Editor:

```sql
SELECT * FROM pg_extension WHERE extname = 'pgcrypto';
```

**Se retornar vazio**: Execute:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### 3. ✅ Testar a função manualmente

Execute no Supabase SQL Editor (ajuste os valores):

```sql
-- Primeiro, veja seu user_id
SELECT id, email FROM users WHERE email = 'seu_email@exemplo.com';

-- Depois teste a função (substitua os valores)
SELECT change_user_password(
    1,                    -- Seu user_id
    'sua_senha_atual',    -- Sua senha atual
    'nova_senha_teste'    -- Nova senha para testar
);
```

**Erros possíveis**:
- `"Senha atual incorreta"` - A senha atual está errada
- `"Usuário não encontrado"` - O user_id não existe
- `"function change_user_password does not exist"` - Execute o SQL da função

### 4. ✅ Verificar erros no Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba Console
3. Tente alterar a senha
4. Veja se há erros em vermelho

**Erros comuns**:
- `404 Not Found` - A função RPC não existe no Supabase
- `406 Not Acceptable` - Problema com RLS (Row Level Security)
- `500 Internal Server Error` - Erro na função SQL

### 5. ✅ Verificar se o authService está correto

O arquivo `services/auth.service.ts` deve ter:

```typescript
async changePassword(userId: number, passwordData: ChangePasswordData): Promise<void> {
    try {
        const { data, error } = await supabase.rpc('change_user_password', {
            p_user_id: userId,
            p_current_password: passwordData.currentPassword,
            p_new_password: passwordData.newPassword,
        });

        if (error) {
            console.error('Erro ao alterar senha:', error);
            
            if (error.message?.includes('Senha atual incorreta')) {
                throw new Error('Senha atual incorreta.');
            }
            if (error.message?.includes('Usuário não encontrado')) {
                throw new Error('Usuário não encontrado.');
            }
            
            throw new Error('Erro ao alterar senha. Tente novamente.');
        }

        if (!data) {
            throw new Error('Erro ao alterar senha.');
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Erro ao alterar senha.');
    }
}
```

## Solução Passo a Passo

### Passo 1: Execute a função SQL

No Supabase Dashboard > SQL Editor, execute:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION change_user_password(
    p_user_id INTEGER,
    p_current_password TEXT,
    p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_hash TEXT;
BEGIN
    SELECT password_hash INTO v_current_hash
    FROM users
    WHERE id = p_user_id;

    IF v_current_hash IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado';
    END IF;

    IF v_current_hash != crypt(p_current_password, v_current_hash) THEN
        RAISE EXCEPTION 'Senha atual incorreta';
    END IF;

    UPDATE users
    SET 
        password_hash = crypt(p_new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Passo 2: Teste no navegador

1. Faça login no sistema
2. Vá em Configurações > Segurança
3. Clique em "Alterar Senha"
4. Preencha:
   - Senha Atual: sua senha atual
   - Nova Senha: uma senha forte (mínimo 10 caracteres)
   - Confirmar: repita a nova senha
5. Clique em "Alterar Senha"

### Passo 3: Verifique o resultado

**Sucesso**: 
- ✅ Toast verde: "Senha alterada com sucesso! Faça login novamente."
- ✅ Página recarrega após 2 segundos
- ✅ Você consegue fazer login com a nova senha

**Erro**:
- ❌ Toast vermelho com mensagem de erro
- ❌ Verifique o Console do navegador (F12)
- ❌ Verifique os logs do Supabase

## Teste Rápido

Execute este SQL para testar se tudo está funcionando:

```sql
-- 1. Verificar extensão
SELECT extname FROM pg_extension WHERE extname = 'pgcrypto';

-- 2. Verificar função
SELECT proname FROM pg_proc WHERE proname = 'change_user_password';

-- 3. Ver seus dados de usuário
SELECT id, email, name FROM users WHERE email = 'seu_email@exemplo.com';

-- 4. Testar hash de senha (deve retornar true se a senha estiver correta)
SELECT 
    password_hash = crypt('sua_senha_atual', password_hash) as senha_correta
FROM users 
WHERE id = 1; -- Substitua pelo seu user_id
```

## Ainda não funciona?

Se após seguir todos os passos ainda não funcionar:

1. Copie o erro completo do Console (F12)
2. Copie o resultado dos SQLs de teste
3. Verifique se executou TODOS os arquivos SQL:
   - `add-update-profile-function.sql`
   - `add-change-password-function.sql`
4. Reinicie o servidor de desenvolvimento
5. Limpe o cache do navegador (Ctrl+Shift+Delete)
