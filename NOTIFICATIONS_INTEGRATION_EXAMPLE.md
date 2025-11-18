# Exemplo de Integração de Notificações

## 📚 Como Adicionar Notificações em Serviços

### Exemplo 1: Notificar ao Publicar Arquivo

```typescript
// Em services/files.service.ts

import { supabase } from '../lib/supabase';
import { notificationsService } from './notifications.service';

class FilesService {
  async publishFile(fileId: number, courseId: number) {
    // 1. Publicar o arquivo
    const { data: file, error } = await supabase
      .from('academic_files')
      .update({ status: 'published' })
      .eq('id', fileId)
      .select('*, courses(name)')
      .single();

    if (error) throw error;

    // 2. Buscar todos os alunos matriculados no curso
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('user_id')
      .eq('course_id', courseId)
      .eq('status', 'approved');

    // 3. Criar notificações para cada aluno
    if (enrollments && enrollments.length > 0) {
      const notifications = enrollments.map(enrollment => ({
        user_id: enrollment.user_id,
        type: 'info',
        title: '📚 Novo material disponível',
        message: `O arquivo "${file.title}" foi publicado no curso ${file.courses.name}`,
        read: false
      }));

      await supabase
        .from('notifications')
        .insert(notifications);
    }

    return file;
  }
}
```

### Exemplo 2: Notificar ao Aprovar Matrícula

```typescript
// Em services/enrollments.service.ts

async approveEnrollment(enrollmentId: number) {
  // 1. Aprovar a matrícula
  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .update({ status: 'approved' })
    .eq('id', enrollmentId)
    .select('*, users(name), courses(name)')
    .single();

  if (error) throw error;

  // 2. Criar notificação para o aluno
  await supabase
    .from('notifications')
    .insert({
      user_id: enrollment.user_id,
      type: 'success',
      title: '✅ Matrícula aprovada',
      message: `Sua matrícula no curso "${enrollment.courses.name}" foi aprovada!`,
      read: false
    });

  return enrollment;
}
```

### Exemplo 3: Notificar ao Rejeitar Matrícula

```typescript
async rejectEnrollment(enrollmentId: number, reason?: string) {
  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .update({ status: 'rejected' })
    .eq('id', enrollmentId)
    .select('*, users(name), courses(name)')
    .single();

  if (error) throw error;

  await supabase
    .from('notifications')
    .insert({
      user_id: enrollment.user_id,
      type: 'error',
      title: '❌ Matrícula rejeitada',
      message: reason 
        ? `Sua matrícula no curso "${enrollment.courses.name}" foi rejeitada. Motivo: ${reason}`
        : `Sua matrícula no curso "${enrollment.courses.name}" foi rejeitada.`,
      read: false
    });

  return enrollment;
}
```

### Exemplo 4: Notificar Prazo Próximo (Agendado)

```typescript
// Script que pode ser executado periodicamente (cron job)

async function notifyUpcomingDeadlines() {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Buscar tarefas com prazo próximo
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*, courses(name), enrollments(user_id)')
    .lte('due_date', threeDaysFromNow.toISOString())
    .eq('status', 'active');

  if (!assignments) return;

  for (const assignment of assignments) {
    const notifications = assignment.enrollments.map(enrollment => ({
      user_id: enrollment.user_id,
      type: 'warning',
      title: '⚠️ Prazo próximo',
      message: `O prazo para "${assignment.title}" no curso ${assignment.courses.name} termina em breve!`,
      read: false
    }));

    await supabase
      .from('notifications')
      .insert(notifications);
  }
}
```

## 🔔 Usando Triggers SQL para Notificações Automáticas

### Trigger: Notificar quando arquivo é publicado

```sql
-- Função para criar notificações quando arquivo é publicado
CREATE OR REPLACE FUNCTION notify_file_published()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se o status mudou para 'published'
    IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
        -- Inserir notificações para todos os alunos matriculados
        INSERT INTO notifications (user_id, type, title, message)
        SELECT 
            e.user_id,
            'info',
            '📚 Novo material disponível',
            'O arquivo "' || NEW.title || '" foi publicado no curso ' || c.name
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.course_id = NEW.course_id
          AND e.status = 'approved';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
CREATE TRIGGER trigger_notify_file_published
AFTER INSERT OR UPDATE ON academic_files
FOR EACH ROW
EXECUTE FUNCTION notify_file_published();
```

### Trigger: Notificar quando matrícula é aprovada/rejeitada

```sql
-- Função para notificar mudanças de status de matrícula
CREATE OR REPLACE FUNCTION notify_enrollment_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se o status mudou
    IF NEW.status != OLD.status THEN
        -- Matrícula aprovada
        IF NEW.status = 'approved' THEN
            INSERT INTO notifications (user_id, type, title, message)
            SELECT 
                NEW.user_id,
                'success',
                '✅ Matrícula aprovada',
                'Sua matrícula no curso "' || c.name || '" foi aprovada!'
            FROM courses c
            WHERE c.id = NEW.course_id;
        
        -- Matrícula rejeitada
        ELSIF NEW.status = 'rejected' THEN
            INSERT INTO notifications (user_id, type, title, message)
            SELECT 
                NEW.user_id,
                'error',
                '❌ Matrícula rejeitada',
                'Sua matrícula no curso "' || c.name || '" foi rejeitada.'
            FROM courses c
            WHERE c.id = NEW.course_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
CREATE TRIGGER trigger_notify_enrollment_status
AFTER UPDATE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION notify_enrollment_status_change();
```

## 🎯 Boas Práticas

### 1. Tipos de Notificação Consistentes

```typescript
// Criar um enum para tipos de notificação
export enum NotificationType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

// Usar o enum
await supabase
  .from('notifications')
  .insert({
    user_id: userId,
    type: NotificationType.SUCCESS,
    title: 'Operação bem-sucedida',
    message: 'Sua ação foi concluída com sucesso'
  });
```

### 2. Mensagens Claras e Acionáveis

```typescript
// ❌ Ruim
message: 'Algo aconteceu'

// ✅ Bom
message: 'Sua matrícula no curso "Algoritmos" foi aprovada. Você já pode acessar os materiais.'
```

### 3. Incluir Contexto Relevante

```typescript
// Incluir informações que ajudem o usuário a entender e agir
await supabase
  .from('notifications')
  .insert({
    user_id: userId,
    type: 'warning',
    title: '⚠️ Prazo próximo',
    message: `O prazo para entrega do trabalho "${assignmentTitle}" no curso "${courseName}" termina em ${daysLeft} dias (${dueDate}).`,
    read: false
  });
```

### 4. Evitar Spam de Notificações

```typescript
// Verificar se já existe notificação similar recente
const { data: existingNotification } = await supabase
  .from('notifications')
  .select('id')
  .eq('user_id', userId)
  .eq('type', 'info')
  .eq('title', notificationTitle)
  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // últimas 24h
  .single();

if (!existingNotification) {
  // Criar notificação apenas se não existir uma similar recente
  await supabase.from('notifications').insert({...});
}
```

### 5. Limpeza Periódica

```sql
-- Deletar notificações lidas com mais de 30 dias
DELETE FROM notifications
WHERE read = true
  AND created_at < NOW() - INTERVAL '30 days';

-- Ou criar uma função agendada no Supabase
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM notifications
    WHERE read = true
      AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

## 📊 Monitoramento

### Query para estatísticas de notificações

```sql
-- Notificações por tipo
SELECT 
    type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE read = false) as unread
FROM notifications
GROUP BY type;

-- Usuários com mais notificações não lidas
SELECT 
    u.name,
    u.email,
    COUNT(*) as unread_count
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE n.read = false
GROUP BY u.id, u.name, u.email
ORDER BY unread_count DESC
LIMIT 10;

-- Taxa de leitura de notificações
SELECT 
    COUNT(*) FILTER (WHERE read = true)::float / COUNT(*) * 100 as read_percentage
FROM notifications;
```

## 🔄 Migração de Dados

Se você já tem um sistema existente e quer adicionar notificações retroativas:

```sql
-- Criar notificações para matrículas aprovadas existentes
INSERT INTO notifications (user_id, type, title, message, read, created_at)
SELECT 
    e.user_id,
    'info',
    'Matrícula confirmada',
    'Sua matrícula no curso "' || c.name || '" está ativa.',
    true, -- Marcar como lida pois é retroativa
    e.created_at
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.status = 'approved';
```
