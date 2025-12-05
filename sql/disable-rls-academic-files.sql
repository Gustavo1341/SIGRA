-- Temporariamente desabilitar RLS para academic_files para testes
-- ATENÇÃO: Isso permite que qualquer usuário crie/edite/delete arquivos
-- Use apenas em desenvolvimento!

ALTER TABLE academic_files DISABLE ROW LEVEL SECURITY;

-- Para reabilitar depois:
-- ALTER TABLE academic_files ENABLE ROW LEVEL SECURITY;
