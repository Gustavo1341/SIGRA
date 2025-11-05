import { supabase } from '../lib/supabase';
import { Role } from '../types';
import type { User as DbUser, UserInsert, UserUpdate } from '../lib/types/database';

// Interfaces para o UsersService
export interface UserFilters {
  role?: 'admin' | 'student';
  courseId?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  courseId?: number;
  matricula?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'admin' | 'student';
  courseId?: number;
  matricula?: string;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  course: string;
  avatar: string;
  matricula?: string;
  lastLogin?: string;
  createdAt: string;
}

// Classe UsersService com métodos básicos
class UsersService {
  /**
   * Busca usuários com filtros opcionais
   */
  async getUsers(filters: UserFilters = {}): Promise<AppUser[]> {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtrar por role (admin/student)
      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      // Filtrar por courseId
      if (filters.courseId) {
        query = query.eq('course_id', filters.courseId);
      }

      // Implementar busca por nome ou email
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(`name.ilike.${searchTerm},email.ilike.${searchTerm}`);
      }

      // Implementar paginação
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw new Error('Erro ao buscar usuários. Tente novamente.');
      }

      if (!data) {
        return [];
      }

      // Converter para formato da aplicação
      return data.map(user => this.convertToAppUser(user));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar usuários.');
    }
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(id: number): Promise<AppUser> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Usuário não encontrado.');
        }
        console.error('Erro ao buscar usuário:', error);
        throw new Error('Erro ao buscar usuário. Tente novamente.');
      }

      if (!data) {
        throw new Error('Usuário não encontrado.');
      }

      return this.convertToAppUser(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar usuário.');
    }
  }

  /**
   * Cria novo usuário
   */
  async createUser(data: CreateUserData): Promise<AppUser> {
    try {
      // Validar email único
      const { data: existingEmailUser, error: emailCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        // PGRST116 = não encontrado (ok, email disponível)
        console.error('Erro ao verificar email:', emailCheckError);
        throw new Error('Erro ao validar email.');
      }

      if (existingEmailUser) {
        throw new Error('Este email já está em uso.');
      }

      // Validar matrícula única (se fornecida)
      if (data.matricula) {
        const { data: existingMatriculaUser, error: matriculaCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('matricula', data.matricula)
          .single();

        if (matriculaCheckError && matriculaCheckError.code !== 'PGRST116') {
          console.error('Erro ao verificar matrícula:', matriculaCheckError);
          throw new Error('Erro ao validar matrícula.');
        }

        if (existingMatriculaUser) {
          throw new Error('Esta matrícula já está em uso.');
        }
      }

      // Preparar dados para inserção
      const insertData: UserInsert = {
        name: data.name,
        email: data.email,
        password_hash: data.password, // O hash bcrypt será feito no backend via trigger
        role: this.convertRoleToDb(data.role),
        course_id: data.courseId || null,
        matricula: data.matricula || null,
      };

      // Inserir usuário
      // Avatar será gerado automaticamente via trigger
      // course_name será sincronizado automaticamente via trigger
      const { data: newUser, error } = await supabase
        .from('users')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar usuário:', error);
        
        // Tratar erros específicos
        if (error.code === '23505') {
          // Unique constraint violation
          if (error.message.includes('email')) {
            throw new Error('Este email já está em uso.');
          }
          if (error.message.includes('matricula')) {
            throw new Error('Esta matrícula já está em uso.');
          }
        }
        
        throw new Error('Erro ao criar usuário. Tente novamente.');
      }

      if (!newUser) {
        throw new Error('Erro ao criar usuário.');
      }

      return this.convertToAppUser(newUser);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar usuário.');
    }
  }

  /**
   * Atualiza usuário existente
   */
  async updateUser(id: number, updates: UpdateUserData): Promise<void> {
    // Implementação será feita na subtask 7.4
    throw new Error('Método não implementado');
  }

  /**
   * Deleta usuário
   */
  async deleteUser(id: number): Promise<void> {
    // Implementação será feita na subtask 7.4
    throw new Error('Método não implementado');
  }

  /**
   * Converte usuário do banco para formato da aplicação
   */
  private convertToAppUser(dbUser: DbUser): AppUser {
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
      lastLogin: dbUser.last_login || undefined,
      createdAt: dbUser.created_at,
    };
  }

  /**
   * Converte role do enum para string do banco
   */
  private convertRoleToDb(role: 'admin' | 'student'): 'admin' | 'student' {
    return role;
  }
}

// Exportar instância única do serviço
export const usersService = new UsersService();