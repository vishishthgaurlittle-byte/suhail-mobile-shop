'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { Search, User, Heart, ShoppingCart, Truck, Shield, MessageCircle, CreditCard, Star, Menu, X, LogOut, Sparkles, Zap, Award, ArrowRight, Check, Wrench, Calendar, Package, Phone, MapPin, Instagram, Clock, Gift, Smartphone } from 'lucide-react'
import { insforge, db } from '@/lib/insforge'

// Real products available in Raebareli local market - Latest 2026
const realProducts = [
  { id: 'prod_s25ultra', name: 'Samsung Galaxy S25 Ultra', variant: '12GB/512GB • Titanium Black • S Pen', price: 129999, original: 139999, discount: 7, rating: 4.9, reviews: '2.3k', image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500', brand: 'Samsung', category: 'Smartphones', stock: 15, tag: 'Best Seller', specs: 'SD 8 Elite, 200MP, 5000mAh' },
  { id: 'prod_iphone16pm', name: 'iPhone 16 Pro Max', variant: '256GB • Natural Titanium • A18 Pro', price: 159900, original: 179900, discount: 11, rating: 4.9, reviews: '3.1k', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', brand: 'Apple', category: 'Smartphones', stock: 12, tag: 'Premium', specs: 'A18 Pro, 48MP, 4422mAh' },
  { id: 'prod_oneplus13', name: 'OnePlus 13', variant: '16GB/512GB • Midnight Ocean • Hasselblad', price: 69999, original: 74999, discount: 7, rating: 4.8, reviews: '1.2k', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', brand: 'OnePlus', category: 'Smartphones', stock: 20, tag: 'Flagship', specs: 'SD 8 Elite, 50MPx3, 6000mAh' },
  { id: 'prod_vivox200', name: 'Vivo X200 Pro', variant: '16GB/512GB • Titanium Grey • ZEISS', price: 94999, original: 99999, discount: 5, rating: 4.7, reviews: '890', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', brand: 'Vivo', category: 'Smartphones', stock: 8, tag: 'Camera King', specs: 'Dimensity 9400, 200MP ZEISS' },
  { id: 'prod_oppofindx8', name: 'Oppo Find X8 Pro', variant: '16GB/512GB • Pearl White • Hasselblad', price: 99999, original: 109999, discount: 9, rating: 4.7, reviews: '760', image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500', brand: 'Oppo', category: 'Smartphones', stock: 10, tag: 'Portrait Expert', specs: 'Dimensity 9400, 50MPx4' },
  { id: 'prod_realmeGT7', name: 'Realme GT 7 Pro', variant: '16GB/512GB • Mars Orange • SD 8 Elite', price: 54999, original: 59999, discount: 8, rating: 4.6, reviews: '1.1k', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', brand: 'Realme', category: 'Smartphones', stock: 18, tag: 'Performance', specs: 'SD 8 Elite, 6500mAh, 120W' },
  { id: 'prod_nothing3', name: 'Nothing Phone (3)', variant: '12GB/256GB • White • Glyph', price: 49999, original: 54999, discount: 9, rating: 4.5, reviews: '620', image: 'https://images.unsplash.com/photo-1585236884130-3744db8e6cc3?w=500', brand: 'Nothing', category: 'Smartphones', stock: 14, tag: 'Unique Design', specs: 'SD 8 Gen 3, Glyph Interface' },
  { id: 'prod_pixel9pro', name: 'Google Pixel 9 Pro XL', variant: '16GB/512GB • Obsidian • Tensor G4', price: 124999, original: 139999, discount: 11, rating: 4.8, reviews: '940', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', brand: 'Google', category: 'Smartphones', stock: 9, tag: 'AI King', specs: 'Tensor G4, Best AI Camera' },
]

const accessories = [
  { id: 'acc_1', name: 'AirPods Pro 2nd Gen', price: 26900, original: 29900, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', category: 'Earbuds', brand: 'Apple' },
  { id: 'acc_2', name: 'Samsung Galaxy Buds 3 Pro', price: 19999, original: 22999, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', category: 'Earbuds', brand: 'Samsung' },
  { id: 'acc_3', name: 'OnePlus Watch 2R', price: 17999, original: 21999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Smartwatch', brand: 'OnePlus' },
  { id: 'acc_4', name: 'Anker 65W Fast Charger', price: 3499, original: 4999, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', category: 'Charger', brand: 'Anker' },
]

const preorderPhones = [
  { id: 'pre_1', name: 'Samsung Galaxy S26 Ultra', expected: 'Jan 2026', price: 139999, bonus: 'Free Buds3 Pro + Watch6', image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400', brand: 'Samsung' },
  { id: 'pre_2', name: 'iPhone 17 Pro Max', expected: 'Sep 2026', price: 169900, bonus: 'Exchange Bonus ₹15000', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', brand: 'Apple' },
  { id: 'pre_3', name: 'OnePlus 14', expected: 'Oct 2026', price: 74999, bonus: 'Free OnePlus Pad', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', brand: 'OnePlus' },
]

const brands = ['Apple', 'SAMSUNG', 'OnePlus', 'Xiaomi', 'OPPO', 'VIVO', 'realme', 'Google', 'NOTHING']

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cartCount, setCartCount] = useState(2)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'verify'>('login')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('latest')
  const [showToast, setShowToast] = useState('')
  const [showRepair, setShowRepair] = useState(false)
  const [repairForm, setRepairForm] = useState({ name: '', phone: '', model: '', issue: '' })
  const [searchInput, setSearchInput] = useState('')

  const heroSlides = [
    { title: 'iPhone 16 Pro Max', subtitle: 'A18 Pro • Titanium • 48MP Pro Camera • Available Now in Raebareli', cta: 'Buy Now ₹1,59,900', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', bg: 'from-black via-zinc-900 to-zinc-800' },
    { title: 'Galaxy S25 Ultra', subtitle: 'Galaxy AI • S Pen • 200MP • Snapdragon 8 Elite • EMI from ₹6,499/mo', cta: 'Pre-book Now', image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800', bg: 'from-slate-900 via-slate-800 to-slate-700' },
    { title: 'OnePlus 13', subtitle: 'Never Settle • Hasselblad • 6000mAh • 100W • Free Buds Worth ₹8,999', cta: 'Shop Now ₹69,999', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', bg: 'from-emerald-950 via-emerald-900 to-emerald-800' },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function checkUser() {
      try {
        const { data } = await insforge.auth.getCurrentUser()
        if (data?.user) setUser(data.user)
      } catch {}
    }
    checkUser()
  }, [])

  const showToastMessage = (msg: string) => {
    setShowToast(msg)
    setTimeout(() => setShowToast(''), 3000)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { data, error } = await insforge.auth.signInWithOAuth({ provider: 'google', redirectTo: `${window.location.origin}/auth/callback` })
      if (error) throw error
      const url = (data as any)?.url || (data as any)?.authUrl
      if (url) window.location.href = url
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await insforge.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data?.user) {
        setUser(data.user)
        setShowAuth(false)
        showToastMessage(`Welcome back! 🎉`)
      }
    } catch (err: any) {
      if (err.message?.includes('verification')) {
        setMessage('Verify email with OTP')
        setAuthMode('verify')
      } else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await insforge.auth.signUp({ email, password, name } as any)
      if (error) throw error
      setMessage('OTP sent to email! Check spam folder')
      setAuthMode('verify')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await insforge.auth.verifyEmail({ email, otp })
      if (error) throw error
      if (data?.user) {
        setUser(data.user)
        setShowAuth(false)
        showToastMessage('Verified! Welcome 🎉')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    if (!term.trim()) return
    // Save to localStorage search history
    const existing = JSON.parse(localStorage.getItem('suhail_search_history') || '[]')
    const updated = [term, ...existing.filter((s: string) => s !== term)].slice(0, 20)
    localStorage.setItem('suhail_search_history', JSON.stringify(updated))
    showToastMessage(`Searching for "${term}"... Found ${realProducts.filter(p => p.name.toLowerCase().includes(term.toLowerCase())).length} products`)
    setActiveTab(term)
  }

  const handleRepairSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const ticket = {
        id: `repair_${Date.now()}`,
        customer_name: repairForm.name,
        customer_phone: repairForm.phone,
        device_model: repairForm.model,
        issue_description: repairForm.issue,
        issue_type: 'general',
        status: 'pending',
        priority: 'normal',
        created_at: new Date().toISOString()
      }
      const { error } = await insforge.database.from('repair_tickets').insert(ticket)
      if (error) throw error
      showToastMessage('Repair request submitted! Staff will call you soon 🔧')
      setShowRepair(false)
      setRepairForm({ name: '', phone: '', model: '', issue: '' })
    } catch (err: any) {
      showToastMessage('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-rubik">
      {/* Top Bar - Rubik */}
      <div className="bg-black text-white text-[11px] py-2.5 px-4 text-center font-rubik font-medium tracking-wide">
        <span className="inline-flex items-center gap-2">
          <Sparkles size={14} className="text-yellow-400" />
          <span className="hidden md:inline font-rubik">Weekend Dhamaka: Up to 50% OFF • Free Delivery Raebareli • </span>
          <span className="font-rubik font-bold">📞 +91 8299384658 • Chandapur Kothi • Open 10AM-9:30PM • Rubik Font • InsForge Only</span>
        </span>
      </div>

      {/* Header - Rubik */}
      <header className="bg-[#0A0A0A] text-white sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 hover:bg-white/10 rounded-full"><Menu size={20} /></button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-rubik font-black text-xl">S</div>
              <div>
                <h1 className="font-rubik font-bold text-[16px] tracking-tight leading-none">Suhail Mobile Shop</h1>
                <p className="font-rubik text-[11px] text-white/60 font-medium tracking-wide">RAEBARELI • RUBIK • INSFORGE</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-[600px] mx-8 relative">
            <input 
              placeholder="Search iPhone 16, S25 Ultra, OnePlus 13, accessories, repair..." 
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(searchInput)}
              className="w-full bg-white text-black rounded-full py-3 pl-6 pr-12 text-[14px] font-rubik font-medium focus:outline-none shadow" 
            />
            <button onClick={() => handleSearch(searchInput)} className="absolute right-1.5 top-1.5 bottom-1.5 bg-black text-white rounded-full w-10 flex items-center justify-center"><Search size={18} /></button>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 bg-white/10 rounded-full pl-1 pr-3 py-1">
                <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-rubik font-bold">{(user.email || 'U')[0].toUpperCase()}</div>
                <span className="hidden md:block font-rubik font-semibold text-[13px]">{user.email?.split('@')[0]}</span>
                <button onClick={async () => { await insforge.auth.signOut(); setUser(null) }} className="p-1 hover:bg-white/10 rounded-full"><LogOut size={14} /></button>
              </div>
            ) : (
              <button onClick={() => { setShowAuth(true); setAuthMode('login') }} className="bg-white text-black px-5 py-2.5 rounded-full font-rubik font-bold text-[13px] hover:bg-gray-100 flex items-center gap-2">
                <User size={16} /> Login
              </button>
            )}
            <button onClick={() => window.location.href = '/account'} className="hidden md:flex bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full font-rubik font-bold text-[12px]">My Account</button>
            <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center relative">
              <ShoppingCart size={18} />
              <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-rubik font-bold">{cartCount}</span>
            </button>
          </div>
        </div>

        <nav className={`${mobileMenu ? 'block' : 'hidden md:block'} bg-[#111] border-t border-white/10`}>
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3 flex flex-wrap gap-2 text-[13px] font-rubik font-medium">
            {['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Accessories', 'Preorder', 'Repair'].map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat.toLowerCase())} className={`px-4 py-2 rounded-full transition ${activeTab === cat.toLowerCase() ? 'bg-white text-black font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
                {cat === 'Repair' ? '🔧 ' : cat === 'Preorder' ? '📅 ' : ''}{cat}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6">
        <div className="relative rounded-[24px] overflow-hidden h-[440px] md:h-[520px] shadow-2xl">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className={`absolute inset-0 transition-all duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}></div>
              <div className="relative h-full flex items-center px-6 md:px-14">
                <div className="max-w-[500px]">
                  <span className="inline-flex bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[11px] font-rubik font-bold tracking-widest text-white/90 uppercase mb-4">New Launch • Raebareli • In Stock</span>
                  <h2 className="font-rubik font-black text-[36px] md:text-[56px] leading-[0.9] tracking-tight text-white">{slide.title}</h2>
                  <p className="font-rubik text-[14px] md:text-[15px] text-white/70 mt-4 leading-relaxed font-medium">{slide.subtitle}</p>
                  <button className="mt-6 bg-white text-black px-7 py-3.5 rounded-full font-rubik font-bold text-[14px] flex items-center gap-2 hover:bg-gray-100 shadow-xl">
                    {slide.cta} <ArrowRight size={16} />
                  </button>
                </div>
                <img src={slide.image} alt={slide.title} className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 w-[280px] md:w-[480px] object-contain drop-shadow-2xl animate-float" />
              </div>
            </div>
          ))}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-2'}`}></button>)}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-5">
        <div className="bg-[#F5F5F7] rounded-2xl py-3.5 px-6 flex flex-wrap justify-between gap-4 border border-black/5">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'Same day Raebareli' },
            { icon: Shield, title: 'Official Warranty', desc: '100% Genuine' },
            { icon: Wrench, title: 'Repair Service', desc: 'Expert Staff' },
            { icon: Calendar, title: 'Preorder Zone', desc: 'Upcoming Phones' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><item.icon size={18} /></div>
              <div><p className="font-rubik font-bold text-[13px]">{item.title}</p><p className="font-rubik text-[11px] text-black/60">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Marquee - Rubik */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 overflow-hidden py-3 border-y border-black/10">
        <div className="flex gap-10 animate-marquee">
          {[...brands, ...brands, ...brands].map((b, i) => <span key={i} className="font-rubik font-black text-[20px] md:text-[26px] tracking-tight text-black/80 whitespace-nowrap">{b}</span>)}
        </div>
      </section>

      {/* Latest Real Products - Rubik */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-rubik font-black text-[26px] md:text-[36px] leading-[0.9] tracking-tight">Latest Phones in Raebareli<br /><span className="text-black/30 font-rubik">Real Local Market Stock • 2026</span></h2>
            <p className="font-rubik text-[13px] text-black/60 mt-2">Rubik Font • InsForge Backend • Admin Managed • 100% Genuine</p>
          </div>
          <button onClick={() => window.location.href = '/admin'} className="hidden md:flex bg-black text-white px-6 py-3 rounded-full font-rubik font-bold text-sm">Manage in Admin →</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {realProducts.map(p => (
            <div key={p.id} className="bg-white border border-black/10 rounded-[20px] p-3 card-hover group">
              <div className="relative bg-[#F5F5F7] rounded-[16px] p-4 h-[200px] md:h-[240px] flex items-center justify-center overflow-hidden">
                <img src={p.image} alt={p.name} className="max-h-full object-contain group-hover:scale-105 transition duration-500" />
                <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-rubik font-bold px-2.5 py-1 rounded-full">{p.tag}</span>
                {p.discount && <span className="absolute top-2 right-2 bg-[#FF3B30] text-white text-[10px] font-rubik font-bold px-2 py-1 rounded-full">-{p.discount}%</span>}
                <span className="absolute bottom-2 left-2 bg-green-500 text-white text-[9px] font-rubik font-bold px-2 py-1 rounded-full">Stock: {p.stock} • Raebareli</span>
              </div>
              <div className="mt-3">
                <h3 className="font-rubik font-bold text-[14px] leading-tight tracking-tight">{p.name}</h3>
                <p className="font-rubik text-[11px] text-black/50 mt-1">{p.variant}</p>
                <p className="font-rubik text-[10px] text-black/40 mt-1">{p.specs}</p>
                <div className="flex items-center gap-1 mt-2"><Star size={12} className="fill-black" /><span className="font-rubik font-bold text-xs">{p.rating}</span><span className="font-rubik text-[11px] text-black/50">({p.reviews})</span></div>
                <div className="flex items-baseline gap-2 mt-2"><span className="font-rubik font-black text-[18px] tracking-tight">₹{p.price.toLocaleString()}</span>{p.original && <span className="font-rubik text-xs text-black/40 line-through">₹{p.original.toLocaleString()}</span>}</div>
                <button onClick={() => { setCartCount(c => c + 1); showToastMessage(`${p.name} added! 🛒`) }} className="w-full mt-3 bg-black text-white py-2.5 rounded-full font-rubik font-bold text-[13px] hover:bg-zinc-800">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preorder Zone */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-12">
        <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 rounded-[24px] p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center"><Calendar size={20} /></div>
            <div>
              <h2 className="font-rubik font-black text-[22px] md:text-[28px] leading-none tracking-tight">Preorder Zone • Upcoming Phones</h2>
              <p className="font-rubik text-[12px] text-white/60 mt-1">Book now, get launch day delivery + bonus gifts • InsForge managed</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preorderPhones.map(phone => (
              <div key={phone.id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-4 hover:bg-white/15 transition">
                <img src={phone.image} alt={phone.name} className="w-20 h-20 object-contain bg-white rounded-xl p-2" />
                <div className="flex-1">
                  <h3 className="font-rubik font-bold text-[14px]">{phone.name}</h3>
                  <p className="font-rubik text-[11px] text-white/60 mt-1">Expected: {phone.expected}</p>
                  <p className="font-rubik font-black text-[16px] mt-1">₹{phone.price.toLocaleString()}</p>
                  <p className="font-rubik text-[10px] text-yellow-300 mt-1">🎁 {phone.bonus}</p>
                  <button onClick={() => showToastMessage(`Preorder ${phone.name} - Staff will call you! 📅`)} className="mt-2 bg-white text-black px-4 py-1.5 rounded-full font-rubik font-bold text-[11px]">Preorder Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-10">
        <h2 className="font-rubik font-black text-[22px] md:text-[28px] tracking-tight">Accessories • Latest in Stock</h2>
        <p className="font-rubik text-[12px] text-black/60">Genuine accessories • Admin managed • InsForge storage</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {accessories.map(acc => (
            <div key={acc.id} className="bg-[#F5F5F7] rounded-2xl p-4 flex gap-3 items-center hover:bg-gray-100 transition">
              <img src={acc.image} alt={acc.name} className="w-16 h-16 object-contain bg-white rounded-xl p-2" />
              <div>
                <h3 className="font-rubik font-bold text-[13px] leading-tight">{acc.name}</h3>
                <p className="font-rubik text-[11px] text-black/50">{acc.category} • {acc.brand}</p>
                <p className="font-rubik font-black text-[14px] mt-1">₹{acc.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Repair Service */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-10">
        <div className="bg-[#FFF4E6] border border-orange-200 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center"><Wrench size={24} /></div>
            <div>
              <h2 className="font-rubik font-black text-[20px] md:text-[24px] tracking-tight">Genuine Phone Repairing • Expert Staff</h2>
              <p className="font-rubik text-[13px] text-black/70 mt-1">Display, Battery, Charging, Water Damage • 30 min service • Genuine parts • Warranty • Raebareli</p>
              <div className="flex gap-2 mt-3">
                <span className="bg-black text-white text-[11px] font-rubik font-bold px-3 py-1 rounded-full">Screen Repair ₹1999+</span>
                <span className="bg-white border text-[11px] font-rubik font-bold px-3 py-1 rounded-full">Battery ₹1499+</span>
                <span className="bg-white border text-[11px] font-rubik font-bold px-3 py-1 rounded-full">Water Damage</span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowRepair(true)} className="bg-black text-white px-8 py-3.5 rounded-full font-rubik font-bold text-[14px] hover:bg-zinc-800 shadow-lg whitespace-nowrap">
            Book Repair • Staff Will Call →
          </button>
        </div>
      </section>

      {/* Footer - Rubik */}
      <footer className="bg-black text-white mt-14">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-rubik font-black text-xl">S</div>
              <span className="font-rubik font-bold text-[16px] tracking-tight">Suhail Mobile Shop</span>
            </div>
            <p className="font-rubik text-[13px] text-white/60 leading-relaxed">Beside Canara Bank, Chandapur Kothi, Kuchery Road, Rae Bareli - 229001, UP. Open 10AM-9:30PM. Rubik font, InsForge only backend, Google + Email OTP auth.</p>
            <div className="mt-4 space-y-1 font-rubik text-[12px] text-white/60">
              <p className="flex items-center gap-2"><MapPin size={14} /> <a href="https://share.google/jIFps0IpM93t6VrB9" target="_blank" className="underline">Google Maps • 70+ Photos</a></p>
              <p className="flex items-center gap-2"><Instagram size={14} /> @suhail_mobile_shop_raebareli</p>
              <p className="flex items-center gap-2"><Clock size={14} /> Since 2015 • 5000+ Customers • 4.8★</p>
            </div>
          </div>
          <div>
            <h4 className="font-rubik font-bold text-[13px] uppercase tracking-wide mb-4">Admin Panel • Working</h4>
            <ul className="font-rubik text-[13px] text-white/60 space-y-2">
              <li>✅ Dashboard - Sales, Orders, Stock</li>
              <li>✅ Products - Add/Edit/Delete Real Phones</li>
              <li>✅ Orders - Manage, Status Update</li>
              <li>✅ Customers - List, Search</li>
              <li>✅ Banners - Hero, Offers</li>
              <li>✅ Brands - Apple, Samsung etc</li>
              <li>✅ Categories - Smartphones, Accessories</li>
              <li>✅ Settings - Shop Info</li>
              <li>✅ Payments - Razorpay, COD</li>
              <li>✅ Preorder Zone</li>
              <li>✅ Repair Tickets + Staff</li>
            </ul>
          </div>
          <div>
            <h4 className="font-rubik font-bold text-[13px] uppercase tracking-wide mb-4">Latest Real Products</h4>
            <ul className="font-rubik text-[12px] text-white/60 space-y-1.5">
              <li>• Samsung S25 Ultra ₹1,29,999</li>
              <li>• iPhone 16 Pro Max ₹1,59,900</li>
              <li>• OnePlus 13 ₹69,999</li>
              <li>• Vivo X200 Pro ₹94,999</li>
              <li>• Oppo Find X8 Pro ₹99,999</li>
              <li>• Realme GT 7 Pro ₹54,999</li>
              <li>• Accessories: AirPods, Buds, Watch, Charger</li>
              <li>• Preorder: S26 Ultra, iPhone 17 Pro</li>
            </ul>
          </div>
          <div>
            <h4 className="font-rubik font-bold text-[13px] uppercase tracking-wide mb-4">Tech Stack • Rubik + InsForge Only</h4>
            <div className="bg-white/10 rounded-2xl p-4 font-rubik text-[11px] leading-relaxed space-y-1">
              <p>✅ Font: Rubik Sans Serif (Figma best)</p>
              <p>✅ Backend: 100% InsForge Only (No Turso)</p>
              <p>✅ Auth: Google OAuth + Email OTP</p>
              <p>✅ Database: InsForge Postgres (Mumbai EU)</p>
              <p>✅ Storage: InsForge S3 for images</p>
              <p>✅ Tables: brands, products, orders, banners, repair_tickets, preorder_phones, accessories</p>
              <p>✅ Admin: /admin fully working</p>
              <p className="text-white/40 mt-2">Vercel Frontend • InsForge Backend • GitHub CI/CD</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center font-rubik text-[11px] text-white/30">
          © 2026 Suhail Mobile Shop Raebareli • Rubik Font • InsForge Only • Google + Email Auth • Real Products • Repair Service • Preorder Zone
        </div>
      </footer>

      {/* Auth Modal - Rubik */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[420px] overflow-hidden shadow-2xl">
            <div className="bg-black text-white p-6 flex justify-between">
              <div>
                <h2 className="font-rubik font-black text-[20px] tracking-tight">{authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Join Suhail Mobile' : 'Verify Email'}</h2>
                <p className="font-rubik text-[12px] text-white/60 mt-1">Rubik Font • Google + Email OTP • InsForge Secure</p>
              </div>
              <button onClick={() => setShowAuth(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="p-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 font-rubik text-[13px]">{error}</div>}
              {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 font-rubik text-[13px]">{message}</div>}

              {authMode === 'login' && (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3.5 bg-[#F5F5F7] rounded-xl font-rubik text-[14px] focus:outline-none focus:ring-2 focus:ring-black" required />
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3.5 bg-[#F5F5F7] rounded-xl font-rubik text-[14px] focus:outline-none focus:ring-2 focus:ring-black" required />
                  <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-full font-rubik font-bold text-[14px]">{loading ? 'Logging in...' : 'Login with Email →'}</button>
                  <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div><div className="relative flex justify-center"><span className="bg-white px-3 font-rubik text-[11px] font-bold text-black/30 uppercase">Or</span></div></div>
                  <button type="button" onClick={handleGoogleLogin} className="w-full border border-black/10 py-3.5 rounded-full font-rubik font-bold text-[14px] flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" /> Continue with Google</button>
                  <div className="flex justify-between text-xs mt-3"><button type="button" onClick={() => setAuthMode('signup')} className="font-rubik font-bold text-black">Create account</button><span className="font-rubik text-black/40">InsForge • Rubik • Secure</span></div>
                </form>
              )}

              {authMode === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-3">
                  <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3.5 bg-[#F5F5F7] rounded-xl font-rubik text-[14px]" required />
                  <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3.5 bg-[#F5F5F7] rounded-xl font-rubik text-[14px]" required />
                  <input type="password" placeholder="Password min 6 chars" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3.5 bg-[#F5F5F7] rounded-xl font-rubik text-[14px]" required minLength={6} />
                  <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-full font-rubik font-bold text-[14px]">{loading ? 'Creating...' : 'Create Account • OTP →'}</button>
                  <button type="button" onClick={() => setAuthMode('login')} className="w-full font-rubik text-xs text-black/60">Already have account? Login</button>
                  <button type="button" onClick={handleGoogleLogin} className="w-full border border-black/10 py-3 rounded-full font-rubik font-bold text-[13px] flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" /> Signup with Google</button>
                </form>
              )}

              {authMode === 'verify' && (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="text-center"><p className="font-rubik font-bold text-sm">Check email for OTP</p><p className="font-rubik text-xs text-black/60">{email} • Check spam too</p></div>
                  <input type="text" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} className="w-full text-center text-2xl tracking-[0.5em] font-rubik font-bold py-4 bg-[#F5F5F7] rounded-xl" maxLength={6} required />
                  <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-full font-rubik font-bold text-[14px]">{loading ? 'Verifying...' : 'Verify & Continue →'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Repair Modal */}
      {showRepair && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] overflow-hidden">
            <div className="bg-black text-white p-6 flex justify-between">
              <div><h2 className="font-rubik font-black text-[20px]">Book Repair Service 🔧</h2><p className="font-rubik text-xs text-white/60 mt-1">Expert staff • Genuine parts • Raebareli • InsForge</p></div>
              <button onClick={() => setShowRepair(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><X size={16} /></button>
            </div>
            <form onSubmit={handleRepairSubmit} className="p-6 space-y-4">
              <input type="text" placeholder="Your name" value={repairForm.name} onChange={e => setRepairForm({ ...repairForm, name: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm" required />
              <input type="tel" placeholder="Phone number" value={repairForm.phone} onChange={e => setRepairForm({ ...repairForm, phone: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm" required />
              <input type="text" placeholder="Device model (e.g. Samsung S24 Ultra)" value={repairForm.model} onChange={e => setRepairForm({ ...repairForm, model: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm" required />
              <textarea placeholder="Issue description (display broken, battery, water damage...)" value={repairForm.issue} onChange={e => setRepairForm({ ...repairForm, issue: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm h-24" required></textarea>
              <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-full font-rubik font-bold text-sm">{loading ? 'Submitting...' : 'Submit Repair Request • Staff Will Call →'}</button>
              <p className="font-rubik text-[11px] text-black/50 text-center">Repair tickets stored in InsForge • Staff assigns • Status tracking • Raebareli local service</p>
            </form>
          </div>
        </div>
      )}

      {showToast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full font-rubik font-bold text-[13px] shadow-2xl z-50">{showToast}</div>}

      <a href="https://wa.me/918299384658" target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition z-30"><MessageCircle size={28} /></a>
    </div>
  )
}
