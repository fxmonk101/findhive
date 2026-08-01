/**
 * Central place for storefront-wide policy values.
 * Adjust these to reflect actual store policy — every UI reads from here.
 */
export const STORE_CONFIG = {
  freeShippingThreshold: 150,
  flatShippingFee: 12,
  taxRate: 0.07,
  supportEmail: "support@findhive.shop",
  businessName: "findhive",
  businessAddress: "123 Market Street, Suite 400, Austin, TX 78701",
  businessPhone: "+1 (512) 555-0148",
  warehouseLocation: "our US warehouse",
  paymentLinkUrl: "https://example.com/payments/findhive",
  paymentEmail: "payments@findhive.shop",
  freeShippingMessage: "Free shipping on orders over $150 · Authentic products guaranteed",
  secureCheckoutLabel: "Secure checkout · Payment link sent after order confirmation",
};