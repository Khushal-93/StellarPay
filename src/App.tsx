import { useState } from 'react';
import { MockStateProvider } from './context/MockStateProvider';
import { useMockState } from './hooks/useMockState';
import { useWallet } from './hooks/useWallet';
import { useBalance } from './hooks/useBalance';
import { usePayment } from './hooks/usePayment';

import { WalletButton } from './components/wallet/WalletButton';
import { WalletCard } from './components/wallet/WalletCard';
import { PaymentForm } from './components/payment/PaymentForm';
import { TransactionReview } from './components/transaction/TransactionReview';
import { TransactionStatus } from './components/transaction/TransactionStatus';
import { TransactionSuccess } from './components/transaction/TransactionSuccess';
import { TransactionFailure } from './components/transaction/TransactionFailure';
import { DevStateSwitcher } from './components/dev/DevStateSwitcher';

import { ShieldCheck, Wallet, AlertTriangle, Download, Send } from 'lucide-react';

function MainApp() {
  const {
    connected,
    address,
    loading: walletLoading,
    isInstalled,
    error: walletError,
    connect,
    disconnect,
  } = useWallet();
  const { balance, loading: balanceLoading, error: balanceError, refetch: refetchBalance } = useBalance(address);
  const { status: txStatus, txHash, error: txError, params: txParams, startPayment, confirmPayment, cancelPayment, resetPayment } = usePayment();
  const { midFlowAlert, clearMidFlowAlert } = useMockState();

  const [formRecipient, setFormRecipient] = useState('');
  const [formAmount, setFormAmount] = useState('');

  const handleReview = (recipient: string, amount: string) => {
    setFormRecipient(recipient);
    setFormAmount(amount);
    startPayment(recipient, amount);
  };

  const handlePreFillForm = (recipient: string, amount: string) => {
    setFormRecipient(recipient);
    setFormAmount(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900 pb-8 sm:pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Stellar<span className="text-blue-600">Pay</span>
            </span>
          </div>

          <WalletButton
            connected={connected}
            address={address}
            loading={walletLoading}
            isInstalled={isInstalled}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>
      </header>

      {/* Main Container - Centered Single Column max-w-md (~480px) */}
      <main className="flex-1 max-w-[480px] w-full mx-auto px-4 py-4 sm:py-6 space-y-4">
        {/* Disconnect Alert Notification */}
        {midFlowAlert && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5 text-amber-800 text-xs font-medium animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{midFlowAlert}</span>
            </div>
            <button
              type="button"
              onClick={clearMidFlowAlert}
              className="text-amber-600 hover:text-amber-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* View 1: Wallet Disconnected State */}
        {!connected ? (
          <div className="space-y-4 text-center animate-in fade-in duration-300">
            <div className="space-y-1.5 py-1 sm:py-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Send XLM simply.
              </h1>
              <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto leading-normal">
                Fast. Clear. On-chain payments on the Stellar Testnet.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-card space-y-5">
              {!isInstalled ? (
                /* State 14: Freighter Not Installed */
                <div className="space-y-3.5 text-center">
                  <div className="w-11 h-11 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      Freighter Wallet Required
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Please install the Freighter browser extension to connect your wallet and send Testnet XLM payments.
                    </p>
                  </div>
                  <a
                    href="https://www.freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-md font-semibold text-sm shadow-xs transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Freighter Wallet</span>
                  </a>
                </div>
              ) : (
                /* State 1: Wallet Disconnected */
                <div className="space-y-4 text-center">
                  <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 border border-blue-100">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      Connect Your Wallet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Connect your Freighter wallet to view your XLM balance and initiate Testnet transactions securely.
                    </p>
                  </div>
                  {walletError && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-left">
                      <p className="text-xs font-medium text-rose-700 leading-relaxed">
                        {walletError}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={connect}
                    disabled={walletLoading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>
                      {walletError?.includes('Testnet')
                        ? 'Check Testnet & Connect'
                        : 'Connect Freighter'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* View 2: Wallet Connected View */
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Wallet & Balance Card (State 2 & 3) */}
            {address && (
              <WalletCard
                address={address}
                balance={balance}
                balanceLoading={balanceLoading}
                balanceError={balanceError}
                onRefreshBalance={refetchBalance}
              />
            )}

            {/* Payment State Machine Views */}
            {txStatus === 'SUCCESS' && txHash ? (
              /* State 11: Success */
              <TransactionSuccess
                amount={txParams?.amount || formAmount || '10.00'}
                txHash={txHash}
                onReset={() => {
                  resetPayment();
                  setFormRecipient('');
                  setFormAmount('');
                }}
              />
            ) : txStatus === 'ERROR' ? (
              /* State 12: Failure */
              <TransactionFailure
                error={txError}
                onRetry={() => {
                  resetPayment();
                }}
                onBack={() => {
                  resetPayment();
                }}
              />
            ) : txStatus === 'AWAITING_SIGNATURE' || txStatus === 'SUBMITTING' ? (
              /* States 9 & 10: Signing & Submitting */
              <TransactionStatus status={txStatus} />
            ) : txStatus === 'BUILDING' && txParams ? (
              /* State 8: Review */
              <TransactionReview
                recipient={txParams.destination}
                amount={txParams.amount}
                onConfirm={confirmPayment}
                onCancel={cancelPayment}
              />
            ) : (
              /* States 4, 5, 6, 7: Payment Form */
              <PaymentForm
                balance={balance}
                senderAddress={address}
                initialRecipient={formRecipient}
                initialAmount={formAmount}
                onReview={handleReview}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 font-medium border-t border-slate-200/60 bg-white/50">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stellar Testnet • Freighter Wallet Integration</span>
        </div>
      </footer>

      {/* Dev-only State Switcher Toolbar */}
      {import.meta.env.DEV && <DevStateSwitcher onPreFillForm={handlePreFillForm} />}
    </div>
  );
}

export default function App() {
  return (
    <MockStateProvider>
      <MainApp />
    </MockStateProvider>
  );
}
