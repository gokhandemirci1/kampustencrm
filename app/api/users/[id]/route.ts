import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  canManageCustomers: z.boolean().optional(),
  canManageFinancial: z.boolean().optional(),
  canManageCollaborationCodes: z.boolean().optional(),
  canViewCollaborationStats: z.boolean().optional(),
  canManageAccess: z.boolean().optional(),
  canDeleteUsers: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageAccess) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const data = updateUserSchema.parse(body)

    // E-posta değişiyorsa, başka bir kullanıcıda var mı kontrol et
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    // Şifre değişiyorsa hashle
    const updateData: any = { ...data }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Kullanıcı güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageAccess || !session.user.canDeleteUsers) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { id } = params

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // gokhan@kampus.com ve emre@kampus.com silinemez
    if (user.email === 'gokhan@kampus.com' || user.email === 'emre@kampus.com') {
      return NextResponse.json(
        { error: 'Bu kullanıcı silinemez' },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Kullanıcı silinemedi' },
      { status: 500 }
    )
  }
}
