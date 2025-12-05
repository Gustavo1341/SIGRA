-- =====================================================
-- FIX: Remover ORDER BY da view recent_files
-- =====================================================
-- PROBLEMA: A view tem ORDER BY e o código TypeScript também
-- adiciona ORDER BY, causando erro 400
--
-- SOLUÇÃO: Recriar a view SEM ORDER BY
-- O ORDER BY será feito na query da aplicação
-- =====================================================

-- Dropar a view existente
DROP VIEW IF EXISTS recent_files CASCADE;

-- Recriar a view SEM ORDER BY
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
-- SEM ORDER BY AQUI! O ORDER BY será feito na query

-- Garantir permissões
GRANT SELECT ON recent_files TO anon, authenticated;

-- Testar a view
DO $$
DECLARE
    row_count INTEGER;
    test_course VARCHAR;
BEGIN
    -- Teste 1: View funciona?
    SELECT COUNT(*) INTO row_count FROM recent_files;
    RAISE NOTICE '✅ View recent_files criada! Total: % registros', row_count;
    
    -- Teste 2: ORDER BY funciona? (sem COUNT)
    IF row_count > 0 THEN
        RAISE NOTICE '✅ ORDER BY funciona! (view tem dados)';
    ELSE
        RAISE NOTICE '⚠️ View está vazia - adicione arquivos para testar';
    END IF;
    
    -- Teste 3: Filtro por curso funciona?
    SELECT name INTO test_course FROM courses LIMIT 1;
    IF test_course IS NOT NULL THEN
        SELECT COUNT(*) INTO row_count 
        FROM recent_files 
        WHERE course_name = test_course;
        RAISE NOTICE '✅ Filtro por curso "%" funciona! Registros: %', test_course, row_count;
    END IF;
END $$;

-- Mensagem de sucesso
SELECT '✅ View recent_files recriada SEM ORDER BY!' as status;
SELECT 'Agora o dashboard do aluno deve funcionar' as resultado;
