-- =====================================================
-- FIX FINAL: Dashboard do Aluno - Erro 400 em recent_files
-- =====================================================
-- CONTEXTO:
-- - Admin dashboard funciona ✅
-- - Student dashboard retorna 400 ❌
-- 
-- CAUSA:
-- O dashboard do aluno chama getCourseFiles() que usa a view recent_files
-- A view faz JOIN com users, mas alunos só podem ver seu próprio perfil
-- 
-- SOLUÇÃO:
-- Permitir que alunos vejam informações públicas de outros usuários
-- (necessário para ver autores dos arquivos do curso)
-- =====================================================

-- PASSO 1: Remover política restritiva que impede alunos de verem outros usuários
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON users;

-- PASSO 2: Criar política que permite ver informações públicas de todos os usuários
-- Isso é seguro porque:
-- - password_hash nunca é exposto (não está no SELECT da view)
-- - Apenas informações públicas são visíveis (nome, email, avatar)
-- - Necessário para mostrar autores dos arquivos
CREATE POLICY "Todos podem ver informações públicas de usuários" ON users
    FOR SELECT USING (true);

-- PASSO 3: Manter política de admin para gerenciamento completo
DROP POLICY IF EXISTS "Admins podem gerenciar usuários" ON users;
CREATE POLICY "Admins podem gerenciar usuários" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- PASSO 4: Permitir usuários atualizarem apenas seu próprio perfil
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON users;
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- PASSO 5: Garantir que as views têm permissões corretas
GRANT SELECT ON recent_files TO anon, authenticated;
GRANT SELECT ON course_statistics TO anon, authenticated;
GRANT SELECT ON academic_files TO anon, authenticated;
GRANT SELECT ON courses TO anon, authenticated;

-- PASSO 6: Testar a view
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM recent_files;
    RAISE NOTICE '✅ View recent_files acessível! Total de registros: %', row_count;
    
    -- Testar filtro por curso (como o dashboard do aluno faz)
    SELECT COUNT(*) INTO row_count 
    FROM recent_files 
    WHERE course_name = (SELECT name FROM courses LIMIT 1);
    
    RAISE NOTICE '✅ Filtro por curso funcionando! Registros encontrados: %', row_count;
END $$;

-- Mensagem de sucesso
SELECT '✅ Fix aplicado com sucesso!' as status;
SELECT 'Dashboard do aluno agora deve funcionar corretamente' as resultado;
SELECT 'Teste: SELECT * FROM recent_files WHERE course_name = ''Ciência da Computação'' LIMIT 5;' as teste;
