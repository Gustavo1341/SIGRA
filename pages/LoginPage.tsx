import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SigraLogoIcon } from '../components/icons';
import LoadingScreen from './LoadingScreen';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      await new Promise(resolve => setTimeout(resolve, 800));
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-blue-600 animate-fadeIn">
      {/* Logo e Nome no topo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <SigraLogoIcon className="w-14 h-auto text-white" />
        <h1 className="text-4xl font-bold text-white tracking-tight">
          SIGRA
        </h1>
      </div>

      {/* Card Branco */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl p-10 mx-4">
        {/* Título do Card */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Acesse sua conta
          </h2>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                       transition-all duration-200"
            />
          </div>

          {/* Campo Senha */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                       transition-all duration-200"
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-[15px] font-semibold text-white bg-brand-blue-600 rounded-lg
                     hover:bg-brand-blue-700 active:bg-brand-blue-800
                     focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200
                     shadow-sm hover:shadow-md !mt-4"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Links */}
          <div className="space-y-1 !mt-3">
            {/* Link Esqueceu a Senha */}
            <div className="text-center">
              <a 
                href="#" 
                className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium
                         transition-colors duration-200"
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Divisor */}
            <div className="relative py-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400">ou</span>
              </div>
            </div>

            {/* Link para Registro */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Novo por aqui?{' '}
                <a
                  href="#/register"
                  className="text-brand-blue-600 hover:text-brand-blue-700 font-medium
                           transition-colors duration-200"
                >
                  Solicitar acesso
                </a>
              </p>
            </div>
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

export default LoginPage;