import * as React from 'react';

import { cn } from '../lib/utils';

function AppShell({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('min-h-screen bg-background text-foreground', className)} {...props} />;
}

function AppHeader({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6',
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
        mobile ? 'flex h-full w-full flex-col' : 'hidden w-60 shrink-0 border-r bg-sidebar md:flex md:flex-col',
        className,
      )}
      {...props}
    />
  );
}

function AppMain({ className, ...props }: React.ComponentProps<'main'>) {
  return <main className={cn('min-w-0 flex-1 p-4 md:p-7 lg:p-9', className)} {...props} />;
}

export { AppHeader, AppMain, AppShell, AppSidebar };
