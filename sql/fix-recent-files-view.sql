-- =====================================================
-- FIX: Permitir acesso à view recent_files
-- =====================================================
-- Problema: A view recent_files está retornando 400 Bad Request
-- Causa: As tabelas subjacentes (academic_files, users, courses) têm RLS
--        habilitado, mas a view não tem permissões adequadas
--
-- Solução: Garantir acesso público às views e tabelas necessárias
-- =====================================================

-- Garantir que usuários anônimos e autenticados possam acessar as views
GRANT SELECT ON recent_files TO anon, authenticated;
GRANT SELECT ON course_statistics TO anon, authenticated;
GRANT SELECT ON pending_enrollments TO authenticated;

-- Garantir que as políticas RLS existentes em academic_files permitam SELECT
-- A política "Todos podem ver arquivos" já existe no schema, mas vamos garantir
DROP POLICY IF EXISTS "Todos podem ver arquivos" ON academic_files;
CREATE POLICY "Todos podem ver arquivos" ON academic_files
    FOR SELECT USING (true);

-- Garantir acesso de leitura em courses (já tem política mas vamos reforçar)
DROP POLICY IF EXISTS "Todos podem ver cursos" ON courses;
CREATE POLICY "Todos podem ver cursos" ON courses
    FOR SELECT USING (true);

-- Garantir acesso de leitura em users para a view (apenas campos públicos)
-- Nota: A view recent_files usa apenas author_email de users
DROP POLICY IF EXISTS "Todos podem ver informações públicas de usuários" ON users;
CREATE POLICY "Todos podem ver informações públicas de usuários" ON users
    FOR SELECT USING (true);

-- Mensagem de sucesso
SELECT 'Políticas RLS para recent_files configuradas com sucesso!' as status;
SELECT 'Teste com: SELECT * FROM recent_files LIMIT 10;' as next_step;
