import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { AuthProvider } from '@/context/auth';
import { ThemeProvider } from '@/context/theme';
import { NotificationProvider } from '@/context/notification';
import Navigation from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TodoPro - Advanced Productivity Suite',
  description: 'Streamline your tasks with AI-powered productivity tools and smart notifications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <div className="min-h-screen bg-background antialiased">
                <Navigation />
                <div className="pt-4">
                  {children}
                </div>
              </div>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}