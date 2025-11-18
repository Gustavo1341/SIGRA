import React, { useMemo, useState, useEffect } from 'react';
import { User, AcademicFile } from '../types';
import { DocumentDuplicateIcon, FolderIcon, FileIcon, UploadIcon, DownloadIcon, TrashIcon, EyeIcon, SearchIcon, FilterIcon, ChartBarIcon, CalendarIcon } from '../components/icons';
import { Link, useNavigate } from 'react-router-dom';
import { filesService } from '../services/files.service';
import { showNotification } from '../src/utils/notification';
import StatCard from '../components/StatCard';

interface MyFilesPageProps {
  currentUser: User;
  files: AcademicFile[];
}

type GroupedFiles = {
  [course: string]: {
    [semester: string]: {
      [subject: string]: AcademicFile[];
    };
  };
};

const MyFilesPage: React.FC<MyFilesPageProps> = ({ currentUser, files }) => {
  const navigate = useNavigate();
  const [userFilesFromDb, setUserFilesFromDb] = useState<AcademicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');

  // Buscar arquivos do usuário do Supabase
  useEffect(() => {
    const loadUserFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const filesData = await filesService.getFiles({ authorId: currentUser.id });
        setUserFilesFromDb(filesData);
      } catch (err) {
        console.error('Erro ao carregar arquivos:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar arquivos');
      } finally {
        setLoading(false);
      }
    };

    loadUserFiles();
  }, [currentUser.id]);

  // Combinar arquivos do Supabase com arquivos locais (fallback)
  const userFiles = useMemo(() => {
    if (userFilesFromDb.length > 0) {
      return userFilesFromDb.sort((a, b) => b.id - a.id);
    }
    // Fallback para arquivos locais se não houver no Supabase
    return files
      .filter(file => file.author === currentUser.name)
      .sort((a, b) => b.id - a.id);
  }, [userFilesFromDb, files, currentUser.name]);

  // Filtrar arquivos baseado na busca e semestre
  const filteredFiles = useMemo(() => {
    return userFiles.filter(file => {
      const matchesSearch = searchTerm === '' || 
        file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.lastUpdateMessage.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSemester = selectedSemester === 'all' || file.semester === selectedSemester;
      
      return matchesSearch && matchesSemester;
    });
  }, [userFiles, searchTerm, selectedSemester]);

  // Obter lista de semestres únicos
  const semesters = useMemo(() => {
    const uniqueSemesters = Array.from(new Set(userFiles.map(f => f.semester)));
    return uniqueSemesters.sort().reverse();
  }, [userFiles]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalDownloads = userFiles.reduce((sum, file) => sum + file.downloads, 0);
    const avgDownloads = userFiles.length > 0 ? Math.round(totalDownloads / userFiles.length) : 0;
    
    return {
      totalFiles: userFiles.length,
      totalDownloads,
      avgDownloads,
      recentFiles: userFiles.filter(f => {
        const uploadDate = new Date(f.createdAt || Date.now());
        const daysDiff = Math.floor((Date.now() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      }).length
    };
  }, [userFiles]);

  // FIX: Explicitly type `groupedFiles` to help `useMemo` with type inference.
  const groupedFiles: GroupedFiles = useMemo(() => {
    return filteredFiles.reduce<GroupedFiles>((acc, file) => {
      const { course, semester, subject } = file;
      if (!acc[course]) acc[course] = {};
      if (!acc[course][semester]) acc[course][semester] = {};
      if (!acc[course][semester][subject]) acc[course][semester][subject] = [];
      acc[course][semester][subject].push(file);
      return acc;
    }, {} as GroupedFiles);
  }, [filteredFiles]);

  const handleDownload = async (e: React.MouseEvent, file: AcademicFile) => {
    e.stopPropagation(); // Previne que o clique abra o arquivo
    
    try {
      // Buscar arquivo completo do Supabase para obter fileContent
      const fullFile = await filesService.getFileById(file.id);
      
      // Registrar download no Supabase
      await filesService.registerDownload(file.id, currentUser.id);
      
      // Tentar baixar o arquivo
      if (fullFile.fileContent && fullFile.fileName) {
        // Download de conteúdo inline
        const blob = new Blob([fullFile.fileContent], { type: fullFile.fileType || 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fullFile.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (fullFile.fileUrl) {
        // Download de URL externa
        const a = document.createElement('a');
        a.href = fullFile.fileUrl;
        a.download = fullFile.fileName || fullFile.title;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Arquivo não tem conteúdo disponível - criar arquivo de exemplo
        const exampleContent = `Título: ${fullFile.title}
Autor: ${fullFile.author}
Curso: ${fullFile.course}
Semestre: ${fullFile.semester}
Disciplina: ${fullFile.subject}
Mensagem: ${fullFile.lastUpdateMessage}

Este é um arquivo de exemplo do SIGRA.
O conteúdo original não está disponível no momento.`;
        
        const blob = new Blob([exampleContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fullFile.title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Download de arquivo de exemplo iniciado', 'info', 3000);
        
        // Atualizar contador local de downloads
        setUserFilesFromDb(prev => 
          prev.map(f => f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f)
        );
        return;
      }
      
      // Atualizar contador local de downloads
      setUserFilesFromDb(prev => 
        prev.map(f => f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f)
      );
      
      showNotification('Download iniciado com sucesso!', 'success', 3000);
    } catch (err) {
      console.error('Erro ao fazer download:', err);
      showNotification(
        err instanceof Error ? err.message : 'Erro ao fazer download. Tente novamente.',
        'error',
        5000
      );
    }
  };

  const handleDelete = async (e: React.MouseEvent, file: AcademicFile) => {
    e.stopPropagation(); // Previne que o clique abra o arquivo
    
    if (!confirm(`Tem certeza que deseja deletar "${file.title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setDeletingFileId(file.id);
      await filesService.deleteFile(file.id, currentUser.id);
      
      // Atualizar lista local removendo o arquivo deletado
      setUserFilesFromDb(prev => prev.filter(f => f.id !== file.id));
      
      // Mostrar notificação de sucesso
      showNotification('Arquivo deletado com sucesso!', 'error', 5000);
    } catch (err) {
      console.error('Erro ao deletar arquivo:', err);
      showNotification(
        err instanceof Error ? err.message : 'Erro ao deletar arquivo. Tente novamente.',
        'error',
        5000
      );
    } finally {
      setDeletingFileId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Meus Arquivos</h1>
          <p className="text-brand-gray-500 mt-1">Gerencie e visualize todos os seus trabalhos publicados.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-brand-gray-300">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-brand-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Meus Arquivos</h1>
          <p className="text-brand-gray-500 mt-1">Gerencie e visualize todos os seus trabalhos publicados.</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">Erro ao carregar arquivos</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Meus Arquivos</h1>
          <p className="text-brand-gray-500 mt-1">Gerencie e visualize todos os seus trabalhos publicados.</p>
        </div>
        <Link
          to="/publish-file"
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-all hover:shadow-lg"
        >
          <UploadIcon className="w-5 h-5" />
          Publicar Novo
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Arquivos"
          value={stats.totalFiles.toString()}
          icon={<DocumentDuplicateIcon className="w-6 h-6" />}
          trend={stats.recentFiles > 0 ? `+${stats.recentFiles} esta semana` : undefined}
          color="blue"
        />
        <StatCard
          title="Total de Downloads"
          value={stats.totalDownloads.toString()}
          icon={<DownloadIcon className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Média de Downloads"
          value={stats.avgDownloads.toString()}
          icon={<ChartBarIcon className="w-6 h-6" />}
          subtitle="por arquivo"
          color="purple"
        />
        <StatCard
          title="Arquivos Recentes"
          value={stats.recentFiles.toString()}
          icon={<CalendarIcon className="w-6 h-6" />}
          subtitle="últimos 7 dias"
          color="orange"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-brand-gray-300 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, disciplina ou mensagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-brand-gray-400" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2.5 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="all">Todos os Semestres</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-brand-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'grouped'
                  ? 'bg-white text-brand-blue-600 shadow-sm'
                  : 'text-brand-gray-600 hover:text-brand-gray-800'
              }`}
            >
              <FolderIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-brand-blue-600 shadow-sm'
                  : 'text-brand-gray-600 hover:text-brand-gray-800'
              }`}
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedSemester !== 'all') && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-brand-gray-600">Filtros ativos:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-blue-100 text-brand-blue-700 rounded-full text-sm">
                Busca: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-brand-blue-900">×</button>
              </span>
            )}
            {selectedSemester !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-blue-100 text-brand-blue-700 rounded-full text-sm">
                {selectedSemester}
                <button onClick={() => setSelectedSemester('all')} className="hover:text-brand-blue-900">×</button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSemester('all');
              }}
              className="text-sm text-brand-gray-600 hover:text-brand-gray-800 underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Files Display */}
      <div className="bg-white rounded-xl border border-brand-gray-300 shadow-sm overflow-hidden">
        {filteredFiles.length > 0 ? (
          viewMode === 'grouped' ? (
            /* Grouped View */
            <div className="p-6 space-y-6">
              {Object.entries(groupedFiles).map(([course, semesters]) => (
                <div key={course} className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-brand-gray-200">
                    <div className="p-2 bg-brand-blue-100 rounded-lg">
                      <FolderIcon className="w-5 h-5 text-brand-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-brand-gray-800">{course}</h3>
                  </div>
                  
                  <div className="space-y-4 pl-4">
                    {Object.entries(semesters).map(([semester, subjects]) => (
                      <div key={semester} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-brand-gray-400" />
                          <h4 className="font-medium text-brand-gray-700">{semester}</h4>
                        </div>
                        
                        <div className="space-y-3 pl-6">
                          {Object.entries(subjects).map(([subject, fileList]) => (
                            <div key={subject} className="space-y-2">
                              <p className="text-sm font-medium text-brand-gray-600">{subject}</p>
                              <div className="space-y-1">
                                {fileList.map(file => (
                                  <div
                                    key={file.id}
                                    className="group flex items-center gap-3 p-3 hover:bg-brand-gray-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-brand-gray-200"
                                    onClick={() => navigate(`/file/${file.id}`)}
                                  >
                                    <div className="p-2 bg-brand-gray-100 rounded-lg group-hover:bg-brand-blue-100 transition-colors">
                                      <FileIcon className="w-4 h-4 text-brand-gray-600 group-hover:text-brand-blue-600" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-brand-gray-800 truncate group-hover:text-brand-blue-600 transition-colors">
                                        {file.title}
                                      </p>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-brand-gray-500 truncate">{file.lastUpdateMessage}</span>
                                        <span className="text-xs text-brand-gray-400">•</span>
                                        <span className="text-xs text-brand-gray-500">{file.uploadedAt}</span>
                                        <span className="text-xs text-brand-gray-400">•</span>
                                        <span className="inline-flex items-center gap-1 text-xs text-brand-gray-500">
                                          <EyeIcon className="w-3 h-3" />
                                          {file.downloads} downloads
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={(e) => handleDownload(e, file)}
                                        className="p-2 text-brand-gray-400 hover:text-brand-success-600 hover:bg-brand-success-50 rounded-lg transition-colors"
                                        aria-label={`Baixar ${file.title}`}
                                        disabled={deletingFileId === file.id}
                                      >
                                        <DownloadIcon className="w-5 h-5" />
                                      </button>
                                      <button
                                        onClick={(e) => handleDelete(e, file)}
                                        className="p-2 text-brand-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label={`Deletar ${file.title}`}
                                        disabled={deletingFileId === file.id}
                                      >
                                        {deletingFileId === file.id ? (
                                          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <TrashIcon className="w-5 h-5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="divide-y divide-brand-gray-200">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  className="group flex items-center gap-4 p-4 hover:bg-brand-gray-50 transition-all cursor-pointer"
                  onClick={() => navigate(`/file/${file.id}`)}
                >
                  <div className="p-3 bg-brand-gray-100 rounded-xl group-hover:bg-brand-blue-100 transition-colors">
                    <FileIcon className="w-6 h-6 text-brand-gray-600 group-hover:text-brand-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-gray-800 truncate group-hover:text-brand-blue-600 transition-colors">
                      {file.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 bg-brand-blue-100 text-brand-blue-700 rounded text-xs font-medium">
                        {file.semester}
                      </span>
                      <span className="text-xs text-brand-gray-500">{file.subject}</span>
                      <span className="text-xs text-brand-gray-400">•</span>
                      <span className="text-xs text-brand-gray-500">{file.uploadedAt}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-gray-800">{file.downloads}</p>
                      <p className="text-xs text-brand-gray-500">downloads</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDownload(e, file)}
                      className="p-2 text-brand-gray-400 hover:text-brand-success-600 hover:bg-brand-success-50 rounded-lg transition-colors"
                      aria-label={`Baixar ${file.title}`}
                      disabled={deletingFileId === file.id}
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, file)}
                      className="p-2 text-brand-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Deletar ${file.title}`}
                      disabled={deletingFileId === file.id}
                    >
                      {deletingFileId === file.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <TrashIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-20 h-20 bg-brand-gray-100 rounded-full flex items-center justify-center mb-4">
              <DocumentDuplicateIcon className="w-10 h-10 text-brand-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-brand-gray-800 mb-2">
              {searchTerm || selectedSemester !== 'all' ? 'Nenhum arquivo encontrado' : 'Nenhum arquivo publicado'}
            </h3>
            <p className="text-brand-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || selectedSemester !== 'all'
                ? 'Tente ajustar seus filtros de busca para encontrar o que procura.'
                : 'Comece a compartilhar seu trabalho com a comunidade acadêmica.'}
            </p>
            {!(searchTerm || selectedSemester !== 'all') && (
              <Link
                to="/publish-file"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-all hover:shadow-lg"
              >
                <UploadIcon className="w-5 h-5" />
                Publicar meu primeiro arquivo
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFilesPage;