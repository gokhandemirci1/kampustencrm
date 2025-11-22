import { requireAuth } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import {
  Users,
  DollarSign,
  TrendingUp,
  Code,
} from 'lucide-react'

export default async function DashboardPage() {
  const session = await requireAuth()

  // İstatistikleri çek
  const [totalCustomers, activeCustomers, totalRevenue, totalCodes] =
    await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { isDeleted: false } }),
      prisma.customer.aggregate({
        _sum: {
          // prices field'ı string olduğu için burada özel işlem yapmamız gerekecek
        },
        where: { isDeleted: false },
      }),
      prisma.collaborationCode.count({ where: { isActive: true } }),
    ])

  // Toplam ciroyu hesapla (prices JSON string olarak tutuluyor)
  const customers = await prisma.customer.findMany({
    where: { isDeleted: false },
  })

  let totalRevenueValue = 0
  customers.forEach((customer) => {
    try {
      const prices = JSON.parse(customer.prices || '[]')
      if (Array.isArray(prices)) {
        totalRevenueValue += prices.reduce((sum: number, price: number) => sum + price, 0)
      }
    } catch {
      // JSON parse hatası durumunda, comma-separated olarak dene
      const prices = customer.prices?.split(',').map(Number) || []
      totalRevenueValue += prices.reduce((sum, price) => sum + (price || 0), 0)
    }
  })

  const stats = [
    {
      name: 'Toplam Müşteri',
      value: totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Aktif Müşteri',
      value: activeCustomers,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Toplam Ciro',
      value: `₺${totalRevenueValue.toLocaleString('tr-TR')}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      name: 'Aktif Kodlar',
      value: totalCodes,
      icon: Code,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Hoş geldiniz, {session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Yetkileriniz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {session.user.canManageCustomers && (
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>Müşteri Yönetimi</span>
            </div>
          )}
          {session.user.canManageFinancial && (
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>Finansal Veriler</span>
            </div>
          )}
          {session.user.canManageCollaborationCodes && (
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>İşbirliği Kodları Yönetimi</span>
            </div>
          )}
          {session.user.canViewCollaborationStats && (
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>İşbirliği İstatistikleri</span>
            </div>
          )}
          {session.user.canManageAccess && (
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>Erişim Yönetimi</span>
            </div>
          )}
          {session.user.canDeleteUsers && (
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>Kullanıcı Silme Yetkisi</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
