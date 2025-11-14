
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicFile } from '../types';
import { ClockIcon, DownloadIcon } from './icons';
import { filesService } from '../services/files.service';
import { showNotification } from '../src/utils/notification';

interface FileListProps {
  title: string;
  subtitle: string;
  files: AcademicFile[];
  onViewFile?: (file: AcademicFile) => void; // Opcional para compatibilidade
  currentUserId?: number; // ID do usuário atual para registrar downloads
}

const FileListItem: React.FC<{ file: AcademicFile; currentUserId?: number }> = ({ file, currentUserId }) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const initials = file.author.split(' ').map(n => n[0]).slice(0, 2).join('');
  
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne que o clique abra o arquivo
    
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // Buscar arquivo completo do Supabase para obter fileContent
      const fullFile = await filesService.getFileById(file.id);
      
      // Registrar download no Supabase
      if (currentUserId) {
        await filesService.registerDownload(file.id, currentUserId);
      }
      
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
        showNotification('Download iniciado com sucesso!', 'success', 3000);
      } else if (fullFile.fileUrl) {
        // Download de URL externa
        const a = document.createElement('a');
        a.href = fullFile.fileUrl;
        a.download = fullFile.fileName || fullFile.title;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showNotification('Download iniciado com sucesso!', 'success', 3000);
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
      }
    } catch (err) {
      console.error('Erro ao fazer download:', err);
      showNotification(
        err instanceof Error ? err.message : 'Erro ao fazer download. Tente novamente.',
        'error',
        5000
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/file/${file.id}`)}
      className="flex items-start p-4 sm:p-4 hover:bg-brand-gray-25 active:bg-brand-gray-50 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex-shrink-0 h-12 w-12 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-blue-700 flex items-center justify-center font-bold text-white text-base sm:text-sm shadow-md">
        {initials}
      </div>
      <div className="flex-1 ml-3 sm:ml-4 min-w-0">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-brand-gray-900 line-clamp-1 group-hover:text-brand-blue-600 transition-colors text-base">
                {file.fileName}
              </p>
              <p className="text-sm text-brand-gray-500 mt-0.5">
                ~{file.author}
              </p>
            </div>
            <button 
              onClick={handleDownload} 
              disabled={isDownloading}
              className="flex-shrink-0 p-2.5 text-brand-gray-400 hover:text-brand-success-600 active:text-brand-success-700 hover:bg-brand-success-50 active:bg-brand-success-100 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
              aria-label={`Baixar ${file.title}`}
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-brand-success-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <DownloadIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-sm text-brand-gray-600 mb-2">
            {file.course}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-gray-500 font-medium">{file.uploadedAt}</span>
            <span className="inline-flex items-center gap-1.5 bg-brand-gray-100 text-brand-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              <DownloadIcon className="w-3 h-3" />
              {file.downloads}
            </span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-8 items-center gap-x-4 gap-y-2">
          <div className="lg:col-span-4">
            <p className="font-semibold text-brand-gray-900 truncate group-hover:text-brand-blue-600 transition-colors">
              {file.fileName} <span className="text-brand-gray-500 font-normal">~{file.author}</span>
            </p>
            <p className="text-sm text-brand-gray-500">
              {file.course}
            </p>
          </div>
          <div className="text-sm text-brand-gray-500 text-right lg:col-span-1">{file.uploadedAt}</div>
          <div className="lg:col-span-2 text-right">
            <span className="inline-flex items-center gap-1.5 bg-brand-gray-100 text-brand-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <DownloadIcon className="w-3.5 h-3.5" />
              {file.downloads}
            </span>
          </div>
          <div className="flex justify-end items-center lg:col-span-1">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 text-brand-gray-400 hover:text-brand-success-600 hover:bg-brand-success-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
              aria-label={`Baixar ${file.title}`}
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-brand-success-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <DownloadIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ title, subtitle, files, currentUserId }) => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-xl border border-brand-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-5 sm:p-6 border-b border-brand-gray-200 bg-gradient-to-r from-brand-blue-50/30 via-white to-brand-gray-25">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="p-2.5 sm:p-2 bg-brand-blue-100 rounded-xl sm:rounded-lg shadow-sm">
            <ClockIcon className="w-6 h-6 sm:w-5 sm:h-5 text-brand-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-lg font-bold text-brand-gray-900 truncate">{title}</h2>
            <p className="text-sm text-brand-gray-500 truncate">{subtitle}</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-sm font-semibold text-brand-gray-600 bg-brand-gray-100 px-3 py-1.5 rounded-full ml-3">
          {files.length} {files.length === 1 ? 'arquivo' : 'arquivos'}
        </span>
        <span className="sm:hidden inline-flex text-sm font-bold text-brand-gray-600 bg-brand-gray-100 px-3 py-2 rounded-xl ml-2 shadow-sm">
          {files.length}
        </span>
      </div>
      <div className="divide-y divide-brand-gray-100">
        {files.length === 0 ? (
          <div className="p-12 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-brand-gray-100 to-brand-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
              <ClockIcon className="w-10 h-10 sm:w-8 sm:h-8 text-brand-gray-400" />
            </div>
            <p className="text-brand-gray-700 font-semibold text-base sm:text-base">Nenhum arquivo encontrado</p>
            <p className="text-sm text-brand-gray-500 mt-2 max-w-xs mx-auto">Os arquivos aparecerão aqui quando forem publicados</p>
          </div>
        ) : (
          files.map(file => (
            <FileListItem key={file.id} file={file} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </div>
  );
};

export default FileList;
