import {
    Horizon,
    TransactionBuilder,
} from '@stellar/stellar-sdk';

import {
    HORIZON_URL,
    NETWORK_PASSPHRASE,
} from '../constants';

import { normalizeStellarError } from './errors';

const horizonServer = new Horizon.Server(HORIZON_URL);

export interface SubmitPaymentTransactionResult {
    hash: string;
    ledger: number | null;
    successful: boolean;
}

/**
 * Submits a Freighter-signed transaction to Stellar Testnet.
 *
 * The signed XDR is reconstructed into a Stellar Transaction object
 * before being submitted through Horizon.
 */
export async function submitPaymentTransaction(
    signedTxXdr: string,
): Promise<SubmitPaymentTransactionResult> {
    try {
        const transaction = TransactionBuilder.fromXDR(
            signedTxXdr,
            NETWORK_PASSPHRASE,
        );

        const response = await horizonServer.submitTransaction(
            transaction,
        );

        return {
            hash: response.hash,
            ledger: response.ledger ?? null,
            successful: response.successful,
        };
    } catch (error) {
        console.error('Horizon transaction submission failed:', error);

        throw new Error(normalizeStellarError(error), {
            cause: error,
        });
    }
}