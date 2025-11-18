import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * Útil para inputs de busca e prevenir excesso de requisições
 * 
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Valor debounced
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // Faz busca apenas quando o usuário parar de digitar por 500ms
 *   if (debouncedSearch) {
 *     searchAPI(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um timer que atualiza o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para debounce de callbacks
 * Útil para funções que devem ser executadas com delay
 * 
 * @param callback - Função a ser executada
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Função debounced
 * 
 * @example
 * const handleSearch = useDebounceCallback((term: string) => {
 *   searchAPI(term);
 * }, 500);
 * 
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return (...args: Parameters<T>) => {
    // Limpa timeout anterior se existir
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Cria novo timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };
}
