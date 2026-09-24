import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'NextStep — Know what to do next', description: 'Turn complicated opportunity documents into personalized requirements, eligibility insights, and actionable checklists.', generator: 'v0.app' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f8fafc' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
