
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'M&K Watches',
    storeEmail: 'contact@mkwatches.com',
    storePhone: '+968 1234 5678',
    storeAddress: 'Al Khuwair, Muscat, Oman',
    enableNotifications: true,
    enableGuestCheckout: true,
    maintenanceMode: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    console.log('Fetching store settings...');
    
    try {
      // Direct Supabase call for settings
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }
      
      console.log('Settings fetched successfully:', data);
      
      if (data) {
        setStoreSettings({
          ...storeSettings,
          ...data
        });
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    console.log('Saving settings:', storeSettings);
    
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 1, // Assuming we have a single settings record
          ...storeSettings,
          updated_at: new Date()
        });
      
      if (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
      
      console.log('Settings saved successfully');
      alert('Settings saved successfully');
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Store Settings</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      ) : (
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
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
          </TabsContent>
          
          <TabsContent value="payment" className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
            <p className="text-gray-500 mb-4">Configure your payment gateway settings</p>
            
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-400">Payment settings will be implemented in future updates</p>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNotifications" className="block">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send email notifications for new orders</p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={storeSettings.enableNotifications}
                  onCheckedChange={(checked) => handleChange('enableNotifications', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <div className="mt-8">
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default Settings;
