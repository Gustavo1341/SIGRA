import React from 'react';

interface PlaceholderPageProps {
  title: string;
  message?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, message }) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center p-12 bg-white rounded-2xl border border-brand-gray-200 shadow-sm">
        <h1 className="text-4xl font-bold text-brand-gray-800">{title}</h1>
        <p className="mt-2 text-brand-gray-500">{message || 'Esta página está em construção.'}</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;