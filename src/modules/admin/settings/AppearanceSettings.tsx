
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AppearanceSettingsProps {
  logoPreview: string;
  storeSettings: {
    logoUrl: string;
  };
  newLogoUrl: string;
  handleLogoUrlChange: (url: string) => void;
  handleLogoUpdate: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  logoPreview,
  storeSettings,
  newLogoUrl,
  handleLogoUrlChange,
  handleLogoUpdate
}) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-medium mb-4">Brand Logo</h3>
        <div className="grid gap-6">
          <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
            <div className="w-full h-40 flex items-center justify-center bg-white rounded-lg shadow-sm mb-4">
              <h2 className="text-3xl font-bold text-brand-dark tracking-wider">
                MKWatches
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Current brand name: MKWatches</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <div className="flex gap-2">
              <Input
                id="brandName"
                value="MKWatches"
                readOnly
                className="flex-1"
              />
              <Button type="button" disabled>
                Update Name
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Brand name is currently fixed as MKWatches.
            </p>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="customCss">Custom CSS (Advanced)</Label>
            <Textarea
              id="customCss"
              placeholder="/* Add your custom CSS here */"
              className="font-mono text-sm"
              rows={6}
            />
            <p className="text-xs text-gray-500">
              Custom CSS will be applied to the storefront. Use with caution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
