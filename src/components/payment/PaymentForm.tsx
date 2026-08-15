import React, { useState } from 'react';
import { AddressInput } from './AddressInput';
import { AmountInput } from './AmountInput';
import { validatePayment } from '../../lib/validators';
import { Send, ShieldCheck } from 'lucide-react';

interface PaymentFormProps {
  balance: number | null;
  senderAddress: string | null;
  onReview: (recipient: string, amount: string) => void;
  disabled?: boolean;
  initialRecipient?: string;
  initialAmount?: string;
  className?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  balance,
  senderAddress,
  onReview,
  disabled = false,
  initialRecipient = '',
  initialAmount = '',
  className = '',
}) => {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [amount, setAmount] = useState(initialAmount);
  const [touched, setTouched] = useState({ recipient: false, amount: false });

  const validation = validatePayment(recipient, amount, balance, senderAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ recipient: true, amount: true });
    if (validation.valid) {
      onReview(recipient.trim(), amount.trim());
    }
  };

  const recipientError = touched.recipient ? validation.errors.recipient : undefined;
  const amountError = touched.amount ? validation.errors.amount : undefined;

  const isFormEmpty = !recipient.trim() && !amount.trim();
  const canSubmit = validation.valid && !disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-5 ${className}`}
      noValidate
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-600" />
          <span>Send XLM</span>
        </h2>
        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Testnet
        </span>
      </div>

      <div className="space-y-4">
        <AddressInput
          value={recipient}
          onChange={(val) => {
            setRecipient(val);
            if (!touched.recipient) setTouched((t) => ({ ...t, recipient: true }));
          }}
          onBlur={() => setTouched((t) => ({ ...t, recipient: true }))}
          error={recipientError}
          disabled={disabled}
        />

        <AmountInput
          value={amount}
          onChange={(val) => {
            setAmount(val);
            if (!touched.amount) setTouched((t) => ({ ...t, amount: true }));
          }}
          onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          balance={balance}
          error={amountError}
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-3 px-4 rounded-md font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
          canSubmit
            ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer'
            : 'bg-blue-300 text-white cursor-not-allowed opacity-75'
        }`}
      >
        <span>Review Transaction</span>
      </button>

      {isFormEmpty && (
        <p className="text-xs text-center text-slate-400 font-medium">
          Fill in recipient and amount to proceed to review.
        </p>
      )}
    </form>
  );
};
