import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [position, setPosition] = React.useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Encontra o botão de notificações para posicionar o dropdown
    const button = document.querySelector('[aria-label="Notificações"]');
    if (button) {
      buttonRef.current = button as HTMLElement;
      const rect = button.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Verifica se o clique foi no botão de notificações ou dentro dele
      const notificationButton = document.querySelector('[aria-label="Notificações"]');
      const clickedButton = notificationButton?.contains(target);
      
      // Verifica se o clique foi dentro do dropdown
      const clickedInside = dropdownRef.current?.contains(target);
      
      // Fecha apenas se clicou fora do dropdown E fora do botão
      if (!clickedInside && !clickedButton) {
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

  const dropdown = (
    <div
      ref={dropdownRef}
      className="fixed w-[calc(100%-2rem)] sm:w-96 origin-top bg-white rounded-2xl sm:rounded-xl border border-brand-gray-200 shadow-2xl sm:shadow-lg z-[9999] animate-scaleIn overflow-hidden"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
        left: 'auto'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-brand-blue-50 to-white border-b border-brand-gray-200">
        <div>
          <h3 className="text-base sm:text-sm font-bold text-brand-gray-900">Notificações</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-brand-gray-600 mt-0.5">
              {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs sm:text-xs text-brand-blue-600 hover:text-brand-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-blue-100 transition-colors"
          >
            <span className="hidden sm:inline">Marcar todas como lidas</span>
            <span className="sm:hidden">Marcar todas</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-6xl sm:text-5xl mb-3">🔔</div>
            <p className="text-base sm:text-sm font-medium text-brand-gray-900 mb-1">Nenhuma notificação</p>
            <p className="text-sm sm:text-xs text-brand-gray-500 text-center">Você está em dia!</p>
          </div>
        ) : (
          <div className="divide-y divide-brand-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-5 py-4 hover:bg-brand-gray-50 active:bg-brand-gray-100 transition-colors ${
                  notification.unread ? 'bg-brand-blue-50/40 border-l-4 border-brand-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-2xl sm:text-xl mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base sm:text-sm font-semibold text-brand-gray-900 line-clamp-2">
                        {notification.title}
                      </h4>
                      <button
                        onClick={() => onDelete(notification.id)}
                        className="flex-shrink-0 p-1.5 sm:p-1 text-brand-gray-400 hover:text-brand-error-600 hover:bg-brand-error-50 rounded-lg transition-colors"
                        aria-label="Deletar notificação"
                      >
                        <XMarkIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <p className="text-sm sm:text-sm text-brand-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3 gap-2">
                      <span className="text-xs text-brand-gray-500 font-medium">
                        {formatDate(notification.created_at)}
                      </span>
                      {notification.unread && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="flex items-center gap-1.5 text-xs text-brand-blue-600 hover:text-brand-blue-700 font-semibold px-2.5 py-1 rounded-md hover:bg-brand-blue-50 transition-colors"
                        >
                          <CheckIcon className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Marcar como lida</span>
                          <span className="sm:hidden">Lida</span>
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

  return createPortal(dropdown, document.body);
};

export default NotificationsDropdown;
