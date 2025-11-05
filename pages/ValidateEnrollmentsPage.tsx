
import React, { useState, useEffect } from 'react';
import { Enrollment, User, Role } from '../types';
import { CheckBadgeIcon, UsersIcon } from '../components/icons';
import ValidationModal from '../components/ValidationModal';
import { enrollmentsService } from '../services/enrollments.service';

interface ValidateEnrollmentsPageProps {
  enrollments: Enrollment[];
  setEnrollments: React.Dispatch<React.SetStateAction<Enrollment[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
}

const ValidateEnrollmentsPage: React.FC<ValidateEnrollmentsPageProps> = ({ 
  enrollments, 
  setEnrollments, 
  users, 
  setUsers,
  currentUser 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingEnrollments, setPendingEnrollments] = useState<Enrollment[]>([]);

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
      setLoading(true);
      setError(null);
      
      // Verificar se currentUser existe
      if (!currentUser || !currentUser.id) {
        throw new Error('Usuário não autenticado');
      }
      
      // Chamar serviço para validar matrícula
      await enrollmentsService.validateEnrollment(enrollmentToValidate.id, currentUser.id);
      
      // Recarregar lista de matrículas pendentes
      await loadPendingEnrollments();
      
      closeModal();
      
      // Mostrar mensagem de sucesso (opcional)
      alert('Matrícula validada com sucesso! O aluno já pode fazer login.');
    } catch (err) {
      console.error('Erro ao validar matrícula:', err);
      setError(err instanceof Error ? err.message : 'Erro ao validar matrícula. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (enrollmentToReject: Enrollment) => {
    try {
      setLoading(true);
      setError(null);
      
      // Chamar serviço para rejeitar matrícula
      await enrollmentsService.rejectEnrollment(enrollmentToReject.id);
      
      // Recarregar lista de matrículas pendentes
      await loadPendingEnrollments();
      
      closeModal();
      
      // Mostrar mensagem de sucesso (opcional)
      alert('Matrícula rejeitada.');
    } catch (err) {
      console.error('Erro ao rejeitar matrícula:', err);
      setError(err instanceof Error ? err.message : 'Erro ao rejeitar matrícula. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Validar Matrículas</h1>
        <p className="text-brand-gray-500 mt-1">Revise e aprove ou rejeite as matrículas pendentes no sistema.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4 border-b border-brand-gray-200 pb-4">
          <CheckBadgeIcon className="w-6 h-6 text-brand-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-brand-gray-800">Matrículas Pendentes</h2>
            <p className="text-sm text-brand-gray-500">
              {pendingEnrollments.length} {pendingEnrollments.length === 1 ? 'matrícula aguardando' : 'matrículas aguardando'} revisão.
            </p>
          </div>
        </div>

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
            {pendingEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                <div className="flex items-center w-full">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue-100 flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-brand-blue-600" />
                    </div>
                    <div className="flex-1 ml-4">
                        <p className="font-semibold text-brand-gray-800">{enrollment.studentName}</p>
                        <p className="text-sm text-brand-gray-500">{enrollment.courseName}</p>
                    </div>
                </div>
                <button
                  onClick={() => handleReview(enrollment)}
                  className="mt-3 sm:mt-0 w-full sm:w-auto flex-shrink-0 px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-100 transition-colors shadow-sm"
                  aria-label={`Revisar matrícula de ${enrollment.studentName}`}
                >
                  Revisar
                </button>
              </div>
            ))}
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
        />
      )}

    </div>
  );
};

export default ValidateEnrollmentsPage;
