'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { insforge, authHelpers } from '@/lib/insforge'
import { LayoutDashboard, Package, ShoppingCart, Users, Image, Settings, Tag, Layers, CreditCard, Calendar, Wrench, Headphones, LogOut, Menu, X, Store } from 'lucide-react'
import LoadingScreen from '@/components/LoadingScreen'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLoginPage, setIsLoginPage] = useState(false)

  useEffect(() => {
    const path = window.location.pathname
    if (path.includes('/admin/login')) {
      setIsLoginPage(true)
      setLoading(false)
      return
    }

    async function checkAuth() {
      try {
        // FIXED: Use robust auth with localStorage fallback
        const userData = await authHelpers.getCurrentUserRobust()
        if (!userData) {
          console.log('No user in admin layout, redirect to /account')
          window.location.href = '/account'
          return
        }
        setUser(userData)

        // Check if admin - robust
        const adminCheck = await authHelpers.checkIsAdmin(userData)
        
        if (!adminCheck) {
          console.log('Not admin, redirect to account')
          window.location.href = '/account'
          return
        }
        
        setIsAdmin(true)
        console.log('Admin access granted:', userData.email)
      } catch (e) {
        console.error('Admin auth error:', e)
        // Try localStorage fallback
        const localUser = authHelpers.getUserFromLocal()
        if (localUser && authHelpers.isAdminEmail(localUser.email)) {
          setUser(localUser)
          setIsAdmin(true)
        } else {
          window.location.href = '/account'
        }
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Sales, Orders, Stock' },
    { id: 'products', label: 'Products', icon: Package, desc: 'Real Phones - Add/Edit/Delete' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, desc: 'Manage Orders, Status' },
    { id: 'customers', label: 'Customers', icon: Users, desc: 'User List, Search' },
    { id: 'banners', label: 'Banners', icon: Image, desc: 'Hero, Offers' },
    { id: 'brands', label: 'Brands', icon: Tag, desc: 'Apple, Samsung etc' },
    { id: 'categories', label: 'Categories', icon: Layers, desc: 'Smartphones, Accessories' },
    { id: 'preorder', label: 'Preorder Zone', icon: Calendar, desc: 'Upcoming Phones' },
    { id: 'accessories', label: 'Accessories', icon: Headphones, desc: 'Earbuds, Chargers, Watch' },
    { id: 'repair', label: 'Repair Tickets', icon: Wrench, desc: 'Repair + Staff Contact' },
    { id: 'settings', label: 'Settings', icon: Settings, desc: 'Shop Info, Payments' },
  ]

  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return <LoadingScreen message="Loading Admin Panel..." subMessage="Suhail Mobile Shop Raebareli • Secure Access" />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center font-rubik">
        <p>Redirecting to admin login...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-rubik flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[300px] bg-black text-white transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo-demo-2.png" alt="Suhail Mobile Shop" className="w-10 h-10 object-contain rounded-xl bg-white" />
            <div>
              <h1 className="font-rubik font-black text-[16px] tracking-tight">Suhail Mobile Shop</h1>
              <p className="font-rubik text-[11px] text-white/60">ADMIN PANEL • RAEBARELI • SECURE</p>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-xl p-3">
            <p className="font-rubik font-bold text-[13px]">{user?.email || 'Admin'}</p>
            <p className="font-rubik text-[11px] text-white/60">Suhail Mobile Shop Raebareli • Since 2015</p>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-180px)]">
          {menu.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); window.location.hash = item.id }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${activeTab === item.id ? 'bg-white text-black font-bold shadow-lg' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
            >
              <item.icon size={18} />
              <div className="flex-1">
                <p className="font-rubik font-semibold text-[13px]">{item.label}</p>
                <p className="font-rubik text-[10px] opacity-60">{item.desc}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={async () => { await authHelpers.signOutRobust(); window.location.href = '/' }} className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl font-rubik font-semibold text-[13px] hover:bg-white/15">
            <LogOut size={16} /> Logout • Back to Shop
          </button>
          <p className="font-rubik text-[10px] text-white/30 mt-3 text-center">Suhail Mobile Shop Raebareli • Since 2015 • Best Mobile Store</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-[300px]">
        <header className="bg-white border-b border-black/10 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-black/5 rounded-full"><Menu size={20} /></button>
            <div>
              <h2 className="font-rubik font-black text-[20px] tracking-tight capitalize">{activeTab} • Suhail Mobile Shop Raebareli</h2>
              <p className="font-rubik text-[12px] text-black/60">Best Mobile Store Raebareli • Real Products • Secure • Since 2015</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex bg-green-100 text-green-700 px-3 py-1 rounded-full font-rubik font-bold text-[11px]">● Live • Raebareli Store</span>
            <button onClick={() => window.location.href = '/'} className="bg-black text-white px-4 py-2 rounded-full font-rubik font-bold text-[12px] flex items-center gap-2"><Store size={14} /> View Shop</button>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  )
}
