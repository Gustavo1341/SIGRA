-- Script para testar o sistema de notificações
-- Execute este script no Supabase SQL Editor para criar notificações de teste

-- Buscar o user_id pelo email
DO $$
DECLARE
    v_user_id BIGINT;
BEGIN
    -- Buscar o ID do usuário pelo email
    SELECT id INTO v_user_id
    FROM users
    WHERE email = 'mariana.costa@example.com';

    -- Verificar se o usuário existe
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário com email mariana.costa@example.com não encontrado!';
    END IF;

    -- Notificação de sucesso (não lida)
    INSERT INTO notifications (user_id, type, title, message, read)
    VALUES (
        v_user_id,
        'success',
        '✅ Matrícula confirmada',
        'Sua matrícula no curso de Algoritmos foi confirmada com sucesso!',
        false
    );

    -- Notificação de informação (não lida)
    INSERT INTO notifications (user_id, type, title, message, read)
    VALUES (
        v_user_id,
        'info',
        '📚 Novo material disponível',
        'O professor publicou novos materiais para o curso de Estruturas de Dados.',
        false
    );

    -- Notificação de aviso (não lida)
    INSERT INTO notifications (user_id, type, title, message, read)
    VALUES (
        v_user_id,
        'warning',
        '⚠️ Prazo próximo',
        'O prazo para entrega do trabalho final termina em 3 dias.',
        false
    );

    -- Notificação de erro (lida)
    INSERT INTO notifications (user_id, type, title, message, read)
    VALUES (
        v_user_id,
        'error',
        '❌ Falha no upload',
        'Não foi possível fazer upload do arquivo. Tente novamente.',
        true
    );

    -- Notificação antiga (lida)
    INSERT INTO notifications (user_id, type, title, message, read, created_at)
    VALUES (
        v_user_id,
        'info',
        'Bem-vindo ao SIGRA',
        'Seja bem-vindo ao Sistema Integrado de Gestão de Repositório Acadêmico!',
        true,
        NOW() - INTERVAL '7 days'
    );

    RAISE NOTICE 'Notificações criadas com sucesso para o usuário: %', v_user_id;
END $$;

-- Verificar as notificações criadas
SELECT 
    u.name,
    u.email,
    n.id,
    n.type,
    n.title,
    n.message,
    n.read,
    n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE u.email = 'mariana.costa@example.com'
ORDER BY n.created_at DESC;

-- Contar notificações não lidas
SELECT 
    u.name,
    u.email,
    COUNT(*) as unread_count
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE u.email = 'mariana.costa@example.com' 
  AND n.read = false
GROUP BY u.name, u.email;
