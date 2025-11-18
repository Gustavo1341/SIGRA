require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFile(filePath) {
  try {
    console.log(`📄 Lendo arquivo: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Dividir em statements individuais
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Executando ${statements.length} statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.toLowerCase().includes('select') && statement.toLowerCase().includes('from pg_policies')) {
        // Pular queries de verificação
        console.log(`⏭️  Pulando query de verificação (${i + 1}/${statements.length})`);
        continue;
      }
      
      console.log(`⚙️  Executando statement ${i + 1}/${statements.length}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { query: statement + ';' });
      
      if (error) {
        console.error(`❌ Erro no statement ${i + 1}:`, error.message);
        console.error('Statement:', statement.substring(0, 100) + '...');
      } else {
        console.log(`✅ Statement ${i + 1} executado com sucesso`);
      }
    }
    
    console.log('\n✅ Script executado com sucesso!');
    
    // Verificar políticas criadas
    console.log('\n📋 Verificando políticas criadas...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'academic_files');
    
    if (policiesError) {
      console.log('⚠️  Não foi possível verificar políticas:', policiesError.message);
    } else if (policies) {
      console.log(`\n✅ ${policies.length} políticas encontradas para academic_files:`);
      policies.forEach(p => {
        console.log(`  - ${p.policyname} (${p.cmd})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar script:', error.message);
    process.exit(1);
  }
}

// Executar
executeSqlFile('fix-academic-files-rls.sql');
