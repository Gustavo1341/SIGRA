# 🚀 Guia Rápido - Sistema de Notificações

## ✅ O que foi implementado

O sistema de notificações está **100% funcional** e inclui:

1. ✅ Serviço de notificações (`services/notifications.service.ts`)
2. ✅ Hook React customizado (`src/hooks/useNotifications.ts`)
3. ✅ Componente de dropdown (`components/NotificationsDropdown.tsx`)
4. ✅ Integração no Header (`components/Header.tsx`)
5. ✅ Suporte a notificações em tempo real (Realtime)
6. ✅ Badge com contador de não lidas
7. ✅ Marcar como lida (individual e todas)
8. ✅ Deletar notificações
9. ✅ Formatação de datas relativas

## 🧪 Como Testar

### Passo 1: Criar Notificações de Teste

Execute o seguinte SQL no **Supabase SQL Editor**:

```sql
-- Substitua '1' pelo ID do seu usuário de teste
INSERT INTO notifications (user_id, type, title, message, read)
VALUES 
  (1, 'success', '✅ Bem-vindo!', 'Seu sistema de notificações está funcionando!', false),
  (1, 'info', '📚 Teste de notificação', 'Esta é uma notificação de teste do tipo info.', false),
  (1, 'warning', '⚠️ Aviso importante', 'Esta é uma notificação de aviso.', false);
```

### Passo 2: Verificar no Frontend

1. Faça login na aplicação
2. Olhe para o cabeçalho - você verá:
   - 🔔 Ícone de sino
   - Badge vermelho com o número de notificações não lidas
   - Ponto vermelho pulsante
3. Clique no ícone de sino
4. O dropdown abrirá mostrando suas notificações

### Passo 3: Testar Funcionalidades

- ✓ Clique em "Marcar como lida" em uma notificação
- ✓ Clique em "Marcar todas como lidas"
- ✓ Clique no ❌ para deletar uma notificação
- ✓ Observe o contador diminuir automaticamente

## 📱 Como Funciona

### Fluxo de Dados

```
1. Notificação criada no banco de dados
   ↓
2. Supabase Realtime detecta a inserção
   ↓
3. Hook useNotifications recebe a atualização
   ↓
4. Estado do React é atualizado
   ↓
5. UI é re-renderizada automaticamente
   ↓
6. Badge e dropdown mostram nova notificação
```

### Estrutura de Componentes

```
App.tsx
  └── Header.tsx
       ├── useNotifications() hook
       ├── BellIcon com badge
       └── NotificationsDropdown
            ├── Lista de notificações
            ├── Botões de ação
            └── Formatação de datas
```

## 🎨 Personalização

### Alterar Limite de Notificações

```typescript
// Em src/hooks/useNotifications.ts, linha ~20
const notifs = await notificationsService.getNotifications(userId, 50); // Altere de 20 para 50
```

### Adicionar Novos Tipos de Notificação

```typescript
// Em components/NotificationsDropdown.tsx
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'info': return 'ℹ️';
    case 'urgent': return '🚨'; // Novo tipo
    default: return 'ℹ️';
  }
};
```

### Alterar Cores do Badge

```typescript
// Em components/Header.tsx
<span className="absolute top-1 right-1.5 block h-2 w-2 rounded-full bg-brand-error-500 ring-2 ring-white animate-pulse"></span>

// Altere bg-brand-error-500 para outra cor, ex: bg-blue-500
```

## 🔧 Troubleshooting

### Problema: Notificações não aparecem

**Solução:**
1. Verifique se o usuário está logado
2. Confirme o `user_id` nas notificações do banco
3. Abra o console do navegador e procure por erros
4. Verifique as políticas RLS no Supabase

```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'notifications';
```

### Problema: Contador não atualiza

**Solução:**
1. Verifique se o Realtime está habilitado no Supabase
2. Confirme que a tabela `notifications` tem Realtime ativo
3. Recarregue a página

### Problema: Erro de permissão

**Solução:**
```sql
-- Verificar e recriar políticas RLS
DROP POLICY IF EXISTS "Usuários veem apenas suas notificações" ON notifications;
DROP POLICY IF EXISTS "Sistema pode criar notificações" ON notifications;

CREATE POLICY "Usuários veem apenas suas notificações" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Sistema pode criar notificações" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas notificações" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Usuários podem deletar suas notificações" ON notifications
    FOR DELETE USING (auth.uid()::text = user_id::text);
```

## 📚 Próximos Passos

1. **Integrar com outros serviços**
   - Adicione notificações ao aprovar/rejeitar matrículas
   - Notifique ao publicar novos arquivos
   - Alerte sobre prazos próximos

2. **Adicionar preferências de notificação**
   - Permitir usuários desativarem certos tipos
   - Configurar frequência de notificações

3. **Implementar notificações por email**
   - Enviar email para notificações importantes
   - Resumo diário de notificações

4. **Analytics**
   - Rastrear taxa de leitura
   - Identificar tipos mais relevantes
   - Otimizar mensagens

## 📖 Documentação Completa

- `NOTIFICATIONS_SYSTEM.md` - Documentação completa do sistema
- `NOTIFICATIONS_INTEGRATION_EXAMPLE.md` - Exemplos de integração
- `test-notifications.sql` - Script de teste

## ✨ Pronto!

Seu sistema de notificações está **totalmente funcional**! 🎉

Qualquer dúvida, consulte a documentação ou verifique os exemplos de código.
