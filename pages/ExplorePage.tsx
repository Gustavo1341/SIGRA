import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AcademicFile } from '../types';
import { BookOpenIcon, ChevronRightIcon, FileIcon, FolderIcon, DownloadIcon, ChevronLeftIcon, SearchIcon, EyeIcon, CalendarIcon, DocumentTextIcon } from '../components/icons';
import { filesService } from '../services/files.service';
import { useAuth } from '../contexts/AuthContext';
import { showNotification } from '../src/utils/notification';

const ExplorePage: React.FC = () => {
  const { courseName, semester, subject } = useParams<{ courseName: string, semester?: string, subject?: string }>();
  const { currentUser } = useAuth();
  const [courseFiles, setCourseFiles] = useState<AcademicFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const decodedCourseName = courseName ? decodeURIComponent(courseName) : '';
  const decodedSemester = semester ? decodeURIComponent(semester) : undefined;
  const decodedSubject = subject ? decodeURIComponent(subject) : undefined;
  const ITEMS_PER_PAGE = 50;

  // Fetch files from Supabase using FilesService
  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const filters = {
          courseName: decodedCourseName,
          semester: decodedSemester,
          subject: decodedSubject,
          limit: ITEMS_PER_PAGE,
          offset: currentPage * ITEMS_PER_PAGE,
        };

        const fetchedFiles = await filesService.getFiles(filters);
        setCourseFiles(fetchedFiles);
        setHasMore(fetchedFiles.length === ITEMS_PER_PAGE);
      } catch (err) {
        console.error('Erro ao buscar arquivos:', err);
        setError('Erro ao carregar arquivos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [decodedCourseName, decodedSemester, decodedSubject, currentPage]);

  const getBreadcrumbs = () => {
    const crumbs = [{ name: decodedCourseName, path: `/explore/${courseName}` }];
    if (semester) {
      crumbs.push({ name: semester, path: `/explore/${courseName}/${semester}` });
    }
    if (subject) {
      crumbs.push({ name: subject, path: `/explore/${courseName}/${semester}/${subject}` });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-16">
          <div className="w-16 h-16 border-4 border-brand-blue-200 border-t-brand-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-brand-gray-600 font-medium">Carregando arquivos...</p>
          <p className="text-sm text-brand-gray-400 mt-1">Aguarde um momento</p>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-brand-gray-800 mb-2">Erro ao Carregar</h3>
          <p className="text-red-600 mb-6 text-center max-w-md">{error}</p>
          <button
            onClick={() => setCurrentPage(0)}
            className="px-6 py-3 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 font-medium transition-all shadow-sm"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    // Empty state
    if (courseFiles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-16">
          <div className="w-20 h-20 bg-brand-gray-100 rounded-full flex items-center justify-center mb-4">
            <FolderIcon className="w-10 h-10 text-brand-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-brand-gray-800 mb-2">Nenhum Arquivo Encontrado</h3>
          <p className="text-brand-gray-500 text-center max-w-md">
            Não há arquivos disponíveis nesta seção no momento.
          </p>
        </div>
      );
    }

    if (decodedSubject && decodedSemester) {
      // Show files in a subject (already filtered by backend)
      return courseFiles.map(file => (
        <FileListItem key={file.id} file={file} currentUserId={currentUser?.id} />
      ));
    }
    
    if (decodedSemester) {
      // Show subjects in a semester (already filtered by backend)
      const subjects: string[] = Array.from(new Set(courseFiles.map(file => file.subject)));
      const subjectLinks = subjects.map(sub => {
          const lastFile = courseFiles.filter(f => f.subject === sub).sort((a: AcademicFile,b: AcademicFile) => b.id - a.id)[0];
          return {
              name: sub,
              lastUpdateMessage: lastFile?.lastUpdateMessage || 'Nenhuma atualização recente',
              uploadedAt: lastFile?.uploadedAt || ''
          }
      });
      return subjectLinks.map(sub => (
        <DirectoryListItem key={sub.name} type="subject" name={sub.name} path={`/explore/${courseName}/${semester}/${encodeURIComponent(sub.name)}`} lastUpdateMessage={sub.lastUpdateMessage} lastModified={sub.uploadedAt}/>
      ));
    }
    
    // Show semesters in a course (already filtered by backend)
    const semesters: string[] = Array.from(new Set(courseFiles.map(file => file.semester)));
    const semesterLinks = semesters.map(sem => {
        const lastFile = courseFiles.filter(f => f.semester === sem).sort((a: AcademicFile,b: AcademicFile) => b.id - a.id)[0];
        return {
            name: sem,
            lastUpdateMessage: lastFile?.lastUpdateMessage || 'Nenhuma atualização recente',
            uploadedAt: lastFile?.uploadedAt || ''
        }
    });
    return semesterLinks.map(sem => (
      <DirectoryListItem key={sem.name} type="semester" name={sem.name} path={`/explore/${courseName}/${encodeURIComponent(sem.name)}`} lastUpdateMessage={sem.lastUpdateMessage} lastModified={sem.uploadedAt} />
    ));
  };
  
  // Filter files based on search
  const filteredFiles = courseFiles.filter(file => 
    searchTerm === '' || 
    file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.lastUpdateMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumbs */}
      <div className="bg-white p-4 rounded-t-2xl border-x border-t border-brand-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center text-lg space-x-2">
                <BookOpenIcon className="w-5 h-5 text-brand-gray-500 flex-shrink-0" />
                <nav className="flex items-center flex-wrap" aria-label="Breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center">
                        <Link to={crumb.path} className="font-semibold text-brand-blue-600 hover:underline">
                            {crumb.name}
                        </Link>
                        {index < breadcrumbs.length - 1 && (
                            <ChevronRightIcon className="h-5 w-5 text-brand-gray-400 mx-1 flex-shrink-0" />
                        )}
                        </div>
                    ))}
                </nav>
            </div>
            <Link 
              to="/explore" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-gray-700 bg-white border border-brand-gray-300 rounded-md hover:bg-brand-gray-50 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Todos os cursos
            </Link>
        </div>
      </div>

      {/* Search and Filters */}
      {(decodedSubject && decodedSemester) && (
        <div className="bg-white p-4 rounded-xl border border-brand-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-gray-400" />
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-brand-gray-600 font-medium">
                {filteredFiles.length} {filteredFiles.length === 1 ? 'arquivo' : 'arquivos'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl border border-brand-gray-200 shadow-sm overflow-hidden">
        {renderContent()}
        
        {/* Pagination controls */}
        {!isLoading && !error && courseFiles.length > 0 && (decodedSubject && decodedSemester) && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-brand-gray-200 bg-brand-gray-50 gap-4">
            <div className="text-sm text-brand-gray-600">
              Página <span className="font-semibold">{currentPage + 1}</span>
              {hasMore && <span className="ml-2 text-brand-gray-500">(mais resultados disponíveis)</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  currentPage === 0
                    ? 'bg-brand-gray-200 text-brand-gray-400 cursor-not-allowed'
                    : 'bg-white text-brand-gray-700 border border-brand-gray-300 hover:bg-brand-gray-50 hover:border-brand-gray-400'
                }`}
              >
                ← Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!hasMore}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  !hasMore
                    ? 'bg-brand-gray-200 text-brand-gray-400 cursor-not-allowed'
                    : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700 shadow-sm'
                }`}
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DirectoryListItemProps {
    name: string;
    path: string;
    type: 'semester' | 'subject';
    lastUpdateMessage: string;
    lastModified: string;
}

const DirectoryListItem: React.FC<DirectoryListItemProps> = ({ name, path, lastUpdateMessage, lastModified }) => (
    <Link 
      to={path} 
      className="group flex items-center gap-4 p-4 hover:bg-brand-blue-50 transition-all border-b border-brand-gray-100 last:border-b-0"
    >
      <div className="p-3 bg-brand-blue-100 rounded-xl group-hover:bg-brand-blue-200 transition-colors">
        <FolderIcon className="w-6 h-6 text-brand-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-brand-gray-800 group-hover:text-brand-blue-600 transition-colors truncate">
            {name}
          </h3>
          <ChevronRightIcon className="w-5 h-5 text-brand-gray-400 group-hover:text-brand-blue-600 transition-colors flex-shrink-0" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-brand-gray-500">
          <span className="truncate">{lastUpdateMessage}</span>
          {lastModified && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {lastModified}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
);


interface FileListItemProps {
    file: AcademicFile;
    currentUserId?: number;
}
const FileListItem: React.FC<FileListItemProps> = ({ file, currentUserId }) => {
    const navigate = useNavigate();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleView = () => {
        navigate(`/file/${file.id}`);
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDownloading) return;
        
        setIsDownloading(true);
        try {
            const fullFile = await filesService.getFileById(file.id);
            await filesService.registerDownload(file.id, currentUserId);

            if (fullFile.fileContent && fullFile.fileName) {
                const blob = new Blob([fullFile.fileContent], { type: fullFile.fileType || 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fullFile.fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showNotification('Download iniciado com sucesso!', 'success', 3000);
            } else if (fullFile.fileUrl) {
                const a = document.createElement('a');
                a.href = fullFile.fileUrl;
                a.download = fullFile.fileName || fullFile.title;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showNotification('Download iniciado com sucesso!', 'success', 3000);
            } else {
                const exampleContent = `Título: ${fullFile.title}\nAutor: ${fullFile.author}\nCurso: ${fullFile.course}\nSemestre: ${fullFile.semester}\nDisciplina: ${fullFile.subject}\n\nEste é um arquivo de exemplo do SIGRA.`;
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
            }
        } catch (error) {
            console.error('Erro ao baixar arquivo:', error);
            showNotification('Erro ao baixar arquivo. Tente novamente.', 'error', 5000);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div 
            onClick={handleView}
            className="group flex items-center gap-4 p-4 hover:bg-brand-gray-50 cursor-pointer transition-all border-b border-brand-gray-100 last:border-b-0"
        >
          <div className="p-3 bg-brand-gray-100 rounded-xl group-hover:bg-brand-blue-100 transition-colors">
            <DocumentTextIcon className="w-6 h-6 text-brand-gray-600 group-hover:text-brand-blue-600 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-gray-800 group-hover:text-brand-blue-600 transition-colors truncate mb-1">
              {file.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-brand-gray-500">
              <span className="truncate">{file.lastUpdateMessage}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {file.uploadedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                {file.downloads} downloads
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={handleDownload} 
                disabled={isDownloading}
                className="p-2.5 text-brand-gray-400 hover:text-brand-success-600 hover:bg-brand-success-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Baixar ${file.title}`}
            >
                {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-brand-success-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <DownloadIcon className="w-5 h-5" />
                )}
            </button>
          </div>
        </div>
    );
};


export default ExplorePage;