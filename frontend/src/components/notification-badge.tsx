'use client';

import React from 'react';
import { useNotification } from '@/context/notification';
import { Bell } from 'lucide-react';

const NotificationBadge = () => {
  const { unreadCount } = useNotification();

  return (
    <div className="relative">
      <Bell className="h-6 w-6 text-purple-600 cursor-pointer" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;