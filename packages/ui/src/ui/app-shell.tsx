import * as React from 'react';

import { cn } from '../lib/utils';

function AppShell({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('bg-background text-foreground flex h-dvh flex-col overflow-hidden', className)}
      {...props}
    />
  );
}

function AppHeader({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      className={cn(
        'bg-background/95 z-20 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur md:px-6',
        className,
      )}
      {...props}
    />
  );
}

interface AppSidebarProps extends React.ComponentProps<'aside'> {
  mobile?: boolean;
}

function AppSidebar({ className, mobile = false, ...props }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        mobile
          ? 'flex h-full w-full flex-col'
          : 'bg-sidebar hidden h-full w-60 shrink-0 border-r md:flex md:flex-col',
        className,
      )}
      {...props}
    />
  );
}

function AppMain({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      className={cn('min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-7 lg:p-9', className)}
      {...props}
    />
  );
}

export { AppHeader, AppMain, AppShell, AppSidebar };
