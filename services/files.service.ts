import { supabase } from '../lib/supabase';
import { DateFormatter } from '../src/utils/dateFormatter';
import { ErrorHandler } from '../src/utils/errorHandler';
import type { 
  AcademicFile as DbAcademicFile, 
  AcademicFileInsert, 
  AcademicFileUpdate,
  GetFilesByFiltersResult 
} from '../lib/types/database';
import type { AcademicFile } from '../types';

/**
 * Interface para filtros de busca de arquivos
 */
export interface FileFilters {
  courseName?: string;
  semester?: string;
  subject?: string;
  authorId?: number;
  limit?: number;
  offset?: number;
}

/**
 * Interface para dados de criação de arquivo
 */
export interface CreateFileData {
  title: string;
  authorId: number;
  authorName: string;
  courseId: number;
  courseName: string;
  semester: string;
  subject: string;
  lastUpdateMessage: string;
  description?: string;
  fileName?: string;
  fileType?: string;
  fileContent?: string;
  fileSize?: number;
}

/**
 * Serviço completo de CRUD para arquivos acadêmicos
 * Implementa filtros por curso, semestre e disciplina
 * Implementa registro de downloads
 */
export class FilesService {
  /**
   * Busca arquivos com filtros usando get_files_by_filters do Supabase
   * Suporta filtros por courseName, semester, subject, authorId
   * Implementa paginação com limit e offset
   * Converte created_at para uploadedAt formatado
   */
  async getFiles(filters: FileFilters = {}): Promise<AcademicFile[]> {
    try {
      // Se authorId for fornecido, usar query direta na tabela para melhor performance
      if (filters.authorId) {
        return this.getFilesByAuthor(filters.authorId, filters);
      }

      // Usar função RPC get_files_by_filters para filtros otimizados
      const { data, error } = await supabase.rpc('get_files_by_filters', {
        p_course_name: filters.courseName || null,
        p_semester: filters.semester || null,
        p_subject: filters.subject || null,
        p_limit: filters.limit || 50,
        p_offset: filters.offset || 0,
      });

      if (error) {
        console.error('Erro ao buscar arquivos com filtros:', error);
        throw ErrorHandler.handle(error);
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Converter resultados para formato da aplicação
      // Ordena por data de criação (mais recentes primeiro) se não especificado
      return data.map(file => this.convertRpcResultToAcademicFile(file));
    } catch (error) {
      console.error('Erro no FilesService.getFiles:', error);
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * Busca arquivo específico por ID
   */
  async getFileById(id: number): Promise<AcademicFile> {
    try {
      const { data, error } = await supabase
        .from('academic_files')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar arquivo por ID:', error);
        throw ErrorHandler.handle(error);
      }

      if (!data) {
        throw new Error('Arquivo não encontrado');
      }

      return this.convertDbFileToAcademicFile(data);
    } catch (error) {
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * Cria novo arquivo acadêmico
   * Busca course_id baseado em courseName (já fornecido nos dados)
   * Insere arquivo na tabela academic_files
   * Define downloads como 0 e created_at como NOW() (automático)
   * Retorna arquivo criado com ID
   */
  async createFile(data: CreateFileData): Promise<AcademicFile> {
    try {
      // Validar dados obrigatórios
      if (!data.title || !data.authorId || !data.authorName || !data.courseName || 
          !data.semester || !data.subject || !data.lastUpdateMessage) {
        throw new Error('Dados obrigatórios não fornecidos para criação do arquivo');
      }

      // Preparar dados para inserção
      const insertData: AcademicFileInsert = {
        title: data.title.trim(),
        author_id: data.authorId,
        author_name: data.authorName.trim(),
        course_id: data.courseId || null, // Pode ser null se não fornecido
        course_name: data.courseName.trim(),
        semester: data.semester.trim(),
        subject: data.subject.trim(),
        description: data.description?.trim() || null,
        last_update_message: data.lastUpdateMessage.trim(),
        downloads: 0, // Sempre inicia com 0 downloads
        file_name: data.fileName?.trim() || null,
        file_type: data.fileType?.trim() || null,
        file_content: data.fileContent || null,
        file_size: data.fileSize || null,
      };

      // Inserir arquivo na tabela academic_files
      const { data: createdFile, error } = await supabase
        .from('academic_files')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar arquivo acadêmico:', error);
        throw ErrorHandler.handle(error);
      }

      if (!createdFile) {
        throw new Error('Falha ao criar arquivo - nenhum dado retornado');
      }

      // Retornar arquivo criado convertido para formato da aplicação
      return this.convertDbFileToAcademicFile(createdFile);
    } catch (error) {
      console.error('Erro no FilesService.createFile:', error);
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * Atualiza arquivo existente (atualização parcial)
   * Implementa validação de permissão (usuário só pode editar próprios arquivos)
   * Trata erros de not found
   */
  async updateFile(id: number, updates: Partial<CreateFileData>, currentUserId?: number): Promise<void> {
    try {
      // Validar se o arquivo existe e se o usuário tem permissão (se currentUserId fornecido)
      if (currentUserId) {
        const { data: existingFile, error: checkError } = await supabase
          .from('academic_files')
          .select('id, author_id')
          .eq('id', id)
          .single();

        if (checkError) {
          if (checkError.code === 'PGRST116') {
            throw new Error('Arquivo não encontrado');
          }
          console.error('Erro ao verificar permissão do arquivo:', checkError);
          throw ErrorHandler.handle(checkError);
        }

        if (existingFile.author_id !== currentUserId) {
          throw new Error('Você não tem permissão para editar este arquivo');
        }
      }

      // Preparar dados para atualização (apenas campos fornecidos)
      const updateData: AcademicFileUpdate = {};
      
      if (updates.title !== undefined) updateData.title = updates.title.trim();
      if (updates.semester !== undefined) updateData.semester = updates.semester.trim();
      if (updates.subject !== undefined) updateData.subject = updates.subject.trim();
      if (updates.description !== undefined) updateData.description = updates.description?.trim() || null;
      if (updates.lastUpdateMessage !== undefined) updateData.last_update_message = updates.lastUpdateMessage.trim();
      if (updates.fileName !== undefined) updateData.file_name = updates.fileName?.trim() || null;
      if (updates.fileType !== undefined) updateData.file_type = updates.fileType?.trim() || null;
      if (updates.fileContent !== undefined) updateData.file_content = updates.fileContent || null;
      if (updates.fileSize !== undefined) updateData.file_size = updates.fileSize || null;

      // Verificar se há algo para atualizar
      if (Object.keys(updateData).length === 0) {
        throw new Error('Nenhum campo fornecido para atualização');
      }

      // Executar atualização
      const { error } = await supabase
        .from('academic_files')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar arquivo:', error);
        throw ErrorHandler.handle(error);
      }
    } catch (error) {
      console.error('Erro no FilesService.updateFile:', error);
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * Deleta arquivo
   * Implementa validação de permissão (usuário só pode deletar próprios arquivos)
   * Trata erros de not found
   */
  async deleteFile(id: number, currentUserId?: number): Promise<void> {
    try {
      // Validar se o arquivo existe e se o usuário tem permissão (se currentUserId fornecido)
      if (currentUserId) {
        const { data: existingFile, error: checkError } = await supabase
          .from('academic_files')
          .select('id, author_id, title')
          .eq('id', id)
          .single();

        if (checkError) {
          if (checkError.code === 'PGRST116') {
            throw new Error('Arquivo não encontrado');
          }
          console.error('Erro ao verificar permissão do arquivo:', checkError);
          throw ErrorHandler.handle(checkError);
        }

        if (existingFile.author_id !== currentUserId) {
          throw new Error('Você não tem permissão para deletar este arquivo');
        }
      }

      // Executar deleção
      const { error } = await supabase
        .from('academic_files')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar arquivo:', error);
        throw ErrorHandler.handle(error);
      }
    } catch (error) {
      console.error('Erro no FilesService.deleteFile:', error);
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * Registra download de arquivo
   * Chama função register_file_download do Supabase
   * Incrementa contador automaticamente via trigger no banco
   * Registra user_id e ip_address para auditoria
   */
  async registerDownload(fileId: number, userId?: number, ipAddress?: string): Promise<void> {
    try {
      // Validar se o arquivo existe antes de registrar download
      const { data: fileExists, error: checkError } = await supabase
        .from('academic_files')
        .select('id')
        .eq('id', fileId)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          throw new Error('Arquivo não encontrado para download');
        }
        console.error('Erro ao verificar existência do arquivo:', checkError);
        throw ErrorHandler.handle(checkError);
      }

      if (!fileExists) {
        throw new Error('Arquivo não encontrado para download');
      }

      // Chamar função RPC register_file_download
      const { data, error } = await supabase.rpc('register_file_download', {
        p_file_id: fileId,
        p_user_id: userId || null,
        p_ip_address: ipAddress || null,
      });

      if (error) {
        console.error('Erro ao registrar download do arquivo:', error);
        throw ErrorHandler.handle(error);
      }

      // A função RPC retorna boolean, verificar se foi bem-sucedida
      if (data !== true) {
        throw new Error('Falha ao registrar download do arquivo');
      }
    } catch (error) {
      console.error('Erro no FilesService.registerDownload:', error);
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * Obtém IP address do cliente (helper para registerDownload)
   * Nota: Em produção, isso seria obtido do request no backend
   */
  async getClientIpAddress(): Promise<string | null> {
    try {
      // Em ambiente de desenvolvimento, retorna null
      // Em produção, isso seria obtido do cabeçalho da requisição
      return null;
    } catch (error) {
      console.warn('Não foi possível obter IP do cliente:', error);
      return null;
    }
  }

  /**
   * Busca arquivos de um autor específico (para "Meus Arquivos")
   */
  private async getFilesByAuthor(authorId: number, filters: FileFilters): Promise<AcademicFile[]> {
    try {
      let query = supabase
        .from('academic_files')
        .select('*')
        .eq('author_id', authorId)
        .order('created_at', { ascending: false });

      // Aplicar filtros adicionais se fornecidos
      if (filters.courseName) {
        query = query.eq('course_name', filters.courseName);
      }
      if (filters.semester) {
        query = query.eq('semester', filters.semester);
      }
      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }

      // Aplicar paginação
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar arquivos por autor:', error);
        throw ErrorHandler.handle(error);
      }

      if (!data) {
        return [];
      }

      return data.map(file => this.convertDbFileToAcademicFile(file));
    } catch (error) {
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * Converte resultado da função RPC para AcademicFile da aplicação
   */
  private convertRpcResultToAcademicFile(rpcResult: GetFilesByFiltersResult): AcademicFile {
    return {
      id: rpcResult.id,
      title: rpcResult.title,
      author: rpcResult.author_name,
      authorId: 0, // RPC não retorna author_id
      course: rpcResult.course_name,
      courseId: 0, // RPC não retorna course_id
      downloads: rpcResult.downloads,
      uploadedAt: DateFormatter.formatRelativeTime(rpcResult.created_at),
      semester: rpcResult.semester,
      subject: rpcResult.subject,
      lastUpdateMessage: rpcResult.last_update_message,
      createdAt: rpcResult.created_at,
    };
  }

  /**
   * Converte dados do banco para AcademicFile da aplicação
   */
  private convertDbFileToAcademicFile(dbFile: DbAcademicFile): AcademicFile {
    return {
      id: dbFile.id,
      title: dbFile.title,
      author: dbFile.author_name,
      authorId: dbFile.author_id || 0,
      course: dbFile.course_name,
      courseId: dbFile.course_id || 0,
      downloads: dbFile.downloads,
      uploadedAt: DateFormatter.formatRelativeTime(dbFile.created_at),
      semester: dbFile.semester,
      subject: dbFile.subject,
      lastUpdateMessage: dbFile.last_update_message,
      description: dbFile.description || undefined,
      fileName: dbFile.file_name || undefined,
      fileContent: dbFile.file_content || undefined,
      fileType: dbFile.file_type || undefined,
      fileSize: dbFile.file_size || undefined,
      createdAt: dbFile.created_at,
    };
  }
}

// Instância singleton do serviço
export const filesService = new FilesService();