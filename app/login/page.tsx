import LoginForm from '@/components/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-slate-900">
            Cane Corso Academy
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-slate-600">
            Sign in to continue your training
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
