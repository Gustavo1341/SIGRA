# Guia de Validação - Dashboard com Supabase

## ✅ Checklist de Validação

### 1. Verificar Configuração do Supabase

**Status:** ✓ Configurado
- `.env` contém as credenciais do Supabase
- `lib/supabase.ts` está configurado corretamente

### 2. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor deve iniciar em `http://localhost:5173`

### 3. Testar Login

1. Acesse `http://localhost:5173`
2. Faça login com um usuário existente:
   - **Admin:** Use credenciais de administrador
   - **Student:** Use credenciais de estudante

### 4. Validar AdminDashboard (Login como Admin)

Após fazer login como administrador, verifique:

#### ✓ Estatísticas Carregam Corretamente
- [ ] **Total de Arquivos** - Deve mostrar número real do banco
- [ ] **Usuários Ativos** - Deve mostrar contagem real
- [ ] **Downloads Totais** - Deve mostrar soma real de downloads
- [ ] **Validações Pendentes** - Deve mostrar enrollments pendentes

#### ✓ Loading States
- [ ] Ao carregar a página, deve aparecer skeleton animado
- [ ] Skeleton deve ter 4 cards pulsando
- [ ] Skeleton deve aparecer também na lista de arquivos

#### ✓ Arquivos Recentes
- [ ] Lista deve mostrar até 10 arquivos mais recentes
- [ ] Arquivos devem vir do banco de dados (não mockados)
- [ ] Cada arquivo deve ter: título, autor, curso, downloads, data

#### ✓ Error Handling
Para testar erro, você pode:
1. Desligar o Supabase temporariamente
2. Ou modificar a URL no `.env` para uma inválida
3. Recarregar a página
4. Deve aparecer mensagem de erro em vermelho
5. Botão "Tentar Novamente" deve recarregar a página

### 5. Validar StudentDashboard (Login como Student)

Após fazer login como estudante, verifique:

#### ✓ Estatísticas Personalizadas
- [ ] **Meus Arquivos** - Deve mostrar arquivos do estudante logado
- [ ] **Downloads** - Deve mostrar downloads dos arquivos do estudante
- [ ] **Repositório** - Deve mostrar total de arquivos no sistema

#### ✓ Loading States
- [ ] Skeleton animado deve aparecer durante carregamento
- [ ] Deve ter o mesmo comportamento do admin

#### ✓ Arquivos do Curso
- [ ] Lista deve mostrar arquivos do curso do estudante
- [ ] Filtrado por `course_name` do usuário logado
- [ ] Até 10 arquivos mais recentes do curso

#### ✓ Error Handling
- [ ] Mesmo comportamento de erro do admin
- [ ] Mensagem amigável em português
- [ ] Botão de retry funcional

### 6. Validar Console do Navegador

Abra o DevTools (F12) e verifique:

#### ✓ Network Tab
- [ ] Requisições para Supabase devem aparecer
- [ ] Status 200 para requisições bem-sucedidas
- [ ] Verifique chamadas para:
  - `get_dashboard_stats` (RPC function)
  - `recent_files` (view)

#### ✓ Console Tab
- [ ] Não deve ter erros em vermelho
- [ ] Pode ter logs informativos (em azul/preto)
- [ ] Erros de conexão devem ser tratados graciosamente

### 7. Testar Diferentes Cenários

#### Cenário 1: Banco Vazio
Se o banco não tiver dados:
- [ ] Estatísticas devem mostrar "0"
- [ ] Lista de arquivos deve estar vazia
- [ ] Não deve quebrar a aplicação

#### Cenário 2: Muitos Dados
Se o banco tiver muitos dados:
- [ ] Números devem ser formatados corretamente (ex: 1.234)
- [ ] Lista deve limitar a 10 arquivos
- [ ] Performance deve ser boa (< 2 segundos)

#### Cenário 3: Troca de Usuário
- [ ] Logout e login com outro usuário
- [ ] Dados devem atualizar corretamente
- [ ] Estatísticas devem refletir o novo usuário

### 8. Validar TypeScript

```bash
npm run type-check
```

Ou se não tiver esse script:

```bash
npx tsc --noEmit
```

- [ ] Não deve ter erros de TypeScript
- [ ] Todos os tipos devem estar corretos

### 9. Validar Build de Produção

```bash
npm run build
```

- [ ] Build deve completar sem erros
- [ ] Verificar se não há warnings críticos

## 🔍 Comandos Úteis para Debug

### Verificar dados no Supabase
Você pode usar o Supabase Studio em:
`https://sbxrzkmscujbvcwzmnfv.supabase.co`

### Testar função RPC manualmente
No console do navegador:
```javascript
// Testar getAdminStats
const { data, error } = await supabase.rpc('get_dashboard_stats');
console.log('Admin Stats:', data, error);

// Testar getStudentStats
const { data, error } = await supabase.rpc('get_dashboard_stats', { p_user_id: 1 });
console.log('Student Stats:', data, error);

// Testar recent_files
const { data, error } = await supabase.from('recent_files').select('*').limit(5);
console.log('Recent Files:', data, error);
```

### Verificar se as views existem
```sql
-- No Supabase SQL Editor
SELECT * FROM recent_files LIMIT 5;
SELECT * FROM get_dashboard_stats();
SELECT * FROM get_dashboard_stats(1); -- com user_id
```

## 🐛 Problemas Comuns e Soluções

### Erro: "VITE_SUPABASE_URL não está definida"
**Solução:** Reinicie o servidor de desenvolvimento após criar/modificar o `.env`

### Erro: "relation 'recent_files' does not exist"
**Solução:** Execute o schema SQL no Supabase para criar as views

### Erro: "function get_dashboard_stats does not exist"
**Solução:** Execute o schema SQL no Supabase para criar as funções

### Loading infinito
**Solução:** 
1. Verifique o console para erros
2. Verifique se o Supabase está online
3. Verifique as credenciais no `.env`

### Dados não aparecem
**Solução:**
1. Verifique se há dados no banco
2. Execute os scripts de seed se necessário
3. Verifique as políticas RLS (Row Level Security)

## ✨ Resultado Esperado

Quando tudo estiver funcionando:

1. **Admin vê:**
   - Estatísticas gerais do sistema
   - Arquivos recentes de todos os cursos
   - Loading suave ao carregar
   - Erros tratados com mensagens amigáveis

2. **Student vê:**
   - Estatísticas personalizadas (seus arquivos e downloads)
   - Arquivos do seu curso
   - Loading suave ao carregar
   - Erros tratados com mensagens amigáveis

3. **Performance:**
   - Carregamento rápido (< 2 segundos)
   - Transições suaves
   - Sem travamentos

4. **Código:**
   - Sem erros no console
   - Sem warnings de TypeScript
   - Build de produção funcional
