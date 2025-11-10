import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { XIcon } from './icons';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id'> & { id?: number }) => void;
  courseToEdit: Course | null;
  isLoading?: boolean;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, courseToEdit, isLoading = false }) => {
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
              <button 
                type="button" 
                onClick={onClose} 
                disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Salvando...' : 'Salvar Curso'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;