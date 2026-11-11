export const PATHS = {
  home: 'index.htm',
  login: 'login.htm',
  register: 'register.htm',
  overview: 'overview.htm',
  openAccount: 'openaccount.htm',
  transfer: 'transfer.htm',
  billPay: 'billpay.htm',
  logout: 'logout.htm',
} as const;

export const MESSAGES = {
  loginError: 'An internal error has occurred and has been logged.',
  invalidLogin: 'The username and password could not be verified.',
  registrationSuccess: 'Your account was created successfully. You are now logged in.',
  accountOpenedTitle: 'Account Opened!',
  transferCompleteTitle: 'Transfer Complete!',
  billPaymentCompleteTitle: 'Bill Payment Complete',
} as const;
