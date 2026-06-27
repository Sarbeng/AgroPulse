import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ROLE_LIST } from '../data/auth'
import { IMAGES } from '../data/images'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup'
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('farmer')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        if (!name.trim()) throw new Error('Please enter your name')
        await signup({ name, email, password, role, phone })
      }
      navigate('/app')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-svh flex">
      {/* Left panel — image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={IMAGES.authBg}
          alt="Agricultural landscape in Ghana"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-900/60" />
        <div className="relative h-full flex flex-col justify-end p-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Welcome to AgroPulse Ghana
          </h2>
          <p className="text-forest-100 text-lg max-w-md">
            The trusted platform connecting farmers, buyers, and equipment
            providers across Ghana&apos;s agricultural districts.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-12 bg-gray-50">
        <div className="max-w-md w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 mb-8"
          >
            ← Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <img
              src={IMAGES.crops.Cassava}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-bold text-xl text-forest-900">
              AgroPulse Ghana
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-500 mb-6">
            {mode === 'login'
              ? 'Log in to access your dashboard'
              : 'Choose your role and join the marketplace'}
          </p>

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-gray-200 p-1 mb-6">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m)
                  setError('')
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  mode === m
                    ? 'bg-white text-forest-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">
                    Full Name
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kwame Mensah"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </label>

                <fieldset>
                  <legend className="text-sm font-medium text-gray-700 mb-2 block">
                    I am a...
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ROLE_LIST.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-colors ${
                          role === r.id
                            ? 'border-forest-600 bg-forest-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-gray-900">
                          {r.label}
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {r.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">
                    Phone (optional)
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-forest-700 text-white font-bold text-lg hover:bg-forest-800 disabled:opacity-50 transition-colors"
            >
              {submitting
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Log In'
                  : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-forest-700 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-forest-700 font-semibold hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
