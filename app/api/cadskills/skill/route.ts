import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { skillId, status, notes } = await request.json()

  if (!skillId || !status) {
    return NextResponse.json({ error: 'skillId and status are required' }, { status: 400 })
  }

  const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const skill = await prisma.cadSkill.findUnique({ where: { id: skillId } })
  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }

  const now = new Date()
  const progress = await prisma.userCadSkillProgress.upsert({
    where: { userId_skillId: { userId: session.id, skillId } },
    create: {
      userId: session.id,
      skillId,
      status,
      notes: notes ?? null,
      startedAt: status !== 'NOT_STARTED' ? now : null,
      completedAt: status === 'COMPLETED' ? now : null,
    },
    update: {
      status,
      notes: notes ?? undefined,
      startedAt: status !== 'NOT_STARTED' ? now : undefined,
      completedAt: status === 'COMPLETED' ? now : null,
    },
  })

  return NextResponse.json({ progress })
}
