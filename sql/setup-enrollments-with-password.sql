-- =====================================================
-- SETUP COMPLETO - Matrículas com Senha
-- =====================================================
-- Este arquivo faz tudo de uma vez:
-- 1. Adiciona campo password à tabela enrollments
-- 2. Atualiza a função validate_enrollment
-- 3. Insere dados de teste
-- =====================================================

-- PASSO 1: Adicionar coluna password à tabela enrollments
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- PASSO 2: Atualizar a função validate_enrollment para usar a senha fornecida
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

-- PASSO 3: Inserir matrículas pendentes de exemplo com senhas
INSERT INTO enrollments (student_name, email, matricula, course_id, course_name, password, status) 
VALUES
    -- Matrícula 1: Mariana Costa - Engenharia Civil (senha: mariana123)
    (
        'Mariana Costa',
        'mariana.costa@example.com',
        '20240001',
        (SELECT id FROM courses WHERE name = 'Engenharia Civil'),
        'Engenharia Civil',
        'mariana123',
        'pending'
    ),
    
    -- Matrícula 2: Lucas Ferreira - Medicina (senha: lucas123)
    (
        'Lucas Ferreira',
        'lucas.ferreira@example.com',
        '20240002',
        (SELECT id FROM courses WHERE name = 'Medicina'),
        'Medicina',
        'lucas123',
        'pending'
    ),
    
    -- Matrícula 3: Beatriz Almeida - Direito (senha: beatriz123)
    (
        'Beatriz Almeida',
        'beatriz.almeida@example.com',
        '20240003',
        (SELECT id FROM courses WHERE name = 'Direito'),
        'Direito',
        'beatriz123',
        'pending'
    ),
    
    -- Matrícula 4: Pedro Santos - Ciência da Computação (senha: pedro123)
    (
        'Pedro Santos',
        'pedro.santos@example.com',
        '20240004',
        (SELECT id FROM courses WHERE name = 'Ciência da Computação'),
        'Ciência da Computação',
        'pedro123',
        'pending'
    ),
    
    -- Matrícula 5: Ana Julia Oliveira - Sistemas de Informação (senha: ana123)
    (
        'Ana Julia Oliveira',
        'ana.oliveira@example.com',
        '20240005',
        (SELECT id FROM courses WHERE name = 'Sistemas de Informação'),
        'Sistemas de Informação',
        'ana123',
        'pending'
    ),
    
    -- Matrícula 6: Carlos Eduardo Lima - Engenharia Civil (senha: carlos123)
    (
        'Carlos Eduardo Lima',
        'carlos.lima@example.com',
        '20240006',
        (SELECT id FROM courses WHERE name = 'Engenharia Civil'),
        'Engenharia Civil',
        'carlos123',
        'pending'
    ),
    
    -- Matrícula 7: Juliana Rodrigues - Medicina (senha: juliana123)
    (
        'Juliana Rodrigues',
        'juliana.rodrigues@example.com',
        '20240007',
        (SELECT id FROM courses WHERE name = 'Medicina'),
        'Medicina',
        'juliana123',
        'pending'
    ),
    
    -- Matrícula 8: Rafael Souza - Direito (senha: rafael123)
    (
        'Rafael Souza',
        'rafael.souza@example.com',
        '20240008',
        (SELECT id FROM courses WHERE name = 'Direito'),
        'Direito',
        'rafael123',
        'pending'
    )
ON CONFLICT DO NOTHING;

-- Verificar matrículas inseridas
SELECT 
    id,
    student_name,
    email,
    matricula,
    course_name,
    password,
    status,
    created_at
FROM enrollments
WHERE status = 'pending'
ORDER BY created_at ASC;

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================
/*
EXECUTE ESTE ARQUIVO UMA ÚNICA VEZ NO SUPABASE:

1. Acesse o Supabase Dashboard (https://app.supabase.com)
2. Selecione seu projeto
3. Vá em "SQL Editor"
4. Cole TODO este arquivo e execute
5. Verifique os dados inseridos na tabela "enrollments"

IMPORTANTE:
- Este script faz tudo: adiciona coluna, atualiza função e insere dados
- Certifique-se de que a tabela "courses" já tem os cursos cadastrados
- Se executar o supabase-schema.sql, os cursos já estarão criados

CREDENCIAIS DE TESTE (após admin validar):
- mariana.costa@example.com / mariana123
- lucas.ferreira@example.com / lucas123
- beatriz.almeida@example.com / beatriz123
- pedro.santos@example.com / pedro123
- ana.oliveira@example.com / ana123
- carlos.lima@example.com / carlos123
- juliana.rodrigues@example.com / juliana123
- rafael.souza@example.com / rafael123

FLUXO COMPLETO:
1. Aluno se cadastra com nome, email, matrícula, curso e senha
2. Matrícula fica com status 'pending' na tabela enrollments
3. Admin acessa "Validar Matrículas" e clica em "Revisar"
4. Admin clica em "Validar" para aprovar
5. Função validate_enrollment cria o usuário com hash bcrypt da senha
6. Aluno recebe notificação e pode fazer login com email e senha

PARA LIMPAR OS DADOS DE TESTE:
DELETE FROM enrollments WHERE email LIKE '%@example.com';
DELETE FROM users WHERE email LIKE '%@example.com';
*/
