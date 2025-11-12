
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { Bars3Icon, BookOpenIcon, BellIcon, MoonIcon, ChevronDownIcon, UserCircleIcon, CogIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon } from './icons';
import { useNotifications } from '../src/hooks/useNotifications';
import NotificationsDropdown from './NotificationsDropdown';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications(user.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-brand-gray-200 flex-shrink-0 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-2">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 -ml-2 text-brand-gray-600 hover:bg-brand-gray-100 rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="p-2 rounded-lg hover:bg-brand-gray-100 text-brand-gray-500 transition-all duration-200 hover:text-brand-gray-700">
          <MoonIcon className="w-5 h-5" />
        </button>
        <div className="relative">
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
        <div className="w-px h-6 bg-brand-gray-200"></div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-brand-gray-100 transition-all duration-200"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-blue-700 flex items-center justify-center text-white font-bold text-sm">
              {user.avatar}
            </div>
            <div className="hidden md:block text-left">
              <div className="font-semibold text-sm text-brand-gray-900">{user.name}</div>
              <div className="text-xs text-brand-gray-500">{user.role === 0 ? 'Admin' : 'Estudante'}</div>
            </div>
            <ChevronDownIcon className={`w-4 h-4 text-brand-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl border border-brand-gray-300 focus:outline-none z-10 animate-scaleIn">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                <div className="px-4 py-3 border-b border-brand-gray-200">
                    <p className="text-sm font-semibold text-brand-gray-900" role="none">
                        {user.name}
                    </p>
                    <p className="text-sm text-brand-gray-500 truncate" role="none">
                        {user.email}
                    </p>
                </div>
                <div className="py-1">
                    <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-gray-700 hover:bg-brand-gray-50 transition-colors" role="menuitem">
                        <CogIcon className="w-5 h-5 text-brand-gray-400"/>
                        Configurações
                    </Link>
                    <a href="#" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-gray-700 hover:bg-brand-gray-50 transition-colors" role="menuitem">
                        <QuestionMarkCircleIcon className="w-5 h-5 text-brand-gray-400"/>
                        Ajuda
                    </a>
                </div>
                <div className="py-1 border-t border-brand-gray-200">
                    <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-brand-error-600 hover:bg-brand-error-50 transition-colors" role="menuitem">
                        <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                        Sair
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
