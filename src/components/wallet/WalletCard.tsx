import React from 'react';
import { WalletAddress } from './WalletAddress';
import { BalanceDisplay } from './BalanceDisplay';
import { Wallet } from 'lucide-react';

interface WalletCardProps {
  address: string;
  balance: number | null;
  balanceLoading: boolean;
  balanceError: string | null;
  onRefreshBalance?: () => void;
  className?: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  address,
  balance,
  balanceLoading,
  balanceError,
  onRefreshBalance,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-6 shadow-card transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Wallet className="w-4 h-4 text-blue-600" />
          <span>Connected Wallet</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-xs text-slate-500 block mb-1">Account Address</span>
          <WalletAddress address={address} />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <BalanceDisplay
            balance={balance}
            loading={balanceLoading}
            error={balanceError}
            onRefresh={onRefreshBalance}
          />
        </div>
      </div>
    </div>
  );
};
