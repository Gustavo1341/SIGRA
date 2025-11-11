import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AcademicFile } from '../types';
import { ChevronLeftIcon, DownloadIcon, FileIcon, BookOpenIcon, ChevronRightIcon } from '../components/icons';
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
    <div className="space-y-4">
      {/* Header com breadcrumb */}
      <div className="bg-white p-4 rounded-xl border border-brand-gray-300">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-brand-gray-600 hover:text-brand-blue-600 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
            Baixar
          </button>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm space-x-2 text-brand-gray-500">
          <BookOpenIcon className="w-4 h-4" />
          <Link to={`/explore/${encodeURIComponent(file.course)}`} className="hover:text-brand-blue-600">
            {file.course}
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <Link to={`/explore/${encodeURIComponent(file.course)}/${encodeURIComponent(file.semester)}`} className="hover:text-brand-blue-600">
            {file.semester}
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <Link to={`/explore/${encodeURIComponent(file.course)}/${encodeURIComponent(file.semester)}/${encodeURIComponent(file.subject)}`} className="hover:text-brand-blue-600">
            {file.subject}
          </Link>
        </div>
      </div>

      {/* File Content */}
      <div className="bg-white rounded-xl border border-brand-gray-300 overflow-hidden">
        <div className="bg-brand-gray-50 px-6 py-3 border-b border-brand-gray-200">
          <p className="text-sm font-medium text-brand-gray-700">{file.fileName}</p>
        </div>
        <div className="p-6 overflow-auto max-h-[70vh]">
          <pre className="text-sm text-brand-gray-800 whitespace-pre-wrap font-mono">
            {file.fileContent || 'Este arquivo não tem conteúdo para ser exibido.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FileViewPage;
