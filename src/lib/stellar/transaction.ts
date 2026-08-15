import {
  Asset,
  Horizon,
  Operation,
  Transaction,
  TransactionBuilder,
} from '@stellar/stellar-sdk';

import {
  BASE_FEE,
  HORIZON_URL,
  NETWORK_PASSPHRASE,
  TRANSACTION_TIMEOUT,
} from '../constants';

const horizonServer = new Horizon.Server(HORIZON_URL);

// BASE_FEE is stored in XLM for application-level calculations.
// Stellar TransactionBuilder expects the fee in stroops as a string.
// 1 XLM = 10,000,000 stroops.
const BASE_FEE_STROOPS = String(
  Math.round(BASE_FEE * 10_000_000),
);

export interface BuildPaymentTransactionParams {
  source: string;
  destination: string;
  amount: string;
}

export interface BuiltPaymentTransaction {
  transaction: Transaction;
  xdr: string;
}

/**
 * Builds an unsigned native XLM payment transaction.
 *
 * This function only constructs the transaction.
 * Signing and submission are handled by later stages.
 */
export async function buildPaymentTransaction({
  source,
  destination,
  amount,
}: BuildPaymentTransactionParams): Promise<BuiltPaymentTransaction> {
  const account = await horizonServer.loadAccount(source);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE_STROOPS,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      }),
    )
    .setTimeout(TRANSACTION_TIMEOUT)
    .build();

  return {
    transaction,
    xdr: transaction.toXDR(),
  };
}