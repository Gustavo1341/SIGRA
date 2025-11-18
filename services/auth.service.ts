import { supabase } from '../lib/supabase';
import { Role } from '../types';
import type { AuthenticateUserResult } from '../lib/types/database';

// Interfaces para o AuthService
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  course: string;
  avatar: string;
  matricula?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Classe AuthService com métodos básicos
class AuthService {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      // Chamar função RPC authenticate_user do Supabase
      // @ts-ignore - Supabase types issue
      const { data, error } = await supabase.rpc('authenticate_user', {
        p_email: credentials.email,
        p_password: credentials.password,
      }) as { data: AuthenticateUserResult[] | null; error: any };

      // Tratar erros de credenciais inválidas
      if (error) {
        console.error('Erro ao autenticar usuário:', error);
        throw new Error('Erro ao autenticar. Verifique suas credenciais.');
      }

      // Verificar se retornou dados
      if (!data || data.length === 0) {
        throw new Error('Email ou senha incorretos.');
      }

      // Pegar primeiro resultado (deve ser único)
      const dbUser = data[0];

      // Converter para formato da aplicação
      const authUser = this.convertToAuthUser(dbUser);

      return authUser;
    } catch (error) {
      // Re-lançar erro com mensagem apropriada
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao realizar login. Tente novamente.');
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    // Limpar dados de sessão
    // Por enquanto, apenas uma implementação básica
  }

  /**
   * Atualiza perfil do usuário (name e email)
   * Usa função RPC update_user_profile que valida email e atualiza dados
   */
  async updateProfile(userId: number, updates: UpdateProfileData): Promise<void> {
    try {
      // Chamar função RPC update_user_profile
      // @ts-ignore - Supabase types issue
      const { data, error } = await supabase.rpc('update_user_profile', {
        p_user_id: userId,
        p_name: updates.name || null,
        p_email: updates.email || null,
      });

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        
        // Tratar mensagens de erro específicas
        if (error.message?.includes('já está em uso')) {
          throw new Error('Este email já está em uso por outro usuário.');
        }
        if (error.message?.includes('Usuário não encontrado')) {
          throw new Error('Usuário não encontrado.');
        }
        
        throw new Error('Erro ao atualizar perfil. Tente novamente.');
      }

      if (!data) {
        throw new Error('Erro ao atualizar perfil.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar perfil.');
    }
  }

  /**
   * Altera senha do usuário
   * Usa a função RPC change_user_password que valida a senha atual e faz hash bcrypt
   */
  async changePassword(userId: number, passwordData: ChangePasswordData): Promise<void> {
    try {
      // Chamar função RPC change_user_password
      // @ts-ignore - Supabase types issue
      const { data, error } = await supabase.rpc('change_user_password', {
        p_user_id: userId,
        p_current_password: passwordData.currentPassword,
        p_new_password: passwordData.newPassword,
      });

      if (error) {
        console.error('Erro ao alterar senha:', error);
        
        // Tratar mensagens de erro específicas
        if (error.message?.includes('Senha atual incorreta')) {
          throw new Error('Senha atual incorreta.');
        }
        if (error.message?.includes('Usuário não encontrado')) {
          throw new Error('Usuário não encontrado.');
        }
        
        throw new Error('Erro ao alterar senha. Tente novamente.');
      }

      if (!data) {
        throw new Error('Erro ao alterar senha.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao alterar senha.');
    }
  }

  /**
   * Converte resultado do banco para AuthUser
   */
  private convertToAuthUser(dbUser: AuthenticateUserResult): AuthUser {
    // Converter role de string para enum Role
    const role = dbUser.role === 'admin' ? Role.Admin : Role.Student;

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role,
      course: dbUser.course_name || '',
      avatar: dbUser.avatar || '',
      matricula: dbUser.matricula || undefined,
    };
  }
}

// Exportar instância única do serviço
export const authService = new AuthService();
