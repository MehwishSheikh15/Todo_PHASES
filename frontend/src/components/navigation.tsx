'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { CheckCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Define navigation items (removed Home button as requested)
  type NavItem = {
    href: string;
    label: string;
    icon: string;
    key: string;
  };

  const navItems: NavItem[] = [
    { href: isAuthenticated ? '/todo-chatbot' : '/register', label: 'Todo Chatbot', icon: '🤖', key: 'todo-chatbot' },
    { href: isAuthenticated ? '/dashboard' : '/register', label: 'Dashboard', icon: '📊', key: 'dashboard' },
  ];

  // Auth items
  const authItems = isAuthenticated
    ? [{ href: '/login', label: 'Sign In' }, { href: '/register', label: 'Get Started' }]
    : [];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <Link href="/">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:cursor-pointer">
                TodoPro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link key={item.key} href={item.href}>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}>
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              ))}

              {!isAuthenticated ? (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-shadow">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome back!</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href}>
                <div
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            ))}

            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <div
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </div>
                </Link>
                <Link href="/register">
                  <div
                    className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </div>
                </Link>
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-600">
                Welcome back!
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}