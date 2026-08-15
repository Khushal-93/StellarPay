import { StrKey } from '@stellar/stellar-sdk';
import { MINIMUM_ACCOUNT_RESERVE, BASE_FEE } from './constants';
import type { ValidationResult } from '../types/transaction';

/**
 * Validates a Stellar Ed25519 public address.
 *
 * Uses Stellar SDK StrKey validation to verify:
 * - Stellar public-key type
 * - Version byte
 * - Payload
 * - Checksum
 */
export function isValidStellarAddress(address: string): boolean {
  const trimmed = address.trim();

  if (!trimmed) {
    return false;
  }

  return StrKey.isValidEd25519PublicKey(trimmed);
}

/**
 * Validates the payment amount against:
 * - Positive numeric value
 * - Available account balance
 * - Minimum account reserve
 * - Transaction fee
 */
export function isValidAmount(
  amount: string,
  balance: number | null,
): { valid: boolean; error?: string } {
  const trimmed = amount.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Please enter an amount.',
    };
  }

  // Accept decimal values only.
  // Rejects values such as:
  // 10abc
  // 1.2.3
  // Infinity
  // NaN
  // scientific notation
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid amount greater than zero.',
    };
  }

  const numericAmount = Number(trimmed);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return {
      valid: false,
      error: 'Please enter a valid amount greater than zero.',
    };
  }

  if (balance === null) {
    return {
      valid: false,
      error: 'Balance unavailable. Please reconnect wallet.',
    };
  }

  const maxSpendable =
    balance - MINIMUM_ACCOUNT_RESERVE - BASE_FEE;

  if (maxSpendable <= 0) {
    return {
      valid: false,
      error: `Your balance (${balance.toFixed(
        2,
      )} XLM) is insufficient to cover the minimum account reserve (1.00 XLM) and fee.`,
    };
  }

  if (numericAmount > maxSpendable) {
    if (numericAmount <= balance) {
      return {
        valid: false,
        error:
          'This amount would drop your balance below the Stellar minimum reserve (1 XLM). Please send a smaller amount.',
      };
    }

    return {
      valid: false,
      error: 'Insufficient XLM balance for this transaction.',
    };
  }

  return {
    valid: true,
  };
}

/**
 * Validates the complete payment form.
 *
 * Checks:
 * - Recipient is present
 * - Recipient is a valid Stellar public address
 * - Recipient is not the sender
 * - Amount is valid
 * - Amount is within the safe spendable balance
 */
export function validatePayment(
  recipient: string,
  amount: string,
  balance: number | null,
  senderAddress: string | null,
): ValidationResult {
  const errors: {
    recipient?: string;
    amount?: string;
  } = {};

  const trimmedRecipient = recipient.trim();

  if (!trimmedRecipient) {
    errors.recipient = 'Please enter a recipient address.';
  } else if (!isValidStellarAddress(trimmedRecipient)) {
    errors.recipient =
      'Please enter a valid Stellar public address.';
  } else if (
    senderAddress &&
    trimmedRecipient === senderAddress.trim()
  ) {
    errors.recipient =
      'Recipient address cannot be the same as your sender address.';
  }

  const amountCheck = isValidAmount(amount, balance);

  if (!amountCheck.valid && amountCheck.error) {
    errors.amount = amountCheck.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}