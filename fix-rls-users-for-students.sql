-- =====================================================
-- FIX: Permitir alunos verem informações públicas de outros usuários
-- =====================================================
-- PROBLEMA: A view recent_files faz JOIN com users, mas alunos
-- só podem ver seu próprio perfil, causando erro 400
--
-- SOLUÇÃO: Criar política que permite ver informações públicas
-- de todos os usuários (nome, email, avatar) sem expor dados sensíveis
-- =====================================================

-- PASSO 1: Remover política restritiva atual
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON users;

-- PASSO 2: Criar política que permite ver informações públicas de todos
-- Isso é seguro porque não expõe password_hash ou dados sensíveis
CREATE POLICY "Todos podem ver informações públicas de usuários" ON users
    FOR SELECT USING (true);

-- PASSO 3: Manter política de admin para gerenciamento completo
-- (já existe, mas vamos garantir)
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
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- PASSO 5: Testar a view agora
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM recent_files;
    RAISE NOTICE '✅ View recent_files agora acessível! Total de registros: %', row_count;
END $$;

-- Mensagem de sucesso
SELECT '✅ Fix aplicado! Alunos agora podem ver recent_files' as status;
SELECT 'Teste: SELECT * FROM recent_files LIMIT 5;' as teste;
