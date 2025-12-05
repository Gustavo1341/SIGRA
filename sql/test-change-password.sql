-- Script para testar se a função change_user_password existe e funciona

-- 1. Verificar se a função existe
SELECT 
    proname as function_name,
    pg_get_function_arguments(oid) as arguments,
    pg_get_functiondef(oid) as definition
FROM pg_proc 
WHERE proname = 'change_user_password';

-- Se a função não existir, o resultado acima estará vazio
-- Nesse caso, execute o arquivo add-change-password-function.sql primeiro

-- 2. Teste básico (substitua os valores pelos seus dados reais)
-- ATENÇÃO: Descomente e ajuste os valores antes de executar
/*
SELECT change_user_password(
    1,                    -- p_user_id (ID do seu usuário)
    'senha_atual',        -- p_current_password (sua senha atual)
    'nova_senha_123'      -- p_new_password (nova senha)
);
*/

-- 3. Verificar se a extensão pgcrypto está habilitada (necessária para crypt)
SELECT * FROM pg_extension WHERE extname = 'pgcrypto';

-- Se não retornar nada, execute:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
