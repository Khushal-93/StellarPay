export type TransactionDirection = 'SENT' | 'RECEIVED';

export interface TransactionHistoryItem {
    id: string;
    transactionHash: string;
    direction: TransactionDirection;
    amount: number;
    asset: 'XLM';
    counterparty: string;
    createdAt: string;
    successful: boolean;
    explorerUrl: string;
}