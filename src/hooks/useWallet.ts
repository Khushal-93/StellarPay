import { useMockState } from './useMockState';
import type { WalletState } from '../types/wallet';

export interface UseWalletReturn extends WalletState {
  connect: () => void;
  disconnect: () => void;
}

export function useWallet(): UseWalletReturn {
  const { wallet, connectWallet, disconnectWallet } = useMockState();

  return {
    ...wallet,
    connect: connectWallet,
    disconnect: disconnectWallet,
  };
}
