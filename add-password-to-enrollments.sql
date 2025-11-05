-- =====================================================
-- MIGRATION - Adicionar campo de senha na tabela enrollments
-- =====================================================
-- Este script adiciona o campo password à tabela enrollments
-- e atualiza a função validate_enrollment para usar essa senha
-- =====================================================

-- Adicionar coluna password à tabela enrollments
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Atualizar a função validate_enrollment para usar a senha fornecida
CREATE OR REPLACE FUNCTION validate_enrollment(enrollment_id BIGINT, admin_user_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    enrollment_record enrollments%ROWTYPE;
    new_user_id BIGINT;
BEGIN
    -- Buscar matrícula
    SELECT * INTO enrollment_record FROM enrollments WHERE id = enrollment_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar se a senha foi fornecida
    IF enrollment_record.password IS NULL OR enrollment_record.password = '' THEN
        RAISE EXCEPTION 'Senha não fornecida na matrícula';
    END IF;
    
    -- Criar novo usuário com a senha fornecida
    INSERT INTO users (name, email, password_hash, role, course_id, course_name, matricula)
    SELECT 
        enrollment_record.student_name,
        enrollment_record.email,
        crypt(enrollment_record.password, gen_salt('bf')), -- Usar senha fornecida
        'student',
        enrollment_record.course_id,
        enrollment_record.course_name,
        enrollment_record.matricula
    RETURNING id INTO new_user_id;
    
    -- Atualizar status da matrícula
    UPDATE enrollments 
    SET status = 'validated', 
        validated_at = NOW(), 
        validated_by = admin_user_id
    WHERE id = enrollment_id;
    
    -- Criar notificação para o novo usuário
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
        new_user_id,
        'enrollment',
        'Matrícula Aprovada!',
        'Sua matrícula foi aprovada. Bem-vindo ao SIGRA! Use sua senha cadastrada para fazer login.'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Verificar a estrutura atualizada
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'enrollments'
ORDER BY ordinal_position;

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================
/*
1. Execute este script ANTES de executar o seed-enrollments.sql
2. Isso adiciona o campo 'password' à tabela enrollments
3. A função validate_enrollment agora usa a senha fornecida pelo aluno
4. Quando o admin validar, o usuário será criado com essa senha

IMPORTANTE:
- A senha é armazenada em texto plano na tabela enrollments
- Quando validada, é convertida para hash bcrypt na tabela users
- Após validação, a senha pode ser removida da tabela enrollments por segurança

PARA LIMPAR SENHAS APÓS VALIDAÇÃO (OPCIONAL):
UPDATE enrollments SET password = NULL WHERE status = 'validated';
*/
