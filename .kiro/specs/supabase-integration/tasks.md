# Implementation Plan - Integração Supabase no SIGRA

- [x] 1. Setup inicial e configuração do Supabase





  - Criar arquivo de configuração do cliente Supabase
  - Configurar variáveis de ambiente
  - Criar tipos TypeScript do database
  - Validar conexão com Supabase
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 1.1 Criar configuração do cliente Supabase


  - Criar arquivo `src/lib/supabase.ts` com createClient
  - Adicionar validação de variáveis de ambiente
  - Exportar instância configurada do cliente
  - _Requirements: 1.1, 1.2_

- [x] 1.2 Configurar variáveis de ambiente


  - Criar arquivo `.env` com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
  - Criar arquivo `.env.example` como template
  - Adicionar `.env` ao `.gitignore`
  - _Requirements: 1.5_

- [x] 1.3 Criar tipos do database


  - Criar arquivo `src/lib/types/database.ts`
  - Definir interface Database com todas as tabelas
  - Definir tipos para funções do Supabase (authenticate_user, etc)
  - Exportar tipos Row, Insert, Update para cada tabela
  - _Requirements: 1.2_

- [ ] 2. Implementar utilitários e helpers
  - Criar error handler com tipos e mensagens em português
  - Criar formatador de datas para "X dias atrás"
  - Criar validadores de input
  - Criar hook useAsync para operações assíncronas
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 2.1 Criar error handler



  - Criar arquivo `src/utils/errorHandler.ts`
  - Definir enum ErrorType e interface AppError
  - Implementar função handle() para converter erros do Supabase
  - Implementar mensagens de erro em português
  - _Requirements: 13.2, 13.3_

- [ ] 2.2 Criar formatador de datas
  - Criar arquivo `src/utils/dateFormatter.ts`
  - Implementar função formatRelativeTime() para "X dias atrás"
  - Suportar formatos: agora mesmo, hoje, X dias, X semanas, X meses
  - _Requirements: 7.4_

- [ ] 2.3 Criar hook useAsync
  - Criar arquivo `src/hooks/useAsync.ts`
  - Implementar estado AsyncState<T> com data, loading, error
  - Implementar funções execute() e reset()
  - Adicionar suporte a retry automático
  - _Requirements: 13.1, 13.5_


- [x] 3. Implementar Authentication Service




  - Criar serviço de autenticação com login, logout e atualização de perfil
  - Implementar conversão de dados do banco para formato da aplicação
  - Adicionar tratamento de erros específico de autenticação
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 3.1 Criar estrutura do AuthService


  - Criar arquivo `src/services/auth.service.ts`
  - Definir interfaces LoginCredentials e AuthUser
  - Criar classe AuthService com métodos básicos
  - _Requirements: 2.1_

- [x] 3.2 Implementar método login()


  - Chamar função RPC authenticate_user do Supabase
  - Converter role de string para enum Role
  - Mapear course_name para course no objeto User
  - Tratar erros de credenciais inválidas
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3.3 Implementar métodos de perfil


  - Implementar updateProfile() para atualizar name e email
  - Implementar changePassword() com hash bcrypt
  - Validar unicidade de email antes de atualizar
  - _Requirements: 12.2, 12.3, 12.4, 12.5_

- [x] 4. Implementar Dashboard Service




<<<<<<< HEAD
=======

>>>>>>> 11441c2cbe268a6531ad2140c1c1922440a9528f
  - Criar serviço para buscar estatísticas do dashboard
  - Implementar diferenciação entre admin e student stats
  - Buscar arquivos recentes e por curso
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.1 Criar estrutura do DashboardService


  - Criar arquivo `src/services/dashboard.service.ts`
  - Definir interface DashboardStats
  - Criar classe DashboardService
  - _Requirements: 3.1, 4.1_

- [x] 4.2 Implementar getAdminStats()


  - Chamar função get_dashboard_stats sem user_id
  - Retornar total_files, total_users, active_users, total_downloads, pending_enrollments
  - Tratar erros de conexão
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4.3 Implementar getStudentStats()


  - Chamar função get_dashboard_stats com user_id
  - Retornar user_files e user_downloads além das estatísticas gerais
  - _Requirements: 4.1, 4.2_

- [x] 4.4 Implementar getRecentFiles() e getCourseFiles()


  - Usar view recent_files para arquivos recentes
  - Filtrar por course_name para arquivos do curso
  - Limitar resultados conforme parâmetro
  - _Requirements: 3.3, 4.3_

- [ ] 5. Implementar Files Service
  - Criar serviço completo de CRUD para arquivos acadêmicos
  - Implementar filtros por curso, semestre e disciplina
  - Implementar registro de downloads
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 5.1 Criar estrutura do FilesService
  - Criar arquivo `src/services/files.service.ts`
  - Definir interfaces FileFilters e CreateFileData
  - Criar classe FilesService
  - _Requirements: 6.1, 7.1_

- [ ] 5.2 Implementar getFiles() com filtros
  - Chamar função get_files_by_filters do Supabase
  - Suportar filtros por courseName, semester, subject, authorId
  - Implementar paginação com limit e offset
  - Converter created_at para uploadedAt formatado
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 5.3 Implementar createFile()
  - Buscar course_id baseado em courseName
  - Inserir arquivo na tabela academic_files
  - Definir downloads como 0 e created_at como NOW()
  - Retornar arquivo criado com ID
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 5.4 Implementar updateFile() e deleteFile()
  - Implementar atualização parcial de arquivos
  - Implementar deleção com validação de permissão
  - Tratar erros de not found
  - _Requirements: 11.3, 11.4_

- [ ] 5.5 Implementar registerDownload()
  - Chamar função register_file_download
  - Incrementar contador automaticamente via trigger
  - Registrar user_id e ip_address
  - _Requirements: 8.2, 8.3, 8.4_

- [x] 6. Implementar Enrollments Service





  - Criar serviço para gerenciar matrículas pendentes
  - Implementar validação e rejeição de matrículas
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 6.1 Criar estrutura do EnrollmentsService


  - Criar arquivo `src/services/enrollments.service.ts`
  - Definir interface EnrollmentData
  - Criar classe EnrollmentsService
  - _Requirements: 5.1_


- [x] 6.2 Implementar getPendingEnrollments()

  - Buscar matrículas com status 'pending'
  - Ordenar por created_at (mais antigas primeiro)
  - Incluir informações do curso
  - _Requirements: 5.1_


- [x] 6.3 Implementar validateEnrollment()

  - Chamar função validate_enrollment do Supabase
  - Passar enrollment_id e admin_user_id
  - Criar novo usuário automaticamente
  - Criar notificação via trigger
  - _Requirements: 5.2, 5.3, 5.4, 5.5_


- [x] 6.4 Implementar rejectEnrollment()

  - Chamar função reject_enrollment
  - Atualizar status para 'rejected'
  - _Requirements: 5.6_


- [ ] 7. Implementar Users Service
  - Criar serviço completo de CRUD para usuários
  - Implementar filtros por role e curso
  - Implementar validações de unicidade
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 7.1 Criar estrutura do UsersService
  - Criar arquivo `src/services/users.service.ts`
  - Definir interfaces UserFilters e CreateUserData
  - Criar classe UsersService
  - _Requirements: 9.1_

- [ ] 7.2 Implementar getUsers() com filtros
  - Buscar usuários da tabela users
  - Filtrar por role (admin/student)
  - Filtrar por courseId
  - Implementar busca por nome ou email
  - _Requirements: 9.1, 9.2_

- [ ] 7.3 Implementar createUser()
  - Validar email e matrícula únicos
  - Inserir usuário com password_hash (bcrypt no backend)
  - Avatar gerado automaticamente via trigger
  - course_name sincronizado via trigger
  - _Requirements: 9.3, 9.4, 9.5, 9.7_

- [ ] 7.4 Implementar updateUser() e deleteUser()
  - Atualizar apenas campos modificados
  - Validar unicidade ao atualizar email/matrícula
  - Implementar deleção com verificação de dependências
  - _Requirements: 9.6, 9.7_

- [ ] 8. Implementar Courses Service
  - Criar serviço completo de CRUD para cursos
  - Buscar estatísticas de cursos
  - Validar dependências antes de deletar
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 8.1 Criar estrutura do CoursesService
  - Criar arquivo `src/services/courses.service.ts`
  - Definir interface CourseWithStats
  - Criar classe CoursesService
  - _Requirements: 10.1_

- [ ] 8.2 Implementar getCourses() e getCoursesWithStats()
  - Buscar cursos da tabela courses
  - Usar view course_statistics para estatísticas
  - Incluir student_count, file_count, total_downloads
  - _Requirements: 10.1, 10.2, 10.6_

- [ ] 8.3 Implementar createCourse() e updateCourse()
  - Validar nome único antes de criar
  - Inserir curso com name e description
  - Atualizar course_name em usuários relacionados ao editar
  - _Requirements: 10.3, 10.4_

- [ ] 8.4 Implementar deleteCourse()
  - Verificar se há usuários vinculados ao curso
  - Verificar se há arquivos vinculados ao curso
  - Impedir deleção se houver dependências
  - _Requirements: 10.5_

- [ ] 9. Atualizar LoginPage para usar AuthService
  - Substituir lógica de autenticação mockada por AuthService
  - Adicionar loading state durante login
  - Exibir erros de autenticação em português
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 13.1, 13.2_

- [ ] 9.1 Integrar AuthService no LoginPage
  - Importar authService no componente
  - Substituir busca em MOCK_USERS por authService.login()
  - Adicionar estado de loading
  - Tratar erros com ErrorHandler
  - _Requirements: 2.1, 2.2, 2.4, 13.1, 13.2_

- [ ] 9.2 Melhorar UX do login
  - Desabilitar botão durante loading
  - Exibir spinner no botão
  - Mostrar mensagens de erro específicas
  - Limpar erro ao digitar novamente
  - _Requirements: 13.1, 13.2, 13.4_

- [x] 10. Atualizar Dashboard para usar DashboardService





  - Substituir dados mockados por DashboardService
  - Diferenciar entre AdminDashboard e StudentDashboard
  - Adicionar loading states e error handling
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 13.1, 13.2_


- [x] 10.1 Atualizar AdminDashboard

  - Usar dashboardService.getAdminStats() no useEffect
  - Usar dashboardService.getRecentFiles() para arquivos
  - Adicionar loading skeleton para estatísticas
  - Tratar erros com mensagens amigáveis
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 13.1_


- [x] 10.2 Atualizar StudentDashboard

  - Usar dashboardService.getStudentStats(userId) no useEffect
  - Usar dashboardService.getCourseFiles(courseName) para arquivos
  - Exibir user_files e user_downloads
  - Adicionar loading states
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 13.1_

- [ ] 11. Atualizar PublishFilePage para usar FilesService
  - Substituir lógica de publicação mockada por FilesService
  - Buscar courseId baseado no courseName do usuário
  - Adicionar loading state e error handling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 13.1, 13.2, 13.4_

- [ ] 11.1 Integrar FilesService no PublishFilePage
  - Importar filesService no componente
  - Buscar courseId do usuário ao montar componente
  - Substituir onAddFile por filesService.createFile()
  - Passar authorId, authorName, courseId, courseName
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 11.2 Melhorar UX da publicação
  - Adicionar loading state durante upload
  - Desabilitar botão e formulário durante loading
  - Exibir progresso se aplicável
  - Mostrar mensagem de sucesso antes de redirecionar
  - _Requirements: 6.6, 13.1, 13.4_

- [ ] 12. Atualizar ExplorePage para usar FilesService
  - Substituir filtros mockados por FilesService.getFiles()
  - Implementar filtros dinâmicos por curso, semestre e disciplina
  - Adicionar paginação
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 15.1_

- [ ] 12.1 Integrar FilesService no ExplorePage
  - Usar filesService.getFiles() com filtros da URL
  - Extrair courseName, semester, subject dos params
  - Implementar paginação com limit e offset
  - Adicionar loading state
  - _Requirements: 7.1, 7.2, 7.3, 7.5, 15.1_

- [ ] 12.2 Implementar visualização e download
  - Usar filesService.getFileById() para detalhes
  - Chamar filesService.registerDownload() ao baixar
  - Exibir file_content para arquivos de texto
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_


- [ ] 13. Atualizar ValidateEnrollmentsPage para usar EnrollmentsService
  - Substituir lógica mockada por EnrollmentsService
  - Implementar validação e rejeição com feedback
  - Atualizar lista após cada ação
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 13.1, 13.4_

- [ ] 13.1 Integrar EnrollmentsService
  - Usar enrollmentsService.getPendingEnrollments() no useEffect
  - Substituir handleValidate por enrollmentsService.validateEnrollment()
  - Substituir handleReject por enrollmentsService.rejectEnrollment()
  - Passar adminUserId ao validar
  - _Requirements: 5.1, 5.2, 5.6_

- [ ] 13.2 Melhorar UX da validação
  - Adicionar loading state durante validação/rejeição
  - Exibir toast de sucesso após ação
  - Atualizar lista automaticamente
  - Tratar erros com mensagens específicas
  - _Requirements: 5.7, 13.1, 13.4_

- [ ] 14. Atualizar UserManagementPage para usar UsersService
  - Substituir lógica mockada por UsersService
  - Implementar CRUD completo de usuários
  - Adicionar filtros e busca
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 13.1_

- [ ] 14.1 Integrar UsersService
  - Usar usersService.getUsers() com filtros
  - Implementar createUser() com validações
  - Implementar updateUser() e deleteUser()
  - Adicionar loading states
  - _Requirements: 9.1, 9.2, 9.3, 9.6_

- [ ] 14.2 Implementar filtros e busca
  - Filtrar por role (admin/student)
  - Filtrar por curso
  - Buscar por nome ou email
  - Debounce na busca (300ms)
  - _Requirements: 9.2, 15.3_

- [ ] 15. Atualizar AllCoursesPage para usar CoursesService
  - Substituir lógica mockada por CoursesService
  - Exibir estatísticas de cada curso
  - Implementar CRUD completo de cursos
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 13.1_

- [ ] 15.1 Integrar CoursesService
  - Usar coursesService.getCoursesWithStats() no useEffect
  - Exibir student_count, file_count, total_downloads
  - Implementar createCourse() e updateCourse()
  - Implementar deleteCourse() com validação
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 15.2 Melhorar UX do gerenciamento
  - Adicionar modal de confirmação para deleção
  - Exibir aviso se curso tiver dependências
  - Adicionar loading states
  - Validar nome único antes de salvar
  - _Requirements: 10.5, 13.1, 13.4_

- [ ] 16. Atualizar MyFilesPage para usar FilesService
  - Filtrar arquivos por authorId do usuário logado
  - Implementar edição e deleção de próprios arquivos
  - Exibir estatísticas dos arquivos do usuário
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 16.1 Integrar FilesService no MyFilesPage
  - Usar filesService.getFiles({ authorId: currentUser.id })
  - Calcular estatísticas localmente (total files, total downloads)
  - Adicionar loading state
  - _Requirements: 11.1, 11.2, 11.5_

- [ ] 16.2 Implementar edição e deleção
  - Adicionar botões de editar e deletar em cada arquivo
  - Usar filesService.updateFile() para editar
  - Usar filesService.deleteFile() para deletar
  - Adicionar confirmação antes de deletar
  - _Requirements: 11.3, 11.4_

- [ ] 17. Atualizar SettingsPage para usar AuthService
  - Implementar atualização de perfil
  - Implementar mudança de senha
  - Validar dados antes de salvar
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 13.1_

- [ ] 17.1 Integrar AuthService no SettingsPage
  - Usar authService.updateProfile() para name e email
  - Usar authService.changePassword() para senha
  - Validar email único antes de atualizar
  - Atualizar estado do usuário logado após sucesso
  - _Requirements: 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 17.2 Melhorar UX das configurações
  - Adicionar loading state durante atualização
  - Exibir mensagem de sucesso
  - Validar campos no frontend antes de enviar
  - Confirmar senha atual antes de mudar
  - _Requirements: 12.1, 13.1, 13.4_

- [ ] 18. Implementar controle de acesso e segurança
  - Validar permissões antes de renderizar UI
  - Proteger rotas por role
  - Implementar validações de segurança
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [ ] 18.1 Implementar validação de permissões
  - Criar hook usePermissions para verificar role
  - Ocultar ações restritas para usuários sem permissão
  - Validar role antes de acessar rotas administrativas
  - Redirecionar usuários não autorizados
  - _Requirements: 14.2, 14.3, 14.4_

- [ ] 18.2 Implementar validações de segurança
  - Validar que usuários só editam próprios recursos
  - Sanitizar inputs antes de enviar ao backend
  - Implementar rate limiting no frontend (debounce)
  - Validar tipos de arquivo permitidos
  - _Requirements: 14.5, 14.6_

- [ ] 19. Implementar otimizações de performance
  - Adicionar caching para dados que mudam raramente
  - Implementar paginação em listagens grandes
  - Otimizar queries com índices e views
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 19.1 Implementar caching
  - Cachear lista de cursos (TTL 10 minutos)
  - Cachear estatísticas do dashboard (TTL 5 minutos)
  - Cachear arquivos recentes (TTL 1 minuto)
  - Implementar invalidação de cache ao criar/atualizar
  - _Requirements: 15.3_

- [ ] 19.2 Implementar paginação
  - Adicionar paginação em listagens de arquivos (50 por página)
  - Adicionar paginação em listagem de usuários (50 por página)
  - Implementar scroll infinito ou botões de navegação
  - Usar offset/limit nas queries
  - _Requirements: 15.1_

- [ ] 20. Polimento final e testes
  - Revisar todas as mensagens de erro em português
  - Adicionar loading states faltantes
  - Testar fluxos completos
  - Documentar uso e deployment
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 20.1 Revisar mensagens e UX
  - Garantir que todas as mensagens estão em português
  - Verificar que todos os loading states estão implementados
  - Testar feedback visual de sucesso e erro
  - Verificar acessibilidade (labels, aria-*)
  - _Requirements: 13.2, 13.4_

- [ ] 20.2 Testes de integração
  - Testar fluxo: Login → Dashboard → Logout
  - Testar fluxo: Publicar arquivo → Visualizar → Download
  - Testar fluxo: Validar matrícula → Novo usuário
  - Testar fluxo: Criar curso → Associar usuário → Publicar arquivo
  - _Requirements: Todos_

- [ ] 20.3 Documentação
  - Criar README com instruções de setup
  - Documentar variáveis de ambiente necessárias
  - Documentar processo de deployment
  - Criar guia de uso para admins e estudantes
  - _Requirements: Deployment_
