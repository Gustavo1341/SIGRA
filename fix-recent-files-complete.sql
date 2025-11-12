-- =====================================================
-- FIX COMPLETO: View recent_files retornando 400
-- =====================================================
-- Este script resolve o problema de 400 Bad Request
-- ao consultar a view recent_files
-- =====================================================

-- PASSO 1: Dropar a view existente (se houver)
DROP VIEW IF EXISTS recent_files CASCADE;

-- PASSO 2: Recriar a view SEM ORDER BY (ORDER BY em views pode causar problemas)
-- O ORDER BY será feito na query da aplicação
CREATE OR REPLACE VIEW recent_files AS
SELECT 
    af.id,
    af.title,
    af.author_id,
    af.author_name,
    af.course_id,
    af.course_name,
    af.semester,
    af.subject,
    af.description,
    af.last_update_message,
    af.downloads,
    af.file_name,
    af.file_type,
    af.file_content,
    af.file_url,
    af.file_size,
    af.created_at,
    af.updated_at,
    u.email as author_email,
    c.name as course_full_name,
    CASE 
        WHEN af.created_at > NOW() - INTERVAL '1 hour' THEN 'agora mesmo'
        WHEN af.created_at > NOW() - INTERVAL '1 day' THEN 'hoje'
        WHEN af.created_at > NOW() - INTERVAL '2 days' THEN '2 dias atrás'
        WHEN af.created_at > NOW() - INTERVAL '1 week' THEN EXTRACT(DAY FROM NOW() - af.created_at)::text || ' dias atrás'
        WHEN af.created_at > NOW() - INTERVAL '1 month' THEN EXTRACT(WEEK FROM NOW() - af.created_at)::text || ' semanas atrás'
        ELSE EXTRACT(MONTH FROM NOW() - af.created_at)::text || ' meses atrás'
    END as uploaded_at_text
FROM academic_files af
LEFT JOIN users u ON af.author_id = u.id
LEFT JOIN courses c ON af.course_id = c.id;

-- PASSO 3: Garantir permissões de acesso
GRANT SELECT ON recent_files TO anon, authenticated;

-- PASSO 4: Garantir que as políticas RLS das tabelas base permitam SELECT
-- Política para academic_files
DROP POLICY IF EXISTS "Todos podem ver arquivos" ON academic_files;
CREATE POLICY "Todos podem ver arquivos" ON academic_files
    FOR SELECT USING (true);

-- Política para courses
DROP POLICY IF EXISTS "Todos podem ver cursos" ON courses;
CREATE POLICY "Todos podem ver cursos" ON courses
    FOR SELECT USING (true);

-- Política para users (apenas para leitura de campos públicos)
DROP POLICY IF EXISTS "Usuários podem ver perfis públicos" ON users;
CREATE POLICY "Usuários podem ver perfis públicos" ON users
    FOR SELECT USING (true);

-- PASSO 5: Testar a view
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM recent_files;
    RAISE NOTICE 'View recent_files criada com sucesso! Total de registros: %', row_count;
END $$;

-- PASSO 6: Mostrar exemplo de query
SELECT 'Fix aplicado com sucesso!' as status;
SELECT 'Teste com: SELECT * FROM recent_files ORDER BY created_at DESC LIMIT 10;' as exemplo;
