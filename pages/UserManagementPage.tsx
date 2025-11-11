
import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, Course } from '../types';
import { UsersIcon, PencilIcon, TrashIcon, SearchIcon } from '../components/icons';
import UserModal from '../components/UserModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { usersService } from '../services/users.service';
import type { AppUser, UserFilters } from '../services/users.service';

interface UserManagementPageProps {
  currentUser: User;
  courses: Course[];
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ currentUser, courses }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    
    // Filtros
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'student'>('all');
    const [courseFilter, setCourseFilter] = useState<number | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    
    // Paginação
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 50;

    // Debounce para busca (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Carregar usuários quando filtros mudarem
    useEffect(() => {
        setCurrentPage(0); // Reset page when filters change
        loadUsers();
    }, [roleFilter, courseFilter, debouncedSearchTerm]);

    // Carregar usuários quando página mudar
    useEffect(() => {
        loadUsers();
    }, [currentPage]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Construir filtros
            const filters: UserFilters = {};
            
            if (roleFilter !== 'all') {
                filters.role = roleFilter;
            }
            
            if (courseFilter !== 'all') {
                filters.courseId = courseFilter;
            }
            
            if (debouncedSearchTerm.trim()) {
                filters.search = debouncedSearchTerm.trim();
            }
            
            // Adicionar paginação
            filters.limit = ITEMS_PER_PAGE;
            filters.offset = currentPage * ITEMS_PER_PAGE;
            
            const appUsers = await usersService.getUsers(filters);
            // Converter AppUser para User (formato da aplicação)
            const convertedUsers: User[] = appUsers.map(convertAppUserToUser);
            setUsers(convertedUsers);
            
            // Verificar se há mais resultados
            setHasMore(appUsers.length === ITEMS_PER_PAGE);
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
        } finally {
            setIsLoading(false);
        }
    };

    const convertAppUserToUser = (appUser: AppUser): User => {
        return {
            id: appUser.id,
            name: appUser.name,
            email: appUser.email,
            role: appUser.role,
            course: appUser.course,
            avatar: appUser.avatar,
            matricula: appUser.matricula,
        };
    };

    const handleOpenUserModal = (user: User | null) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleCloseUserModal = () => {
        setSelectedUser(null);
        setIsUserModalOpen(false);
    };
    
    const handleOpenDeleteModal = (user: User) => {
        if (user.id === currentUser.id) {
            alert("Você não pode excluir sua própria conta.");
            return;
        }
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedUser(null);
        setIsDeleteModalOpen(false);
    };

    const handleSaveUser = async (userToSave: Omit<User, 'id' | 'avatar'> & { id?: number }) => {
        try {
            setError(null);
            
            // Encontrar o courseId baseado no nome do curso
            const course = courses.find(c => c.name === userToSave.course);
            const courseId = course?.id;

            if (userToSave.id) { 
                // Editando usuário existente
                const updateData: any = {
                    name: userToSave.name,
                    email: userToSave.email,
                    role: userToSave.role === Role.Admin ? 'admin' : 'student',
                    courseId: courseId,
                    matricula: userToSave.matricula,
                };
                
                // Só incluir senha se foi fornecida
                if (userToSave.password) {
                    updateData.password = userToSave.password;
                }
                
                await usersService.updateUser(userToSave.id, updateData);
            } else { 
                // Adicionando novo usuário
                if (!userToSave.password) {
                    alert('Senha é obrigatória para novos usuários.');
                    return;
                }
                
                await usersService.createUser({
                    name: userToSave.name,
                    email: userToSave.email,
                    password: userToSave.password,
                    role: userToSave.role === Role.Admin ? 'admin' : 'student',
                    courseId: courseId,
                    matricula: userToSave.matricula,
                });
            }
            
            // Recarregar lista de usuários
            await loadUsers();
            handleCloseUserModal();
        } catch (err) {
            console.error('Erro ao salvar usuário:', err);
            alert(err instanceof Error ? err.message : 'Erro ao salvar usuário');
        }
    };

    const handleDeleteUser = async () => {
        if (selectedUser) {
            if (selectedUser.id === currentUser.id) {
                alert("Você não pode excluir sua própria conta.");
                handleCloseDeleteModal();
                return;
            }
            
            try {
                setError(null);
                await usersService.deleteUser(selectedUser.id);
                await loadUsers();
                handleCloseDeleteModal();
            } catch (err) {
                console.error('Erro ao deletar usuário:', err);
                alert(err instanceof Error ? err.message : 'Erro ao deletar usuário');
                handleCloseDeleteModal();
            }
        }
    };


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Gestão de Usuários</h1>
        <p className="text-brand-gray-500 mt-1">Adicione, edite ou remova usuários do sistema.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-brand-gray-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 border-b border-brand-gray-200 pb-4 gap-4">
            <div className="flex items-center space-x-3">
                <UsersIcon className="w-6 h-6 text-brand-gray-400" />
                <div>
                    <h2 className="text-xl font-bold text-brand-gray-800">Todos os Usuários</h2>
                    <p className="text-sm text-brand-gray-500">{users.length} usuários {isLoading ? 'carregando...' : 'encontrados'}</p>
                </div>
            </div>
            <button 
                onClick={() => handleOpenUserModal(null)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors"
            >
                Adicionar Usuário
            </button>
        </div>

        {/* Filtros e Busca */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca por nome ou email */}
            <div className="relative">
              <label htmlFor="search" className="block text-sm font-medium text-brand-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-gray-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro por role */}
            <div>
              <label htmlFor="roleFilter" className="block text-sm font-medium text-brand-gray-700 mb-1">
                Tipo de Usuário
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'student')}
                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="admin">Administradores</option>
                <option value="student">Alunos</option>
              </select>
            </div>

            {/* Filtro por curso */}
            <div>
              <label htmlFor="courseFilter" className="block text-sm font-medium text-brand-gray-700 mb-1">
                Curso
              </label>
              <select
                id="courseFilter"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Cursos</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão para limpar filtros */}
          {(roleFilter !== 'all' || courseFilter !== 'all' || searchTerm) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setRoleFilter('all');
                  setCourseFilter('all');
                  setSearchTerm('');
                  setCurrentPage(0);
                }}
                className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-brand-gray-500">
                Carregando usuários...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-brand-gray-500">
                Nenhum usuário encontrado.
              </div>
            ) : (
              users.map((user) => {
                const nameParts = user.name.trim().split(' ');
                const initials = nameParts.length >= 2 
                  ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
                  : nameParts[0].charAt(0).toUpperCase();
                
                return (
              <div key={user.id} className="flex items-center p-3 hover:bg-brand-gray-50 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                </div>
                <div className="flex-1 ml-4 grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-2">
                    <div className="md:col-span-4">
                        <p className="font-semibold text-brand-gray-800">{user.name}</p>
                        <p className="text-sm text-brand-gray-500">{user.email}</p>
                    </div>
                    <div className="md:col-span-4">
                        <p className="text-sm text-brand-gray-600">{user.course}</p>
                    </div>
                    <div className="md:col-span-2">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${user.role === Role.Admin ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role === Role.Admin ? 'Administrador' : 'Aluno'}
                        </span>
                    </div>
                    <div className="md:col-span-2 flex justify-start md:justify-end space-x-2">
                        <button onClick={() => handleOpenUserModal(user)} className="p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-100 rounded-md" aria-label={`Editar ${user.name}`}>
                            <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleOpenDeleteModal(user)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md" aria-label={`Excluir ${user.name}`}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
              </div>
                );
              })
            )}
        </div>

        {/* Pagination controls */}
        {!isLoading && users.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 mt-4 border-t border-brand-gray-200">
            <div className="text-sm text-brand-gray-600">
              Página {currentPage + 1} {hasMore && '(mais resultados disponíveis)'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === 0
                    ? 'bg-brand-gray-100 text-brand-gray-400 cursor-not-allowed'
                    : 'bg-white text-brand-gray-700 border border-brand-gray-300 hover:bg-brand-gray-50'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!hasMore}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  !hasMore
                    ? 'bg-brand-gray-100 text-brand-gray-400 cursor-not-allowed'
                    : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700'
                }`}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isUserModalOpen && (
        <UserModal 
            isOpen={isUserModalOpen}
            onClose={handleCloseUserModal}
            onSave={handleSaveUser}
            userToEdit={selectedUser}
            courses={courses}
        />
      )}

      {isDeleteModalOpen && selectedUser && (
        <ConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleDeleteUser}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja excluir o usuário "${selectedUser.name}"? Esta ação não pode ser desfeita.`}
            confirmButtonText="Excluir"
        />
      )}

    </div>
  );
};

export default UserManagementPage;
