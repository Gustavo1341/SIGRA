-- =====================================================
-- TESTE: Verificar dados para dashboard do aluno
-- =====================================================

-- 1. Verificar se existem arquivos acadêmicos
SELECT 
    COUNT(*) as total_arquivos,
    COUNT(DISTINCT course_name) as total_cursos,
    COUNT(DISTINCT author_id) as total_autores
FROM academic_files;

-- 2. Verificar arquivos por curso
SELECT 
    course_name,
    COUNT(*) as total_arquivos
FROM academic_files
GROUP BY course_name
ORDER BY total_arquivos DESC;

-- 3. Testar a view recent_files diretamente
SELECT 
    id,
    title,
    author_name,
    course_name,
    semester,
    subject,
    downloads,
    created_at
FROM recent_files
LIMIT 10;

-- 4. Testar filtro por curso específico (como o dashboard faz)
SELECT 
    id,
    title,
    author_name,
    course_name,
    downloads
FROM recent_files
WHERE course_name = 'Ciência da Computação'
ORDER BY created_at DESC
LIMIT 5;

-- 5. Verificar se há alunos cadastrados
SELECT 
    id,
    name,
    email,
    role,
    course_name
FROM users
WHERE role = 'student'
LIMIT 5;

-- 6. Verificar políticas RLS em users
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users';
