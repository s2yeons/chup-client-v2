'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AppMain, AppShell, AppSidebar, BrandLogo, Button, cn, ThemeToggle } from '@chup/ui';
import { LogOut, Menu, X } from 'lucide-react';

import { useGetMe } from '@/entities/user';
import { usePostLogout } from '@/features/logout';

import { CLIENT_LOGO_URL, clientNavigationItems } from '../model/navigation';

interface AppNavigationProps {
  children: React.ReactNode;
}

const AppNavigation = ({ children }: AppNavigationProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { mutate: logout } = usePostLogout();
  const { data: me } = useGetMe(pathname !== '/signin');

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  if (pathname === '/signin') return children;

  const navigationContent = (mobile = false) => (
    <AppSidebar mobile={mobile}>
      {!mobile && (
        <Link href="/" className="flex h-16 shrink-0 items-center px-5">
          <BrandLogo imageSrc={CLIENT_LOGO_URL} name="CHUP" />
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-1 p-3 pt-0">
        <p className="text-muted-foreground px-3 pt-3 pb-2 text-xs font-semibold tracking-wider uppercase">
          학생 메뉴
        </p>
        {clientNavigationItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </div>
      <div className="p-3">
        <div className="bg-secondary rounded-2xl p-3">
          <p className="text-sm font-semibold">{me?.name ?? '···'}</p>
          <p className="text-muted-foreground text-xs">{me ? `${me.studentId} · 학생` : ''}</p>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-muted-foreground text-sm">테마</span>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="text-muted-foreground w-full justify-start"
          onClick={() => logout()}
        >
          <LogOut />
          로그아웃
        </Button>
      </div>
    </AppSidebar>
  );

  return (
    <AppShell>
      {navigationContent()}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="bg-sidebar z-20 flex h-16 shrink-0 items-center gap-3 border-b px-4 backdrop-blur md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <Menu />
          </Button>
          <Link href="/">
            <BrandLogo imageSrc={CLIENT_LOGO_URL} name="CHUP" />
          </Link>
        </header>
        <AppMain>
          <div className="mx-auto max-w-7xl">{children}</div>
        </AppMain>
      </div>
      {isMobileMenuOpen && (
        <div
          className="bg-foreground/20 fixed inset-0 z-50"
          onMouseDown={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-sidebar flex h-full w-72 flex-col shadow-xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-5">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <BrandLogo imageSrc={CLIENT_LOGO_URL} name="CHUP" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X />
              </Button>
            </div>
            {navigationContent(true)}
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default AppNavigation;
