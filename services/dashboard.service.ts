import { supabase } from '../lib/supabase';
<<<<<<< HEAD
import type { AcademicFile } from '../types';
import type { GetDashboardStatsResult, RecentFile } from '../lib/types/database';

// Interface DashboardStats
=======
import type { GetDashboardStatsResult, RecentFile } from '../lib/types/database';
import type { AcademicFile } from '../types';

/**
 * Interface para estatísticas do dashboard
 */
>>>>>>> 11441c2cbe268a6531ad2140c1c1922440a9528f
export interface DashboardStats {
  totalFiles: number;
  totalUsers: number;
  activeUsers: number;
  totalDownloads: number;
  pendingEnrollments: number;
  userFiles?: number;
  userDownloads?: number;
}

<<<<<<< HEAD
// Classe DashboardService
class DashboardService {
  /**
   * Busca estatísticas do dashboard para administradores
   * Chama função get_dashboard_stats sem user_id
   * Retorna total_files, total_users, active_users, total_downloads, pending_enrollments
   */
  async getAdminStats(): Promise<DashboardStats> {
    try {
      // Chamar função get_dashboard_stats sem user_id para estatísticas gerais
      const { data, error } = await supabase.rpc('get_dashboard_stats');

      // Tratar erros de conexão
      if (error) {
        console.error('Erro ao buscar estatísticas do admin:', error);
        throw new Error('Erro ao carregar estatísticas. Verifique sua conexão.');
      }

      // Verificar se retornou dados
      if (!data || data.length === 0) {
        // Retornar estatísticas zeradas se não houver dados
        return {
          totalFiles: 0,
          totalUsers: 0,
          activeUsers: 0,
          totalDownloads: 0,
          pendingEnrollments: 0,
        };
      }

      // Converter para formato da aplicação
      const stats = this.convertToDashboardStats(data[0]);

      return stats;
    } catch (error) {
      // Re-lançar erro com mensagem apropriada
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar estatísticas do dashboard.');
    }
  }

  /**
   * Busca estatísticas do dashboard para estudantes
   * Chama função get_dashboard_stats com user_id
   * Retorna user_files e user_downloads além das estatísticas gerais
   */
  async getStudentStats(userId: number): Promise<DashboardStats> {
    try {
      // Chamar função get_dashboard_stats com user_id para estatísticas personalizadas
      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        p_user_id: userId,
      });

      // Tratar erros de conexão
      if (error) {
        console.error('Erro ao buscar estatísticas do estudante:', error);
        throw new Error('Erro ao carregar estatísticas. Verifique sua conexão.');
      }

      // Verificar se retornou dados
      if (!data || data.length === 0) {
        // Retornar estatísticas zeradas se não houver dados
        return {
          totalFiles: 0,
          totalUsers: 0,
          activeUsers: 0,
          totalDownloads: 0,
          pendingEnrollments: 0,
          userFiles: 0,
          userDownloads: 0,
        };
      }

      // Converter para formato da aplicação
      const stats = this.convertToDashboardStats(data[0]);

      return stats;
    } catch (error) {
      // Re-lançar erro com mensagem apropriada
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar estatísticas do dashboard.');
    }
  }

  /**
   * Busca arquivos recentes
   * Usa view recent_files para arquivos recentes
   * Limita resultados conforme parâmetro
   */
  async getRecentFiles(limit: number = 10): Promise<AcademicFile[]> {
    try {
      // Usar view recent_files para buscar arquivos recentes
      const { data, error } = await supabase
        .from('recent_files')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Tratar erros de conexão
      if (error) {
        console.error('Erro ao buscar arquivos recentes:', error);
        throw new Error('Erro ao carregar arquivos recentes. Verifique sua conexão.');
      }

      // Verificar se retornou dados
      if (!data || data.length === 0) {
        return [];
      }

      // Converter para formato da aplicação
      const files = data.map((file) => this.convertToAcademicFile(file));

      return files;
    } catch (error) {
      // Re-lançar erro com mensagem apropriada
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar arquivos recentes.');
    }
=======
/**
 * Serviço para buscar estatísticas do dashboard e arquivos relacionados
 * Implementa diferenciação entre admin e student stats
 */
export class DashboardService {
  /**
   * Busca estatísticas administrativas (sem user_id)
   * Retorna estatísticas gerais do sistema
   */
  async getAdminStats(): Promise<DashboardStats> {
    // Implementação será adicionada na próxima subtask
    throw new Error('Método não implementado');
  }

  /**
   * Busca estatísticas do estudante (com user_id)
   * Retorna estatísticas gerais + estatísticas pessoais do usuário
   */
  async getStudentStats(userId: number): Promise<DashboardStats> {
    // Implementação será adicionada na próxima subtask
    throw new Error('Método não implementado');
  }

  /**
   * Busca arquivos recentes usando a view recent_files
   * Limita resultados conforme parâmetro
   */
  async getRecentFiles(limit: number = 10): Promise<AcademicFile[]> {
    // Implementação será adicionada na próxima subtask
    throw new Error('Método não implementado');
>>>>>>> 11441c2cbe268a6531ad2140c1c1922440a9528f
  }

  /**
   * Busca arquivos de um curso específico
<<<<<<< HEAD
   * Filtra por course_name para arquivos do curso
   * Limita resultados conforme parâmetro
   */
  async getCourseFiles(courseName: string, limit: number = 10): Promise<AcademicFile[]> {
    try {
      // Usar view recent_files com filtro por course_name
      const { data, error } = await supabase
        .from('recent_files')
        .select('*')
        .eq('course_name', courseName)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Tratar erros de conexão
      if (error) {
        console.error('Erro ao buscar arquivos do curso:', error);
        throw new Error('Erro ao carregar arquivos do curso. Verifique sua conexão.');
      }

      // Verificar se retornou dados
      if (!data || data.length === 0) {
        return [];
      }

      // Converter para formato da aplicação
      const files = data.map((file) => this.convertToAcademicFile(file));

      return files;
    } catch (error) {
      // Re-lançar erro com mensagem apropriada
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar arquivos do curso.');
    }
  }

  /**
   * Converte resultado do banco para DashboardStats
   */
  private convertToDashboardStats(dbStats: GetDashboardStatsResult): DashboardStats {
    return {
      totalFiles: dbStats.total_files,
      totalUsers: dbStats.total_users,
      activeUsers: dbStats.active_users,
      totalDownloads: dbStats.total_downloads,
      pendingEnrollments: dbStats.pending_enrollments,
      userFiles: dbStats.user_files,
      userDownloads: dbStats.user_downloads,
=======
   * Filtra por course_name e limita resultados
   */
  async getCourseFiles(courseName: string, limit: number = 10): Promise<AcademicFile[]> {
    // Implementação será adicionada na próxima subtask
    throw new Error('Método não implementado');
  }

  /**
   * Converte dados da view recent_files para o formato AcademicFile da aplicação
   */
  private convertRecentFileToAcademicFile(recentFile: RecentFile): AcademicFile {
    return {
      id: recentFile.id,
      title: recentFile.title,
      author: recentFile.author_name,
      authorId: recentFile.author_id || 0,
      course: recentFile.course_name,
      courseId: recentFile.course_id || 0,
      downloads: recentFile.downloads,
      uploadedAt: recentFile.uploaded_at_text || this.formatRelativeTime(recentFile.created_at),
      semester: recentFile.semester,
      subject: recentFile.subject,
      lastUpdateMessage: recentFile.last_update_message,
      description: recentFile.description || undefined,
      fileName: recentFile.file_name || undefined,
      fileContent: recentFile.file_content || undefined,
      fileType: recentFile.file_type || undefined,
      fileSize: recentFile.file_size || undefined,
      createdAt: recentFile.created_at
>>>>>>> 11441c2cbe268a6531ad2140c1c1922440a9528f
    };
  }

  /**
<<<<<<< HEAD
   * Converte arquivo do banco para formato da aplicação
   */
  private convertToAcademicFile(dbFile: RecentFile): AcademicFile {
    return {
      id: dbFile.id,
      title: dbFile.title,
      author: dbFile.author_name,
      course: dbFile.course_name,
      downloads: dbFile.downloads,
      uploadedAt: dbFile.uploaded_at_text || this.formatRelativeTime(dbFile.created_at),
      semester: dbFile.semester,
      subject: dbFile.subject,
      lastUpdateMessage: dbFile.last_update_message,
      description: dbFile.description || undefined,
      fileName: dbFile.file_name || undefined,
      fileContent: dbFile.file_content || undefined,
      fileType: dbFile.file_type || undefined,
    };
  }

  /**
   * Formata data para texto relativo (fallback se uploaded_at_text não estiver disponível)
   */
  private formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
    }
    const months = Math.floor(diffDays / 30);
    return `${months} ${months > 1 ? 'meses' : 'mês'} atrás`;
  }
}

// Exportar instância única do serviço
export const dashboardService = new DashboardService();
=======
   * Formata timestamp para texto relativo (fallback se uploaded_at_text não estiver disponível)
   */
  private formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? 'agora mesmo' : `${diffInMinutes} minutos atrás`;
      }
      return diffInHours === 1 ? '1 hora atrás' : `${diffInHours} horas atrás`;
    } else if (diffInDays === 1) {
      return 'ontem';
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 semana atrás' : `${weeks} semanas atrás`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? '1 mês atrás' : `${months} meses atrás`;
    }
  }
}

// Instância singleton do serviço
export const dashboardService = new DashboardService();
>>>>>>> 11441c2cbe268a6531ad2140c1c1922440a9528f
