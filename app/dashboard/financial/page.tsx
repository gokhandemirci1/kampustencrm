import { requirePermission } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths, subYears } from 'date-fns'
import { tr } from 'date-fns/locale'
import FinancialDashboard from '@/components/FinancialDashboard'

export default async function FinancialPage() {
  await requirePermission('canManageFinancial')

  // Tüm müşterileri çek (silinenler dahil)
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Fiyatları hesapla
  const parsePrices = (pricesStr: string): number[] => {
    try {
      const parsed = JSON.parse(pricesStr)
      return Array.isArray(parsed) ? parsed : [parseFloat(parsed) || 0]
    } catch {
      const prices = pricesStr.split(',').map((p) => parseFloat(p.trim()))
      return prices.filter((p) => !isNaN(p))
    }
  }

  // Tarih aralığına göre filtrele
  const filterByDateRange = (customerList: typeof customers, startDate: Date, endDate: Date) => {
    return customerList.filter((customer) => {
      const customerDate = new Date(customer.createdAt)
      return customerDate >= startDate && customerDate <= endDate && !customer.isDeleted
    })
  }

  const now = new Date()

  // Günlük veriler
  const dailyStart = startOfDay(now)
  const dailyEnd = endOfDay(now)
  const dailyCustomers = filterByDateRange(customers, dailyStart, dailyEnd)
  const dailyRevenue = dailyCustomers.reduce((sum: number, customer) => {
    const prices = parsePrices(customer.prices)
    return sum + prices.reduce((s: number, p: number) => s + p, 0)
  }, 0)

  // Haftalık veriler
  const weeklyStart = startOfWeek(now, { locale: tr })
  const weeklyEnd = endOfWeek(now, { locale: tr })
  const weeklyCustomers = filterByDateRange(customers, weeklyStart, weeklyEnd)
  const weeklyRevenue = weeklyCustomers.reduce((sum: number, customer) => {
    const prices = parsePrices(customer.prices)
    return sum + prices.reduce((s: number, p: number) => s + p, 0)
  }, 0)

  // Aylık veriler
  const monthlyStart = startOfMonth(now)
  const monthlyEnd = endOfMonth(now)
  const monthlyCustomers = filterByDateRange(customers, monthlyStart, monthlyEnd)
  const monthlyRevenue = monthlyCustomers.reduce((sum: number, customer) => {
    const prices = parsePrices(customer.prices)
    return sum + prices.reduce((s: number, p: number) => s + p, 0)
  }, 0)

  // Yıllık veriler
  const yearlyStart = startOfYear(now)
  const yearlyEnd = endOfYear(now)
  const yearlyCustomers = filterByDateRange(customers, yearlyStart, yearlyEnd)
  const yearlyRevenue = yearlyCustomers.reduce((sum: number, customer) => {
    const prices = parsePrices(customer.prices)
    return sum + prices.reduce((s: number, p: number) => s + p, 0)
  }, 0)

  // Toplam ciro (silinenler hariç)
  const activeCustomers = customers.filter((c) => !c.isDeleted)
  const totalRevenue = activeCustomers.reduce((sum: number, customer) => {
    const prices = parsePrices(customer.prices)
    return sum + prices.reduce((s: number, p: number) => s + p, 0)
  }, 0)

  // Müşteri bazlı gelirler
  const customerRevenue = activeCustomers.map((customer) => {
    const prices = parsePrices(customer.prices)
    const revenue = prices.reduce((sum: number, price: number) => sum + price, 0)
    return {
      id: customer.id,
      name: `${customer.name} ${customer.surname}`,
      email: customer.email,
      revenue,
      createdAt: customer.createdAt,
    }
  }).sort((a: { revenue: number }, b: { revenue: number }) => b.revenue - a.revenue)

  const stats = {
    daily: {
      revenue: dailyRevenue,
      customerCount: dailyCustomers.length,
    },
    weekly: {
      revenue: weeklyRevenue,
      customerCount: weeklyCustomers.length,
    },
    monthly: {
      revenue: monthlyRevenue,
      customerCount: monthlyCustomers.length,
    },
    yearly: {
      revenue: yearlyRevenue,
      customerCount: yearlyCustomers.length,
    },
    total: {
      revenue: totalRevenue,
      customerCount: activeCustomers.length,
    },
  }

  return (
    <FinancialDashboard stats={stats} customerRevenue={customerRevenue} />
  )
}
