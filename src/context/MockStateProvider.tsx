import React, { useState, type ReactNode } from 'react';
import type { WalletState } from '../types/wallet';
import type { TransactionState, PaymentParams } from '../types/transaction';
import {
  MOCK_WALLET_ADDRESS,
  MOCK_INITIAL_BALANCE,
  MOCK_TX_HASH,
} from '../lib/constants';
import { MockStateContext, type ChallengeState } from './MockStateContext';

export const MockStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: MOCK_WALLET_ADDRESS,
    connected: false,
    loading: false,
    error: null,
    isInstalled: true,
  });

  const [balance, setBalance] = useState<number | null>(MOCK_INITIAL_BALANCE);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [txState, setTxState] = useState<TransactionState>('IDLE');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [paymentParams, setPaymentParams] = useState<PaymentParams | null>(null);

  const [midFlowAlert, setMidFlowAlert] = useState<string | null>(null);
  const [activeChallengeState, setActiveChallengeState] = useState<ChallengeState>('1_DISCONNECTED');

  const connectWallet = () => {
    setWallet((w) => ({ ...w, loading: true, error: null }));
    setTimeout(() => {
      setWallet({
        address: MOCK_WALLET_ADDRESS,
        connected: true,
        loading: false,
        error: null,
        isInstalled: true,
      });
      setBalance(MOCK_INITIAL_BALANCE);
      setBalanceLoading(false);
      setBalanceError(null);
      setMidFlowAlert(null);
      setActiveChallengeState('2_CONNECTED');
    }, 300);
  };

  const disconnectWallet = () => {
    if (['BUILDING', 'AWAITING_SIGNATURE', 'SUBMITTING'].includes(txState) || paymentParams !== null) {
      setMidFlowAlert('Wallet disconnected. Please reconnect to continue.');
    } else {
      setMidFlowAlert(null);
    }

    setWallet({
      address: null,
      connected: false,
      loading: false,
      error: null,
      isInstalled: true,
    });
    setBalance(null);
    setTxState('IDLE');
    setPaymentParams(null);
    setTxHash(null);
    setTxError(null);
    setActiveChallengeState('1_DISCONNECTED');
  };

  const setWalletInstalled = (installed: boolean) => {
    setWallet((w) => ({
      ...w,
      isInstalled: installed,
      connected: installed ? w.connected : false,
      address: installed ? w.address : null,
    }));
  };

  const refetchBalance = () => {
    setBalanceLoading(true);
    setTimeout(() => {
      setBalance(MOCK_INITIAL_BALANCE);
      setBalanceLoading(false);
    }, 400);
  };

  const startReview = (destination: string, amount: string) => {
    setPaymentParams({ destination, amount });
    setTxState('BUILDING');
  };

  const confirmTransaction = () => {
    setTxState('AWAITING_SIGNATURE');
    setTimeout(() => {
      setTxState('SUBMITTING');
      setTimeout(() => {
        setTxHash(MOCK_TX_HASH);
        setTxState('SUCCESS');
        if (paymentParams && balance !== null) {
          const sentAmount = parseFloat(paymentParams.amount) || 0;
          setBalance((b) => Math.max(1.0, (b || 0) - sentAmount));
        }
      }, 1200);
    }, 1200);
  };

  const cancelReview = () => {
    setTxState('CANCELLED');
    setTimeout(() => {
      setTxState('IDLE');
      setPaymentParams(null);
    }, 100);
  };

  const resetPayment = () => {
    setTxState('IDLE');
    setPaymentParams(null);
    setTxHash(null);
    setTxError(null);
  };

  const clearMidFlowAlert = () => setMidFlowAlert(null);

  const setChallengeState = (state: ChallengeState) => {
    setActiveChallengeState(state);
    setMidFlowAlert(null);

    switch (state) {
      case '1_DISCONNECTED':
        setWallet({ address: null, connected: false, loading: false, error: null, isInstalled: true });
        setBalance(null);
        setTxState('IDLE');
        setPaymentParams(null);
        break;

      case '2_CONNECTED':
      case '3_BALANCE_DISPLAYED':
        setWallet({ address: MOCK_WALLET_ADDRESS, connected: true, loading: false, error: null, isInstalled: true });
        setBalance(MOCK_INITIAL_BALANCE);
        setBalanceLoading(false);
        setBalanceError(null);
        setTxState('IDLE');
        setPaymentParams(null);
        break;

      case '4_PAYMENT_FORM':
      case '5_INVALID_RECIPIENT':
      case '6_INVALID_AMOUNT':
      case '7_INSUFFICIENT_BALANCE':
        setWallet({ address: MOCK_WALLET_ADDRESS, connected: true, loading: false, error: null, isInstalled: true });
        setBalance(MOCK_INITIAL_BALANCE);
        setTxState('IDLE');
        setPaymentParams(null);
        break;

      case '8_TRANSACTION_REVIEW':
        setWallet({ address: MOCK_WALLET_ADDRESS, connected: true, loading: false, error: null, isInstalled: true });
        setBalance(MOCK_INITIAL_BALANCE);
        setPaymentParams({
          destination: 'G...recipient',
          amount: '10.00',
        });
        setTxState('BUILDING');
        break;

      case '9_WAITING_SIGNATURE':
        setWallet({ address: MOCK_WALLET_ADDRESS, connected: true, loading: false, error: null, isInstalled: true });
        setBalance(MOCK_INITIAL_BALANCE);
        setPaymentParams({
          destination: 'G...recipient',
          amount: '10.00',
        });
        setTxState('AWAITING_SIGNATURE');
        break;

      case '10_SUBMITTING':
        setWallet({ address: MOCK_WALLET_ADDRESS, connected: true, loading: false, error: null, isInstalled: true });
        setBalance(MOCK_INITIAL_BALANCE);
        setPaymentParams({
          destination: 'G...recipient',
          amount: '10.00',
        });
        setTxState('SUBMITTING');
        break;

      case '11_SUCCESS':
        setWallet({ address: MOCK_WALLET_ADDRESS, connected: true, loading: false, error: null, isInstalled: true });
        setBalance(114.5);
        setPaymentParams({
          destination: 'G...recipient',
          amount: '10.00',
        });
        setTxHash(MOCK_TX_HASH);
        setTxState('SUCCESS');
        break;

      case '12_FAILURE':
        setWallet({ address: MOCK_WALLET_ADDRESS, connected: true, loading: false, error: null, isInstalled: true });
        setBalance(MOCK_INITIAL_BALANCE);
        setPaymentParams({
          destination: 'G...unfunded',
          amount: '10.00',
        });
        setTxError(
          "The recipient account doesn't exist on Stellar Testnet yet. Ask them to activate their account first."
        );
        setTxState('ERROR');
        break;

      case '13_DISCONNECT_MID_FLOW':
        setWallet({ address: null, connected: false, loading: false, error: null, isInstalled: true });
        setBalance(null);
        setTxState('IDLE');
        setPaymentParams(null);
        setMidFlowAlert('Wallet disconnected. Please reconnect to continue.');
        break;

      case '14_FREIGHTER_NOT_INSTALLED':
        setWallet({ address: null, connected: false, loading: false, error: null, isInstalled: false });
        setBalance(null);
        setTxState('IDLE');
        setPaymentParams(null);
        break;
    }
  };

  return (
    <MockStateContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        setWalletInstalled,
        balance,
        balanceLoading,
        balanceError,
        refetchBalance,
        txState,
        txHash,
        txError,
        paymentParams,
        midFlowAlert,
        clearMidFlowAlert,
        startReview,
        confirmTransaction,
        cancelReview,
        resetPayment,
        activeChallengeState,
        setChallengeState,
      }}
    >
      {children}
    </MockStateContext.Provider>
  );
};
