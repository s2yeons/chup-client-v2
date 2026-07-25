'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AppHeader, AppMain, AppShell, AppSidebar, Avatar, AvatarFallback, BrandLogo, Button, cn } from '@chup/ui';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

import { ADMIN_LOGO_URL, adminNavigationItems } from '../model/navigation';

interface AppNavigationProps { children: React.ReactNode; }

const AppNavigation = ({ children }: AppNavigationProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const navigationContent = (mobile = false) => (
    <AppSidebar mobile={mobile}>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="px-3 pt-3 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">관리자 메뉴</p>
        {adminNavigationItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive(href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground')}>
            <Icon className="size-4" />{label}
          </Link>
        ))}
      </div>
      <div className="p-3"><div className="rounded-2xl bg-secondary p-3"><p className="text-sm font-semibold">김도윤</p><p className="text-xs text-muted-foreground">취업지원부</p></div><Button variant="ghost" className="mt-2 w-full justify-start text-muted-foreground" onClick={() => toast.info('로그아웃 기능은 준비 중입니다.')}><LogOut />로그아웃</Button></div>
    </AppSidebar>
  );
  return <AppShell><AppHeader><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="메뉴 열기"><Menu /></Button><BrandLogo imageSrc={ADMIN_LOGO_URL} name="GSM Career" /></div><div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="알림" onClick={() => toast.info('새 알림이 없습니다.')}><Bell /></Button><Avatar className="size-9"><AvatarFallback className="bg-primary text-primary-foreground">김</AvatarFallback></Avatar></div></AppHeader><div className="flex min-h-[calc(100vh-4rem)]">{navigationContent()}<AppMain><div className="mx-auto max-w-7xl">{children}</div></AppMain></div>{isMobileMenuOpen && <div className="fixed inset-0 z-50 bg-foreground/20" onMouseDown={() => setIsMobileMenuOpen(false)}><div className="h-full w-72 bg-background p-2 shadow-xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center justify-between p-3"><BrandLogo imageSrc={ADMIN_LOGO_URL} name="GSM Career" /><Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="메뉴 닫기"><X /></Button></div>{navigationContent(true)}</div></div>}</AppShell>;
};

export default AppNavigation;
