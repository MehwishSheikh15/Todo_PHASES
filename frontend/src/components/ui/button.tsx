'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary-600 dark:hover:bg-primary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:hover:bg-destructive/80',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-accent/10',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/50 dark:hover:bg-secondary/40',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/10',
        link: 'underline-offset-4 hover:underline text-primary dark:text-primary-400',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };