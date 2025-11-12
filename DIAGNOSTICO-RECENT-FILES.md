# 🔍 Diagnóstico: Erro 400 em recent_files

## Problema
```
GET https://sbxrzkmscujbvcwzmnfv.supabase.co/rest/v1/recent_files?select=*&order=created_at.desc&limit=10 400 (Bad Request)
```

## Possíveis Causas

### 1. View não existe ou está mal configurada
**Sintoma:** 400 Bad Request
**Solução:** Execute `fix-recent-files-complete.sql` no Supabase SQL Editor

### 2. Políticas RLS bloqueando acesso
**Sintoma:** 400 ou 403
**Solução:** Verificar políticas RLS nas tabelas base

### 3. ORDER BY duplicado
**Sintoma:** 400 Bad Request
**Causa:** A view tem ORDER BY e a query também adiciona ORDER BY
**Solução:** Remover ORDER BY da definição da view

### 4. Colunas inexistentes
**Sintoma:** 400 Bad Request com mensagem sobre coluna
**Solução:** Verificar se todas as colunas existem nas tabelas

## Passo a Passo para Resolver

### PASSO 1: Executar Debug
1. Abra o Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute o arquivo `debug-recent-files.sql`
4. Anote os resultados

### PASSO 2: Aplicar Fix Completo
1. No Supabase SQL Editor
2. Execute o arquivo `fix-recent-files-complete.sql`
3. Verifique se aparece "Fix aplicado com sucesso!"

### PASSO 3: Testar Diretamente no SQL Editor
Execute esta query no Supabase SQL Editor:
```sql
SELECT * FROM recent_files ORDER BY created_at DESC LIMIT 10;
```

**Se funcionar:** O problema está no código TypeScript ou nas permissões
**Se não funcionar:** O problema está na view ou nas tabelas base

### PASSO 4: Testar via API REST
1. Abra o arquivo `test-recent-files-api.html` no navegador
2. Preencha sua Supabase URL e Anon Key
3. Clique em "Testar recent_files"
4. Veja o resultado

### PASSO 5: Verificar Código TypeScript
Se os testes acima funcionarem, o problema pode estar em:

#### A) Configuração do Supabase Client
Verifique se o `.env` está correto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

#### B) Query no dashboard.service.ts
A query atual:
```typescript
const { data, error } = await supabase
  .from('recent_files')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(limit);
```

Tente simplificar para:
```typescript
const { data, error } = await supabase
  .from('recent_files')
  .select('*')
  .limit(limit);
```

## Soluções Alternativas

### Opção 1: Usar academic_files diretamente
Em vez de usar a view, consulte a tabela diretamente:

```typescript
const { data, error } = await supabase
  .from('academic_files')
  .select(`
    *,
    users!author_id(email),
    courses!course_id(name)
  `)
  .order('created_at', { ascending: false })
  .limit(limit);
```

### Opção 2: Usar função RPC
Crie uma função no Supabase:

```sql
CREATE OR REPLACE FUNCTION get_recent_files(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR,
    author_name VARCHAR,
    course_name VARCHAR,
    semester VARCHAR,
    subject VARCHAR,
    downloads INTEGER,
    created_at TIMESTAMPTZ,
    uploaded_at_text TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        af.id,
        af.title,
        af.author_name,
        af.course_name,
        af.semester,
        af.subject,
        af.downloads,
        af.created_at,
        CASE 
            WHEN af.created_at > NOW() - INTERVAL '1 hour' THEN 'agora mesmo'
            WHEN af.created_at > NOW() - INTERVAL '1 day' THEN 'hoje'
            ELSE EXTRACT(DAY FROM NOW() - af.created_at)::text || ' dias atrás'
        END as uploaded_at_text
    FROM academic_files af
    ORDER BY af.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Depois use no TypeScript:
```typescript
const { data, error } = await supabase.rpc('get_recent_files', {
  p_limit: limit
});
```

## Checklist de Verificação

- [ ] View `recent_files` existe no Supabase?
- [ ] Tabela `academic_files` tem dados?
- [ ] Políticas RLS permitem SELECT em `academic_files`?
- [ ] Políticas RLS permitem SELECT em `users`?
- [ ] Políticas RLS permitem SELECT em `courses`?
- [ ] GRANT SELECT foi dado para `anon` e `authenticated`?
- [ ] Query funciona no SQL Editor do Supabase?
- [ ] Query funciona via API REST (teste HTML)?
- [ ] Variáveis de ambiente estão corretas no `.env`?
- [ ] Supabase client está inicializado corretamente?

## Próximos Passos

1. Execute `debug-recent-files.sql` e me envie os resultados
2. Execute `fix-recent-files-complete.sql`
3. Teste com `test-recent-files-api.html`
4. Se ainda não funcionar, me envie:
   - Mensagem de erro completa do console
   - Resultado do debug SQL
   - Screenshot do erro no Network tab do DevTools
