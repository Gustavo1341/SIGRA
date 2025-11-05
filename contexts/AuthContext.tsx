import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'sigra_session';
const SESSION_EXPIRY_KEY = 'sigra_session_expiry';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sessão ao carregar a aplicação
  useEffect(() => {
    const restoreSession = () => {
      try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        const sessionExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);

        if (sessionData && sessionExpiry) {
          const expiryTime = parseInt(sessionExpiry, 10);
          const now = Date.now();

          // Verificar se a sessão ainda é válida
          if (now < expiryTime) {
            const user: User = JSON.parse(sessionData);
            setCurrentUser(user);
            console.log('Sessão restaurada:', user.email);
          } else {
            // Sessão expirada, limpar dados
            console.log('Sessão expirada, fazendo logout');
            clearSession();
          }
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const saveSession = (user: User) => {
    try {
      const expiryTime = Date.now() + SESSION_DURATION;
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
      console.log('Sessão salva:', user.email);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  };

  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      console.log('Sessão limpa');
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Chamar serviço de autenticação
      const authUser = await authService.login({ email, password });

      // Converter para formato User
      const user: User = {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        course: authUser.course,
        avatar: authUser.avatar,
        matricula: authUser.matricula,
      };

      // Salvar sessão e atualizar estado
      saveSession(user);
      setCurrentUser(user);
    } catch (error) {
      // Re-lançar erro para ser tratado no componente
      throw error;
    }
  };

  const logout = () => {
    clearSession();
    setCurrentUser(null);
    console.log('Logout realizado');
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
    saveSession(user);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
