'use client'
// @ts-nocheck

import { useEffect, useState } from 'react'
import { insforge, authHelpers } from '@/lib/insforge'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing OAuth login...')

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser()
        
        if (error) {
          setStatus(`Auth failed: ${error.message}`)
          setTimeout(() => router.push('/?auth=failed'), 2000)
          return
        }

        if (data?.user) {
          const u = data.user as any
          // FIX: Ensure profile and save to customers list for admin panel
          try {
            authHelpers.saveUserToLocal(u)
            authHelpers.ensureProfile(u).catch(()=>{})
          } catch {}
          setStatus(`Welcome ${u.profile?.name || u.email}! Redirecting...`)
          setTimeout(() => router.push('/?auth=success'), 1000)
        } else {
          setStatus('No user found, redirecting...')
          setTimeout(() => router.push('/'), 2000)
        }
      } catch (e: any) {
        setStatus(`Error: ${e.message}`)
        setTimeout(() => router.push('/?auth=error'), 2000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] font-rubik">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-black font-rubik mb-2">Suhail Mobile Shop</h2>
        <p className="text-gray-600 font-rubik">{status}</p>
        <p className="text-xs text-gray-400 mt-4 font-rubik">Suhail Mobile Shop Raebareli • Best Mobile Store Since 2015</p>
      </div>
    </div>
  )
}
