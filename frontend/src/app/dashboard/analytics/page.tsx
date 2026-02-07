'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { Task } from '@/types/task';
import TaskService from '@/services/task-service';
import { BarChart3, TrendingUp, Calendar, Clock, Flag, CheckCircle, AlertCircle, Users } from 'lucide-react';

const AnalyticsPage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTasks();
    }
  }, [isAuthenticated, user]);

  const fetchTasks = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const taskService = new TaskService();
      const userTasks = await taskService.getTasks(user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Calculate analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'todo').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(t => t.priority === 'low').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get tasks for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  }).reverse();

  const tasksByDay = last7Days.map(day => {
    const date = new Date(day);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: day,
      count: tasks.filter(t => new Date(t.created_at).toDateString() === day).length
    };
  });

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex-1 transition-all duration-300">
        <header className="bg-background shadow-sm border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
                <p className="text-foreground/70">Track your productivity metrics</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground/70">Total Tasks</p>
                    <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green/10">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground/70">Completed</p>
                    <p className="text-2xl font-bold text-foreground">{completedTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow/10">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground/70">In Progress</p>
                    <p className="text-2xl font-bold text-foreground">{inProgressTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground/70">Completion Rate</p>
                    <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Task Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">Pending</span>
                      <span className="text-sm font-medium text-foreground">{pendingTasks}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full"
                        style={{ width: `${totalTasks ? (pendingTasks / totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">In Progress</span>
                      <span className="text-sm font-medium text-foreground">{inProgressTasks}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${totalTasks ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">Completed</span>
                      <span className="text-sm font-medium text-foreground">{completedTasks}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Priority Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">High Priority</span>
                      <span className="text-sm font-medium text-foreground">{highPriorityTasks}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${totalTasks ? (highPriorityTasks / totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">Medium Priority</span>
                      <span className="text-sm font-medium text-foreground">{mediumPriorityTasks}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${totalTasks ? (mediumPriorityTasks / totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">Low Priority</span>
                      <span className="text-sm font-medium text-foreground">{lowPriorityTasks}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${totalTasks ? (lowPriorityTasks / totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-foreground/60">
                  <BarChart3 className="h-12 w-12 mx-auto text-foreground/30 mb-2" />
                  <p>No tasks recorded yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {tasks.slice(0, 5).map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-foreground/60 truncate max-w-xs">
                                {task.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.status === 'done'
                                ? 'bg-green/20 text-green-700 dark:bg-green/30 dark:text-green-400'
                                : task.status === 'in-progress'
                                  ? 'bg-yellow/20 text-yellow-700 dark:bg-yellow/30 dark:text-yellow-400'
                                  : 'bg-gray/20 text-gray-700 dark:bg-gray/30 dark:text-gray-400'
                            }`}>
                              {task.status === 'todo' ? 'Pending' : task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.priority === 'high'
                                ? 'bg-red/20 text-red-700 dark:bg-red/30 dark:text-red-400'
                                : task.priority === 'medium'
                                  ? 'bg-yellow/20 text-yellow-700 dark:bg-yellow/30 dark:text-yellow-400'
                                  : 'bg-blue/20 text-blue-700 dark:bg-blue/30 dark:text-blue-400'
                            }`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/60">
                            {new Date(task.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;