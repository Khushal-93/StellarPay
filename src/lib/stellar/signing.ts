import {
    signTransaction,
} from '@stellar/freighter-api';

import { NETWORK_PASSPHRASE } from '../constants';
import { normalizeStellarError } from './errors';

export interface SignPaymentTransactionParams {
    xdr: string;
    address: string;
}

export interface SignedPaymentTransaction {
    signedTxXdr: string;
    signerAddress: string;
}

/**
 * Requests Freighter to sign an unsigned Stellar transaction.
 *
 * This function does NOT submit the transaction.
 * Submission will be handled by the Horizon submission phase.
 */
export async function signPaymentTransaction({
    xdr,
    address,
}: SignPaymentTransactionParams): Promise<SignedPaymentTransaction> {
    try {
        const result = await signTransaction(xdr, {
            networkPassphrase: NETWORK_PASSPHRASE,
            address,
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        if (!result.signedTxXdr) {
            throw new Error('Freighter did not return a signed transaction.');
        }

        if (!result.signerAddress) {
            throw new Error('Freighter did not return the signer address.');
        }

        if (result.signerAddress !== address) {
            throw new Error(
                'The transaction was signed by a different Stellar account.',
            );
        }

        return {
            signedTxXdr: result.signedTxXdr,
            signerAddress: result.signerAddress,
        };
    } catch (error) {
        console.error('Freighter signing failed:', error);

        throw new Error(normalizeStellarError(error), {
            cause: error,
        });
    }
}