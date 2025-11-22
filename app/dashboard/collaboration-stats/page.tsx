'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Users, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface CodeStat {
  codeId: string
  code: string
  customerCount: number
  totalRevenue: number
}

interface StatsData {
  stats: CodeStat[]
  withoutCode: {
    customerCount: number
    totalRevenue: number
  }
}

export default function CollaborationStatsPage() {
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session && !session.user.canViewCollaborationStats) {
      router.push('/dashboard')
      return
    }
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status, session, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/collaboration-stats')
      if (response.ok) {
        const data = await response.json()
        setStatsData(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    )
  }

  if (!session?.user.canViewCollaborationStats || !statsData) {
    return null
  }

  // Toplam istatistikler
  const totalCustomers = statsData.stats.reduce((sum, stat) => sum + stat.customerCount, 0) + statsData.withoutCode.customerCount
  const totalRevenue = statsData.stats.reduce((sum, stat) => sum + stat.totalRevenue, 0) + statsData.withoutCode.totalRevenue

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İşbirliği Kodları İstatistikleri</h1>
        <p className="text-gray-600 mt-2">Her kodla kaç müşteri kaydoldu ve toplam ödeme miktarı</p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalCustomers}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ciro</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Kod Sayısı</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {statsData.stats.length}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Kod Bazlı İstatistikler */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Kod Bazlı İstatistikler
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kod
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri Sayısı
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Gelir
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ortalama Gelir
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statsData.stats.length === 0 && statsData.withoutCode.customerCount === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Henüz istatistik yok
                  </td>
                </tr>
              ) : (
                <>
                  {statsData.stats.map((stat) => (
                    <tr key={stat.codeId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {stat.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{stat.customerCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(stat.totalRevenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-600">
                          {stat.customerCount > 0
                            ? formatCurrency(stat.totalRevenue / stat.customerCount)
                            : '₺0,00'}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {statsData.withoutCode.customerCount > 0 && (
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 italic">
                          Kod yok
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {statsData.withoutCode.customerCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(statsData.withoutCode.totalRevenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-600">
                          {statsData.withoutCode.customerCount > 0
                            ? formatCurrency(
                                statsData.withoutCode.totalRevenue / statsData.withoutCode.customerCount
                              )
                            : '₺0,00'}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
