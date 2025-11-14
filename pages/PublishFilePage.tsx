import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Course, AcademicFile } from '../types';
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { filesService } from '../services/files.service';
import { coursesService } from '../services/courses.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

interface PublishFilePageProps {
  currentUser: User;
  courses: Course[];
  onAddFile: (file: Omit<AcademicFile, 'id' | 'downloads' | 'uploadedAt'>) => void;
}

// Função para gerar semestres automaticamente
const generateSemesters = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-11, então +1
  
  // Determina o semestre atual baseado no mês
  // Janeiro a Junho = semestre 1, Julho a Dezembro = semestre 2
  const currentSemester = currentMonth <= 6 ? 1 : 2;
  const currentPeriod = `${currentYear}.${currentSemester}`;
  
  const semesters = [currentPeriod];
  
  // Adiciona os últimos 5 semestres
  let year = currentYear;
  let semester = currentSemester;
  
  for (let i = 0; i < 5; i++) {
    semester--;
    if (semester < 1) {
      semester = 2;
      year--;
    }
    semesters.push(`${year}.${semester}`);
  }
  
  return semesters;
};

const PublishFilePage: React.FC<PublishFilePageProps> = ({ currentUser, courses, onAddFile }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [author] = useState(currentUser.name);
  const [course] = useState(currentUser.course);
  const [courseId, setCourseId] = useState<number | null>(null);
  const availableSemesters = useMemo(() => generateSemesters(), []);
  const [semester, setSemester] = useState(availableSemesters[0]);
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCourseId = async () => {
      try {
        setIsLoadingCourse(true);
        setError('');
        
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
    return file && title && author && course && semester && subject && courseId !== null;
  }, [file, title, author, course, semester, subject, courseId]);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);
      setError('');
      
      // Lista de tipos de arquivo de texto que podem ser lidos com segurança
      const textFileTypes = [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/json',
        'application/xml',
        'text/xml',
        'text/markdown',
      ];
      
      // Verifica se é um arquivo de texto baseado na extensão
      const textExtensions = ['.txt', '.md', '.json', '.xml', '.html', '.css', '.js', '.ts', '.tsx', '.jsx'];
      const isTextFile = textFileTypes.includes(selectedFile.type) || 
                        textExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
      
      // Se não for arquivo de texto, não tenta ler o conteúdo
      if (!isTextFile) {
        console.log('Arquivo não é de texto, não será lido o conteúdo:', selectedFile.type);
        setFileContent(''); // Deixa vazio para arquivos binários
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        let text = e.target?.result as string;
        
        // CRÍTICO: Remove caracteres nulos (\u0000) que causam erro no PostgreSQL
        // Esses caracteres aparecem em arquivos binários lidos como texto
        if (text) {
          text = text.replace(/\u0000/g, '');
          
          // Remove outros caracteres de controle problemáticos
          text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '');
        }
        
        setFileContent(text || '');
      };
      reader.onerror = () => {
        setError("Não foi possível ler o arquivo. Apenas arquivos de texto são suportados para visualização.");
        setFileContent('');
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

    if (courseId === null || courseId === undefined) {
        console.error('❌ courseId está null/undefined:', courseId);
        console.error('📋 Curso do usuário:', currentUser.course);
        setError('Informações do curso não carregadas. Tente novamente.');
        return;
    }

    console.log('✅ courseId válido:', courseId);

    setIsSubmitting(true);
    setError('');

    try {
      const fileData = {
        title,
        authorId: currentUser.id,
        authorName: author,
        courseId: courseId,
        courseName: course,
        semester,
        subject,
        lastUpdateMessage: `Publicado por ${author}`,
        description: '',
        fileName: file?.name,
        fileType: fileType,
        fileContent: fileContent,
        fileSize: file?.size,
      };

      console.log('🚀 Enviando arquivo para o service:', {
        ...fileData,
        fileContent: fileContent ? `${fileContent.length} caracteres` : null
      });

      // Garantir que a tela de loading apareça por pelo menos 2.5 segundos
      const [newFile] = await Promise.all([
        filesService.createFile(fileData),
        new Promise(resolve => setTimeout(resolve, 2500))
      ]);

      console.log('✅ Arquivo criado com sucesso:', newFile);

      // Desativa o loading
      setIsSubmitting(false);

      console.log('✅ Chamando showToast');
      
      // IMPORTANTE: Mostrar toast ANTES de qualquer outra ação
      showToast('success', 'Arquivo publicado com sucesso!');
      
      console.log('✅ Toast chamado');

      // Atualizar a lista de arquivos DEPOIS do toast
      onAddFile({
        title,
        author,
        course,
        semester,
        subject,
        lastUpdateMessage: `Publicado por ${author}`,
        description: '',
        fileName: file?.name,
        fileType: fileType,
        fileContent: fileContent,
      });

      // Navegar para a página de arquivos após 2 segundos
      setTimeout(() => {
        console.log('✅ Navegando para /my-files');
        navigate('/my-files');
      }, 2000);
    } catch (err) {
      console.error('❌ Erro ao publicar arquivo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao publicar arquivo. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  // Debug: monitorar mudanças de estado
  useEffect(() => {
    console.log('📊 Estado mudou:', { isLoadingCourse, isSubmitting });
  }, [isLoadingCourse, isSubmitting]);

  if (isLoadingCourse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-brand-blue-500 mx-auto animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-brand-gray-800">Carregando...</h2>
          <p className="text-brand-gray-500 mt-2">Preparando formulário de publicação</p>
        </motion.div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          {/* Ícone animado */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Upload className="w-12 h-12 text-white" />
            </div>
            {/* Círculos animados ao redor */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 w-24 h-24 mx-auto border-4 border-blue-400 rounded-full"
            />
          </motion.div>

          {/* Título e descrição */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-brand-gray-800 mb-2"
          >
            Publicando Arquivo...
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-brand-gray-500 mb-8"
          >
            Salvando seu arquivo no repositório
          </motion.p>

          {/* Barra de progresso melhorada */}
          <div className="w-80 mx-auto">
            <div className="bg-brand-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full"
                animate={{ 
                  x: ['-100%', '100%']
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ width: '50%' }}
              />
            </div>
            
            {/* Texto de status */}
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-brand-gray-400 mt-4"
            >
              Aguarde enquanto processamos seu arquivo...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-brand-gray-800 mb-2">
          Publicar Novo Arquivo
        </h1>
        <p className="text-brand-gray-500 text-lg">
          Compartilhe seus trabalhos acadêmicos com a comunidade.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border border-brand-gray-300 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Arquivo</CardTitle>
              <CardDescription>Selecione o arquivo para publicar</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file-selected"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={isSubmitting}
                      className="flex-shrink-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file-upload"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer hover:border-brand-blue-400 hover:bg-brand-blue-50/50 ${
                      isDragging ? 'border-brand-blue-500 bg-brand-blue-50' : 'border-brand-gray-300'
                    }`}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      disabled={isSubmitting}
                      onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                        isDragging ? 'text-brand-blue-600' : 'text-brand-gray-400'
                      }`} />
                      <p className="font-semibold text-brand-gray-700 mb-1">
                        Arraste e solte o arquivo aqui
                      </p>
                      <p className="text-sm text-brand-gray-500 mb-4">ou</p>
                      <span className="inline-block px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors">
                        Selecione o arquivo
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border border-brand-gray-300 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Informações do Trabalho</CardTitle>
              <CardDescription>Preencha os detalhes do arquivo acadêmico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título do Trabalho <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Relatório Final de Computação Gráfica"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">
                  Autor <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  value={author}
                  readOnly
                  disabled
                  className="bg-brand-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">
                    Curso <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="course"
                    value={course}
                    readOnly
                    disabled
                    className="bg-brand-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">
                    Semestre <span className="text-red-500">*</span>
                  </Label>
                  <Select value={semester} onValueChange={setSemester} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSemesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Disciplina <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Digite para buscar ou criar uma nova disciplina"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/my-files')}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="bg-brand-blue-600 hover:bg-brand-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Publicar Arquivo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </form>
    </div>
  );
};

export default PublishFilePage;
