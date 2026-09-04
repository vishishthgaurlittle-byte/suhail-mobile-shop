'use client'
import { useEffect } from 'react'

export default function PWAInstaller() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // PWA registered
          })
          .catch(() => {
            // SW registration failed - silent
          })
      })
    }

    // Handle PWA install prompt
    let deferredPrompt: any = null
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e
      // Show custom install button if needed
      const installBtn = document.getElementById('pwa-install-btn')
      if (installBtn) {
        installBtn.style.display = 'flex'
      }
    }

    const handleAppInstalled = () => {
      // PWA installed
      deferredPrompt = null
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return null
}

// PWA Install Button Component - Logo only
export function PWAInstallButton() {
  const handleInstall = async () => {
    // This will be handled by the beforeinstallprompt event
    const installBtn = document.getElementById('pwa-install-btn')
    if (installBtn) {
      installBtn.style.display = 'none'
    }
  }

  return (
    <button
      id="pwa-install-btn"
      onClick={handleInstall}
      style={{ display: 'none' }}
      className="fixed bottom-20 right-6 bg-black text-white px-4 py-3 rounded-full font-rubik font-bold text-[12px] shadow-xl flex items-center gap-2 z-30 hover:bg-zinc-800 transition"
    >
      <img src="/logo-final.png" alt="Install" className="w-6 h-6 rounded-full bg-white object-contain" />
      Install App
    </button>
  )
}
