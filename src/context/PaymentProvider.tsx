import React, {
    useCallback,
    useState,
    type ReactNode,
} from 'react';

import { PaymentContext } from './PaymentContext';

import { executePaymentTransaction } from '../lib/stellar/payment';

import type {
    TransactionState,
    PaymentParams,
} from '../types/transaction';



export const PaymentProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [txState, setTxState] =
        useState<TransactionState>('IDLE');

    const [txHash, setTxHash] =
        useState<string | null>(null);

    const [txError, setTxError] =
        useState<string | null>(null);

    const [paymentParams, setPaymentParams] =
        useState<PaymentParams | null>(null);

    const [unsignedTxXdr, setUnsignedTxXdr] =
        useState<string | null>(null);

    const [signedTxXdr, setSignedTxXdr] =
        useState<string | null>(null);

    const startReview = useCallback(
        (destination: string, amount: string) => {
            setPaymentParams({
                destination,
                amount,
            });

            setTxError(null);
            setTxHash(null);
            setUnsignedTxXdr(null);
            setSignedTxXdr(null);
            setTxState('BUILDING');
        },
        [],
    );

    const confirmTransaction = useCallback(
        async (sourceAddress: string | null) => {
            if (!paymentParams) {
                setTxError('Payment details are missing.');
                setTxState('ERROR');
                return;
            }

            if (!sourceAddress) {
                setTxError(
                    'Wallet is not connected. Please reconnect Freighter.',
                );
                setTxState('ERROR');
                return;
            }

            try {
                setTxError(null);
                setTxHash(null);
                setUnsignedTxXdr(null);
                setSignedTxXdr(null);

                // --------------------------------------------------
                // BUILD
                // --------------------------------------------------

                setTxState('BUILDING');

                // --------------------------------------------------
                // FREIGHTER SIGNING
                // --------------------------------------------------

                setTxState('AWAITING_SIGNATURE');

                const paymentPromise =
                    executePaymentTransaction({
                        source: sourceAddress,
                        destination: paymentParams.destination,
                        amount: paymentParams.amount,
                    });

                // --------------------------------------------------
                // HORIZON SUBMISSION
                // --------------------------------------------------

                setTxState('SUBMITTING');

                const result = await paymentPromise;

                setUnsignedTxXdr(result.unsignedTxXdr);
                setSignedTxXdr(result.signedTxXdr);

                // --------------------------------------------------
                // SUCCESS
                // --------------------------------------------------

                setTxHash(result.hash);
                setTxState('SUCCESS');
            } catch (transactionError) {
                console.error(
                    'Stellar transaction failed:',
                    transactionError,
                );

                setTxError(
                    transactionError instanceof Error
                        ? transactionError.message
                        : 'Unable to complete the transaction.',
                );

                setTxState('ERROR');
            }
        },
        [paymentParams],
    );

    const cancelReview = useCallback(() => {
        setTxState('CANCELLED');
        setUnsignedTxXdr(null);
        setSignedTxXdr(null);

        setTimeout(() => {
            setTxState('IDLE');
            setPaymentParams(null);
        }, 100);
    }, []);

    const resetPayment = useCallback(() => {
        setTxState('IDLE');
        setPaymentParams(null);
        setTxHash(null);
        setTxError(null);
        setUnsignedTxXdr(null);
        setSignedTxXdr(null);
    }, []);

    return (
        <PaymentContext.Provider
            value={{
                txState,
                txHash,
                txError,
                paymentParams,
                unsignedTxXdr,
                signedTxXdr,
                startReview,
                confirmTransaction,
                cancelReview,
                resetPayment,
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};

