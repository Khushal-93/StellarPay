export interface WalletState {
  address: string | null;
  connected: boolean;
  loading: boolean;
  error: string | null;
  isInstalled: boolean;
}
