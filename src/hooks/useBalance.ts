import { useCallback, useEffect, useState } from "react";
import { fetchNativeXlmBalance } from "../lib/stellar/horizon";

export interface UseBalanceReturn {
  balance: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBalance(address: string | null): UseBalanceReturn {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!address) {
      setBalance(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextBalance = await fetchNativeXlmBalance(address);
      setBalance(nextBalance);
    } catch (error) {
      setBalance(null);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to load your XLM balance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    const initializeBalance = async () => {
      await refetch();
    };

    void initializeBalance();
  }, [refetch]);

  return {
    balance,
    loading,
    error,
    refetch,
  };
}