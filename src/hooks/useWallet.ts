import { useCallback, useEffect, useState } from "react";
import {
  getAddress,
  getNetwork,
  isAllowed,
  isConnected,
  requestAccess,
} from "@stellar/freighter-api";

import type { WalletState } from "../types/wallet";

const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";

const INITIAL_STATE: WalletState = {
  address: null,
  connected: false,
  loading: true,
  error: null,
  isInstalled: false,
};

export interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletState>(INITIAL_STATE);

  const loadWallet = useCallback(async () => {
    setWallet((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    try {
      const connection = await isConnected();

      if (connection.error) {
        throw new Error(connection.error.message);
      }

      if (!connection.isConnected) {
        setWallet({
          ...INITIAL_STATE,
          loading: false,
        });

        return;
      }

      const allowed = await isAllowed();

      if (allowed.error) {
        throw new Error(allowed.error.message);
      }

      if (!allowed.isAllowed) {
        setWallet({
          address: null,
          connected: false,
          loading: false,
          error: null,
          isInstalled: true,
        });

        return;
      }

      const addressResult = await getAddress();

      if (addressResult.error) {
        throw new Error(addressResult.error.message);
      }

      const networkResult = await getNetwork();

      if (networkResult.error) {
        throw new Error(networkResult.error.message);
      }

      if (networkResult.networkPassphrase !== TESTNET_PASSPHRASE) {
        setWallet({
          address: addressResult.address,
          connected: false,
          loading: false,
          error:
            "Please switch Freighter to Stellar Testnet before continuing.",
          isInstalled: true,
        });

        return;
      }

      setWallet({
        address: addressResult.address,
        connected: true,
        loading: false,
        error: null,
        isInstalled: true,
      });
    } catch (error) {
      setWallet({
        address: null,
        connected: false,
        loading: false,
        error: getErrorMessage(
          error,
          "Unable to connect to Freighter.",
        ),
        isInstalled: true,
      });
    }
  }, []);

  const connect = useCallback(async () => {
    setWallet((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    try {
      const connection = await isConnected();

      if (connection.error) {
        throw new Error(connection.error.message);
      }

      if (!connection.isConnected) {
        setWallet({
          address: null,
          connected: false,
          loading: false,
          error: "Freighter wallet is not installed.",
          isInstalled: false,
        });

        return;
      }

      const networkResult = await getNetwork();

      if (networkResult.error) {
        throw new Error(networkResult.error.message);
      }

      if (networkResult.networkPassphrase !== TESTNET_PASSPHRASE) {
        setWallet({
          address: null,
          connected: false,
          loading: false,
          error:
            "Please switch Freighter to Stellar Testnet before continuing.",
          isInstalled: true,
        });

        return;
      }

      const access = await requestAccess();

      if (access.error) {
        throw new Error(access.error.message);
      }

      setWallet({
        address: access.address,
        connected: true,
        loading: false,
        error: null,
        isInstalled: true,
      });
    } catch (error) {
      setWallet({
        address: null,
        connected: false,
        loading: false,
        error: getErrorMessage(
          error,
          "Unable to connect to Freighter.",
        ),
        isInstalled: true,
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet((current) => ({
      ...current,
      address: null,
      connected: false,
      loading: false,
      error: null,
    }));
  }, []);

  useEffect(() => {
    const initializeWallet = async () => {
      await loadWallet();
    };

    void initializeWallet();
  }, [loadWallet]);

  return {
    ...wallet,
    connect,
    disconnect,
  };
}