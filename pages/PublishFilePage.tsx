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
        lastUpdateMessage: `Publicado por ${author}`, // Valor padrão
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

      const newFile = await filesService.createFile(fileData);

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

      navigate('/my-files');
    } catch (err) {
      console.error('Erro ao publicar arquivo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao publicar arquivo. Tente novamente.');
      setIsSubmitting(false);
    }
  };

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
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Upload className="w-16 h-16 text-brand-blue-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-brand-gray-800 mb-2">Publicando Arquivo...</h2>
          <p className="text-brand-gray-500 mb-6">Salvando seu arquivo no repositório</p>
          <div className="mt-6 w-80 mx-auto bg-brand-gray-200 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="bg-brand-blue-500 h-2.5 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
          <p className="text-sm text-brand-gray-400 mt-4">Aguarde enquanto processamos seu arquivo...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full">
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
