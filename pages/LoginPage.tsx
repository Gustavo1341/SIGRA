import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SigraLogoIcon, MailIcon, LockClosedIcon } from '../components/icons';
import LoadingScreen from './LoadingScreen';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      // Adicionar delay mínimo para mostrar loading screen (800ms)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redirecionar para dashboard após login bem-sucedido
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao realizar login. Tente novamente.');
      }
      setLoading(false);
    }
  };

  // Mostrar tela de carregamento durante login
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-gray-50 animate-fadeIn">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-brand-gray-200">
        <div className="text-center">
            <SigraLogoIcon className="w-20 h-auto mx-auto text-brand-blue-600 mb-4" />
          <h2 className="text-3xl font-bold text-brand-gray-900">
            Bem-vindo ao SIGRA
          </h2>
          <p className="mt-2 text-brand-gray-600">
            Sistema de Gerenciamento de Repositório Acadêmico
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                 <MailIcon className="h-5 w-5 text-brand-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-t-md border border-brand-gray-300 px-3 py-3 pl-10 bg-white text-brand-gray-900 placeholder-brand-gray-500 focus:z-10 focus:border-brand-blue-500 focus:outline-none focus:ring-brand-blue-500 sm:text-sm"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-brand-gray-400" />
                </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-b-md border border-brand-gray-300 px-3 py-3 pl-10 bg-white text-brand-gray-900 placeholder-brand-gray-500 focus:z-10 focus:border-brand-blue-500 focus:outline-none focus:ring-brand-blue-500 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4" role="alert">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-brand-gray-300 text-brand-blue-600 focus:ring-brand-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-brand-gray-900">
                Lembre-se de mim
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-brand-blue-600 hover:text-brand-blue-500">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-blue-600 py-3 px-4 text-sm font-semibold text-white hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
         <p className="mt-6 text-center text-xs text-brand-gray-500">
            &copy; 2025 SIGRA - Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;