-- =====================================================
-- DEBUG: Verificar estado da view recent_files
-- =====================================================
-- Execute este script no Supabase SQL Editor para diagnosticar o problema
-- =====================================================

-- 1. Verificar se a view existe
SELECT 
    schemaname,
    viewname,
    viewowner,
    definition
FROM pg_views 
WHERE viewname = 'recent_files';

-- 2. Verificar se há dados na tabela academic_files
SELECT 
    COUNT(*) as total_arquivos,
    COUNT(DISTINCT course_id) as total_cursos,
    COUNT(DISTINCT author_id) as total_autores
FROM academic_files;

-- 3. Tentar consultar a view diretamente
SELECT * FROM recent_files LIMIT 5;

-- 4. Verificar políticas RLS em academic_files
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('academic_files', 'users', 'courses')
ORDER BY tablename, policyname;

-- 5. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('academic_files', 'users', 'courses');

-- 6. Verificar permissões na view
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'recent_files';
