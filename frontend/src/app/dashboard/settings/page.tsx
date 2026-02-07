'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { useTheme, Theme } from '@/context/theme';
import { useNotification } from '@/context/notification';
import { Bell, Palette, User, Shield, Info, Sun, Moon, Monitor } from 'lucide-react';

const SettingsPage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { notifications, markAllAsRead, clearAllNotifications } = useNotification();
  const [activeTab, setActiveTab] = useState('account');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSaveSettings = () => {
    // In a real app, you would save settings to the backend
    console.log('Settings saved');
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex-1 transition-all duration-300">
        <header className="bg-background shadow-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-foreground/70">Manage your account and preferences</p>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-sm border border-border">
              <div className="border-b border-border">
                <nav className="flex flex-wrap">
                  {[
                    { id: 'account', name: 'Account', icon: User },
                    { id: 'appearance', name: 'Appearance', icon: Palette },
                    { id: 'notifications', name: 'Notifications', icon: Bell },
                    { id: 'security', name: 'Security', icon: Shield },
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 -mb-px ${activeTab === tab.id
                          ? 'border-primary text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-foreground/70 hover:text-foreground'
                          }`}
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
                      <p className="text-foreground/70 mb-6">
                        Update your account details
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-foreground mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          id="displayName"
                          defaultValue={user?.display_name || ''}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          defaultValue={user?.email || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground/60 cursor-not-allowed"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={3}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                          placeholder="Tell us about yourself..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
                      <p className="text-foreground/70 mb-6">
                        Customize the look and feel of the application
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Theme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {[
                          { id: 'light', name: 'Light', icon: Sun },
                          { id: 'dark', name: 'Dark', icon: Moon },
                          { id: 'system', name: 'System', icon: Monitor },
                        ].map((themeOption) => {
                          const IconComponent = themeOption.icon;
                          return (
                            <button
                              key={themeOption.id}
                              onClick={() => setTheme(themeOption.id as Theme)}
                              className={`p-4 rounded-lg border ${theme === themeOption.id
                                ? 'ring-2 ring-offset-2 ring-primary-500 border-primary-500'
                                : 'border-border hover:border-primary-400'
                                }`}
                            >
                              <div className="text-center">
                                <IconComponent className="h-6 w-6 mx-auto mb-2 text-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                  {themeOption.name}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
                      <p className="text-foreground/70 mb-6">
                        Manage your notification preferences
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Email Notifications</p>
                          <p className="text-sm text-foreground/70">Receive email notifications for tasks</p>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-muted"
                          role="switch"
                        >
                          <span className="sr-only">Toggle email notifications</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-foreground shadow ring-0 transition duration-200 ease-in-out translate-x-0"
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Push Notifications</p>
                          <p className="text-sm text-foreground/70">Receive push notifications on this device</p>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-primary-500"
                          role="switch"
                        >
                          <span className="sr-only">Toggle push notifications</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Task Reminders</p>
                          <p className="text-sm text-foreground/70">Get reminded about upcoming tasks</p>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-primary-500"
                          role="switch"
                        >
                          <span className="sr-only">Toggle task reminders</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"
                          />
                        </button>
                      </div>

                      <div className="pt-4 flex justify-end space-x-3">
                        <button
                          onClick={markAllAsRead}
                          className="px-4 py-2 text-sm font-medium text-foreground/70 bg-muted rounded-lg hover:bg-accent"
                        >
                          Mark All as Read
                        </button>
                        <button
                          onClick={clearAllNotifications}
                          className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/20 rounded-lg hover:bg-destructive/30"
                        >
                          Clear All Notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
                      <p className="text-foreground/70 mb-6">
                        Manage your security settings
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Change Password</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                            />
                          </div>
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          onClick={handleSaveSettings}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activeTab !== 'notifications' && (
                <div className="p-6 border-t border-border flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;