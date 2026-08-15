import { useMockState } from './useMockState';
import { useWallet } from './useWallet';
import type {
  TransactionState,
  PaymentParams,
} from '../types/transaction';

export interface UsePaymentReturn {
  status: TransactionState;
  txHash: string | null;
  error: string | null;
  params: PaymentParams | null;
  unsignedTxXdr: string | null;
  signedTxXdr: string | null;
  startPayment: (destination: string, amount: string) => void;
  confirmPayment: () => Promise<void>;
  cancelPayment: () => void;
  resetPayment: () => void;
}

export function usePayment(): UsePaymentReturn {
  const {
    txState,
    txHash,
    txError,
    paymentParams,
    unsignedTxXdr,
    signedTxXdr,
    startReview,
    confirmTransaction,
    cancelReview,
    resetPayment,
  } = useMockState();

  const { address } = useWallet();

  const confirmPayment = async (): Promise<void> => {
    await confirmTransaction(address);
  };

  return {
    status: txState,
    txHash,
    error: txError,
    params: paymentParams,
    unsignedTxXdr,
    signedTxXdr,
    startPayment: startReview,
    confirmPayment,
    cancelPayment: cancelReview,
    resetPayment,
  };
}