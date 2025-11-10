import React, { useState, useEffect } from 'react';
import { sanitizeString, isValidEmail } from '../src/utils/inputValidation';
import { useDebounce } from '../src/hooks/useDebounce';

interface SecureInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Callback com valor sanitizado */
  onChange: (value: string) => void;
  /** Se true, sanitiza o input removendo HTML/scripts */
  sanitize?: boolean;
  /** Tipo de validação a aplicar */
  validationType?: 'email' | 'text' | 'none';
  /** Delay para debounce (padrão: 300ms) */
  debounceDelay?: number;
  /** Mensagem de erro customizada */
  errorMessage?: string;
  /** Se true, mostra erro de validação */
  showValidation?: boolean;
}

/**
 * Input com sanitização automática e validação
 * Previne XSS e valida formatos antes de passar valor para o parent
 */
const SecureInput: React.FC<SecureInputProps> = ({
  onChange,
  sanitize = true,
  validationType = 'text',
  debounceDelay = 300,
  errorMessage,
  showValidation = false,
  className = '',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const debouncedValue = useDebounce(internalValue, debounceDelay);

  // Valida e sanitiza o valor quando mudar
  useEffect(() => {
    if (!debouncedValue) {
      setValidationError(null);
      onChange('');
      return;
    }

    // Sanitiza se necessário
    const sanitizedValue = sanitize ? sanitizeString(debouncedValue) : debouncedValue;

    // Valida baseado no tipo
    let isValid = true;
    let error: string | null = null;

    if (validationType === 'email' && sanitizedValue) {
      isValid = isValidEmail(sanitizedValue);
      error = isValid ? null : (errorMessage || 'Email inválido');
    }

    setValidationError(error);
    
    // Sempre passa o valor sanitizado, mesmo se inválido
    // O componente pai decide o que fazer com valores inválidos
    onChange(sanitizedValue);
  }, [debouncedValue, sanitize, validationType, errorMessage, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  const hasError = showValidation && validationError;

  return (
    <div className="w-full">
      <input
        {...props}
        value={internalValue}
        onChange={handleChange}
        className={`
          ${className}
          ${hasError ? 'border-red-500 focus:ring-red-500' : ''}
        `}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{validationError}</p>
      )}
    </div>
  );
};

export default SecureInput;
