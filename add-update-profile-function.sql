-- Função para atualizar perfil do usuário (nome e email)
-- Valida se o email está disponível antes de atualizar

CREATE OR REPLACE FUNCTION update_user_profile(
    p_user_id INTEGER,
    p_name TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_email_count INTEGER;
BEGIN
    -- Se email foi fornecido, verificar se está disponível
    IF p_email IS NOT NULL THEN
        SELECT COUNT(*) INTO v_email_count
        FROM users
        WHERE email = p_email
        AND id != p_user_id;

        IF v_email_count > 0 THEN
            RAISE EXCEPTION 'Este email já está em uso por outro usuário';
        END IF;
    END IF;

    -- Atualizar perfil (apenas campos fornecidos)
    UPDATE users
    SET 
        name = COALESCE(p_name, name),
        email = COALESCE(p_email, email),
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Verificar se usuário foi encontrado
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuário não encontrado';
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário explicativo
COMMENT ON FUNCTION update_user_profile IS 'Atualiza nome e/ou email do usuário após validar disponibilidade do email';
