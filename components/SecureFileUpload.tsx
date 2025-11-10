import React, { useState, useRef } from 'react';
import { 
  validateFile, 
  formatFileSize, 
  sanitizeFileName,
  MAX_FILE_SIZE 
} from '../src/utils/inputValidation';
import { UploadIcon, XIcon, CheckCircleIcon, ExclamationCircleIcon } from './icons';

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

/**
 * Componente de upload de arquivo com validações de segurança
 */
const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileSelect,
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.7z',
  maxSize = MAX_FILE_SIZE,
  disabled = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileValidation = (file: File): boolean => {
    setError(null);

    // Validar tipo e tamanho
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Arquivo inválido');
      return false;
    }

    // Validar tamanho customizado se fornecido
    if (maxSize && file.size > maxSize) {
      setError(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(maxSize)}`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!handleFileValidation(file)) {
      return;
    }

    // Sanitizar nome do arquivo
    const sanitizedFile = new File(
      [file],
      sanitizeFileName(file.name),
      { type: file.type }
    );

    setSelectedFile(sanitizedFile);
    onFileSelect(sanitizedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      <div
        onClick={!disabled && !selectedFile ? handleClick : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all
          ${isDragging ? 'border-brand-blue-500 bg-brand-blue-50' : 'border-brand-gray-300'}
          ${!disabled && !selectedFile ? 'cursor-pointer hover:border-brand-blue-400 hover:bg-brand-gray-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
              <div className="text-left">
                <p className="font-medium text-brand-gray-800">{selectedFile.name}</p>
                <p className="text-sm text-brand-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-2 text-brand-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <UploadIcon className="w-12 h-12 mx-auto text-brand-gray-400 mb-3" />
            <p className="text-brand-gray-700 font-medium mb-1">
              Clique para selecionar ou arraste um arquivo
            </p>
            <p className="text-sm text-brand-gray-500">
              Tamanho máximo: {formatFileSize(maxSize || MAX_FILE_SIZE)}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SecureFileUpload;
