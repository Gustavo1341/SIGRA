
import React, { useState } from 'react';
import { User, Role, Course } from '../types';
import { UsersIcon, PencilIcon, TrashIcon } from '../components/icons';
import UserModal from '../components/UserModal';
import ConfirmationModal from '../components/ConfirmationModal';

interface UserManagementPageProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User;
  courses: Course[];
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ users, setUsers, currentUser, courses }) => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

    const handleSaveUser = (userToSave: Omit<User, 'id' | 'avatar'> & { id?: number }) => {
        if (userToSave.id) { // Editing existing user
            setUsers(users.map(u => u.id === userToSave.id ? { ...u, ...userToSave } : u));
        } else { // Adding new user
            const newUser: User = {
                ...userToSave,
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                avatar: userToSave.name.split(' ').map(n => n[0]).slice(0, 2).join(''),
            };
            setUsers([...users, newUser]);
        }
        handleCloseUserModal();
    };

    const handleDeleteUser = () => {
        if (selectedUser) {
            if (selectedUser.id === currentUser.id) {
                alert("Ação não permitida.");
                handleCloseDeleteModal();
                return;
            }
            setUsers(users.filter(u => u.id !== selectedUser.id));
        }
        handleCloseDeleteModal();
    };


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Gestão de Usuários</h1>
        <p className="text-brand-gray-500 mt-1">Adicione, edite ou remova usuários do sistema.</p>
      </div>

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
            {users.map((user) => (
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
            ))}
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
