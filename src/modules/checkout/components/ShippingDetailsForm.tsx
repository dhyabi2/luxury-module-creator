
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface ShippingDetailsFormProps {
  shipToDifferentAddress: boolean;
  handleShipToDifferentAddressChange: () => void;
  shippingDetails: any;
  handleShippingChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  formErrors: Record<string, string>;
  countries: { code: string; name: string; }[];
}

const ShippingDetailsForm: React.FC<ShippingDetailsFormProps> = ({
  shipToDifferentAddress,
  handleShipToDifferentAddressChange,
  shippingDetails,
  handleShippingChange,
  formErrors,
  countries
}) => {
  return (
    <div className="shipping-fields">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="ship_to_different_address"
          checked={shipToDifferentAddress}
          onCheckedChange={handleShipToDifferentAddressChange}
        />
        <label
          htmlFor="ship_to_different_address"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Ship to a different address?
        </label>
      </div>

      {shipToDifferentAddress && (
        <div className="shipping-fields-wrapper space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="shipping_firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="shipping_firstName"
                name="shipping_firstName"
                value={shippingDetails.firstName}
                onChange={handleShippingChange}
                className={formErrors.shippingFirstName ? "border-red-500" : ""}
              />
              {formErrors.shippingFirstName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.shippingFirstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="shipping_lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="shipping_lastName"
                name="shipping_lastName"
                value={shippingDetails.lastName}
                onChange={handleShippingChange}
                className={formErrors.shippingLastName ? "border-red-500" : ""}
              />
              {formErrors.shippingLastName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.shippingLastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="shipping_company" className="block text-sm font-medium text-gray-700 mb-1">
              Company name (optional)
            </label>
            <Input
              type="text"
              id="shipping_company"
              name="shipping_company"
              value={shippingDetails.company}
              onChange={handleShippingChange}
            />
          </div>

          <div>
            <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 mb-1">
              Country / Region <span className="text-red-500">*</span>
            </label>
            <select
              id="shipping_country"
              name="shipping_country"
              value={shippingDetails.country}
              onChange={handleShippingChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select a country / region…</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {formErrors.shippingCountry && (
              <p className="text-red-500 text-sm mt-1">{formErrors.shippingCountry}</p>
            )}
          </div>

          <div>
            <label htmlFor="shipping_address1" className="block text-sm font-medium text-gray-700 mb-1">
              Street address <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="shipping_address1"
              name="shipping_address1"
              placeholder="House number and street name"
              value={shippingDetails.address1}
              onChange={handleShippingChange}
              className={formErrors.shippingAddress1 ? "border-red-500" : ""}
            />
            {formErrors.shippingAddress1 && (
              <p className="text-red-500 text-sm mt-1">{formErrors.shippingAddress1}</p>
            )}
            <Input
              type="text"
              id="shipping_address2"
              name="shipping_address2"
              placeholder="Apartment, suite, unit, etc. (optional)"
              value={shippingDetails.address2}
              onChange={handleShippingChange}
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-1">
              Town / City <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="shipping_city"
              name="shipping_city"
              value={shippingDetails.city}
              onChange={handleShippingChange}
              className={formErrors.shippingCity ? "border-red-500" : ""}
            />
            {formErrors.shippingCity && (
              <p className="text-red-500 text-sm mt-1">{formErrors.shippingCity}</p>
            )}
          </div>

          <div>
            <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 mb-1">
              State / County <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="shipping_state"
              name="shipping_state"
              value={shippingDetails.state}
              onChange={handleShippingChange}
              className={formErrors.shippingState ? "border-red-500" : ""}
            />
            {formErrors.shippingState && (
              <p className="text-red-500 text-sm mt-1">{formErrors.shippingState}</p>
            )}
          </div>

          <div>
            <label htmlFor="shipping_postcode" className="block text-sm font-medium text-gray-700 mb-1">
              Postcode / ZIP <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="shipping_postcode"
              name="shipping_postcode"
              value={shippingDetails.postcode}
              onChange={handleShippingChange}
              className={formErrors.shippingPostcode ? "border-red-500" : ""}
            />
            {formErrors.shippingPostcode && (
              <p className="text-red-500 text-sm mt-1">{formErrors.shippingPostcode}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingDetailsForm;
