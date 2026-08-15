import React from 'react';
import { AlertCircle, UserCheck } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  onBlur?: () => void;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  onBlur,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label
          htmlFor="recipient-address"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Recipient Stellar Address
        </label>
        {value.length === 56 && !error && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <UserCheck className="w-3.5 h-3.5" />
            Valid address format
          </span>
        )}
      </div>

      <div className="relative rounded-md shadow-xs">
        <input
          id="recipient-address"
          name="recipientAddress"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="G..."
          autoComplete="off"
          spellCheck={false}
          className={`block w-full rounded-md border px-3.5 py-2.5 text-sm font-mono tracking-tight transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-400 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/30'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? 'recipient-error' : undefined}
        />
      </div>

      {error ? (
        <p id="recipient-error" className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        <p className="text-xs text-slate-500">
          Must be a valid 56-character Stellar public address starting with &apos;G&apos;.
        </p>
      )}
    </div>
  );
};
