import { useState, useCallback, useRef, useEffect } from 'react';
import { ErrorHandler, type AppError } from '../utils/errorHandler';

/**
 * Estado de uma operação assíncrona
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

/**
 * Opções para o hook useAsync
 */
export interface UseAsyncOptions {
  /** Número máximo de tentativas automáticas em caso de erro */
  maxRetries?: number;
  /** Delay entre tentativas em milissegundos */
  retryDelay?: number;
  /** Se deve fazer retry automaticamente em erros de rede */
  autoRetryOnNetworkError?: boolean;
}

/**
 * Hook para gerenciar operações assíncronas com estado de loading, error e data
 * Inclui suporte a retry automático e manual
 */
export function useAsync<T>(options: UseAsyncOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    autoRetryOnNetworkError = true,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Ref para controlar se o componente ainda está montado
  const isMountedRef = useRef(true);
  
  // Ref para armazenar a função atual sendo executada
  const currentOperationRef = useRef<(() => Promise<T>) | null>(null);
  
  // Ref para controlar tentativas de retry
  const retryCountRef = useRef(0);

  /**
   * Executa uma operação assíncrona
   */
  const execute = useCallback(async (asyncFunction: () => Promise<T>): Promise<T | null> => {
    if (!isMountedRef.current) return null;

    // Armazena a operação atual
    currentOperationRef.current = asyncFunction;
    retryCountRef.current = 0;

    const executeWithRetry = async (): Promise<T | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const result = await asyncFunction();

        if (isMountedRef.current) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }

        return result;
      } catch (error) {
        const appError = ErrorHandler.handle(error);

        if (!isMountedRef.current) return null;

        // Verifica se deve fazer retry automático
        const shouldRetry = 
          autoRetryOnNetworkError &&
          appError.type === 'NETWORK' &&
          retryCountRef.current < maxRetries;

        if (shouldRetry) {
          retryCountRef.current++;
          
          // Aguarda o delay antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          
          if (isMountedRef.current) {
            return executeWithRetry();
          }
        }

        // Se chegou aqui, não vai fazer retry ou esgotou as tentativas
        setState({
          data: null,
          loading: false,
          error: appError,
        });

        throw appError;
      }
    };

    return executeWithRetry();
  }, [maxRetries, retryDelay, autoRetryOnNetworkError]);

  /**
   * Tenta executar novamente a última operação
   */
  const retry = useCallback(async (): Promise<T | null> => {
    if (!currentOperationRef.current) {
      console.warn('useAsync: Nenhuma operação para repetir');
      return null;
    }

    retryCountRef.current = 0;
    return execute(currentOperationRef.current);
  }, [execute]);

  /**
   * Reseta o estado para o inicial
   */
  const reset = useCallback(() => {
    if (!isMountedRef.current) return;

    setState({
      data: null,
      loading: false,
      error: null,
    });
    
    currentOperationRef.current = null;
    retryCountRef.current = 0;
  }, []);

  /**
   * Limpa apenas o erro, mantendo os dados
   */
  const clearError = useCallback(() => {
    if (!isMountedRef.current) return;

    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Define dados manualmente (útil para atualizações otimistas)
   */
  const setData = useCallback((data: T | null) => {
    if (!isMountedRef.current) return;

    setState(prev => ({ ...prev, data }));
  }, []);

  // Cleanup quando o componente for desmontado
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    clearError,
    setData,
    isRetrying: retryCountRef.current > 0,
    retryCount: retryCountRef.current,
    canRetry: currentOperationRef.current !== null,
  };
}

/**
 * Hook simplificado para operações que não precisam de retry
 */
export function useSimpleAsync<T>() {
  return useAsync<T>({ 
    maxRetries: 0, 
    autoRetryOnNetworkError: false 
  });
}

/**
 * Hook para operações que devem ter retry agressivo (ex: operações críticas)
 */
export function useResilientAsync<T>() {
  return useAsync<T>({ 
    maxRetries: 5, 
    retryDelay: 2000, 
    autoRetryOnNetworkError: true 
  });
}