import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from './icons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  console.log('🎨 Toast renderizado:', { id, type, title });
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircleIcon className="w-5 h-5" />,
      bgColor: 'bg-brand-success-50',
      borderColor: 'border-brand-success-500',
      iconColor: 'text-brand-success-600',
      textColor: 'text-brand-success-900',
    },
    error: {
      icon: <XCircleIcon className="w-5 h-5" />,
      bgColor: 'bg-brand-error-50',
      borderColor: 'border-brand-error-500',
      iconColor: 'text-brand-error-600',
      textColor: 'text-brand-error-900',
    },
    warning: {
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      bgColor: 'bg-brand-warning-50',
      borderColor: 'border-brand-warning-500',
      iconColor: 'text-brand-warning-600',
      textColor: 'text-brand-warning-900',
    },
    info: {
      icon: <InformationCircleIcon className="w-5 h-5" />,
      bgColor: 'bg-brand-blue-50',
      borderColor: 'border-brand-blue-500',
      iconColor: 'text-brand-blue-600',
      textColor: 'text-brand-blue-900',
    },
  };

  const { icon, bgColor, borderColor, iconColor, textColor } = config[type];

  return (
    <div className={`${bgColor} ${textColor} border-l-4 ${borderColor} rounded-xl shadow-lg p-4 mb-3 animate-fadeIn flex items-start gap-3 min-w-[320px] max-w-md`}>
      <div className={`${iconColor} flex-shrink-0 mt-0.5`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Fechar notificação"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
