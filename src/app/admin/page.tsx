import { redirect } from 'next/navigation'
import { getCurrentUserRole } from '@/lib/auth'

export default async function AdminPage() {
  const role = await getCurrentUserRole()
  if (!role) redirect('/login')
  if (role !== 'admin') redirect('/')
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <h1 className="text-3xl font-headline font-bold mb-4">Admin Panel</h1>
      <p className="text-muted-foreground">Welcome, Admin. Core admin features will appear here.</p>
    </div>
  )
}

