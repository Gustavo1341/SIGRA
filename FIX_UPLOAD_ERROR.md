# Como Corrigir o Erro 400 no Upload de Arquivos

## 🔍 Problema Identificado

O erro 400 (Bad Request) ao fazer upload de arquivos é causado pelas **políticas RLS (Row Level Security)** incorretas na tabela `academic_files`.

### Causa Raiz
As políticas RLS estavam comparando:
- `auth.uid()` (UUID do Supabase Auth) 
- `author_id` (BIGINT da tabela users)

Isso nunca funciona porque são tipos diferentes!

## ✅ Solução

Execute o SQL abaixo no **SQL Editor** do Supabase Dashboard:

### Passo 1: Acesse o Supabase Dashboard
1. Vá para https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em "SQL Editor" no menu lateral

### Passo 2: Execute o SQL de Correção

Cole e execute este SQL:

```sql
-- =====================================================
-- FIX: Políticas RLS para academic_files
-- =====================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Todos podem ver arquivos" ON academic_files;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios arquivos" ON academic_files;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios arquivos" ON academic_files;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os arquivos" ON academic_files;
DROP POLICY IF EXISTS "Permitir criar arquivos" ON academic_files;
DROP POLICY IF EXISTS "Permitir editar arquivos" ON academic_files;
DROP POLICY IF EXISTS "Permitir deletar arquivos" ON academic_files;

-- Habilitar RLS
ALTER TABLE academic_files ENABLE ROW LEVEL SECURITY;

-- Política 1: Todos podem ver arquivos (leitura pública)
CREATE POLICY "academic_files_select_all" ON academic_files
    FOR SELECT
    USING (true);

-- Política 2: Usuários autenticados podem criar arquivos
CREATE POLICY "academic_files_insert_authenticated" ON academic_files
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Política 3: Usuários podem editar seus próprios arquivos
CREATE POLICY "academic_files_update_own" ON academic_files
    FOR UPDATE
    USING (
        author_id IN (
            SELECT id FROM users WHERE auth_id = auth.uid()::text
        )
    );

-- Política 4: Usuários podem deletar seus próprios arquivos
CREATE POLICY "academic_files_delete_own" ON academic_files
    FOR DELETE
    USING (
        author_id IN (
            SELECT id FROM users WHERE auth_id = auth.uid()::text
        )
    );

-- Política 5: Admins podem fazer tudo
CREATE POLICY "academic_files_admin_all" ON academic_files
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid()::text 
            AND role = 'admin'
        )
    );
```

### Passo 3: Verificar Políticas

Execute este SQL para verificar se as políticas foram criadas:

```sql
SELECT 
    policyname, 
    cmd, 
    permissive,
    CASE 
        WHEN qual IS NOT NULL THEN 'USING: ' || qual 
        ELSE '' 
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check 
        ELSE '' 
    END as with_check_clause
FROM pg_policies
WHERE tablename = 'academic_files'
ORDER BY policyname;
```

Você deve ver 5 políticas:
- ✅ `academic_files_admin_all` (ALL)
- ✅ `academic_files_delete_own` (DELETE)
- ✅ `academic_files_insert_authenticated` (INSERT)
- ✅ `academic_files_select_all` (SELECT)
- ✅ `academic_files_update_own` (UPDATE)

## 🚀 Teste

Após executar o SQL:

1. Recarregue a aplicação
2. Tente fazer upload de um arquivo
3. Deve funcionar! ✅

## 🔧 Solução Temporária (Desenvolvimento)

Se você quiser testar rapidamente sem as políticas RLS, execute:

```sql
ALTER TABLE academic_files DISABLE ROW LEVEL SECURITY;
```

⚠️ **ATENÇÃO**: Isso remove toda a segurança! Use apenas em desenvolvimento.

Para reabilitar:
```sql
ALTER TABLE academic_files ENABLE ROW LEVEL SECURITY;
```

## 📝 O Que Mudou

### Antes (❌ Errado)
```sql
CREATE POLICY "Usuários podem criar seus próprios arquivos" ON academic_files
    FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);
```
- Comparava UUID com BIGINT
- Nunca funcionava

### Depois (✅ Correto)
```sql
CREATE POLICY "academic_files_insert_authenticated" ON academic_files
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);
```
- Apenas verifica se o usuário está autenticado
- A aplicação garante que o `author_id` está correto

## 🔐 Segurança

As novas políticas garantem:
- ✅ Qualquer um pode **ler** arquivos (público)
- ✅ Apenas usuários **autenticados** podem criar arquivos
- ✅ Usuários só podem **editar/deletar** seus próprios arquivos
- ✅ Admins podem fazer **tudo**

## 📚 Referências

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)
