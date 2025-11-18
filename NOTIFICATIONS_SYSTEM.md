# Sistema de Notificações - SIGRA

## 📋 Visão Geral

O sistema de notificações do SIGRA permite que os usuários recebam e visualizem notificações em tempo real através de um ícone de sino (bell) no cabeçalho da aplicação.

## ✨ Funcionalidades

- ✅ **Notificações em tempo real** - Receba notificações instantaneamente usando Supabase Realtime
- 🔔 **Badge de contador** - Visualize o número de notificações não lidas
- 📱 **Dropdown interativo** - Acesse todas as notificações em um menu dropdown
- ✓ **Marcar como lida** - Marque notificações individuais ou todas de uma vez
- 🗑️ **Deletar notificações** - Remova notificações indesejadas
- 🎨 **Tipos de notificação** - Suporte para diferentes tipos (success, info, warning, error)
- ⏰ **Timestamps relativos** - Veja quando cada notificação foi recebida

## 🏗️ Arquitetura

### Componentes Criados

1. **`services/notifications.service.ts`**
   - Serviço para gerenciar todas as operações de notificações
   - Métodos: getNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification
   - Suporte a Realtime subscriptions

2. **`src/hooks/useNotifications.ts`**
   - Hook React customizado para gerenciar estado de notificações
   - Atualização automática em tempo real
   - Gerenciamento de loading e error states

3. **`components/NotificationsDropdown.tsx`**
   - Componente de UI para exibir o dropdown de notificações
   - Formatação de datas relativas
   - Ícones por tipo de notificação

4. **`components/Header.tsx`** (atualizado)
   - Integração do botão de notificações
   - Badge com contador de não lidas
   - Toggle do dropdown

## 🚀 Como Usar

### Para Usuários

1. Clique no ícone de sino (🔔) no cabeçalho
2. Visualize suas notificações no dropdown
3. Clique em "Marcar como lida" para marcar uma notificação específica
4. Clique em "Marcar todas como lidas" para limpar todas de uma vez
5. Use o ícone ❌ para deletar notificações individuais

### Para Desenvolvedores

#### Criar uma Notificação

```typescript
import { supabase } from '../lib/supabase';

// Criar notificação para um usuário
await supabase
  .from('notifications')
  .insert({
    user_id: userId,
    type: 'success', // 'success', 'info', 'warning', 'error'
    title: 'Título da Notificação',
    message: 'Mensagem detalhada da notificação',
    read: false
  });
```

#### Usar o Hook em um Componente

```typescript
import { useNotifications } from '../src/hooks/useNotifications';

function MyComponent({ userId }) {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh
  } = useNotifications(userId);

  // Use os dados e métodos conforme necessário
}
```

## 🧪 Testando

1. Execute o script SQL de teste:
   ```bash
   # No Supabase SQL Editor, execute:
   test-notifications.sql
   ```

2. Ajuste o `user_id` no script para corresponder ao seu usuário de teste

3. Recarregue a aplicação e clique no ícone de sino

## 📊 Estrutura do Banco de Dados

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tipos de Notificação

- `success` - ✅ Ações bem-sucedidas
- `info` - ℹ️ Informações gerais
- `warning` - ⚠️ Avisos importantes
- `error` - ❌ Erros ou problemas

## 🔐 Segurança (RLS)

As políticas de Row Level Security (RLS) garantem que:
- Usuários só podem ver suas próprias notificações
- O sistema pode criar notificações para qualquer usuário
- Usuários podem marcar suas notificações como lidas
- Usuários podem deletar suas próprias notificações

## 🎯 Casos de Uso

### Notificações Automáticas

O sistema já está configurado para criar notificações automaticamente em:
- ✅ Validação de matrícula bem-sucedida
- 📝 Novo usuário criado
- 📚 Arquivo acadêmico publicado (pode ser implementado)
- 📊 Relatórios gerados (pode ser implementado)

### Adicionar Notificações em Triggers

```sql
-- Exemplo: Notificar quando um arquivo é publicado
CREATE OR REPLACE FUNCTION notify_file_published()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
        INSERT INTO notifications (user_id, type, title, message)
        SELECT 
            e.user_id,
            'info',
            'Novo arquivo disponível',
            'O arquivo "' || NEW.file_name || '" foi publicado no curso ' || c.name
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.course_id = NEW.course_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_file_published
AFTER UPDATE ON academic_files
FOR EACH ROW
EXECUTE FUNCTION notify_file_published();
```

## 🔄 Realtime

O sistema usa Supabase Realtime para receber notificações instantaneamente sem necessidade de polling ou refresh manual.

## 📝 Notas

- As notificações são carregadas automaticamente ao montar o componente Header
- O contador de não lidas é atualizado em tempo real
- O dropdown fecha automaticamente ao clicar fora dele
- As notificações são ordenadas por data (mais recentes primeiro)
- Limite padrão de 20 notificações por vez (pode ser ajustado)

## 🐛 Troubleshooting

### Notificações não aparecem
1. Verifique se o usuário está autenticado
2. Confirme que existem notificações no banco de dados para o user_id
3. Verifique as políticas RLS no Supabase
4. Confira o console do navegador para erros

### Realtime não funciona
1. Verifique se o Realtime está habilitado no Supabase
2. Confirme que a tabela `notifications` tem Realtime habilitado
3. Verifique a conexão com o Supabase

### Badge não atualiza
1. Verifique se o hook está sendo chamado com o userId correto
2. Confirme que as notificações têm o campo `read` correto
3. Verifique o console para erros no serviço
