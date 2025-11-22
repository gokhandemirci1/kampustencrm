import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const customerSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  grade: z.string().min(1),
  camps: z.string().min(1),
  prices: z.string().min(1),
  code: z.string().optional().nullable(),
  previousRank: z.string().optional().nullable(),
  city: z.string().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageCustomers) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const includeDeleted = searchParams.get('includeDeleted') === 'true'

    const customers = await prisma.customer.findMany({
      where: includeDeleted ? {} : { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Müşteriler getirilemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageCustomers) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await request.json()
    const data = customerSchema.parse(body)

    // Kod kontrolü
    if (data.code) {
      const codeExists = await prisma.collaborationCode.findFirst({
        where: {
          code: data.code,
          isActive: true,
        },
      })

      if (!codeExists) {
        return NextResponse.json(
          { error: 'Geçersiz işbirliği kodu' },
          { status: 400 }
        )
      }
    }

    // Fiyatları JSON string'e çevir
    let pricesString = data.prices
    try {
      // Eğer zaten JSON değilse, array'e çevir
      JSON.parse(data.prices)
    } catch {
      // Comma-separated string ise array'e çevir
      const pricesArray = data.prices.split(',').map((p: string) => parseFloat(p.trim()))
      pricesString = JSON.stringify(pricesArray)
    }

    const customer = await prisma.customer.create({
      data: {
        ...data,
        prices: pricesString,
        code: data.code || null,
        previousRank: data.previousRank || null,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Müşteri oluşturulamadı' },
      { status: 500 }
    )
  }
}
