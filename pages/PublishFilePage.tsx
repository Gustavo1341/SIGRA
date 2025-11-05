
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Course, AcademicFile } from '../types';
import { CloudArrowUpIcon, DocumentTextIcon, XCircleIcon } from '../components/icons';
import { filesService } from '../services/files.service';
import { coursesService } from '../services/courses.service';

interface PublishFilePageProps {
  currentUser: User;
  courses: Course[];
  onAddFile: (file: Omit<AcademicFile, 'id' | 'downloads' | 'uploadedAt'>) => void;
}

const PublishFilePage: React.FC<PublishFilePageProps> = ({ currentUser, courses, onAddFile }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [author] = useState(currentUser.name);
  const [course] = useState(currentUser.course);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [semester, setSemester] = useState('2024.2');
  const [subject, setSubject] = useState('');
  const [lastUpdateMessage, setLastUpdateMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const navigate = useNavigate();

  // Buscar courseId baseado no courseName do usuário ao montar componente
  useEffect(() => {
    const fetchCourseId = async () => {
      try {
        setIsLoadingCourse(true);
        setError('');
        
        // Buscar todos os cursos e encontrar o que corresponde ao curso do usuário
        const allCourses = await coursesService.getCourses();
        const userCourse = allCourses.find(c => c.name === currentUser.course);
        
        if (userCourse) {
          setCourseId(userCourse.id);
        } else {
          setError('Curso do usuário não encontrado. Entre em contato com o administrador.');
        }
      } catch (err) {
        console.error('Erro ao buscar courseId:', err);
        setError('Erro ao carregar informações do curso. Tente novamente.');
      } finally {
        setIsLoadingCourse(false);
      }
    };

    fetchCourseId();
  }, [currentUser.course]);

  const isFormValid = useMemo(() => {
    return file && title && author && course && semester && subject && lastUpdateMessage && courseId !== null;
  }, [file, title, author, course, semester, subject, lastUpdateMessage, courseId]);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);
      setError('');
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
      };
      reader.onerror = () => {
        setError("Não foi possível ler o arquivo. Apenas arquivos de texto são suportados para visualização.");
        setFile(null);
        setFileContent('');
        setFileType('');
      };
      reader.readAsText(selectedFile);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleRemoveFile = () => {
    setFile(null);
    setFileContent('');
    setFileType('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
        setError('Preencha todos os campos obrigatórios e selecione um arquivo.');
        return;
    }

    if (courseId === null) {
        setError('Informações do curso não carregadas. Tente novamente.');
        return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Criar arquivo usando FilesService com os parâmetros corretos
      const newFile = await filesService.createFile({
        title,
        authorId: currentUser.id,
        authorName: author,
        courseId: courseId,
        courseName: course,
        semester,
        subject,
        lastUpdateMessage,
        description: '',
        fileName: file?.name,
        fileType: fileType,
        fileContent: fileContent,
        fileSize: file?.size,
      });

      // Também adicionar ao estado local (para compatibilidade)
      onAddFile({
        title,
        author,
        course,
        semester,
        subject,
        lastUpdateMessage,
        description: '',
        fileName: file?.name,
        fileType: fileType,
        fileContent: fileContent,
      });

      // Redirecionar imediatamente após sucesso (mantém loading até redirecionamento)
      navigate('/my-files');
    } catch (err) {
      console.error('Erro ao publicar arquivo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao publicar arquivo. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  // Tela de carregamento das informações do curso
  if (isLoadingCourse) {
    return (
        <div className="flex items-center justify-center h-full w-full min-h-[60vh]">
            <div className="text-center p-12 bg-white rounded-2xl border border-brand-gray-200 shadow-lg animate-fadeIn">
                <div className="relative">
                    <svg className="animate-spin h-16 w-16 text-brand-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-brand-gray-800 mt-6">Carregando...</h1>
                <p className="mt-2 text-brand-gray-500">Preparando formulário de publicação</p>
            </div>
        </div>
    );
  }

  // Tela de upload em progresso
  if (isSubmitting) {
    return (
        <div className="flex items-center justify-center h-full w-full min-h-[60vh]">
            <div className="text-center p-12 bg-white rounded-2xl border border-brand-gray-200 shadow-lg animate-fadeIn">
                <div className="relative">
                    <CloudArrowUpIcon className="w-20 h-20 text-brand-blue-500 mx-auto mb-4 animate-bounce" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-16 w-16 text-brand-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-brand-gray-800 mt-8">Publicando Arquivo...</h1>
                <p className="mt-2 text-brand-gray-500">Salvando seu arquivo no repositório</p>
                <p className="mt-1 text-sm text-brand-gray-400">Por favor, aguarde...</p>
                <div className="mt-6 w-full bg-brand-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-brand-blue-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
            </div>
        </div>
    );
  }



  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Publicar Novo Arquivo</h1>
            <p className="text-brand-gray-500 mt-1">Compartilhe seus trabalhos acadêmicos com a comunidade.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - File Upload */}
            <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">Arquivo *</label>
                {file ? (
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-brand-gray-300 text-center">
                        <DocumentTextIcon className="w-12 h-12 text-brand-blue-500 mx-auto"/>
                        <p className="font-semibold mt-2 truncate text-brand-gray-800">{file.name}</p>
                        <p className="text-sm text-brand-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        <button 
                            type="button" 
                            onClick={handleRemoveFile}
                            disabled={isSubmitting || isLoadingCourse}
                            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <XCircleIcon className="w-5 h-5"/>
                            Remover Arquivo
                        </button>
                    </div>
                ) : (
                    <div
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        className={`relative group bg-white p-6 rounded-lg border-2 border-dashed ${isDragging ? 'border-brand-blue-500' : 'border-brand-gray-300'} text-center transition-colors`}
                    >
                        <CloudArrowUpIcon className="w-12 h-12 text-brand-gray-400 group-hover:text-brand-blue-500 mx-auto transition-colors" />
                        <p className="mt-2 font-semibold text-brand-gray-700">Arraste e solte o arquivo aqui</p>
                        <p className="text-sm text-brand-gray-500">ou</p>
                        <label htmlFor="file-upload" className="mt-2 inline-block cursor-pointer px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors shadow">
                            Selecione o arquivo
                        </label>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" disabled={isSubmitting || isLoadingCourse} onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
                    </div>
                )}
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-brand-gray-700">Título do Trabalho *</label>
                        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex: Relatório Final de Computação Gráfica" disabled={isSubmitting || isLoadingCourse} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm text-brand-gray-800 disabled:bg-brand-gray-50 disabled:text-brand-gray-500 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-brand-gray-700">Autor *</label>
                        <input type="text" name="author" id="author" value={author} required readOnly className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm sm:text-sm bg-brand-gray-50 text-brand-gray-500 cursor-not-allowed" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-brand-gray-700">Curso *</label>
                            <select name="course" id="course" value={course} required disabled className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-brand-gray-300 focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm rounded-md bg-brand-gray-50 text-brand-gray-500 cursor-not-allowed">
                                {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-brand-gray-700">Semestre *</label>
                            <select name="semester" id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} required disabled={isSubmitting || isLoadingCourse} className="mt-1 block w-full pl-3 pr-10 py-2 bg-white text-base border-brand-gray-300 focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm rounded-md text-brand-gray-800 disabled:bg-brand-gray-50 disabled:text-brand-gray-500 disabled:cursor-not-allowed">
                                <option>2024.2</option>
                                <option>2024.1</option>
                                <option>2023.2</option>
                                <option>2023.1</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-brand-gray-700">Disciplina *</label>
                        <input type="text" name="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Digite para buscar ou criar uma nova disciplina" disabled={isSubmitting || isLoadingCourse} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm text-brand-gray-800 disabled:bg-brand-gray-50 disabled:text-brand-gray-500 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="lastUpdateMessage" className="block text-sm font-medium text-brand-gray-700">Mensagem de Publicação (Commit) *</label>
                        <input type="text" name="lastUpdateMessage" id="lastUpdateMessage" value={lastUpdateMessage} onChange={(e) => setLastUpdateMessage(e.target.value)} required placeholder="Ex: feat: Adiciona implementação inicial do shader" disabled={isSubmitting || isLoadingCourse} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm text-brand-gray-800 disabled:bg-brand-gray-50 disabled:text-brand-gray-500 disabled:cursor-not-allowed" />
                    </div>
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-brand-gray-200">
                    <button 
                        type="button" 
                        onClick={() => navigate('/my-files')}
                        disabled={isSubmitting || isLoadingCourse}
                        className="px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={!isFormValid || isSubmitting || isLoadingCourse}
                        className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 shadow disabled:bg-brand-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publicando...
                            </>
                        ) : (
                            'Publicar Arquivo'
                        )}
                    </button>
                </div>
            </div>
        </form>
    </div>
  );
};

export default PublishFilePage;
