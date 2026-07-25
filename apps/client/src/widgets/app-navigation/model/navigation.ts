import { BriefcaseBusiness, CircleUserRound, FileText, LayoutDashboard } from 'lucide-react';

export const CLIENT_LOGO_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-w9JVQ2aQjP6LOfTukzjQbigUxdICnx.png';

export const clientNavigationItems = [
  { href: '/', label: '홈', icon: LayoutDashboard },
  { href: '/jobs', label: '채용 공고', icon: BriefcaseBusiness },
  { href: '/applications', label: '지원 현황', icon: FileText },
  { href: '/profile', label: '내 정보', icon: CircleUserRound },
] as const;
