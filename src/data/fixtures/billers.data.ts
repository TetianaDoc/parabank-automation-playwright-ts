import { BillPayee } from '../models/bill-pay.model';

export const SAMPLE_BILL_PAYEES: Record<string, BillPayee> = {
  electricUtility: {
    name: 'City Electric Co.',
    address: {
      street: '456 Power Grid Way',
      city: 'Electric City',
      state: 'WA',
      zipCode: '99163',
    },
    phoneNumber: '509-555-0144',
    accountNumber: '987654321',
  },
  waterService: {
    name: 'Metro Water Dept.',
    address: {
      street: '789 Reservoir Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
    },
    phoneNumber: '217-555-0177',
    accountNumber: '123456789',
  },
};
