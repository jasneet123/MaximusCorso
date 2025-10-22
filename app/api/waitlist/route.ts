import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const waitlistSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  concerns: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, concerns } = waitlistSchema.parse(body)

    // Check if email already exists
    const existing = await prisma.waitlist.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email already on waitlist' },
        { status: 400 }
      )
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email,
        name,
        concerns,
        source: 'website',
      },
    })

    // TODO: Send welcome email via Resend

    return NextResponse.json({ success: true, data: waitlistEntry })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    )
  }
}
