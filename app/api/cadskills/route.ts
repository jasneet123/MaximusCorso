import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const SEED_CATEGORIES = [
  {
    name: 'CAD-1: Foundation',
    level: 1,
    description: 'Core obedience skills every Cane Corso must master first.',
    order: 1,
    skills: [
      { name: 'Name Recognition', description: 'Dog responds to their name reliably in low-distraction environments.', tips: 'Say the name once, mark with "yes!" and reward. Never repeat the name — one call, one response.', order: 1 },
      { name: 'Sit', description: 'Dog sits on a single verbal or hand-signal cue.', tips: 'Lure with a treat over the nose until the rear drops. Capture it naturally and reward immediately.', order: 2 },
      { name: 'Down', description: 'Dog lies down fully on cue in a relaxed position.', tips: 'Lure from sit — draw treat slowly to the floor between the front paws. Patience wins here.', order: 3 },
      { name: 'Stay (5 seconds)', description: 'Dog holds position for at least 5 seconds before being released.', tips: 'Build the 3 D\'s slowly: Duration first, then Distance, then Distraction. Don\'t rush!', order: 4 },
      { name: 'Come (Basic Recall)', description: 'Dog runs to handler when called from a short distance.', tips: 'Make coming to you the BEST thing ever — jackpot treats, excited praise, never punishment.', order: 5 },
      { name: 'Leave It', description: 'Dog ignores a dropped item or food on the ground on cue.', tips: 'Cover the item, wait for the dog to look away, then mark and reward from your hand — not the item.', order: 6 },
      { name: 'Off (No Jumping)', description: 'Dog keeps all four paws on the floor when greeting people.', tips: 'Turn away the moment paws leave the ground. Reward four-on-the-floor immediately.', order: 7 },
      { name: 'Wait at Door', description: 'Dog pauses at thresholds until given a release word.', tips: '"Wait" means pause — not a full stay. Body block the door, release with "ok" or "free".', order: 8 },
      { name: 'Heel (On Leash)', description: 'Dog walks attentively at handler\'s left side without pulling.', tips: 'Start slow — reward position, not just movement. A Cane Corso who charges ahead controls the walk.', order: 9 },
      { name: 'Place/Bed', description: 'Dog goes to and remains on a designated mat or bed on cue.', tips: 'Shape the behavior: first reward for approaching, then stepping on, then lying down on the mat.', order: 10 },
    ],
  },
  {
    name: 'CAD-2: Developing',
    level: 2,
    description: 'Building reliability, distance, and distraction tolerance.',
    order: 2,
    skills: [
      { name: 'Stand', description: 'Dog stands on cue from sit or down, holding position.', tips: 'Lure the nose forward from a sit to get the stand, then freeze the treat to hold the position.', order: 1 },
      { name: 'Extended Stay (30 seconds)', description: 'Dog holds stay for 30 seconds at handler\'s side or with distance.', tips: 'Add time in small increments. If the dog breaks, you moved too fast — back up a step.', order: 2 },
      { name: 'Distance Recall', description: 'Dog recalls reliably from 20+ feet away.', tips: 'Use a long line for safety. Never call your dog for something unpleasant — recalls must always predict good things.', order: 3 },
      { name: 'Heel (Off Leash)', description: 'Dog maintains heel position without a leash in a low-distraction setting.', tips: 'Off-leash heel is earned, not assumed. Your relationship must be strong before removing the leash.', order: 4 },
      { name: 'Drop It', description: 'Dog releases any item from their mouth on cue.', tips: 'Trade up! Offer something better than what they have. Never chase — that becomes a game.', order: 5 },
      { name: 'Back Up', description: 'Dog walks backwards several steps on cue.', tips: 'Walk into the dog slowly — they\'ll naturally back up. Mark and reward each step back.', order: 6 },
      { name: 'Down Under Distraction', description: 'Dog holds a down-stay with people or dogs moving nearby.', tips: 'Set your dog up to succeed — start with low-level distractions and build slowly over weeks.', order: 7 },
      { name: 'Leave It (High Value)', description: 'Dog ignores high-value items like meat or toys on cue.', tips: 'Once your dog truly understands "leave it," generalizing to high-value items is easier than you think.', order: 8 },
      { name: 'Greeting Strangers Politely', description: 'Dog remains calm and four-on-the-floor when approached by unfamiliar people.', tips: 'For a Cane Corso, controlled greetings are non-negotiable. Practice daily with different people.', order: 9 },
      { name: 'Go To Bed', description: 'Dog goes to bed from a distance of 10+ feet and stays until released.', tips: 'This is the "place" skill at distance. Use a visual target — point clearly to the bed.', order: 10 },
    ],
  },
  {
    name: 'CAD-3: Advanced',
    level: 3,
    description: 'Championship-level reliability and the Canine Good Citizen assessment.',
    order: 3,
    skills: [
      { name: 'Extended Stay (2 minutes)', description: 'Dog holds stay for 2 full minutes out of handler sight.', tips: 'Out-of-sight stays are an enormous test of trust. Build this over months, not days.', order: 1 },
      { name: 'Recall Under Distraction', description: 'Dog recalls reliably with dogs, food, or people nearby.', tips: 'A Corso\'s recall must be bulletproof. Practice in parks, pet stores, and anywhere life gets real.', order: 2 },
      { name: 'Formal Heel Pattern', description: 'Dog performs a heeling pattern including turns, about-turns, and halts.', tips: 'Focus on your footwork first — your dog reads your body before your voice.', order: 3 },
      { name: 'Stand-Stay', description: 'Dog stands and stays while handler moves around them and a stranger examines them.', tips: 'This mirrors a vet exam. Practice regular handling — touching ears, paws, and sides — early and often.', order: 4 },
      { name: 'Multiple Position Changes', description: 'Dog moves between sit, down, and stand on cue without handler repositioning.', tips: 'Chain the cues cleanly. Use a pause between each command so the dog processes each one.', order: 5 },
      { name: 'Focus/Eye Contact', description: 'Dog maintains sustained eye contact in a distracting environment for 10 seconds.', tips: '"Watch me" is the foundation of all advanced work. A dog that focuses on you ignores everything else.', order: 6 },
      { name: 'Loose Leash in Crowd', description: 'Dog walks on a loose leash through a group of people without pulling or reacting.', tips: 'This is the real-world test. Reward generously for every calm step in a busy environment.', order: 7 },
      { name: 'Calm with Strange Dog', description: 'Dog remains calm and controlled when another dog passes within 10 feet.', tips: 'Counter-conditioning is key. Teach your Corso that other dogs = treats appear, not drama.', order: 8 },
      { name: 'Reaction to Sudden Noise', description: 'Dog recovers quickly from a startling noise and refocuses on handler.', tips: 'Mark and reward the moment the dog looks back to you after a startle. Recovery speed matters more than the initial reaction.', order: 9 },
      { name: 'Canine Good Citizen Assessment', description: 'Dog passes all CGC test items demonstrating good manners in public.', tips: 'The CGC is not just a test — it\'s proof your Cane Corso is an ambassador for the breed. You both should be proud.', order: 10 },
    ],
  },
]

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await seedSkillsIfNeeded()

  const categories = await prisma.cadSkillCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      skills: {
        orderBy: { order: 'asc' },
        include: {
          userProgress: {
            where: { userId: session.id },
          },
        },
      },
    },
  })

  return NextResponse.json({ categories })
}

async function seedSkillsIfNeeded() {
  const count = await prisma.cadSkillCategory.count()
  if (count > 0) return

  for (const cat of SEED_CATEGORIES) {
    const { skills, ...catData } = cat
    const created = await prisma.cadSkillCategory.create({ data: catData })
    for (const skill of skills) {
      await prisma.cadSkill.create({ data: { ...skill, categoryId: created.id } })
    }
  }
}
