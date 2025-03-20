
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import GeneralSettings from './settings/GeneralSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import PaymentSettings from './settings/PaymentSettings';
import NotificationSettings from './settings/NotificationSettings';
import LoadingState from './settings/LoadingState';

const Settings = () => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'M&K Watches',
    storeEmail: 'contact@mkwatches.com',
    storePhone: '+968 1234 5678',
    storeAddress: 'Al Khuwair, Muscat, Oman',
    enableNotifications: true,
    enableGuestCheckout: true,
    maintenanceMode: false,
    logoUrl: '/logo.svg'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState('/logo.svg');
  const [newLogoUrl, setNewLogoUrl] = useState('');

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
          storeName: data.store_name,
          storeEmail: data.store_email,
          storePhone: data.store_phone,
          storeAddress: data.store_address,
          enableNotifications: data.enable_notifications,
          enableGuestCheckout: data.enable_guest_checkout,
          maintenanceMode: data.maintenance_mode,
          logoUrl: data.logo_url || '/logo.svg'
        });
        setLogoPreview(data.logo_url || '/logo.svg');
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
      const settingsToSave = {
        id: 1, // Assuming we have a single settings record
        store_name: storeSettings.storeName,
        store_email: storeSettings.storeEmail,
        store_phone: storeSettings.storePhone,
        store_address: storeSettings.storeAddress,
        enable_notifications: storeSettings.enableNotifications,
        enable_guest_checkout: storeSettings.enableGuestCheckout,
        maintenance_mode: storeSettings.maintenanceMode,
        logo_url: storeSettings.logoUrl,
        updated_at: new Date().toISOString() // Convert Date to ISO string
      };
      
      const { error } = await supabase
        .from('settings')
        .upsert(settingsToSave);
      
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

  const handleLogoUrlChange = (url: string) => {
    setNewLogoUrl(url);
    // Preview the logo
    if (url.trim() !== '') {
      setLogoPreview(url);
    } else {
      setLogoPreview(storeSettings.logoUrl);
    }
  };

  const handleLogoUpdate = () => {
    if (newLogoUrl.trim() !== '') {
      setStoreSettings(prev => ({
        ...prev,
        logoUrl: newLogoUrl
      }));
      setNewLogoUrl('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Store Settings</h2>
      
      {loading ? (
        <LoadingState />
      ) : (
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings 
              storeSettings={storeSettings} 
              handleChange={handleChange} 
            />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings 
              logoPreview={logoPreview}
              storeSettings={storeSettings}
              newLogoUrl={newLogoUrl}
              handleLogoUrlChange={handleLogoUrlChange}
              handleLogoUpdate={handleLogoUpdate}
            />
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings 
              storeSettings={storeSettings} 
              handleChange={handleChange} 
            />
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
