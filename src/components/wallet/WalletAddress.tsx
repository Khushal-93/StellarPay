import React from 'react';
import { CopyButton } from '../ui/CopyButton';

interface WalletAddressProps {
  address: string;
  className?: string;
  showCopy?: boolean;
}

export const WalletAddress: React.FC<WalletAddressProps> = ({
  address,
  className = '',
  showCopy = true,
}) => {
  const shortened =
    address.length > 12
      ? `${address.slice(0, 4)}...${address.slice(-4)}`
      : address;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        title={address}
        className="font-mono text-sm font-semibold tracking-wide text-slate-800 bg-slate-100/80 px-2.5 py-1 rounded border border-slate-200"
      >
        {shortened}
      </span>
      {showCopy && <CopyButton textToCopy={address} label="Copy" />}
    </div>
  );
};
