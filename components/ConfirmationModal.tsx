import React from 'react';
import { XIcon } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  variant?: 'danger' | 'info';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmButtonText = 'Confirmar',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    info: 'bg-brand-blue-600 hover:bg-brand-blue-700',
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true"></div>

      <div className="relative w-full max-w-md m-4 bg-white rounded-2xl border border-brand-gray-300">
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-gray-200">
            <h2 className="text-lg font-bold text-brand-gray-800">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-brand-gray-400 hover:bg-brand-gray-100">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="py-6">
            <div className="text-sm text-brand-gray-600">{message}</div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-brand-gray-200">
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm} 
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-lg ${buttonStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Processando...' : confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
