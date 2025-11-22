import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user.canViewCollaborationStats) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    // Tüm aktif kodları çek
    const codes = await prisma.collaborationCode.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    // Her kod için istatistikleri hesapla
    const stats = await Promise.all(
      codes.map(async (code) => {
        const customers = await prisma.customer.findMany({
          where: {
            code: code.code,
            isDeleted: false,
          },
        })

        // Toplam fiyatı hesapla
        const parsePrices = (pricesStr: string): number[] => {
          try {
            const parsed = JSON.parse(pricesStr)
            return Array.isArray(parsed) ? parsed : [parseFloat(parsed) || 0]
          } catch {
            const prices = pricesStr.split(',').map((p) => parseFloat(p.trim()))
            return prices.filter((p) => !isNaN(p))
          }
        }

        const totalRevenue = customers.reduce((sum, customer) => {
          const prices = parsePrices(customer.prices)
          return sum + prices.reduce((s, p) => s + p, 0)
        }, 0)

        return {
          codeId: code.id,
          code: code.code,
          customerCount: customers.length,
          totalRevenue,
        }
      })
    )

    // Kodu olmayan müşteriler için de istatistik
    const customersWithoutCode = await prisma.customer.findMany({
      where: {
        OR: [
          { code: null },
          { code: '' },
        ],
        isDeleted: false,
      },
    })

    const parsePrices = (pricesStr: string): number[] => {
      try {
        const parsed = JSON.parse(pricesStr)
        return Array.isArray(parsed) ? parsed : [parseFloat(parsed) || 0]
      } catch {
        const prices = pricesStr.split(',').map((p) => parseFloat(p.trim()))
        return prices.filter((p) => !isNaN(p))
      }
    }

    const revenueWithoutCode = customersWithoutCode.reduce((sum, customer) => {
      const prices = parsePrices(customer.prices)
      return sum + prices.reduce((s, p) => s + p, 0)
    }, 0)

    return NextResponse.json({
      stats,
      withoutCode: {
        customerCount: customersWithoutCode.length,
        totalRevenue: revenueWithoutCode,
      },
    })
  } catch (error) {
    console.error('Error fetching collaboration stats:', error)
    return NextResponse.json(
      { error: 'İstatistikler getirilemedi' },
      { status: 500 }
    )
  }
}
