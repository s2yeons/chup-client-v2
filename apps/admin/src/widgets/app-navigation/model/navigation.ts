import { BriefcaseBusiness, LayoutDashboard, UsersRound } from 'lucide-react';

export const ADMIN_LOGO_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-w9JVQ2aQjP6LOfTukzjQbigUxdICnx.png';

export const adminNavigationItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/postings', label: '공고 관리', icon: BriefcaseBusiness },
  { href: '/applicants', label: '지원자 관리', icon: UsersRound },
] as const;
