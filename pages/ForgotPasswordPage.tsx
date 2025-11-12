import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SigraLogoIcon } from '../components/icons';
import { passwordResetService } from '../services/password-reset.service';
import { ArrowLeft } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await passwordResetService.requestPasswordReset(email);
      setMessage(response.message);
      setSubmitted(true);
    } catch (error) {
      setMessage('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-blue-600 
                   transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </button>

        {!submitted ? (
          <>
            {/* Título do Card */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Esqueceu sua senha?
              </h2>
              <p className="text-sm text-gray-600">
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
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
                  placeholder="Seu e-mail"
                  className="w-full px-4 py-3 text-[15px] bg-gray-50 border border-gray-200 rounded-lg
                           text-gray-900 placeholder-gray-500
                           focus:outline-none focus:bg-white focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200
                           transition-all duration-200"
                />
              </div>

              {/* Botão de Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-[15px] font-semibold text-white bg-brand-blue-600 rounded-lg
                         hover:bg-brand-blue-700 active:bg-brand-blue-800
                         focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200
                         shadow-sm hover:shadow-md"
              >
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Mensagem de Sucesso */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                E-mail enviado!
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {message}
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Verifique sua caixa de entrada e também a pasta de spam.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 text-[15px] font-semibold text-brand-blue-600 bg-brand-blue-50 rounded-lg
                         hover:bg-brand-blue-100
                         focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2
                         transition-all duration-200"
              >
                Voltar para login
              </button>
            </div>
          </>
        )}
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

export default ForgotPasswordPage;
