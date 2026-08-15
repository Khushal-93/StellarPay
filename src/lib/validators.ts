import { MINIMUM_ACCOUNT_RESERVE, BASE_FEE } from './constants';
import type { ValidationResult } from '../types/transaction';

/**
 * Validates a Stellar public address format.
 * Stellar addresses start with 'G', are exactly 56 characters long, and use base32 (A-Z, 2-7).
 */
export function isValidStellarAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  const stellarAddressRegex = /^G[A-Z2-7]{55}$/;
  return stellarAddressRegex.test(trimmed);
}

/**
 * Validates the send amount against available balance and minimum account reserve.
 */
export function isValidAmount(
  amount: string,
  balance: number | null
): { valid: boolean; error?: string } {
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Please enter an amount.' };
  }

  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Please enter a valid amount greater than zero.' };
  }

  if (balance === null) {
    return { valid: false, error: 'Balance unavailable. Please reconnect wallet.' };
  }

  const maxSpendable = balance - MINIMUM_ACCOUNT_RESERVE - BASE_FEE;

  if (maxSpendable <= 0) {
    return {
      valid: false,
      error: `Your balance (${balance.toFixed(2)} XLM) is insufficient to cover the minimum account reserve (1.00 XLM) and fee.`,
    };
  }

  if (num > maxSpendable) {
    if (num <= balance) {
      return {
        valid: false,
        error: 'This amount would drop your balance below the Stellar minimum reserve (1 XLM). Please send a smaller amount.',
      };
    }
    return { valid: false, error: 'Insufficient XLM balance for this transaction.' };
  }

  return { valid: true };
}

/**
 * Validates full payment input.
 */
export function validatePayment(
  recipient: string,
  amount: string,
  balance: number | null,
  senderAddress: string | null
): ValidationResult {
  const errors: { recipient?: string; amount?: string } = {};

  if (!recipient || recipient.trim() === '') {
    errors.recipient = 'Please enter a recipient address.';
  } else if (!isValidStellarAddress(recipient)) {
    errors.recipient = 'Please enter a valid Stellar public address.';
  } else if (senderAddress && recipient.trim() === senderAddress.trim()) {
    errors.recipient = 'Recipient address cannot be the same as your sender address.';
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
