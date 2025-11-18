/**
 * Utilitário de cache simples com TTL (Time To Live)
 * Usado para cachear dados que mudam raramente e melhorar performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Armazena dados no cache com TTL especificado
   * @param key Chave única para identificar os dados
   * @param data Dados a serem cacheados
   * @param ttlSeconds TTL em segundos
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000, // Converter para milissegundos
    };
    this.cache.set(key, entry);
  }

  /**
   * Recupera dados do cache se ainda válidos
   * @param key Chave dos dados
   * @returns Dados cacheados ou null se expirado/não encontrado
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Verificar se o cache expirou
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Invalida (remove) entrada específica do cache
   * @param key Chave a ser invalidada
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalida todas as entradas que começam com o prefixo especificado
   * @param prefix Prefixo das chaves a serem invalidadas
   */
  invalidateByPrefix(prefix: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove entradas expiradas do cache
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Retorna estatísticas do cache (útil para debugging)
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Instância singleton do cache
export const cacheManager = new CacheManager();

// Executar cleanup periódico (a cada 5 minutos)
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup();
  }, 5 * 60 * 1000);
}

// Constantes de TTL para diferentes tipos de dados
export const CACHE_TTL = {
  COURSES: 10 * 60, // 10 minutos
  DASHBOARD_STATS: 5 * 60, // 5 minutos
  RECENT_FILES: 1 * 60, // 1 minuto
} as const;
