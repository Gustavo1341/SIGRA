
import React, { useState, useEffect } from 'react';
import { User, Role, Course } from '../types';
import { UsersIcon, PencilIcon, TrashIcon } from '../components/icons';
import UserModal from '../components/UserModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { usersService } from '../services/users.service';
import type { AppUser } from '../services/users.service';

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

    // Carregar usuários ao montar o componente
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const appUsers = await usersService.getUsers();
            // Converter AppUser para User (formato da aplicação)
            const convertedUsers: User[] = appUsers.map(convertAppUserToUser);
            setUsers(convertedUsers);
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

      <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 border-b border-brand-gray-200 pb-4 gap-4">
            <div className="flex items-center space-x-3">
                <UsersIcon className="w-6 h-6 text-brand-gray-400" />
                <div>
                    <h2 className="text-xl font-bold text-brand-gray-800">Todos os Usuários</h2>
                    <p className="text-sm text-brand-gray-500">{users.length} usuários cadastrados</p>
                </div>
            </div>
            <button 
                onClick={() => handleOpenUserModal(null)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors shadow"
            >
                Adicionar Usuário
            </button>
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
              users.map((user) => (
              <div key={user.id} className="flex items-center p-3 hover:bg-brand-gray-50 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.avatar}
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
              ))
            )}
        </div>
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
