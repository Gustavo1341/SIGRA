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
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmButtonText = 'Confirmar',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    info: 'bg-brand-blue-600 hover:bg-brand-blue-700',
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true"></div>

      <div className="relative w-full max-w-md m-4 bg-white rounded-2xl shadow-xl">
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
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-50">
              Cancelar
            </button>
            <button onClick={onConfirm} className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow ${buttonStyles[variant]}`}>
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
