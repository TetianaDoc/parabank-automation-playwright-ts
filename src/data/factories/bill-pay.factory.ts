import { BillPaymentRequest } from '../models/bill-pay.model';

/**
 * Generates dynamic bill payment data.
 */
export function createRandomBillPayment(overrides: Partial<BillPaymentRequest> = {}): BillPaymentRequest {
  const randomSuffix = Math.floor(Math.random() * 10000);
  const accountNumber = `${100000 + randomSuffix}`;

  return {
    payee: {
      name: `Payee ${randomSuffix}`,
      address: {
        street: `${randomSuffix} Payment Rd`,
        city: 'Paycity',
        state: 'NY',
        zipCode: '10001',
      },
      phoneNumber: `555-${String(randomSuffix).padStart(4, '0')}`,
      accountNumber,
    },
    verifyAccount: accountNumber,
    amount: (Math.floor(Math.random() * 50) + 10).toFixed(2),
    ...overrides,
  };
}
