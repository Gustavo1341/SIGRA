import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

/**
 * Hook para verificar permissões do usuário atual
 * 
 * NOTA: Este hook é usado apenas para controle de UI (mostrar/ocultar botões, etc).
 * A segurança real é garantida pelo Supabase RLS no backend.
 */
export function usePermissions() {
  const { currentUser } = useAuth();

  /**
   * Verifica se o usuário é admin
   */
  const isAdmin = useMemo(() => {
    return currentUser?.role === Role.Admin;
  }, [currentUser]);

  /**
   * Verifica se o usuário é estudante
   */
  const isStudent = useMemo(() => {
    return currentUser?.role === Role.Student;
  }, [currentUser]);

  /**
   * Verifica se o usuário é dono de um recurso
   */
  const isOwner = useMemo(() => {
    return (resourceOwnerId: number): boolean => {
      if (!currentUser) return false;
      return currentUser.id === resourceOwnerId;
    };
  }, [currentUser]);

  /**
   * Verifica se o usuário pode editar um recurso
   * (é admin ou é dono do recurso)
   */
  const canEdit = useMemo(() => {
    return (resourceOwnerId: number): boolean => {
      if (!currentUser) return false;
      return isAdmin || isOwner(resourceOwnerId);
    };
  }, [currentUser, isAdmin, isOwner]);

  /**
   * Verifica se o usuário pode deletar um recurso
   * (é admin ou é dono do recurso)
   */
  const canDelete = useMemo(() => {
    return (resourceOwnerId: number): boolean => {
      if (!currentUser) return false;
      return isAdmin || isOwner(resourceOwnerId);
    };
  }, [currentUser, isAdmin, isOwner]);

  return {
    isAdmin,
    isStudent,
    isOwner,
    canEdit,
    canDelete,
    currentUser,
  };
}
