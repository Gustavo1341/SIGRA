import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// Validar variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não está definida nas variáveis de ambiente');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY não está definida nas variáveis de ambiente');
}

// Criar e exportar instância configurada do cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Função para testar conexão com Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('courses').select('count').limit(1);
    
    if (error) {
      console.error('Erro ao conectar com Supabase:', error);
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('Erro de rede ao conectar com Supabase:', error);
    return false;
  }
};