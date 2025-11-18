-- =====================================================
-- Trigger para fazer hash de senha automaticamente
-- =====================================================
-- Este trigger garante que senhas sejam sempre hasheadas
-- usando bcrypt antes de serem armazenadas no banco
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
