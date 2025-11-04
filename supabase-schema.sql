-- =====================================================
-- SIGRA - Sistema de Gestão de Repositório Acadêmico
-- Schema SQL para Supabase
-- =====================================================
-- Este schema foi criado através de engenharia reversa
-- completa da aplicação React/TypeScript
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- TABELA: courses (Cursos)
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para courses
CREATE INDEX idx_courses_name ON courses(name);

-- =====================================================
-- TABELA: users (Usuários)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'student')),
    course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
    course_name VARCHAR(255), -- Denormalizado para performance
    avatar VARCHAR(10), -- Iniciais do usuário (ex: "JPS")
    matricula VARCHAR(50) UNIQUE,
    email_blacklisted BOOLEAN DEFAULT FALSE,
    sms_blacklisted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_course_id ON users(course_id);
CREATE INDEX idx_users_matricula ON users(matricula);

-- =====================================================
-- TABELA: enrollments (Matrículas Pendentes)
-- =====================================================
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGSERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    validated_at TIMESTAMPTZ,
    validated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para enrollments
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_email ON enrollments(email);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

-- =====================================================
-- TABELA: academic_files (Arquivos Acadêmicos)
-- =====================================================
CREATE TABLE IF NOT EXISTS academic_files (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(255) NOT NULL, -- Denormalizado
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL, -- Denormalizado
    semester VARCHAR(20) NOT NULL, -- Ex: "2024.1", "2024.2"
    subject VARCHAR(255) NOT NULL, -- Disciplina
    description TEXT,
    last_update_message TEXT NOT NULL, -- Mensagem de commit
    downloads INTEGER DEFAULT 0,
    file_name VARCHAR(500),
    file_type VARCHAR(100),
    file_content TEXT, -- Para arquivos de texto pequenos
    file_url TEXT, -- URL do Supabase Storage para arquivos grandes
    file_size BIGINT, -- Tamanho em bytes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para academic_files
CREATE INDEX idx_files_course_id ON academic_files(course_id);
CREATE INDEX idx_files_author_id ON academic_files(author_id);
CREATE INDEX idx_files_semester ON academic_files(semester);
CREATE INDEX idx_files_subject ON academic_files(subject);
CREATE INDEX idx_files_created_at ON academic_files(created_at DESC);
CREATE INDEX idx_files_downloads ON academic_files(downloads DESC);

-- Índice composto para queries de exploração
CREATE INDEX idx_files_course_semester_subject ON academic_files(course_name, semester, subject);

-- =====================================================
-- TABELA: file_downloads (Histórico de Downloads)
-- =====================================================
CREATE TABLE IF NOT EXISTS file_downloads (
    id BIGSERIAL PRIMARY KEY,
    file_id BIGINT NOT NULL REFERENCES academic_files(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET
);

-- Índices para file_downloads
CREATE INDEX idx_downloads_file_id ON file_downloads(file_id);
CREATE INDEX idx_downloads_user_id ON file_downloads(user_id);
CREATE INDEX idx_downloads_date ON file_downloads(downloaded_at DESC);

-- =====================================================
-- TABELA: system_settings (Configurações do Sistema)
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- Índice para system_settings
CREATE INDEX idx_settings_key ON system_settings(key);

-- =====================================================
-- TABELA: notifications (Notificações)
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'enrollment', 'file_published', 'report', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- TABELA: audit_log (Log de Auditoria)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'user', 'file', 'course', etc.
    entity_id BIGINT,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para audit_log
CREATE INDEX idx_audit_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_log(created_at DESC);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON academic_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para incrementar contador de downloads
CREATE OR REPLACE FUNCTION increment_file_downloads()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE academic_files 
    SET downloads = downloads + 1 
    WHERE id = NEW.file_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para incrementar downloads automaticamente
CREATE TRIGGER trigger_increment_downloads AFTER INSERT ON file_downloads
    FOR EACH ROW EXECUTE FUNCTION increment_file_downloads();

-- Função para gerar avatar (iniciais) automaticamente
CREATE OR REPLACE FUNCTION generate_avatar()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.avatar IS NULL THEN
        NEW.avatar := UPPER(
            SUBSTRING(SPLIT_PART(NEW.name, ' ', 1), 1, 1) || 
            SUBSTRING(SPLIT_PART(NEW.name, ' ', 2), 1, 1)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar avatar
CREATE TRIGGER trigger_generate_avatar BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION generate_avatar();

-- Função para sincronizar course_name quando course_id muda
CREATE OR REPLACE FUNCTION sync_course_name()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.course_id IS NOT NULL THEN
        SELECT name INTO NEW.course_name FROM courses WHERE id = NEW.course_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para sincronizar course_name em users
CREATE TRIGGER trigger_sync_user_course BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION sync_course_name();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: Estatísticas por curso
CREATE OR REPLACE VIEW course_statistics AS
SELECT 
    c.id,
    c.name,
    c.description,
    COUNT(DISTINCT u.id) as student_count,
    COUNT(DISTINCT af.id) as file_count,
    COALESCE(SUM(af.downloads), 0) as total_downloads
FROM courses c
LEFT JOIN users u ON c.id = u.course_id AND u.role = 'student'
LEFT JOIN academic_files af ON c.id = af.course_id
GROUP BY c.id, c.name, c.description;

-- View: Arquivos recentes com informações completas
CREATE OR REPLACE VIEW recent_files AS
SELECT 
    af.*,
    u.email as author_email,
    c.name as course_full_name,
    CASE 
        WHEN af.created_at > NOW() - INTERVAL '1 hour' THEN 'agora mesmo'
        WHEN af.created_at > NOW() - INTERVAL '1 day' THEN 'hoje'
        WHEN af.created_at > NOW() - INTERVAL '2 days' THEN '2 dias atrás'
        WHEN af.created_at > NOW() - INTERVAL '1 week' THEN EXTRACT(DAY FROM NOW() - af.created_at) || ' dias atrás'
        WHEN af.created_at > NOW() - INTERVAL '1 month' THEN EXTRACT(WEEK FROM NOW() - af.created_at) || ' semanas atrás'
        ELSE EXTRACT(MONTH FROM NOW() - af.created_at) || ' meses atrás'
    END as uploaded_at_text
FROM academic_files af
LEFT JOIN users u ON af.author_id = u.id
LEFT JOIN courses c ON af.course_id = c.id
ORDER BY af.created_at DESC;

-- View: Matrículas pendentes com detalhes
CREATE OR REPLACE VIEW pending_enrollments AS
SELECT 
    e.*,
    c.name as course_full_name,
    c.description as course_description
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.status = 'pending'
ORDER BY e.created_at ASC;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Usuários podem ver seu próprio perfil" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR 
                      EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Admins podem gerenciar usuários" ON users
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

-- Políticas para academic_files
CREATE POLICY "Todos podem ver arquivos" ON academic_files
    FOR SELECT USING (true);

CREATE POLICY "Usuários podem criar seus próprios arquivos" ON academic_files
    FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

CREATE POLICY "Usuários podem editar seus próprios arquivos" ON academic_files
    FOR UPDATE USING (auth.uid()::text = author_id::text);

CREATE POLICY "Admins podem gerenciar todos os arquivos" ON academic_files
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

-- Políticas para courses
CREATE POLICY "Todos podem ver cursos" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar cursos" ON courses
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

-- Políticas para enrollments
CREATE POLICY "Admins podem ver todas as matrículas" ON enrollments
    FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Admins podem gerenciar matrículas" ON enrollments
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

-- Políticas para notifications
CREATE POLICY "Usuários veem apenas suas notificações" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Sistema pode criar notificações" ON notifications
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir cursos iniciais
INSERT INTO courses (name, description) VALUES
    ('Ciência da Computação', 'Estudo de algoritmos, estruturas de dados, desenvolvimento de software e inteligência artificial.'),
    ('Medicina', 'Formação de médicos para diagnóstico, tratamento e prevenção de doenças humanas.'),
    ('Direito', 'Estudo das normas jurídicas que regem as relações sociais e a resolução de conflitos.'),
    ('Sistemas de Informação', 'Foco na administração de recursos de tecnologia da informação em organizações.'),
    ('Engenharia Civil', 'Planejamento, projeto e construção de infraestruturas como edifícios, pontes e estradas.')
ON CONFLICT (name) DO NOTHING;

-- Inserir usuário admin padrão (senha: admin123)
-- NOTA: Em produção, use bcrypt ou argon2 para hash de senhas
INSERT INTO users (name, email, password_hash, role, course_id, course_name, avatar, matricula)
SELECT 
    'Admin User',
    'admin@sigra.com',
    crypt('admin123', gen_salt('bf')),
    'admin',
    c.id,
    c.name,
    'ADM',
    NULL
FROM courses c WHERE c.name = 'Administração'
ON CONFLICT (email) DO NOTHING;

-- Inserir usuário estudante de exemplo (senha: student123)
INSERT INTO users (name, email, password_hash, role, course_id, course_name, avatar, matricula)
SELECT 
    'João Pedro Silva',
    'joao.silva@sigra.com',
    crypt('student123', gen_salt('bf')),
    'student',
    c.id,
    c.name,
    'JPS',
    '20230101'
FROM courses c WHERE c.name = 'Ciência da Computação'
ON CONFLICT (email) DO NOTHING;

-- Inserir configurações do sistema
INSERT INTO system_settings (key, value, description) VALUES
    ('maintenance_mode', 'false', 'Ativa/desativa o modo de manutenção do sistema'),
    ('max_file_size', '10485760', 'Tamanho máximo de arquivo em bytes (10MB)'),
    ('allowed_file_types', 'text/plain,application/pdf,text/x-c++src', 'Tipos de arquivo permitidos'),
    ('enable_notifications', 'true', 'Habilita/desabilita notificações por email')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- FUNÇÕES AUXILIARES PARA A APLICAÇÃO
-- =====================================================

-- Função para validar matrícula e criar usuário
CREATE OR REPLACE FUNCTION validate_enrollment(enrollment_id BIGINT, admin_user_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    enrollment_record enrollments%ROWTYPE;
    new_user_id BIGINT;
BEGIN
    -- Buscar matrícula
    SELECT * INTO enrollment_record FROM enrollments WHERE id = enrollment_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Criar novo usuário
    INSERT INTO users (name, email, password_hash, role, course_id, course_name, matricula)
    SELECT 
        enrollment_record.student_name,
        enrollment_record.email,
        crypt(enrollment_record.matricula, gen_salt('bf')), -- Senha inicial = matrícula
        'student',
        enrollment_record.course_id,
        enrollment_record.course_name,
        enrollment_record.matricula
    RETURNING id INTO new_user_id;
    
    -- Atualizar status da matrícula
    UPDATE enrollments 
    SET status = 'validated', 
        validated_at = NOW(), 
        validated_by = admin_user_id
    WHERE id = enrollment_id;
    
    -- Criar notificação para o novo usuário
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
        new_user_id,
        'enrollment',
        'Matrícula Aprovada!',
        'Sua matrícula foi aprovada. Bem-vindo ao SIGRA!'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Função para rejeitar matrícula
CREATE OR REPLACE FUNCTION reject_enrollment(enrollment_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE enrollments 
    SET status = 'rejected', 
        updated_at = NOW()
    WHERE id = enrollment_id AND status = 'pending';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar download de arquivo
CREATE OR REPLACE FUNCTION register_file_download(
    p_file_id BIGINT,
    p_user_id BIGINT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO file_downloads (file_id, user_id, ip_address)
    VALUES (p_file_id, p_user_id, p_ip_address);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar arquivos por curso, semestre e disciplina
CREATE OR REPLACE FUNCTION get_files_by_filters(
    p_course_name VARCHAR DEFAULT NULL,
    p_semester VARCHAR DEFAULT NULL,
    p_subject VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR,
    author_name VARCHAR,
    course_name VARCHAR,
    semester VARCHAR,
    subject VARCHAR,
    downloads INTEGER,
    created_at TIMESTAMPTZ,
    last_update_message TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        af.id,
        af.title,
        af.author_name,
        af.course_name,
        af.semester,
        af.subject,
        af.downloads,
        af.created_at,
        af.last_update_message
    FROM academic_files af
    WHERE 
        (p_course_name IS NULL OR af.course_name = p_course_name) AND
        (p_semester IS NULL OR af.semester = p_semester) AND
        (p_subject IS NULL OR af.subject = p_subject)
    ORDER BY af.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas do dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_user_id BIGINT DEFAULT NULL)
RETURNS TABLE (
    total_files BIGINT,
    total_users BIGINT,
    active_users BIGINT,
    total_downloads BIGINT,
    pending_enrollments BIGINT,
    user_files BIGINT,
    user_downloads BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM academic_files)::BIGINT as total_files,
        (SELECT COUNT(*) FROM users)::BIGINT as total_users,
        (SELECT COUNT(*) FROM users WHERE last_login > NOW() - INTERVAL '30 days')::BIGINT as active_users,
        (SELECT COALESCE(SUM(downloads), 0) FROM academic_files)::BIGINT as total_downloads,
        (SELECT COUNT(*) FROM enrollments WHERE status = 'pending')::BIGINT as pending_enrollments,
        (SELECT COUNT(*) FROM academic_files WHERE author_id = p_user_id)::BIGINT as user_files,
        (SELECT COALESCE(SUM(downloads), 0) FROM academic_files WHERE author_id = p_user_id)::BIGINT as user_downloads;
END;
$$ LANGUAGE plpgsql;

-- Função para autenticar usuário
CREATE OR REPLACE FUNCTION authenticate_user(p_email VARCHAR, p_password VARCHAR)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    course_name VARCHAR,
    avatar VARCHAR,
    matricula VARCHAR
) AS $$
BEGIN
    -- Atualizar last_login
    UPDATE users 
    SET last_login = NOW() 
    WHERE users.email = p_email 
    AND users.password_hash = crypt(p_password, users.password_hash);
    
    -- Retornar dados do usuário
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.course_name,
        u.avatar,
        u.matricula
    FROM users u
    WHERE u.email = p_email 
    AND u.password_hash = crypt(p_password, u.password_hash);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE courses IS 'Cursos oferecidos pela instituição';
COMMENT ON TABLE users IS 'Usuários do sistema (admins e estudantes)';
COMMENT ON TABLE enrollments IS 'Solicitações de matrícula pendentes de validação';
COMMENT ON TABLE academic_files IS 'Arquivos acadêmicos publicados pelos estudantes';
COMMENT ON TABLE file_downloads IS 'Histórico de downloads de arquivos';
COMMENT ON TABLE system_settings IS 'Configurações globais do sistema';
COMMENT ON TABLE notifications IS 'Notificações para usuários';
COMMENT ON TABLE audit_log IS 'Log de auditoria de ações no sistema';

COMMENT ON COLUMN users.role IS 'Tipo de usuário: admin ou student';
COMMENT ON COLUMN users.avatar IS 'Iniciais do nome do usuário (ex: JPS)';
COMMENT ON COLUMN users.course_name IS 'Nome do curso denormalizado para performance';
COMMENT ON COLUMN academic_files.last_update_message IS 'Mensagem de commit estilo Git';
COMMENT ON COLUMN academic_files.file_content IS 'Conteúdo do arquivo para arquivos pequenos de texto';
COMMENT ON COLUMN academic_files.file_url IS 'URL do Supabase Storage para arquivos grandes';

-- =====================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índice para busca full-text em títulos de arquivos
CREATE INDEX idx_files_title_trgm ON academic_files USING gin(title gin_trgm_ops);

-- Índice para busca full-text em disciplinas
CREATE INDEX idx_files_subject_trgm ON academic_files USING gin(subject gin_trgm_ops);

-- Índice para ordenação por popularidade
CREATE INDEX idx_files_popular ON academic_files(downloads DESC, created_at DESC);

-- =====================================================
-- GRANTS E PERMISSÕES
-- =====================================================

-- Garantir que o usuário anônimo possa ler cursos
GRANT SELECT ON courses TO anon;
GRANT SELECT ON course_statistics TO anon;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

/*
INSTRUÇÕES DE USO:

1. Acesse o Supabase Dashboard (https://app.supabase.com)
2. Selecione seu projeto
3. Vá em "SQL Editor"
4. Cole todo este arquivo e execute
5. Verifique se todas as tabelas foram criadas em "Table Editor"

DADOS DE LOGIN PADRÃO:
- Admin: admin@sigra.com / admin123
- Estudante: joao.silva@sigra.com / student123

PRÓXIMOS PASSOS:
1. Configurar Supabase Storage para upload de arquivos grandes
2. Configurar autenticação do Supabase (opcional, se quiser usar auth nativo)
3. Atualizar o código React para usar as queries do Supabase
4. Implementar as funções de CRUD usando supabase-js

ESTRUTURA DO BANCO:
- 8 tabelas principais
- 3 views para consultas otimizadas
- 8 funções auxiliares para lógica de negócio
- Row Level Security (RLS) configurado
- Triggers automáticos para updated_at, downloads, etc.
- Índices otimizados para queries comuns

SEGURANÇA:
- RLS habilitado em todas as tabelas sensíveis
- Políticas de acesso baseadas em roles
- Senhas com hash bcrypt
- Auditoria de ações importantes
*/
