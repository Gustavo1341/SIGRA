-- Corrigir função validate_enrollment
-- Execute este script no SQL Editor do Supabase

-- Remover função antiga
DROP FUNCTION IF EXISTS validate_enrollment(BIGINT, BIGINT);

-- Recriar função corrigida
CREATE OR REPLACE FUNCTION validate_enrollment(enrollment_id BIGINT, admin_user_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    enrollment_record RECORD;
    new_user_id BIGINT;
BEGIN
    -- Buscar matrícula
    SELECT * INTO enrollment_record 
    FROM enrollments 
    WHERE id = enrollment_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Matrícula não encontrada ou já processada';
    END IF;
    
    -- Verificar se já existe usuário com este email
    IF EXISTS (SELECT 1 FROM users WHERE email = enrollment_record.email) THEN
        RAISE EXCEPTION 'Já existe um usuário com este email';
    END IF;
    
    -- Verificar se já existe usuário com esta matrícula
    IF EXISTS (SELECT 1 FROM users WHERE matricula = enrollment_record.matricula) THEN
        RAISE EXCEPTION 'Já existe um usuário com esta matrícula';
    END IF;
    
    -- Criar novo usuário
    INSERT INTO users (name, email, password_hash, role, course_id, course_name, matricula)
    VALUES (
        enrollment_record.student_name,
        enrollment_record.email,
        crypt(enrollment_record.matricula, gen_salt('bf')), -- Senha inicial = matrícula
        'student',
        enrollment_record.course_id,
        enrollment_record.course_name,
        enrollment_record.matricula
    )
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
        'Sua matrícula foi aprovada. Bem-vindo ao SIGRA! Use sua matrícula como senha inicial.'
    );
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Erro ao validar matrícula: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que a função pode ser executada
GRANT EXECUTE ON FUNCTION validate_enrollment(BIGINT, BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_enrollment(BIGINT, BIGINT) TO service_role;
