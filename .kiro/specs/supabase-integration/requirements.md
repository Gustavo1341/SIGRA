# Requirements Document - Integração Supabase no SIGRA

## Introduction

Este documento especifica os requisitos para integrar o Supabase como backend do SIGRA (Sistema de Gestão de Repositório Acadêmico), substituindo os dados mockados por operações reais de banco de dados. O sistema deve manter todas as funcionalidades existentes enquanto adiciona persistência de dados, autenticação segura e controle de acesso baseado em roles (Admin/Student).

## Glossary

- **SIGRA_System**: O Sistema de Gestão de Repositório Acadêmico completo
- **Supabase_Client**: Cliente JavaScript do Supabase para comunicação com o backend
- **Admin_User**: Usuário com role de administrador que pode gerenciar todo o sistema
- **Student_User**: Usuário com role de estudante que pode publicar e visualizar arquivos
- **Academic_File**: Arquivo acadêmico publicado por estudantes
- **Enrollment_Request**: Solicitação de matrícula pendente de validação por admin
- **Course_Entity**: Curso oferecido pela instituição
- **Authentication_Service**: Serviço de autenticação usando bcrypt para senhas
- **RLS_Policy**: Row Level Security policy do Supabase para controle de acesso
- **Dashboard_Stats**: Estatísticas exibidas no painel administrativo ou do estudante

## Requirements

### Requirement 1: Configuração e Inicialização do Supabase

**User Story:** Como desenvolvedor, eu quero configurar o cliente Supabase na aplicação, para que todas as páginas possam acessar o banco de dados de forma segura.

#### Acceptance Criteria

1. WHEN THE SIGRA_System inicializa, THE Supabase_Client SHALL ser configurado com as credenciais do arquivo .env
2. THE Supabase_Client SHALL ser disponibilizado através de um módulo centralizado para todas as páginas
3. THE SIGRA_System SHALL validar a conexão com Supabase antes de renderizar a aplicação
4. IF a conexão com Supabase falhar, THEN THE SIGRA_System SHALL exibir mensagem de erro amigável ao usuário
5. THE SIGRA_System SHALL armazenar as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

### Requirement 2: Autenticação de Usuários

**User Story:** Como usuário (admin ou estudante), eu quero fazer login com email e senha, para que eu possa acessar o sistema de forma segura.

#### Acceptance Criteria

1. WHEN um usuário submete credenciais válidas, THE Authentication_Service SHALL verificar email e senha usando bcrypt
2. THE Authentication_Service SHALL retornar os dados completos do usuário incluindo role, course_name e avatar
3. THE Authentication_Service SHALL atualizar o campo last_login do usuário
4. IF as credenciais forem inválidas, THEN THE SIGRA_System SHALL exibir mensagem de erro clara
5. THE SIGRA_System SHALL armazenar o usuário autenticado no estado da aplicação
6. WHEN um usuário faz logout, THE SIGRA_System SHALL limpar todos os dados de sessão

### Requirement 3: Dashboard Administrativo com Dados Reais

**User Story:** Como Admin_User, eu quero visualizar estatísticas reais do sistema no dashboard, para que eu possa monitorar a atividade da plataforma.

#### Acceptance Criteria

1. WHEN um Admin_User acessa o dashboard, THE SIGRA_System SHALL buscar estatísticas usando a função get_dashboard_stats
2. THE Dashboard_Stats SHALL incluir total_files, total_users, active_users, total_downloads e pending_enrollments
3. THE SIGRA_System SHALL exibir os arquivos mais recentes ordenados por data de criação
4. THE SIGRA_System SHALL calcular e exibir percentuais de crescimento quando aplicável
5. THE SIGRA_System SHALL atualizar as estatísticas automaticamente ao carregar a página

### Requirement 4: Dashboard do Estudante com Dados Personalizados

**User Story:** Como Student_User, eu quero ver minhas estatísticas pessoais e arquivos do meu curso, para que eu possa acompanhar minha contribuição ao repositório.

#### Acceptance Criteria

1. WHEN um Student_User acessa o dashboard, THE SIGRA_System SHALL buscar estatísticas usando get_dashboard_stats com o user_id
2. THE Dashboard_Stats SHALL incluir user_files (arquivos do usuário) e user_downloads (downloads dos arquivos do usuário)
3. THE SIGRA_System SHALL filtrar e exibir arquivos recentes do curso do estudante
4. THE SIGRA_System SHALL exibir o total de arquivos disponíveis no repositório
5. THE SIGRA_System SHALL personalizar a saudação com o nome do estudante

### Requirement 5: Validação de Matrículas (Admin)

**User Story:** Como Admin_User, eu quero validar ou rejeitar solicitações de matrícula, para que novos estudantes possam acessar o sistema.

#### Acceptance Criteria

1. WHEN um Admin_User acessa a página de validação, THE SIGRA_System SHALL buscar todas as matrículas com status 'pending'
2. WHEN um Admin_User aprova uma matrícula, THE SIGRA_System SHALL chamar a função validate_enrollment
3. THE validate_enrollment function SHALL criar um novo Student_User com senha inicial igual à matrícula
4. THE validate_enrollment function SHALL atualizar o status da matrícula para 'validated'
5. THE validate_enrollment function SHALL criar uma notificação para o novo usuário
6. WHEN um Admin_User rejeita uma matrícula, THE SIGRA_System SHALL chamar reject_enrollment
7. THE SIGRA_System SHALL atualizar a lista de matrículas pendentes após cada ação

### Requirement 6: Publicação de Arquivos Acadêmicos

**User Story:** Como Student_User, eu quero publicar arquivos acadêmicos no repositório, para que outros estudantes possam acessar meu trabalho.

#### Acceptance Criteria

1. WHEN um Student_User submete um arquivo, THE SIGRA_System SHALL validar todos os campos obrigatórios
2. THE SIGRA_System SHALL inserir o arquivo na tabela academic_files com author_id do usuário logado
3. THE SIGRA_System SHALL buscar o course_id baseado no course_name do usuário
4. THE SIGRA_System SHALL armazenar file_content para arquivos de texto pequenos
5. THE SIGRA_System SHALL definir downloads como 0 e created_at como NOW()
6. IF a publicação for bem-sucedida, THEN THE SIGRA_System SHALL redirecionar para a página "Meus Arquivos"
7. IF houver erro, THEN THE SIGRA_System SHALL exibir mensagem de erro específica

### Requirement 7: Listagem e Exploração de Arquivos

**User Story:** Como usuário, eu quero explorar arquivos por curso, semestre e disciplina, para que eu possa encontrar conteúdo relevante.

#### Acceptance Criteria

1. WHEN um usuário acessa a página de exploração, THE SIGRA_System SHALL usar get_files_by_filters
2. THE SIGRA_System SHALL permitir filtros por course_name, semester e subject
3. THE SIGRA_System SHALL exibir informações completas de cada arquivo incluindo author_name e downloads
4. THE SIGRA_System SHALL calcular e exibir o texto "uploadedAt" baseado em created_at
5. THE SIGRA_System SHALL ordenar arquivos por data de criação (mais recentes primeiro)

### Requirement 8: Visualização e Download de Arquivos

**User Story:** Como usuário, eu quero visualizar e baixar arquivos acadêmicos, para que eu possa acessar o conteúdo compartilhado.

#### Acceptance Criteria

1. WHEN um usuário visualiza um arquivo, THE SIGRA_System SHALL buscar file_content ou file_url
2. WHEN um usuário baixa um arquivo, THE SIGRA_System SHALL chamar register_file_download
3. THE register_file_download function SHALL incrementar automaticamente o contador de downloads
4. THE SIGRA_System SHALL registrar o user_id do usuário que fez o download
5. THE SIGRA_System SHALL permitir visualização inline para arquivos de texto

### Requirement 9: Gerenciamento de Usuários (Admin)

**User Story:** Como Admin_User, eu quero gerenciar usuários do sistema, para que eu possa adicionar, editar ou remover contas.

#### Acceptance Criteria

1. WHEN um Admin_User acessa gerenciamento de usuários, THE SIGRA_System SHALL listar todos os usuários
2. THE SIGRA_System SHALL permitir filtrar usuários por role (admin/student) e course
3. WHEN um Admin_User cria um usuário, THE SIGRA_System SHALL gerar password_hash usando bcrypt
4. THE SIGRA_System SHALL gerar avatar automaticamente através do trigger generate_avatar
5. THE SIGRA_System SHALL sincronizar course_name automaticamente através do trigger sync_course_name
6. WHEN um Admin_User edita um usuário, THE SIGRA_System SHALL atualizar apenas os campos modificados
7. THE SIGRA_System SHALL validar que email e matrícula sejam únicos

### Requirement 10: Gerenciamento de Cursos (Admin)

**User Story:** Como Admin_User, eu quero gerenciar cursos oferecidos, para que o sistema reflita a estrutura acadêmica atual.

#### Acceptance Criteria

1. WHEN um Admin_User acessa gerenciamento de cursos, THE SIGRA_System SHALL listar todos os cursos
2. THE SIGRA_System SHALL exibir estatísticas de cada curso usando course_statistics view
3. WHEN um Admin_User cria um curso, THE SIGRA_System SHALL validar que o nome seja único
4. WHEN um Admin_User edita um curso, THE SIGRA_System SHALL atualizar course_name em usuários relacionados
5. WHEN um Admin_User deleta um curso, THE SIGRA_System SHALL verificar se há usuários ou arquivos vinculados
6. THE SIGRA_System SHALL exibir student_count, file_count e total_downloads para cada curso

### Requirement 11: Meus Arquivos (Student)

**User Story:** Como Student_User, eu quero visualizar todos os meus arquivos publicados, para que eu possa gerenciar minhas contribuições.

#### Acceptance Criteria

1. WHEN um Student_User acessa "Meus Arquivos", THE SIGRA_System SHALL filtrar arquivos por author_id
2. THE SIGRA_System SHALL exibir estatísticas totais dos arquivos do usuário
3. THE SIGRA_System SHALL permitir editar informações dos próprios arquivos
4. THE SIGRA_System SHALL permitir deletar os próprios arquivos
5. THE SIGRA_System SHALL ordenar arquivos por data de criação (mais recentes primeiro)

### Requirement 12: Configurações de Perfil

**User Story:** Como usuário, eu quero atualizar minhas informações de perfil, para que meus dados estejam sempre corretos.

#### Acceptance Criteria

1. WHEN um usuário acessa configurações, THE SIGRA_System SHALL exibir dados atuais do perfil
2. THE SIGRA_System SHALL permitir atualizar name, email e password
3. WHEN um usuário atualiza a senha, THE SIGRA_System SHALL gerar novo password_hash com bcrypt
4. THE SIGRA_System SHALL validar que o novo email seja único antes de atualizar
5. THE SIGRA_System SHALL atualizar o avatar automaticamente se o nome mudar
6. IF a atualização for bem-sucedida, THEN THE SIGRA_System SHALL atualizar o estado do usuário logado

### Requirement 13: Tratamento de Erros e Loading States

**User Story:** Como usuário, eu quero feedback visual durante operações, para que eu saiba o status das minhas ações.

#### Acceptance Criteria

1. WHILE uma operação de banco de dados está em andamento, THE SIGRA_System SHALL exibir indicador de loading
2. IF uma operação falhar, THEN THE SIGRA_System SHALL exibir mensagem de erro específica e acionável
3. THE SIGRA_System SHALL diferenciar entre erros de rede, validação e permissão
4. WHEN uma operação for bem-sucedida, THE SIGRA_System SHALL exibir mensagem de confirmação
5. THE SIGRA_System SHALL implementar retry automático para falhas de rede temporárias

### Requirement 14: Segurança e Controle de Acesso

**User Story:** Como sistema, eu quero garantir que usuários só acessem recursos permitidos, para proteger dados sensíveis.

#### Acceptance Criteria

1. THE SIGRA_System SHALL respeitar as RLS_Policy configuradas no Supabase
2. THE SIGRA_System SHALL validar permissões no frontend antes de exibir ações restritas
3. THE SIGRA_System SHALL validar role do usuário antes de permitir acesso a rotas administrativas
4. THE SIGRA_System SHALL impedir que Student_User acesse páginas de admin
5. THE SIGRA_System SHALL impedir que usuários editem ou deletem recursos de outros usuários
6. THE SIGRA_System SHALL usar prepared statements para prevenir SQL injection

### Requirement 15: Performance e Otimização

**User Story:** Como usuário, eu quero que o sistema carregue rapidamente, para ter uma experiência fluida.

#### Acceptance Criteria

1. THE SIGRA_System SHALL implementar paginação para listagens com mais de 50 itens
2. THE SIGRA_System SHALL usar índices do banco de dados para queries frequentes
3. THE SIGRA_System SHALL cachear dados de cursos que mudam raramente
4. THE SIGRA_System SHALL usar views otimizadas (recent_files, course_statistics) quando apropriado
5. THE SIGRA_System SHALL carregar dados críticos primeiro e dados secundários de forma assíncrona
