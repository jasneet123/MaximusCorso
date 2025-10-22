'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [concerns, setConcerns] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, concerns }),
      })

      if (!response.ok) {
        throw new Error('Failed to join waitlist')
      }

      setSuccess(true)
      setEmail('')
      setName('')
      setConcerns('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-green-400 mb-2">You're on the list!</h3>
        <p className="text-slate-300">
          We'll email you as soon as we launch with your exclusive founder pricing.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
        />
      </div>
      <Input
        type="text"
        placeholder="What's your biggest Cane Corso challenge? (optional)"
        value={concerns}
        onChange={(e) => setConcerns(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      <Button
        type="submit"
        size="lg"
        variant="primary"
        disabled={loading}
        className="w-full text-lg"
      >
        {loading ? 'Joining...' : 'Join the Waitlist'}
      </Button>
      <p className="text-xs text-slate-400">
        By joining, you'll get exclusive founder pricing: 50% off for the first 3 months.
      </p>
    </form>
  )
}
