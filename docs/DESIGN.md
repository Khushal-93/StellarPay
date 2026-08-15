# UI/UX Design Specification for StellarPay

## 1. Design Philosophy
The product should feel like a modern fintech application. Avoid the typical 'crypto dashboard' aesthetic. Prioritize simplicity, clarity, and trust. A user should understand what the app does within seconds. The design should communicate professionalism and reliability, ensuring users feel secure when handling transactions.

## 2. Brand Direction
**Brand Identity:** Clean, minimal, and trustworthy. We aim for a subtle Web3 identity without overwhelming crypto aesthetics, maintaining a modern fintech feel. 
**Name Treatment:** **StellarPay** (single word, camel case). No tagline should be present in the primary logo lockup.

## 3. Visual Language
The interface should be minimal, premium, clean, spacious, and professional. It should evoke a modern fintech experience with a subtle nod to its Web3 foundation.

**AVOID:** 
- Excessive gradients
- Huge glowing crypto graphics
- Excessive glassmorphism
- Too many cards or layered panels
- Too many colors
- Animated backgrounds
- Fake metrics or fake wallet statistics
- Decorative blockchain diagrams in the main UI
- Excessive icons

## 4. Color System
Keep the palette controlled. Do not invent a huge color system.

- **Background:** `#F8FAFC` (Slate 50)
- **Primary Text:** `#0F172A` (Slate 900)
- **Secondary Text:** `#64748B` (Slate 500)
- **Border:** `#E2E8F0` (Slate 200)
- **Card Background:** `#FFFFFF` (White)
- **Success:** `#16A34A` (Green 600)
- **Success Background:** `#F0FDF4` (Green 50)
- **Error:** `#DC2626` (Red 600)
- **Error Background:** `#FEF2F2` (Red 50)
- **Primary Action:** `#2563EB` (Stellar-inspired Blue)
- **Primary Hover:** `#1D4ED8` (Blue 700)
- **Primary Disabled:** `#93C5FD` (Blue 300)
- **Focus Ring:** `#2563EB` (with reduced opacity)

## 5. Typography
**Primary Font:** Inter (Google Fonts)

**Typography Scale:**
- **Display:** 32px / 40px line-height, Font-weight: 700
- **Heading:** 20px / 28px line-height, Font-weight: 600
- **Body:** 16px / 24px line-height, Font-weight: 400
- **Caption:** 14px / 20px line-height, Font-weight: 400, Secondary Text Color
- **Button:** 16px / 24px line-height, Font-weight: 500
- **Mono (addresses/hashes):** 14px, Font-family: monospace

## 6. Spacing
Use a 4px base unit spacing scale: 
`4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px`

- **Consistent padding inside cards:** `24px`
- **Gap between sections:** `24px` or `32px`

## 7. Border Radius
Modern but restrained:
- **Small (6px):** Inputs, Buttons
- **Medium (12px):** Cards
- **Large (16px):** Modals/Overlays (if used)
- **Exceptions:** Pill shapes are reserved exclusively for small status badges.

## 8. Shadows
Subtle shadows only where they improve hierarchy. Avoid heavy drop shadows.
- **Card:** `0 1px 3px rgba(0,0,0,0.08)`
- **Elevated:** `0 4px 12px rgba(0,0,0,0.1)`

## 9. Buttons
- **Primary:** Blue background (`#2563EB`), white text, 6px radius, 16px font, 500 weight. Hover darkens (`#1D4ED8`). Disabled state uses `#93C5FD` with reduced opacity.
- **Secondary/Ghost:** Transparent background, visible border, primary text color.
- **Danger:** Red (`#DC2626`) for destructive actions (if needed).
- **Button States:** Default, Hover, Active, Disabled, Loading (replaces text or prepends with a spinner).

## 10. Inputs
- **Background:** White
- **Border:** `#E2E8F0`, 1px solid
- **Focus:** Blue border (`#2563EB`) with a subtle focus ring.
- **Error:** Red border (`#DC2626`)
- **Placeholder Text:** `#94A3B8`
- **Padding:** 12px 16px
- **Radius:** 6px
- **Layout:** Label above input (using caption text style). Error message positioned below input in red.

## 11. Cards
- **Background:** White
- **Border:** Subtle border (`#E2E8F0`)
- **Radius:** 12px
- **Padding:** 24px
- **Shadow:** Subtle card shadow
- **Usage:** Wallet info section, payment form section, transaction result states.

## 12. Toasts/Notifications
Prefer inline status messages over toast popups for simplicity. 
- **Success:** Contextual inline messages using green.
- **Error:** Contextual inline messages using red.
- **Positioning:** Placed near the relevant action (e.g., above or below the form).

## 13. Loading States
- Use a spinner or skeleton loader for initial balance fetching.
- Use inline loading text for transaction states (e.g., 'Preparing transaction...', 'Waiting for Freighter...', 'Submitting to Stellar...').
- **Crucial:** Disable all interactive elements during loading states.

## 14. Error States
- **Validation Errors:** Inline error messages displayed directly below inputs.
- **Transaction Failures:** Card-level error display. Always include a recovery action (e.g., 'Try Again' or 'Go Back'). 
- **Rule:** Never show raw technical JSON errors or stack traces to users.

## 15. Empty States
- **Wallet Disconnected:** The primary empty state shows a 'Connect Wallet' prompt. No balance or payment form is visible until the wallet is connected.

## 16. Wallet Connected State
Displays:
- Shortened address (`GABC...8F31`) in mono font.
- Green dot or visual indicator for 'Connected'.
- Disconnect option (accessible and clear).
- XLM Balance visible below or near the address.

## 17. Wallet Disconnected State
Displays:
- 'Connect Wallet' button (primary style).
- Brief explanation text of the app's purpose.
- No balance, no payment form visible.

## 18. Main Payment Screen
The primary interactive screen. The layout is centered, single-column, max-width ~480px. The header has the logo/name on the left and the wallet button on the right.

```text
--------------------------------------------------

StellarPay                         [Wallet Button]

            Send XLM simply.
            Fast. Clear. On-chain.

        ┌─────────────────────────────┐
        │ Wallet                      │
        │                             │
        │ GABC...8F31         Copy ⎘  │
        │                             │
        │ 124.50 XLM                  │
        │ Available balance           │
        └─────────────────────────────┘

        ┌─────────────────────────────┐
        │ Send XLM                    │
        │                             │
        │ Recipient                   │
        │ ┌─────────────────────────┐ │
        │ │ G_______________________│ │
        │ └─────────────────────────┘ │
        │                             │
        │ Amount                      │
        │ ┌─────────────────────────┐ │
        │ │ 0.00                XLM │ │
        │ └─────────────────────────┘ │
        │                             │
        │ [ Review Transaction ]      │
        └─────────────────────────────┘

        Stellar Testnet • Freighter

--------------------------------------------------
```

## 19. Transaction Review Screen
An inline expansion or overlay state before signing:

```text
┌─────────────────────────────┐
│ Review Transaction          │
│                             │
│ Send                        │
│ 10.00 XLM                   │
│                             │
│ To                          │
│ GABC...XYZ                  │
│                             │
│ Network                     │
│ Stellar Testnet             │
│                             │
│ Fee                         │
│ ~0.00001 XLM                │
│                             │
│ [ Confirm with Freighter ]  │
│ [ Cancel ]                  │
└─────────────────────────────┘
```

> **Note:** The fee row displays the estimated base fee (100 stroops = 0.00001 XLM). It is shown before signing so users can see the total cost of the transaction.

## 20. Freighter Signing State
- Replace the confirm button with: 'Waiting for wallet confirmation...' accompanied by a spinner.
- Disable all form inputs and secondary actions.
- Provide a clear visual indication that the application is waiting for the user to take action in the external Freighter wallet popup.

## 21. Transaction Submitting State
- Display: 'Submitting to Stellar Testnet...' with a spinner or progress indicator.
- All inputs and buttons remain disabled to prevent duplicate submissions.

## 22. Transaction Success State
Uses green accents and indicates a successful on-chain operation.

```text
┌─────────────────────────────┐
│ ✓ Payment Successful        │
│                             │
│ 10.00 XLM sent              │
│                             │
│ Transaction                 │
│ [tx-hash]            Copy ⎘ │
│                             │
│ Network                     │
│ Stellar Testnet             │
│                             │
│ [ View on Explorer ↗ ]      │
│ [ Send Another Payment ]    │
└─────────────────────────────┘
```

> **Note:** `[tx-hash]` is a wireframe placeholder. The actual transaction hash is displayed post-transaction.
- Checkmark icon.
- Transaction hash is copyable.
- Explorer link opens in a new tab.

## 23. Transaction Failure State
Uses red accents and clear recovery language.

```text
┌─────────────────────────────┐
│ ✕ Transaction Failed        │
│                             │
│ We couldn't submit the      │
│ transaction. Please check   │
│ your balance and try again. │
│                             │
│ [ Try Again ]               │
└─────────────────────────────┘
```
- Clear, non-technical error message.
- Retry action readily available.
- Never show raw error strings.

## 24. Responsive Behavior
- The single-column centered layout works naturally on mobile devices without complex media queries.
- **Desktop:** Max-width container (~480px).
- Cards stack vertically.
- Touch-friendly tap targets (minimum `44px` height for interactable elements).
- No complex responsive breakpoints are needed—the centered card layout is inherently responsive.

## 25. Accessibility
- Use semantic HTML elements (nav, main, section, button).
- Proper heading hierarchy (only a single `h1` per page).
- Explicit `<label>` elements for all inputs.
- Clear focus indicators on all interactive elements for keyboard navigation.
- Sufficient color contrast meeting WCAG AA standards.
- Fully keyboard navigable.
- Use ARIA attributes only where semantic HTML isn't sufficient.
- Meaningful alt text for icons/images.

## 26. Component Inventory
- `WalletButton`: Header wallet connect/disconnect trigger.
- `WalletCard`: Displays connected wallet address + balance.
- `WalletAddress`: Shortened address display with integrated copy functionality.
- `BalanceDisplay`: Shows XLM balance handling loading/error states.
- `PaymentForm`: Recipient + amount inputs + review button container.
- `AddressInput`: Stellar address input with format validation.
- `AmountInput`: XLM amount input with numeric validation + 'XLM' suffix.
- `TransactionReview`: Pre-signing confirmation summary display.
- `TransactionStatus`: Inline status indicator during signing/submission phases.
- `TransactionSuccess`: Success result display card.
- `TransactionFailure`: Failure result display card.
- `CopyButton`: Small copy-to-clipboard utility button.
- `ExplorerLink`: External link component pointing to the Stellar Testnet explorer.
- `LoadingSpinner`: Inline, standard loading indicator.
- `StatusBadge`: Network or connection status pill indicator.

## 27. Navigation
No router-based navigation needed for the MVP. This is a Single Page Application (SPA) with state-driven views. 
The main payment area transitions between states (`idle` → `review` → `signing` → `submitting` → `result`) in place. Clicking 'Send Another Payment' simply resets the UI back to the `idle` state.

## 28. Interaction Rules
- Disable form inputs during all transaction processing states.
- Disable the initial 'Review Transaction' button until all field validations pass.
- Show validation errors on field `blur` and on form submit attempts.
- Copy actions should display a brief 'Copied!' visual confirmation.
- External links (like block explorers) must open in new tabs (`target="_blank"`, `rel="noopener noreferrer"`).
- Wallet disconnect requires a clear action and should be easily reversible by clicking connect again.
- User cancellation within the Freighter extension should be handled gracefully (return to review state), not crash the application.
- **Mid-flow disconnection:** If the wallet disconnects at any point during the payment flow (including during review, signing, or submission), immediately reset the payment state to `IDLE` and return the user to the disconnected landing view. Display a brief inline message: *"Wallet disconnected. Please reconnect to continue."* Do not leave the user in a broken intermediate state.

## 29. Microcopy Guidelines
- Use plain, conversational language. Avoid blockchain jargon.
- **DO:** 'Send XLM' / **DON'T:** 'Execute Payment Operation'
- **DO:** 'Waiting for wallet confirmation' / **DON'T:** 'Awaiting cryptographic signature'
- **DO:** 'Payment successful' / **DON'T:** 'Transaction committed to ledger'
- Error messages should clearly suggest next steps.
- The network label must always be visible: 'Stellar Testnet'.
- Amounts should always display the 'XLM' suffix for clarity.
- Addresses should use the shortened format in main displays: `GABC...8F31`.
