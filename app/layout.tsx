import type { Metadata, Viewport } from 'next'
import './globals.css'
import PWAInstaller from '@/components/PWAInstaller'

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light',
}

export const metadata: Metadata = {
  title: {
    default: 'Suhail Mobile Shop | Best Mobile Store Raebareli',
    template: '%s | Suhail Mobile Shop Raebareli',
  },
  description: "Raebareli's most trusted mobile shop since 2015. Latest iPhone 16, Samsung S25, OnePlus 13, accessories, repair service. Best Mobile Store Raebareli. UPI/Bank Direct Payment.",
  keywords: ['Suhail Mobile Shop Raebareli', 'mobile shop Raebareli', 'iPhone 16 Raebareli', 'Samsung S25 Raebareli', 'OnePlus 13 Raebareli', 'Best Mobile Store Raebareli', 'phone repair Raebareli', 'Rubik font'],
  authors: [{ name: 'Suhail Mobile Shop Raebareli' }],
  creator: 'Suhail Mobile Shop',
  publisher: 'Suhail Mobile Shop Raebareli',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://suhail-mobile-shop.vercel.app'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Suhail Mobile',
    startupImage: [
      {
        url: '/icons/icon-512x512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://suhail-mobile-shop.vercel.app',
    title: 'Suhail Mobile Shop | Best Mobile Store Raebareli',
    description: "Raebareli's most trusted mobile shop since 2015. Latest phones, accessories, repair service.",
    siteName: 'Suhail Mobile Shop Raebareli',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Suhail Mobile Shop Raebareli Logo',
      },
      {
        url: '/logo-final.png',
        width: 1408,
        height: 768,
        alt: 'Suhail Mobile Shop Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suhail Mobile Shop | Best Mobile Store Raebareli',
    description: "Raebareli's most trusted mobile shop since 2015",
    images: ['/icon.png'],
  },
  verification: {
    google: 'suhail-mobile-shop-raebareli',
  },
  category: 'shopping',
  classification: 'Mobile Shop, Electronics Store',
  referrer: 'origin-when-cross-origin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* PWA - Logo only, no loading screens */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Suhail Mobile" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Suhail Mobile" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body className="font-rubik antialiased bg-white">
        <PWAInstaller />
        {children}
      </body>
    </html>
  )
}
