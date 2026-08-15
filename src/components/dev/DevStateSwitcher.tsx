import React, { useState } from 'react';
import { useMockState } from '../../hooks/useMockState';
import type { ChallengeState } from '../../context/MockStateContext';
import { Sparkles, ChevronUp, ChevronDown, Check } from 'lucide-react';

const CHALLENGE_STATES: { id: ChallengeState; label: string; desc: string }[] = [
  { id: '1_DISCONNECTED', label: '1. Disconnected', desc: 'Landing view with Connect Wallet button' },
  { id: '2_CONNECTED', label: '2. Connected', desc: 'Wallet address & balance shown' },
  { id: '3_BALANCE_DISPLAYED', label: '3. Balance Displayed', desc: 'Balance card with 124.50 XLM' },
  { id: '4_PAYMENT_FORM', label: '4. Payment Form', desc: 'Form ready for user input' },
  { id: '5_INVALID_RECIPIENT', label: '5. Invalid Recipient', desc: 'Inline error under address field' },
  { id: '6_INVALID_AMOUNT', label: '6. Invalid Amount', desc: 'Inline error under amount field' },
  { id: '7_INSUFFICIENT_BALANCE', label: '7. Insufficient Balance', desc: 'Below 1 XLM minimum reserve error' },
  { id: '8_TRANSACTION_REVIEW', label: '8. Transaction Review', desc: 'Summary card with fee before signing' },
  { id: '9_WAITING_SIGNATURE', label: '9. Waiting Confirmation', desc: 'Freighter signature popup spinner' },
  { id: '10_SUBMITTING', label: '10. Submitting Tx', desc: 'Submitting signed XDR to Horizon' },
  { id: '11_SUCCESS', label: '11. Tx Success', desc: 'Green check, tx hash, explorer link' },
  { id: '12_FAILURE', label: '12. Tx Failure', desc: 'Red X, op_no_destination error' },
  { id: '13_DISCONNECT_MID_FLOW', label: '13. Mid-Flow Disconnect', desc: 'Warning banner on sudden disconnect' },
  { id: '14_FREIGHTER_NOT_INSTALLED', label: '14. Freighter Not Installed', desc: 'Prompt to install Freighter extension' },
];

interface DevStateSwitcherProps {
  onPreFillForm?: (recipient: string, amount: string) => void;
}

export const DevStateSwitcher: React.FC<DevStateSwitcherProps> = ({ onPreFillForm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeChallengeState, setChallengeState } = useMockState();

  const handleSelectState = (stateId: ChallengeState) => {
    setChallengeState(stateId);

    if (onPreFillForm) {
      if (stateId === '5_INVALID_RECIPIENT') {
        onPreFillForm('INVALID_ADDRESS_XYZ', '10.00');
      } else if (stateId === '6_INVALID_AMOUNT') {
        onPreFillForm('G...recipient', '-5.00');
      } else if (stateId === '7_INSUFFICIENT_BALANCE') {
        onPreFillForm('G...recipient', '124.00');
      }
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-2 pointer-events-none">
      <div className="max-w-xl mx-auto pointer-events-auto bg-slate-900/95 backdrop-blur text-white rounded-lg shadow-2xl border border-slate-800 overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-white">Dev State Switcher (14 Challenge States)</span>
            <span className="bg-blue-900/80 text-blue-300 px-2 py-0.5 rounded text-[10px] font-sans">
              State: {CHALLENGE_STATES.find((s) => s.id === activeChallengeState)?.label}
            </span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {isOpen && (
          <div className="p-3 border-t border-slate-800 max-h-64 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
            <p className="text-[11px] text-slate-400 mb-2 font-sans">
              Click any state to immediately trigger that exact scenario in the UI:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {CHALLENGE_STATES.map((st) => {
                const isActive = activeChallengeState === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectState(st.id)}
                    className={`text-left p-2 rounded text-xs transition-colors flex items-start justify-between ${
                      isActive
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{st.label}</div>
                      <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {st.desc}
                      </div>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
