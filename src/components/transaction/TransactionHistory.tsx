import React from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    ExternalLink,
    History,
    Loader2,
    RefreshCw,
} from 'lucide-react';

import type { TransactionHistoryItem } from '../../types/transactionHistory';

interface TransactionHistoryProps {
    transactions: TransactionHistoryItem[];
    loading: boolean;
    error: string | null;
    onRefresh: () => Promise<void>;
}

function shortenAddress(address: string): string {
    if (address.length <= 12) {
        return address;
    }

    return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
    transactions,
    loading,
    error,
    onRefresh,
}) => {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        <History className="w-4.5 h-4.5 text-slate-700" />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Transaction History
                        </h2>
                        <p className="text-xs text-slate-400">
                            Your latest Stellar Testnet payments
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => void onRefresh()}
                    disabled={loading}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors"
                    aria-label="Refresh transaction history"
                >
                    <RefreshCw
                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                    />
                </button>
            </div>

            {loading && transactions.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mb-3" />
                    <p className="text-sm font-medium">
                        Loading transaction history...
                    </p>
                </div>
            ) : error ? (
                <div className="px-5 py-10 text-center">
                    <p className="text-sm font-semibold text-red-600">
                        Unable to load transaction history
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => void onRefresh()}
                        className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Try Again
                    </button>
                </div>
            ) : transactions.length === 0 ? (
                <div className="py-12 text-center">
                    <History className="w-7 h-7 text-slate-300 mx-auto mb-3" />

                    <p className="text-sm font-semibold text-slate-700">
                        No transactions yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Your Stellar payments will appear here.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {transactions.map((transaction) => {
                        const isSent = transaction.direction === 'SENT';

                        return (
                            <div
                                key={transaction.id}
                                className="px-5 py-4 flex items-center gap-3.5 hover:bg-slate-50/70 transition-colors"
                            >
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSent
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-emerald-50 text-emerald-600'
                                        }`}
                                >
                                    {isSent ? (
                                        <ArrowUpRight className="w-4.5 h-4.5" />
                                    ) : (
                                        <ArrowDownLeft className="w-4.5 h-4.5" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-900">
                                            {isSent ? 'Sent' : 'Received'}
                                        </p>

                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                                            {transaction.successful ? 'SUCCESS' : 'FAILED'}
                                        </span>
                                    </div>

                                    <p className="mt-0.5 text-xs text-slate-400 truncate">
                                        {isSent ? 'To' : 'From'}{' '}
                                        {shortenAddress(transaction.counterparty)}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        {formatDate(transaction.createdAt)}
                                    </p>
                                </div>

                                <div className="text-right shrink-0">
                                    <p
                                        className={`text-sm font-bold ${isSent ? 'text-red-600' : 'text-emerald-600'
                                            }`}
                                    >
                                        {isSent ? '-' : '+'}
                                        {transaction.amount.toFixed(2)} XLM
                                    </p>

                                    <a
                                        href={transaction.explorerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900"
                                    >
                                        View
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};