-- =====================================================
-- SEED DATA - Matrículas Pendentes para Teste
-- =====================================================
-- Este arquivo insere dados de exemplo de matrículas
-- pendentes para testar o fluxo de validação
-- =====================================================

-- Inserir matrículas pendentes de exemplo
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
1. PRIMEIRO execute o script add-password-to-enrollments.sql para adicionar o campo password
2. Acesse o Supabase Dashboard (https://app.supabase.com)
3. Selecione seu projeto
4. Vá em "SQL Editor"
5. Cole este arquivo e execute
6. Verifique os dados inseridos na tabela "enrollments"

IMPORTANTE:
- Certifique-se de que a tabela "courses" já tem os cursos cadastrados
- Se executar o supabase-schema.sql, os cursos já estarão criados
- Estes dados são apenas para teste/desenvolvimento
- As senhas estão em texto plano aqui, mas serão convertidas para hash bcrypt quando validadas

CREDENCIAIS DE TESTE (após validação pelo admin):
- mariana.costa@example.com / mariana123
- lucas.ferreira@example.com / lucas123
- beatriz.almeida@example.com / beatriz123
- pedro.santos@example.com / pedro123
- ana.oliveira@example.com / ana123
- carlos.lima@example.com / carlos123
- juliana.rodrigues@example.com / juliana123
- rafael.souza@example.com / rafael123

FLUXO:
1. Aluno se cadastra com nome, email, matrícula, curso e senha
2. Matrícula fica com status 'pending'
3. Admin valida a matrícula
4. Sistema cria o usuário automaticamente com a senha fornecida (hash bcrypt)
5. Aluno pode fazer login com email e senha

PARA LIMPAR OS DADOS DE TESTE:
DELETE FROM enrollments WHERE status = 'pending' AND email LIKE '%@example.com';
*/
