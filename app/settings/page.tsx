import Link from 'next/link'
import { ArrowRight, Bell, ChevronLeft, LockKeyhole, ShieldCheck, UserRound, Trash2 } from 'lucide-react'

const settingsSections = [
  { icon: UserRound, title: 'Account', description: 'Manage your name, email, and account details.' },
  { icon: Bell, title: 'Notifications', description: 'Choose when NextStep should remind you.' },
  { icon: LockKeyhole, title: 'Privacy', description: 'Control how your profile and analyses are used.' },
]

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-5 lg:px-8">
          <Link href="/dashboard" aria-label="Back to dashboard" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <ChevronLeft className="size-5" />
          </Link>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-blue-600">Workspace</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Settings</h1>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Settings sections" className="flex gap-2 overflow-x-auto lg:flex-col">
            {settingsSections.map(({ icon: Icon, title }, index) => (
              <a key={title} href={`#${title.toLowerCase()}`} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${index === 0 ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}>
                <Icon className="size-4" />{title}
              </a>
            ))}
          </nav>
          <div className="grid gap-5">
            <section id="account" className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold">Account</h2><p className="mt-1 text-sm text-slate-500">Your basic account information.</p></div>
              <div className="grid gap-4 p-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Full name<input defaultValue="Samuel A." className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none ring-blue-500 transition focus:ring-2" /></label><label className="grid gap-2 text-sm font-medium">Email<input defaultValue="samuel@example.com" type="email" className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none ring-blue-500 transition focus:ring-2" /></label></div>
              <div className="flex justify-end border-t border-slate-100 px-5 py-4"><button className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Save changes</button></div>
            </section>
            <section id="notifications" className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold">Notifications</h2><p className="mt-1 text-sm text-slate-500">Stay informed without unnecessary noise.</p></div>
              <div className="divide-y divide-slate-100">{[['Deadline reminders','Get notified before an application deadline.'],['Analysis completed','Know when your analysis is ready to review.'],['New recommendations','Receive relevant opportunities based on your profile.']].map(([title, description], index) => <label key={title} className="flex items-center justify-between gap-4 px-5 py-4"><span><span className="block text-sm font-medium">{title}</span><span className="mt-1 block text-xs text-slate-500">{description}</span></span><input type="checkbox" defaultChecked={index < 2} className="size-4 accent-blue-600" /></label>)}</div>
            </section>
            <section id="privacy" className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-start gap-3 p-5"><div className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><ShieldCheck className="size-5" /></div><div><h2 className="font-semibold">Privacy</h2><p className="mt-1 text-sm leading-6 text-slate-500">Your profile is used to personalize comparisons. Always verify important requirements against the original source document.</p></div></div>
            </section>
            <section className="rounded-xl border border-red-200 bg-red-50/40"><div className="flex items-center justify-between gap-4 p-5"><div><h2 className="font-semibold text-red-900">Danger zone</h2><p className="mt-1 text-sm text-red-700/80">Permanently delete your account and all saved analyses.</p></div><button className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 className="size-4" />Delete</button></div></section>
          </div>
        </div>
      </main>
    </div>
  )
}
