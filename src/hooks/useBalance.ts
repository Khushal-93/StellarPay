import { useMockState } from './useMockState';

export interface UseBalanceReturn {
  balance: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBalance(address: string | null): UseBalanceReturn {
  void address;
  const { balance, balanceLoading, balanceError, refetchBalance } = useMockState();

  return {
    balance,
    loading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  };
}
