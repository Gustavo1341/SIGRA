-- =====================================================
-- FIX: Políticas RLS para academic_files
-- =====================================================
-- Como você usa autenticação customizada (não Supabase Auth),
-- vamos simplificar as políticas para permitir acesso total
-- A segurança será gerenciada pela aplicação

-- Remover políticas antigas
DROP POLICY IF EXISTS "Todos podem ver arquivos" ON academic_files;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios arquivos" ON academic_files;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios arquivos" ON academic_files;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os arquivos" ON academic_files;
DROP POLICY IF EXISTS "Permitir criar arquivos" ON academic_files;
DROP POLICY IF EXISTS "Permitir editar arquivos" ON academic_files;
DROP POLICY IF EXISTS "Permitir deletar arquivos" ON academic_files;
DROP POLICY IF EXISTS "academic_files_select_all" ON academic_files;
DROP POLICY IF EXISTS "academic_files_insert_authenticated" ON academic_files;
DROP POLICY IF EXISTS "academic_files_update_own" ON academic_files;
DROP POLICY IF EXISTS "academic_files_delete_own" ON academic_files;
DROP POLICY IF EXISTS "academic_files_admin_all" ON academic_files;

-- Habilitar RLS
ALTER TABLE academic_files ENABLE ROW LEVEL SECURITY;

-- Política 1: Todos podem ver arquivos (leitura pública)
CREATE POLICY "academic_files_select_all" ON academic_files
    FOR SELECT
    USING (true);

-- Política 2: Permitir criar arquivos (validação feita pela aplicação)
CREATE POLICY "academic_files_insert_all" ON academic_files
    FOR INSERT
    WITH CHECK (true);

-- Política 3: Permitir editar arquivos (validação feita pela aplicação)
CREATE POLICY "academic_files_update_all" ON academic_files
    FOR UPDATE
    USING (true);

-- Política 4: Permitir deletar arquivos (validação feita pela aplicação)
CREATE POLICY "academic_files_delete_all" ON academic_files
    FOR DELETE
    USING (true);

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'academic_files'
ORDER BY policyname;
