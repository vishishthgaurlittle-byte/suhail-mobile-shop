'use client'
// Final Loading Screen - Approved by user - Using Loading Demo 3 + Logo Demo 2 same to same WITH ANIMATIONS
// User liked: Loading your mobile store, Raebareli's Trusted Mobile Shop Since 2015 + S logo inside phone
// No secret text, only professional branding - Using exact files user approved + added animations

export default function LoadingScreen({ message = "Loading your mobile store", subMessage = "Raebareli's Trusted Mobile Shop Since 2015" }: { message?: string, subMessage?: string }) {
  return (
    <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center font-rubik p-4">
      <style>{`
        @keyframes floatS {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes spinDots {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 10px rgba(0,0,0,0.1)); }
          50% { opacity: 1; filter: drop-shadow(0 0 20px rgba(0,0,0,0.2)); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-floatS { animation: floatS 3s ease-in-out infinite; }
        .animate-spinDots { animation: spinDots 1.2s linear infinite; }
        .animate-pulseGlow { animation: pulseGlow 2s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* Using exact Loading Demo 3 image same to same + ANIMATIONS */}
      <div className="relative w-full max-w-[420px] h-[700px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-black/10">
        {/* Background image - same to same */}
        <img 
          src="/loading-demo-3.png" 
          alt="Loading Suhail Mobile Shop"
          className="w-full h-full object-cover"
        />
        
        {/* Animated overlay - S logo floating animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* Floating S glow */}
          <div className="absolute top-[32%] animate-floatS animate-pulseGlow">
            <div className="w-28 h-28 rounded-full bg-black/5 blur-xl"></div>
          </div>
          
          {/* Animated dotted spinner at bottom - like approved image but animated */}
          <div className="absolute bottom-[18%] flex flex-col items-center gap-3">
            {/* Rotating dotted circle */}
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 animate-spinDots">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-black/40 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-20px)`,
                      opacity: 0.3 + (i / 12) * 0.7
                    }}
                  />
                ))}
              </div>
              {/* Center dots bouncing */}
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-black rounded-full" style={{ animation: 'dotBounce 1.4s infinite 0s' }}></span>
                <span className="w-1.5 h-1.5 bg-black rounded-full" style={{ animation: 'dotBounce 1.4s infinite 0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-black rounded-full" style={{ animation: 'dotBounce 1.4s infinite 0.4s' }}></span>
              </div>
            </div>
            
            {/* Shimmer loading bar */}
            <div className="w-32 h-1 bg-black/10 rounded-full overflow-hidden mt-2">
              <div className="h-full w-1/2 bg-black rounded-full animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Optional overlay text if props different */}
        {(message !== "Loading your mobile store" || subMessage !== "Raebareli's Trusted Mobile Shop Since 2015") && (
          <div className="absolute bottom-20 left-0 right-0 text-center px-6 bg-white/80 backdrop-blur-sm py-3 rounded-2xl mx-4">
            <p className="font-black text-[16px] text-black animate-pulse">{message}</p>
            <p className="text-[12px] text-black/60 mt-1">{subMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Mini loading for inline use - Using Logo Demo 2 same to same WITH ANIMATIONS
export function MiniLoading() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 font-rubik bg-[#F8F6F0]">
      <style>{`
        @keyframes floatS {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .animate-floatS { animation: floatS 2.5s ease-in-out infinite; }
      `}</style>
      
      {/* Logo Demo 2 same to same with float animation */}
      <div className="animate-floatS">
        <img 
          src="/logo-demo-2.png" 
          alt="Suhail Mobile Shop"
          className="w-36 h-36 object-contain drop-shadow-xl"
        />
      </div>
      
      {/* Animated spinner - rotating + bouncing dots */}
      <div className="relative w-12 h-12 mt-8">
        <div className="absolute inset-0 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          <span className="w-1 h-1 bg-black rounded-full" style={{ animation: 'dotBounce 1s infinite 0s' }}></span>
          <span className="w-1 h-1 bg-black rounded-full" style={{ animation: 'dotBounce 1s infinite 0.15s' }}></span>
          <span className="w-1 h-1 bg-black rounded-full" style={{ animation: 'dotBounce 1s infinite 0.3s' }}></span>
        </div>
      </div>
      
      <p className="font-black text-[18px] tracking-tight mt-6 animate-pulse">Suhail Mobile Shop Raebareli</p>
      <p className="text-[13px] text-black/60 mt-1">Raebareli's Trusted Mobile Shop Since 2015</p>
      <p className="text-[10px] text-black/30 mt-3 tracking-widest uppercase">Loading • Best Mobile Store</p>
      
      {/* Progress dots */}
      <div className="flex gap-1.5 mt-4">
        <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-black/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
        <span className="w-2 h-2 bg-black/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
      </div>
    </div>
  )
}

// Header Logo component using Logo Demo 2 same to same with subtle hover animation
export function HeaderLogo() {
  return (
    <img 
      src="/logo-demo-2.png" 
      alt="Suhail Mobile Shop Logo"
      className="w-10 h-10 object-contain rounded-xl bg-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
    />
  )
}

// Full page loading with both logos animated
export function FullAnimatedLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-rubik">
      <style>{`
        @keyframes floatS {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spinDots {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-floatS { animation: floatS 3s ease-in-out infinite; }
        .animate-spinDots { animation: spinDots 1s linear infinite; }
      `}</style>
      
      <div className="text-center">
        <div className="animate-floatS">
          <img src="/logo-demo-2.png" alt="Logo" className="w-32 h-32 object-contain mx-auto drop-shadow-2xl" />
        </div>
        
        <div className="mt-8 relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-3 border-black/10 rounded-full"></div>
          <div className="absolute inset-0 border-3 border-t-black border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spinDots"></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <span className="font-black text-xl">S</span>
          </div>
        </div>
        
        <h1 className="font-black text-[20px] mt-6">Loading your mobile store</h1>
        <p className="text-[14px] text-black/60 mt-1">Raebareli's Trusted Mobile Shop Since 2015</p>
        
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}
