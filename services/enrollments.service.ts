import { supabase } from '../lib/supabase';
import type { Enrollment as EnrollmentRow, PendingEnrollment } from '../lib/types/database';
import { Enrollment } from '../types';

// Interface para dados de criação de matrícula
export interface EnrollmentData {
  studentName: string;
  email: string;
  matricula: string;
  courseId: number;
  courseName: string;
}

// Classe EnrollmentsService para gerenciar matrículas
class EnrollmentsService {
  /**
   * Busca matrículas pendentes
   * Ordenadas por created_at (mais antigas primeiro)
   * Inclui informações do curso via view pending_enrollments
   */
  async getPendingEnrollments(): Promise<Enrollment[]> {
    try {
      // Usar view pending_enrollments que já inclui informações do curso
      const { data, error } = await supabase
        .from('pending_enrollments')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar matrículas pendentes:', error);
        throw new Error('Erro ao buscar matrículas pendentes. Tente novamente.');
      }

      if (!data) {
        return [];
      }

      // Converter para formato da aplicação
      return data.map(enrollment => this.convertToEnrollment(enrollment));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar matrículas pendentes.');
    }
  }

  /**
   * Busca apenas a contagem de matrículas pendentes
   * Mais eficiente que buscar todas as matrículas quando só precisamos do número
   */
  async getPendingEnrollmentsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        console.error('Erro ao buscar contagem de matrículas pendentes:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Erro ao buscar contagem de matrículas pendentes:', error);
      return 0;
    }
  }

  /**
   * Valida uma matrícula pendente
   * Chama função validate_enrollment do Supabase que:
   * - Cria novo usuário automaticamente com senha = matrícula
   * - Atualiza status da matrícula para 'validated'
   * - Cria notificação via trigger
   */
  async validateEnrollment(enrollmentId: number, adminUserId: number): Promise<void> {
    try {
      // Chamar função RPC validate_enrollment do Supabase
      const { data, error } = await supabase.rpc('validate_enrollment', {
        enrollment_id: enrollmentId,
        admin_user_id: adminUserId,
      });

      if (error) {
        console.error('Erro ao validar matrícula:', error);
        throw new Error('Erro ao validar matrícula. Tente novamente.');
      }

      // Verificar se a validação foi bem-sucedida
      if (!data) {
        throw new Error('Falha ao validar matrícula.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao validar matrícula.');
    }
  }

  /**
   * Valida múltiplas matrículas em lote baseado em um array de números de matrícula
   * Compara com matrículas pendentes e valida as que coincidem
   * Retorna resultado com matrículas validadas, não encontradas e erros
   */
  async validateEnrollmentsBatch(
    matriculas: string[], 
    adminUserId: number
  ): Promise<{ validated: string[]; notFound: string[]; errors: string[] }> {
    const result = {
      validated: [] as string[],
      notFound: [] as string[],
      errors: [] as string[],
    };

    try {
      // Buscar todas as matrículas pendentes
      const pendingEnrollments = await this.getPendingEnrollments();

      // Criar mapa de matrículas pendentes para busca rápida
      const pendingMap = new Map(
        pendingEnrollments.map(e => [e.matricula, e])
      );

      // Processar cada matrícula do CSV
      for (const matricula of matriculas) {
        const enrollment = pendingMap.get(matricula);

        if (!enrollment) {
          // Matrícula não encontrada ou já processada
          result.notFound.push(matricula);
          continue;
        }

        try {
          // Validar matrícula
          await this.validateEnrollment(enrollment.id, adminUserId);
          result.validated.push(matricula);
        } catch (error) {
          // Erro ao validar esta matrícula específica
          const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
          result.errors.push(`${matricula}: ${errorMsg}`);
        }
      }

      return result;
    } catch (error) {
      console.error('Erro ao validar matrículas em lote:', error);
      throw new Error('Erro ao processar validação em lote.');
    }
  }

  /**
   * Rejeita uma matrícula pendente
   * Chama função reject_enrollment do Supabase que:
   * - Atualiza status da matrícula para 'rejected'
   */
  async rejectEnrollment(enrollmentId: number): Promise<void> {
    try {
      // Chamar função RPC reject_enrollment do Supabase
      const { data, error } = await supabase.rpc('reject_enrollment', {
        enrollment_id: enrollmentId,
      });

      if (error) {
        console.error('Erro ao rejeitar matrícula:', error);
        throw new Error('Erro ao rejeitar matrícula. Tente novamente.');
      }

      // Verificar se a rejeição foi bem-sucedida
      if (!data) {
        throw new Error('Falha ao rejeitar matrícula.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao rejeitar matrícula.');
    }
  }

  /**
   * Cria uma nova solicitação de matrícula
   */
  async createEnrollment(data: EnrollmentData): Promise<Enrollment> {
    try {
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .insert({
          student_name: data.studentName,
          email: data.email,
          matricula: data.matricula,
          course_id: data.courseId,
          course_name: data.courseName,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar solicitação:', error);
        throw new Error('Erro ao criar solicitação de acesso. Tente novamente.');
      }

      if (!enrollment) {
        throw new Error('Falha ao criar solicitação.');
      }

      return this.convertToEnrollment({
        ...enrollment,
        course_name: data.courseName,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar solicitação de acesso.');
    }
  }

  /**
   * Converte dados do banco para formato da aplicação
   */
  private convertToEnrollment(dbEnrollment: EnrollmentRow | PendingEnrollment): Enrollment {
    return {
      id: dbEnrollment.id,
      studentName: dbEnrollment.student_name,
      courseName: dbEnrollment.course_name,
      status: dbEnrollment.status,
      matricula: dbEnrollment.matricula,
      email: dbEnrollment.email,
    };
  }
}

// Exportar instância única do serviço
export const enrollmentsService = new EnrollmentsService();
