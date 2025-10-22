import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Video, Users, Calendar, Award, MessageCircle } from 'lucide-react'
import DashboardNav from '@/components/dashboard-nav'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const subscription = user.subscription

  if (!subscription || subscription.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardNav user={user} />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>No Active Subscription</CardTitle>
              <CardDescription>
                Subscribe to access the Cane Corso Academy content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing">
                <Button variant="primary">View Pricing</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const tierName = subscription.tier.charAt(0) + subscription.tier.slice(1).toLowerCase()

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={user} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-600 mt-1">
            You're on the <span className="font-semibold text-blue-600">{tierName}</span> plan
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/courses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">My Courses</CardTitle>
                    <CardDescription>Continue learning</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/live-events">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Live Events</CardTitle>
                    <CardDescription>Join Q&A sessions</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/community">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Community</CardTitle>
                    <CardDescription>Connect with owners</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {(subscription.tier === 'MASTER' || subscription.tier === 'ELITE') && (
            <Link href="/dashboard/submit-video">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Video className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Submit Video</CardTitle>
                      <CardDescription>Get expert feedback</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )}

          {subscription.tier === 'ELITE' && (
            <Link href="/dashboard/consultations">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Book 1-on-1</CardTitle>
                      <CardDescription>Schedule consultation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )}

          <Link href="/dashboard/resources">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Resources</CardTitle>
                    <CardDescription>Download materials</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Continue Learning */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Continue Learning</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>First 365 Days</CardTitle>
                <CardDescription>Module 3: Public Socialization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-sm text-slate-600">60% Complete</p>
                  <Link href="/dashboard/courses/first-365-days">
                    <Button variant="primary">Continue</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Live Event</CardTitle>
                <CardDescription>Monthly Q&A Session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    <strong>When:</strong> Saturday, Nov 2 at 2:00 PM EST
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Topic:</strong> Managing Your Corso in Public Spaces
                  </p>
                  <Link href="/dashboard/live-events">
                    <Button variant="outline">Register</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tier-Specific Benefits */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle>Your {tierName} Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <span className="mr-2">✓</span>
                Access to all Foundation courses
              </li>
              <li className="flex items-center text-sm">
                <span className="mr-2">✓</span>
                Weekly video lessons
              </li>
              <li className="flex items-center text-sm">
                <span className="mr-2">✓</span>
                Monthly live Q&A sessions
              </li>
              {(subscription.tier === 'MASTER' || subscription.tier === 'ELITE') && (
                <>
                  <li className="flex items-center text-sm font-semibold text-blue-700">
                    <span className="mr-2">✓</span>
                    Video submission & expert feedback
                  </li>
                  <li className="flex items-center text-sm font-semibold text-blue-700">
                    <span className="mr-2">✓</span>
                    Bi-weekly group coaching calls
                  </li>
                </>
              )}
              {subscription.tier === 'ELITE' && (
                <>
                  <li className="flex items-center text-sm font-semibold text-purple-700">
                    <span className="mr-2">✓</span>
                    Monthly 1-on-1 consultations
                  </li>
                  <li className="flex items-center text-sm font-semibold text-purple-700">
                    <span className="mr-2">✓</span>
                    Elite Training Vault access
                  </li>
                </>
              )}
            </ul>
            {subscription.tier === 'FOUNDATION' && (
              <div className="mt-4">
                <Link href="/pricing">
                  <Button variant="outline" size="sm">
                    Upgrade for More Benefits
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
