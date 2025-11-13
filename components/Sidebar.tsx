import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Role } from '../types';
import { HomeIcon, CheckBadgeIcon, UsersIcon, BookOpenIcon, SearchIcon, CogIcon, CloudArrowUpIcon, SigraLogoIcon, FolderIcon } from './icons';

interface SidebarProps {
  user: User;
  pendingEnrollmentsCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onLogout: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isCollapsed: boolean;
}

const commonStyles = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg";
const activeStyles = "bg-brand-blue-600 text-white shadow-sm";
const inactiveStyles = "text-brand-gray-600 hover:bg-brand-gray-100 hover:text-brand-gray-900";

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, badge = 0, isCollapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `${commonStyles} ${isActive ? activeStyles : inactiveStyles} ${isCollapsed ? 'justify-center px-2' : ''} relative group`}
    title={isCollapsed ? label : undefined}
  >
    <div className="relative">
      {icon}
      {badge > 0 && isCollapsed && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-brand-blue-700 rounded-full shadow-sm">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    {!isCollapsed && (
      <>
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
        {badge > 0 && (
          <span className="inline-flex items-center justify-center px-2 ml-3 text-xs font-semibold text-white bg-brand-blue-700 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </>
    )}

  </NavLink>
);

const studentNav = [
  { to: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/my-files', icon: <FolderIcon className="w-5 h-5" />, label: 'Meus Arquivos' },
  { to: '/publish-file', icon: <CloudArrowUpIcon className="w-5 h-5" />, label: 'Publicar Arquivo' },
  { to: '/all-courses', icon: <BookOpenIcon className="w-5 h-5" />, label: 'Explorar Repositório' },
];

const Sidebar: React.FC<SidebarProps> = ({ user, pendingEnrollmentsCount, isOpen, setIsOpen, isCollapsed, setIsCollapsed, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAdmin = user.role === Role.Admin;

  const adminNav = [
    { to: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/validate-enrollments', icon: <CheckBadgeIcon className="w-5 h-5" />, label: 'Validar Matrículas', badge: pendingEnrollmentsCount },
    { to: '/user-management', icon: <UsersIcon className="w-5 h-5" />, label: 'Gestão de Usuários' },
    { to: '/all-courses', icon: <BookOpenIcon className="w-5 h-5" />, label: 'Explorar Repositório' },
  ];

  const navItems = isAdmin ? adminNav : studentNav;
  const navTitle = isAdmin ? 'ADMINISTRAÇÃO' : 'NAVEGAÇÃO';

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>
      <aside className={`flex-shrink-0 bg-white border-r border-brand-gray-200 flex flex-col z-30 transition-all duration-300 ease-in-out overflow-hidden fixed lg:sticky inset-y-0 lg:top-0 left-0 transform ${isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'w-20' : 'w-64'} h-screen`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-gray-200 bg-gradient-to-r from-white to-brand-gray-25">
          <div 
            className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full cursor-pointer group' : ''} outline-none focus:outline-none`}
            onClick={() => isCollapsed && setIsCollapsed(false)}
            tabIndex={isCollapsed ? 0 : -1}
          >
            <div className="p-1.5 bg-brand-blue-600 rounded-lg shadow-sm outline-none focus:outline-none">
              {isCollapsed ? (
                <>
                  <SigraLogoIcon className="h-6 w-auto text-white group-hover:hidden outline-none"/>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-white hidden group-hover:block transform scale-x-[-1] outline-none" style={{outline: 'none'}}>
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M9 3.5v17m7-5.5l-3-3l3-3"/>
                      <path d="M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"/>
                    </g>
                  </svg>
                </>
              ) : (
                <SigraLogoIcon className="h-6 w-auto text-white outline-none"/>
              )}
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-brand-gray-900">SIGRA</h1>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-gray-100 text-brand-gray-600 hover:text-brand-gray-900 transition-colors"
              aria-label="Recolher sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                  <path d="M9 3.5v17m7-5.5l-3-3l3-3"/>
                  <path d="M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"/>
                </g>
              </svg>
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6">
          <div>
            {!isCollapsed && (
              <h2 className="px-4 text-xs font-semibold text-brand-gray-400 uppercase tracking-wider mb-2">{navTitle}</h2>
            )}
            <nav className="space-y-1">
              {navItems.map(item => <NavItem key={item.to} {...item} isCollapsed={isCollapsed} />)}
            </nav>
          </div>
        </div>
        <div className="border-t border-brand-gray-200 bg-brand-gray-25 flex-shrink-0 relative mt-auto">
          {!isCollapsed ? (
            <>
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="w-full flex items-center gap-3 p-4 hover:bg-brand-gray-100 transition-all duration-200"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-blue-700 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-sm text-brand-gray-900 truncate">{user.name}</div>
                    <div className="text-xs text-brand-gray-500">{user.role === 0 ? 'Admin' : 'Estudante'}</div>
                  </div>
                  <svg className={`w-4 h-4 text-brand-gray-400 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-white rounded-xl border border-brand-gray-300 shadow-xl z-[100] animate-scaleIn">
                    <div className="py-1">
                      <NavLink to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-gray-700 hover:bg-brand-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-brand-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configurações
                      </NavLink>
                      <NavLink to="/help" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-gray-700 hover:bg-brand-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-brand-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ajuda
                      </NavLink>
                    </div>
                    <div className="py-1 border-t border-brand-gray-200">
                      <button onClick={() => { onLogout(); setIsDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-brand-error-600 hover:bg-brand-error-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-4 hover:bg-brand-gray-100 transition-all duration-200"
                  aria-label="Menu do usuário"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-blue-700 flex items-center justify-center text-white font-bold text-base">
                    {user.avatar}
                  </div>
                </button>
                {isDropdownOpen && (
                  <div className="absolute bottom-full left-full ml-2 mb-4 w-56 bg-white rounded-xl border border-brand-gray-300 shadow-xl z-[100] animate-scaleIn">
                    <div className="px-4 py-3 border-b border-brand-gray-200">
                      <p className="text-sm font-semibold text-brand-gray-900">{user.name}</p>
                      <p className="text-sm text-brand-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <NavLink to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-gray-700 hover:bg-brand-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-brand-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configurações
                      </NavLink>
                      <NavLink to="/help" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-gray-700 hover:bg-brand-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-brand-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ajuda
                      </NavLink>
                    </div>
                    <div className="py-1 border-t border-brand-gray-200">
                      <button onClick={() => { onLogout(); setIsDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-brand-error-600 hover:bg-brand-error-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;