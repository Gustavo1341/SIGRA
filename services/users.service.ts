import { supabase } from '../lib/supabase';
import { Role } from '../types';
import type { User as DBUser, UserInsert, UserUpdate } from '../lib/types/database';

// Interfaces para o UsersService
export interface UserFilters {
  role?: 'admin' | 'student';
  courseId?: number;
  search?: string;
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
  password?: string;
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

// Classe UsersService
class UsersService {
  /**
   * Busca usuários com filtros opcionais
   */
  async getUsers(filters: UserFilters = {}): Promise<AppUser[]> {
    try {
      // Iniciar query
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

      // Executar query
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
        console.error('Erro ao buscar usuário:', error);
        throw new Error('Usuário não encontrado.');
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
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        // PGRST116 = não encontrado (ok, email disponível)
        console.error('Erro ao verificar email:', emailCheckError);
        throw new Error('Erro ao validar email.');
      }

      if (existingEmail) {
        throw new Error('Este email já está em uso.');
      }

      // Validar matrícula única (se fornecida)
      if (data.matricula) {
        const { data: existingMatricula, error: matriculaCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('matricula', data.matricula)
          .single();

        if (matriculaCheckError && matriculaCheckError.code !== 'PGRST116') {
          console.error('Erro ao verificar matrícula:', matriculaCheckError);
          throw new Error('Erro ao validar matrícula.');
        }

        if (existingMatricula) {
          throw new Error('Esta matrícula já está em uso.');
        }
      }

      // Buscar course_name se courseId foi fornecido
      let courseName: string | null = null;
      if (data.courseId) {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('name')
          .eq('id', data.courseId)
          .single();

        if (courseError || !courseData) {
          console.error('Erro ao buscar curso:', courseError);
          throw new Error('Curso não encontrado.');
        }

        courseName = (courseData as any).name;
      }

      // Inserir usuário com password_hash (bcrypt no backend via trigger)
      // Avatar gerado automaticamente via trigger generate_avatar
      // course_name sincronizado automaticamente via trigger sync_course_name
      const insertData: UserInsert = {
        name: data.name,
        email: data.email,
        password_hash: data.password, // Backend deve fazer hash via trigger
        role: data.role,
        course_id: data.courseId || null,
        course_name: courseName,
        matricula: data.matricula || null,
      };

      // @ts-ignore - Supabase types issue
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        // @ts-ignore - Supabase types issue
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar usuário:', insertError);
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
    try {
      // Validar unicidade ao atualizar email
      if (updates.email) {
        const { data: existingEmail, error: emailCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('email', updates.email)
          .neq('id', id)
          .single();

        if (emailCheckError && emailCheckError.code !== 'PGRST116') {
          console.error('Erro ao verificar email:', emailCheckError);
          throw new Error('Erro ao validar email.');
        }

        if (existingEmail) {
          throw new Error('Este email já está em uso por outro usuário.');
        }
      }

      // Validar unicidade ao atualizar matrícula
      if (updates.matricula) {
        const { data: existingMatricula, error: matriculaCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('matricula', updates.matricula)
          .neq('id', id)
          .single();

        if (matriculaCheckError && matriculaCheckError.code !== 'PGRST116') {
          console.error('Erro ao verificar matrícula:', matriculaCheckError);
          throw new Error('Erro ao validar matrícula.');
        }

        if (existingMatricula) {
          throw new Error('Esta matrícula já está em uso por outro usuário.');
        }
      }

      // Buscar course_name se courseId foi fornecido
      let courseName: string | null | undefined = undefined;
      if (updates.courseId !== undefined) {
        if (updates.courseId === null) {
          courseName = null;
        } else {
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('name')
            .eq('id', updates.courseId)
            .single();

          if (courseError || !courseData) {
            console.error('Erro ao buscar curso:', courseError);
            throw new Error('Curso não encontrado.');
          }

          courseName = (courseData as any).name;
        }
      }

      // Atualizar apenas campos modificados
      const updateData: any = {};

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.role !== undefined) updateData.role = updates.role;
      if (updates.courseId !== undefined) updateData.course_id = updates.courseId;
      if (courseName !== undefined) updateData.course_name = courseName;
      if (updates.matricula !== undefined) updateData.matricula = updates.matricula;
      
      // Se senha foi fornecida, atualizar password_hash (backend fará hash via trigger)
      if (updates.password !== undefined) {
        updateData.password_hash = updates.password;
      }

      // Sempre atualizar updated_at
      updateData.updated_at = new Date().toISOString();

      // @ts-ignore - Supabase types issue
      const { error } = await supabase
        .from('users')
        // @ts-ignore - Supabase types issue
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw new Error('Erro ao atualizar usuário. Tente novamente.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar usuário.');
    }
  }

  /**
   * Deleta usuário
   */
  async deleteUser(id: number): Promise<void> {
    try {
      // Verificar se há arquivos vinculados ao usuário
      const { data: files, error: filesError } = await supabase
        .from('academic_files')
        .select('id')
        .eq('author_id', id)
        .limit(1);

      if (filesError) {
        console.error('Erro ao verificar arquivos do usuário:', filesError);
        throw new Error('Erro ao verificar dependências do usuário.');
      }

      if (files && files.length > 0) {
        throw new Error('Não é possível deletar usuário com arquivos publicados. Delete os arquivos primeiro.');
      }

      // Verificar se há matrículas validadas por este admin
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('validated_by', id)
        .limit(1);

      if (enrollmentsError) {
        console.error('Erro ao verificar matrículas validadas:', enrollmentsError);
        throw new Error('Erro ao verificar dependências do usuário.');
      }

      if (enrollments && enrollments.length > 0) {
        throw new Error('Não é possível deletar usuário que validou matrículas.');
      }

      // Deletar usuário
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar usuário:', error);
        throw new Error('Erro ao deletar usuário. Tente novamente.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao deletar usuário.');
    }
  }

  /**
   * Converte usuário do banco para formato da aplicação
   */
  private convertToAppUser(dbUser: DBUser): AppUser {
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
}

// Exportar instância única do serviço
export const usersService = new UsersService();
