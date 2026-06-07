'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Circle, PlayCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'

interface Skill {
  id: string
  name: string
  description: string
  tips: string | null
  order: number
  userProgress: { status: string }[]
}

interface CadskillsSkillCardProps {
  skill: Skill
  onStatusChange: (skillId: string, status: string) => Promise<void>
}

const statusConfig = {
  NOT_STARTED: {
    label: 'Not Started',
    icon: Circle,
    color: 'text-slate-400',
    bg: 'bg-slate-50 border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-600',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: PlayCircle,
    color: 'text-amber-500',
    bg: 'bg-amber-50 border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-700',
  },
  COMPLETED: {
    label: 'Mastered',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-700',
  },
}

export default function CadskillsSkillCard({ skill, onStatusChange }: CadskillsSkillCardProps) {
  const currentStatus = (skill.userProgress[0]?.status ?? 'NOT_STARTED') as keyof typeof statusConfig
  const config = statusConfig[currentStatus]
  const Icon = config.icon

  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const cycleStatus = () => {
    const next =
      currentStatus === 'NOT_STARTED' ? 'IN_PROGRESS' :
      currentStatus === 'IN_PROGRESS' ? 'COMPLETED' :
      'NOT_STARTED'
    startTransition(() => onStatusChange(skill.id, next))
  }

  return (
    <div className={`rounded-xl border-2 transition-all duration-200 ${config.bg} ${isPending ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3 p-4">
        {/* Status toggle button */}
        <button
          onClick={cycleStatus}
          disabled={isPending}
          className={`flex-shrink-0 mt-0.5 ${config.color} hover:scale-110 transition-transform`}
          title={`Currently: ${config.label}. Click to advance.`}
        >
          <Icon className="h-6 w-6" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm leading-tight">{skill.name}</h3>
              <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${config.badgeBg}`}>
                {config.label}
              </span>
            </div>
            {skill.tips && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
          </div>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{skill.description}</p>

          {expanded && skill.tips && (
            <div className="mt-3 flex gap-2 bg-white/70 rounded-lg p-3 border border-white">
              <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 italic leading-relaxed">
                <span className="font-semibold not-italic">Coach Maximus says: </span>
                {skill.tips}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
