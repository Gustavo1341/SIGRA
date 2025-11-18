
import React, { useState } from 'react';
import { User } from '../types';
import { Bars3Icon, BellIcon } from './icons';
import { useNotifications } from '../src/hooks/useNotifications';
import NotificationsDropdown from './NotificationsDropdown';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications(user.id);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-brand-gray-200 flex items-center justify-between px-4 sm:px-6 w-full relative z-50">
      <div className="flex items-center space-x-2">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 -ml-2 text-brand-gray-600 hover:bg-brand-gray-100 rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

      </div>
      <div className="flex items-center">
        <div className="relative z-[100]">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg hover:bg-brand-gray-100 text-brand-gray-500 transition-all duration-200 hover:text-brand-gray-700 relative"
            aria-label="Notificações"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1 right-1.5 block h-2 w-2 rounded-full bg-brand-error-500 ring-2 ring-white animate-pulse"></span>
                <span className="absolute -top-1 -right-1 bg-brand-error-500 text-white text-xs font-bold rounded-full h-5 min-w-[1.25rem] flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </>
            )}
          </button>
          {isNotificationsOpen && (
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              loading={loading}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
              onClose={() => setIsNotificationsOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
