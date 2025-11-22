const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Kullanıcıları oluştur
  const users = [
    {
      email: 'gokhan@kampus.com',
      password: 'QWQD$(u~p3',
      canManageCustomers: true,
      canManageFinancial: true,
      canManageCollaborationCodes: true,
      canViewCollaborationStats: true,
      canManageAccess: true,
      canDeleteUsers: true,
    },
    {
      email: 'emre@kampus.com',
      password: 'Fco6hgVch2',
      canManageCustomers: true,
      canManageFinancial: true,
      canManageCollaborationCodes: true,
      canViewCollaborationStats: true,
      canManageAccess: true,
      canDeleteUsers: true,
    },
    {
      email: 'irem-kanbay@kampus.com',
      password: 'E6sD47(X[%',
      canManageCustomers: true,
      canManageFinancial: false,
      canManageCollaborationCodes: false,
      canViewCollaborationStats: false,
      canManageAccess: false,
      canDeleteUsers: false,
    },
    {
      email: 'emre-unal@kampus.com',
      password: 'TGFFqCaY]K',
      canManageCustomers: false,
      canManageFinancial: true,
      canManageCollaborationCodes: true,
      canViewCollaborationStats: false,
      canManageAccess: false,
      canDeleteUsers: false,
    },
    {
      email: 'gokce-demirci@kampus.com',
      password: 'gK5iU|KZBw',
      canManageCustomers: false,
      canManageFinancial: false,
      canManageCollaborationCodes: false,
      canViewCollaborationStats: false,
      canManageAccess: true,
      canDeleteUsers: false,
    },
    {
      email: 'burcu-akbas@kampus.com',
      password: '2!1q@<y$nf',
      canManageCustomers: false,
      canManageFinancial: false,
      canManageCollaborationCodes: false,
      canViewCollaborationStats: false,
      canManageAccess: false,
      canDeleteUsers: false,
    },
    {
      email: 'bilal-acar@kampus.com',
      password: '&!wtByzkHG',
      canManageCustomers: false,
      canManageFinancial: false,
      canManageCollaborationCodes: false,
      canViewCollaborationStats: true,
      canManageAccess: false,
      canDeleteUsers: false,
    },
  ]

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: hashedPassword,
      },
    })
  }

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
