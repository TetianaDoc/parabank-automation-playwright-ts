export type AccountType = 'CHECKING' | 'SAVINGS';

export interface Account {
  id: string;
  balance: number;
  availableAmount: number;
  type?: AccountType;
}

export interface OpenAccountRequest {
  type: AccountType;
  fromAccountId?: string;
}
