
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Course, User, AcademicFile, Role } from '../types';
import { BookOpenIcon, PencilIcon, TrashIcon, UsersIcon, DocumentTextIcon, PlusIcon } from '../components/icons';
import CourseModal from '../components/CourseModal';
import ConfirmationModal from '../components/ConfirmationModal';

interface AllCoursesPageProps {
  currentUser: User;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  files: AcademicFile[];
  setFiles: React.Dispatch<React.SetStateAction<AcademicFile[]>>;
}

const AllCoursesPage: React.FC<AllCoursesPageProps> = ({ currentUser, courses, setCourses, users, setUsers, files, setFiles }) => {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const isAdmin = currentUser.role === Role.Admin;

  const courseStats = useMemo(() => {
    const stats: { [key: number]: { studentCount: number; fileCount: number } } = {};
    courses.forEach(course => {
      stats[course.id] = {
        studentCount: users.filter(u => u.course === course.name).length,
        fileCount: files.filter(f => f.course === course.name).length,
      };
    });
    return stats;
  }, [courses, users, files]);

  const handleOpenCourseModal = (course: Course | null) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setSelectedCourse(null);
    setIsCourseModalOpen(false);
  };

  const handleOpenDeleteModal = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedCourse(null);
    setIsDeleteModalOpen(false);
  };

  const handleSaveCourse = (courseToSave: Omit<Course, 'id'> & { id?: number }) => {
    if (courseToSave.id) { // Editing
      const oldCourse = courses.find(c => c.id === courseToSave.id);
      if (oldCourse && oldCourse.name !== courseToSave.name) {
        // Sync name across users and files
        setUsers(users.map(u => u.course === oldCourse.name ? { ...u, course: courseToSave.name } : u));
        setFiles(files.map(f => f.course === oldCourse.name ? { ...f, course: courseToSave.name } : f));
      }
      setCourses(courses.map(c => c.id === courseToSave.id ? { ...c, ...courseToSave } as Course : c));
    } else { // Adding
      const newCourse: Course = {
        ...courseToSave,
        id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
        description: courseToSave.description || '',
        name: courseToSave.name || '',
      };
      setCourses([...courses, newCourse]);
    }
    handleCloseCourseModal();
  };
  
  const handleDeleteCourse = () => {
    if (selectedCourse) {
      setCourses(courses.filter(c => c.id !== selectedCourse.id));
    }
    handleCloseDeleteModal();
  };

  const canDeleteCourse = selectedCourse ? (courseStats[selectedCourse.id]?.studentCount === 0 && courseStats[selectedCourse.id]?.fileCount === 0) : false;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Todos os Cursos</h1>
        <p className="text-brand-gray-500 mt-1">
          {isAdmin ? 'Gerencie os cursos disponíveis no sistema acadêmico.' : 'Explore os cursos oferecidos pela instituição.'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-brand-gray-200 pb-4">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="w-6 h-6 text-brand-gray-400" />
            <div>
              <h2 className="text-xl font-bold text-brand-gray-800">Cursos Disponíveis</h2>
              <p className="text-sm text-brand-gray-500">{courses.length} cursos cadastrados</p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => handleOpenCourseModal(null)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors shadow"
            >
              <PlusIcon className="w-5 h-5"/>
              Adicionar Curso
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-brand-gray-50 border border-brand-gray-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-md hover:border-brand-blue-200 transition-all duration-200">
              <div>
                 <Link to={`/explore/${encodeURIComponent(course.name)}`}>
                    <h3 className="font-bold text-lg text-brand-gray-800 hover:text-brand-blue-600 transition-colors">{course.name}</h3>
                </Link>
                <p className="text-sm text-brand-gray-600 mt-1 h-20 overflow-hidden">{course.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-gray-200">
                <div className="flex items-center justify-between text-sm text-brand-gray-500">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    <span>{courseStats[course.id]?.studentCount || 0} Alunos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>{courseStats[course.id]?.fileCount || 0} Arquivos</span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => handleOpenCourseModal(course)} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-md border border-brand-gray-300 hover:bg-brand-gray-100 transition-colors">
                      <PencilIcon className="w-4 h-4" /> Editar
                    </button>
                     <button onClick={() => handleOpenDeleteModal(course)} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-md border border-red-200 hover:bg-red-100 transition-colors">
                      <TrashIcon className="w-4 h-4" /> Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCourseModalOpen && (
        <CourseModal 
            isOpen={isCourseModalOpen}
            onClose={handleCloseCourseModal}
            onSave={handleSaveCourse}
            courseToEdit={selectedCourse}
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
                        <p className="text-xs p-2 bg-yellow-50 text-yellow-800 rounded-md">Motivo: Existem alunos ou arquivos associados a este curso. Remova-os ou reatribua-os antes de tentar excluir o curso novamente.</p>
                    </div>
                )
            }
            confirmButtonText={canDeleteCourse ? "Excluir" : "Entendi"}
            variant={canDeleteCourse ? 'danger' : 'info'}
        />
      )}

    </div>
  );
};

export default AllCoursesPage;
