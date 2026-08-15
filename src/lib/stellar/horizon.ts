import { Horizon } from "@stellar/stellar-sdk";
import { HORIZON_URL } from "../constants";

const horizonServer = new Horizon.Server(HORIZON_URL);

export async function fetchNativeXlmBalance(
  address: string,
): Promise<number> {
  const account = await horizonServer.loadAccount(address);

  const nativeBalance = account.balances.find(
    (balance) => balance.asset_type === "native",
  );

  if (!nativeBalance) {
    throw new Error("XLM balance was not found for this account.");
  }

  return Number(nativeBalance.balance);
}