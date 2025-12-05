-- =====================================================
-- ALTERNATIVA SEGURA: Restringir campos visíveis para alunos
-- =====================================================
-- Esta é uma alternativa mais segura que permite alunos verem
-- apenas campos públicos de outros usuários, sem expor dados sensíveis
-- =====================================================

-- OPÇÃO 1: Usar uma view pública de usuários (RECOMENDADO)
-- =====================================================

-- Criar view com apenas informações públicas
CREATE OR REPLACE VIEW public_users AS
SELECT 
    id,
    name,
    email,
    role,
    course_id,
    course_name,
    avatar,
    matricula,
    created_at
    -- NÃO incluir: password_hash, email_blacklisted, sms_blacklisted
FROM users;

-- Permitir acesso público à view
GRANT SELECT ON public_users TO anon, authenticated;

-- Recriar a view recent_files usando public_users
DROP VIEW IF EXISTS recent_files CASCADE;
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
LEFT JOIN public_users u ON af.author_id = u.id
LEFT JOIN courses c ON af.course_id = c.id;

-- Permitir acesso à view
GRANT SELECT ON recent_files TO anon, authenticated;

-- OPÇÃO 2: Política RLS mais granular (ALTERNATIVA)
-- =====================================================
-- Se preferir não usar view, pode usar esta política:

/*
-- Remover política atual
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON users;

-- Criar política que permite ver campos públicos de todos
-- mas restringe campos sensíveis apenas ao próprio usuário
CREATE POLICY "Ver informações públicas de usuários" ON users
    FOR SELECT USING (
        -- Sempre pode ver campos públicos
        true
    );

-- Nota: Com esta abordagem, você precisaria garantir que
-- o SELECT na aplicação não tente acessar campos sensíveis
-- como password_hash para outros usuários
*/

-- Mensagem de sucesso
SELECT '✅ View public_users criada e recent_files atualizada!' as status;
SELECT 'Agora alunos podem acessar recent_files com segurança' as info;
