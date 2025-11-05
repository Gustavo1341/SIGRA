import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Role } from '../types';
import { HomeIcon, CheckBadgeIcon, UsersIcon, DocumentDuplicateIcon, SearchIcon, CogIcon, UploadIcon, SigraLogoIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface SidebarProps {
  user: User;
  pendingEnrollmentsCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
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
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-brand-error-500 rounded-full shadow-sm">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    {!isCollapsed && (
      <>
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
        {badge > 0 && (
          <span className="inline-flex items-center justify-center px-2 ml-3 text-xs font-semibold text-white bg-brand-error-500 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </>
    )}
    {isCollapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-brand-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
        {badge > 0 && <span className="ml-1 text-brand-error-300">({badge})</span>}
      </div>
    )}
  </NavLink>
);

const studentNav = [
  { to: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/my-files', icon: <DocumentDuplicateIcon className="w-5 h-5" />, label: 'Meus Arquivos' },
  { to: '/publish-file', icon: <UploadIcon className="w-5 h-5" />, label: 'Publicar Arquivo' },
  { to: '/all-courses', icon: <SearchIcon className="w-5 h-5" />, label: 'Explorar Repositório' },
];

const Sidebar: React.FC<SidebarProps> = ({ user, pendingEnrollmentsCount, isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const isAdmin = user.role === Role.Admin;

  const adminNav = [
    { to: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/validate-enrollments', icon: <CheckBadgeIcon className="w-5 h-5" />, label: 'Validar Matrículas', badge: pendingEnrollmentsCount },
    { to: '/user-management', icon: <UsersIcon className="w-5 h-5" />, label: 'Gestão de Usuários' },
    { to: '/all-courses', icon: <SearchIcon className="w-5 h-5" />, label: 'Explorar Repositório' },
    { to: '/settings', icon: <CogIcon className="w-5 h-5" />, label: 'Configurações' },
  ];

  const navItems = isAdmin ? adminNav : studentNav;
  const navTitle = isAdmin ? 'ADMINISTRAÇÃO' : 'NAVEGAÇÃO';

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 bg-white border-r border-brand-gray-200 flex flex-col fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out lg:translate-x-0 overflow-x-hidden ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-gray-200 bg-gradient-to-r from-white to-brand-gray-25">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="p-1.5 bg-brand-blue-600 rounded-lg shadow-sm">
              <SigraLogoIcon className="h-6 w-auto text-white"/>
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-brand-gray-900">SIGRA</h1>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-gray-100 text-brand-gray-600 hover:text-brand-gray-900 transition-colors"
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
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
        <div className={`p-4 border-t border-brand-gray-200 text-xs text-brand-gray-400 bg-brand-gray-25 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <>
              <p className="font-medium text-brand-gray-600">&copy; 2025 SIGRA</p>
              <p className="mt-0.5">Versão 1.0.0</p>
            </>
          ) : (
            <p className="font-medium text-brand-gray-600 text-[10px]">&copy; 2025</p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;