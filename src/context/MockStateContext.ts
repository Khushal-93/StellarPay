import { createContext } from 'react';
import type { WalletState } from '../types/wallet';
import type { TransactionState, PaymentParams } from '../types/transaction';

export type ChallengeState =
  | '1_DISCONNECTED'
  | '2_CONNECTED'
  | '3_BALANCE_DISPLAYED'
  | '4_PAYMENT_FORM'
  | '5_INVALID_RECIPIENT'
  | '6_INVALID_AMOUNT'
  | '7_INSUFFICIENT_BALANCE'
  | '8_TRANSACTION_REVIEW'
  | '9_WAITING_SIGNATURE'
  | '10_SUBMITTING'
  | '11_SUCCESS'
  | '12_FAILURE'
  | '13_DISCONNECT_MID_FLOW'
  | '14_FREIGHTER_NOT_INSTALLED';

export interface MockStateContextType {
  // Wallet state
  wallet: WalletState;
  connectWallet: () => void;
  disconnectWallet: () => void;
  setWalletInstalled: (installed: boolean) => void;

  // Balance state
  balance: number | null;
  balanceLoading: boolean;
  balanceError: string | null;
  refetchBalance: () => void;

  // Payment & Transaction state
  txState: TransactionState;
  txHash: string | null;
  txError: string | null;
  paymentParams: PaymentParams | null;
  
  // Mid-flow alert notice
  midFlowAlert: string | null;
  clearMidFlowAlert: () => void;

  // Actions
  startReview: (recipient: string, amount: string) => void;
  confirmTransaction: () => void;
  cancelReview: () => void;
  resetPayment: () => void;

  // Dev switcher action to force any of the 14 states
  activeChallengeState: ChallengeState;
  setChallengeState: (state: ChallengeState) => void;
}

export const MockStateContext = createContext<MockStateContextType | undefined>(undefined);
