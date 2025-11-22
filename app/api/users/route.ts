import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  canManageCustomers: z.boolean().optional().default(false),
  canManageFinancial: z.boolean().optional().default(false),
  canManageCollaborationCodes: z.boolean().optional().default(false),
  canViewCollaborationStats: z.boolean().optional().default(false),
  canManageAccess: z.boolean().optional().default(false),
  canDeleteUsers: z.boolean().optional().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageAccess) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        canManageCustomers: true,
        canManageFinancial: true,
        canManageCollaborationCodes: true,
        canViewCollaborationStats: true,
        canManageAccess: true,
        canDeleteUsers: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageAccess) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await request.json()
    const data = userSchema.parse(body)

    // E-posta zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        canManageCustomers: true,
        canManageFinancial: true,
        canManageCollaborationCodes: true,
        canViewCollaborationStats: true,
        canManageAccess: true,
        canDeleteUsers: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulamadı' },
      { status: 500 }
    )
  }
}
