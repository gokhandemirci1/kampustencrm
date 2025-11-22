import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const codeSchema = z.object({
  code: z.string().min(1),
  isActive: z.boolean().optional().default(true),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageCollaborationCodes) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const codes = await prisma.collaborationCode.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(codes)
  } catch (error) {
    console.error('Error fetching collaboration codes:', error)
    return NextResponse.json(
      { error: 'Kodlar getirilemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageCollaborationCodes) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await request.json()
    const data = codeSchema.parse(body)

    // Kod zaten var mı kontrol et
    const existingCode = await prisma.collaborationCode.findUnique({
      where: { code: data.code },
    })

    if (existingCode) {
      return NextResponse.json(
        { error: 'Bu kod zaten mevcut' },
        { status: 400 }
      )
    }

    const code = await prisma.collaborationCode.create({
      data,
    })

    return NextResponse.json(code, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating collaboration code:', error)
    return NextResponse.json(
      { error: 'Kod oluşturulamadı' },
      { status: 500 }
    )
  }
}
