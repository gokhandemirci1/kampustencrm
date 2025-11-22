import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user.canManageCustomers) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const reason = searchParams.get('reason') || 'Ödeme alınmadı'

    // Müşteriyi silme yerine isDeleted flag'ini true yap
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedReason: reason,
      },
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'Müşteri silinemedi' },
      { status: 500 }
    )
  }
}
