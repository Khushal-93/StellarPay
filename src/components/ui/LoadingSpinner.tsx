import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`inline-flex items-center gap-2 text-slate-600 ${className}`} role="status">
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      {label && <span className="text-sm font-medium">{label}</span>}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
};
