-- =====================================================
-- FIX: Completar instalação do sistema de redefinição de senha
-- Execute este script se a migration anterior falhou parcialmente
-- =====================================================

-- Verificar e criar tabela se não existir
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices apenas se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_password_reset_token') THEN
        CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_password_reset_user_id') THEN
        CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_password_reset_expires') THEN
        CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);
    END IF;
END $$;

-- Criar ou substituir função para criar token
CREATE OR REPLACE FUNCTION create_password_reset_token(p_email VARCHAR)
RETURNS TABLE (
    token VARCHAR,
    user_name VARCHAR,
    user_email VARCHAR
) AS $$
DECLARE
    v_user_id BIGINT;
    v_user_name VARCHAR;
    v_token VARCHAR;
BEGIN
    -- Buscar usuário pelo email
    SELECT id, name INTO v_user_id, v_user_name
    FROM users
    WHERE email = p_email;
    
    -- Se não encontrar, retornar vazio (por segurança)
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Gerar token único (UUID)
    v_token := encode(gen_random_bytes(32), 'hex');
    
    -- Invalidar tokens anteriores do usuário
    UPDATE password_reset_tokens
    SET used = TRUE, used_at = NOW()
    WHERE user_id = v_user_id AND used = FALSE;
    
    -- Criar novo token (válido por 1 hora)
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (v_user_id, v_token, NOW() + INTERVAL '1 hour');
    
    -- Retornar token e dados do usuário
    RETURN QUERY
    SELECT v_token, v_user_name, p_email;
END;
$$ LANGUAGE plpgsql;

-- Criar ou substituir função para validar token
CREATE OR REPLACE FUNCTION validate_password_reset_token(p_token VARCHAR)
RETURNS TABLE (
    valid BOOLEAN,
    user_id BIGINT,
    user_email VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (prt.used = FALSE AND prt.expires_at > NOW())::BOOLEAN as valid,
        u.id as user_id,
        u.email as user_email
    FROM password_reset_tokens prt
    JOIN users u ON prt.user_id = u.id
    WHERE prt.token = p_token;
END;
$$ LANGUAGE plpgsql;

-- Criar ou substituir função para redefinir senha
CREATE OR REPLACE FUNCTION reset_password(p_token VARCHAR, p_new_password VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id BIGINT;
    v_token_valid BOOLEAN;
BEGIN
    -- Validar token
    SELECT 
        (used = FALSE AND expires_at > NOW()),
        user_id
    INTO v_token_valid, v_user_id
    FROM password_reset_tokens
    WHERE token = p_token;
    
    -- Se token inválido ou expirado
    IF NOT FOUND OR NOT v_token_valid THEN
        RETURN FALSE;
    END IF;
    
    -- Atualizar senha do usuário
    UPDATE users
    SET password_hash = crypt(p_new_password, gen_salt('bf'))
    WHERE id = v_user_id;
    
    -- Marcar token como usado
    UPDATE password_reset_tokens
    SET used = TRUE, used_at = NOW()
    WHERE token = p_token;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Criar ou substituir função para limpar tokens expirados
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM password_reset_tokens
    WHERE expires_at < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Adicionar comentários
COMMENT ON TABLE password_reset_tokens IS 'Tokens para redefinição de senha com expiração';
COMMENT ON FUNCTION create_password_reset_token IS 'Cria token de redefinição e invalida tokens anteriores';
COMMENT ON FUNCTION validate_password_reset_token IS 'Valida se token existe e não expirou';
COMMENT ON FUNCTION reset_password IS 'Redefine senha do usuário usando token válido';

-- Verificar se tudo foi criado
DO $$
BEGIN
    RAISE NOTICE '✅ Tabela password_reset_tokens: OK';
    RAISE NOTICE '✅ Função create_password_reset_token: OK';
    RAISE NOTICE '✅ Função validate_password_reset_token: OK';
    RAISE NOTICE '✅ Função reset_password: OK';
    RAISE NOTICE '✅ Função cleanup_expired_tokens: OK';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Sistema de redefinição de senha instalado com sucesso!';
END $$;
