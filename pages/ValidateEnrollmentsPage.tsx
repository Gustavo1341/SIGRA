
import React, { useState, useEffect } from 'react';
import { Enrollment, User, Role } from '../types';
import { CheckBadgeIcon, UsersIcon, DocumentArrowUpIcon } from '../components/icons';
import ValidationModal from '../components/ValidationModal';
import CSVImportModal from '../components/CSVImportModal';
import { enrollmentsService } from '../services/enrollments.service';

interface ValidateEnrollmentsPageProps {
  currentUser: User | null;
  onEnrollmentProcessed?: () => void;
}

const ValidateEnrollmentsPage: React.FC<ValidateEnrollmentsPageProps> = ({ 
  currentUser,
  onEnrollmentProcessed
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingEnrollments, setPendingEnrollments] = useState<Enrollment[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  // Buscar matrículas pendentes do Supabase
  useEffect(() => {
    loadPendingEnrollments();
  }, []);

  const loadPendingEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await enrollmentsService.getPendingEnrollments();
      setPendingEnrollments(data);
    } catch (err) {
      console.error('Erro ao carregar matrículas:', err);
      setError('Erro ao carregar matrículas pendentes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnrollment(null);
  };

  const handleValidate = async (enrollmentToValidate: Enrollment) => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Verificar se currentUser existe
      if (!currentUser || !currentUser.id) {
        throw new Error('Usuário não autenticado');
      }
      
      // Chamar serviço para validar matrícula
      await enrollmentsService.validateEnrollment(enrollmentToValidate.id, currentUser.id);
      
      // Fechar modal
      closeModal();
      
      // Mostrar mensagem de sucesso
      setSuccessMessage(`Matrícula de ${enrollmentToValidate.studentName} validada com sucesso! O aluno já pode fazer login.`);
      
      // Recarregar lista de matrículas pendentes
      await loadPendingEnrollments();
      
      // Atualizar contagem no sidebar
      if (onEnrollmentProcessed) {
        onEnrollmentProcessed();
      }
      
      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Erro ao validar matrícula:', err);
      setError(err instanceof Error ? err.message : 'Erro ao validar matrícula. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (enrollmentToReject: Enrollment) => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Chamar serviço para rejeitar matrícula
      await enrollmentsService.rejectEnrollment(enrollmentToReject.id);
      
      // Fechar modal
      closeModal();
      
      // Mostrar mensagem de sucesso
      setSuccessMessage(`Matrícula de ${enrollmentToReject.studentName} foi rejeitada.`);
      
      // Recarregar lista de matrículas pendentes
      await loadPendingEnrollments();
      
      // Atualizar contagem no sidebar
      if (onEnrollmentProcessed) {
        onEnrollmentProcessed();
      }
      
      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Erro ao rejeitar matrícula:', err);
      setError(err instanceof Error ? err.message : 'Erro ao rejeitar matrícula. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleValidateBatch = async (matriculas: string[]) => {
    if (!currentUser || !currentUser.id) {
      throw new Error('Usuário não autenticado');
    }

    return await enrollmentsService.validateEnrollmentsBatch(matriculas, currentUser.id);
  };

  const handleImportComplete = async (result: { validated: string[]; notFound: string[]; errors: string[] }) => {
    // Recarregar lista de matrículas pendentes
    await loadPendingEnrollments();
    
    // Atualizar contagem no sidebar
    if (onEnrollmentProcessed) {
      onEnrollmentProcessed();
    }

    // Mostrar mensagem de sucesso resumida
    if (result.validated.length > 0) {
      setSuccessMessage(
        `Importação concluída: ${result.validated.length} ${result.validated.length === 1 ? 'matrícula validada' : 'matrículas validadas'}.`
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Validar Matrículas</h1>
        <p className="text-brand-gray-500 mt-1">Revise e aprove ou rejeite as matrículas pendentes no sistema.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand-gray-300">
        <div className="flex items-center justify-between mb-4 border-b border-brand-gray-200 pb-4">
          <div className="flex items-center space-x-3">
            <CheckBadgeIcon className="w-6 h-6 text-brand-gray-400" />
            <div>
              <h2 className="text-xl font-bold text-brand-gray-800">Matrículas Pendentes</h2>
              <p className="text-sm text-brand-gray-500">
                {pendingEnrollments.length} {pendingEnrollments.length === 1 ? 'matrícula aguardando' : 'matrículas aguardando'} revisão.
              </p>
            </div>
          </div>
          {pendingEnrollments.length > 0 && (
            <button
              onClick={() => setIsCSVModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors"
            >
              <DocumentArrowUpIcon className="w-5 h-5" />
              Importar CSV
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckBadgeIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <button 
              onClick={loadPendingEnrollments}
              className="mt-2 text-sm font-semibold text-red-700 hover:text-red-800"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-600"></div>
            <p className="mt-2 text-sm text-brand-gray-500">Carregando matrículas...</p>
          </div>
        ) : pendingEnrollments.length > 0 ? (
          <div className="space-y-3">
            {pendingEnrollments.map((enrollment) => {
              const nameParts = enrollment.studentName.trim().split(' ');
              const initials = nameParts.length >= 2 
                ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
                : nameParts[0].charAt(0).toUpperCase();
              
              return (
              <div 
                key={enrollment.id} 
                onClick={() => handleReview(enrollment)}
                className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200 hover:border-brand-blue-200 hover:bg-brand-blue-50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center w-full">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {initials}
                    </div>
                    <div className="flex-1 ml-4">
                        <p className="font-semibold text-brand-gray-800">{enrollment.studentName}</p>
                        <p className="text-sm text-brand-gray-500">{enrollment.courseName}</p>
                    </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReview(enrollment);
                  }}
                  className="mt-3 sm:mt-0 w-full sm:w-auto flex-shrink-0 px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-100 transition-colors"
                  aria-label={`Revisar matrícula de ${enrollment.studentName}`}
                >
                  Revisar
                </button>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-green-500">
              <CheckBadgeIcon className="w-full h-full"/>
            </div>
            <h3 className="mt-2 text-lg font-medium text-brand-gray-900">Tudo em ordem!</h3>
            <p className="mt-1 text-sm text-brand-gray-500">Nenhuma matrícula pendente para revisão no momento.</p>
          </div>
        )}
      </div>
      
      {selectedEnrollment && (
        <ValidationModal 
            isOpen={isModalOpen}
            onClose={closeModal}
            onValidate={handleValidate}
            onReject={handleReject}
            enrollment={selectedEnrollment}
            loading={actionLoading}
        />
      )}

      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImportComplete={handleImportComplete}
        onValidateBatch={handleValidateBatch}
      />

    </div>
  );
};

export default ValidateEnrollmentsPage;
