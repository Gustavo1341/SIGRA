
import React from 'react';
import { SigraLogoIcon } from '../components/icons';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-gray-50 animate-fadeIn">
      <div className="relative flex items-center justify-center w-40 h-40">
        <div className="absolute w-full h-full rounded-full border-4 border-brand-gray-200 border-t-4 border-t-brand-blue-600 animate-spin"></div>
        <SigraLogoIcon className="w-24 h-auto text-brand-blue-600" />
      </div>
    </div>
  );
};

export default LoadingScreen;
