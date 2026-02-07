'use client';

import * as React from 'react';

export type Theme =
  | 'light'
  | 'dark'
  | 'system'
  | 'blue'
  | 'green'
  | 'purple'
  | 'corporate'
  | 'retro'
  | 'ocean'
  | 'forest'
  | 'sunset';

type BaseTheme = 'light' | 'dark';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  baseTheme: BaseTheme;
  setTheme: (theme: Theme) => void;
  getThemeClass: () => string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined
);

/* ─────────────────────────────────────────── */
/* THEME CONFIG with CSS Variables             */
/* ─────────────────────────────────────────── */
const themeConfig: Record<
  Theme,
  { base: BaseTheme; cssVariables: Record<string, string> }
> = {
  light: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#eff6ff',
      '--primary-100': '#dbeafe',
      '--primary-200': '#bfdbfe',
      '--primary-300': '#93c5fd',
      '--primary-400': '#60a5fa',
      '--primary-500': '#3b82f6',
      '--primary-600': '#2563eb',
      '--primary-700': '#1d4ed8',
      '--primary-800': '#1e40af',
      '--primary-900': '#1e3a8a',
      '--secondary-50': '#f0fdfaf',
      '--secondary-100': '#ccfbf1',
      '--secondary-200': '#99f6e4',
      '--secondary-300': '#5eead4',
      '--secondary-400': '#2dd4bf',
      '--secondary-500': '#0d9488',
      '--secondary-600': '#0f766e',
      '--secondary-700': '#115e59',
      '--secondary-800': '#134e4a',
      '--secondary-900': '#114e4e',
    }
  },
  dark: {
    base: 'dark',
    cssVariables: {
      '--primary-50': '#1e293b',
      '--primary-100': '#334155',
      '--primary-200': '#475569',
      '--primary-300': '#64748b',
      '--primary-400': '#94a3b8',
      '--primary-500': '#3b82f6',
      '--primary-600': '#2563eb',
      '--primary-700': '#1d4ed8',
      '--primary-800': '#1e40af',
      '--primary-900': '#1e3a8a',
      '--secondary-50': '#111827',
      '--secondary-100': '#1f2937',
      '--secondary-200': '#374151',
      '--secondary-300': '#4b5563',
      '--secondary-400': '#6b7280',
      '--secondary-500': '#9ca3af',
      '--secondary-600': '#d1d5db',
      '--secondary-700': '#e5e7eb',
      '--secondary-800': '#f3f4f6',
      '--secondary-900': '#f9fafb',
    }
  },
  blue: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#eff6ff',
      '--primary-100': '#dbeafe',
      '--primary-200': '#bfdbfe',
      '--primary-300': '#93c5fd',
      '--primary-400': '#60a5fa',
      '--primary-500': '#3b82f6',
      '--primary-600': '#2563eb',
      '--primary-700': '#1d4ed8',
      '--primary-800': '#1e40af',
      '--primary-900': '#1e3a8a',
      '--secondary-50': '#eff6ff',
      '--secondary-100': '#dbeafe',
      '--secondary-200': '#bfdbfe',
      '--secondary-300': '#93c5fd',
      '--secondary-400': '#60a5fa',
      '--secondary-500': '#3b82f6',
      '--secondary-600': '#2563eb',
      '--secondary-700': '#1d4ed8',
      '--secondary-800': '#1e40af',
      '--secondary-900': '#1e3a8a',
    }
  },
  green: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#f0fdf8',
      '--primary-100': '#dcfce7',
      '--primary-200': '#bbf7d0',
      '--primary-300': '#86efac',
      '--primary-400': '#4ade80',
      '--primary-500': '#22c55e',
      '--primary-600': '#16a34a',
      '--primary-700': '#15803d',
      '--primary-800': '#166534',
      '--primary-900': '#14532d',
      '--secondary-50': '#f0fdf4',
      '--secondary-100': '#dcfce7',
      '--secondary-200': '#bbf7d0',
      '--secondary-300': '#86efac',
      '--secondary-400': '#4ade80',
      '--secondary-500': '#22c55e',
      '--secondary-600': '#16a34a',
      '--secondary-700': '#15803d',
      '--secondary-800': '#166534',
      '--secondary-900': '#14532d',
    }
  },
  purple: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#faf5ff',
      '--primary-100': '#f3e8ff',
      '--primary-200': '#e9d5ff',
      '--primary-300': '#d8b4fe',
      '--primary-400': '#c084fc',
      '--primary-500': '#a855f7',
      '--primary-600': '#9333ea',
      '--primary-700': '#7e22ce',
      '--primary-800': '#6b21a8',
      '--primary-900': '#581c87',
      '--secondary-50': '#faf5ff',
      '--secondary-100': '#f3e8ff',
      '--secondary-200': '#e9d5ff',
      '--secondary-300': '#d8b4fe',
      '--secondary-400': '#c084fc',
      '--secondary-500': '#a855f7',
      '--secondary-600': '#9333ea',
      '--secondary-700': '#7e22ce',
      '--secondary-800': '#6b21a8',
      '--secondary-900': '#581c87',
    }
  },
  corporate: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#f8fafc',
      '--primary-100': '#f1f5f9',
      '--primary-200': '#e2e8f0',
      '--primary-300': '#cbd5e1',
      '--primary-400': '#94a3b8',
      '--primary-500': '#64748b',
      '--primary-600': '#475569',
      '--primary-700': '#334155',
      '--primary-800': '#1e293b',
      '--primary-900': '#0f172a',
      '--secondary-50': '#f8fafc',
      '--secondary-100': '#f1f5f9',
      '--secondary-200': '#e2e8f0',
      '--secondary-300': '#cbd5e1',
      '--secondary-400': '#94a3b8',
      '--secondary-500': '#64748b',
      '--secondary-600': '#475569',
      '--secondary-700': '#334155',
      '--secondary-800': '#1e293b',
      '--secondary-900': '#0f172a',
    }
  },
  retro: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#fffbeb',
      '--primary-100': '#fef3c7',
      '--primary-200': '#fde68a',
      '--primary-300': '#fcd34d',
      '--primary-400': '#fbbf24',
      '--primary-500': '#f59e0b',
      '--primary-600': '#d97706',
      '--primary-700': '#b45309',
      '--primary-800': '#92400e',
      '--primary-900': '#78350f',
      '--secondary-50': '#fefce8',
      '--secondary-100': '#fef9c3',
      '--secondary-200': '#fef08a',
      '--secondary-300': '#fde047',
      '--secondary-400': '#facc15',
      '--secondary-500': '#eab308',
      '--secondary-600': '#ca8a04',
      '--secondary-700': '#a16207',
      '--secondary-800': '#854d0e',
      '--secondary-900': '#713f12',
    }
  },
  ocean: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#ecfeff',
      '--primary-100': '#cffafe',
      '--primary-200': '#a5f3fc',
      '--primary-300': '#67e8f9',
      '--primary-400': '#22d3ee',
      '--primary-500': '#06b6d4',
      '--primary-600': '#0891b2',
      '--primary-700': '#0e7490',
      '--primary-800': '#155e75',
      '--primary-900': '#164e63',
      '--secondary-50': '#ecfeff',
      '--secondary-100': '#cffafe',
      '--secondary-200': '#a5f3fc',
      '--secondary-300': '#67e8f9',
      '--secondary-400': '#22d3ee',
      '--secondary-500': '#06b6d4',
      '--secondary-600': '#0891b2',
      '--secondary-700': '#0e7490',
      '--secondary-800': '#155e75',
      '--secondary-900': '#164e63',
    }
  },
  forest: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#f0fdf4',
      '--primary-100': '#dcfce7',
      '--primary-200': '#bbf7d0',
      '--primary-300': '#86efac',
      '--primary-400': '#4ade80',
      '--primary-500': '#22c55e',
      '--primary-600': '#16a34a',
      '--primary-700': '#15803d',
      '--primary-800': '#166534',
      '--primary-900': '#14532d',
      '--secondary-50': '#f5f5f4',
      '--secondary-100': '#e7e5e4',
      '--secondary-200': '#d6d3d1',
      '--secondary-300': '#bab6b0',
      '--secondary-400': '#a8a29e',
      '--secondary-500': '#78716c',
      '--secondary-600': '#57534e',
      '--secondary-700': '#44403c',
      '--secondary-800': '#292524',
      '--secondary-900': '#1c1917',
    }
  },
  sunset: {
    base: 'light',
    cssVariables: {
      '--primary-50': '#fff7ed',
      '--primary-100': '#ffedd5',
      '--primary-200': '#fed7aa',
      '--primary-300': '#fdba74',
      '--primary-400': '#fb923c',
      '--primary-500': '#f97316',
      '--primary-600': '#ea580c',
      '--primary-700': '#c2410c',
      '--primary-800': '#9a3412',
      '--primary-900': '#7c2d12',
      '--secondary-50': '#fff7ed',
      '--secondary-100': '#ffedd5',
      '--secondary-200': '#fed7aa',
      '--secondary-300': '#fdba74',
      '--secondary-400': '#fb923c',
      '--secondary-500': '#f97316',
      '--secondary-600': '#ea580c',
      '--secondary-700': '#c2410c',
      '--secondary-800': '#9a3412',
      '--secondary-900': '#7c2d12',
    }
  },
  system: {
    base: 'light',
    cssVariables: {}
  }
};

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'todoapp-theme',
}: ThemeProviderProps) {
  /** ✅ SAFE DEFAULT (used during SSR) */
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true); // Start with sidebar open by default
  const [mounted, setMounted] = React.useState(false);

  // Handle responsive behavior: close sidebar on mobile by default
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Check initial width
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /** ✅ Read localStorage ONLY on client */
  React.useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
    setMounted(true);
  }, [storageKey]);

  /** ✅ Apply theme to DOM */
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    root.classList.remove(
      'light',
      'dark',
      'system',
      'blue',
      'green',
      'purple',
      'corporate',
      'retro',
      'ocean',
      'forest',
      'sunset'
    );

    root.classList.add(theme);

    const config = themeConfig[theme];
    if (config && config.cssVariables) {
      Object.entries(config.cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // Set theme-aware text colors
    const currentConfig = themeConfig[theme];
    if (currentConfig && currentConfig.base === 'dark') {
      root.style.setProperty('--background', '#111827');
      root.style.setProperty('--foreground', '#f9fafb');
      root.style.setProperty('--card', '#1f2937');
      root.style.setProperty('--card-foreground', '#f9fafb');
      root.style.setProperty('--popover', '#1f2937');
      root.style.setProperty('--popover-foreground', '#f9fafb');
      root.style.setProperty('--primary', '#3b82f6');
      root.style.setProperty('--primary-foreground', '#f9fafb');
      root.style.setProperty('--secondary', '#374151');
      root.style.setProperty('--secondary-foreground', '#f9fafb');
      root.style.setProperty('--muted', '#374151');
      root.style.setProperty('--muted-foreground', '#9ca3af');
      root.style.setProperty('--accent', '#1f2937');
      root.style.setProperty('--accent-foreground', '#f9fafb');
      root.style.setProperty('--destructive', '#ef4444');
      root.style.setProperty('--destructive-foreground', '#f9fafb');
      root.style.setProperty('--border', '#374151');
      root.style.setProperty('--input', '#374151');
      root.style.setProperty('--ring', '#3b82f6');
      root.style.setProperty('--radius', '0.5rem');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#1f2937');
      root.style.setProperty('--card', '#ffffff');
      root.style.setProperty('--card-foreground', '#1f2937');
      root.style.setProperty('--popover', '#ffffff');
      root.style.setProperty('--popover-foreground', '#1f2937');
      root.style.setProperty('--primary', '#3b82f6');
      root.style.setProperty('--primary-foreground', '#f9fafb');
      root.style.setProperty('--secondary', '#f3f4f6');
      root.style.setProperty('--secondary-foreground', '#1f2937');
      root.style.setProperty('--muted', '#f3f4f6');
      root.style.setProperty('--muted-foreground', '#6b7280');
      root.style.setProperty('--accent', '#f3f4f6');
      root.style.setProperty('--accent-foreground', '#1f2937');
      root.style.setProperty('--destructive', '#dc2626');
      root.style.setProperty('--destructive-foreground', '#f9fafb');
      root.style.setProperty('--border', '#e5e7eb');
      root.style.setProperty('--input', '#e5e7eb');
      root.style.setProperty('--ring', '#3b82f6');
      root.style.setProperty('--radius', '0.5rem');
    }

    localStorage.setItem(storageKey, theme);
  }, [theme, mounted, storageKey]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  /** 🚫 Prevent hydration mismatch */
  if (!mounted) {
    return null;
  }

  const value: ThemeProviderState = {
    theme,
    baseTheme: themeConfig[theme]?.base || 'light',
    setTheme,
    getThemeClass: () => theme,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
