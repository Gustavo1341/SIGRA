import React, { useState } from 'react';
import { FileText, Database, Users, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

interface UseCaseProps {
  title: string;
  actors: string[];
  preconditions: string[];
  mainFlow: string[];
  alternativeFlows: { name: string; steps: string[] }[];
  postconditions: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const UseCase: React.FC<UseCaseProps> = ({
  title, actors, preconditions, mainFlow, alternativeFlows, postconditions, isOpen, onToggle
}) => (
  <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
    >
      <span className="font-semibold text-gray-800">{title}</span>
      {isOpen ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
    </button>
    {isOpen && (
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Atores:</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {actors.map((actor, i) => <li key={i}>{actor}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Pré-condições:</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {preconditions.map((pre, i) => <li key={i}>{pre}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Fluxo Principal:</h4>
          <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
            {mainFlow.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
        {alternativeFlows.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Fluxos Alternativos:</h4>
            {alternativeFlows.map((flow, i) => (
              <div key={i} className="ml-4 mb-2">
                <p className="text-sm font-medium text-gray-600">{flow.name}:</p>
                <ol className="list-decimal list-inside text-gray-600 text-sm ml-2">
                  {flow.steps.map((step, j) => <li key={j}>{step}</li>)}
                </ol>
              </div>
            ))}
          </div>
        )}
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Pós-condições:</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {postconditions.map((post, i) => <li key={i}>{post}</li>)}
          </ul>
        </div>
      </div>
    )}
  </div>
);

const DocumentationPage: React.FC = () => {
  const [openUseCases, setOpenUseCases] = useState<Record<string, boolean>>({
    'UC01': true, 'UC02': false, 'UC03': false, 'UC04': false, 'UC05': false,
    'UC06': false, 'UC07': false, 'UC08': false, 'UC09': false, 'UC10': false
  });

  const toggleUseCase = (id: string) => {
    setOpenUseCases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const useCases = [
    {
      id: 'UC01',
      title: 'UC01 - Realizar Login',
      actors: ['Estudante', 'Administrador'],
      preconditions: ['Usuário possui conta cadastrada e validada no sistema', 'Sistema está disponível'],
      mainFlow: [
        'Usuário acessa a página de login',
        'Sistema exibe formulário com campos email e senha',
        'Usuário preenche email e senha',
        'Usuário clica no botão "Entrar"',
        'Sistema valida credenciais via função authenticate_user',
        'Sistema redireciona para o Dashboard'
      ],
      alternativeFlows: [
        { name: 'FA01 - Credenciais Inválidas', steps: ['Sistema exibe mensagem "Email ou senha incorretos"', 'Usuário permanece na tela de login'] },
        { name: 'FA02 - Esqueceu Senha', steps: ['Usuário clica em "Esqueci minha senha"', 'Sistema redireciona para recuperação de senha'] }
      ],
      postconditions: ['Usuário autenticado', 'Sessão iniciada', 'last_login atualizado no banco']
    },
    {
      id: 'UC02',
      title: 'UC02 - Solicitar Acesso (Registro)',
      actors: ['Visitante (futuro Estudante)'],
      preconditions: ['Usuário não possui conta no sistema', 'Email não está cadastrado'],
      mainFlow: [
        'Visitante acessa página de registro',
        'Sistema exibe formulário com campos: nome, email, matrícula, curso, senha',
        'Visitante preenche todos os campos',
        'Sistema valida se email já existe em users e enrollments',
        'Sistema cria registro na tabela enrollments com status "pending"',
        'Sistema exibe mensagem de sucesso',
        'Sistema redireciona para login após 3 segundos'
      ],
      alternativeFlows: [
        { name: 'FA01 - Email já cadastrado', steps: ['Sistema exibe "Este email já está cadastrado"', 'Usuário corrige o email'] },
        { name: 'FA02 - Senhas não coincidem', steps: ['Sistema exibe "As senhas não coincidem"', 'Usuário corrige as senhas'] }
      ],
      postconditions: ['Solicitação criada na tabela enrollments', 'Status = pending', 'Aguardando validação do admin']
    },
    {
      id: 'UC03',
      title: 'UC03 - Validar Matrícula',
      actors: ['Administrador'],
      preconditions: ['Admin autenticado', 'Existem matrículas pendentes'],
      mainFlow: [
        'Admin acessa "Validar Matrículas" no menu',
        'Sistema lista matrículas com status "pending"',
        'Admin visualiza dados do solicitante',
        'Admin clica em "Aprovar"',
        'Sistema executa função validate_enrollment',
        'Sistema cria usuário na tabela users',
        'Sistema atualiza enrollment para "validated"',
        'Sistema cria notificação para o novo usuário'
      ],
      alternativeFlows: [
        { name: 'FA01 - Rejeitar Matrícula', steps: ['Admin clica em "Rejeitar"', 'Sistema executa reject_enrollment', 'Status atualizado para "rejected"'] }
      ],
      postconditions: ['Novo usuário criado (se aprovado)', 'Enrollment atualizado', 'Notificação enviada']
    },
    {
      id: 'UC04',
      title: 'UC04 - Publicar Arquivo Acadêmico',
      actors: ['Estudante'],
      preconditions: ['Estudante autenticado', 'Estudante possui curso associado'],
      mainFlow: [
        'Estudante acessa "Publicar Arquivo"',
        'Sistema exibe formulário com: título, semestre, disciplina, descrição, arquivo',
        'Estudante preenche campos e seleciona arquivo',
        'Sistema valida tipo (PDF, DOC, etc.) e tamanho (máx 10MB)',
        'Sistema sanitiza conteúdo removendo caracteres inválidos',
        'Sistema insere registro em academic_files',
        'Sistema invalida caches relacionados',
        'Sistema exibe confirmação de sucesso'
      ],
      alternativeFlows: [
        { name: 'FA01 - Arquivo muito grande', steps: ['Sistema exibe "Arquivo muito grande. Máximo: 10MB"', 'Upload cancelado'] },
        { name: 'FA02 - Tipo não permitido', steps: ['Sistema exibe "Tipo de arquivo não permitido"', 'Upload cancelado'] }
      ],
      postconditions: ['Arquivo salvo em academic_files', 'downloads = 0', 'Cache invalidado']
    },
    {
      id: 'UC05',
      title: 'UC05 - Explorar Arquivos',
      actors: ['Estudante', 'Administrador'],
      preconditions: ['Usuário autenticado'],
      mainFlow: [
        'Usuário acessa "Todos os Cursos"',
        'Sistema lista cursos disponíveis',
        'Usuário seleciona um curso',
        'Sistema exibe semestres disponíveis',
        'Usuário seleciona semestre',
        'Sistema exibe disciplinas',
        'Usuário seleciona disciplina',
        'Sistema lista arquivos filtrados via get_files_by_filters'
      ],
      alternativeFlows: [
        { name: 'FA01 - Sem arquivos', steps: ['Sistema exibe "Nenhum arquivo encontrado"', 'Usuário pode voltar e escolher outro filtro'] }
      ],
      postconditions: ['Lista de arquivos exibida conforme filtros']
    },
    {
      id: 'UC06',
      title: 'UC06 - Fazer Download de Arquivo',
      actors: ['Estudante', 'Administrador'],
      preconditions: ['Usuário autenticado', 'Arquivo existe no sistema'],
      mainFlow: [
        'Usuário visualiza detalhes do arquivo',
        'Usuário clica em "Download"',
        'Sistema executa register_file_download',
        'Sistema registra em file_downloads (user_id, ip_address)',
        'Trigger incrementa contador de downloads',
        'Sistema inicia download do arquivo',
        'Cache de estatísticas invalidado'
      ],
      alternativeFlows: [
        { name: 'FA01 - Arquivo não encontrado', steps: ['Sistema exibe "Arquivo não encontrado"', 'Download cancelado'] }
      ],
      postconditions: ['Download registrado', 'Contador incrementado', 'Arquivo baixado pelo usuário']
    },
    {
      id: 'UC07',
      title: 'UC07 - Gerenciar Meus Arquivos',
      actors: ['Estudante'],
      preconditions: ['Estudante autenticado', 'Estudante possui arquivos publicados'],
      mainFlow: [
        'Estudante acessa "Meus Arquivos"',
        'Sistema lista arquivos onde author_id = user.id',
        'Estudante pode visualizar, editar ou excluir',
        'Para editar: Sistema valida ownership antes de permitir',
        'Para excluir: Sistema solicita confirmação',
        'Sistema executa operação e invalida caches'
      ],
      alternativeFlows: [
        { name: 'FA01 - Sem arquivos', steps: ['Sistema exibe "Você ainda não publicou arquivos"', 'Link para publicar novo arquivo'] },
        { name: 'FA02 - Sem permissão', steps: ['Sistema exibe "Você não tem permissão"', 'Operação cancelada'] }
      ],
      postconditions: ['Arquivo atualizado/excluído', 'Cache invalidado']
    },
    {
      id: 'UC08',
      title: 'UC08 - Gerenciar Usuários',
      actors: ['Administrador'],
      preconditions: ['Admin autenticado'],
      mainFlow: [
        'Admin acessa "Gerenciar Usuários"',
        'Sistema lista todos os usuários',
        'Admin pode filtrar por role, curso, status',
        'Admin pode editar dados do usuário',
        'Admin pode desativar/reativar usuário',
        'Sistema atualiza registro em users'
      ],
      alternativeFlows: [
        { name: 'FA01 - Email duplicado', steps: ['Sistema exibe "Email já em uso"', 'Edição cancelada'] }
      ],
      postconditions: ['Usuário atualizado no banco']
    },
    {
      id: 'UC09',
      title: 'UC09 - Alterar Senha',
      actors: ['Estudante', 'Administrador'],
      preconditions: ['Usuário autenticado'],
      mainFlow: [
        'Usuário acessa "Configurações"',
        'Usuário preenche senha atual e nova senha',
        'Sistema valida senha atual via change_user_password',
        'Sistema gera hash bcrypt da nova senha',
        'Sistema atualiza password_hash em users',
        'Sistema exibe confirmação de sucesso'
      ],
      alternativeFlows: [
        { name: 'FA01 - Senha atual incorreta', steps: ['Sistema exibe "Senha atual incorreta"', 'Alteração cancelada'] },
        { name: 'FA02 - Senha fraca', steps: ['Sistema exibe requisitos de senha forte', 'Usuário corrige'] }
      ],
      postconditions: ['Senha atualizada com hash bcrypt']
    },
    {
      id: 'UC10',
      title: 'UC10 - Recuperar Senha',
      actors: ['Visitante'],
      preconditions: ['Email cadastrado no sistema'],
      mainFlow: [
        'Usuário acessa "Esqueci minha senha"',
        'Sistema exibe campo para email',
        'Usuário informa email cadastrado',
        'Sistema verifica se email existe',
        'Sistema envia email via EmailJS com link de recuperação',
        'Usuário acessa link e define nova senha',
        'Sistema atualiza password_hash'
      ],
      alternativeFlows: [
        { name: 'FA01 - Email não encontrado', steps: ['Sistema exibe mensagem genérica (segurança)', 'Não revela se email existe'] }
      ],
      postconditions: ['Nova senha definida', 'Usuário pode fazer login']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📋 Documentação do Sistema</h1>
        <p className="text-gray-600">Casos de Uso e Diagrama ER do SIGRA</p>
      </div>

      {/* Seção 2: Casos de Uso */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-brand-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">2. Casos de Uso</h2>
        </div>

        {/* Diagrama de Casos de Uso (ASCII Art) */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-800 mb-4">Diagrama de Casos de Uso</h3>
          <pre className="text-xs text-gray-700 font-mono whitespace-pre">
{`
                              ┌─────────────────────────────────────────────────────────────┐
                              │                         SIGRA                               │
                              │           Sistema de Gestão de Repositório Acadêmico        │
                              │                                                             │
    ┌──────────┐              │  ┌─────────────────┐    ┌─────────────────┐                │
    │          │              │  │  UC01: Login    │    │ UC02: Registro  │                │
    │ Visitante├──────────────┼──┤                 │    │                 │                │
    │          │              │  └────────┬────────┘    └────────┬────────┘                │
    └──────────┘              │           │                      │                         │
                              │           │    ┌─────────────────┘                         │
                              │           │    │                                           │
    ┌──────────┐              │  ┌────────▼────▼───┐    ┌─────────────────┐                │
    │          │              │  │ UC10: Recuperar │    │ UC04: Publicar  │                │
    │ Estudante├──────────────┼──┤     Senha       │    │    Arquivo      │                │
    │          │              │  └─────────────────┘    └────────┬────────┘                │
    └────┬─────┘              │                                  │                         │
         │                    │  ┌─────────────────┐    ┌────────▼────────┐                │
         │                    │  │ UC05: Explorar  │    │ UC06: Download  │                │
         │                    │  │    Arquivos     │◄───┤    Arquivo      │                │
         │                    │  └────────┬────────┘    └─────────────────┘                │
         │                    │           │                                                │
         │                    │  ┌────────▼────────┐    ┌─────────────────┐                │
         │                    │  │ UC07: Gerenciar │    │ UC09: Alterar   │                │
         └────────────────────┼──┤  Meus Arquivos  │    │     Senha       │                │
                              │  └─────────────────┘    └─────────────────┘                │
    ┌──────────┐              │                                                            │
    │          │              │  ┌─────────────────┐    ┌─────────────────┐                │
    │  Admin   ├──────────────┼──┤ UC03: Validar   │    │ UC08: Gerenciar │                │
    │          │              │  │   Matrícula     │    │    Usuários     │                │
    └──────────┘              │  └─────────────────┘    └─────────────────┘                │
                              │                                                             │
                              └─────────────────────────────────────────────────────────────┘
`}
          </pre>
        </div>

        {/* Descrição Detalhada dos Casos de Uso */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-blue-600" />
            Descrição Detalhada dos Casos de Uso
          </h3>
          
          {useCases.map(uc => (
            <UseCase
              key={uc.id}
              title={uc.title}
              actors={uc.actors}
              preconditions={uc.preconditions}
              mainFlow={uc.mainFlow}
              alternativeFlows={uc.alternativeFlows}
              postconditions={uc.postconditions}
              isOpen={openUseCases[uc.id]}
              onToggle={() => toggleUseCase(uc.id)}
            />
          ))}
        </div>
      </section>

      {/* Seção 3: Diagrama ER */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Database className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">3. Diagrama ER (Entidade-Relacionamento)</h2>
        </div>

        {/* Diagrama ER ASCII */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-800 mb-4">Modelo Entidade-Relacionamento</h3>
          <pre className="text-xs text-gray-700 font-mono whitespace-pre">
{`
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DIAGRAMA ER - SIGRA                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────┐                           ┌───────────────────────┐
    │       COURSES         │                           │        USERS          │
    ├───────────────────────┤                           ├───────────────────────┤
    │ PK id: BIGSERIAL      │                           │ PK id: BIGSERIAL      │
    │    name: VARCHAR(255) │◄──────────────────────────┤ FK course_id: BIGINT  │
    │    description: TEXT  │         pertence          │    name: VARCHAR(255) │
    │    created_at: TIMESTAMPTZ                        │    email: VARCHAR(255)│
    │    updated_at: TIMESTAMPTZ                        │    password_hash: TEXT│
    └───────────────────────┘                           │    role: VARCHAR(20)  │
              │                                         │    course_name: VARCHAR│
              │                                         │    avatar: VARCHAR(10)│
              │ oferece                                 │    matricula: VARCHAR │
              │                                         │    created_at: TIMESTAMPTZ
              ▼                                         │    last_login: TIMESTAMPTZ
    ┌───────────────────────┐                           └───────────┬───────────┘
    │    ENROLLMENTS        │                                       │
    ├───────────────────────┤                                       │ publica
    │ PK id: BIGSERIAL      │                                       │
    │    student_name: VARCHAR                                      ▼
    │    email: VARCHAR(255)│                           ┌───────────────────────┐
    │ FK course_id: BIGINT  │◄──────────────────────────│   ACADEMIC_FILES      │
    │    course_name: VARCHAR                           ├───────────────────────┤
    │    matricula: VARCHAR │                           │ PK id: BIGSERIAL      │
    │    status: VARCHAR(20)│                           │ FK author_id: BIGINT  │
    │    created_at: TIMESTAMPTZ                        │ FK course_id: BIGINT  │
    │ FK validated_by: BIGINT                           │    title: VARCHAR(500)│
    └───────────────────────┘                           │    author_name: VARCHAR│
                                                        │    course_name: VARCHAR│
                                                        │    semester: VARCHAR  │
    ┌───────────────────────┐                           │    subject: VARCHAR   │
    │   FILE_DOWNLOADS      │                           │    description: TEXT  │
    ├───────────────────────┤                           │    downloads: INTEGER │
    │ PK id: BIGSERIAL      │                           │    file_name: VARCHAR │
    │ FK file_id: BIGINT    │◄──────────────────────────│    file_type: VARCHAR │
    │ FK user_id: BIGINT    │         registra          │    file_content: TEXT │
    │    downloaded_at: TIMESTAMPTZ                     │    file_size: BIGINT  │
    │    ip_address: INET   │                           │    created_at: TIMESTAMPTZ
    └───────────────────────┘                           └───────────────────────┘
                                                                    │
                                                                    │
    ┌───────────────────────┐                           ┌───────────▼───────────┐
    │   NOTIFICATIONS       │                           │      AUDIT_LOG        │
    ├───────────────────────┤                           ├───────────────────────┤
    │ PK id: BIGSERIAL      │                           │ PK id: BIGSERIAL      │
    │ FK user_id: BIGINT    │                           │ FK user_id: BIGINT    │
    │    type: VARCHAR(50)  │                           │    action: VARCHAR    │
    │    title: VARCHAR(255)│                           │    entity_type: VARCHAR│
    │    message: TEXT      │                           │    entity_id: BIGINT  │
    │    read: BOOLEAN      │                           │    details: JSONB     │
    │    created_at: TIMESTAMPTZ                        │    ip_address: INET   │
    └───────────────────────┘                           │    created_at: TIMESTAMPTZ
                                                        └───────────────────────┘

    ┌───────────────────────┐
    │   SYSTEM_SETTINGS     │
    ├───────────────────────┤
    │ PK id: BIGSERIAL      │
    │    key: VARCHAR(100)  │
    │    value: TEXT        │
    │    description: TEXT  │
    │    updated_at: TIMESTAMPTZ
    │ FK updated_by: BIGINT │
    └───────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  LEGENDA:  PK = Primary Key  |  FK = Foreign Key  |  ◄─── = Relacionamento                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
`}
          </pre>
        </div>

        {/* Tabela de Entidades */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Descrição das Entidades
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Entidade</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Descrição</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Relacionamentos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">courses</td>
                  <td className="px-4 py-3 text-gray-600">Cursos oferecidos pela instituição</td>
                  <td className="px-4 py-3 text-gray-600">1:N com users, enrollments, academic_files</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">users</td>
                  <td className="px-4 py-3 text-gray-600">Usuários do sistema (admin/student)</td>
                  <td className="px-4 py-3 text-gray-600">N:1 com courses, 1:N com academic_files, notifications</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">enrollments</td>
                  <td className="px-4 py-3 text-gray-600">Solicitações de matrícula pendentes</td>
                  <td className="px-4 py-3 text-gray-600">N:1 com courses, N:1 com users (validated_by)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">academic_files</td>
                  <td className="px-4 py-3 text-gray-600">Arquivos acadêmicos publicados</td>
                  <td className="px-4 py-3 text-gray-600">N:1 com users, N:1 com courses, 1:N com file_downloads</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">file_downloads</td>
                  <td className="px-4 py-3 text-gray-600">Histórico de downloads para auditoria</td>
                  <td className="px-4 py-3 text-gray-600">N:1 com academic_files, N:1 com users</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">notifications</td>
                  <td className="px-4 py-3 text-gray-600">Notificações para usuários</td>
                  <td className="px-4 py-3 text-gray-600">N:1 com users</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">audit_log</td>
                  <td className="px-4 py-3 text-gray-600">Log de auditoria de ações</td>
                  <td className="px-4 py-3 text-gray-600">N:1 com users</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">system_settings</td>
                  <td className="px-4 py-3 text-gray-600">Configurações globais do sistema</td>
                  <td className="px-4 py-3 text-gray-600">N:1 com users (updated_by)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cardinalidades */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Cardinalidades Principais</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• <strong>courses → users:</strong> Um curso pode ter muitos usuários (1:N)</li>
            <li>• <strong>users → academic_files:</strong> Um usuário pode publicar muitos arquivos (1:N)</li>
            <li>• <strong>academic_files → file_downloads:</strong> Um arquivo pode ter muitos downloads (1:N)</li>
            <li>• <strong>users → notifications:</strong> Um usuário pode ter muitas notificações (1:N)</li>
            <li>• <strong>courses → enrollments:</strong> Um curso pode ter muitas solicitações (1:N)</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default DocumentationPage;
