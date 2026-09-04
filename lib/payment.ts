// Payment Direct to UPI/Bank - Mock Data + Config - No Razorpay
// Payment via Admin Panel Only - Direct to Shop Owner

export const PAYMENT_MOCK_DATA = {
  upi: {
    id: 'suhailmobile@okicici',
    alternateId: '8299384658@upi',
    name: 'Suhail Mobile Shop',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=suhailmobile@okicici%26pn=Suhail%20Mobile%20Shop%26cu=INR',
    // For demo - real QR should be generated via InsForge Storage after admin uploads
    instructions: 'Scan QR or pay to UPI ID. After payment, upload screenshot and enter UTR number.'
  },
  bank: {
    accountName: 'Suhail Mobile Shop',
    accountNumber: '12345678901234',
    ifsc: 'CNRB0001234',
    bankName: 'Canara Bank',
    branch: 'Kuchery Road, Rae Bareli - 229001, UP',
    accountType: 'Current Account',
    instructions: 'Transfer full amount to bank account. Upload payment proof screenshot with UTR.'
  },
  cod: {
    enabled: false, // For home/online orders, full payment required - COD disabled as per request
    note: 'COD not available for home/online delivery. Full payment required via UPI/Bank.'
  },
  rules: {
    homeDelivery: {
      requiresFullPayment: true,
      requiresScreenshot: true,
      requiresUTR: true,
      message: 'For home delivery / online orders, FULL PAYMENT required upfront. Upload screenshot + UTR for verification.'
    },
    storePickup: {
      requiresFullPayment: false,
      message: 'For store pickup, you can pay at store, but advance booking recommended.'
    }
  }
}

export type PaymentMethod = 'upi' | 'bank' | 'cod'

export interface PaymentProof {
  method: PaymentMethod
  upiId?: string
  utrNumber: string // UTR / Transaction ID / Reference No
  screenshotUrl?: string // Uploaded screenshot URL from InsForge Storage
  screenshotFile?: File
  amount: number
  timestamp: string
  verified: boolean
}

export interface OrderPaymentData {
  paymentMethod: PaymentMethod
  paymentStatus: 'pending_verification' | 'verified' | 'failed'
  upiIdUsed?: string
  bankAccountUsed?: string
  utrNumber: string
  screenshotUrl: string
  amountPaid: number
  paidAt: string
  deliveryType: 'home_delivery' | 'store_pickup'
}

// Generate UPI payment link
export function generateUPILink(amount: number, orderId: string, upiId: string = PAYMENT_MOCK_DATA.upi.id) {
  const note = `Order ${orderId} - Suhail Mobile Shop Raebareli`
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent('Suhail Mobile Shop')}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
}

// Validate UTR - should be 12-22 alphanumeric, typically 12 digits for UPI
export function validateUTR(utr: string): boolean {
  if (!utr) return false
  const cleaned = utr.replace(/\s/g, '')
  // UTR is typically 12-22 chars, alphanumeric, at least 10 chars
  return cleaned.length >= 10 && cleaned.length <= 22 && /^[A-Za-z0-9]+$/.test(cleaned)
}

// Validate screenshot file
export function validateScreenshot(file: File): { valid: boolean; error?: string } {
  if (!file) return { valid: false, error: 'Screenshot required' }
  if (!file.type.startsWith('image/')) return { valid: false, error: 'Only image files allowed (JPG, PNG)' }
  if (file.size > 5 * 1024 * 1024) return { valid: false, error: 'File too large - Max 5MB' }
  return { valid: true }
}

// Format payment method display
export function getPaymentMethodDisplay(method: PaymentMethod): string {
  switch (method) {
    case 'upi': return 'UPI Payment (Google Pay, PhonePe, Paytm)'
    case 'bank': return 'Bank Transfer (NEFT/IMPS)'
    case 'cod': return 'Cash on Delivery'
    default: return method
  }
}
