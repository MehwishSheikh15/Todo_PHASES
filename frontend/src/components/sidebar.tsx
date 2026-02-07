'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ThemeSelector from '@/components/theme-selector';
import { useTheme } from '@/context/theme';
import { Menu, X, Activity, Timer, BarChart3, Users } from 'lucide-react';

import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  User,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  user: {
    id: string;
    email: string;
    display_name?: string;
  } | null;
  onLogout: () => void;
}

const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const pathname = usePathname();
  const { theme, setTheme, isSidebarOpen, toggleSidebar, closeSidebar } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' || theme.startsWith('light') ? 'dark' : 'light');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/dashboard/tasks', icon: ListTodo },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Activity', href: '/dashboard/activity', icon: Activity },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="p-2 bg-background border-border hover:bg-accent"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-full flex flex-col bg-background border-r border-border shadow-lg md:shadow-none transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                TodoPro
              </h1>
            )}

            <div className="flex items-center space-x-2">
              {/* Collapse/Expand button */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors md:hidden"
              >
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleSidebar}
                className="hidden md:block p-2 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isSidebarOpen && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                Appearance
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' || theme.startsWith('dark') ? (
                    <Sun className="h-4 w-4 text-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 text-foreground" />
                  )}
                </button>
                <ThemeSelector />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link href={item.href} onClick={() => window.innerWidth < 768 && closeSidebar()}>
                    <div
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
                          : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                      {isSidebarOpen && item.name}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.display_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.display_name || user?.email}
                </p>
                <p className="text-xs text-foreground/60">Professional Plan</p>
              </div>
            </div>

            <Button onClick={onLogout} variant="outline" className="w-full border-border hover:bg-accent">
              Logout
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
