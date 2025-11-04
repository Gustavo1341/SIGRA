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
   */
  async updateProfile(userId: number, updates: UpdateProfileData): Promise<void> {
    try {
      // Validar unicidade de email antes de atualizar (se email foi fornecido)
      if (updates.email) {
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('email', updates.email)
          .neq('id', userId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 = não encontrado (ok, email disponível)
          console.error('Erro ao verificar email:', checkError);
          throw new Error('Erro ao validar email.');
        }

        if (existingUser) {
          throw new Error('Este email já está em uso por outro usuário.');
        }
      }

      // Atualizar perfil
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name) updateData.name = updates.name;
      if (updates.email) updateData.email = updates.email;

      // @ts-ignore - Supabase types issue
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw new Error('Erro ao atualizar perfil. Tente novamente.');
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
   * Nota: O hash bcrypt é feito no backend via trigger ou função
   */
  async changePassword(userId: number, passwordData: ChangePasswordData): Promise<void> {
    try {
      // Primeiro, verificar senha atual
      const { data: user, error: getUserError } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (getUserError || !user) {
        throw new Error('Usuário não encontrado.');
      }

      // Verificar senha atual usando authenticate_user
      // @ts-ignore - Supabase types issue
      const { data: authData, error: authError } = await supabase.rpc('authenticate_user', {
        p_email: user.email,
        p_password: passwordData.currentPassword,
      }) as { data: AuthenticateUserResult[] | null; error: any };

      if (authError || !authData || authData.length === 0) {
        throw new Error('Senha atual incorreta.');
      }

      // Atualizar senha (o hash será feito no backend)
      // Como não temos uma função específica para isso, vamos atualizar diretamente
      // Nota: Em produção, seria melhor ter uma função RPC específica que faça o hash
      // @ts-ignore - Supabase types issue
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordData.newPassword as any, // Backend deve fazer hash via trigger
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', userId);

      if (updateError) {
        console.error('Erro ao alterar senha:', updateError);
        throw new Error('Erro ao alterar senha. Tente novamente.');
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
