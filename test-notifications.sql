-- Script para testar o sistema de notificações
-- Execute este script no Supabase SQL Editor para criar notificações de teste

-- Inserir notificações de teste para o primeiro usuário (assumindo user_id = 1)
-- Ajuste o user_id conforme necessário

-- Notificação de sucesso (não lida)
INSERT INTO notifications (user_id, type, title, message, read)
VALUES (
    1,
    'success',
    '✅ Matrícula confirmada',
    'Sua matrícula no curso de Algoritmos foi confirmada com sucesso!',
    false
);

-- Notificação de informação (não lida)
INSERT INTO notifications (user_id, type, title, message, read)
VALUES (
    1,
    'info',
    '📚 Novo material disponível',
    'O professor publicou novos materiais para o curso de Estruturas de Dados.',
    false
);

-- Notificação de aviso (não lida)
INSERT INTO notifications (user_id, type, title, message, read)
VALUES (
    1,
    'warning',
    '⚠️ Prazo próximo',
    'O prazo para entrega do trabalho final termina em 3 dias.',
    false
);

-- Notificação de erro (lida)
INSERT INTO notifications (user_id, type, title, message, read)
VALUES (
    1,
    'error',
    '❌ Falha no upload',
    'Não foi possível fazer upload do arquivo. Tente novamente.',
    true
);

-- Notificação antiga (lida)
INSERT INTO notifications (user_id, type, title, message, read, created_at)
VALUES (
    1,
    'info',
    'Bem-vindo ao SIGRA',
    'Seja bem-vindo ao Sistema Integrado de Gestão de Repositório Acadêmico!',
    true,
    NOW() - INTERVAL '7 days'
);

-- Verificar as notificações criadas
SELECT 
    id,
    type,
    title,
    message,
    read,
    created_at
FROM notifications
WHERE user_id = 1
ORDER BY created_at DESC;

-- Contar notificações não lidas
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = 1 AND read = false;
