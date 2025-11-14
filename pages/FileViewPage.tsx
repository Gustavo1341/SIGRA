import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AcademicFile } from '../types';
import { ChevronLeftIcon, DownloadIcon, FileIcon, BookOpenIcon, ChevronRightIcon, UserIcon, CalendarIcon, EyeIcon } from '../components/icons';
import { filesService } from '../services/files.service';
import { useAuth } from '../contexts/AuthContext';

const FileViewPage: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [file, setFile] = useState<AcademicFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFile = async () => {
      if (!fileId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const fileData = await filesService.getFileById(parseInt(fileId));
        setFile(fileData);
      } catch (err) {
        console.error('Erro ao carregar arquivo:', err);
        setError('Erro ao carregar arquivo. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [fileId]);

  const handleDownload = async () => {
    if (!file || !file.fileContent || !file.fileName) return;
    
    try {
      // Register download
      await filesService.registerDownload(file.id, currentUser?.id);
      
      // Perform download
      const blob = new Blob([file.fileContent], { type: file.fileType || 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar arquivo:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600"></div>
        <span className="ml-3 text-brand-gray-600">Carregando arquivo...</span>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600 mb-4">{error || 'Arquivo não encontrado'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-gray-600 hover:text-brand-blue-600 transition-colors group"
        >
          <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar</span>
        </button>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm space-x-2 text-brand-gray-500" aria-label="Breadcrumb">
        <BookOpenIcon className="w-4 h-4" />
        <Link to={`/explore/${encodeURIComponent(file.course)}`} className="hover:text-brand-blue-600 hover:underline transition-colors">
          {file.course}
        </Link>
        <ChevronRightIcon className="w-4 h-4" />
        <Link to={`/explore/${encodeURIComponent(file.course)}/${encodeURIComponent(file.semester)}`} className="hover:text-brand-blue-600 hover:underline transition-colors">
          {file.semester}
        </Link>
        <ChevronRightIcon className="w-4 h-4" />
        <Link to={`/explore/${encodeURIComponent(file.course)}/${encodeURIComponent(file.semester)}/${encodeURIComponent(file.subject)}`} className="hover:text-brand-blue-600 hover:underline transition-colors">
          {file.subject}
        </Link>
      </nav>

      {/* File Info Card */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-blue-50 to-brand-blue-100 px-4 sm:px-6 py-4 sm:py-5 border-b border-brand-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                  <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue-600" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-brand-gray-900 break-words">{file.title}</h1>
              </div>
              {file.description && (
                <p className="text-sm sm:text-base text-brand-gray-600 mt-2 leading-relaxed">{file.description}</p>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 shadow-md hover:shadow-lg transition-all hover:scale-105 w-full sm:w-auto flex-shrink-0"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Baixar</span>
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="px-4 sm:px-6 py-4 bg-brand-gray-50 border-b border-brand-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                <UserIcon className="w-4 h-4 text-brand-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-brand-gray-500 font-medium">Publicado por</p>
                <p className="text-sm text-brand-gray-900 font-semibold truncate">{file.author || 'Desconhecido'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                <CalendarIcon className="w-4 h-4 text-brand-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-brand-gray-500 font-medium">Publicado há</p>
                <p className="text-sm text-brand-gray-900 font-semibold">{file.uploadedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                <DownloadIcon className="w-4 h-4 text-brand-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-brand-gray-500 font-medium">Downloads</p>
                <p className="text-sm text-brand-gray-900 font-semibold">{file.downloads || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* File Name */}
        <div className="px-4 sm:px-6 py-3 bg-brand-gray-100 border-b border-brand-gray-200">
          <div className="flex items-center gap-2">
            <FileIcon className="w-4 h-4 text-brand-gray-500 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-mono text-brand-gray-700 truncate">{file.fileName}</p>
          </div>
        </div>

        {/* File Content */}
        <div className="p-4 sm:p-6">
          <div className="bg-brand-gray-50 rounded-xl border border-brand-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 overflow-auto max-h-[50vh] sm:max-h-[60vh]">
              {file.fileContent ? (
                <pre className="text-xs sm:text-sm text-brand-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                  {file.fileContent}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
                  <FileIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-gray-300 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-brand-gray-500 font-medium">Este arquivo não tem conteúdo para ser exibido.</p>
                  <p className="text-xs sm:text-sm text-brand-gray-400 mt-2">Faça o download para visualizar o conteúdo completo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewPage;
