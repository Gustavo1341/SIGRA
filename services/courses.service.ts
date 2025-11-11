import { supabase } from '../lib/supabase';
import { Course } from '../types';
import type { CourseStatistics } from '../lib/types/database';
import { cacheManager, CACHE_TTL } from '../src/utils/cache';

// Interface para curso com estatísticas
export interface CourseWithStats {
  id: number;
  name: string;
  description: string;
  studentCount: number;
  fileCount: number;
  totalDownloads: number;
}

// Interface para criar curso
export interface CreateCourseData {
  name: string;
  description: string;
}

// Interface para atualizar curso
export interface UpdateCourseData {
  name?: string;
  description?: string;
}

// Classe CoursesService com métodos básicos
class CoursesService {
  /**
   * Busca todos os cursos (com cache de 10 minutos)
   */
  async getCourses(): Promise<Course[]> {
    const cacheKey = 'courses:all';
    
    // Tentar buscar do cache
    const cached = cacheManager.get<Course[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar cursos:', error);
        throw new Error('Erro ao buscar cursos. Tente novamente.');
      }

      if (!data) {
        return [];
      }

      const courses = data.map(course => this.convertToCourse(course));
      
      // Cachear resultado
      cacheManager.set(cacheKey, courses, CACHE_TTL.COURSES);
      
      return courses;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar cursos.');
    }
  }

  /**
   * Busca cursos com estatísticas usando a view course_statistics (com cache de 10 minutos)
   */
  async getCoursesWithStats(): Promise<CourseWithStats[]> {
    const cacheKey = 'courses:withStats';
    
    // Tentar buscar do cache
    const cached = cacheManager.get<CourseWithStats[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('course_statistics')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar estatísticas de cursos:', error);
        throw new Error('Erro ao buscar estatísticas de cursos. Tente novamente.');
      }

      if (!data) {
        return [];
      }

      const coursesWithStats = data.map(stats => this.convertToCourseWithStats(stats));
      
      // Cachear resultado
      cacheManager.set(cacheKey, coursesWithStats, CACHE_TTL.COURSES);
      
      return coursesWithStats;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar estatísticas de cursos.');
    }
  }

  /**
   * Busca curso por ID
   */
  async getCourseById(id: number): Promise<Course> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Curso não encontrado.');
        }
        console.error('Erro ao buscar curso:', error);
        throw new Error('Erro ao buscar curso. Tente novamente.');
      }

      return this.convertToCourse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar curso.');
    }
  }

  /**
   * Cria novo curso
   */
  async createCourse(data: CreateCourseData): Promise<Course> {
    try {
      // Validar nome único antes de criar
      const { data: existingCourse, error: checkError } = await supabase
        .from('courses')
        .select('id')
        .eq('name', data.name)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = não encontrado (ok, nome disponível)
        console.error('Erro ao verificar nome do curso:', checkError);
        throw new Error('Erro ao validar nome do curso.');
      }

      if (existingCourse) {
        throw new Error('Já existe um curso com este nome.');
      }

      // Inserir curso com name e description
      const { data: newCourse, error } = await supabase
        .from('courses')
        .insert({
          name: data.name,
          description: data.description,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar curso:', error);
        throw new Error('Erro ao criar curso. Tente novamente.');
      }

      const course = this.convertToCourse(newCourse);
      
      // Invalidar cache ao criar curso
      cacheManager.invalidateByPrefix('courses:');
      
      return course;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar curso.');
    }
  }

  /**
   * Atualiza curso existente
   */
  async updateCourse(id: number, updates: UpdateCourseData): Promise<void> {
    try {
      // Validar nome único antes de atualizar (se nome foi fornecido)
      if (updates.name) {
        const { data: existingCourse, error: checkError } = await supabase
          .from('courses')
          .select('id')
          .eq('name', updates.name)
          .neq('id', id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 = não encontrado (ok, nome disponível)
          console.error('Erro ao verificar nome do curso:', checkError);
          throw new Error('Erro ao validar nome do curso.');
        }

        if (existingCourse) {
          throw new Error('Já existe um curso com este nome.');
        }
      }

      // Preparar dados para atualização
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;

      // Atualizar curso
      const { error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar curso:', error);
        throw new Error('Erro ao atualizar curso. Tente novamente.');
      }

      // Se o nome foi alterado, atualizar course_name em usuários relacionados
      // Isso será feito automaticamente pelo trigger sync_course_name no banco
      
      // Invalidar cache ao atualizar curso
      cacheManager.invalidateByPrefix('courses:');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar curso.');
    }
  }

  /**
   * Deleta curso (com validação de dependências)
   */
  async deleteCourse(id: number): Promise<void> {
    try {
      // Verificar se há usuários vinculados ao curso
      const { data: usersCount, error: usersError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', id);

      if (usersError) {
        console.error('Erro ao verificar usuários vinculados:', usersError);
        throw new Error('Erro ao verificar dependências do curso.');
      }

      if (usersCount && usersCount.length > 0) {
        throw new Error('Não é possível deletar o curso. Existem usuários vinculados a ele.');
      }

      // Verificar se há arquivos vinculados ao curso
      const { data: filesCount, error: filesError } = await supabase
        .from('academic_files')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', id);

      if (filesError) {
        console.error('Erro ao verificar arquivos vinculados:', filesError);
        throw new Error('Erro ao verificar dependências do curso.');
      }

      if (filesCount && filesCount.length > 0) {
        throw new Error('Não é possível deletar o curso. Existem arquivos vinculados a ele.');
      }

      // Verificar se há matrículas vinculadas ao curso
      const { data: enrollmentsCount, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', id);

      if (enrollmentsError) {
        console.error('Erro ao verificar matrículas vinculadas:', enrollmentsError);
        throw new Error('Erro ao verificar dependências do curso.');
      }

      if (enrollmentsCount && enrollmentsCount.length > 0) {
        throw new Error('Não é possível deletar o curso. Existem matrículas vinculadas a ele.');
      }

      // Se não há dependências, deletar o curso
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar curso:', error);
        throw new Error('Erro ao deletar curso. Tente novamente.');
      }
      
      // Invalidar cache ao deletar curso
      cacheManager.invalidateByPrefix('courses:');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao deletar curso.');
    }
  }

  /**
   * Converte dados do banco para formato da aplicação
   */
  private convertToCourse(dbCourse: any): Course {
    return {
      id: dbCourse.id,
      name: dbCourse.name,
      description: dbCourse.description || '',
    };
  }

  /**
   * Converte dados da view course_statistics para CourseWithStats
   */
  private convertToCourseWithStats(dbStats: CourseStatistics): CourseWithStats {
    return {
      id: dbStats.id,
      name: dbStats.name,
      description: dbStats.description || '',
      studentCount: dbStats.student_count,
      fileCount: dbStats.file_count,
      totalDownloads: dbStats.total_downloads,
    };
  }
}

// Exportar instância única do serviço
export const coursesService = new CoursesService();