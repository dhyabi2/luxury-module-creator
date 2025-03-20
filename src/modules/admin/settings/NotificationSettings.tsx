
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface NotificationSettingsProps {
  storeSettings: {
    enableNotifications: boolean;
  };
  handleChange: (field: string, value: string | boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  storeSettings,
  handleChange
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
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
    </div>
  );
};

export default NotificationSettings;
