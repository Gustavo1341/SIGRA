import React, { useState, useEffect } from 'react';
import { User, Role, Course } from '../types';
import { XIcon } from './icons';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'avatar'> & { id?: number }) => void;
  userToEdit: User | null;
  courses: Course[];
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, userToEdit, courses }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    role: Role.Student,
    password: '',
    matricula: '',
  });

  const isEditing = userToEdit !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        course: userToEdit.course,
        role: userToEdit.role,
        password: '',
        matricula: userToEdit.matricula || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        course: courses.length > 0 ? courses[0].name : '',
        role: Role.Student,
        password: '',
        matricula: ''
      });
    }
  }, [userToEdit, isEditing, isOpen, courses]);
  
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'role' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData, id: userToEdit?.id };
    if (!isEditing && !dataToSave.password) {
        alert("Senha é obrigatória para novos usuários.");
        return;
    }
    if (isEditing && !dataToSave.password) {
        delete dataToSave.password; // Do not send password if empty on edit
    }
    if (dataToSave.role === Role.Admin) {
        dataToSave.matricula = '';
    }
    onSave(dataToSave);
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true"></div>
      <div className="relative w-full max-w-lg m-4 bg-white rounded-2xl border border-brand-gray-300">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-gray-200">
              <h2 className="text-lg font-bold text-brand-gray-800">
                {isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-brand-gray-400 hover:bg-brand-gray-100">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Nome Completo</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-white text-brand-gray-900" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-white text-brand-gray-900" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-brand-gray-700">Perfil de Acesso</label>
                <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-brand-gray-300 focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm rounded-md bg-white text-brand-gray-900">
                  <option value={Role.Student}>Aluno</option>
                  <option value={Role.Admin}>Administrador</option>
                </select>
              </div>
              {formData.role === Role.Student && (
                  <div>
                    <label htmlFor="matricula" className="block text-sm font-medium text-brand-gray-700">N° Matrícula</label>
                    <input type="text" name="matricula" id="matricula" value={formData.matricula} onChange={handleChange} required={formData.role === Role.Student} className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-white text-brand-gray-900" />
                  </div>
              )}
               <div>
                <label htmlFor="course" className="block text-sm font-medium text-brand-gray-700">Curso</label>
                <select name="course" id="course" value={formData.course} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-brand-gray-300 focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm rounded-md bg-white text-brand-gray-900">
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brand-gray-700">
                  Senha {isEditing && <span className="text-brand-gray-500 font-normal">(deixe em branco para manter a atual)</span>}
                </label>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required={!isEditing}
                  placeholder={isEditing ? "Digite uma nova senha para alterar" : ""}
                  className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-white text-brand-gray-900" 
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-brand-gray-200">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-50">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700">
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;