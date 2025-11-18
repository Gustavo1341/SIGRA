import { createClient } from '@supabase/supabase-js';
import type { Database } from './lib/types/database';

// Carregar variáveis de ambiente manualmente para Node.js
const supabaseUrl = 'https://sbxrzkmscujbvcwzmnfv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNieHJ6a21zY3VqYnZjd3ptbmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTIxNzUsImV4cCI6MjA3Nzg2ODE3NX0.z-JgJcBf1-ClY9zoHhDTbNqrMRVywIen7HLgweP2TkY';

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('🔍 Testando conexão com Supabase...\n');

  // Teste 1: Verificar conexão básica
  console.log('1️⃣ Testando conexão básica...');
  try {
    const { data, error } = await supabase.from('courses').select('*').limit(1);
    if (error) {
      console.error('❌ Erro ao buscar courses:', error);
      console.error('Detalhes:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Conexão OK! Cursos encontrados:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Primeiro curso:', data[0]);
      }
    }
  } catch (err) {
    console.error('❌ Erro de rede:', err);
  }

  // Teste 2: Verificar se a tabela users existe
  console.log('\n2️⃣ Testando tabela users...');
  try {
    const { data, error } = await supabase.from('users').select('id, name, email, role').limit(1);
    if (error) {
      console.error('❌ Erro ao buscar users:', error);
    } else {
      console.log('✅ Tabela users OK! Usuários encontrados:', data?.length || 0);
    }
  } catch (err) {
    console.error('❌ Erro de rede:', err);
  }

  // Teste 3: Testar função RPC authenticate_user
  console.log('\n3️⃣ Testando função authenticate_user...');
  try {
    const { data, error } = await supabase.rpc('authenticate_user', {
      p_email: 'admin@sigra.com',
      p_password: 'admin123',
    });
    if (error) {
      console.error('❌ Erro ao chamar authenticate_user:', error);
      console.error('Detalhes:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Função RPC OK!');
      console.log('Resultado:', data);
    }
  } catch (err) {
    console.error('❌ Erro de rede:', err);
  }

  // Teste 4: Verificar políticas RLS
  console.log('\n4️⃣ Informações sobre RLS:');
  console.log('⚠️  Se você está recebendo erro 500, pode ser que:');
  console.log('   - As tabelas não foram criadas no Supabase');
  console.log('   - As políticas RLS estão muito restritivas');
  console.log('   - A extensão pgcrypto não está habilitada');
  console.log('\n💡 Solução:');
  console.log('   1. Acesse o Supabase Dashboard');
  console.log('   2. Vá em SQL Editor');
  console.log('   3. Execute o arquivo supabase-schema.sql');
  console.log('   4. Ou temporariamente desabilite RLS para testar:');
  console.log('      ALTER TABLE courses DISABLE ROW LEVEL SECURITY;');
}

testSupabase();
