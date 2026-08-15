import { buildPaymentTransaction } from './transaction';
import { signPaymentTransaction } from './signing';
import { submitPaymentTransaction } from './submit';

export interface ExecutePaymentTransactionParams {
    source: string;
    destination: string;
    amount: string;
}

export interface ExecutePaymentTransactionResult {
    hash: string;
    unsignedTxXdr: string;
    signedTxXdr: string;
}

/**
 * Executes a complete Stellar Testnet payment.
 *
 * Flow:
 * 1. Build unsigned transaction
 * 2. Request Freighter signature
 * 3. Submit signed transaction to Horizon
 *
 * This service contains blockchain execution only.
 * UI state management remains in MockStateProvider.
 */
export async function executePaymentTransaction({
    source,
    destination,
    amount,
}: ExecutePaymentTransactionParams): Promise<ExecutePaymentTransactionResult> {
    const builtTransaction = await buildPaymentTransaction({
        source,
        destination,
        amount,
    });

    const signedTransaction = await signPaymentTransaction({
        xdr: builtTransaction.xdr,
        address: source,
    });

    const submission = await submitPaymentTransaction(
        signedTransaction.signedTxXdr,
    );

    if (!submission.successful) {
        throw new Error(
            'Stellar accepted the transaction submission, but the transaction was not successful.',
        );
    }

    return {
        hash: submission.hash,
        unsignedTxXdr: builtTransaction.xdr,
        signedTxXdr: signedTransaction.signedTxXdr,
    };
}