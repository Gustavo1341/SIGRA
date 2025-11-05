import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-brand-gray-100 flex items-center justify-center mb-4 text-brand-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-brand-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-brand-gray-500 max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2.5 bg-brand-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
