'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import TaskService from '@/services/task-service';
import Sidebar from '@/components/sidebar';
import { Plus, Search, Filter, Calendar, Bell, CheckCircle2, Circle, Clock, Flag, AlertTriangle, Check, Sparkles, Trophy, Target, TrendingUp, X } from 'lucide-react';
import NotificationBadge from '@/components/notification-badge';
import { useNotification } from '@/context/notification';

const DashboardPage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotification();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    due_date: undefined as string | undefined,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');

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

  useEffect(() => {
    // Filter tasks based on search term and filters
    let result = [...tasks];

    if (searchTerm) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      result = result.filter(task => task.priority === filterPriority);
    }

    setFilteredTasks(result);
  }, [tasks, searchTerm, filterStatus, filterPriority]);

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

  const handleAddTask = () => {
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      due_date: undefined,
    });
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
    });
    setShowModal(true);
  };

  const handleSaveTask = async () => {
    if (!user) return;

    try {
      const taskService = new TaskService();

      if (editingTask) {
        // Update existing task
        const updatedTask = await taskService.updateTask(user.id, editingTask.id, newTask);
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
        addNotification('success', 'Task Updated', `Task "${updatedTask.title}" has been updated successfully.`);
      } else {
        // Create new task
        const taskData = {
          ...newTask,
          user_id: user.id,
        };
        const createdTask = await taskService.createTask(user.id, taskData);
        setTasks([...tasks, createdTask]);
        addNotification('success', 'Task Created', `Task "${createdTask.title}" has been created successfully.`);
      }

      setShowModal(false);
      setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', due_date: undefined });
    } catch (error) {
      console.error('Error saving task:', error);
      addNotification('error', 'Error', 'Failed to save task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    const taskToDelete = tasks.find(t => t.id === taskId);

    if (window.confirm(`Are you sure you want to delete task "${taskToDelete?.title}"?`)) {
      try {
        const taskService = new TaskService();
        await taskService.deleteTask(user.id, taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
        addNotification('success', 'Task Deleted', `Task "${taskToDelete?.title}" has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting task:', error);
        addNotification('error', 'Error', 'Failed to delete task. Please try again.');
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!user) return;

    try {
      const taskService = new TaskService();
      const updatedTask = await taskService.completeTask(user.id, task.id);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));

      if (updatedTask.status === 'done') {
        addNotification('success', 'Task Completed', `Task "${updatedTask.title}" has been marked as completed.`);
      } else {
        addNotification('info', 'Task Reopened', `Task "${updatedTask.title}" has been reopened.`);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      addNotification('error', 'Error', 'Failed to update task status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect handled by useEffect
  }

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const pendingTasks = tasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

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
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-foreground/70">Welcome back, {user?.display_name || user?.email}</p>
              </div>

              <div className="flex items-center space-x-4">
                <Button onClick={handleAddTask} className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>

                <NotificationBadge />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl shadow-sm p-6 border border-border transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 animate-pulse">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground/70">Total Tasks</p>
                    <p className="text-2xl font-bold text-foreground animate-fade-in-down">{totalTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 animate-pulse">
                    <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground/70">Completed</p>
                    <p className="text-2xl font-bold text-foreground animate-fade-in-down">{completedTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 animate-pulse">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground/70">In Progress</p>
                    <p className="text-2xl font-bold text-foreground animate-fade-in-down">{inProgressTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 animate-pulse">
                    <Sparkles className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground/70">High Priority</p>
                    <p className="text-2xl font-bold text-foreground animate-fade-in-down">{highPriorityTasks}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-card rounded-xl shadow-sm p-6 mb-6 border border-border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
                    className="px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm transition-all duration-200 hover:border-purple-300 appearance-none cursor-pointer min-w-[130px]"
                  >
                    <option value="all">All Status</option>
                    <option value="todo">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>

                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
                    className="px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm transition-all duration-200 hover:border-purple-300 appearance-none cursor-pointer min-w-[130px]"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <Button variant="outline" className="flex items-center space-x-2 border-border text-foreground">
                    <Filter className="h-4 w-4" />
                    <span>Sort</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Your Tasks</h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    <span className="text-lg">Loading your tasks...</span>
                  </div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="p-12 text-center animate-fade-in-down">
                  <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="h-12 w-12 text-primary-500 dark:text-primary-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">No tasks yet</h3>
                  <p className="mt-2 text-foreground/70 max-w-md mx-auto">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                      ? 'No tasks match your current filters. Try adjusting your search or filters.'
                      : 'Get started by creating your first task and boost your productivity!'}
                  </p>
                  {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
                    <div className="mt-8">
                      <Button
                        onClick={handleAddTask}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create your first task
                      </Button>
                      <div className="mt-6 text-sm text-foreground/60">
                        Tip: Organize your tasks by priority and due dates for better productivity
                      </div>
                    </div>
                  )}
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                        setFilterPriority('all');
                      }}
                      className="mt-4 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      Clear all filters
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Task
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {filteredTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-muted transition-all duration-300 hover:shadow-sm">
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <button
                                onClick={() => handleToggleComplete(task)}
                                className={`mt-0.5 flex-shrink-0 ${task.status === 'done'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-foreground/50 hover:text-foreground'
                                  }`}
                              >
                                {task.status === 'done' ? (
                                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </button>
                              <div>
                                <div className="text-sm font-medium text-foreground">{task.title}</div>
                                {task.description && (
                                  <div className="text-sm text-foreground/70 mt-1 line-clamp-2">
                                    {task.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'done'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : task.status === 'in-progress'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                              {task.status === 'todo' ? 'Pending' : task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Flag className={`h-4 w-4 mr-1 ${task.priority === 'high'
                                  ? 'text-red-500'
                                  : task.priority === 'medium'
                                    ? 'text-yellow-500'
                                    : 'text-blue-500'
                                }`} />
                              <span className={`text-xs font-medium ${task.priority === 'high'
                                  ? 'text-red-700 dark:text-red-400'
                                  : task.priority === 'medium'
                                    ? 'text-yellow-700 dark:text-yellow-400'
                                    : 'text-blue-700 dark:text-blue-400'
                                }`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/60">
                            {new Date(task.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="text-primary hover:text-primary/80 p-1 rounded hover:bg-accent"
                                title="Edit task"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-accent"
                                title="Delete task"
                              >
                                Delete
                              </button>
                            </div>
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

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-foreground/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md border border-border transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {editingTask ? 'Edit Task' : 'Add New Task'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-foreground/60 hover:text-foreground rounded-full p-1 hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Task Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground transition-all duration-200"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground transition-all duration-200 resize-none"
                    placeholder="Enter task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm transition-all duration-200 hover:border-purple-300 appearance-none cursor-pointer"
                    >
                      <option value="todo">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm transition-all duration-200 hover:border-purple-300 appearance-none cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Add due date field */}
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-2">
                    Due Date (Optional)
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={newTask.due_date || ''}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value || undefined })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground transition-all duration-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="border-border text-foreground hover:bg-accent transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTask}
                  disabled={!newTask.title.trim()}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;