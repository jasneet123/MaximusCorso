'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CadskillsNpc from '@/components/cadskills-npc'
import CadskillsSkillCard from '@/components/cadskills-skill-card'

interface SkillProgress {
  status: string
}

interface Skill {
  id: string
  name: string
  description: string
  tips: string | null
  order: number
  userProgress: SkillProgress[]
}

interface Category {
  id: string
  name: string
  level: number
  description: string
  order: number
  skills: Skill[]
}

const levelColors: Record<number, { ring: string; header: string; badge: string }> = {
  1: { ring: 'ring-blue-200', header: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700' },
  2: { ring: 'ring-purple-200', header: 'bg-purple-600', badge: 'bg-purple-100 text-purple-700' },
  3: { ring: 'ring-amber-200', header: 'bg-amber-600', badge: 'bg-amber-100 text-amber-700' },
}

function isLevelUnlocked(level: number, categories: Category[]): boolean {
  if (level === 1) return true
  const prev = categories.find((c) => c.level === level - 1)
  if (!prev) return true
  const completed = prev.skills.filter((s) => s.userProgress[0]?.status === 'COMPLETED').length
  return completed >= Math.ceil(prev.skills.length * 0.8)
}

export default function CadskillsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/cadskills')
      if (!res.ok) {
        if (res.status === 401) {
          setError('Please log in to access Cadskills.')
        } else {
          setError('Failed to load skills. Please try again.')
        }
        return
      }
      const data = await res.json()
      setCategories(data.categories)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const handleStatusChange = useCallback(async (skillId: string, status: string) => {
    const res = await fetch('/api/cadskills/skill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId, status }),
    })
    if (!res.ok) return

    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        skills: cat.skills.map((skill) =>
          skill.id === skillId
            ? { ...skill, userProgress: [{ status }] }
            : skill
        ),
      }))
    )
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading Cadskills...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Oops</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button variant="primary">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const allSkills = categories.flatMap((c) => c.skills)
  const completedCount = allSkills.filter((s) => s.userProgress[0]?.status === 'COMPLETED').length
  const totalCount = allSkills.length

  const currentLevel = categories.find((c) => {
    const catCompleted = c.skills.filter((s) => s.userProgress[0]?.status === 'COMPLETED').length
    return catCompleted < c.skills.length
  })
  const currentLevelName = currentLevel?.name ?? (completedCount === totalCount ? 'All Skills Mastered!' : 'Cadskills')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back nav */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Cadskills NPC</h1>
          <p className="text-slate-500 mt-1">Canine Achievement Degree — track your Cane Corso's training journey with Coach Maximus.</p>
        </div>

        {/* NPC Widget */}
        <div className="mb-8">
          <CadskillsNpc
            completedCount={completedCount}
            totalCount={totalCount}
            currentLevelName={currentLevelName}
          />
        </div>

        {/* Skill Levels */}
        <div className="space-y-8">
          {categories.map((category) => {
            const colors = levelColors[category.level] ?? levelColors[1]
            const unlocked = isLevelUnlocked(category.level, categories)
            const catCompleted = category.skills.filter((s) => s.userProgress[0]?.status === 'COMPLETED').length
            const catTotal = category.skills.length
            const catPct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0

            return (
              <div key={category.id} className={`rounded-2xl ring-2 ${colors.ring} bg-white overflow-hidden shadow-sm`}>
                {/* Category header */}
                <div className={`${colors.header} px-6 py-4 text-white`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold">{category.name}</h2>
                        {!unlocked && <Lock className="h-4 w-4 text-white/70" />}
                        {catCompleted === catTotal && catTotal > 0 && (
                          <Trophy className="h-5 w-5 text-yellow-300" />
                        )}
                      </div>
                      <p className="text-white/80 text-sm mt-1">{category.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold">{catCompleted}/{catTotal}</p>
                      <p className="text-white/70 text-xs">Skills mastered</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                </div>

                {/* Locked overlay */}
                {!unlocked ? (
                  <div className="px-6 py-8 text-center bg-slate-50">
                    <Lock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium">Level Locked</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Complete 80% of {categories.find((c) => c.level === category.level - 1)?.name} to unlock.
                    </p>
                  </div>
                ) : (
                  <div className="p-6 grid sm:grid-cols-2 gap-3">
                    {category.skills.map((skill) => (
                      <CadskillsSkillCard
                        key={skill.id}
                        skill={skill}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Completion banner */}
        {completedCount === totalCount && totalCount > 0 && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 p-6 text-center shadow-lg">
            <Trophy className="h-12 w-12 text-white mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">All Skills Mastered!</h3>
            <p className="text-white/90">
              Your Cane Corso has achieved the Canine Achievement Degree. You and your dog are truly exceptional.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
