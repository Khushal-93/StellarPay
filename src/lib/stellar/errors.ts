/**
 * Converts Freighter, Horizon, Stellar SDK and network errors
 * into concise user-facing messages.
 *
 * Technical error details are preserved through `cause` and
 * logged separately. Raw SDK errors are never shown directly
 * to the user.
 */
export function normalizeStellarError(error: unknown): string {
    const resultCodes = getHorizonResultCodes(error);

    // --------------------------------------------------
    // Stellar operation result codes
    // --------------------------------------------------

    if (
        resultCodes.includes('op_no_destination')
    ) {
        return 'The recipient account does not exist on Stellar Testnet. Fund the recipient account first and try again.';
    }

    if (
        resultCodes.includes('op_underfunded')
    ) {
        return 'Insufficient XLM balance to complete this transaction.';
    }

    if (
        resultCodes.includes('op_malformed') ||
        resultCodes.includes('op_bad_auth')
    ) {
        return 'Stellar rejected the payment operation. Please check the payment details and try again.';
    }

    if (
        resultCodes.includes('op_line_full')
    ) {
        return 'The recipient cannot receive this asset at the moment.';
    }

    // --------------------------------------------------
    // Transaction result codes
    // --------------------------------------------------

    if (resultCodes.includes('tx_bad_auth')) {
        return 'The transaction signature was not accepted by Stellar.';
    }

    if (resultCodes.includes('tx_bad_seq')) {
        return 'The transaction sequence is no longer valid. Please try again.';
    }

    if (resultCodes.includes('tx_failed')) {
        return 'Stellar rejected the transaction. Please check the payment details and try again.';
    }

    // --------------------------------------------------
    // Freighter / wallet errors
    // --------------------------------------------------

    const rawMessage = getErrorMessage(error);
    const message = rawMessage.toLowerCase();

    if (
        message.includes('user rejected') ||
        message.includes('user declined') ||
        message.includes('rejected by user') ||
        message.includes('request rejected') ||
        message.includes('transaction rejected')
    ) {
        return 'Transaction was rejected in Freighter.';
    }

    if (
        message.includes('popup closed') ||
        message.includes('popup was closed') ||
        message.includes('user closed')
    ) {
        return 'Freighter approval was cancelled.';
    }

    if (
        message.includes('freighter') &&
        (
            message.includes('not installed') ||
            message.includes('not found') ||
            message.includes('unavailable')
        )
    ) {
        return 'Freighter wallet is not available. Please install or unlock Freighter and try again.';
    }

    // --------------------------------------------------
    // Stellar errors exposed only through message text
    // --------------------------------------------------

    if (message.includes('op_no_destination')) {
        return 'The recipient account does not exist on Stellar Testnet. Fund the recipient account first and try again.';
    }

    if (
        message.includes('op_underfunded') ||
        message.includes('underfunded') ||
        message.includes('insufficient balance') ||
        message.includes('insufficient funds')
    ) {
        return 'Insufficient XLM balance to complete this transaction.';
    }

    if (
        message.includes('tx_bad_auth') ||
        message.includes('bad auth')
    ) {
        return 'The transaction signature was not accepted by Stellar.';
    }

    if (
        message.includes('tx_bad_seq') ||
        message.includes('bad sequence')
    ) {
        return 'The transaction sequence is no longer valid. Please try again.';
    }

    // --------------------------------------------------
    // Network / Horizon
    // --------------------------------------------------

    if (
        message.includes('network error') ||
        message.includes('failed to fetch') ||
        message.includes('network request failed') ||
        message.includes('timeout') ||
        message.includes('timed out') ||
        message.includes('econnrefused') ||
        message.includes('503') ||
        message.includes('502') ||
        message.includes('504')
    ) {
        return 'Unable to reach Stellar Testnet right now. Please check your connection and try again.';
    }

    if (
        message.includes('horizon') &&
        (
            message.includes('unavailable') ||
            message.includes('server error')
        )
    ) {
        return 'Stellar Testnet is temporarily unavailable. Please try again shortly.';
    }

    // --------------------------------------------------
    // Generic fallback
    // --------------------------------------------------

    return 'The transaction could not be completed. Please check your wallet, balance, and payment details and try again.';
}

function getHorizonResultCodes(error: unknown): string[] {
    if (!error || typeof error !== 'object') {
        return [];
    }

    const candidate = error as {
        response?: {
            data?: {
                extras?: {
                    result_codes?: {
                        transaction?: unknown;
                        operations?: unknown;
                    };
                };
            };
        };
        cause?: unknown;
    };

    const resultCodes =
        candidate.response?.data?.extras?.result_codes;

    if (!resultCodes) {
        return [];
    }

    const codes: string[] = [];

    if (typeof resultCodes.transaction === 'string') {
        codes.push(resultCodes.transaction);
    }

    if (Array.isArray(resultCodes.operations)) {
        for (const code of resultCodes.operations) {
            if (typeof code === 'string') {
                codes.push(code);
            }
        }
    }

    return codes;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    if (error && typeof error === 'object') {
        const candidate = error as {
            message?: unknown;
            response?: {
                data?: {
                    detail?: unknown;
                    title?: unknown;
                };
            };
        };

        if (typeof candidate.message === 'string') {
            return candidate.message;
        }

        const detail = candidate.response?.data?.detail;

        if (typeof detail === 'string') {
            return detail;
        }

        const title = candidate.response?.data?.title;

        if (typeof title === 'string') {
            return title;
        }
    }

    return 'Unknown Stellar transaction error.';
}