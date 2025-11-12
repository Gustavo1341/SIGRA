-- =====================================================
-- FIX: Corrigir cálculo de semanas em recent_files
-- =====================================================
-- ERRO: 'unit "week" not supported for type interval'
-- CAUSA: EXTRACT(WEEK FROM interval) não é suportado
-- SOLUÇÃO: Calcular semanas dividindo dias por 7
-- =====================================================

-- Dropar a view existente
DROP VIEW IF EXISTS recent_files CASCADE;

-- Recriar a view com cálculo correto de semanas
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
        WHEN af.created_at > NOW() - INTERVAL '1 week' THEN 
            EXTRACT(DAY FROM NOW() - af.created_at)::text || ' dias atrás'
        WHEN af.created_at > NOW() - INTERVAL '1 month' THEN 
            FLOOR(EXTRACT(DAY FROM NOW() - af.created_at) / 7)::text || ' semanas atrás'
        ELSE 
            FLOOR(EXTRACT(DAY FROM NOW() - af.created_at) / 30)::text || ' meses atrás'
    END as uploaded_at_text
FROM academic_files af
LEFT JOIN users u ON af.author_id = u.id
LEFT JOIN courses c ON af.course_id = c.id;

-- Garantir permissões
GRANT SELECT ON recent_files TO anon, authenticated;

-- Testar a view
DO $$
DECLARE
    row_count INTEGER;
    sample_text TEXT;
BEGIN
    -- Teste 1: View funciona?
    SELECT COUNT(*) INTO row_count FROM recent_files;
    RAISE NOTICE '✅ View recent_files criada! Total: % registros', row_count;
    
    -- Teste 2: uploaded_at_text funciona?
    IF row_count > 0 THEN
        SELECT uploaded_at_text INTO sample_text 
        FROM recent_files 
        LIMIT 1;
        RAISE NOTICE '✅ Campo uploaded_at_text funciona! Exemplo: "%"', sample_text;
    END IF;
    
    -- Teste 3: Query completa como o dashboard faz
    SELECT COUNT(*) INTO row_count 
    FROM recent_files 
    WHERE course_name IS NOT NULL;
    RAISE NOTICE '✅ Query com filtro funciona! Registros: %', row_count;
END $$;

-- Mensagem de sucesso
SELECT '✅ View recent_files corrigida!' as status;
SELECT 'Cálculo de semanas agora usa FLOOR(dias / 7)' as fix;
SELECT 'Dashboard do aluno deve funcionar agora!' as resultado;
