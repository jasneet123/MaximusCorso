'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SUBSCRIPTION_TIERS } from '@/lib/stripe'
import { formatPrice } from '@/lib/utils'

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tierParam = searchParams.get('tier')?.toUpperCase() as keyof typeof SUBSCRIPTION_TIERS | null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedTier, setSelectedTier] = useState<keyof typeof SUBSCRIPTION_TIERS>(
    tierParam && tierParam in SUBSCRIPTION_TIERS ? tierParam : 'MASTER'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Register user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!registerResponse.ok) {
        const data = await registerResponse.json()
        throw new Error(data.error || 'Failed to register')
      }

      // Create checkout session
      const checkoutResponse = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: selectedTier }),
      })

      if (!checkoutResponse.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await checkoutResponse.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Plan</CardTitle>
        <CardDescription>
          Select a membership tier to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tier Selection */}
          <div className="space-y-3">
            {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
              <label
                key={key}
                className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedTier === key
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="tier"
                  value={key}
                  checked={selectedTier === key}
                  onChange={(e) => setSelectedTier(e.target.value as keyof typeof SUBSCRIPTION_TIERS)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{tier.name}</p>
                    <p className="text-sm text-slate-600">{tier.description}</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatPrice(tier.price)}
                    <span className="text-sm text-slate-600">/mo</span>
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-slate-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            variant="primary"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            You'll be redirected to Stripe for secure payment.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
