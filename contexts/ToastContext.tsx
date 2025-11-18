import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from '../components/Toast';

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message?: string, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    console.log('🔔 Toast adicionado:', { id, type, title, message });
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  }, []);

  const success = useCallback((title: string, message?: string) => {
    showToast('success', title, message);
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast('error', title, message);
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast('warning', title, message);
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast('info', title, message);
  }, [showToast]);

  console.log('📦 Toasts no array:', toasts.length, toasts);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div 
        className="fixed top-4 right-4 pointer-events-none" 
        style={{ zIndex: 9999 }}
      >
        <div className="pointer-events-auto space-y-2">
          {toasts.length > 0 && console.log('🎨 Renderizando', toasts.length, 'toasts')}
          {toasts.map((toast) => {
            console.log('🎨 Mapeando toast:', toast.id);
            return <Toast key={toast.id} {...toast} onClose={removeToast} />;
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
