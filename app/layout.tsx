import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Suhail Mobile Shop | Best Mobile Store Raebareli - Best Mobile Store Raebareli',
  description: 'Raebareli\'s most trusted mobile shop since 2015. Latest iPhone 16, Samsung S25, OnePlus 13, accessories, repair service. Best Mobile Store Raebareli.',
  keywords: 'Suhail Mobile Shop Raebareli, Rubik font, mobile shop Raebareli, iPhone 16 Raebareli, Samsung S25 Raebareli',
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
      </head>
      <body className="font-rubik antialiased bg-white">
        {children}
      </body>
    </html>
  )
}
