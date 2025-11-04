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
  }

  /**
   * Busca arquivos de um curso específico
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