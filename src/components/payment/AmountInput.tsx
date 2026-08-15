import React from 'react';
import { AlertCircle } from 'lucide-react';
import { MINIMUM_ACCOUNT_RESERVE, BASE_FEE } from '../../lib/constants';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  balance: number | null;
  error?: string;
  disabled?: boolean;
  onBlur?: () => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  balance,
  error,
  disabled = false,
  onBlur,
}) => {
  const maxSpendable = balance !== null ? Math.max(0, balance - MINIMUM_ACCOUNT_RESERVE - BASE_FEE) : 0;

  const handleSetMax = () => {
    if (maxSpendable > 0) {
      onChange(maxSpendable.toFixed(4));
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label
          htmlFor="payment-amount"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Amount
        </label>
        {balance !== null && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Spendable: {maxSpendable.toFixed(2)} XLM</span>
            {!disabled && maxSpendable > 0 && (
              <button
                type="button"
                onClick={handleSetMax}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>

      <div className="relative rounded-md shadow-xs">
        <input
          id="payment-amount"
          name="amount"
          type="number"
          step="any"
          min="0.0000001"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="0.00"
          className={`block w-full rounded-md border pl-3.5 pr-16 py-2.5 text-base font-semibold transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-400 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/30'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? 'amount-error' : 'amount-hint'}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
          <span className="text-sm font-semibold text-slate-500">XLM</span>
        </div>
      </div>

      {error ? (
        <p id="amount-error" className="flex items-start gap-1.5 text-xs text-rose-600 font-medium mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </p>
      ) : (
        <p id="amount-hint" className="text-xs text-slate-500">
          Account must retain at least 1.0 XLM minimum reserve after transfer.
        </p>
      )}
    </div>
  );
};
