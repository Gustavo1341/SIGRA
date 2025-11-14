
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Course, User, Role } from '../types';
import { BookOpenIcon, PencilIcon, TrashIcon, UsersIcon, DocumentTextIcon, PlusIcon } from '../components/icons';
import CourseModal from '../components/CourseModal';
import ConfirmationModal from '../components/ConfirmationModal';
import SkeletonLoader from '../components/SkeletonLoader';
import { coursesService, CourseWithStats } from '../services/courses.service';
import { useToast } from '../contexts/ToastContext';

interface AllCoursesPageProps {
  currentUser: User;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  files: any[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
}

const AllCoursesPage: React.FC<AllCoursesPageProps> = ({ currentUser }) => {
  const [coursesWithStats, setCoursesWithStats] = useState<CourseWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithStats | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  const isAdmin = currentUser.role === Role.Admin;

  // Carregar cursos com estatísticas ao montar o componente
  useEffect(() => {
    loadCoursesWithStats();
  }, []);

  const loadCoursesWithStats = async () => {
    try {
      setLoading(true);
      const data = await coursesService.getCoursesWithStats();
      setCoursesWithStats(data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      toast.error('Erro ao carregar cursos', error instanceof Error ? error.message : 'Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCourseModal = (course: CourseWithStats | null) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setSelectedCourse(null);
    setIsCourseModalOpen(false);
  };

  const handleOpenDeleteModal = (course: CourseWithStats) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedCourse(null);
    setIsDeleteModalOpen(false);
  };

  const handleSaveCourse = async (courseToSave: Omit<Course, 'id'> & { id?: number }) => {
    try {
      setActionLoading(true);
      
      if (courseToSave.id) {
        // Editando curso existente
        await coursesService.updateCourse(courseToSave.id, {
          name: courseToSave.name,
          description: courseToSave.description,
        });
        toast.success('Curso atualizado', 'O curso foi atualizado com sucesso.');
      } else {
        // Criando novo curso
        await coursesService.createCourse({
          name: courseToSave.name,
          description: courseToSave.description,
        });
        toast.success('Curso criado', 'O curso foi criado com sucesso.');
      }
      
      // Recarregar lista de cursos
      await loadCoursesWithStats();
      handleCloseCourseModal();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      toast.error('Erro ao salvar curso', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      setActionLoading(true);
      await coursesService.deleteCourse(selectedCourse.id);
      toast.success('Curso excluído', 'O curso foi excluído com sucesso.');
      
      // Recarregar lista de cursos
      await loadCoursesWithStats();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      toast.error('Erro ao deletar curso', error instanceof Error ? error.message : 'Tente novamente.');
      setActionLoading(false);
    }
  };

  const canDeleteCourse = selectedCourse ? (selectedCourse.studentCount === 0 && selectedCourse.fileCount === 0) : false;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Todos os Cursos</h1>
        <p className="text-brand-gray-500 mt-1">
          {isAdmin ? 'Gerencie os cursos disponíveis no sistema acadêmico.' : 'Explore os cursos oferecidos pela instituição.'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand-gray-300">
        <div className="flex items-center justify-between mb-4 border-b border-brand-gray-200 pb-4">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="w-6 h-6 text-brand-gray-400" />
            <div>
              <h2 className="text-xl font-bold text-brand-gray-800">Cursos Disponíveis</h2>
              <p className="text-sm text-brand-gray-500">
                {loading ? 'Carregando...' : `${coursesWithStats.length} cursos cadastrados`}
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => handleOpenCourseModal(null)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5"/>
              Adicionar Curso
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-brand-gray-50 border border-brand-gray-200 rounded-lg p-5">
                <SkeletonLoader className="h-6 w-3/4 mb-2" />
                <SkeletonLoader className="h-4 w-full mb-1" />
                <SkeletonLoader className="h-4 w-full mb-1" />
                <SkeletonLoader className="h-4 w-2/3" />
                <div className="mt-4 pt-4 border-t border-brand-gray-200">
                  <SkeletonLoader className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : coursesWithStats.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-brand-gray-300 mx-auto mb-4" />
            <p className="text-brand-gray-500 text-lg">Nenhum curso cadastrado</p>
            {isAdmin && (
              <p className="text-brand-gray-400 text-sm mt-2">Clique em "Adicionar Curso" para começar</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithStats.map(course => (
              <div key={course.id} className="bg-brand-gray-50 border border-brand-gray-200 rounded-lg overflow-hidden hover:border-brand-blue-200 transition-all duration-200 flex flex-col">
                <Link to={`/explore/${encodeURIComponent(course.name)}`} className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-brand-gray-800 hover:text-brand-blue-600 transition-colors">{course.name}</h3>
                    <p className="text-sm text-brand-gray-600 mt-1 h-20 overflow-hidden">{course.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-gray-200">
                    <div className="flex items-center justify-between text-sm text-brand-gray-500 mb-2">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" />
                        <span>{course.studentCount} Alunos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4" />
                        <span>{course.fileCount} Arquivos</span>
                      </div>
                    </div>
                    <div className="text-xs text-brand-gray-400 mb-3">
                      {course.totalDownloads} downloads totais
                    </div>
                  </div>
                </Link>
                {isAdmin && (
                  <div className="flex items-center gap-2 px-5 pb-5">
                    <button 
                      onClick={() => handleOpenCourseModal(course)} 
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-md border border-brand-gray-300 hover:bg-brand-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PencilIcon className="w-4 h-4" /> Editar
                    </button>
                    <button 
                      onClick={() => handleOpenDeleteModal(course)} 
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-md border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="w-4 h-4" /> Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isCourseModalOpen && (
        <CourseModal 
            isOpen={isCourseModalOpen}
            onClose={handleCloseCourseModal}
            onSave={handleSaveCourse}
            courseToEdit={selectedCourse ? {
              id: selectedCourse.id,
              name: selectedCourse.name,
              description: selectedCourse.description
            } : null}
            isLoading={actionLoading}
        />
      )}

      {isDeleteModalOpen && selectedCourse && (
        <ConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={canDeleteCourse ? handleDeleteCourse : handleCloseDeleteModal}
            title={canDeleteCourse ? "Confirmar Exclusão" : "Ação Bloqueada"}
            message={
                canDeleteCourse ? (
                    `Tem certeza que deseja excluir o curso "${selectedCourse.name}"? Esta ação não pode ser desfeita.`
                ) : (
                    <div className="space-y-2">
                        <p>O curso <span className="font-bold">"{selectedCourse.name}"</span> não pode ser excluído.</p>
                        <p className="text-xs p-2 bg-yellow-50 text-yellow-800 rounded-md">
                          Motivo: Existem {selectedCourse.studentCount} aluno(s) e {selectedCourse.fileCount} arquivo(s) associados a este curso. 
                          Remova-os ou reatribua-os antes de tentar excluir o curso novamente.
                        </p>
                    </div>
                )
            }
            confirmButtonText={canDeleteCourse ? "Excluir" : "Entendi"}
            variant={canDeleteCourse ? 'danger' : 'info'}
            isLoading={actionLoading}
        />
      )}

    </div>
  );
};

export default AllCoursesPage;
