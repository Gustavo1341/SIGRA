import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  ChevronRightIcon,
  SearchIcon,
  UsersIcon,
  CloudArrowUpIcon,
  CheckBadgeIcon,
  CogIcon,
  BellIcon,
  DocumentTextIcon,
  DownloadIcon,
  FolderIcon,
  HomeIcon
} from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
}

interface GuideContent {
  title: string;
  sections: Array<{
    subtitle: string;
    content: React.ReactNode;
  }>;
}

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const isAdmin = currentUser?.role === Role.Admin;

  // Seções do guia
  const guideSections: GuideSection[] = [
    {
      id: 'overview',
      title: 'Visão Geral',
      icon: <HomeIcon className="w-6 h-6" />,
      description: 'Introdução ao SIGRA e seus recursos principais',
      color: 'text-brand-blue-600',
      bgColor: 'bg-brand-blue-50',
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <HomeIcon className="w-6 h-6" />,
      description: 'Como usar o painel principal',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    ...(isAdmin ? [{
      id: 'validate',
      title: 'Validar Matrículas',
      icon: <CheckBadgeIcon className="w-6 h-6" />,
      description: 'Aprovar ou rejeitar solicitações de matrícula',
      color: 'text-brand-warning-600',
      bgColor: 'bg-brand-warning-50',
    },
    {
      id: 'users',
      title: 'Gestão de Usuários',
      icon: <UsersIcon className="w-6 h-6" />,
      description: 'Adicionar, editar e gerenciar usuários',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    }] : [{
      id: 'publish',
      title: 'Publicar Arquivos',
      icon: <CloudArrowUpIcon className="w-6 h-6" />,
      description: 'Como publicar trabalhos acadêmicos',
      color: 'text-brand-success-600',
      bgColor: 'bg-brand-success-50',
    },
    {
      id: 'myfiles',
      title: 'Meus Arquivos',
      icon: <FolderIcon className="w-6 h-6" />,
      description: 'Visualizar e gerenciar seus arquivos',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    }]),
    {
      id: 'explore',
      title: 'Explorar Repositório',
      icon: <BookOpenIcon className="w-6 h-6" />,
      description: 'Navegue por cursos, semestres e disciplinas',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: <BellIcon className="w-6 h-6" />,
      description: 'Sistema de notificações e alertas',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: <CogIcon className="w-6 h-6" />,
      description: 'Personalize sua conta e preferências',
      color: 'text-brand-gray-600',
      bgColor: 'bg-brand-gray-50',
    },
  ];

  // Conteúdo detalhado de cada seção
  const guideDetails: Record<string, GuideContent> = {
    overview: {
      title: 'Visão Geral do SIGRA',
      sections: [
        {
          subtitle: 'O que é o SIGRA?',
          content: (
            <div className="space-y-4">
              <p className="text-brand-gray-700">
                O <strong>SIGRA (Sistema de Repositório Acadêmico)</strong> é uma plataforma desenvolvida para facilitar
                o compartilhamento e organização de trabalhos acadêmicos entre estudantes e professores.
              </p>
              <div className="bg-brand-blue-50 border-l-4 border-brand-blue-500 p-4 rounded">
                <p className="text-brand-blue-700 font-semibold mb-2">Principais Funcionalidades:</p>
                <ul className="space-y-2 text-brand-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue-500 mt-1">•</span>
                    <span>Publicação de trabalhos acadêmicos (TCCs, relatórios, projetos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue-500 mt-1">•</span>
                    <span>Navegação organizada por curso, semestre e disciplina</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue-500 mt-1">•</span>
                    <span>Sistema de notificações em tempo real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue-500 mt-1">•</span>
                    <span>Download e visualização de arquivos</span>
                  </li>
                  {isAdmin && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-blue-500 mt-1">•</span>
                        <span>Gestão completa de usuários e matrículas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-blue-500 mt-1">•</span>
                        <span>Estatísticas e métricas do sistema</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ),
        },
        {
          subtitle: 'Navegação no Sistema',
          content: (
            <div className="space-y-4">
              <p className="text-brand-gray-700">
                A interface do SIGRA foi projetada para ser intuitiva e fácil de usar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-brand-blue-100 rounded-lg">
                      <HomeIcon className="w-5 h-5 text-brand-blue-600" />
                    </div>
                    <h4 className="font-semibold text-brand-gray-800">Sidebar</h4>
                  </div>
                  <p className="text-sm text-brand-gray-600">
                    Menu lateral com acesso rápido a todas as funcionalidades do sistema.
                  </p>
                </div>
                <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-brand-blue-100 rounded-lg">
                      <BellIcon className="w-5 h-5 text-brand-blue-600" />
                    </div>
                    <h4 className="font-semibold text-brand-gray-800">Header</h4>
                  </div>
                  <p className="text-sm text-brand-gray-600">
                    Barra superior com notificações e acesso rápido ao menu.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    dashboard: {
      title: 'Dashboard',
      sections: [
        {
          subtitle: isAdmin ? 'Painel Administrativo' : 'Seu Painel Pessoal',
          content: (
            <div className="space-y-4">
              <p className="text-brand-gray-700">
                {isAdmin
                  ? 'O dashboard administrativo oferece uma visão geral completa do sistema com estatísticas importantes:'
                  : 'Seu dashboard pessoal mostra informações relevantes sobre sua atividade acadêmica:'
                }
              </p>
              <div className="bg-gradient-to-r from-brand-gray-50 to-white border border-brand-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-brand-gray-800 mb-3">Informações Disponíveis:</h4>
                <ul className="space-y-2">
                  {isAdmin ? (
                    <>
                      <li className="flex items-start gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-brand-gray-700"><strong>Total de Arquivos:</strong> Quantidade total de arquivos no sistema</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <UsersIcon className="w-5 h-5 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-brand-gray-700"><strong>Usuários Ativos:</strong> Número de usuários registrados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DownloadIcon className="w-5 h-5 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-brand-gray-700"><strong>Downloads Totais:</strong> Quantidade de downloads realizados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckBadgeIcon className="w-5 h-5 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-brand-gray-700"><strong>Validações Pendentes:</strong> Matrículas aguardando aprovação</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <FolderIcon className="w-5 h-5 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-brand-gray-700"><strong>Meus Arquivos:</strong> Total de arquivos que você publicou</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DownloadIcon className="w-5 h-5 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-brand-gray-700"><strong>Downloads:</strong> Quantas vezes seus arquivos foram baixados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <BookOpenIcon className="w-5 h-5 text-brand-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-brand-gray-700"><strong>Repositório:</strong> Total de arquivos do seu curso</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Dica:</strong> O dashboard é atualizado automaticamente. Os arquivos recentes mostram
                  {isAdmin ? ' as últimas publicações de todos os usuários.' : ' a atividade recente do seu curso.'}
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    ...(isAdmin ? {
      validate: {
        title: 'Validar Matrículas',
        sections: [
          {
            subtitle: 'Como Validar Matrículas',
            content: (
              <div className="space-y-4">
                <p className="text-brand-gray-700">
                  A página de validação de matrículas permite aprovar ou rejeitar solicitações de novos alunos:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white border border-brand-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-brand-blue-100 rounded-full flex items-center justify-center text-brand-blue-600 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-gray-800 mb-1">Acessar Validações</h4>
                      <p className="text-sm text-brand-gray-600">
                        Clique em "Validar Matrículas" na sidebar. O badge mostra quantas matrículas estão pendentes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white border border-brand-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-brand-blue-100 rounded-full flex items-center justify-center text-brand-blue-600 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-gray-800 mb-1">Revisar Solicitação</h4>
                      <p className="text-sm text-brand-gray-600">
                        Clique em "Revisar" em qualquer matrícula para ver os detalhes do aluno (nome, email, matrícula, curso).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white border border-brand-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-brand-blue-100 rounded-full flex items-center justify-center text-brand-blue-600 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-gray-800 mb-1">Aprovar ou Rejeitar</h4>
                      <p className="text-sm text-brand-gray-600">
                        Após revisar, clique em "Validar" para aprovar ou "Rejeitar" para negar a matrícula.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Importante:</strong> Ao validar uma matrícula, o aluno receberá permissão para fazer login
                    e acessar o sistema imediatamente.
                  </p>
                </div>
              </div>
            ),
          },
        ],
      },
      users: {
        title: 'Gestão de Usuários',
        sections: [
          {
            subtitle: 'Gerenciar Usuários',
            content: (
              <div className="space-y-4">
                <p className="text-brand-gray-700">
                  A gestão de usuários permite controle total sobre os usuários do sistema:
                </p>
                <div className="space-y-4">
                  <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-brand-gray-800 mb-3 flex items-center gap-2">
                      <UsersIcon className="w-5 h-5 text-brand-blue-500" />
                      Adicionar Novo Usuário
                    </h4>
                    <ol className="space-y-2 ml-6 text-sm text-brand-gray-700">
                      <li>1. Clique no botão "Adicionar Usuário"</li>
                      <li>2. Preencha: Nome, Email, Matrícula, Curso e Senha</li>
                      <li>3. Selecione o tipo (Administrador ou Aluno)</li>
                      <li>4. Clique em "Salvar"</li>
                    </ol>
                  </div>

                  <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-brand-gray-800 mb-3 flex items-center gap-2">
                      <SearchIcon className="w-5 h-5 text-brand-blue-500" />
                      Filtros de Busca
                    </h4>
                    <p className="text-sm text-brand-gray-700 mb-2">Use os filtros para encontrar usuários rapidamente:</p>
                    <ul className="space-y-1 ml-4 text-sm text-brand-gray-600">
                      <li>• <strong>Buscar:</strong> Nome ou email do usuário</li>
                      <li>• <strong>Tipo:</strong> Filtrar por Admin ou Aluno</li>
                      <li>• <strong>Curso:</strong> Filtrar por curso específico</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-brand-gray-800 mb-3">Seleção em Massa</h4>
                    <p className="text-sm text-brand-gray-700">
                      Você pode selecionar vários usuários marcando as caixas de seleção e depois clicar em
                      "Excluir Selecionados" para deletar múltiplos usuários de uma vez.
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm text-red-800">
                    <strong>Atenção:</strong> A exclusão de usuários é permanente e não pode ser desfeita.
                    Você não pode deletar sua própria conta.
                  </p>
                </div>
              </div>
            ),
          },
        ],
      },
    } : {
      publish: {
        title: 'Publicar Arquivos',
        sections: [
          {
            subtitle: 'Como Publicar um Trabalho',
            content: (
              <div className="space-y-4">
                <p className="text-brand-gray-700">
                  Publicar seus trabalhos acadêmicos é simples e rápido:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white border border-brand-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-gray-800 mb-1">Selecionar Arquivo</h4>
                      <p className="text-sm text-brand-gray-600">
                        Arraste e solte ou clique para selecionar o arquivo do seu trabalho.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white border border-brand-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-gray-800 mb-1">Preencher Informações</h4>
                      <p className="text-sm text-brand-gray-600">
                        Adicione: Título do trabalho, Semestre (ex: 2024.1) e Disciplina.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white border border-brand-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-gray-800 mb-1">Publicar</h4>
                      <p className="text-sm text-brand-gray-600">
                        Clique em "Publicar Arquivo". Seu trabalho ficará disponível para todos do seu curso.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> O curso e autor são preenchidos automaticamente com base no seu perfil.
                    O semestre atual é selecionado por padrão.
                  </p>
                </div>
              </div>
            ),
          },
        ],
      },
      myfiles: {
        title: 'Meus Arquivos',
        sections: [
          {
            subtitle: 'Gerenciar Seus Trabalhos',
            content: (
              <div className="space-y-4">
                <p className="text-brand-gray-700">
                  Na página "Meus Arquivos" você pode visualizar todos os trabalhos que publicou:
                </p>
                <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-brand-gray-800 mb-3">Informações Disponíveis</h4>
                  <ul className="space-y-2 text-sm text-brand-gray-700">
                    <li className="flex items-start gap-2">
                      <DocumentTextIcon className="w-4 h-4 text-brand-blue-500 mt-1 flex-shrink-0" />
                      <span><strong>Título:</strong> Nome do seu trabalho</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DocumentTextIcon className="w-4 h-4 text-brand-blue-500 mt-1 flex-shrink-0" />
                      <span><strong>Disciplina:</strong> Matéria relacionada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DocumentTextIcon className="w-4 h-4 text-brand-blue-500 mt-1 flex-shrink-0" />
                      <span><strong>Semestre:</strong> Período de publicação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DownloadIcon className="w-4 h-4 text-brand-blue-500 mt-1 flex-shrink-0" />
                      <span><strong>Downloads:</strong> Quantas vezes foi baixado</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <p className="text-sm text-purple-800">
                    <strong>Nota:</strong> Você pode clicar em qualquer arquivo para visualizar seus detalhes completos
                    e fazer download.
                  </p>
                </div>
              </div>
            ),
          },
        ],
      },
    }),
    explore: {
      title: 'Explorar Repositório',
      sections: [
        {
          subtitle: 'Navegação por Hierarquia',
          content: (
            <div className="space-y-4">
              <p className="text-brand-gray-700">
                O repositório é organizado em três níveis hierárquicos:
              </p>
              <div className="space-y-3">
                <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-brand-blue-100 rounded-lg">
                      <BookOpenIcon className="w-5 h-5 text-brand-blue-600" />
                    </div>
                    <h4 className="font-semibold text-brand-gray-800">1. Curso</h4>
                  </div>
                  <p className="text-sm text-brand-gray-600 ml-11">
                    Primeiro nível: escolha o curso que deseja explorar (ex: Ciência da Computação, Engenharia).
                  </p>
                </div>
                <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FolderIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-brand-gray-800">2. Semestre</h4>
                  </div>
                  <p className="text-sm text-brand-gray-600 ml-11">
                    Segundo nível: selecione o período (ex: 2024.1, 2024.2).
                  </p>
                </div>
                <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-brand-gray-800">3. Disciplina</h4>
                  </div>
                  <p className="text-sm text-brand-gray-600 ml-11">
                    Terceiro nível: escolha a matéria e visualize todos os arquivos disponíveis.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          subtitle: 'Download de Arquivos',
          content: (
            <div className="space-y-4">
              <p className="text-brand-gray-700">
                Para baixar um arquivo:
              </p>
              <ol className="space-y-2 ml-6 text-brand-gray-700">
                <li>1. Navegue até a disciplina desejada</li>
                <li>2. Encontre o arquivo que deseja</li>
                <li>3. Clique no ícone de download <DownloadIcon className="w-4 h-4 inline text-brand-blue-500" /> ao lado do arquivo</li>
                <li>4. O download começará automaticamente</li>
              </ol>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-green-800">
                  <strong>Dica:</strong> Você também pode clicar no nome do arquivo para visualizar detalhes
                  completos antes de baixar.
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    notifications: {
      title: 'Sistema de Notificações',
      sections: [
        {
          subtitle: 'Como Usar as Notificações',
          content: (
            <div className="space-y-4">
              <p className="text-brand-gray-700">
                O sistema de notificações mantém você informado sobre atividades importantes:
              </p>
              <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-brand-gray-800 mb-3 flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-brand-blue-500" />
                  Acessar Notificações
                </h4>
                <p className="text-sm text-brand-gray-700 mb-3">
                  Clique no ícone de sino <BellIcon className="w-4 h-4 inline text-brand-gray-500" /> no canto superior
                  direito para abrir o painel de notificações.
                </p>
                <ul className="space-y-2 text-sm text-brand-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue-500 mt-1">•</span>
                    <span>Um badge vermelho mostra quantas notificações não lidas você tem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue-500 mt-1">•</span>
                    <span>Clique em "Marcar todas como lidas" para limpar todas de uma vez</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue-500 mt-1">•</span>
                    <span>Você pode deletar notificações individualmente</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-brand-gray-800 mb-3">Tipos de Notificações</h4>
                <div className="space-y-2 text-sm text-brand-gray-700">
                  <div className="flex items-start gap-3 p-2 bg-brand-blue-50 rounded">
                    <span className="font-semibold text-brand-blue-600">Info:</span>
                    <span>Informações gerais do sistema</span>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-green-50 rounded">
                    <span className="font-semibold text-green-700">Sucesso:</span>
                    <span>Ações concluídas com êxito</span>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded">
                    <span className="font-semibold text-yellow-700">Aviso:</span>
                    <span>Alertas que precisam de atenção</span>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-red-50 rounded">
                    <span className="font-semibold text-red-700">Erro:</span>
                    <span>Problemas que precisam ser resolvidos</span>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    settings: {
      title: 'Configurações',
      sections: [
        {
          subtitle: 'Personalizar Seu Perfil',
          content: (
            <div className="space-y-4">
              <p className="text-brand-gray-700">
                Na página de configurações você pode gerenciar suas informações pessoais e preferências:
              </p>
              <div className="space-y-3">
                <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-brand-gray-800 mb-2">Perfil</h4>
                  <ul className="space-y-1 ml-4 text-sm text-brand-gray-700">
                    <li>• Atualizar nome e email</li>
                    <li>• Adicionar biografia (opcional)</li>
                    <li>• Visualizar avatar gerado automaticamente</li>
                  </ul>
                </div>
                <div className="bg-white border border-brand-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-brand-gray-800 mb-2">Segurança</h4>
                  <ul className="space-y-1 ml-4 text-sm text-brand-gray-700">
                    <li>• Alterar senha da conta</li>
                    <li>• Indicador de força da senha</li>
                    <li>• Requisitos mínimos de segurança</li>
                  </ul>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Não esqueça de clicar em "Salvar Alterações" após modificar
                  qualquer configuração!
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const filteredSections = guideSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-brand-blue-100 rounded-xl">
            <BookOpenIcon className="w-8 h-8 text-brand-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-gray-800">
              Central de Ajuda
            </h1>
            <p className="text-brand-gray-500 text-lg">
              Guia completo para usar o SIGRA
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 animate-fadeIn">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-gray-400" />
          <input
            type="text"
            placeholder="Buscar na central de ajuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-brand-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent shadow-sm text-brand-gray-800 placeholder-brand-gray-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Sections List */}
        <div className="lg:col-span-1 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-brand-gray-200 p-4 sticky top-6">
            <h2 className="text-lg font-bold text-brand-gray-800 mb-4">Tópicos</h2>
            <div className="space-y-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    selectedSection === section.id
                      ? `${section.bgColor} border-2 border-current ${section.color}`
                      : 'hover:bg-brand-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`flex-shrink-0 ${selectedSection === section.id ? section.color : 'text-brand-gray-400'}`}>
                    {section.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-sm ${selectedSection === section.id ? section.color : 'text-brand-gray-700'}`}>
                      {section.title}
                    </p>
                  </div>
                  {selectedSection === section.id && (
                    <ChevronRightIcon className={`w-5 h-5 flex-shrink-0 ${section.color}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 animate-fadeIn">
          {selectedSection ? (
            <div className="bg-white rounded-2xl border border-brand-gray-200 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-gray-800 mb-6">
                {guideDetails[selectedSection]?.title}
              </h2>
              <div className="space-y-8">
                {guideDetails[selectedSection]?.sections.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-xl font-semibold text-brand-gray-800 border-b border-brand-gray-200 pb-2">
                      {section.subtitle}
                    </h3>
                    <div className="prose prose-brand max-w-none">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-brand-blue-50 to-white rounded-2xl border border-brand-blue-200 p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-brand-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpenIcon className="w-10 h-10 text-brand-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-brand-gray-800 mb-3">
                  Bem-vindo à Central de Ajuda!
                </h2>
                <p className="text-brand-gray-600 mb-6">
                  Selecione um tópico ao lado para começar a explorar o guia do SIGRA.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-4 border border-brand-gray-200">
                    <p className="font-semibold text-brand-gray-800">
                      {filteredSections.length}
                    </p>
                    <p className="text-brand-gray-500">Tópicos Disponíveis</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-brand-gray-200">
                    <p className="font-semibold text-brand-gray-800">
                      {isAdmin ? 'Admin' : 'Aluno'}
                    </p>
                    <p className="text-brand-gray-500">Seu Perfil</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-brand-blue-500 to-indigo-600 rounded-2xl p-6 md:p-8 text-white animate-fadeIn">
        <h3 className="text-2xl font-bold mb-4">Precisa de Mais Ajuda?</h3>
        <p className="mb-6 opacity-90">
          Se você ainda tiver dúvidas após consultar este guia, entre em contato com o suporte técnico.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/settings')}
            className="px-6 py-3 bg-white text-brand-blue-600 rounded-lg font-semibold hover:bg-brand-blue-50 transition-colors"
          >
            Ir para Configurações
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-brand-blue-600 text-white rounded-lg font-semibold hover:bg-brand-blue-700 border-2 border-white transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
