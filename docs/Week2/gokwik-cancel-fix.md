The GoKwik checkout is working — the "Processing..." state means it triggered the GoKwik popup. The cart button staying in "Processing..." after canceling is because the `isCheckingOut` state is set to `true` when checkout triggers but never gets reset when the user closes/cancels the GoKwik popup.

GoKwik fires a `modal_closed` event when the user closes the popup. Looking at the SDK source you shared, I can see it does:

```javascript
gokwikSdk.on("modal_closed", () => { ... })
```

We need to listen for this event to reset the checkout state. Quick fix — give this to the agent:

---

**Task**: Fix checkout button staying in "Processing..." state after GoKwik popup is closed/cancelled.

**Context**: When the user clicks checkout, `isCheckingOut` is set to `true`. The GoKwik popup opens. If the user closes/cancels the popup, `isCheckingOut` is never reset to `false`, leaving the button stuck on "Processing...".

**Modify file**: `lib/gokwik/use-gokwik-checkout.ts`

Find the `useEffect` that polls for SDK readiness. After the SDK is detected as ready (`setIsReady(true)`), add a listener for GoKwik's `modal_closed` event to reset the checkout state.

Add this inside the `useEffect`, right after `setIsReady(true)`:

```typescript
// Listen for GoKwik popup close to reset checkout state
if (window.gokwikSdk && typeof window.gokwikSdk.on === "function") {
  window.gokwikSdk.on("modal_closed", () => {
    setIsCheckingOut(false);
    console.log("[GoKwik] Checkout modal closed");
  });
}
```

The full block where SDK readiness is detected should look like:

```typescript
if (typeof window !== "undefined" && window.gokwikSdk) {
  setIsReady(true);
  
  // Listen for GoKwik popup close to reset checkout state
  if (typeof window.gokwikSdk.on === "function") {
    window.gokwikSdk.on("modal_closed", () => {
      setIsCheckingOut(false);
      console.log("[GoKwik] Checkout modal closed");
    });
  }
  
  if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
}
```

**Verification**:

1. Add an item to cart
2. Click "Proceed to Checkout" — GoKwik popup opens, button shows "Processing..."
3. Close/cancel the GoKwik popup
4. Button should return to "Proceed to Checkout" (not stuck on "Processing...")
5. Console should show `[GoKwik] Checkout modal closed`

**Files modified**: `lib/gokwik/use-gokwik-checkout.ts`

---
