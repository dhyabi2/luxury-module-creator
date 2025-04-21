
import { BillingDetails, ShippingDetails } from '../types/checkout';

export const validateCheckoutForm = (
  billingDetails: BillingDetails,
  shipToDifferentAddress: boolean,
  shippingDetails: ShippingDetails
) => {
  const errors: Record<string, string> = {};

  if (!billingDetails.firstName) errors.firstName = "First name is required";
  if (!billingDetails.lastName) errors.lastName = "Last name is required";
  if (!billingDetails.country) errors.country = "Country is required";
  if (!billingDetails.address1) errors.address1 = "Street address is required";
  if (!billingDetails.city) errors.city = "Town/City is required";
  if (!billingDetails.state) errors.state = "State/County is required";
  if (!billingDetails.postcode) errors.postcode = "Postcode/ZIP is required";
  if (!billingDetails.phone) errors.phone = "Phone is required";
  if (!billingDetails.email) errors.email = "Email address is required";
  else if (!/\S+@\S+\.\S+/.test(billingDetails.email)) errors.email = "Email address is invalid";

  if (shipToDifferentAddress) {
    if (!shippingDetails.firstName) errors.shippingFirstName = "First name is required";
    if (!shippingDetails.lastName) errors.shippingLastName = "Last name is required";
    if (!shippingDetails.country) errors.shippingCountry = "Country is required";
    if (!shippingDetails.address1) errors.shippingAddress1 = "Street address is required";
    if (!shippingDetails.city) errors.shippingCity = "Town/City is required";
    if (!shippingDetails.state) errors.shippingState = "State/County is required";
    if (!shippingDetails.postcode) errors.shippingPostcode = "Postcode/ZIP is required";
  }

  return errors;
};
