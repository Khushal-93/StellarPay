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
    let cancelled = false;

    const checkWallet = async () => {
      try {
        const connection = await isConnected();

        if (cancelled) return;

        if (connection.error) {
          setWallet({
            address: null,
            connected: false,
            loading: false,
            error: connection.error.message,
            isInstalled: true,
          });
          return;
        }

        if (!connection.isConnected) {
          setWallet({
            ...INITIAL_STATE,
            loading: false,
          });
          return;
        }

        const allowed = await isAllowed();

        if (cancelled) return;

        if (allowed.error) {
          setWallet({
            address: null,
            connected: false,
            loading: false,
            error: allowed.error.message,
            isInstalled: true,
          });
          return;
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

        const networkResult = await getNetwork();

        if (cancelled) return;

        if (networkResult.error) {
          setWallet({
            address: null,
            connected: false,
            loading: false,
            error: networkResult.error.message,
            isInstalled: true,
          });
          return;
        }

        if (
          networkResult.networkPassphrase !== TESTNET_PASSPHRASE
        ) {
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

        const addressResult = await getAddress();

        if (cancelled) return;

        if (addressResult.error) {
          setWallet({
            address: null,
            connected: false,
            loading: false,
            error: addressResult.error.message,
            isInstalled: true,
          });
          return;
        }

        if (!addressResult.address) {
          setWallet({
            address: null,
            connected: false,
            loading: false,
            error: "Unable to read the Freighter wallet address.",
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
        if (cancelled) return;

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
    };

    void checkWallet();

    const interval = window.setInterval(() => {
      void checkWallet();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return {
    ...wallet,
    connect,
    disconnect,
  };
}