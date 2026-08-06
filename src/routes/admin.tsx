import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { getCurrentUser } from '@/lib/supabase/auth'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
  beforeLoad: async () => {
    const { user, adminUser, error } = await getCurrentUser()
    
    if (error || !user || !adminUser) {
      throw redirect({ to: '/login' })
    }
    
    if (!adminUser.is_active) {
      throw redirect({ to: '/account-suspended' })
    }
    
    return { user, adminUser }
  },
})

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
