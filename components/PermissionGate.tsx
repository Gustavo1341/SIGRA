import React from 'react';
import { usePermissions } from '../src/hooks/usePermissions';
import { Role } from '../types';

interface PermissionGateProps {
  children: React.ReactNode;
  /** Roles permitidas para ver o conteúdo */
  allowedRoles?: Role[];
  /** Se true, renderiza children quando NÃO tem permissão (inverso) */
  fallback?: React.ReactNode;
  /** ID do dono do recurso (para verificar ownership) */
  resourceOwnerId?: number;
  /** Se true, permite acesso se for dono OU admin */
  allowOwner?: boolean;
}

/**
 * Componente para controlar visibilidade baseado em permissões
 * 
 * Exemplos:
 * - <PermissionGate allowedRoles={[Role.Admin]}>Conteúdo admin</PermissionGate>
 * - <PermissionGate resourceOwnerId={file.userId} allowOwner>Editar</PermissionGate>
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  allowedRoles,
  fallback = null,
  resourceOwnerId,
  allowOwner = false,
}) => {
  const { currentUser, isAdmin, isOwner } = usePermissions();

  // Se não está autenticado, não mostra nada
  if (!currentUser) {
    return <>{fallback}</>;
  }

  // Verifica role
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Se permite owner e é dono, mostra
    if (allowOwner && resourceOwnerId !== undefined && isOwner(resourceOwnerId)) {
      return <>{children}</>;
    }
    return <>{fallback}</>;
  }

  // Verifica ownership se especificado
  if (resourceOwnerId !== undefined && allowOwner) {
    if (!isAdmin && !isOwner(resourceOwnerId)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default PermissionGate;
