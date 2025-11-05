import { supabase } from '../lib/supabase';
import type { AcademicFile } from '../types';

/**
 * Interface para criar um novo arquivo
 */
export interface CreateFileInput {
  title: string;
  author: string;
  course: string;
  semester: string;
  subject: string;
  lastUpdateMessage: string;
  description?: string;
  fileName?: string;
  fileType?: string;
  fileContent?: string;
}

/**
 * Serviço para gerenciar arquivos acadêmicos
 */
export class FilesService {
  /**
   * Cria um novo arquivo acadêmico no Supabase
   */
  async createFile(input: CreateFileInput, authorId: number): Promise<AcademicFile> {
    try {
      // Buscar course_id pelo nome do curso
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('name', input.course)
        .single();

      if (courseError) {
        console.error('Erro ao buscar curso:', courseError);
        throw new Error('Curso não encontrado');
      }

      // Inserir arquivo no banco
      const { data, error } = await supabase
        .from('academic_files')
        .insert({
          title: input.title,
          author_id: authorId,
          author_name: input.author,
          course_id: courseData.id,
          course_name: input.course,
          semester: input.semester,
          subject: input.subject,
          last_update_message: input.lastUpdateMessage,
          description: input.description || null,
          file_name: input.fileName || null,
          file_type: input.fileType || null,
          file_content: input.fileContent || null,
          downloads: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar arquivo:', error);
        throw new Error('Erro ao publicar arquivo. Verifique sua conexão.');
      }

      // Converter para formato da aplicação
      return this.convertToAcademicFile(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao publicar arquivo');
    }
  }

  /**
   * Busca arquivos por filtros
   */
  async getFiles(filters?: {
    courseName?: string;
    semester?: string;
    subject?: string;
    authorId?: number;
    limit?: number;
    offset?: number;
  }): Promise<AcademicFile[]> {
    try {
      let query = supabase
        .from('recent_files')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.courseName) {
        query = query.eq('course_name', filters.courseName);
      }
      if (filters?.semester) {
        query = query.eq('semester', filters.semester);
      }
      if (filters?.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters?.authorId) {
        query = query.eq('author_id', filters.authorId);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar arquivos:', error);
        throw new Error('Erro ao carregar arquivos');
      }

      return data.map((file) => this.convertRecentFileToAcademicFile(file));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar arquivos');
    }
  }

  /**
   * Busca um arquivo específico por ID
   */
  async getFileById(id: number): Promise<AcademicFile | null> {
    try {
      const { data, error } = await supabase
        .from('recent_files')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar arquivo:', error);
        return null;
      }

      return this.convertRecentFileToAcademicFile(data);
    } catch (error) {
      console.error('Erro ao buscar arquivo:', error);
      return null;
    }
  }

  /**
   * Registra um download de arquivo
   */
  async registerDownload(fileId: number, userId?: number): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('register_file_download', {
        p_file_id: fileId,
        p_user_id: userId || null,
      });

      if (error) {
        console.error('Erro ao registrar download:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao registrar download:', error);
      return false;
    }
  }

  /**
   * Converte dados do banco para formato AcademicFile
   */
  private convertToAcademicFile(dbFile: any): AcademicFile {
    return {
      id: dbFile.id,
      title: dbFile.title,
      author: dbFile.author_name,
      course: dbFile.course_name,
      downloads: dbFile.downloads,
      uploadedAt: this.formatRelativeTime(dbFile.created_at),
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
   * Converte dados da view recent_files para formato AcademicFile
   */
  private convertRecentFileToAcademicFile(recentFile: any): AcademicFile {
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
   * Formata timestamp para texto relativo
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
export const filesService = new FilesService();
