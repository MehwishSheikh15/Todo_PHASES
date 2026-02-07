'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task } from '@/types/task';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (type: NotificationType, title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  scheduleTaskReminder: (task: Task, reminderTime: Date) => void;
  cancelTaskReminder: (taskId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(notificationsWithDates);
      } catch (e) {
        console.error('Failed to parse notifications from localStorage', e);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (type: NotificationType, title: string, message: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove notification after 5 seconds if it's not an error
    if (type !== 'error') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const scheduleTaskReminder = (task: Task, reminderTime: Date) => {
    const now = new Date();
    const timeDiff = reminderTime.getTime() - now.getTime();

    if (timeDiff > 0) {
      // Schedule the reminder
      setTimeout(() => {
        addNotification(
          'info',
          'Task Reminder',
          `Reminder: "${task.title}" is due soon!`
        );
      }, timeDiff);
    } else {
      // If the reminder time is in the past, show it immediately
      addNotification(
        'warning',
        'Overdue Task',
        `Task "${task.title}" was due at ${reminderTime.toLocaleTimeString()}`
      );
    }
  };

  const cancelTaskReminder = (taskId: string) => {
    // In a real implementation, we would cancel the scheduled timeout
    // For now, we'll just remove any related notifications
    setNotifications(prev =>
      prev.filter(notification => !notification.message.includes(taskId))
    );
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    scheduleTaskReminder,
    cancelTaskReminder,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationPanel />
    </NotificationContext.Provider>
  );
};

const NotificationPanel = () => {
  const { notifications, markAsRead, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80 max-w-[90vw]">
      {notifications.slice(0, 5).map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 bg-white ${
            notification.type === 'success'
              ? 'border-green-500 text-green-700'
              : notification.type === 'error'
              ? 'border-red-500 text-red-700'
              : notification.type === 'warning'
              ? 'border-yellow-500 text-yellow-700'
              : 'border-blue-500 text-blue-700'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{notification.title}</h4>
              <p className="text-sm mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => {
                markAsRead(notification.id);
                setTimeout(() => removeNotification(notification.id), 300);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};