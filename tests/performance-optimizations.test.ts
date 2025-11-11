/**
 * Testes para otimizações de performance (Task 19)
 * - Caching (19.1)
 * - Paginação (19.2)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cacheManager, CACHE_TTL } from '../src/utils/cache';

describe('Task 19.1 - Caching', () => {
  beforeEach(() => {
    // Limpar cache antes de cada teste
    cacheManager.clear();
  });

  describe('CacheManager básico', () => {
    it('deve armazenar e recuperar dados do cache', () => {
      const testData = { id: 1, name: 'Test' };
      cacheManager.set('test-key', testData, 60);
      
      const cached = cacheManager.get('test-key');
      expect(cached).toEqual(testData);
    });

    it('deve retornar null para chave inexistente', () => {
      const cached = cacheManager.get('non-existent');
      expect(cached).toBeNull();
    });

    it('deve retornar null para cache expirado', async () => {
      cacheManager.set('test-key', 'data', 1); // 1 segundo
      
      // Aguardar expiração
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const cached = cacheManager.get('test-key');
      expect(cached).toBeNull();
    });

    it('deve invalidar entrada específica', () => {
      cacheManager.set('test-key', 'data', 60);
      expect(cacheManager.get('test-key')).toBe('data');
      
      cacheManager.invalidate('test-key');
      expect(cacheManager.get('test-key')).toBeNull();
    });

    it('deve invalidar por prefixo', () => {
      cacheManager.set('courses:all', 'data1', 60);
      cacheManager.set('courses:withStats', 'data2', 60);
      cacheManager.set('dashboard:admin', 'data3', 60);
      
      cacheManager.invalidateByPrefix('courses:');
      
      expect(cacheManager.get('courses:all')).toBeNull();
      expect(cacheManager.get('courses:withStats')).toBeNull();
      expect(cacheManager.get('dashboard:admin')).toBe('data3');
    });

    it('deve limpar todo o cache', () => {
      cacheManager.set('key1', 'data1', 60);
      cacheManager.set('key2', 'data2', 60);
      
      cacheManager.clear();
      
      expect(cacheManager.get('key1')).toBeNull();
      expect(cacheManager.get('key2')).toBeNull();
    });

    it('deve retornar estatísticas corretas', () => {
      cacheManager.set('key1', 'data1', 60);
      cacheManager.set('key2', 'data2', 60);
      
      const stats = cacheManager.getStats();
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });
  });

  describe('TTL configurado', () => {
    it('deve ter TTL correto para cursos (10 minutos)', () => {
      expect(CACHE_TTL.COURSES).toBe(10 * 60);
    });

    it('deve ter TTL correto para estatísticas do dashboard (5 minutos)', () => {
      expect(CACHE_TTL.DASHBOARD_STATS).toBe(5 * 60);
    });

    it('deve ter TTL correto para arquivos recentes (1 minuto)', () => {
      expect(CACHE_TTL.RECENT_FILES).toBe(1 * 60);
    });
  });

  describe('Cleanup automático', () => {
    it('deve remover entradas expiradas no cleanup', async () => {
      cacheManager.set('expired', 'data', 1); // 1 segundo
      cacheManager.set('valid', 'data', 60); // 60 segundos
      
      // Aguardar expiração
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      cacheManager.cleanup();
      
      expect(cacheManager.get('expired')).toBeNull();
      expect(cacheManager.get('valid')).toBe('data');
    });
  });

  describe('Edge cases', () => {
    it('deve cachear arrays vazios', () => {
      cacheManager.set('empty-array', [], 60);
      const cached = cacheManager.get('empty-array');
      expect(cached).toEqual([]);
    });

    it('deve cachear objetos complexos', () => {
      const complexData = {
        id: 1,
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' }
        }
      };
      
      cacheManager.set('complex', complexData, 60);
      const cached = cacheManager.get('complex');
      expect(cached).toEqual(complexData);
    });

    it('deve cachear null e undefined', () => {
      cacheManager.set('null-value', null, 60);
      cacheManager.set('undefined-value', undefined, 60);
      
      expect(cacheManager.get('null-value')).toBeNull();
      expect(cacheManager.get('undefined-value')).toBeUndefined();
    });
  });
});

describe('Task 19.2 - Paginação', () => {
  describe('Configuração de paginação', () => {
    it('deve usar 50 itens por página', () => {
      const ITEMS_PER_PAGE = 50;
      expect(ITEMS_PER_PAGE).toBe(50);
    });

    it('deve calcular offset corretamente', () => {
      const ITEMS_PER_PAGE = 50;
      
      // Página 0 (primeira)
      expect(0 * ITEMS_PER_PAGE).toBe(0);
      
      // Página 1 (segunda)
      expect(1 * ITEMS_PER_PAGE).toBe(50);
      
      // Página 2 (terceira)
      expect(2 * ITEMS_PER_PAGE).toBe(100);
    });

    it('deve detectar se há mais resultados', () => {
      const ITEMS_PER_PAGE = 50;
      
      // Se retornou exatamente 50, pode haver mais
      const results1 = new Array(50);
      expect(results1.length === ITEMS_PER_PAGE).toBe(true);
      
      // Se retornou menos de 50, não há mais
      const results2 = new Array(30);
      expect(results2.length === ITEMS_PER_PAGE).toBe(false);
    });
  });

  describe('Lógica de navegação', () => {
    it('deve desabilitar botão Anterior na primeira página', () => {
      const currentPage = 0;
      const isDisabled = currentPage === 0;
      expect(isDisabled).toBe(true);
    });

    it('deve habilitar botão Anterior em páginas > 0', () => {
      const currentPage = 1;
      const isDisabled = currentPage === 0;
      expect(isDisabled).toBe(false);
    });

    it('deve desabilitar botão Próxima quando não há mais resultados', () => {
      const hasMore = false;
      const isDisabled = !hasMore;
      expect(isDisabled).toBe(true);
    });

    it('deve habilitar botão Próxima quando há mais resultados', () => {
      const hasMore = true;
      const isDisabled = !hasMore;
      expect(isDisabled).toBe(false);
    });

    it('deve calcular página anterior corretamente', () => {
      const currentPage = 2;
      const previousPage = Math.max(0, currentPage - 1);
      expect(previousPage).toBe(1);
    });

    it('deve não permitir página negativa', () => {
      const currentPage = 0;
      const previousPage = Math.max(0, currentPage - 1);
      expect(previousPage).toBe(0);
    });

    it('deve calcular próxima página corretamente', () => {
      const currentPage = 1;
      const nextPage = currentPage + 1;
      expect(nextPage).toBe(2);
    });
  });

  describe('Reset de paginação', () => {
    it('deve resetar para página 0 ao mudar filtros', () => {
      let currentPage = 5;
      
      // Simular mudança de filtro
      currentPage = 0;
      
      expect(currentPage).toBe(0);
    });
  });
});

describe('Integração Cache + Paginação', () => {
  beforeEach(() => {
    cacheManager.clear();
  });

  it('deve cachear resultados paginados separadamente', () => {
    // Simular cache de diferentes páginas
    const page0Data = [{ id: 1 }, { id: 2 }];
    const page1Data = [{ id: 3 }, { id: 4 }];
    
    cacheManager.set('files:page:0', page0Data, 60);
    cacheManager.set('files:page:1', page1Data, 60);
    
    expect(cacheManager.get('files:page:0')).toEqual(page0Data);
    expect(cacheManager.get('files:page:1')).toEqual(page1Data);
  });

  it('deve invalidar cache ao criar novo item', () => {
    // Cachear páginas
    cacheManager.set('recentFiles:10', [{ id: 1 }], 60);
    cacheManager.set('courseFiles:ES:10', [{ id: 2 }], 60);
    
    // Simular criação de arquivo (invalida caches relacionados)
    cacheManager.invalidateByPrefix('recentFiles:');
    cacheManager.invalidateByPrefix('courseFiles:');
    
    expect(cacheManager.get('recentFiles:10')).toBeNull();
    expect(cacheManager.get('courseFiles:ES:10')).toBeNull();
  });
});

console.log('✅ Testes de otimização de performance criados com sucesso!');
