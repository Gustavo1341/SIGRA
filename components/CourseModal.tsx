import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { XIcon } from './icons';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id'> & { id?: number }) => void;
  courseToEdit: Course | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, courseToEdit }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const isEditing = courseToEdit !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({ name: courseToEdit.name, description: courseToEdit.description });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [courseToEdit, isEditing, isOpen]);
  
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: courseToEdit?.id });
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true"></div>
      <div className="relative w-full max-w-lg m-4 bg-white rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-gray-200">
              <h2 className="text-lg font-bold text-brand-gray-800">
                {isEditing ? 'Editar Curso' : 'Adicionar Novo Curso'}
              </h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-brand-gray-400 hover:bg-brand-gray-100">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Nome do Curso</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-white text-brand-gray-900" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-brand-gray-700">Descrição</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-white text-brand-gray-900" />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-brand-gray-200">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-50">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 shadow">
                Salvar Curso
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;