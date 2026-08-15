import { createContext } from 'react';
import type {
    TransactionState,
    PaymentParams,
} from '../types/transaction';

export interface PaymentContextValue {
    txState: TransactionState;
    txHash: string | null;
    txError: string | null;
    paymentParams: PaymentParams | null;
    unsignedTxXdr: string | null;
    signedTxXdr: string | null;

    startReview: (destination: string, amount: string) => void;
    confirmTransaction: (sourceAddress: string | null) => Promise<void>;
    cancelReview: () => void;
    resetPayment: () => void;
}

export const PaymentContext =
    createContext<PaymentContextValue | undefined>(undefined);