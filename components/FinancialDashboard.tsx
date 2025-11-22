'use client'

import { DollarSign, Users, TrendingUp } from 'lucide-react'

interface Stats {
  daily: { revenue: number; customerCount: number }
  weekly: { revenue: number; customerCount: number }
  monthly: { revenue: number; customerCount: number }
  yearly: { revenue: number; customerCount: number }
  total: { revenue: number; customerCount: number }
}

interface CustomerRevenue {
  id: string
  name: string
  email: string
  revenue: number
  createdAt: Date | string
}

export default function FinancialDashboard({
  stats,
  customerRevenue,
}: {
  stats: Stats
  customerRevenue: CustomerRevenue[]
}) {
  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Finansal Veriler</h1>
        <p className="text-gray-600 mt-2">Günlük, haftalık, aylık ve yıllık ciro raporları</p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Günlük Ciro</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.daily.revenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.daily.customerCount} müşteri
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Haftalık Ciro</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.weekly.revenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.weekly.customerCount} müşteri
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
              <p className="text-sm font-medium text-gray-600">Aylık Ciro</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.monthly.revenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.monthly.customerCount} müşteri
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yıllık Ciro</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.yearly.revenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.yearly.customerCount} müşteri
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ciro</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.total.revenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total.customerCount} aktif müşteri
              </p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Müşteri Bazlı Gelirler */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Müşteri Bazlı Gelirler
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Silinmiş müşteriler ciraya dahil edilmez
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Gelir
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerRevenue.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Henüz müşteri yok
                  </td>
                </tr>
              ) : (
                customerRevenue.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDate(customer.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(customer.revenue)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
