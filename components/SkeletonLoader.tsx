import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = 'w-full',
  height = 'h-4',
  className = '',
  count = 1,
}) => {
  const baseClasses = 'bg-gradient-to-r from-brand-gray-100 via-brand-gray-50 to-brand-gray-100 bg-[length:200%_100%] animate-shimmer';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
  };

  const skeletonClass = `${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className}`;

  if (count === 1) {
    return <div className={skeletonClass} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} />
      ))}
    </>
  );
};

export default SkeletonLoader;

// Componentes pré-configurados
export const SkeletonCard: React.FC = () => (
  <div className="bg-white p-6 rounded-xl border border-brand-gray-200 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <SkeletonLoader variant="text" width="w-24" height="h-4" />
      <SkeletonLoader variant="circular" width="w-10" height="h-10" />
    </div>
    <SkeletonLoader variant="text" width="w-32" height="h-8" className="mb-2" />
    <SkeletonLoader variant="text" width="w-20" height="h-4" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl border border-brand-gray-200 overflow-hidden">
    <div className="p-4 border-b border-brand-gray-200">
      <SkeletonLoader variant="text" width="w-48" height="h-6" />
    </div>
    <div className="divide-y divide-brand-gray-200">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="p-4 flex items-center gap-4">
          <SkeletonLoader variant="circular" width="w-10" height="h-10" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" width="w-3/4" height="h-4" />
            <SkeletonLoader variant="text" width="w-1/2" height="h-3" />
          </div>
          <SkeletonLoader variant="rectangular" width="w-20" height="h-8" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="bg-white p-4 rounded-lg border border-brand-gray-200 flex items-center gap-4">
        <SkeletonLoader variant="circular" width="w-12" height="h-12" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="text" width="w-2/3" height="h-4" />
          <SkeletonLoader variant="text" width="w-1/3" height="h-3" />
        </div>
      </div>
    ))}
  </div>
);
