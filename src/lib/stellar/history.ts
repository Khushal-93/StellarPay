import { Horizon } from '@stellar/stellar-sdk';

import {
    EXPLORER_BASE_URL,
    HORIZON_URL,
} from '../constants';

import type { TransactionHistoryItem } from '../../types/transactionHistory';

const horizonServer = new Horizon.Server(HORIZON_URL);

export async function fetchTransactionHistory(
    address: string,
): Promise<TransactionHistoryItem[]> {
    if (!address) {
        return [];
    }

    const page = await horizonServer
        .payments()
        .forAccount(address)
        .order('desc')
        .limit(20)
        .call();

    const history = page.records
        .filter((record) => record.type === 'payment')
        .filter((record) => record.asset_type === 'native')
        .filter(
            (record) =>
                typeof record.amount === 'string' &&
                Number.isFinite(Number(record.amount)),
        )
        .filter(
            (record) =>
                typeof record.from === 'string' &&
                typeof record.to === 'string' &&
                typeof record.transaction_hash === 'string',
        )
        .map(
            (record): TransactionHistoryItem => {
                const isSent = record.from === address;

                return {
                    id: record.id,
                    transactionHash: record.transaction_hash,
                    direction: isSent ? 'SENT' : 'RECEIVED',
                    amount: Number(record.amount),
                    asset: 'XLM',
                    counterparty: isSent ? record.to : record.from,
                    createdAt: record.created_at,
                    successful: true,
                    explorerUrl: `${EXPLORER_BASE_URL}/tx/${record.transaction_hash}`,
                };
            },
        );

    return Array.from(
        new Map(
            history.map((transaction) => [
                transaction.id,
                transaction,
            ]),
        ).values(),
    );
}