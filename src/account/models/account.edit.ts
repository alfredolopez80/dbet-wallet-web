export class AccountEditModel {
  constructor() {
    this.country = {
      code3: '',
      name: ''
    };

    this.state = {
      code: '',
      name: ''
    };
  }

    firstName: string;

    lastName: string;

    dob: string;

    country: {
      code3: string; // address.countryCode
      name: string; // address.country
    }

    state: {
      code: string; // address.stateCode
      name: string; // address.state
    }

    city: string; // address.city

    postalCode: string; // address.postalCode

    address: string; // address.address1

    mobileNumber?: string;
}
