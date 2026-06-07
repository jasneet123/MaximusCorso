'use client'

import { useEffect, useRef } from 'react'

interface NpcMessage {
  text: string
  mood: 'encouraging' | 'celebrating' | 'challenging' | 'greeting'
}

interface CadskillsNpcProps {
  completedCount: number
  totalCount: number
  currentLevelName: string
}

function getNpcMessage(completed: number, total: number): NpcMessage {
  if (completed === 0) {
    return {
      text: "Welcome, handler! I'm Coach Maximus — your Cane Corso training guide. Every great Corso starts with one skill. Begin with Name Recognition and we'll build from there.",
      mood: 'greeting',
    }
  }
  if (completed === total) {
    return {
      text: "Incredible! You and your Corso have completed every skill. That's true dedication — your dog is an ambassador for this magnificent breed. I'm proud of you both!",
      mood: 'celebrating',
    }
  }
  const pct = completed / total
  if (pct >= 0.75) {
    return {
      text: `Remarkable progress — ${completed} of ${total} skills mastered! You're in the home stretch. Keep that consistency and your Corso will be unstoppable.`,
      mood: 'celebrating',
    }
  }
  if (pct >= 0.5) {
    return {
      text: `Halfway there and your Corso is shining! ${completed} skills down. The next ones will test your patience — embrace that challenge. Patience is the master trainer's greatest tool.`,
      mood: 'challenging',
    }
  }
  if (pct >= 0.25) {
    return {
      text: `Good momentum! ${completed} skills completed. Remember — a Cane Corso learns through consistency, not intensity. Short sessions, every single day, wins every time.`,
      mood: 'encouraging',
    }
  }
  return {
    text: `You're on your way — ${completed} skill${completed === 1 ? '' : 's'} down! A Cane Corso trained with love and structure becomes a true partner. Keep showing up.`,
    mood: 'encouraging',
  }
}

const moodColors: Record<NpcMessage['mood'], string> = {
  greeting: 'from-blue-600 to-blue-800',
  encouraging: 'from-amber-500 to-amber-700',
  celebrating: 'from-emerald-500 to-emerald-700',
  challenging: 'from-purple-600 to-purple-800',
}

const moodBorder: Record<NpcMessage['mood'], string> = {
  greeting: 'border-blue-200',
  encouraging: 'border-amber-200',
  celebrating: 'border-emerald-200',
  challenging: 'border-purple-200',
}

const moodBubble: Record<NpcMessage['mood'], string> = {
  greeting: 'bg-blue-50 border-blue-200',
  encouraging: 'bg-amber-50 border-amber-200',
  celebrating: 'bg-emerald-50 border-emerald-200',
  challenging: 'bg-purple-50 border-purple-200',
}

export default function CadskillsNpc({ completedCount, totalCount, currentLevelName }: CadskillsNpcProps) {
  const message = getNpcMessage(completedCount, totalCount)
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className={`rounded-2xl border-2 ${moodBorder[message.mood]} overflow-hidden shadow-lg`}>
      {/* NPC Header */}
      <div className={`bg-gradient-to-r ${moodColors[message.mood]} px-6 py-4 flex items-center gap-4`}>
        {/* Coach Maximus Avatar */}
        <div className="relative flex-shrink-0">
          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl border-2 border-white/40">
            🐾
          </div>
          {/* Status indicator */}
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        <div className="text-white">
          <p className="font-bold text-lg leading-tight">Coach Maximus</p>
          <p className="text-white/80 text-sm">Cadskills NPC · Cane Corso Trainer</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-white/30">
              <div
                className="h-1.5 rounded-full bg-white transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-white/90 font-medium">{pct}% complete</span>
          </div>
        </div>
      </div>

      {/* Dialogue Bubble */}
      <div className={`${moodBubble[message.mood]} border-t-2 ${moodBorder[message.mood]} px-6 py-4`}>
        <div className="relative">
          {/* Speech bubble arrow */}
          <div className={`absolute -top-6 left-8 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent ${
            message.mood === 'greeting' ? 'border-b-blue-100' :
            message.mood === 'encouraging' ? 'border-b-amber-50' :
            message.mood === 'celebrating' ? 'border-b-emerald-50' :
            'border-b-purple-50'
          }`} />
          <p className="text-slate-700 leading-relaxed italic text-sm">
            &ldquo;{message.text}&rdquo;
          </p>
        </div>

        {/* Current level badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current focus:</span>
          <span className="text-xs font-bold text-slate-700 bg-white rounded-full px-3 py-0.5 border border-slate-200 shadow-sm">
            {currentLevelName}
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between">
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900">{completedCount}</p>
          <p className="text-xs text-slate-500">Mastered</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900">{totalCount - completedCount}</p>
          <p className="text-xs text-slate-500">Remaining</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900">{totalCount}</p>
          <p className="text-xs text-slate-500">Total Skills</p>
        </div>
      </div>
    </div>
  )
}
