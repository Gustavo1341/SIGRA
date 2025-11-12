import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  email?: string;
}

// Configuração do EmailJS
// IMPORTANTE: Substitua com suas credenciais do EmailJS
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
};

// Inicializar EmailJS com a public key
if (EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
  //console.log('✅ EmailJS inicializado com sucesso');
} else {
  //console.warn('⚠️ EmailJS não configurado. Configure as variáveis de ambiente VITE_EMAILJS_*');
}

class PasswordResetService {
  /**
   * Solicita redefinição de senha
   * OPÇÃO 1: Usando Supabase Auth (Recomendado - E-mails gratuitos automáticos)
   */
  async requestPasswordResetWithSupabaseAuth(email: string): Promise<PasswordResetResponse> {
    try {
      // Supabase Auth envia e-mail automaticamente!
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (error) {
        console.error('Erro ao solicitar redefinição:', error);
      }

      // Sempre retornar mensagem genérica por segurança
      return {
        success: true,
        message: 'Se uma conta com este e-mail estiver cadastrada, você receberá um link para redefinição de senha.'
      };
    } catch (error) {
      console.error('Erro ao solicitar redefinição:', error);
      return {
        success: true,
        message: 'Se uma conta com este e-mail estiver cadastrada, você receberá um link para redefinição de senha.'
      };
    }
  }

  /**
   * OPÇÃO 2: Usando EmailJS (E-mail real e gratuito)
   */
  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    try {
      // Chamar função do Supabase para criar token
      const { data, error } = await (supabase.rpc as any)('create_password_reset_token', {
        p_email: email
      }) as { data: Array<{ token: string; user_name: string; user_email: string }> | null; error: any };

      if (error) {
        console.error('Erro ao criar token:', error);
        // Por segurança, sempre retornar sucesso
        return {
          success: true,
          message: 'Se uma conta com este e-mail estiver cadastrada, você receberá um link para redefinição de senha.'
        };
      }

      // Se retornou dados, significa que o email existe
      if (data && data.length > 0) {
        const { token, user_name, user_email } = data[0];
        const resetLink = `${window.location.origin}/#/reset-password?token=${token}`;
        
        // Enviar e-mail usando EmailJS
        try {
          // Verificar se EmailJS está configurado
          if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID' || 
              EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID' ||
              EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            throw new Error('EmailJS não configurado. Configure as variáveis de ambiente.');
          }

          const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
              to_email: user_email,
              to_name: user_name,
              reset_link: resetLink,
              from_name: 'SIGRA',
            }
          );
          
          console.log('✅ E-mail de redefinição enviado com sucesso!');
          console.log('   Para:', user_email);
          console.log('   Status:', response.status);
          console.log('   Text:', response.text);
        } catch (emailError: any) {
          console.error('❌ Erro ao enviar e-mail via EmailJS:', emailError);
          
          // Fallback: mostrar no console se EmailJS falhar
          console.log('='.repeat(80));
          console.log('📧 EMAIL DE REDEFINIÇÃO DE SENHA (FALLBACK - MODO DESENVOLVIMENTO)');
          console.log('='.repeat(80));
          console.log(`Para: ${user_email}`);
          console.log(`Nome: ${user_name}`);
          console.log(`\nLink de redefinição:`);
          console.log(resetLink);
          console.log('\nCopie e cole este link no navegador para redefinir a senha.');
          console.log('Este link é válido por 1 hora.');
          console.log('='.repeat(80));
          
          if (emailError.text) {
            console.log('Detalhes do erro:', emailError.text);
          }
        }
      }

      // Sempre retornar mensagem genérica por segurança
      return {
        success: true,
        message: 'Se uma conta com este e-mail estiver cadastrada, você receberá um link para redefinição de senha.'
      };
    } catch (error) {
      console.error('Erro ao solicitar redefinição:', error);
      return {
        success: true,
        message: 'Se uma conta com este e-mail estiver cadastrada, você receberá um link para redefinição de senha.'
      };
    }
  }

  /**
   * Valida token de redefinição
   */
  async validateToken(token: string): Promise<TokenValidationResponse> {
    try {
      const { data, error } = await (supabase.rpc as any)('validate_password_reset_token', {
        p_token: token
      }) as { data: Array<{ valid: boolean; user_id: number; user_email: string }> | null; error: any };

      if (error || !data || data.length === 0) {
        return { valid: false };
      }

      const result = data[0];
      return {
        valid: result.valid,
        email: result.user_email
      };
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return { valid: false };
    }
  }

  /**
   * Redefine a senha usando token válido
   */
  async resetPassword(token: string, newPassword: string): Promise<PasswordResetResponse> {
    try {
      // Validar requisitos da senha
      if (newPassword.length < 6) {
        return {
          success: false,
          message: 'A senha deve ter no mínimo 6 caracteres.'
        };
      }

      const { data, error } = await (supabase.rpc as any)('reset_password', {
        p_token: token,
        p_new_password: newPassword
      }) as { data: boolean | null; error: any };

      if (error) {
        console.error('Erro ao redefinir senha:', error);
        return {
          success: false,
          message: 'Erro ao redefinir senha. Tente novamente.'
        };
      }

      // data retorna boolean indicando sucesso
      if (data) {
        return {
          success: true,
          message: 'Senha redefinida com sucesso! Você já pode fazer login.'
        };
      } else {
        return {
          success: false,
          message: 'Link inválido ou expirado. Por favor, solicite um novo.'
        };
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return {
        success: false,
        message: 'Erro ao redefinir senha. Tente novamente.'
      };
    }
  }
}

export const passwordResetService = new PasswordResetService();
