# Technical Architecture Document - StellarPay

StellarPay is a lightweight Stellar Testnet XLM payment dApp. It allows users to connect their Freighter wallet, view their XLM balance, send XLM to another Stellar address, and verify the resulting transaction on-chain.

## 1. Architecture Overview

```text
React UI
   ↓
Feature Hooks (useWallet, useBalance, usePayment)
   ↓
Stellar Services (lib/)
   ├── Freighter (wallet connection, signing)
   └── Stellar Testnet Horizon (balance, submission)
```

The application maintains a clean separation of concerns: the UI triggers interactions via Feature Hooks, which encapsulate business logic and state. The Hooks rely on the Stellar Services layer, which directly interfaces with External APIs (Freighter and Horizon) without leaking implementation details or raw transaction construction logic into the UI.

## 2. Technology Decisions

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18+ | UI framework |
| **TypeScript** | 5+ | Type safety |
| **Vite** | 5+ | Build tool, fast HMR |
| **Tailwind CSS** | ^3.4.x | Utility-first styling |
| **Lucide React** | Latest | Icon library, clean and consistent |
| **@stellar/stellar-sdk** | Latest | Stellar blockchain interaction |
| **@stellar/freighter-api** | Latest | Freighter wallet integration |
| **Vitest** | Latest | Testing, Vite-native |
| **React Testing Library** | Latest | Component testing |
| **ESLint** | 9+ | Linting, flat config |
| **Prettier** | Latest | Code formatting |
| **GitHub Actions** | N/A | Continuous Integration (CI) |

## 3. Technology Rationale

- **React:** Industry standard with a large ecosystem. It provides the right component-based structure for this challenge.
- **TypeScript:** Ensures type safety for complex blockchain data structures, dramatically improving developer experience (DX) and reducing runtime errors.
- **Vite:** Offers a fast development server, native TypeScript support out of the box, and a simpler configuration model than Webpack.
- **Tailwind CSS:** Allows for rapid styling without the overhead of custom CSS files. It acts as a lightweight design system configurable via `tailwind.config.js`. **Use Tailwind CSS v3.x specifically (`^3.4.x`). Tailwind CSS v4 has a fundamentally different configuration model (no `tailwind.config.js` by default) and is not covered by this specification.**
- **Lucide React:** Provides clean, consistent, and tree-shakeable SVG icons packaged as React-native components.
- **Stellar SDK:** The official and most reliable SDK for building transactions and interacting with the Stellar blockchain.
- **Freighter API:** The official API for Freighter, the recommended and most widely supported Stellar wallet.
- **Vitest:** Requires near-zero configuration in a Vite project, is extremely fast, and provides an API compatible with Jest.
- **ESLint + Prettier:** Industry-standard tools to enforce code quality, stylistic consistency, and catch potential bugs early.
- **GitHub Actions:** Provides free, powerful CI for public repositories using simple YAML configuration.

## 4. Frontend Architecture

StellarPay is built as a React Single Page Application (SPA). Given the scope of an MVP, a routing library is not needed. The application consists of a single page utilizing state-driven view transitions.

**Component Tree:**
- `App`
  - `Header`
    - `WalletButton`
  - `Main`
    - `WalletCard`
    - `PaymentForm`
    - `TransactionResult`

State flows downward from parent components or is provided contextually via hooks.

## 5. Stellar Architecture

The blockchain interaction layer is separated into two primary external dependencies:
- **Freighter:** Handles wallet connection, identity (public key), and transaction signing.
- **Stellar Testnet Horizon:** The REST API server (`https://horizon-testnet.stellar.org`) used to query account balances and submit signed transactions.

**Security Principles:**
- The application **never** handles or stores private keys.
- All transactions are executed strictly on the Stellar Testnet using the network passphrase: `Test SDF Network ; September 2015`.

## 6. Freighter Integration

The Freighter wallet is abstracted behind a dedicated service layer API to avoid directly coupling the UI to Freighter's implementation details.

**Conceptual Wallet Service API:**
- `connect()`: Request wallet access via the Freighter extension.
- `disconnect()`: Clear local connection state.
- `getAddress()`: Retrieve the connected account's public key.
- `isConnected()`: Check whether the Freighter extension is present and the dApp has been previously authorized. Use this on mount to detect Freighter availability. If it returns `false`, treat the extension as not connected; prompt the user to connect.
- `isAllowed()` / `requestAccess()`: Use `isAllowed()` to check whether the user has already granted access, and `requestAccess()` to request authorization for the first time. These are the documented `@stellar/freighter-api` methods for managing user authorization.
- `signTransaction()`: Request Freighter to sign a fully constructed transaction.

> **⚠️ API Version Note (`@stellar/freighter-api` v2+):**  
> The `signTransaction` function uses a **named options object** as its second argument — NOT a positional `network` string.
> ```ts
> // Correct (v2+)
> const { signedTxXdr } = await signTransaction(xdrString, {
>   networkPassphrase: NETWORK_PASSPHRASE,
> });
> ```
> The return value is `{ signedTxXdr: string, signerAddress: string }`, not a raw string. Verify the exact signature against the installed version of `@stellar/freighter-api` before implementation.

**Wallet State Structure:**
```typescript
{
  address: string | null;
  connected: boolean;
  loading: boolean;
  error: string | null;
}
```

## 7. Horizon/Testnet Integration

The Balance service abstracts the Horizon API:
- It receives a Stellar public key.
- Queries the Stellar Testnet Horizon server using: `server.accounts().accountId(publicKey).call()`.
- **Use `new StellarSdk.Horizon.Server(HORIZON_URL)` — not the deprecated bare `StellarSdk.Server()` constructor, which was removed/deprecated in SDK v11+.**
- Iterates over `account.balances` to find the native XLM balance.
- Returns a normalized numeric value representing the balance.
- Gracefully handles `404` (account not found) and general network errors.

The UI components do not contain or execute Horizon request logic directly.

## 8. Transaction Lifecycle

The full technical flow of a payment transaction (classic Horizon path — no Soroban/RPC):
1. User fills out the payment form (recipient address, amount).
2. Client-side validation occurs (address format, amount > 0, sufficient balance above minimum reserve).
3. `loadAccount(publicKey)` — loads the source account sequence number from Horizon.
4. Initializes `TransactionBuilder` with the loaded account.
5. Adds a native XLM payment operation.
6. Sets the base fee (using the recommended network fee or fallback to 100 stroops).
7. Sets a transaction timeout (e.g., 30 seconds).
8. Calls `.build()` to produce the transaction object.
9. Converts the transaction to an XDR string via `.toXDR()` / `.toEnvelope().toXDR('base64')`.
10. Passes XDR to Freighter: `signTransaction(xdr, { networkPassphrase })` — returns `{ signedTxXdr }`.
11. Reconstructs the signed transaction from the returned XDR.
12. Submits to Horizon: `server.submitTransaction(signedTx)`.
13. Returns the resulting transaction hash upon successful confirmation.
14. Normalizes and captures errors on failure (including mapping `op_no_destination` to a user-friendly message).

> **Scope note:** `prepareTransaction()` / `simulateTransaction()` are Soroban RPC methods and are **not part of this flow**. The MVP uses Horizon exclusively.

**State Machine:**
`IDLE` → `VALIDATING` → `BUILDING` → `AWAITING_SIGNATURE` → `SUBMITTING` → `SUCCESS` | `ERROR` | `CANCELLED`

## 9. State Management Approach

State management relies exclusively on React hooks and local component state. External libraries like Redux or Zustand are unnecessary for this scope. Custom hooks encapsulate domain-specific logic and state machines:

- `useWallet`: Manages wallet connection state and lifecycle.
- `useBalance`: Manages balance fetching, caching, and auto-refreshing when the wallet connects or a transaction succeeds.
- `usePayment`: Manages the full state machine of the payment flow.

State is lifted only to the appropriate component level where it is needed.

## 10. Folder Structure

```text
stellarpay/
├── public/                    # Static assets (favicon, logo)
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── assets/                # Imported assets (if any)
│   ├── components/            # React components
│   │   ├── ui/                # Generic UI primitives (CopyButton, LoadingSpinner, StatusBadge)
│   │   ├── wallet/            # Wallet-related components (WalletButton, WalletCard, WalletAddress, BalanceDisplay)
│   │   ├── payment/           # Payment form components (PaymentForm, AddressInput, AmountInput)
│   │   └── transaction/       # Transaction result components (TransactionReview, TransactionStatus, TransactionSuccess, TransactionFailure, ExplorerLink)
│   ├── hooks/                 # Custom React hooks
│   │   ├── useWallet.ts       # Wallet connection state management
│   │   ├── useBalance.ts      # Balance fetching and caching
│   │   └── usePayment.ts      # Payment flow state machine
│   ├── lib/                   # Service layer (no React dependency)
│   │   ├── stellar.ts         # Stellar SDK operations (load account, build tx, submit tx)
│   │   ├── freighter.ts       # Freighter API wrapper (connect, sign)
│   │   ├── validators.ts      # Input validation functions
│   │   └── constants.ts       # Network config, explorer URLs, fee defaults
│   ├── types/                 # TypeScript type definitions
│   │   ├── wallet.ts          # Wallet state types
│   │   └── transaction.ts     # Transaction state types, error types
│   ├── App.tsx                # Root component, layout composition
│   ├── main.tsx               # Vite entry point
│   └── index.css              # Tailwind directives + global styles
├── tests/                     # Test files
│   ├── validators.test.ts     # Validation function tests
│   ├── wallet.test.ts         # Wallet hook/service tests
│   └── payment.test.ts        # Payment flow tests
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI (lint, type-check, test)
├── .env.example               # Environment variable template
├── README.md                  # Project documentation
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js           # ESLint flat config
├── prettier.config.js
└── LICENSE
```

## 11. Component Architecture

Components are organized by domain to maximize focus, reusability, and testability:

- **ui/**: `CopyButton`, `LoadingSpinner`, `StatusBadge` (Dumb components, purely visual)
- **wallet/**: `WalletButton`, `WalletCard`, `WalletAddress`, `BalanceDisplay`
- **payment/**: `PaymentForm`, `AddressInput`, `AmountInput`
- **transaction/**: `TransactionReview`, `TransactionStatus`, `TransactionSuccess`, `TransactionFailure`, `ExplorerLink`

## 12. Hooks

- **`useWallet`**: Returns `{ address, connected, loading, error, connect(), disconnect() }`. It wraps the Freighter connection service and persists the connection check on mount.
- **`useBalance`**: Accepts an `address` parameter. Returns `{ balance, loading, error, refetch() }`. Queries Horizon and automatically fetches when the provided address changes. **The `refetch()` function is also called explicitly by `usePayment` when the payment state machine transitions into `SUCCESS`, ensuring the displayed balance is updated after every completed transaction.**
- **`usePayment`**: Returns `{ state, send(destination, amount), reset() }`. Manages the state machine coordinating validation, building, signing, and submission.

## 13. Services

- **`lib/stellar.ts`**: Contains `loadAccount(publicKey)`, `buildPaymentTransaction(source, destination, amount)`, and `submitTransaction(signedXdr)`. These are pure functions wrapping the Stellar SDK. Uses `new StellarSdk.Horizon.Server(HORIZON_URL)` (not the deprecated `StellarSdk.Server()`).
- **`lib/freighter.ts`**: Contains `connectWallet()`, `getPublicKey()`, `isConnected()`, `isAllowed()`, and `signTransaction(xdr, { networkPassphrase })`. Abstracts the underlying `@stellar/freighter-api`. The `signTransaction` wrapper unpacks the `{ signedTxXdr }` return value.
- **`lib/validators.ts`**: Contains `isValidStellarAddress(address)`, `isValidAmount(amount, balance)` *(validates against `balance - MINIMUM_ACCOUNT_RESERVE - estimated_fee`, not just `balance`)*, and `validatePayment(recipient, amount, balance, senderAddress)`. Pure validation functions independent of React.
- **`lib/constants.ts`**: Defines `NETWORK_PASSPHRASE`, `HORIZON_URL`, `EXPLORER_BASE_URL`, `BASE_FEE`, `TRANSACTION_TIMEOUT`, **`BASE_RESERVE = 0.5` (XLM — the Stellar per-unit base reserve)**, and **`MINIMUM_ACCOUNT_RESERVE = 1` (XLM — 2 × BASE_RESERVE for a standard account with zero subentries)**. The MVP assumes no additional subentries. Transaction explorer URL format: `${EXPLORER_BASE_URL}/tx/{transactionHash}`.

## 14. Types

Key TypeScript definitions ensure predictable data flow:

- `WalletState`: `{ address: string | null, connected: boolean, loading: boolean, error: string | null }`
- `TransactionState`: Union of `'IDLE' | 'VALIDATING' | 'BUILDING' | 'AWAITING_SIGNATURE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR' | 'CANCELLED'`
- `PaymentState`: `{ status: TransactionState, txHash: string | null, error: string | null }`
- `PaymentParams`: `{ destination: string, amount: string }`
- `ValidationResult`: `{ valid: boolean, errors: Record<string, string> }`

## 15. Validation

Validations are pure functions with no side effects. They return structured error objects for the UI to display field-level feedback.
- **Stellar Address Format:** Must start with 'G', be exactly 56 characters, and represent a valid base32 string.
- **Amount:** Must be numeric, greater than 0, and not cause the sender's balance to fall below the minimum account reserve. Formula: `amount <= balance - MINIMUM_ACCOUNT_RESERVE - estimated_fee`.
  - `BASE_RESERVE` = 0.5 XLM (the Stellar per-unit base reserve constant)
  - `MINIMUM_ACCOUNT_RESERVE` = 1 XLM (2 × BASE_RESERVE; a standard account with zero subentries requires 2 base reserves)
  - The Level 1 MVP assumes no additional subentries (no trustlines, offers, signers, etc.)
  - Both constants are defined in `lib/constants.ts`
- **Recipient:** Sender address cannot equal the recipient address.

## 16. Error Handling

Error handling spans three architectural layers:
1. **Service layer:** Catches raw SDK and API errors and normalizes them into typed, predictable error objects.
2. **Hook layer:** Maps service errors into user-facing state variables (e.g., updating the state machine to `ERROR`).
3. **UI layer:** Displays user-friendly messages and provides recovery actions (e.g., a "Retry" button).

**Error Categories:**
- Wallet Not Installed / Not Supported
- Connection Rejected
- Account Not Found / Unfunded (sender)
- **Destination Account Does Not Exist** — maps to Horizon result code `op_no_destination`. User-facing message: *"The recipient account doesn't exist on Stellar Testnet yet. Ask them to activate their account first."*
- Invalid Address
- Insufficient Balance
- Below Minimum Reserve
- User Rejected Signature
- Transaction Failed
- Network Error

## 17. Security

- **Never** request, process, or store secret keys.
- **Never** store Freighter private keys or seed phrases.
- **Never** sign a transaction without explicit user interaction (Freighter prompt).
- **Never** hardcode private keys in the repository.
- **Never** commit secrets.
- Use environment variables strictly for non-sensitive configuration.
- The app operates strictly on **Testnet** and must be clearly labeled as such.
- All signing operations are completely delegated to Freighter.

## 18. Environment Variables

Template for `.env.example`:
```env
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_EXPLORER_URL=https://stellar.expert/explorer/testnet
```

> **Transaction Explorer URL pattern:** `${EXPLORER_BASE_URL}/tx/{transactionHash}`  
> This is the format the `ExplorerLink` component must use to construct clickable transaction links.
All variables are non-sensitive configuration values. No secrets should ever be placed in the environment variables for this application.

## 19. Testing

Strategy utilizes **Vitest** combined with **React Testing Library**:
- **Validators:** Unit test `isValidStellarAddress` (valid, invalid, empty inputs), `isValidAmount` (valid, zero, negative, exceeds bounds), and full `validatePayment`.
- **Wallet:** Integration test the hook states (connected, disconnected, connection failure).
- **Payment:** Test the successful payment flow state machine, rejected signing scenarios, and failed submissions.

Tests focus on unit tests for pure functions and integration tests for hooks. Full blockchain integration tests are excluded; instead, Freighter and Horizon APIs should be mocked.

## 20. Linting

- **ESLint 9 Flat Config:** Extends `eslint:recommended`, `typescript-eslint`, and React specific rules.
- No custom rules are needed beyond standard defaults.
- Execution command: `npm run lint`

## 21. Formatting

- **Prettier Config:**
  ```javascript
  {
    singleQuote: true,
    semi: true,
    tabWidth: 2,
    trailingComma: 'es5'
  }
  ```
- Execution command: `npm run format`

## 22. CI

**GitHub Actions (`.github/workflows/ci.yml`):**
- **Triggers:** Push to `main`, and all Pull Requests.
- **Steps:**
  1. Checkout repository
  2. Setup Node.js v20
  3. Install dependencies (`npm ci`)
  4. Run linting (`npm run lint`)
  5. Run type-checking (`npx tsc --noEmit`)
  6. Run tests (`npm test`)
  7. Test production build (`npm run build`)

## 23. Git Strategy

We follow conventional commits to ensure a readable history. Recommended sequence of at least 10 meaningful commits:

1. `chore: initialize React TypeScript project`
2. `chore: configure styling and code quality`
3. `feat: add application shell`
4. `feat: integrate Freighter wallet`
5. `feat: add wallet connection UI`
6. `feat: fetch Stellar Testnet balance`
7. `feat: add payment form`
8. `feat: add payment validation`
9. `feat: implement XLM transaction flow`
10. `feat: integrate Freighter signing`
11. `feat: add transaction status states`
12. `feat: add success and failure views`
13. `test: add wallet and payment tests`
14. `docs: add project documentation`
15. `docs: add README screenshots and finalize submission`

Commits must represent meaningful development milestones rather than artificial splits.

## 24. Local Development

Setup process:
1. Clone the repository locally.
2. Install the Freighter browser extension in your browser.
3. Switch Freighter to the **Stellar Testnet**.
4. Fund your test account via the Stellar Friendbot.
5. Run `npm install` to grab all dependencies.
6. Run `cp .env.example .env` to set up environment configurations.
7. Run `npm run dev` to start the local Vite server.
8. Open `http://localhost:5173` in your browser.

## 25. Build Process

Running `npm run build` utilizes Vite to produce optimized static files in the `/dist` directory. Vite efficiently handles bundling, tree-shaking, and minification. StellarPay is entirely statically built, with no server-side rendering (SSR) required.

## 26. Deployment Considerations

The built frontend can be easily deployed via static hosting services such as Vercel, Netlify, or GitHub Pages. No backend server is required. Environment variables must be configured within the hosting platform's dashboard. **Note:** As a Testnet application, the deployed UI must prominently display that it operates on the Testnet.

## 27. Technical Limitations

- Freighter must be installed as a browser extension (mobile browsing is not inherently supported).
- The application natively supports **only** the Stellar Testnet.
- Supports **only** native XLM transfers; no custom assets or tokens.
- No offline support.
- No historical transaction view beyond optional caching of the most recently sent transaction.
- Balances do not update in real-time natively (requires manual refresh or re-fetching upon action completion).

## 28. Future Architecture Considerations

*(These are explicitly out of scope for the current implementation)*
- Mainnet support with dynamic network switching capabilities.
- Support for transferring multi-assets and stablecoins.
- Integrations with other wallet providers (e.g., WalletConnect, xBull).
- Integration with Soroban smart contracts.
- A built-in transaction history view utilizing a local indexer or advanced Horizon queries.
- Internationalization (i18n) support.
