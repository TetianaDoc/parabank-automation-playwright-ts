import { UserCredentials, User } from '../models/user.model';

export const DEFAULT_DEMO_USER: UserCredentials = {
  username: 'john',
  password: 'demo',
};

export const INVALID_USER_CREDENTIALS: UserCredentials = {
  username: 'invalid_user_999999',
  password: 'wrong_password_123',
};

export const STATIC_TEST_USER: User = {
  firstName: 'Jane',
  lastName: 'Doe',
  address: {
    street: '123 Testing Lane',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
  },
  phoneNumber: '310-555-0199',
  ssn: '123-45-6789',
  username: 'jane_doe_test',
  password: 'Password123!',
};
