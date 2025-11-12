import React, { useRef, useEffect } from 'react';
import { NotificationWithDetails } from '../services/notifications.service';
import { XMarkIcon, CheckIcon } from './icons';

interface NotificationsDropdownProps {
  notifications: NotificationWithDetails[];
  unreadCount: number;
  loading: boolean;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  unreadCount,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClose
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] origin-top-right bg-white rounded-xl border border-brand-gray-300 shadow-lg z-50 animate-scaleIn"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-gray-200">
        <div>
          <h3 className="text-sm font-semibold text-brand-gray-900">Notificações</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-brand-gray-500">{unreadCount} não lida{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-brand-blue-600 hover:text-brand-blue-700 font-medium"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="text-4xl mb-2">🔔</div>
            <p className="text-sm text-brand-gray-500 text-center">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-brand-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-brand-gray-50 transition-colors ${
                  notification.unread ? 'bg-brand-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-xl mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-brand-gray-900 line-clamp-1">
                        {notification.title}
                      </h4>
                      <button
                        onClick={() => onDelete(notification.id)}
                        className="flex-shrink-0 p-1 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-100 rounded transition-colors"
                        aria-label="Deletar notificação"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-brand-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-brand-gray-500">
                        {formatDate(notification.created_at)}
                      </span>
                      {notification.unread && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="flex items-center gap-1 text-xs text-brand-blue-600 hover:text-brand-blue-700 font-medium"
                        >
                          <CheckIcon className="w-3 h-3" />
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-brand-gray-200 text-center">
          <button
            onClick={onClose}
            className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
