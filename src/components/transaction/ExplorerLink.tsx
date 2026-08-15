import React from 'react';
import { ExternalLink } from 'lucide-react';
import { EXPLORER_BASE_URL } from '../../lib/constants';

interface ExplorerLinkProps {
  transactionHash: string;
  className?: string;
  label?: string;
}

export const ExplorerLink: React.FC<ExplorerLinkProps> = ({
  transactionHash,
  className = '',
  label = 'View on Explorer',
}) => {
  const url = `${EXPLORER_BASE_URL}/tx/${transactionHash}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${className}`}
    >
      <span>{label}</span>
      <ExternalLink className="w-4 h-4 text-blue-600" />
    </a>
  );
};
