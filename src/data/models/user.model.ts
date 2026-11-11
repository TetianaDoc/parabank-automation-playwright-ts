export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  firstName: string;
  lastName: string;
  address: UserAddress;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
