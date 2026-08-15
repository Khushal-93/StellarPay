export type TransactionState =
  | 'IDLE'
  | 'VALIDATING'
  | 'BUILDING'
  | 'AWAITING_SIGNATURE'
  | 'SUBMITTING'
  | 'SUCCESS'
  | 'ERROR'
  | 'CANCELLED';

export interface PaymentParams {
  destination: string;
  amount: string;
}

export interface PaymentState {
  status: TransactionState;
  txHash: string | null;
  error: string | null;
  params: PaymentParams | null;
}

export interface ValidationResult {
  valid: boolean;
  errors: {
    recipient?: string;
    amount?: string;
  };
}
