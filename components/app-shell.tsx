'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, FileText, LayoutDashboard, Menu, Plus, Settings, UserRound, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze', label: 'Analyze', icon: Plus },
  { href: '/analyses', label: 'My analyses', icon: FileText },
  { href: '/profile', label: 'Profile', icon: UserRound },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`))

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
        <Brand />
        <nav aria-label="Main navigation" className="mt-12 grid gap-1">
          {navItems.map(({ href, label, icon: Icon }) => <NavItem key={href} href={href} label={label} Icon={Icon} active={isActive(href)} />)}
        </nav>
        <div className="mt-auto rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-900">Need a fresh perspective?</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Analyze another opportunity and keep your momentum going.</p>
          <Link href="/analyze" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">Start analysis <ArrowRight className="size-3.5" /></Link>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
          <span className="grid size-9 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">SA</span>
          <div><p className="text-sm font-semibold">Samuel A.</p><p className="text-xs text-slate-400">Free plan</p></div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur lg:px-10">
          <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-600 lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu className="size-5" /></button><Link href="/" className="lg:hidden"><Brand compact /></Link></div>
          <div className="ml-auto flex items-center gap-3"><Link href="/analyze" className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"><Plus className="mr-1 inline size-4" />New analysis</Link></div>
        </header>
        {mobileOpen && <div className="fixed inset-0 z-30 lg:hidden"><button aria-label="Close navigation" className="absolute inset-0 bg-slate-950/30" onClick={() => setMobileOpen(false)} /><aside className="relative flex h-full w-72 flex-col bg-white p-5 shadow-xl"><div className="flex items-center justify-between"><Brand /><button aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X className="size-5" /></button></div><nav className="mt-10 grid gap-1">{navItems.map(({ href, label, icon: Icon }) => <div key={href} onClick={() => setMobileOpen(false)}><NavItem href={href} label={label} Icon={Icon} active={isActive(href)} /></div>)}</nav></aside></div>}
        {children}
      </div>
    </div>
  )
}

function Brand({ compact = false }: { compact?: boolean }) { return <span className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-lg bg-slate-950 text-white"><ArrowRight className="size-4" /></span>{!compact && <span className="text-[17px]">NextStep</span>}</span> }
function NavItem({ href, label, Icon, active }: { href: string; label: string; Icon: typeof LayoutDashboard; active: boolean }) { return <Link href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Icon className="size-4" />{label}</Link> }

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) { return <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">{eyebrow ?? 'Your workspace'}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}</div> }

export function StatusBadge({ children, tone = 'green' }: { children: React.ReactNode; tone?: 'green' | 'amber' | 'blue' }) { const styles = { green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', blue: 'bg-blue-50 text-blue-700' }; return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>{children}</span> }
