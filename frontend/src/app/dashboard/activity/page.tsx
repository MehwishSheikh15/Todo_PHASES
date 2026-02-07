'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/sidebar';
import NotificationBadge from '@/components/notification-badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  CheckCircle,
  PlusCircle,
  Trash2,
  Edit,
  Clock,
  Plus
} from 'lucide-react';
import API_CONFIG from '@/lib/api-config';

interface ActivityItem {
  id: string;
  action: string;
  entity_type: string;
  entity_title: string;
  details?: string;
  timestamp: string;
}

export default function ActivityPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_CONFIG.BASE_URL}/activity`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          }
        });

        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getActivityStyle = (action: string) => {
    switch (action) {
      case 'CREATED_TASK':
        return { bg: 'bg-blue-100', text: 'text-blue-600', icon: <PlusCircle className="h-5 w-5 text-blue-600" /> };
      case 'COMPLETED_TASK':
        return { bg: 'bg-green-100', text: 'text-green-600', icon: <CheckCircle className="h-5 w-5 text-green-600" /> };
      case 'DELETED_TASK':
        return { bg: 'bg-red-100', text: 'text-red-600', icon: <Trash2 className="h-5 w-5 text-red-600" /> };
      case 'UPDATED_TASK':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: <Edit className="h-5 w-5 text-yellow-600" /> };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: <Activity className="h-5 w-5 text-gray-600" /> };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="text-lg">Loading activity...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <header className="bg-background shadow-sm border-b border-border">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
                <p className="text-foreground/70">Track your task management history</p>
              </div>

              <div className="flex items-center space-x-4">
                <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
                <NotificationBadge />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="relative border-l-2 border-indigo-200 ml-3 space-y-8 py-4">
              {activities.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100 ml-4">
                  <p className="text-gray-500">No recent activity found.</p>
                </div>
              ) : (
                activities.map((activity, index) => {
                  const style = getActivityStyle(activity.action);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative ml-6"
                    >
                      <span className={`absolute -left-[33px] flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${style.bg}`}>
                        {style.icon}
                      </span>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-gray-800">
                            {formatAction(activity.action)}: <span className="font-normal">"{activity.entity_title || 'Unknown Task'}"</span>
                          </h3>
                          <span className="text-xs text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {activity.details && (
                          <p className="text-gray-600 text-sm">{activity.details}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}