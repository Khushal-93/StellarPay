import { useContext } from 'react';

import {
    PaymentContext,
    type PaymentContextValue,
} from '../context/PaymentContext';

export function usePaymentContext(): PaymentContextValue {
    const context = useContext(PaymentContext);

    if (!context) {
        throw new Error(
            'usePaymentContext must be used within a PaymentProvider',
        );
    }

    return context;
}