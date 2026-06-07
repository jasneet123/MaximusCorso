import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { SUBSCRIPTION_TIERS } from '@/lib/stripe'
import { formatPrice } from '@/lib/utils'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Cane Corso Academy
          </Link>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-slate-900">
            Choose Your Membership
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            All plans include access to our expert community and proven training methods.
            Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Foundation Tier */}
          <Card className="border-2 border-slate-200">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-2">{SUBSCRIPTION_TIERS.FOUNDATION.name}</CardTitle>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {formatPrice(SUBSCRIPTION_TIERS.FOUNDATION.price)}
                <span className="text-xl text-slate-600">/mo</span>
              </div>
              <CardDescription className="text-base">
                {SUBSCRIPTION_TIERS.FOUNDATION.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {SUBSCRIPTION_TIERS.FOUNDATION.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/register?tier=foundation" className="block">
                  <Button className="w-full" variant="outline" size="lg">
                    Start Foundation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Master Tier */}
          <Card className="border-2 border-blue-600 relative shadow-xl scale-105">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </span>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-2">{SUBSCRIPTION_TIERS.MASTER.name}</CardTitle>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {formatPrice(SUBSCRIPTION_TIERS.MASTER.price)}
                <span className="text-xl text-slate-600">/mo</span>
              </div>
              <CardDescription className="text-base">
                {SUBSCRIPTION_TIERS.MASTER.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm font-semibold text-blue-600">Everything in Foundation, plus:</p>
              <ul className="space-y-3">
                {SUBSCRIPTION_TIERS.MASTER.features.slice(1).map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/register?tier=master" className="block">
                  <Button className="w-full" variant="primary" size="lg">
                    Start Master
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Elite Tier */}
          <Card className="border-2 border-slate-900">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-2">{SUBSCRIPTION_TIERS.ELITE.name}</CardTitle>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {formatPrice(SUBSCRIPTION_TIERS.ELITE.price)}
                <span className="text-xl text-slate-600">/mo</span>
              </div>
              <CardDescription className="text-base">
                {SUBSCRIPTION_TIERS.ELITE.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm font-semibold text-slate-900">Everything in Master, plus:</p>
              <ul className="space-y-3">
                {SUBSCRIPTION_TIERS.ELITE.features.slice(1).map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/register?tier=elite" className="block">
                  <Button className="w-full" variant="default" size="lg">
                    Start Elite
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect
                  at the start of your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I'm not satisfied?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We offer a 30-day money-back guarantee. If you're not completely satisfied,
                  contact us for a full refund.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer annual plans?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! Annual plans are available at a discounted rate. Contact us at
                  support@canecorsoacademy.com for details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this just for Cane Corsos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  While our curriculum is specifically designed for Cane Corsos, many principles
                  apply to other large guardian breeds. However, we focus exclusively on Cane Corso-specific
                  challenges and solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-slate-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the #MaxEffect Movement?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Cane Corso owners who are changing the narrative about this incredible breed.
          </p>
          <Link href="/register">
            <Button size="lg" variant="primary" className="text-lg px-8">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
