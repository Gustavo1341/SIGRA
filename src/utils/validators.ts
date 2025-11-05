/**
 * Utilitários de validação para inputs do sistema SIGRA
 * Inclui validações de email, senha, arquivos e outros campos
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export class Validators {
  /**
   * Valida formato de email
   */
  static validateEmail(email: string): ValidationResult {
    if (!email || email.trim() === '') {
      return { isValid: false, message: 'Email é obrigatório' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Formato de email inválido' };
    }

    if (email.length > 255) {
      return { isValid: false, message: 'Email muito longo (máximo 255 caracteres)' };
    }

    return { isValid: true };
  }

  /**
   * Valida senha
   */
  static validatePassword(password: string): ValidationResult {
    if (!password || password.trim() === '') {
      return { isValid: false, message: 'Senha é obrigatória' };
    }

    if (password.length < 6) {
      return { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
    }

    if (password.length > 100) {
      return { isValid: false, message: 'Senha muito longa (máximo 100 caracteres)' };
    }

    return { isValid: true };
  }

  /**
   * Valida nome de usuário
   */
  static validateName(name: string): ValidationResult {
    if (!name || name.trim() === '') {
      return { isValid: false, message: 'Nome é obrigatório' };
    }

    if (name.trim().length < 2) {
      return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
    }

    if (name.length > 100) {
      return { isValid: false, message: 'Nome muito longo (máximo 100 caracteres)' };
    }

    // Verifica se contém apenas letras, espaços e acentos
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, message: 'Nome deve conter apenas letras e espaços' };
    }

    return { isValid: true };
  }

  /**
   * Valida matrícula de estudante
   */
  static validateMatricula(matricula: string): ValidationResult {
    if (!matricula || matricula.trim() === '') {
      return { isValid: false, message: 'Matrícula é obrigatória' };
    }

    // Remove espaços e converte para maiúsculo
    const cleanMatricula = matricula.trim().toUpperCase();

    // Verifica formato básico (letras e números)
    const matriculaRegex = /^[A-Z0-9]+$/;
    if (!matriculaRegex.test(cleanMatricula)) {
      return { isValid: false, message: 'Matrícula deve conter apenas letras e números' };
    }

    if (cleanMatricula.length < 4 || cleanMatricula.length > 20) {
      return { isValid: false, message: 'Matrícula deve ter entre 4 e 20 caracteres' };
    }

    return { isValid: true };
  }

  /**
   * Valida título de arquivo
   */
  static validateFileTitle(title: string): ValidationResult {
    if (!title || title.trim() === '') {
      return { isValid: false, message: 'Título do arquivo é obrigatório' };
    }

    if (title.trim().length < 3) {
      return { isValid: false, message: 'Título deve ter pelo menos 3 caracteres' };
    }

    if (title.length > 200) {
      return { isValid: false, message: 'Título muito longo (máximo 200 caracteres)' };
    }

    return { isValid: true };
  }

  /**
   * Valida semestre
   */
  static validateSemester(semester: string): ValidationResult {
    if (!semester || semester.trim() === '') {
      return { isValid: false, message: 'Semestre é obrigatório' };
    }

    // Formatos aceitos: "2024.1", "2024.2", "1", "2", etc.
    const semesterRegex = /^(\d{4}\.[12]|\d+)$/;
    if (!semesterRegex.test(semester.trim())) {
      return { isValid: false, message: 'Formato de semestre inválido (ex: 2024.1 ou 1)' };
    }

    return { isValid: true };
  }

  /**
   * Valida disciplina/matéria
   */
  static validateSubject(subject: string): ValidationResult {
    if (!subject || subject.trim() === '') {
      return { isValid: false, message: 'Disciplina é obrigatória' };
    }

    if (subject.trim().length < 2) {
      return { isValid: false, message: 'Nome da disciplina deve ter pelo menos 2 caracteres' };
    }

    if (subject.length > 100) {
      return { isValid: false, message: 'Nome da disciplina muito longo (máximo 100 caracteres)' };
    }

    return { isValid: true };
  }

  /**
   * Valida nome de curso
   */
  static validateCourseName(courseName: string): ValidationResult {
    if (!courseName || courseName.trim() === '') {
      return { isValid: false, message: 'Nome do curso é obrigatório' };
    }

    if (courseName.trim().length < 3) {
      return { isValid: false, message: 'Nome do curso deve ter pelo menos 3 caracteres' };
    }

    if (courseName.length > 100) {
      return { isValid: false, message: 'Nome do curso muito longo (máximo 100 caracteres)' };
    }

    return { isValid: true };
  }

  /**
   * Valida descrição de curso
   */
  static validateCourseDescription(description: string): ValidationResult {
    if (!description || description.trim() === '') {
      return { isValid: false, message: 'Descrição do curso é obrigatória' };
    }

    if (description.trim().length < 10) {
      return { isValid: false, message: 'Descrição deve ter pelo menos 10 caracteres' };
    }

    if (description.length > 500) {
      return { isValid: false, message: 'Descrição muito longa (máximo 500 caracteres)' };
    }

    return { isValid: true };
  }

  /**
   * Valida role de usuário
   */
  static validateUserRole(role: string): ValidationResult {
    const validRoles = ['admin', 'student'];
    
    if (!role || !validRoles.includes(role)) {
      return { isValid: false, message: 'Role deve ser "admin" ou "student"' };
    }

    return { isValid: true };
  }

  /**
   * Valida tamanho de arquivo (em bytes)
   */
  static validateFileSize(sizeInBytes: number, maxSizeInMB: number = 10): ValidationResult {
    if (sizeInBytes <= 0) {
      return { isValid: false, message: 'Arquivo não pode estar vazio' };
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (sizeInBytes > maxSizeInBytes) {
      return { 
        isValid: false, 
        message: `Arquivo muito grande (máximo ${maxSizeInMB}MB)` 
      };
    }

    return { isValid: true };
  }

  /**
   * Valida tipo de arquivo
   */
  static validateFileType(fileName: string, allowedTypes: string[] = []): ValidationResult {
    if (!fileName || fileName.trim() === '') {
      return { isValid: false, message: 'Nome do arquivo é obrigatório' };
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) {
      return { isValid: false, message: 'Arquivo deve ter uma extensão' };
    }

    // Se não especificou tipos permitidos, aceita qualquer um
    if (allowedTypes.length === 0) {
      return { isValid: true };
    }

    if (!allowedTypes.includes(extension)) {
      return { 
        isValid: false, 
        message: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}` 
      };
    }

    return { isValid: true };
  }

  /**
   * Valida múltiplos campos de uma vez
   */
  static validateFields(fields: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};

    for (const [fieldName, value] of Object.entries(fields)) {
      const validator = rules[fieldName];
      if (validator) {
        results[fieldName] = validator(value);
      }
    }

    return results;
  }

  /**
   * Verifica se todos os resultados de validação são válidos
   */
  static areAllValid(results: Record<string, ValidationResult>): boolean {
    return Object.values(results).every(result => result.isValid);
  }

  /**
   * Obtém a primeira mensagem de erro dos resultados de validação
   */
  static getFirstErrorMessage(results: Record<string, ValidationResult>): string | null {
    for (const result of Object.values(results)) {
      if (!result.isValid && result.message) {
        return result.message;
      }
    }
    return null;
  }

  /**
   * Sanitiza string removendo caracteres perigosos
   */
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove < e >
      .replace(/javascript:/gi, '') // Remove javascript:
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  /**
   * Valida URL (para links de arquivos)
   */
  static validateUrl(url: string): ValidationResult {
    if (!url || url.trim() === '') {
      return { isValid: false, message: 'URL é obrigatória' };
    }

    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, message: 'URL inválida' };
    }
  }
}