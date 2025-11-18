
import React, { Fragment } from 'react';
import { Enrollment } from '../types';
import { CheckIcon, XIcon, IdentificationIcon, MailIcon, UsersIcon, BookOpenIcon } from './icons';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (enrollment: Enrollment) => void;
  onReject: (enrollment: Enrollment) => void;
  enrollment: Enrollment;
  loading?: boolean;
}

const DetailRow: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-brand-gray-400 mt-1">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-brand-gray-500">{label}</p>
            <p className="text-base font-semibold text-brand-gray-800">{value}</p>
        </div>
    </div>
);

const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose, onValidate, onReject, enrollment, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} aria-hidden="true"></div>

        {/* Modal Panel */}
        <div className="relative w-full max-w-lg m-4 bg-white rounded-2xl border border-brand-gray-300 transform transition-all">
            <div className="p-6">
                <div className="flex items-center justify-between pb-4 border-b border-brand-gray-200">
                    <h2 id="modal-title" className="text-lg font-bold text-brand-gray-800">
                        Validar Matrícula
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-brand-gray-400 hover:bg-brand-gray-100 hover:text-brand-gray-600"
                        aria-label="Fechar modal"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="py-6 space-y-4">
                   <DetailRow icon={<IdentificationIcon className="w-5 h-5" />} label="Matrícula" value={enrollment.matricula} />
                   <DetailRow icon={<UsersIcon className="w-5 h-5" />} label="Nome do Aluno" value={enrollment.studentName} />
                   <DetailRow icon={<MailIcon className="w-5 h-5" />} label="Email" value={enrollment.email} />
                   <DetailRow icon={<BookOpenIcon className="w-5 h-5" />} label="Curso" value={enrollment.courseName} />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-brand-gray-200">
                    <button
                        onClick={() => onReject(enrollment)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Rejeitar matrícula de ${enrollment.studentName}`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                                Processando...
                            </>
                        ) : (
                            <>
                                <XIcon className="w-4 h-4" />
                                Rejeitar
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => onValidate(enrollment)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Criar conta e validar matrícula de ${enrollment.studentName}`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processando...
                            </>
                        ) : (
                            <>
                                <CheckIcon className="w-4 h-4" />
                                Criar Conta e Validar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ValidationModal;