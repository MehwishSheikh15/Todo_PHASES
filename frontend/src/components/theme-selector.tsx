'use client';

import React from 'react';
import { useTheme } from '@/context/theme';
import { Palette, Sun, Moon, Droplets, Mountain, Zap, Waves, Leaf, Sunset } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, color: 'bg-blue-500' },
    { id: 'dark', name: 'Dark', icon: Moon, color: 'bg-gray-200' },
    { id: 'blue', name: 'Ocean', icon: Waves, color: 'bg-blue-600' },
    { id: 'green', name: 'Forest', icon: Leaf, color: 'bg-green-600' },
    { id: 'purple', name: 'Purple', icon: Zap, color: 'bg-purple-600' },
    { id: 'corporate', name: 'Corporate', icon: Palette, color: 'bg-slate-600' },
    { id: 'retro', name: 'Retro', icon: Sunset, color: 'bg-orange-600' },
    { id: 'ocean', name: 'Ocean', icon: Droplets, color: 'bg-cyan-600' },
    { id: 'forest', name: 'Forest', icon: Mountain, color: 'bg-emerald-600' },
    { id: 'sunset', name: 'Sunset', icon: Sunset, color: 'bg-red-600' },
  ];

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as any)}
              className={`p-2 rounded-lg border transition-all ${
                theme === themeOption.id
                  ? 'ring-2 ring-offset-2 ring-primary-500 border-primary-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
              }`}
              title={themeOption.name}
            >
              <IconComponent className={`h-4 w-4 ${themeOption.color.replace('bg-', 'text-')}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;