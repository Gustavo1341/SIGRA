import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Role } from '../types';
import { HomeIcon, CheckBadgeIcon, UsersIcon, DocumentDuplicateIcon, SearchIcon, CogIcon, UploadIcon, SigraLogoIcon } from './icons';

interface SidebarProps {
  user: User;
  pendingEnrollmentsCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const commonStyles = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg";
const activeStyles = "bg-brand-blue-600 text-white shadow-sm";
const inactiveStyles = "text-brand-gray-600 hover:bg-brand-gray-100 hover:text-brand-gray-900";

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; badge?: number; }> = ({ to, icon, label, badge = 0 }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `${commonStyles} ${isActive ? activeStyles : inactiveStyles}`}
  >
    {icon}
    <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
    {badge > 0 && <span className="inline-flex items-center justify-center px-2 ml-3 text-xs font-semibold text-white bg-brand-error-500 rounded-full shadow-sm animate-pulse">{badge}</span>}
  </NavLink>
);

const studentNav = [
  { to: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/my-files', icon: <DocumentDuplicateIcon className="w-5 h-5" />, label: 'Meus Arquivos' },
  { to: '/publish-file', icon: <UploadIcon className="w-5 h-5" />, label: 'Publicar Arquivo' },
  { to: '/all-courses', icon: <SearchIcon className="w-5 h-5" />, label: 'Explorar Repositório' },
];

const Sidebar: React.FC<SidebarProps> = ({ user, pendingEnrollmentsCount, isOpen, setIsOpen }) => {
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
      <aside className={`w-64 flex-shrink-0 bg-white border-r border-brand-gray-200 flex flex-col fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-4 border-b border-brand-gray-200 bg-gradient-to-r from-white to-brand-gray-25">
          <div className="flex items-center gap-3">
              <div className="p-1.5 bg-brand-blue-600 rounded-lg shadow-sm">
                <SigraLogoIcon className="h-6 w-auto text-white"/>
              </div>
              <div>
                  <h1 className="text-lg font-bold text-brand-gray-900">SIGRA</h1>
                  <p className="text-xs text-brand-gray-500">Sistema Acadêmico</p>
              </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <div>
            <h2 className="px-4 text-xs font-semibold text-brand-gray-400 uppercase tracking-wider">{navTitle}</h2>
            <nav className="mt-2 space-y-1">
              {navItems.map(item => <NavItem key={item.to} {...item} />)}
            </nav>
          </div>
        </div>
        <div className="p-4 border-t border-brand-gray-200 text-xs text-brand-gray-400 bg-brand-gray-25">
          <p className="font-medium text-brand-gray-600">&copy; 2025 SIGRA</p>
          <p className="mt-0.5">Versão 1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;