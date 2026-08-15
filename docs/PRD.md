# StellarPay Product Requirements Document (PRD)

## 1. Product Overview
**Project Name**: StellarPay
**Project Type**: Stellar Testnet XLM payment dApp
**One-line Description**: StellarPay allows users to connect their Freighter wallet, view their XLM balance, send XLM to another Stellar address, and verify the resulting transaction on-chain.
**Core Value Proposition**: Make sending XLM on the Stellar Testnet feel as simple as sending a normal digital payment while showing a real Stellar transaction is taking place.

## 2. Problem Statement
Stellar blockchain complexity creates friction for beginners. Users need a simple interface to send XLM without dealing with raw SDK calls, transaction builders, or blockchain jargon.

## 3. Product Vision
A clean, professional payment interface that abstracts blockchain complexity while maintaining transparency about what's happening on-chain.

## 4. Goals
- **(a)** Meet all challenge requirements.
- **(b)** Deliver a polished fintech-quality payment experience.
- **(c)** Demonstrate clean architecture and development practices.
- **(d)** Produce 10+ meaningful git commits.
- **(e)** Create a submission-ready GitHub repo with a comprehensive README and project screenshots.

## 5. Non-Goals
- No backend server.
- No database (e.g., Firebase, Supabase, MongoDB, PostgreSQL).
- No user authentication/password/email login.
- No AI features.
- No NFT marketplace.
- No token creation.
- No Soroban smart contracts.
- No multi-chain support.
- No Stellar mainnet payments (Testnet only).
- No payment gateway.
- No admin dashboard.
- No complex analytics.
- No chat/social features.

## 6. Target User
A beginner or intermediate Web3 user who wants to send XLM on the Stellar Testnet without dealing with unnecessary blockchain complexity. 

The user should clearly understand:
1. Which wallet is connected.
2. How much XLM is available in their wallet.
3. Who they are sending XLM to.
4. How much XLM they are sending.
5. When Freighter needs approval for signing.
6. Whether the transaction succeeded or failed.
7. Where the transaction can be verified on an explorer.

## 7. User Stories
- **Wallet Connection**: As a user, I want to connect my Freighter wallet so I can access my account on the dApp.
- **Wallet Disconnection**: As a user, I want to disconnect my wallet so I can safely log out of the dApp.
- **Balance Viewing**: As a user, I want to see my available XLM balance so I know how much I can send.
- **Sending XLM**: As a user, I want to enter a recipient address and an amount so I can initiate a payment.
- **Reviewing Transaction**: As a user, I want to review transaction details before signing so I can confirm the payment is correct.
- **Success Feedback**: As a user, I want to receive clear confirmation when a transaction is successful, including the transaction hash.
- **Failure Feedback**: As a user, I want to see a clear, human-readable error message if a transaction fails, without confusing technical jargon.
- **Copying Data**: As a user, I want to easily copy addresses and transaction hashes to my clipboard for reference.
- **Explorer Viewing**: As a user, I want a direct link to view my successful transaction on the Stellar Testnet explorer.

## 8. Functional Requirements

### 8.1 Wallet Requirements
- Connect Freighter wallet.
- Disconnect wallet.
- Display connected wallet address in a shortened format (e.g., `GABC...8F31`).
- Show connected/disconnected state clearly in the UI.
- Detect Freighter installation and prompt users if missing.

### 8.2 Balance Requirements
- Fetch XLM balance from Stellar Testnet Horizon for the connected wallet.
- Display balance with a clear loading state while fetching.
- Handle account-not-found errors gracefully.
- Handle network errors gracefully.
- Auto-refresh the balance upon successful wallet connection or after a completed transaction.

### 8.3 Payment Requirements
- Enter recipient Stellar public address.
- Enter XLM amount to send.
- Validate all inputs locally before proceeding.
- Show a transaction review summary before requesting a signature.
- Request Freighter signature.
- Submit signed transaction to the Stellar Testnet.
- Return and display the transaction hash upon success.

### 8.4 Transaction State Requirements
- Define the transaction lifecycle states: `IDLE` → `VALIDATING` → `BUILDING` → `AWAITING_SIGNATURE` → `SUBMITTING` → `SUCCESS`. Error/cancellation can occur from appropriate states. 
- User-facing states during the flow: 
  - Ready
  - Validating
  - Preparing transaction
  - Waiting for Freighter
  - Submitting to Stellar
  - Payment successful
  - Transaction failed
  - Transaction cancelled

### 8.5 Validation Requirements
- Recipient address is not empty.
- Recipient is a valid Stellar public key.
- Amount is greater than zero.
- Amount is a numeric value.
- Amount does not cause the sender's balance to fall below the Stellar minimum base reserve. For a standard account with no sub-entries, the minimum reserve is **1 XLM**. The maximum sendable amount is therefore `balance - 1 XLM - transaction fee`. This check is always required, not optional.
- Sender and recipient addresses are not identical.

### 8.6 Error Handling Requirements
- Define error categories with user-friendly messages:
  - **Wallet not installed** → "Please install Freighter wallet to continue."
  - **Wallet connection rejected** → "Wallet connection was cancelled."
  - **Account not found (sender)** → "This account was not found on Stellar Testnet."
  - **Destination account does not exist** → "The recipient account doesn't exist on Stellar Testnet yet. Ask them to activate their account first." *(maps to Horizon result code `op_no_destination`)*
  - **Invalid Stellar address** → "Please enter a valid Stellar public address."
  - **Invalid amount** → "Please enter a valid amount greater than zero."
  - **Insufficient balance** → "Insufficient XLM balance for this transaction."
  - **Below minimum reserve** → "This amount would drop your balance below the Stellar minimum reserve (1 XLM). Please send a smaller amount."
  - **Transaction rejected** → "Transaction was cancelled."
  - **Transaction failed** → "We couldn't submit the transaction. Please check your balance and try again."
  - **Network error** → "Network error. Please check your connection and try again."
  - **Unexpected error** → "Something went wrong. Please try again."
- Map technical errors to understandable messages.
- Log technical details for debugging without exposing raw output to users.

## 9. UX Requirements
- The app must feel like a modern fintech product, not a crypto tutorial.
- Each transaction state must be visually distinct.
- Loading states must be shown during all async operations.
- Success and failure states must be clearly communicated.
- The network (Stellar Testnet) must be clearly labeled throughout the app.

## 10. Security Requirements
- **Never** request or store the user's secret key.
- **Never** store Freighter private keys.
- **Never** ask users to paste seed phrases.
- **Never** sign transactions without explicit user interaction.
- **Never** hardcode private keys.
- **Never** commit secrets. Use environment variables only for non-sensitive configuration (like network endpoints).
- Keep the project strictly on the Stellar Testnet. Clearly label the network.

## 11. Screenshot/Submission Requirements
- The README must contain screenshots of:
  - Wallet connected state.
  - Balance displayed.
  - Successful Testnet transaction.
  - Transaction result shown to the user.
- The submission must include a public GitHub repository and a comprehensive README with project description and local setup instructions.
- **README must include a funding step:** Before a transaction can be sent, the Testnet account must be funded. Include a step instructing users to visit `https://friendbot.stellar.org/?addr=YOUR_ADDRESS` (or use the Friendbot link on the [Stellar Laboratory](https://laboratory.stellar.org/#account-creator)) to fund their Testnet wallet.

## 12. Acceptance Criteria
- **Wallet Connect/Disconnect**: Users can successfully connect and disconnect their Freighter wallet; state updates immediately.
- **Freighter Not Installed**: If Freighter is not detected, the app shows a clear prompt to install it (with a link to the Freighter website). The app does not crash.
- **Balance Display**: Fetches and accurately displays the user's XLM balance on Testnet. Shows loading indicator during fetch.
- **Payment Validation**: Invalid inputs (bad address format, negative amount, amount > balance or below reserve, empty fields, same sender/recipient) prevent submission and show clear inline errors.
- **Transaction Signing**: Triggering payment prompts the Freighter extension for signature. Rejecting the signature resets the flow gracefully.
- **Transaction Submission**: Approved transactions are submitted to Testnet.
- **Success/Failure Display**: Users see the success screen with hash or failure screen with a user-friendly error message.
- **Explorer Link**: Success screen includes a valid, clickable link to view the transaction on a Stellar Testnet block explorer (e.g., Stellar Expert).

## 13. MVP Scope
Everything described in this PRD **IS** the MVP. No phased rollout is needed for this scope.

## 14. Optional Enhancements
*(Allowed only if they don't complicate the core implementation)*
- Address copy functionality (wallet address, recipient address, transaction hash).
- Shortened addresses in the UI (`GABC...8F31`).
- Recent transaction stored locally (localStorage only, no backend).
- Direct explorer link to view the transaction on the Stellar Testnet explorer.

## 15. Future Scope
Potential future features are explicitly out of scope for this version, including:
- Mainnet support.
- Multi-asset support (USDC, custom tokens).
- Saved contacts / address book.

## 16. Requirement-to-Feature Traceability Table

| Challenge Requirement | Feature / Component Addressing It |
| --- | --- |
| **Wallet Setup** (Freighter + Testnet) | Freighter connection integration; Network config strictly set to Testnet. |
| **Wallet Connection** (connect/disconnect) | Header component with Connect/Disconnect toggle button and wallet state management. |
| **Balance Handling** (fetch/display) | Dashboard/Balance card fetching XLM balance via Horizon API. |
| **Transaction Flow** (send, success/fail, tx hash) | Payment form, transaction lifecycle state machine, success/failure modals or screens. |
| **Development Standards** | React + TypeScript + Vite stack, separated UI/logic, strict validation, comprehensive error mapping. |
| **Git** (10+ commits) | Organized, atomic commits across development lifecycle. |
| **Submission** | Public GitHub repo, extensive README with screenshots and setup instructions. |

---

## PRIMARY USER FLOW

**Step 1 — Landing screen**: 
User arrives at StellarPay. They see clean StellarPay branding, a short explanation of the dApp, and a prominent "Connect Wallet" button.

**Step 2 — Wallet connection**: 
User clicks "Connect Freighter". The app requests Freighter access. On success: the wallet address appears in the header (shortened), the connected state is shown, and balance fetching begins automatically.

**Step 3 — Balance**: 
The app fetches the XLM balance from Stellar Testnet Horizon. Displays as `124.50 XLM / Available balance`. A loading state is shown while fetching. An error state is displayed if the account cannot be loaded or is unfunded.

**Step 4 — Payment form**: 
User enters a recipient Stellar public address and an amount in XLM. The app validates all inputs (format, balance check, etc.).

**Step 5 — Transaction review**: 
User is shown a summary before signing, including the amount, recipient, network, and estimated transaction fee (~0.00001 XLM), alongside a "Confirm" button.

**Step 6 — Freighter signing**: 
User clicks Confirm. The UI shows "Waiting for wallet confirmation...". The Freighter popup appears. If rejected by the user, the app shows "Transaction cancelled" (does not crash or show a raw error).

**Step 7 — Submission**: 
Once signed, the UI updates to "Submitting transaction..." and submits the signed XDR to the Stellar Testnet.

**Step 8 — Success**: 
On successful submission, the UI shows "Payment successful", detailing the amount sent, the transaction hash, the network (Testnet), a "Copy Hash" button, and a "View Transaction" explorer link.

**Step 9 — Failure**: 
If the submission fails (e.g., network error, insufficient funds), the UI shows a human-readable error message. Raw technical errors are never exposed to the user.

---

## TECH STACK REFERENCES
- **Framework & Language**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Blockchain Integration**: Stellar SDK, Freighter API, Stellar Testnet Horizon
- **Testing**: Vitest, React Testing Library
- **Tooling**: ESLint, Prettier, GitHub Actions
