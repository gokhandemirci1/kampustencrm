import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function requireAuth() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  return session
}

type PermissionKey = 
  | 'canManageCustomers'
  | 'canManageFinancial'
  | 'canManageCollaborationCodes'
  | 'canViewCollaborationStats'
  | 'canManageAccess'
  | 'canDeleteUsers'

export async function requirePermission(permission: PermissionKey) {
  const session = await requireAuth()
  const permissions = {
    canManageCustomers: session.user.canManageCustomers,
    canManageFinancial: session.user.canManageFinancial,
    canManageCollaborationCodes: session.user.canManageCollaborationCodes,
    canViewCollaborationStats: session.user.canViewCollaborationStats,
    canManageAccess: session.user.canManageAccess,
    canDeleteUsers: session.user.canDeleteUsers,
  }
  
  if (!permissions[permission]) {
    redirect('/dashboard')
  }
  
  return session
}
