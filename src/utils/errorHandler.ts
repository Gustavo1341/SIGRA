export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER = 'SERVER',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
  userMessage: string;
}

export class ErrorHandler {
  private static readonly ERROR_MESSAGES: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: 'Erro de conexão. Verifique sua internet e tente novamente.',
    [ErrorType.AUTHENTICATION]: 'Email ou senha incorretos. Verifique suas credenciais.',
    [ErrorType.AUTHORIZATION]: 'Você não tem permissão para realizar esta ação.',
    [ErrorType.VALIDATION]: 'Dados inválidos. Verifique os campos e tente novamente.',
    [ErrorType.NOT_FOUND]: 'Recurso não encontrado.',
    [ErrorType.CONFLICT]: 'Este email ou matrícula já está em uso.',
    [ErrorType.SERVER]: 'Erro interno do servidor. Tente novamente em alguns instantes.',
  };

  static handle(error: unknown): AppError {
    // Log do erro original para debugging
    console.error('Error caught by ErrorHandler:', error);

    // Se já é um AppError, retorna como está
    if (this.isAppError(error)) {
      return error;
    }

    // Erro do Supabase
    if (this.isSupabaseError(error)) {
      return this.handleSupabaseError(error);
    }

    // Erro de rede/fetch
    if (this.isNetworkError(error)) {
      return {
        type: ErrorType.NETWORK,
        message: 'Network error',
        details: error,
        userMessage: this.ERROR_MESSAGES[ErrorType.NETWORK],
      };
    }

    // Erro genérico
    return {
      type: ErrorType.SERVER,
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error,
      userMessage: this.ERROR_MESSAGES[ErrorType.SERVER],
    };
  }

  static getErrorMessage(error: AppError): string {
    return error.userMessage || this.ERROR_MESSAGES[error.type];
  }

  private static isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'message' in error &&
      'userMessage' in error
    );
  }

  private static isSupabaseError(error: unknown): error is any {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('code' in error || 'status' in error || 'statusCode' in error)
    );
  }

  private static isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.name === 'NetworkError' ||
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('connection')
      );
    }
    return false;
  }

  private static handleSupabaseError(error: any): AppError {
    const code = error.code || error.status || error.statusCode;
    const message = error.message || 'Supabase error';

    // Códigos específicos do Supabase/PostgreSQL
    switch (code) {
      case 'PGRST116': // Not found
      case '404':
        return {
          type: ErrorType.NOT_FOUND,
          message,
          details: error,
          userMessage: this.ERROR_MESSAGES[ErrorType.NOT_FOUND],
        };

      case 'PGRST301': // Unauthorized
      case '401':
        return {
          type: ErrorType.AUTHENTICATION,
          message,
          details: error,
          userMessage: this.ERROR_MESSAGES[ErrorType.AUTHENTICATION],
        };

      case 'PGRST302': // Forbidden
      case '403':
        return {
          type: ErrorType.AUTHORIZATION,
          message,
          details: error,
          userMessage: this.ERROR_MESSAGES[ErrorType.AUTHORIZATION],
        };

      case '23505': // Unique violation (PostgreSQL)
        return {
          type: ErrorType.CONFLICT,
          message,
          details: error,
          userMessage: this.ERROR_MESSAGES[ErrorType.CONFLICT],
        };

      case '23514': // Check violation (PostgreSQL)
      case '23502': // Not null violation (PostgreSQL)
      case 'PGRST102': // Bad request
      case '400':
        return {
          type: ErrorType.VALIDATION,
          message,
          details: error,
          userMessage: this.ERROR_MESSAGES[ErrorType.VALIDATION],
        };

      case 'PGRST000': // Connection error
      case 'PGRST001': // Connection timeout
        return {
          type: ErrorType.NETWORK,
          message,
          details: error,
          userMessage: this.ERROR_MESSAGES[ErrorType.NETWORK],
        };

      default:
        // Verifica mensagens específicas para casos especiais
        if (message.toLowerCase().includes('invalid credentials')) {
          return {
            type: ErrorType.AUTHENTICATION,
            message,
            details: error,
            userMessage: this.ERROR_MESSAGES[ErrorType.AUTHENTICATION],
          };
        }

        if (message.toLowerCase().includes('permission denied')) {
          return {
            type: ErrorType.AUTHORIZATION,
            message,
            details: error,
            userMessage: this.ERROR_MESSAGES[ErrorType.AUTHORIZATION],
          };
        }

        if (message.toLowerCase().includes('already exists')) {
          return {
            type: ErrorType.CONFLICT,
            message,
            details: error,
            userMessage: this.ERROR_MESSAGES[ErrorType.CONFLICT],
          };
        }

        return {
          type: ErrorType.SERVER,
          message,
          details: error,
          userMessage: this.ERROR_MESSAGES[ErrorType.SERVER],
        };
    }
  }
}