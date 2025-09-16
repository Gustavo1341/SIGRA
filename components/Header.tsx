
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { BookOpenIcon, BellIcon, MoonIcon, ChevronDownIcon, UserCircleIcon, CogIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon } from './icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="h-16 bg-white border-b border-brand-gray-200 flex-shrink-0 flex items-center justify-between px-6">
      <div className="flex items-center space-x-2">
        <BookOpenIcon className="w-5 h-5 text-brand-gray-400" />
        <span className="text-brand-gray-400">/</span>
        <span className="font-medium text-brand-gray-800">SIGRA</span>
        <span className="text-brand-gray-400">/</span>
        <span className="font-medium text-brand-gray-500 bg-brand-gray-100 px-2 py-1 rounded-md text-sm">Sistema Acadêmico</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-brand-gray-100 text-brand-gray-500">
          <MoonIcon className="w-5 h-5" />
        </button>
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-brand-gray-100 text-brand-gray-500">
            <BellIcon className="w-5 h-5" />
          </button>
          <span className="absolute top-1 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </div>
        <div className="w-px h-6 bg-brand-gray-200"></div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="flex items-center space-x-2 p-1 rounded-md hover:bg-brand-gray-100 transition-colors"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-brand-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user.avatar}
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm text-brand-gray-800">{user.name}</div>
              <div className="text-xs text-brand-gray-500">{user.role === 0 ? 'Admin' : 'Student'}</div>
            </div>
            <ChevronDownIcon className={`w-4 h-4 text-brand-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
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
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100" role="menuitem">
                        <UserCircleIcon className="w-5 h-5 text-brand-gray-400"/>
                        Meu Perfil
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100" role="menuitem">
                        <CogIcon className="w-5 h-5 text-brand-gray-400"/>
                        Configurações
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100" role="menuitem">
                        <QuestionMarkCircleIcon className="w-5 h-5 text-brand-gray-400"/>
                        Ajuda
                    </a>
                </div>
                <div className="py-1 border-t border-brand-gray-200">
                    <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">
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