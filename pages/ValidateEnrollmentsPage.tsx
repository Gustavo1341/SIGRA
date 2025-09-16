import React, { useState } from 'react';
import { Enrollment, User, Role } from '../types';
import { CheckBadgeIcon, UsersIcon } from '../components/icons';
import ValidationModal from '../components/ValidationModal';

interface ValidateEnrollmentsPageProps {
  enrollments: Enrollment[];
  setEnrollments: React.Dispatch<React.SetStateAction<Enrollment[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const ValidateEnrollmentsPage: React.FC<ValidateEnrollmentsPageProps> = ({ enrollments, setEnrollments, users, setUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  const pendingEnrollments = enrollments.filter(e => e.status === 'pending');

  const handleReview = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnrollment(null);
  };

  const handleValidate = (enrollmentToValidate: Enrollment) => {
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: enrollmentToValidate.studentName,
      email: enrollmentToValidate.email,
      role: Role.Student,
      course: enrollmentToValidate.courseName,
      avatar: enrollmentToValidate.studentName.split(' ').map(n => n[0]).slice(0, 2).join(''),
      matricula: enrollmentToValidate.matricula,
    };
    setUsers(prev => [...prev, newUser]);
    setEnrollments(prev => prev.filter(e => e.id !== enrollmentToValidate.id));
    closeModal();
  };

  const handleReject = (enrollmentToReject: Enrollment) => {
    setEnrollments(prev => prev.filter(e => e.id !== enrollmentToReject.id));
    closeModal();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-gray-800">Validar Matrículas</h1>
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

        {pendingEnrollments.length > 0 ? (
          <div className="space-y-3">
            {pendingEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue-100 flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-brand-blue-600" />
                </div>
                <div className="flex-1 ml-4">
                  <p className="font-semibold text-brand-gray-800">{enrollment.studentName}</p>
                  <p className="text-sm text-brand-gray-500">{enrollment.courseName}</p>
                </div>
                <button
                  onClick={() => handleReview(enrollment)}
                  className="px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-100 transition-colors shadow-sm"
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