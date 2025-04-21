
export interface BillingDetails {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes: string;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
}

export interface Country {
  code: string;
  name: string;
}
