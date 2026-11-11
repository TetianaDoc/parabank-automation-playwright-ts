import { UserAddress } from './user.model';

export interface BillPayee {
  name: string;
  address: UserAddress;
  phoneNumber: string;
  accountNumber: string;
}

export interface BillPaymentRequest {
  payee: BillPayee;
  verifyAccount: string;
  amount: string;
  fromAccountId?: string;
}

export interface BillPaymentResult {
  payeeName: string;
  amount: string;
  fromAccountId: string;
}
