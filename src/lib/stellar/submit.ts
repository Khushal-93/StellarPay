import {
  Horizon,
  TransactionBuilder,
} from '@stellar/stellar-sdk';

import {
  HORIZON_URL,
  NETWORK_PASSPHRASE,
} from '../constants';

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
  const transaction = TransactionBuilder.fromXDR(
    signedTxXdr,
    NETWORK_PASSPHRASE,
  );

  const response = await horizonServer.submitTransaction(transaction);

  return {
    hash: response.hash,
    ledger: response.ledger ?? null,
    successful: response.successful,
  };
}