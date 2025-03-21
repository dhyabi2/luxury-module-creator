
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
            <div className="w-40 h-40 flex items-center justify-center bg-white rounded-lg shadow-sm mb-4">
              <img 
                src={logoPreview} 
                alt="Store Logo" 
                className="max-w-full max-h-full p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://cdn-iicfd.nitrocdn.com/HlkbfeOkMsuGJIhigodBlPxupvwkWuYp/assets/images/optimized/rev-4b911b6/mnkwatches.store/wp-content/uploads/2022/03/ezgif.com-gif-maker-3-1.png'; // Fallback to new default logo
                  console.error('Error loading logo image:', logoPreview);
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mb-4">Current logo: {storeSettings.logoUrl}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <div className="flex gap-2">
              <Input
                id="logoUrl"
                value={newLogoUrl}
                placeholder="Enter URL to your logo"
                onChange={(e) => handleLogoUrlChange(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleLogoUpdate} type="button">
                Update Logo
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Enter a direct URL to your logo image. For best results, use an SVG or PNG with transparent background.
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
