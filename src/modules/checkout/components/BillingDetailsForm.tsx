
import React from 'react';
import { Input } from '@/components/ui/input';

interface BillingDetailsFormProps {
  billingDetails: any;
  handleBillingChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  formErrors: Record<string, string>;
  countries: { code: string; name: string; }[];
}

const BillingDetailsForm: React.FC<BillingDetailsFormProps> = ({
  billingDetails,
  handleBillingChange,
  formErrors,
  countries
}) => {
  return (
    <div className="billing-fields">
      <h3 className="text-xl font-bold mb-4">Billing details</h3>
      <div className="billing-fields-wrapper space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="billing_firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="billing_firstName"
              name="billing_firstName"
              value={billingDetails.firstName}
              onChange={handleBillingChange}
              className={formErrors.firstName ? "border-red-500" : ""}
            />
            {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="billing_lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="billing_lastName"
              name="billing_lastName"
              value={billingDetails.lastName}
              onChange={handleBillingChange}
              className={formErrors.lastName ? "border-red-500" : ""}
            />
            {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="billing_company" className="block text-sm font-medium text-gray-700 mb-1">
            Company name (optional)
          </label>
          <Input
            type="text"
            id="billing_company"
            name="billing_company"
            value={billingDetails.company}
            onChange={handleBillingChange}
          />
        </div>

        <div>
          <label htmlFor="billing_country" className="block text-sm font-medium text-gray-700 mb-1">
            Country / Region <span className="text-red-500">*</span>
          </label>
          <select
            id="billing_country"
            name="billing_country"
            value={billingDetails.country}
            onChange={handleBillingChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select a country / region…</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
        </div>

        <div>
          <label htmlFor="billing_address1" className="block text-sm font-medium text-gray-700 mb-1">
            Street address <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="billing_address1"
            name="billing_address1"
            placeholder="House number and street name"
            value={billingDetails.address1}
            onChange={handleBillingChange}
            className={formErrors.address1 ? "border-red-500" : ""}
          />
          {formErrors.address1 && <p className="text-red-500 text-sm mt-1">{formErrors.address1}</p>}
          <Input
            type="text"
            id="billing_address2"
            name="billing_address2"
            placeholder="Apartment, suite, unit, etc. (optional)"
            value={billingDetails.address2}
            onChange={handleBillingChange}
            className="mt-2"
          />
        </div>

        <div>
          <label htmlFor="billing_city" className="block text-sm font-medium text-gray-700 mb-1">
            Town / City <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="billing_city"
            name="billing_city"
            value={billingDetails.city}
            onChange={handleBillingChange}
            className={formErrors.city ? "border-red-500" : ""}
          />
          {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
        </div>

        <div>
          <label htmlFor="billing_state" className="block text-sm font-medium text-gray-700 mb-1">
            State / County <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="billing_state"
            name="billing_state"
            value={billingDetails.state}
            onChange={handleBillingChange}
            className={formErrors.state ? "border-red-500" : ""}
          />
          {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
        </div>

        <div>
          <label htmlFor="billing_postcode" className="block text-sm font-medium text-gray-700 mb-1">
            Postcode / ZIP <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="billing_postcode"
            name="billing_postcode"
            value={billingDetails.postcode}
            onChange={handleBillingChange}
            className={formErrors.postcode ? "border-red-500" : ""}
          />
          {formErrors.postcode && <p className="text-red-500 text-sm mt-1">{formErrors.postcode}</p>}
        </div>

        <div>
          <label htmlFor="billing_phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            id="billing_phone"
            name="billing_phone"
            value={billingDetails.phone}
            onChange={handleBillingChange}
            className={formErrors.phone ? "border-red-500" : ""}
          />
          {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
        </div>

        <div>
          <label htmlFor="billing_email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            id="billing_email"
            name="billing_email"
            value={billingDetails.email}
            onChange={handleBillingChange}
            className={formErrors.email ? "border-red-500" : ""}
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>
      </div>
    </div>
  );
};

export default BillingDetailsForm;
