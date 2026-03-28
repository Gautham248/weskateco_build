/**
 * GoKwik SDK global type declarations.
 * The GoKwik merchant integration script adds these to the window object.
 */

interface GoKwikMerchantInfo {
  mid?: string;
  environment?: string;
  type?: string;
  storeId?: number;
  fbPixel?: string;
  cart?: {
    id: string;
  };
}

declare global {
  interface Window {
    merchantInfo?: GoKwikMerchantInfo;
    gokwikSdk?: {
      init: () => void;
      [key: string]: any;
    };
    triggerGokwikCustomCheckout?: () => void;
  }
}

export {};
