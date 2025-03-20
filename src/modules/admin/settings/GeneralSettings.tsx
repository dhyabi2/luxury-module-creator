
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface GeneralSettingsProps {
  storeSettings: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    enableGuestCheckout: boolean;
    maintenanceMode: boolean;
  };
  handleChange: (field: string, value: string | boolean) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ 
  storeSettings, 
  handleChange 
}) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-medium mb-4">Store Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={storeSettings.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeEmail">Store Email</Label>
            <Input
              id="storeEmail"
              type="email"
              value={storeSettings.storeEmail}
              onChange={(e) => handleChange('storeEmail', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storePhone">Store Phone</Label>
            <Input
              id="storePhone"
              value={storeSettings.storePhone}
              onChange={(e) => handleChange('storePhone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Input
              id="storeAddress"
              value={storeSettings.storeAddress}
              onChange={(e) => handleChange('storeAddress', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Store Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableGuestCheckout" className="block">Enable Guest Checkout</Label>
              <p className="text-sm text-gray-500">Allow customers to check out without creating an account</p>
            </div>
            <Switch
              id="enableGuestCheckout"
              checked={storeSettings.enableGuestCheckout}
              onCheckedChange={(checked) => handleChange('enableGuestCheckout', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode" className="block">Maintenance Mode</Label>
              <p className="text-sm text-gray-500">Put your store in maintenance mode</p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={storeSettings.maintenanceMode}
              onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
