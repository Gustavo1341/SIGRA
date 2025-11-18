-- Função para alterar senha do usuário
-- Esta função valida a senha atual e atualiza para a nova senha com hash bcrypt

CREATE OR REPLACE FUNCTION change_user_password(
    p_user_id INTEGER,
    p_current_password TEXT,
    p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_hash TEXT;
BEGIN
    -- Buscar hash da senha atual
    SELECT password_hash INTO v_current_hash
    FROM users
    WHERE id = p_user_id;

    -- Verificar se usuário existe
    IF v_current_hash IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado';
    END IF;

    -- Verificar se a senha atual está correta
    IF v_current_hash != crypt(p_current_password, v_current_hash) THEN
        RAISE EXCEPTION 'Senha atual incorreta';
    END IF;

    -- Atualizar para nova senha com hash bcrypt
    UPDATE users
    SET 
        password_hash = crypt(p_new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário explicativo
COMMENT ON FUNCTION change_user_password IS 'Altera a senha do usuário após validar a senha atual. Usa bcrypt para hash.';
