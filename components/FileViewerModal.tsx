import React from 'react';
import { AcademicFile } from '../types';
import { XIcon, DownloadIcon, FileIcon } from './icons';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: AcademicFile | null;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ isOpen, onClose, file }) => {
  if (!isOpen || !file) return null;

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true"></div>
      <div className="relative w-full max-w-3xl m-4 bg-white rounded-2xl border border-brand-gray-300 transform transition-all flex flex-col h-[90vh]">
        <div className="p-4 flex-shrink-0 flex items-center justify-between border-b border-brand-gray-200">
            <div className="flex items-center gap-3">
                <FileIcon className="w-5 h-5 text-brand-gray-500"/>
                <div>
                    <h2 id="modal-title" className="text-lg font-bold text-brand-gray-800">
                        {file.title}
                    </h2>
                    <p className="text-sm text-brand-gray-500">{file.fileName}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-semibold text-brand-gray-700 bg-brand-gray-100 rounded-lg hover:bg-brand-gray-200 transition-colors"
                >
                    <DownloadIcon className="w-4 h-4" />
                    Baixar
                </button>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-brand-gray-400 hover:bg-brand-gray-100 hover:text-brand-gray-600"
                    aria-label="Fechar modal"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
        <div className="p-6 flex-1 overflow-auto bg-brand-gray-50">
            <pre className="text-sm text-brand-gray-800 whitespace-pre-wrap font-sans">
                {file.fileContent || 'Este arquivo não tem conteúdo para ser exibido.'}
            </pre>
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
