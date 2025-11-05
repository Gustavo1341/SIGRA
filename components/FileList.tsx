
import React from 'react';
import { AcademicFile } from '../types';
import { ClockIcon, EyeIcon, DownloadIcon } from './icons';

interface FileListProps {
  title: string;
  subtitle: string;
  files: AcademicFile[];
  onViewFile: (file: AcademicFile) => void;
}

const FileListItem: React.FC<{ file: AcademicFile; onViewFile: (file: AcademicFile) => void; }> = ({ file, onViewFile }) => {
  const initials = file.author.split(' ').map(n => n[0]).slice(0, 2).join('');
  
  const handleDownload = () => {
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

  return (
    <div className="flex items-start p-4 hover:bg-brand-gray-25 transition-all duration-200 group">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-blue-700 flex items-center justify-center font-bold text-white text-sm shadow-sm mt-1">
        {initials}
      </div>
      <div className="flex-1 ml-4 grid grid-cols-1 lg:grid-cols-8 items-center gap-x-4 gap-y-2">
        <div className="lg:col-span-4">
          <p className="font-semibold text-brand-gray-900 truncate group-hover:text-brand-blue-600 transition-colors">{file.title}</p>
          <p className="text-sm text-brand-gray-500">
            {file.author} <span className="text-brand-gray-300">•</span> {file.course}
          </p>
        </div>
        <div className="text-sm text-brand-gray-500 text-left lg:text-right lg:col-span-1">{file.uploadedAt}</div>
        <div className="lg:col-span-2 text-left lg:text-right">
          <span className="inline-flex items-center gap-1.5 bg-brand-gray-100 text-brand-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <DownloadIcon className="w-3.5 h-3.5" />
            {file.downloads}
          </span>
        </div>
        <div className="flex justify-start lg:justify-end items-center space-x-1 lg:col-span-1">
          <button onClick={() => onViewFile(file)} className="p-2 text-brand-gray-400 hover:text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-all duration-200" aria-label={`Visualizar ${file.title}`}>
            <EyeIcon className="w-5 h-5" />
          </button>
          <button onClick={handleDownload} className="p-2 text-brand-gray-400 hover:text-brand-success-600 hover:bg-brand-success-50 rounded-lg transition-all duration-200" aria-label={`Baixar ${file.title}`}>
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ title, subtitle, files, onViewFile }) => {
  return (
    <div className="bg-white rounded-xl border border-brand-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-brand-gray-200 bg-gradient-to-r from-white to-brand-gray-25">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-blue-50 rounded-lg">
            <ClockIcon className="w-5 h-5 text-brand-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-gray-900">{title}</h2>
            <p className="text-sm text-brand-gray-500">{subtitle}</p>
          </div>
        </div>
        <span className="text-sm font-medium text-brand-gray-500 bg-brand-gray-100 px-3 py-1 rounded-full">
          {files.length} {files.length === 1 ? 'arquivo' : 'arquivos'}
        </span>
      </div>
      <div className="divide-y divide-brand-gray-100">
        {files.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-gray-100 rounded-full flex items-center justify-center">
              <ClockIcon className="w-8 h-8 text-brand-gray-400" />
            </div>
            <p className="text-brand-gray-500 font-medium">Nenhum arquivo encontrado</p>
            <p className="text-sm text-brand-gray-400 mt-1">Os arquivos aparecerão aqui quando forem publicados</p>
          </div>
        ) : (
          files.map(file => (
            <FileListItem key={file.id} file={file} onViewFile={onViewFile} />
          ))
        )}
      </div>
    </div>
  );
};

export default FileList;
