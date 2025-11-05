/**
 * Formatador de datas para exibir tempo relativo em português
 * Converte timestamps para formatos como "agora mesmo", "2 dias atrás", etc.
 */

export class DateFormatter {
  /**
   * Formata uma data para texto relativo em português
   * @param date - Data a ser formatada (string ISO, Date object, ou timestamp)
   * @returns String formatada como "X dias atrás", "agora mesmo", etc.
   */
  static formatRelativeTime(date: string | Date | number): string {
    const now = new Date();
    let targetDate: Date;
    
    // Tratar strings de data do Supabase (que podem vir em UTC)
    if (typeof date === 'string') {
      // Se a string não termina com 'Z' ou não tem timezone, assumir que é UTC
      if (!date.includes('Z') && !date.includes('+') && !date.includes('-', 10)) {
        targetDate = new Date(date + 'Z'); // Adicionar Z para forçar UTC
      } else {
        targetDate = new Date(date);
      }
    } else {
      targetDate = new Date(date);
    }
    
    // Validação da data
    if (isNaN(targetDate.getTime())) {
      return 'Data inválida';
    }

    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Futuro (data posterior à atual) - mas com tolerância para pequenas diferenças de timezone
    if (diffInMs < 0) {
      const absDiffInHours = Math.abs(diffInHours);
      const absDiffInDays = Math.abs(diffInDays);
      
      // Se a diferença for menor que 12 horas, considerar como "agora mesmo"
      if (absDiffInHours < 12) {
        return 'agora mesmo';
      } else if (absDiffInDays === 0) {
        return 'hoje';
      } else if (absDiffInDays === 1) {
        return 'amanhã';
      } else if (absDiffInDays < 7) {
        return `em ${absDiffInDays} dias`;
      } else {
        return targetDate.toLocaleDateString('pt-BR');
      }
    }

    // Passado
    if (diffInSeconds < 30) {
      return 'agora mesmo';
    }

    if (diffInSeconds < 60) {
      return 'há menos de 1 minuto';
    }

    if (diffInMinutes < 60) {
      if (diffInMinutes === 1) {
        return 'há 1 minuto';
      }
      return `há ${diffInMinutes} minutos`;
    }

    if (diffInHours < 24) {
      if (diffInHours === 1) {
        return 'há 1 hora';
      }
      return `há ${diffInHours} horas`;
    }

    if (diffInDays === 1) {
      return 'ontem';
    }

    if (diffInDays < 7) {
      return `há ${diffInDays} dias`;
    }

    if (diffInWeeks === 1) {
      return 'há 1 semana';
    }

    if (diffInWeeks < 4) {
      return `há ${diffInWeeks} semanas`;
    }

    if (diffInMonths === 1) {
      return 'há 1 mês';
    }

    if (diffInMonths < 12) {
      return `há ${diffInMonths} meses`;
    }

    if (diffInYears === 1) {
      return 'há 1 ano';
    }

    return `há ${diffInYears} anos`;
  }

  /**
   * Formata uma data para exibição completa em português
   * @param date - Data a ser formatada
   * @returns String formatada como "15 de janeiro de 2024, 14:30"
   */
  static formatFullDate(date: string | Date | number): string {
    const targetDate = new Date(date);
    
    if (isNaN(targetDate.getTime())) {
      return 'Data inválida';
    }

    return targetDate.toLocaleString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Formata uma data para exibição curta em português
   * @param date - Data a ser formatada
   * @returns String formatada como "15/01/2024"
   */
  static formatShortDate(date: string | Date | number): string {
    const targetDate = new Date(date);
    
    if (isNaN(targetDate.getTime())) {
      return 'Data inválida';
    }

    return targetDate.toLocaleDateString('pt-BR');
  }

  /**
   * Verifica se uma data é hoje
   * @param date - Data a ser verificada
   * @returns true se a data for hoje
   */
  static isToday(date: string | Date | number): boolean {
    const today = new Date();
    const targetDate = new Date(date);
    
    if (isNaN(targetDate.getTime())) {
      return false;
    }

    return (
      today.getDate() === targetDate.getDate() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getFullYear() === targetDate.getFullYear()
    );
  }

  /**
   * Verifica se uma data é ontem
   * @param date - Data a ser verificada
   * @returns true se a data for ontem
   */
  static isYesterday(date: string | Date | number): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDate = new Date(date);
    
    if (isNaN(targetDate.getTime())) {
      return false;
    }

    return (
      yesterday.getDate() === targetDate.getDate() &&
      yesterday.getMonth() === targetDate.getMonth() &&
      yesterday.getFullYear() === targetDate.getFullYear()
    );
  }
}