import { supabase } from '../lib/supabase';
import type { Notification } from '../lib/types/database';

export interface NotificationWithDetails extends Notification {
  unread?: boolean;
}

class NotificationsService {
  /**
   * Busca notificações do usuário
   */
  async getNotifications(userId: number, limit = 20): Promise<NotificationWithDetails[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }

    return (data || []).map(notification => ({
      ...notification,
      unread: !notification.read
    }));
  }

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(notificationId: number): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  async markAllAsRead(userId: number): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      throw error;
    }
  }

  /**
   * Conta notificações não lidas
   */
  async getUnreadCount(userId: number): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Deleta uma notificação
   */
  async deleteNotification(notificationId: number): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  }

  /**
   * Inscreve-se para receber notificações em tempo real
   */
  subscribeToNotifications(userId: number, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const notificationsService = new NotificationsService();
