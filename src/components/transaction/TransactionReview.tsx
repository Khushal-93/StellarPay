import React from 'react';
import { BASE_FEE } from '../../lib/constants';
import { ArrowRight, ShieldCheck, Wallet } from 'lucide-react';

interface TransactionReviewProps {
  recipient: string;
  amount: string;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
  className?: string;
}

export const TransactionReview: React.FC<TransactionReviewProps> = ({
  recipient,
  amount,
  onConfirm,
  onCancel,
  disabled = false,
  className = '',
}) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  const shortenedRecipient =
    recipient.includes('...') || recipient.length <= 16
      ? recipient
      : `${recipient.slice(0, 8)}...${recipient.slice(-8)}`;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-5 animate-in fade-in duration-200 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Review Transaction</span>
        </h2>
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-200">
          Stellar Testnet
        </span>
      </div>

      <div className="space-y-4 text-sm">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-500 uppercase font-semibold">Send</span>
            <div className="text-right">
              <span className="text-xl font-bold text-slate-900">{formattedAmount}</span>
              <span className="text-xs font-semibold text-slate-600 ml-1">XLM</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center">
            <span className="text-xs text-slate-500 uppercase font-semibold">To</span>
            <span
              title={recipient}
              className="font-mono text-xs font-medium text-slate-800 bg-white px-2 py-1 rounded border border-slate-200"
            >
              {shortenedRecipient}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold uppercase">Network</span>
            <span className="font-medium text-slate-800">Stellar Testnet</span>
          </div>

          <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold uppercase">Estimated Fee</span>
            <span className="font-mono font-medium text-slate-700">~{BASE_FEE} XLM</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Clicking confirm will request signature in your Freighter wallet extension.
        </p>
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onConfirm}
          disabled={disabled}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <Wallet className="w-4 h-4" />
          <span>Confirm with Freighter</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="w-full py-2 px-4 bg-transparent hover:bg-slate-100 text-slate-600 rounded-md font-medium text-sm transition-colors border border-transparent hover:border-slate-200 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
