import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SigraLogoIcon } from '../components/icons';
import { enrollmentsService } from '../services/enrollments.service';
import { supabase } from '../lib/supabase';

interface Course {
  id: number;
  name: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollment: '',
    courseId: '',
    password: '',
    confirmPassword: '',
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Carregar cursos disponíveis
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.courseId) {
      setError('Selecione um curso');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Validar se o email já existe na tabela users
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email.toLowerCase().trim())
        .single();

      if (userError && userError.code !== 'PGRST116') {
        // PGRST116 = nenhum resultado encontrado (o que é bom)
        throw new Error('Erro ao verificar email. Tente novamente.');
      }

      if (existingUser) {
        setError('Este email já está cadastrado no sistema. Por favor, utilize outro email ou faça login.');
        setLoading(false);
        return;
      }

      // Validar se o email já existe na tabela enrollments
      const { data: existingEnrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('email')
        .eq('email', formData.email.toLowerCase().trim())
        .single();

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar email. Tente novamente.');
      }

      if (existingEnrollment) {
        setError('Já existe uma solicitação de acesso com este email. Aguarde a aprovação ou utilize outro email.');
        setLoading(false);
        return;
      }

      const selectedCourse = courses.find((c) => c.id === parseInt(formData.courseId));
      if (!selectedCourse) {
        throw new Error('Curso não encontrado');
      }

      await enrollmentsService.createEnrollment({
        studentName: formData.name,
        email: formData.email,
        matricula: formData.enrollment,
        courseId: parseInt(formData.courseId),
        courseName: selectedCourse.name,
      });

      setSuccess(true);

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao solicitar acesso. Tente novamente.');
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-blue-600 animate-fadeIn">
        <div className="w-full max-w-[420px] bg-white rounded-2xl p-10 mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Solicitação enviada!
          </h2>
          <p className="text-gray-600 mb-2">
            Sua solicitação de acesso foi enviada com sucesso.
          </p>
          <p className="text-sm text-gray-500">
            Aguarde a aprovação do administrador para acessar o sistema.
          </p>
          <p className="text-xs text-gray-400 mt-6">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-blue-600 animate-fadeIn">
      {/* Logo e Nome no topo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <SigraLogoIcon className="w-14 h-auto text-white" />
        <h1 className="text-4xl font-bold text-white tracking-tight">SIGRA</h1>
      </div>

      {/* Card Branco */}
      <div className="w-full max-w-[580px] bg-white rounded-2xl p-8 mx-4">
        {/* Título do Card */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Solicitar acesso
          </h2>
          <p className="text-sm text-gray-600">
            Preencha seus dados para solicitar acesso ao sistema
          </p>
        </div>

        {/* Formulário com Bento Grid */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Grid 2 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Campo Nome - ocupa 2 colunas */}
            <div className="sm:col-span-2">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome completo"
                className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-900 placeholder-gray-500
                         focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                         transition-all duration-200"
              />
            </div>

            {/* Campo Email */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-900 placeholder-gray-500
                         focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                         transition-all duration-200"
              />
            </div>

            {/* Campo Matrícula */}
            <div>
              <input
                id="enrollment"
                name="enrollment"
                type="text"
                required
                value={formData.enrollment}
                onChange={handleChange}
                placeholder="Matrícula"
                className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-900 placeholder-gray-500
                         focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                         transition-all duration-200"
              />
            </div>

            {/* Campo Curso - ocupa 2 colunas */}
            <div className="sm:col-span-2">
              <select
                id="courseId"
                name="courseId"
                required
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-900
                         focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                         transition-all duration-200"
              >
                <option value="">Selecione seu curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo Senha */}
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Senha"
                className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-900 placeholder-gray-500
                         focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                         transition-all duration-200"
              />
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar senha"
                className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-900 placeholder-gray-500
                         focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                         transition-all duration-200"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Botão de Registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 text-[15px] font-semibold text-white bg-brand-blue-600 rounded-lg
                     hover:bg-brand-blue-700 active:bg-brand-blue-800
                     focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200
                     shadow-sm hover:shadow-md"
          >
            {loading ? 'Enviando...' : 'Solicitar acesso'}
          </button>

          {/* Link para Login */}
          <div className="text-center pt-3">
            <span className="text-sm text-gray-600">Já tem acesso? </span>
            <a
              href="/login"
              className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium
                       transition-colors duration-200"
            >
              Fazer login
            </a>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-white/70">
          © 2025 SIGRA. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
