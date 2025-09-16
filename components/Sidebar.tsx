import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Role } from '../types';
import { HomeIcon, CheckBadgeIcon, UsersIcon, BookOpenIcon, DocumentDuplicateIcon, SearchIcon, ChartBarIcon, CogIcon, UploadIcon, SigraLogoIcon } from './icons';

interface SidebarProps {
  user: User;
  pendingEnrollmentsCount: number;
}

const commonStyles = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg";
const activeStyles = "bg-brand-blue-500 text-white shadow";
const inactiveStyles = "text-brand-gray-600 hover:bg-brand-gray-200 hover:text-brand-gray-900";

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; badge?: number; }> = ({ to, icon, label, badge = 0 }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `${commonStyles} ${isActive ? activeStyles : inactiveStyles}`}
  >
    {icon}
    <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
    {badge > 0 && <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-white bg-red-500 rounded-full">{badge}</span>}
  </NavLink>
);

const studentNav = [
  { to: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/my-files', icon: <DocumentDuplicateIcon className="w-5 h-5" />, label: 'Meus Arquivos' },
  { to: '/publish-file', icon: <UploadIcon className="w-5 h-5" />, label: 'Publicar Arquivo' },
  { to: '/all-courses', icon: <BookOpenIcon className="w-5 h-5" />, label: 'Todos os Cursos' },
  { to: '/explore', icon: <SearchIcon className="w-5 h-5" />, label: 'Explorar Repositório...' },
];

const featuredCourses = [
  { to: '#!', name: 'Ciência da Computação' },
  { to: '#!', name: 'Medicina' },
];

const quickAccessCourses = [
  { to: '#!', name: 'Ciência da Computação' },
  { to: '#!', name: 'Medicina' },
  { to: '#!', name: 'Direito' },
  { to: '#!', name: 'Administração' },
];

const Sidebar: React.FC<SidebarProps> = ({ user, pendingEnrollmentsCount }) => {
  const isAdmin = user.role === Role.Admin;

  const adminNav = [
    { to: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/validate-enrollments', icon: <CheckBadgeIcon className="w-5 h-5" />, label: 'Validar Matrículas', badge: pendingEnrollmentsCount },
    { to: '/user-management', icon: <UsersIcon className="w-5 h-5" />, label: 'Gestão de Usuários' },
    { to: '/all-courses', icon: <BookOpenIcon className="w-5 h-5" />, label: 'Todos os Cursos' },
    { to: '/explore', icon: <SearchIcon className="w-5 h-5" />, label: 'Explorar Repositório...' },
    { to: '/reports', icon: <ChartBarIcon className="w-5 h-5" />, label: 'Relatórios' },
    { to: '/settings', icon: <CogIcon className="w-5 h-5" />, label: 'Configurações' },
  ];

  const navItems = isAdmin ? adminNav : studentNav;
  const courseItems = isAdmin ? featuredCourses : quickAccessCourses;
  const courseTitle = isAdmin ? 'CURSOS EM DESTAQUE' : 'ACESSO RÁPIDO';
  const navTitle = isAdmin ? 'ADMINISTRAÇÃO' : 'NAVEGAÇÃO';

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-brand-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-4 border-b border-brand-gray-200">
        <div className="flex items-center gap-3">
            <SigraLogoIcon className="h-8 w-auto"/>
            <div>
                <h1 className="text-lg font-bold text-brand-gray-800">SIGRA</h1>
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
        <div>
          <h2 className="px-4 text-xs font-semibold text-brand-gray-400 uppercase tracking-wider">{courseTitle}</h2>
          <div className="mt-2 space-y-1">
            {courseItems.map(course => (
              <a key={course.name} href={course.to} className={`${commonStyles} ${inactiveStyles}`}>
                <BookOpenIcon className="w-5 h-5" />
                <span className="ml-3">{course.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-brand-gray-200 text-xs text-brand-gray-500">
        <p>&copy; 2025 SIGRA - Sistema Acadêmico</p>
        <p>Versão 1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;