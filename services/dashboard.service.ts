import { supabase } from '../lib/supabase';
import type { AcademicFile } from '../types';
import type { GetDashboardStatsResult, RecentFile } from '../lib/types/database';

// Interface DashboardStats
export interface DashboardStats {
  totalFiles: number;
  totalUsers: number;
  activeUsers: number;
  totalDownloads: number;
  pendingEnrollments: number;
  userFiles?: number;
  userDownloads?: number;
}

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
  }

  /**
   * Busca arquivos de um curso específico
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
    };
  }

  /**
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
