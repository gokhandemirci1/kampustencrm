import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      canManageCustomers: boolean
      canManageFinancial: boolean
      canManageCollaborationCodes: boolean
      canViewCollaborationStats: boolean
      canManageAccess: boolean
      canDeleteUsers: boolean
    }
  }

  interface User {
    id: string
    email: string
    canManageCustomers: boolean
    canManageFinancial: boolean
    canManageCollaborationCodes: boolean
    canViewCollaborationStats: boolean
    canManageAccess: boolean
    canDeleteUsers: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    canManageCustomers: boolean
    canManageFinancial: boolean
    canManageCollaborationCodes: boolean
    canViewCollaborationStats: boolean
    canManageAccess: boolean
    canDeleteUsers: boolean
  }
}
