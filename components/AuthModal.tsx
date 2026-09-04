'use client'
// @ts-nocheck

import { useState } from 'react'
import { insforge, syncUserToTurso } from '@/lib/insforge'
import { X, Mail, Lock, User, Phone, Chrome, Github } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'verify' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name,
      } as any)

      // Add phone to metadata via custom data if supported
      // InsForge may store extra in user_metadata

      if (error) throw error

      setMessage('Account created! Check your email for 6-digit verification code.')
      setMode('verify')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data?.user) {
        await syncUserToTurso(data.user)
        onSuccess(data.user)
        onClose()
      }
    } catch (err: any) {
      // If email not verified, prompt for OTP
      if (err.message?.includes('not verified') || err.message?.includes('verification')) {
        setMessage('Email not verified. Please enter OTP sent to your email.')
        setMode('verify')
      } else {
        setError(err.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email,
        otp,
      })

      if (error) throw error

      if (data?.user) {
        await syncUserToTurso(data.user)
        onSuccess(data.user)
        onClose()
      } else {
        setMessage('Verified! Now please login.')
        setMode('login')
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await insforge.auth.signInWithOAuth({
        provider,
        redirectTo: `${window.location.origin}/auth/callback`
      })
      if (error) throw error
      if (data?.authUrl) {
        window.location.href = data.authUrl
      }
    } catch (err: any) {
      setError(err.message || `${provider} login failed`)
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await insforge.auth.sendResetPasswordEmail({
        email,
      })
      if (error) throw error
      setMessage('Password reset code sent to your email!')
      setMode('verify')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in">
        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-outfit">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Join Suhail Mobile'}
              {mode === 'verify' && 'Verify Email'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {mode === 'login' && 'Login to track orders & wishlist'}
              {mode === 'signup' && 'Create account to shop faster'}
              {mode === 'verify' && `Code sent to ${email}`}
              {mode === 'forgot' && 'Enter email to get reset code'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {message}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F5F5F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F5F5F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 disabled:opacity-50 transition"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => setMode('forgot')} className="text-gray-600 hover:text-black">
                  Forgot password?
                </button>
                <button type="button" onClick={() => setMode('signup')} className="text-black font-semibold">
                  Create account
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">OR CONTINUE WITH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <Chrome size={18} /> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <Github size={18} /> GitHub
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center mt-4">
                Powered by InsForge Auth • Secure & Encrypted
              </p>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F5F5F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F5F5F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  placeholder="Phone (10 digits)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F5F5F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F5F5F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>

              <p className="text-sm text-center">
                Already have account?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-black font-semibold">
                  Login
                </button>
              </p>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail size={24} />
                </div>
                <p className="text-sm text-gray-600">Enter 6-digit code sent to</p>
                <p className="font-semibold">{email}</p>
              </div>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] py-4 bg-[#F5F5F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                maxLength={6}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-xl font-semibold"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-gray-600">
                Back to login
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F5F5F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-xl font-semibold"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-gray-600">
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
