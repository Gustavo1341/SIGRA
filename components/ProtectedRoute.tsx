import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: Role[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = '/dashboard'
}) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600"></div>
          <p className="mt-4 text-brand-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  // Salva a rota atual para redirecionar após login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se o usuário tem permissão para acessar a rota
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    console.warn(
      `Acesso negado: usuário com role ${Role[currentUser.role]} tentou acessar rota restrita a ${allowedRoles.map(r => Role[r]).join(', ')}`
    );
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
