'use client'
// Suhail Mobile Shop - Logo Only Component - No Loading Screens
// User requested: remove loading screens, only logo + PWA config

export function Logo({ size = 40, className = "" }: { size?: number, className?: string }) {
  return (
    <img 
      src="/logo-final.png" 
      alt="Suhail Mobile Shop Raebareli" 
      width={size}
      height={size}
      className={`object-contain rounded-xl bg-white ${className}`}
    />
  )
}

export function LogoWithText({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <Logo size={size} />
      <div>
        <h1 className="font-rubik font-bold text-[16px] tracking-tight leading-none">Suhail Mobile Shop</h1>
        <p className="font-rubik text-[11px] text-black/60 font-medium tracking-wide">RAEBARELI • SINCE 2015</p>
      </div>
    </div>
  )
}

export default Logo
