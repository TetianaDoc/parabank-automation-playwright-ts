export interface TransferRequest {
  amount: string;
  fromAccountId?: string;
  toAccountId?: string;
}

export interface TransferResult {
  amount: string;
  fromAccountId: string;
  toAccountId: string;
}
