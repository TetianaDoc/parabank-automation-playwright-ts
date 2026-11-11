import { User } from '../models/user.model';

/**
 * Generates unique user data for testing registration and user workflows.
 * Keeps username within ParaBank's DB column constraints (<= 15 chars).
 */
export function createRandomUser(overrides: Partial<User> = {}): User {
  const randomSuffix = Math.floor(Math.random() * 900 + 100); // 3 digits
  const timeSlice = Date.now().toString().slice(-7); // 7 digits
  const uniqueUsername = `u${timeSlice}${randomSuffix}`; // 11 chars total, unique

  return {
    firstName: `Auto${randomSuffix}`,
    lastName: `User${randomSuffix}`,
    address: {
      street: `${randomSuffix} Main St`,
      city: 'Testcity',
      state: 'CA',
      zipCode: '90210',
    },
    phoneNumber: `555-${randomSuffix}`,
    ssn: `${randomSuffix}-12-3456`,
    username: uniqueUsername,
    password: `Pass${randomSuffix}!`,
    ...overrides,
  };
}
