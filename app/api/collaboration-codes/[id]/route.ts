import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageCollaborationCodes) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { id } = params

    await prisma.collaborationCode.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting collaboration code:', error)
    return NextResponse.json(
      { error: 'Kod silinemedi' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageCollaborationCodes) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { isActive } = body

    const code = await prisma.collaborationCode.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json(code)
  } catch (error) {
    console.error('Error updating collaboration code:', error)
    return NextResponse.json(
      { error: 'Kod güncellenemedi' },
      { status: 500 }
    )
  }
}
