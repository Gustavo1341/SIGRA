import { supabase } from '../lib/supabase';
import type { GetDashboardStatsResult, RecentFile } from '../lib/types/database';
import type { AcademicFile } from '../types';

/**
 * Interface para estatísticas do dashboard
 */
export interface DashboardStats {
  totalFiles: number;
  totalUsers: number;
  activeUsers: number;
  totalDownloads: number;
  pendingEnrollments: number;
  userFiles?: number;
  userDownloads?: number;
}

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
   * Busca estatísticas do estudante (com user_id)
   * Retorna estatísticas gerais + estatísticas pessoais do usuário
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
   * Busca arquivos recentes usando a view recent_files
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
      const files = data.map((file) => this.convertRecentFileToAcademicFile(file));

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
   * Filtra por course_name e limita resultados
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
      const files = data.map((file) => this.convertRecentFileToAcademicFile(file));

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
   * Converte dados da view recent_files para o formato AcademicFile da aplicação
   */
  private convertRecentFileToAcademicFile(recentFile: RecentFile): AcademicFile {
    return {
      id: recentFile.id,
      title: recentFile.title,
      author: recentFile.author_name,
      course: recentFile.course_name,
      downloads: recentFile.downloads,
      uploadedAt: recentFile.uploaded_at_text || this.formatRelativeTime(recentFile.created_at),
      semester: recentFile.semester,
      subject: recentFile.subject,
      lastUpdateMessage: recentFile.last_update_message,
      description: recentFile.description || undefined,
      fileName: recentFile.file_name || undefined,
      fileContent: recentFile.file_content || undefined,
      fileType: recentFile.file_type || undefined,
    };
  }

  /**
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
