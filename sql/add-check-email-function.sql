-- Função para verificar se um email já está em uso por outro usuário
-- Retorna TRUE se o email está disponível, FALSE se já está em uso

CREATE OR REPLACE FUNCTION check_email_available(
    p_email TEXT,
    p_user_id INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Contar quantos usuários têm esse email (excluindo o usuário atual)
    SELECT COUNT(*) INTO v_count
    FROM users
    WHERE email = p_email
    AND id != p_user_id;

    -- Retornar TRUE se email está disponível (count = 0)
    RETURN v_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário explicativo
COMMENT ON FUNCTION check_email_available IS 'Verifica se um email está disponível para uso (não está sendo usado por outro usuário)';
