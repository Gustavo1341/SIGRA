
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
    <div className="flex items-start p-4 hover:bg-brand-gray-100 rounded-lg transition-colors">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-gray-200 flex items-center justify-center font-bold text-brand-gray-600 mt-1">
        {initials}
      </div>
      <div className="flex-1 ml-4 grid grid-cols-1 lg:grid-cols-8 items-center gap-x-4 gap-y-2">
        <div className="lg:col-span-4">
          <p className="font-semibold text-brand-gray-800 truncate">{file.title}</p>
          <p className="text-sm text-brand-gray-500">
            {file.author} &bull; {file.course}
          </p>
        </div>
        <div className="text-sm text-brand-gray-500 text-left lg:text-right lg:col-span-1">{file.uploadedAt}</div>
        <div className="lg:col-span-2 text-left lg:text-right">
          <span className="inline-block bg-brand-gray-200 text-brand-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
            {file.downloads} downloads
          </span>
        </div>
        <div className="flex justify-start lg:justify-end items-center space-x-1 lg:col-span-1">
          <button onClick={() => onViewFile(file)} className="p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-200 rounded-md" aria-label={`Visualizar ${file.title}`}>
            <EyeIcon className="w-5 h-5" />
          </button>
          <button onClick={handleDownload} className="p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-200 rounded-md" aria-label={`Baixar ${file.title}`}>
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ title, subtitle, files, onViewFile }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <ClockIcon className="w-6 h-6 text-brand-gray-400" />
        <div>
          <h2 className="text-xl font-bold text-brand-gray-800">{title}</h2>
          <p className="text-sm text-brand-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2">
        {files.map(file => (
          <FileListItem key={file.id} file={file} onViewFile={onViewFile} />
        ))}
      </div>
    </div>
  );
};

export default FileList;
