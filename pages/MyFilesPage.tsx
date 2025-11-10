import React, { useMemo, useState, useEffect } from 'react';
import { User, AcademicFile } from '../types';
import { DocumentDuplicateIcon, FolderIcon, FileIcon, UploadIcon, EyeIcon, DownloadIcon } from '../components/icons';
import { Link } from 'react-router-dom';
import FileViewerModal from '../components/FileViewerModal';
import { filesService } from '../services/files.service';

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
  const [viewingFile, setViewingFile] = useState<AcademicFile | null>(null);
  const [userFilesFromDb, setUserFilesFromDb] = useState<AcademicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // FIX: Explicitly type `groupedFiles` to help `useMemo` with type inference.
  const groupedFiles: GroupedFiles = useMemo(() => {
    return userFiles.reduce<GroupedFiles>((acc, file) => {
      const { course, semester, subject } = file;
      if (!acc[course]) acc[course] = {};
      if (!acc[course][semester]) acc[course][semester] = {};
      if (!acc[course][semester][subject]) acc[course][semester][subject] = [];
      acc[course][semester][subject].push(file);
      return acc;
    }, {} as GroupedFiles);
  }, [userFiles]);

  const handleDownload = (file: AcademicFile) => {
    if (!file.fileContent || !file.fileName) return;
    const blob = new Blob([file.fileContent], { type: file.fileType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Meus Arquivos</h1>
        <p className="text-brand-gray-500 mt-1">Gerencie e visualize todos os seus trabalhos publicados.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand-gray-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 border-b border-brand-gray-200 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <DocumentDuplicateIcon className="w-6 h-6 text-brand-gray-400" />
            <div>
              <h2 className="text-xl font-bold text-brand-gray-800">Minhas Publicações</h2>
              <p className="text-sm text-brand-gray-500">{userFiles.length} arquivos publicados</p>
            </div>
          </div>
          <Link
            to="/publish-file"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors"
          >
            <UploadIcon className="w-5 h-5" />
            Publicar Novo
          </Link>
        </div>

        {userFiles.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedFiles).map(([course, semesters]) => (
              <div key={course}>
                <h3 className="text-lg font-semibold text-brand-gray-700">{course}</h3>
                <div className="mt-2 space-y-4 pl-4 border-l-2 border-brand-gray-200">
                  {Object.entries(semesters).map(([semester, subjects]) => (
                    <div key={semester}>
                      <div className="flex items-center gap-2">
                        <FolderIcon className="w-5 h-5 text-brand-blue-500" />
                        <h4 className="font-medium text-brand-gray-600">{semester}</h4>
                      </div>
                      <div className="mt-2 space-y-2 pl-6">
                        {Object.entries(subjects).map(([subject, fileList]) => (
                          <div key={subject}>
                            <p className="font-medium text-sm text-brand-gray-500">{subject}</p>
                            <div className="mt-1 space-y-1 pl-4">
                              {fileList.map(file => (
                                <div key={file.id} className="flex items-center p-2 hover:bg-brand-gray-50 rounded-md">
                                  <FileIcon className="w-4 h-4 text-brand-gray-400 flex-shrink-0" />
                                  <div className="flex-1 ml-3 grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-1">
                                      <p className="md:col-span-5 font-medium text-brand-gray-800 truncate">{file.title}</p>
                                      <p className="md:col-span-3 text-sm text-brand-gray-500 truncate">{file.lastUpdateMessage}</p>
                                      <p className="md:col-span-2 text-sm text-brand-gray-500 text-left md:text-right">{file.uploadedAt}</p>
                                      <div className="md:col-span-2 flex justify-start md:justify-end items-center space-x-1">
                                          <button onClick={() => setViewingFile(file)} className="p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-200 rounded-md" aria-label={`Visualizar ${file.title}`}>
                                              <EyeIcon className="w-5 h-5" />
                                          </button>
                                          <button onClick={() => handleDownload(file)} className="p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-200 rounded-md" aria-label={`Baixar ${file.title}`}>
                                              <DownloadIcon className="w-5 h-5" />
                                          </button>
                                      </div>
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
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-brand-gray-400">
                <DocumentDuplicateIcon className="w-full h-full"/>
            </div>
            <h3 className="mt-2 text-lg font-medium text-brand-gray-900">Nenhum arquivo publicado</h3>
            <p className="mt-1 text-sm text-brand-gray-500">Comece a compartilhar seu trabalho com a comunidade.</p>
             <Link
                to="/publish-file"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors"
              >
                Publicar meu primeiro arquivo
              </Link>
          </div>
        )}
      </div>
      <FileViewerModal isOpen={!!viewingFile} onClose={() => setViewingFile(null)} file={viewingFile} />
    </div>
  );
};

export default MyFilesPage;