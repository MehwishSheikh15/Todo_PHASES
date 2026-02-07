'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { Task } from '@/types/task';
import TaskService from '@/services/task-service';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
  });

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

  const handleAddTask = async () => {
    if (!user || !selectedDate) return;

    try {
      const taskService = new TaskService();
      const taskData = {
        ...newTask,
        user_id: user.id,
        due_date: selectedDate.toISOString().split('T')[0], // Send date only (YYYY-MM-DD)
      };

      const createdTask = await taskService.createTask(user.id, taskData);

      setTasks([...tasks, createdTask]);
      setShowAddTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
      });

      // Fetch tasks again to update the calendar view
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      // Check if the task has a due date and if it matches the current date
      if (task.due_date) {
        // Parse "YYYY-MM-DD" or similar strings without timezone shifts
        const taskDateParts = task.due_date.split('T')[0].split('-');
        if (taskDateParts.length === 3) {
          const year = parseInt(taskDateParts[0]);
          const month = parseInt(taskDateParts[1]) - 1; // 0-based month
          const day = parseInt(taskDateParts[2]);

          return (
            day === date.getDate() &&
            month === date.getMonth() &&
            year === date.getFullYear()
          );
        }

        // Fallback for other date formats
        const taskDueDate = new Date(task.due_date);
        return (
          taskDueDate.getDate() === date.getDate() &&
          taskDueDate.getMonth() === date.getMonth() &&
          taskDueDate.getFullYear() === date.getFullYear()
        );
      }

      // Fallback to created_at if no due_date exists
      const taskCreatedDate = new Date(task.created_at);
      return (
        taskCreatedDate.getDate() === date.getDate() &&
        taskCreatedDate.getMonth() === date.getMonth() &&
        taskCreatedDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex-1 transition-all duration-300 animate-fade-in-down">
        <header className="bg-background shadow-sm border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
                <p className="text-foreground/70">Manage your tasks by date</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Calendar Header */}
            <div className="bg-card rounded-xl shadow-sm p-6 mb-6 border border-border animate-fade-in-down">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {monthName}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 rounded-lg border border-purple-200 bg-white text-gray-800 hover:bg-purple-50 transition-all duration-200 hover:scale-105 hover:shadow-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-2 text-sm font-medium text-gray-800 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-200 hover:scale-105 hover:shadow-sm focus:ring-2 focus:ring-purple-500"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 rounded-lg border border-purple-200 bg-white text-gray-800 hover:bg-purple-50 transition-all duration-200 hover:scale-105 hover:shadow-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 group animate-fade-in-down">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-foreground/70">
                    {day}
                  </div>
                ))}

                {daysInMonth.map((date, index) => (
                  <div
                    key={index}
                    className={`min-h-32 p-2 border border-border rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md ${date ? 'bg-card hover:bg-accent cursor-pointer' : 'bg-muted'
                      } ${selectedDate &&
                        date &&
                        date.getDate() === selectedDate.getDate() &&
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getFullYear() === selectedDate.getFullYear()
                        ? 'ring-2 ring-primary ring-opacity-50 bg-primary/10 scale-[1.02]' : ''}`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <div className="flex justify-between items-start">
                          <div className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full transition-colors ${selectedDate &&
                            date.getDate() === selectedDate.getDate() &&
                            date.getMonth() === selectedDate.getMonth() &&
                            date.getFullYear() === selectedDate.getFullYear()
                            ? 'bg-primary text-primary-foreground'
                            : new Date().getDate() === date.getDate() &&
                              new Date().getMonth() === date.getMonth() &&
                              new Date().getFullYear() === date.getFullYear()
                              ? 'bg-secondary text-secondary-foreground'
                              : 'text-foreground'
                            }`}>
                            {date.getDate()}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(date);
                              setShowAddTaskModal(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-full bg-white hover:bg-purple-100 text-purple-600 border border-purple-200 shadow-sm text-xs ml-1 hover:scale-110 hover:shadow-md hover:border-purple-300 focus:ring-2 focus:ring-purple-500"
                            title="Add task to this date"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                          {getTasksForDate(date).slice(0, 3).map(task => (
                            <div
                              key={task.id}
                              className={`text-xs p-1 rounded truncate transition-colors ${task.priority === 'high'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800/50'
                                : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800/50'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800/50'
                                }`}
                            >
                              {task.title}
                            </div>
                          ))}
                          {getTasksForDate(date).length > 3 && (
                            <div className="text-xs text-foreground/60">
                              +{getTasksForDate(date).length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-200 transform hover:shadow-md border border-purple-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {getTasksForDate(selectedDate).length > 0 ? (
                    getTasksForDate(selectedDate).map(task => (
                      <div key={task.id} className="p-3 border border-border rounded-lg">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-foreground">{task.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                            : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
                            }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div>
                          {task.description && (
                            <p className="text-sm text-foreground/70 mt-1">{task.description}</p>
                          )}
                          <div className="text-xs text-foreground/60 mt-1">
                            Added: {new Date(task.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center mt-2 space-x-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'done'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
                            : task.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                            }`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-foreground/60">
                      <CalendarIcon className="h-12 w-12 mx-auto text-foreground/30 mb-2" />
                      <p>No tasks scheduled for this day</p>
                      <button
                        onClick={() => setShowAddTaskModal(true)}
                        className="mt-4 text-primary hover:text-primary/80"
                      >
                        Add your first task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && selectedDate && (
        <div className="fixed inset-0 bg-foreground/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md border border-border transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Add Task for {selectedDate.toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="text-gray-400 hover:text-purple-600 rounded-full p-1 hover:bg-purple-50"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm"
                    placeholder="Enter task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm transition-all duration-200 hover:border-purple-300 appearance-none cursor-pointer"
                    >
                      <option value="todo">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm transition-all duration-200 hover:border-purple-300 appearance-none cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-1">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      // Update the selected date but keep the time component
                      const updatedDate = new Date(selectedDate || new Date());
                      updatedDate.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
                      setSelectedDate(updatedDate);
                    }}
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 shadow-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 border border-purple-200 rounded-lg text-gray-800 bg-white hover:bg-purple-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.title.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 border border-purple-300"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;