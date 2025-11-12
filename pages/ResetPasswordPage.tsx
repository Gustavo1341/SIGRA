import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SigraLogoIcon } from '../components/icons';
import { passwordResetService } from '../services/password-reset.service';
import { Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [token, setToken] = useState<string>('');
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validar token ao carregar a página
  useEffect(() => {
    const validateToken = async () => {
      const tokenParam = searchParams.get('token');
      
      if (!tokenParam) {
        setTokenValid(false);
        setValidatingToken(false);
        return;
      }

      setToken(tokenParam);
      
      const result = await passwordResetService.validateToken(tokenParam);
      setTokenValid(result.valid);
      if (result.email) {
        setUserEmail(result.email);
      }
      setValidatingToken(false);
    };

    validateToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const response = await passwordResetService.resetPassword(token, newPassword);
      
      if (response.success) {
        setSuccess(true);
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (validatingToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-blue-600">
        <div className="flex items-center justify-center gap-3 mb-8">
          <SigraLogoIcon className="w-14 h-auto text-white animate-pulse" />
        </div>
        <p className="text-white text-lg">Validando link...</p>
      </div>
    );
  }

  // Token inválido
  if (!tokenValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-blue-600 animate-fadeIn">
        <div className="flex items-center justify-center gap-3 mb-8">
          <SigraLogoIcon className="w-14 h-auto text-white" />
          <h1 className="text-4xl font-bold text-white tracking-tight">SIGRA</h1>
        </div>

        <div className="w-full max-w-[420px] bg-white rounded-2xl p-10 mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Link inválido ou expirado
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Este link de redefinição de senha não é válido ou já expirou.
            Por favor, solicite um novo link.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full py-3 text-[15px] font-semibold text-white bg-brand-blue-600 rounded-lg
                     hover:bg-brand-blue-700 transition-all duration-200 mb-3"
          >
            Solicitar novo link
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 text-[15px] font-semibold text-brand-blue-600 bg-brand-blue-50 rounded-lg
                     hover:bg-brand-blue-100 transition-all duration-200"
          >
            Voltar para login
          </button>
        </div>
      </div>
    );
  }

  // Sucesso
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-blue-600 animate-fadeIn">
        <div className="flex items-center justify-center gap-3 mb-8">
          <SigraLogoIcon className="w-14 h-auto text-white" />
          <h1 className="text-4xl font-bold text-white tracking-tight">SIGRA</h1>
        </div>

        <div className="w-full max-w-[420px] bg-white rounded-2xl p-10 mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Senha redefinida!
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Sua senha foi redefinida com sucesso. Você já pode fazer login com sua nova senha.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Redirecionando para o login...
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 text-[15px] font-semibold text-white bg-brand-blue-600 rounded-lg
                     hover:bg-brand-blue-700 transition-all duration-200"
          >
            Ir para login
          </button>
        </div>
      </div>
    );
  }

  // Formulário de redefinição
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-blue-600 animate-fadeIn">
      <div className="flex items-center justify-center gap-3 mb-8">
        <SigraLogoIcon className="w-14 h-auto text-white" />
        <h1 className="text-4xl font-bold text-white tracking-tight">SIGRA</h1>
      </div>

      <div className="w-full max-w-[420px] bg-white rounded-2xl p-10 mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Redefinir senha
          </h2>
          <p className="text-sm text-gray-600">
            {userEmail && `Para: ${userEmail}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nova Senha */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova senha"
              className="w-full px-4 py-3 pr-12 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                       transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirmar Senha */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar nova senha"
              className="w-full px-4 py-3 pr-12 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                       transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Requisitos da senha */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>A senha deve ter:</p>
            <ul className="list-disc list-inside pl-2">
              <li className={newPassword.length >= 6 ? 'text-green-600' : ''}>
                Mínimo de 6 caracteres
              </li>
            </ul>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-[15px] font-semibold text-white bg-brand-blue-600 rounded-lg
                     hover:bg-brand-blue-700 active:bg-brand-blue-800
                     focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200
                     shadow-sm hover:shadow-md !mt-6"
          >
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-white/70">
          © 2025 SIGRA. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
