import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AcademicFile } from '../types';
import { BookOpenIcon, ChevronRightIcon, FileIcon, FolderIcon, GitBranchIcon, EyeIcon, DownloadIcon } from '../components/icons';
import FileViewerModal from '../components/FileViewerModal';
import { filesService } from '../services/files.service';
import { useAuth } from '../contexts/AuthContext';

const ExplorePage: React.FC = () => {
  const { courseName, semester, subject } = useParams<{ courseName: string, semester?: string, subject?: string }>();
  const { currentUser } = useAuth();
  const [viewingFile, setViewingFile] = useState<AcademicFile | null>(null);
  const [courseFiles, setCourseFiles] = useState<AcademicFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
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
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-600"></div>
          <span className="ml-3 text-brand-gray-600">Carregando arquivos...</span>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => setCurrentPage(0)}
            className="px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    // Empty state
    if (courseFiles.length === 0) {
      return (
        <div className="flex items-center justify-center p-12">
          <p className="text-brand-gray-500">Nenhum arquivo encontrado.</p>
        </div>
      );
    }

    if (decodedSubject && decodedSemester) {
      // Show files in a subject (already filtered by backend)
      return courseFiles.map(file => (
        <FileListItem key={file.id} file={file} onViewFile={setViewingFile} currentUserId={currentUser?.id} />
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
  
  return (
    <div>
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
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white border border-brand-gray-300 rounded-md shadow-sm self-end sm:self-center">
                <GitBranchIcon className="w-4 h-4 text-brand-gray-500" />
                <span>main</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl border border-brand-gray-300">
        <div className="divide-y divide-brand-gray-200">
          {renderContent()}
        </div>
        
        {/* Pagination controls */}
        {!isLoading && !error && courseFiles.length > 0 && (decodedSubject && decodedSemester) && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-brand-gray-200">
            <div className="text-sm text-brand-gray-600">
              Página {currentPage + 1} {hasMore && '(mais resultados disponíveis)'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === 0
                    ? 'bg-brand-gray-100 text-brand-gray-400 cursor-not-allowed'
                    : 'bg-white text-brand-gray-700 border border-brand-gray-300 hover:bg-brand-gray-50'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!hasMore}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  !hasMore
                    ? 'bg-brand-gray-100 text-brand-gray-400 cursor-not-allowed'
                    : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700'
                }`}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      <FileViewerModal isOpen={!!viewingFile} onClose={() => setViewingFile(null)} file={viewingFile} />
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
    <Link to={path} className="flex items-center p-3 hover:bg-brand-gray-50 transition-colors">
      <div className="w-6 text-brand-blue-500"><FolderIcon className="w-5 h-5" /></div>
      <div className="flex-1 ml-2 grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-1">
        <div className="md:col-span-6 font-medium text-brand-gray-700 hover:text-brand-blue-600 hover:underline">{name}</div>
        <div className="md:col-span-4 text-sm text-brand-gray-500 truncate">{lastUpdateMessage}</div>
        <div className="md:col-span-2 text-sm text-brand-gray-500 text-left md:text-right">{lastModified}</div>
      </div>
    </Link>
);


interface FileListItemProps {
    file: AcademicFile;
    onViewFile: (file: AcademicFile) => void;
    currentUserId?: number;
}
const FileListItem: React.FC<FileListItemProps> = ({ file, onViewFile, currentUserId }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleView = async () => {
        try {
            // Fetch full file details including content
            const fullFile = await filesService.getFileById(file.id);
            onViewFile(fullFile);
        } catch (error) {
            console.error('Erro ao visualizar arquivo:', error);
            alert('Erro ao carregar arquivo para visualização.');
        }
    };

    const handleDownload = async () => {
        if (isDownloading) return;
        
        setIsDownloading(true);
        try {
            // Fetch full file details if not already loaded
            let fileToDownload = file;
            if (!file.fileContent && !file.fileName) {
                fileToDownload = await filesService.getFileById(file.id);
            }

            // Register download in database
            await filesService.registerDownload(file.id, currentUserId);

            // Perform actual download
            if (fileToDownload.fileContent && fileToDownload.fileName) {
                const blob = new Blob([fileToDownload.fileContent], { type: fileToDownload.fileType || 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileToDownload.fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Arquivo não disponível para download.');
            }
        } catch (error) {
            console.error('Erro ao baixar arquivo:', error);
            alert('Erro ao baixar arquivo. Tente novamente.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex items-center p-3 hover:bg-brand-gray-50">
          <div className="w-6 text-brand-gray-500"><FileIcon className="w-5 h-5" /></div>
          <div className="flex-1 ml-2 grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-1">
            <div className="md:col-span-5 font-medium text-brand-gray-700">{file.title}</div>
            <div className="md:col-span-3 text-sm text-brand-gray-500 truncate">{file.lastUpdateMessage}</div>
            <div className="md:col-span-2 text-sm text-brand-gray-500 text-left md:text-right">{file.uploadedAt}</div>
            <div className="md:col-span-2 flex justify-start md:justify-end items-center space-x-1">
                <button 
                    onClick={handleView} 
                    className="p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-200 rounded-md" 
                    aria-label={`Visualizar ${file.title}`}
                >
                    <EyeIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={handleDownload} 
                    disabled={isDownloading}
                    className={`p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-200 rounded-md ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={`Baixar ${file.title}`}
                >
                    {isDownloading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-gray-600"></div>
                    ) : (
                        <DownloadIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
          </div>
        </div>
    );
};


export default ExplorePage;