import React, { useState } from 'react';
import { Calendar, Mail, Shield, Bell, X, Check, ExternalLink } from 'lucide-react';

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
};

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'notifications' | 'security'>('integrations');
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync your meetings and events',
      icon: <Calendar className="text-blue-600" />,
      connected: false,
    },
    {
      id: 'outlook-calendar',
      name: 'Outlook Calendar',
      description: 'Import your Outlook calendar events',
      icon: <Calendar className="text-blue-500" />,
      connected: true,
      lastSync: '2024-03-28T10:30:00Z',
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Connect your Gmail account',
      icon: <Mail className="text-red-500" />,
      connected: true,
      lastSync: '2024-03-28T10:30:00Z',
    },
    {
      id: 'outlook-mail',
      name: 'Outlook Mail',
      description: 'Sync your Outlook emails',
      icon: <Mail className="text-blue-500" />,
      connected: false,
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'daily-reminder',
      title: 'Daily Journal Reminder',
      description: 'Get reminded to write your daily journal entry',
      enabled: true,
    },
    {
      id: 'meeting-sync',
      title: 'Meeting Sync Notifications',
      description: 'Receive notifications when new meetings are synced',
      enabled: false,
    },
    {
      id: 'email-digest',
      title: 'Email Digest',
      description: 'Receive a daily digest of your email summaries',
      enabled: true,
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('integrations')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'integrations'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Integrations
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Security
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {integration.icon}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {integration.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {integration.description}
                        </p>
                        {integration.lastSync && (
                          <p className="text-xs text-gray-400 mt-1">
                            Last synced: {new Date(integration.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {integration.connected ? (
                        <button
                          onClick={() => toggleIntegration(integration.id)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          <X size={16} />
                          Disconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleIntegration(integration.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <ExternalLink size={16} />
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {notification.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notification.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notification.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Shield size={16} />
                  Enable 2FA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}