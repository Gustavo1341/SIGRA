-- Permitir que usuários não autenticados criem solicitações de matrícula
-- Execute este script no SQL Editor do Supabase

-- Remover todas as políticas antigas da tabela enrollments
DROP POLICY IF EXISTS "Admins podem gerenciar matrículas" ON enrollments;
DROP POLICY IF EXISTS "Qualquer um pode criar solicitação de matrícula" ON enrollments;
DROP POLICY IF EXISTS "Admins podem ver todas as matrículas" ON enrollments;
DROP POLICY IF EXISTS "Admins podem atualizar matrículas" ON enrollments;
DROP POLICY IF EXISTS "Admins podem deletar matrículas" ON enrollments;

-- Política para permitir criação pública de solicitações
CREATE POLICY "Qualquer um pode criar solicitação de matrícula" ON enrollments
    FOR INSERT WITH CHECK (true);

-- Política para admins verem todas as matrículas
CREATE POLICY "Admins podem ver todas as matrículas" ON enrollments
    FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

-- Política para admins atualizarem matrículas
CREATE POLICY "Admins podem atualizar matrículas" ON enrollments
    FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

-- Política para admins deletarem matrículas
CREATE POLICY "Admins podem deletar matrículas" ON enrollments
    FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

-- Remover política antiga de cursos
DROP POLICY IF EXISTS "Todos podem ver cursos" ON courses;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar cursos" ON courses;

-- Permitir que usuários não autenticados vejam a lista de cursos
CREATE POLICY "Todos podem ver cursos" ON courses
    FOR SELECT USING (true);

-- Apenas admins podem gerenciar cursos
CREATE POLICY "Apenas admins podem gerenciar cursos" ON courses
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));
