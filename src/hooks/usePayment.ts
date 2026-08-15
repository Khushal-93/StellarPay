import { useMockState } from './useMockState';
import type { TransactionState, PaymentParams } from '../types/transaction';

export interface UsePaymentReturn {
  status: TransactionState;
  txHash: string | null;
  error: string | null;
  params: PaymentParams | null;
  startPayment: (destination: string, amount: string) => void;
  confirmPayment: () => void;
  cancelPayment: () => void;
  resetPayment: () => void;
}

export function usePayment(): UsePaymentReturn {
  const {
    txState,
    txHash,
    txError,
    paymentParams,
    startReview,
    confirmTransaction,
    cancelReview,
    resetPayment,
  } = useMockState();

  return {
    status: txState,
    txHash,
    error: txError,
    params: paymentParams,
    startPayment: startReview,
    confirmPayment: confirmTransaction,
    cancelPayment: cancelReview,
    resetPayment,
  };
}
