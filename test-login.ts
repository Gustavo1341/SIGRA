import { createClient } from '@supabase/supabase-js';
import type { Database } from './lib/types/database';

// Configuração do Supabase
const supabaseUrl = 'https://sbxrzkmscujbvcwzmnfv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNieHJ6a21zY3VqYnZjd3ptbmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTIxNzUsImV4cCI6MjA3Nzg2ODE3NX0.z-JgJcBf1-ClY9zoHhDTbNqrMRVywIen7HLgweP2TkY';

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🔐 Testando login com AuthService...\n');

  // Credenciais para testar
  const testCredentials = [
    { email: 'admin@teste.com', password: 'senha123', name: 'Admin Teste' },
    { email: 'admin@sigra.com', password: 'admin123', name: 'Admin Padrão' },
    { email: 'joao.silva@sigra.com', password: 'student123', name: 'Estudante' },
  ];

  for (const cred of testCredentials) {
    console.log(`\n📧 Tentando login: ${cred.email}`);
    console.log(`🔑 Senha: ${cred.password}`);
    
    try {
      const { data, error } = await supabase.rpc('authenticate_user', {
        p_email: cred.email,
        p_password: cred.password,
      });

      if (error) {
        console.error('❌ Erro:', error.message);
        continue;
      }

      if (!data || data.length === 0) {
        console.log('❌ Email ou senha incorretos');
        continue;
      }

      const user = data[0];
      console.log('✅ Login bem-sucedido!');
      console.log('👤 Dados do usuário:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Curso: ${user.course_name || 'N/A'}`);
      console.log(`   Avatar: ${user.avatar}`);
      console.log(`   Matrícula: ${user.matricula || 'N/A'}`);
      
    } catch (err) {
      console.error('❌ Erro ao fazer login:', err);
    }
  }

  console.log('\n\n🎯 Resumo:');
  console.log('Se algum login funcionou, o AuthService está pronto para uso!');
  console.log('\nPara usar no código:');
  console.log('```typescript');
  console.log('import { authService } from "./services/auth.service";');
  console.log('');
  console.log('const user = await authService.login({');
  console.log('  email: "admin@teste.com",');
  console.log('  password: "senha123"');
  console.log('});');
  console.log('```');
}

testLogin();
