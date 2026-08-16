import { useCallback, useEffect, useState } from 'react';

import { fetchTransactionHistory } from '../lib/stellar/history';
import type { TransactionHistoryItem } from '../types/transactionHistory';

export interface UseTransactionHistoryReturn {
    transactions: TransactionHistoryItem[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useTransactionHistory(
    address: string | null,
): UseTransactionHistoryReturn {
    const [transactions, setTransactions] = useState<
        TransactionHistoryItem[]
    >([]);
    const [loading, setLoading] = useState(Boolean(address));
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!address) {
            setTransactions([]);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const history = await fetchTransactionHistory(address);
            setTransactions(history);
        } catch (historyError) {
            setTransactions([]);

            if (historyError instanceof Error) {
                setError(historyError.message);
            } else {
                setError(
                    'Unable to load your transaction history. Please try again.',
                );
            }
        } finally {
            setLoading(false);
        }
    }, [address]);

    useEffect(() => {
        if (!address) {
            return;
        }

        const timer = window.setTimeout(() => {
            void refetch();
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, [address, refetch]);

    return {
        transactions,
        loading,
        error,
        refetch,
    };
}