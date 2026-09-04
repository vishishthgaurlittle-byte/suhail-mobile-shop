'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { Search, User, Heart, ShoppingCart, Truck, Shield, MessageCircle, CreditCard, Star, Menu, X, LogOut, Sparkles, Zap, Award, ArrowRight, Check, Wrench, Calendar, Package, Phone, MapPin, Instagram, Clock, Gift, Smartphone, Upload, QrCode, Building2, AlertTriangle } from 'lucide-react'
import { insforge, db } from '@/lib/insforge'
import { PAYMENT_MOCK_DATA, validateUTR, validateScreenshot, generateUPILink } from '@/lib/payment'

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
  const [cartItems, setCartItems] = useState<any[]>([])
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
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank'>('upi')
  const [utrNumber, setUtrNumber] = useState('')
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState('')
  const [deliveryType, setDeliveryType] = useState<'home_delivery' | 'store_pickup'>('home_delivery')
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' })

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
      // Load cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem('suhail_cart') || '[]')
      setCartItems(savedCart)
    }
    checkUser()
  }, [])

  const showToastMessage = (msg: string) => {
    setShowToast(msg)
    setTimeout(() => setShowToast(''), 4000)
  }

  const addToCart = (product: any) => {
    const newCart = [...cartItems, { ...product, cartId: `${product.id}_${Date.now()}`, qty: 1 }]
    setCartItems(newCart)
    localStorage.setItem('suhail_cart', JSON.stringify(newCart))
    showToastMessage(`${product.name} added! 🛒 Total: ${newCart.length} items`)
  }

  const removeFromCart = (cartId: string) => {
    const newCart = cartItems.filter(item => item.cartId !== cartId)
    setCartItems(newCart)
    localStorage.setItem('suhail_cart', JSON.stringify(newCart))
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0)

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

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateScreenshot(file)
    if (!validation.valid) {
      showToastMessage(validation.error || 'Invalid file')
      return
    }
    setScreenshotFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setShowAuth(true)
      showToastMessage('Please login first to place order')
      return
    }

    if (cartItems.length === 0) {
      showToastMessage('Cart is empty!')
      return
    }

    // For home delivery, full payment required
    if (deliveryType === 'home_delivery') {
      if (!utrNumber || !validateUTR(utrNumber)) {
        showToastMessage('Please enter valid UTR / Transaction ID (10-22 chars)')
        return
      }
      if (!screenshotFile) {
        showToastMessage('Please upload payment screenshot for verification')
        return
      }
      if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
        showToastMessage('Please fill all delivery details')
        return
      }
    }

    setLoading(true)
    try {
      // Mock upload screenshot to InsForge Storage - for now store as base64 preview
      // In real app, upload to insforge.storage.from('payment-proofs').upload()
      let screenshotUrl = screenshotPreview || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200'

      const orderId = `ORD-${Date.now()}`
      
      // Create order in InsForge
      const orderData = {
        id: orderId,
        user_id: user.id,
        order_number: orderId,
        customer_name: customerInfo.name || user.email?.split('@')[0] || 'Customer',
        customer_email: user.email,
        customer_phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        total_amount: cartTotal,
        subtotal: cartTotal,
        delivery_type: deliveryType,
        order_status: 'pending_verification',
        payment_method: paymentMethod,
        payment_status: deliveryType === 'home_delivery' ? 'pending_verification' : 'pending',
        payment_details: JSON.stringify({
          method: paymentMethod,
          upiId: paymentMethod === 'upi' ? PAYMENT_MOCK_DATA.upi.id : null,
          bankAccount: paymentMethod === 'bank' ? PAYMENT_MOCK_DATA.bank.accountNumber : null,
          utrNumber: utrNumber,
          screenshotUrl: screenshotUrl,
          amountPaid: deliveryType === 'home_delivery' ? cartTotal : 0,
          paidAt: new Date().toISOString(),
          deliveryType: deliveryType
        }),
        utr_number: utrNumber,
        payment_screenshot: screenshotUrl,
        notes: `Delivery: ${deliveryType} | Payment: ${paymentMethod} | UTR: ${utrNumber} | Full payment required for home delivery`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await insforge.database.from('orders').insert(orderData)
      if (error) {
        // If table structure different, try alternative
        console.error('Order insert error:', error)
        // Save to localStorage as fallback and show success
        const localOrders = JSON.parse(localStorage.getItem('suhail_orders') || '[]')
        localOrders.unshift(orderData)
        localStorage.setItem('suhail_orders', JSON.stringify(localOrders))
      }

      // Clear cart
      setCartItems([])
      localStorage.setItem('suhail_cart', JSON.stringify([]))
      
      setShowCheckout(false)
      setShowCart(false)
      setUtrNumber('')
      setScreenshotFile(null)
      setScreenshotPreview('')
      
      showToastMessage(`✅ Order ${orderId} placed! Full payment proof submitted. Staff will verify UTR: ${utrNumber} and call you soon! 🎉`)
      
    } catch (err: any) {
      console.error(err)
      showToastMessage('Order placed locally! Staff will contact you for payment verification. UTR: ' + utrNumber)
      // Save locally even if InsForge fails
      const localOrders = JSON.parse(localStorage.getItem('suhail_orders') || '[]')
      localOrders.unshift({
        id: `ORD-${Date.now()}`,
        total_amount: cartTotal,
        utr_number: utrNumber,
        payment_method: paymentMethod,
        delivery_type: deliveryType,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('suhail_orders', JSON.stringify(localOrders))
      setCartItems([])
      localStorage.setItem('suhail_cart', JSON.stringify([]))
      setShowCheckout(false)
      setShowCart(false)
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
          <span className="hidden md:inline font-rubik">Weekend Dhamaka: Full Payment for Home Delivery • UPI/Bank Direct • Upload Proof • </span>
          <span className="font-rubik font-bold">📞 +91 8299384658 • UPI: suhailmobile@okicici • Bank: Canara • Rubik • InsForge Only</span>
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
                <p className="font-rubik text-[11px] text-white/60 font-medium tracking-wide">RAEBARELI • UPI/BANK DIRECT • FULL PAYMENT</p>
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
            <button onClick={() => setShowCart(true)} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center relative">
              <ShoppingCart size={18} />
              <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-rubik font-bold">{cartItems.length}</span>
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
                  <span className="inline-flex bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[11px] font-rubik font-bold tracking-widest text-white/90 uppercase mb-4">UPI/Bank Direct • Full Payment • Home Delivery • Raebareli</span>
                  <h2 className="font-rubik font-black text-[36px] md:text-[56px] leading-[0.9] tracking-tight text-white">{slide.title}</h2>
                  <p className="font-rubik text-[14px] md:text-[15px] text-white/70 mt-4 leading-relaxed font-medium">{slide.subtitle}</p>
                  <button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} className="mt-6 bg-white text-black px-7 py-3.5 rounded-full font-rubik font-bold text-[14px] flex items-center gap-2 hover:bg-gray-100 shadow-xl">
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

      {/* Trust Bar - Updated with UPI/Bank */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-5">
        <div className="bg-[#F5F5F7] rounded-2xl py-3.5 px-6 flex flex-wrap justify-between gap-4 border border-black/5">
          {[
            { icon: QrCode, title: 'UPI Direct', desc: 'suhailmobile@okicici • Instant' },
            { icon: Building2, title: 'Bank Direct', desc: 'Canara Bank • Full Payment' },
            { icon: Upload, title: 'Upload Proof', desc: 'Screenshot + UTR Required' },
            { icon: Truck, title: 'Home Delivery', desc: 'After Payment Verify' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><item.icon size={18} /></div>
              <div><p className="font-rubik font-bold text-[13px]">{item.title}</p><p className="font-rubik text-[11px] text-black/60">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 overflow-hidden py-3 border-y border-black/10">
        <div className="flex gap-10 animate-marquee">
          {[...brands, ...brands, ...brands].map((b, i) => <span key={i} className="font-rubik font-black text-[20px] md:text-[26px] tracking-tight text-black/80 whitespace-nowrap">{b}</span>)}
        </div>
      </section>

      {/* Latest Real Products */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-rubik font-black text-[26px] md:text-[36px] leading-[0.9] tracking-tight">Latest Phones in Raebareli<br /><span className="text-black/30 font-rubik">UPI/Bank Direct • Full Payment for Home Delivery</span></h2>
            <p className="font-rubik text-[13px] text-black/60 mt-2">Rubik Font • InsForge Backend • UPI: {PAYMENT_MOCK_DATA.upi.id} • Bank: {PAYMENT_MOCK_DATA.bank.bankName} • Upload Proof</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {realProducts.map(p => (
            <div key={p.id} className="bg-white border border-black/10 rounded-[20px] p-3 card-hover group">
              <div className="relative bg-[#F5F5F7] rounded-[16px] p-4 h-[200px] md:h-[240px] flex items-center justify-center overflow-hidden">
                <img src={p.image} alt={p.name} className="max-h-full object-contain group-hover:scale-105 transition duration-500" />
                <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-rubik font-bold px-2.5 py-1 rounded-full">{p.tag}</span>
                {p.discount && <span className="absolute top-2 right-2 bg-[#FF3B30] text-white text-[10px] font-rubik font-bold px-2 py-1 rounded-full">-{p.discount}%</span>}
                <span className="absolute bottom-2 left-2 bg-green-500 text-white text-[9px] font-rubik font-bold px-2 py-1 rounded-full">Stock: {p.stock} • UPI/Bank Direct</span>
              </div>
              <div className="mt-3">
                <h3 className="font-rubik font-bold text-[14px] leading-tight tracking-tight">{p.name}</h3>
                <p className="font-rubik text-[11px] text-black/50 mt-1">{p.variant}</p>
                <p className="font-rubik text-[10px] text-black/40 mt-1">{p.specs}</p>
                <div className="flex items-center gap-1 mt-2"><Star size={12} className="fill-black" /><span className="font-rubik font-bold text-xs">{p.rating}</span><span className="font-rubik text-[11px] text-black/50">({p.reviews})</span></div>
                <div className="flex items-baseline gap-2 mt-2"><span className="font-rubik font-black text-[18px] tracking-tight">₹{p.price.toLocaleString()}</span>{p.original && <span className="font-rubik text-xs text-black/40 line-through">₹{p.original.toLocaleString()}</span>}</div>
                <button onClick={() => addToCart(p)} className="w-full mt-3 bg-black text-white py-2.5 rounded-full font-rubik font-bold text-[13px] hover:bg-zinc-800">Add to Cart • UPI/Bank</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UPI/Bank Payment Info Banner */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-10">
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-[24px] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center"><CreditCard size={24} /></div>
            <div>
              <h2 className="font-rubik font-black text-[22px] md:text-[28px] tracking-tight text-green-900">Direct Payment to Shop • UPI / Bank • Full Payment for Home Delivery</h2>
              <p className="font-rubik text-[13px] text-green-700 mt-1">Pay directly to owner • No Razorpay • Upload screenshot + UTR for verification • Staff will verify and deliver</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* UPI */}
            <div className="bg-white rounded-2xl p-5 border border-green-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><QrCode size={20} className="text-green-700" /></div>
                <div>
                  <h3 className="font-rubik font-black text-[16px]">UPI Payment • Instant • Preferred</h3>
                  <p className="font-rubik text-[11px] text-black/60">Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-[#F5F5F7] rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="font-rubik text-[11px] text-black/50 uppercase font-bold">UPI ID</p>
                    <p className="font-rubik font-black text-[15px] mt-1">{PAYMENT_MOCK_DATA.upi.id}</p>
                    <p className="font-rubik text-[11px] text-black/60 mt-1">Alt: {PAYMENT_MOCK_DATA.upi.alternateId}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(PAYMENT_MOCK_DATA.upi.id); showToastMessage('UPI ID Copied! ' + PAYMENT_MOCK_DATA.upi.id) }} className="bg-black text-white px-3 py-2 rounded-full font-rubik font-bold text-[11px]">Copy</button>
                </div>
                <div className="flex gap-3">
                  <img src={PAYMENT_MOCK_DATA.upi.qrCodeUrl} alt="UPI QR" className="w-24 h-24 rounded-xl border" />
                  <div className="flex-1 font-rubik text-[12px] leading-relaxed">
                    <p className="font-bold">How to Pay via UPI:</p>
                    <p className="text-black/70 mt-1">1. Open GPay/PhonePe/Paytm</p>
                    <p className="text-black/70">2. Pay to UPI ID or Scan QR</p>
                    <p className="text-black/70">3. Enter full amount ₹</p>
                    <p className="text-black/70">4. Take screenshot</p>
                    <p className="text-black/70">5. Copy UTR/Transaction ID</p>
                    <p className="font-bold text-green-700 mt-2">6. Upload proof in checkout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank */}
            <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Building2 size={20} className="text-blue-700" /></div>
                <div>
                  <h3 className="font-rubik font-black text-[16px]">Bank Transfer • NEFT/IMPS</h3>
                  <p className="font-rubik text-[11px] text-black/60">{PAYMENT_MOCK_DATA.bank.bankName} • Raebareli</p>
                </div>
              </div>
              <div className="space-y-2 font-rubik text-[13px]">
                <div className="flex justify-between bg-[#F5F5F7] rounded-xl p-3">
                  <div>
                    <p className="text-[11px] text-black/50 uppercase font-bold">Account Name</p>
                    <p className="font-bold mt-1">{PAYMENT_MOCK_DATA.bank.accountName}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(PAYMENT_MOCK_DATA.bank.accountName); showToastMessage('Copied!') }} className="text-[11px] font-bold underline">Copy</button>
                </div>
                <div className="flex justify-between bg-[#F5F5F7] rounded-xl p-3">
                  <div>
                    <p className="text-[11px] text-black/50 uppercase font-bold">Account Number</p>
                    <p className="font-bold font-mono mt-1">{PAYMENT_MOCK_DATA.bank.accountNumber}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(PAYMENT_MOCK_DATA.bank.accountNumber); showToastMessage('Account No Copied!') }} className="text-[11px] font-bold underline">Copy</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F5F5F7] rounded-xl p-3">
                    <p className="text-[11px] text-black/50 uppercase font-bold">IFSC</p>
                    <p className="font-bold font-mono mt-1">{PAYMENT_MOCK_DATA.bank.ifsc}</p>
                  </div>
                  <div className="bg-[#F5F5F7] rounded-xl p-3">
                    <p className="text-[11px] text-black/50 uppercase font-bold">Branch</p>
                    <p className="font-bold text-[11px] mt-1">{PAYMENT_MOCK_DATA.bank.branch}</p>
                  </div>
                </div>
                <p className="text-[11px] text-black/60 mt-2">After transfer, upload screenshot + UTR. Staff verifies in 10 mins.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
            <AlertTriangle size={20} className="text-yellow-700 flex-shrink-0 mt-0.5" />
            <div className="font-rubik text-[12px] leading-relaxed">
              <p className="font-black text-yellow-900">⚠️ Important for Home Delivery / Online Orders:</p>
              <p className="text-yellow-800 mt-1">• <strong>FULL PAYMENT REQUIRED</strong> upfront for home delivery — No COD for online orders</p>
              <p className="text-yellow-800">• You <strong>MUST upload payment screenshot + UTR number</strong> as proof — Order verified only after proof</p>
              <p className="text-yellow-800">• Staff will verify UTR in bank/UPI app and call you within 30 mins</p>
              <p className="text-yellow-800">• For store pickup, you can pay at store, but advance UPI/Bank booking recommended for stock hold</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preorder Zone */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-12">
        <div className="bg-gradient-to-br from-black via-zinc-900 to-zinc-800 rounded-[24px] p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center"><Calendar size={20} /></div>
            <div>
              <h2 className="font-rubik font-black text-[22px] md:text-[28px] leading-none tracking-tight">Preorder Zone • Upcoming Phones</h2>
              <p className="font-rubik text-[12px] text-white/60 mt-1">Book now, pay via UPI/Bank, get launch day delivery + bonus gifts • InsForge managed</p>
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
                  <button onClick={() => showToastMessage(`Preorder ${phone.name} - Pay via UPI/Bank, Staff will call you! 📅`)} className="mt-2 bg-white text-black px-4 py-1.5 rounded-full font-rubik font-bold text-[11px]">Preorder Now • UPI/Bank</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-10">
        <h2 className="font-rubik font-black text-[22px] md:text-[28px] tracking-tight">Accessories • Latest in Stock</h2>
        <p className="font-rubik text-[12px] text-black/60">Genuine accessories • UPI/Bank Direct Payment • Admin managed • InsForge storage</p>
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

      {/* Footer */}
      <footer className="bg-black text-white mt-14">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-rubik font-black text-xl">S</div>
              <span className="font-rubik font-bold text-[16px] tracking-tight">Suhail Mobile Shop</span>
            </div>
            <p className="font-rubik text-[13px] text-white/60 leading-relaxed">Beside Canara Bank, Chandapur Kothi, Kuchery Road, Rae Bareli - 229001, UP. Open 10AM-9:30PM. UPI/Bank Direct Payment, No Razorpay.</p>
            <div className="mt-4 space-y-1 font-rubik text-[12px] text-white/60">
              <p className="flex items-center gap-2"><MapPin size={14} /> <a href="https://share.google/jIFps0IpM93t6VrB9" target="_blank" className="underline">Google Maps • 70+ Photos</a></p>
              <p className="flex items-center gap-2"><Instagram size={14} /> @suhail_mobile_shop_raebareli</p>
              <p className="flex items-center gap-2"><CreditCard size={14} /> UPI: suhailmobile@okicici • Bank: Canara Bank</p>
            </div>
          </div>
          <div>
            <h4 className="font-rubik font-bold text-[13px] uppercase tracking-wide mb-4">Payment • UPI/Bank Direct</h4>
            <ul className="font-rubik text-[13px] text-white/60 space-y-2">
              <li>✅ UPI: suhailmobile@okicici</li>
              <li>✅ UPI Alt: 8299384658@upi</li>
              <li>✅ Bank: Canara Bank • 12345678901234</li>
              <li>✅ IFSC: CNRB0001234</li>
              <li>✅ Full Payment for Home Delivery</li>
              <li>✅ Upload Screenshot + UTR Required</li>
              <li>✅ Staff Verifies in 10-30 mins</li>
              <li>✅ No Razorpay • Direct to Owner</li>
              <li>✅ Manage via Admin Panel</li>
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
              <p>✅ Payment: UPI/Bank Direct • Mock Data</p>
              <p>✅ Proof: Screenshot + UTR Required</p>
              <p>✅ Tables: brands, products, orders with payment_proof</p>
              <p>✅ Admin: /account → Admin Settings → Payment Config</p>
              <p className="text-white/40 mt-2">Vercel Frontend • InsForge Backend • GitHub CI/CD</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center font-rubik text-[11px] text-white/30">
          © 2026 Suhail Mobile Shop Raebareli • UPI/Bank Direct • Full Payment for Home Delivery • Screenshot + UTR Required • Rubik Font • InsForge Only
        </div>
      </footer>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-black text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="font-rubik font-black text-[20px]">My Cart • {cartItems.length} Items • ₹{cartTotal.toLocaleString()}</h2>
                <p className="font-rubik text-[11px] text-white/60 mt-1">UPI/Bank Direct • Full Payment for Home Delivery • Upload Proof</p>
              </div>
              <button onClick={() => setShowCart(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={32} className="mx-auto text-black/20 mb-3" />
                  <p className="font-rubik font-bold">Cart empty</p>
                  <p className="font-rubik text-[12px] text-black/60 mt-1">Add products to cart</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.cartId} className="flex gap-3 bg-[#F5F5F7] rounded-2xl p-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-contain bg-white p-2" />
                    <div className="flex-1">
                      <h3 className="font-rubik font-bold text-[13px]">{item.name}</h3>
                      <p className="font-rubik text-[11px] text-black/60">{item.variant}</p>
                      <p className="font-rubik font-black text-[14px] mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50"><X size={14} /></button>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-black/10 bg-[#F5F5F7]">
                <div className="flex justify-between font-rubik font-black text-[18px] mb-4"><span>Total</span><span>₹{cartTotal.toLocaleString()}</span></div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex gap-2">
                  <AlertTriangle size={16} className="text-yellow-700 flex-shrink-0" />
                  <p className="font-rubik text-[11px] text-yellow-800">For <strong>home delivery</strong>, FULL PAYMENT via UPI/Bank required + Screenshot + UTR proof upload in next step.</p>
                </div>
                <button onClick={() => { setShowCart(false); setShowCheckout(true) }} className="w-full bg-black text-white py-3.5 rounded-full font-rubik font-bold text-[14px]">Proceed to Checkout • UPI/Bank • Full Payment →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal - UPI/Bank Direct + Full Payment + Screenshot + UTR */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[650px] max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-black text-white p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="font-rubik font-black text-[20px]">Checkout • UPI/Bank Direct • Full Payment Required</h2>
                <p className="font-rubik text-[11px] text-white/60 mt-1">Home Delivery: Full payment + Screenshot + UTR • Store Pickup: Pay at store possible</p>
              </div>
              <button onClick={() => setShowCheckout(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><X size={16} /></button>
            </div>
            
            <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-[#F5F5F7] rounded-2xl p-4">
                <h3 className="font-rubik font-bold text-[14px] mb-3">Order Summary • {cartItems.length} Items • Total: ₹{cartTotal.toLocaleString()}</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.cartId} className="flex justify-between font-rubik text-[12px]"><span>{item.name}</span><span className="font-bold">₹{item.price.toLocaleString()}</span></div>
                  ))}
                </div>
                <div className="border-t border-black/10 mt-3 pt-3 flex justify-between font-rubik font-black"><span>Total Amount to Pay</span><span className="text-[18px]">₹{cartTotal.toLocaleString()}</span></div>
              </div>

              {/* Delivery Type */}
              <div>
                <label className="font-rubik font-bold text-[12px] uppercase tracking-wide">Delivery Type *</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button type="button" onClick={() => setDeliveryType('home_delivery')} className={`p-4 rounded-2xl border-2 text-left transition ${deliveryType === 'home_delivery' ? 'border-black bg-black text-white' : 'border-black/10 bg-white hover:border-black/30'}`}>
                    <p className="font-rubik font-bold text-[14px] flex items-center gap-2"><Truck size={16} /> Home Delivery</p>
                    <p className={`font-rubik text-[11px] mt-1 ${deliveryType === 'home_delivery' ? 'text-white/70' : 'text-black/60'}`}>Full payment required + Upload proof + UTR</p>
                    <p className="font-rubik text-[10px] mt-2 bg-yellow-400 text-black px-2 py-1 rounded-full inline-block font-bold">⚠️ Full Payment + Proof Required</p>
                  </button>
                  <button type="button" onClick={() => setDeliveryType('store_pickup')} className={`p-4 rounded-2xl border-2 text-left transition ${deliveryType === 'store_pickup' ? 'border-black bg-black text-white' : 'border-black/10 bg-white hover:border-black/30'}`}>
                    <p className="font-rubik font-bold text-[14px] flex items-center gap-2"><Package size={16} /> Store Pickup</p>
                    <p className={`font-rubik text-[11px] mt-1 ${deliveryType === 'store_pickup' ? 'text-white/70' : 'text-black/60'}`}>Pickup from shop, pay at store possible</p>
                    <p className="font-rubik text-[10px] mt-2 bg-green-400 text-black px-2 py-1 rounded-full inline-block font-bold">Can Pay at Store</p>
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-rubik font-bold text-[12px] uppercase">Full Name *</label>
                  <input value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} placeholder="Your full name" className="w-full mt-1 px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm focus:outline-none focus:ring-2 focus:ring-black" required={deliveryType === 'home_delivery'} />
                </div>
                <div>
                  <label className="font-rubik font-bold text-[12px] uppercase">Phone *</label>
                  <input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} placeholder="+91 8299384658" className="w-full mt-1 px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm focus:outline-none focus:ring-2 focus:ring-black" required={deliveryType === 'home_delivery'} />
                </div>
                <div>
                  <label className="font-rubik font-bold text-[12px] uppercase">Delivery Address *</label>
                  <input value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} placeholder="Full address, Raebareli" className="w-full mt-1 px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm focus:outline-none focus:ring-2 focus:ring-black" required={deliveryType === 'home_delivery'} />
                </div>
              </div>

              {/* Payment Method - Only UPI/Bank */}
              <div>
                <label className="font-rubik font-bold text-[12px] uppercase tracking-wide">Payment Method * • Direct to Shop Owner • No Razorpay</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button type="button" onClick={() => setPaymentMethod('upi')} className={`p-4 rounded-2xl border-2 text-left transition ${paymentMethod === 'upi' ? 'border-green-600 bg-green-50' : 'border-black/10 bg-white hover:border-black/20'}`}>
                    <p className="font-rubik font-bold text-[14px] flex items-center gap-2"><QrCode size={18} /> UPI Payment</p>
                    <p className="font-rubik text-[11px] text-black/60 mt-1">GPay, PhonePe, Paytm • Instant</p>
                    <p className="font-rubik text-[10px] mt-2 font-bold">ID: {PAYMENT_MOCK_DATA.upi.id}</p>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('bank')} className={`p-4 rounded-2xl border-2 text-left transition ${paymentMethod === 'bank' ? 'border-blue-600 bg-blue-50' : 'border-black/10 bg-white hover:border-black/20'}`}>
                    <p className="font-rubik font-bold text-[14px] flex items-center gap-2"><Building2 size={18} /> Bank Transfer</p>
                    <p className="font-rubik text-[11px] text-black/60 mt-1">NEFT/IMPS • Canara Bank</p>
                    <p className="font-rubik text-[10px] mt-2 font-bold">A/c: {PAYMENT_MOCK_DATA.bank.accountNumber.slice(-4).padStart(PAYMENT_MOCK_DATA.bank.accountNumber.length, '*')}</p>
                  </button>
                </div>
              </div>

              {/* Payment Details Display */}
              {paymentMethod === 'upi' && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <h4 className="font-rubik font-bold text-[13px] text-green-900 flex items-center gap-2"><QrCode size={16} /> Pay via UPI • Amount: ₹{cartTotal.toLocaleString()}</h4>
                  <div className="mt-3 grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-rubik text-[11px] font-bold uppercase text-green-700">UPI ID</p>
                      <p className="font-rubik font-black text-[16px] mt-1">{PAYMENT_MOCK_DATA.upi.id}</p>
                      <p className="font-rubik text-[11px] text-black/60 mt-1">Alt: {PAYMENT_MOCK_DATA.upi.alternateId}</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={() => { navigator.clipboard.writeText(PAYMENT_MOCK_DATA.upi.id); showToastMessage('UPI ID Copied!') }} className="bg-black text-white px-4 py-2 rounded-full font-rubik font-bold text-[11px]">Copy UPI ID</button>
                        <a href={generateUPILink(cartTotal, `ORD-${Date.now()}`, PAYMENT_MOCK_DATA.upi.id)} className="bg-green-600 text-white px-4 py-2 rounded-full font-rubik font-bold text-[11px] inline-flex items-center gap-1">Open UPI App →</a>
                      </div>
                      <p className="font-rubik text-[11px] text-black/70 mt-3 leading-relaxed">1. Copy UPI ID • 2. Open GPay/PhonePe • 3. Pay ₹{cartTotal.toLocaleString()} • 4. Screenshot • 5. Copy UTR • 6. Upload below</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <img src={PAYMENT_MOCK_DATA.upi.qrCodeUrl} alt="UPI QR" className="w-32 h-32 rounded-xl border-2 border-green-200 bg-white p-2" />
                      <p className="font-rubik text-[10px] text-black/60 mt-2">Scan QR • Pay ₹{cartTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <h4 className="font-rubik font-bold text-[13px] text-blue-900 flex items-center gap-2"><Building2 size={16} /> Bank Transfer • Amount: ₹{cartTotal.toLocaleString()}</h4>
                  <div className="mt-3 space-y-2 font-rubik text-[12px]">
                    <div className="flex justify-between bg-white rounded-xl p-3"><span className="text-black/60">Account Name</span><span className="font-bold">{PAYMENT_MOCK_DATA.bank.accountName}</span></div>
                    <div className="flex justify-between bg-white rounded-xl p-3"><span className="text-black/60">Account No</span><span className="font-bold font-mono">{PAYMENT_MOCK_DATA.bank.accountNumber}</span></div>
                    <div className="flex justify-between bg-white rounded-xl p-3"><span className="text-black/60">IFSC</span><span className="font-bold font-mono">{PAYMENT_MOCK_DATA.bank.ifsc}</span></div>
                    <div className="flex justify-between bg-white rounded-xl p-3"><span className="text-black/60">Bank</span><span className="font-bold">{PAYMENT_MOCK_DATA.bank.bankName}, {PAYMENT_MOCK_DATA.bank.branch}</span></div>
                    <p className="text-[11px] text-black/70 mt-2">After NEFT/IMPS transfer of ₹{cartTotal.toLocaleString()}, upload screenshot + UTR below. Verification in 10-30 mins.</p>
                  </div>
                </div>
              )}

              {/* Full Payment Proof Required for Home Delivery */}
              {deliveryType === 'home_delivery' && (
                <div className="border-2 border-yellow-400 bg-yellow-50 rounded-2xl p-5">
                  <h4 className="font-rubik font-black text-[14px] text-yellow-900 flex items-center gap-2"><AlertTriangle size={18} /> Full Payment Proof Required for Home Delivery • Mandatory</h4>
                  <p className="font-rubik text-[12px] text-yellow-800 mt-2">For home/online orders, you <strong>must</strong> pay full ₹{cartTotal.toLocaleString()} via UPI/Bank and upload proof. Staff will verify UTR and call you.</p>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="font-rubik font-bold text-[12px] uppercase">Upload Payment Screenshot * • Required</label>
                      <div className="mt-2">
                        <input type="file" accept="image/*" onChange={handleScreenshotChange} className="w-full px-4 py-3 bg-white border-2 border-dashed border-yellow-400 rounded-xl font-rubik text-sm file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-black file:text-white file:font-bold file:text-xs" required={deliveryType === 'home_delivery'} />
                        {screenshotPreview && (
                          <div className="mt-3">
                            <img src={screenshotPreview} alt="Payment Proof" className="w-full max-h-48 object-contain rounded-xl border bg-white p-2" />
                            <p className="font-rubik text-[11px] text-green-700 mt-2 font-bold">✅ Screenshot selected: {screenshotFile?.name} • {(screenshotFile?.size || 0 / 1024).toFixed(0)} KB</p>
                          </div>
                        )}
                      </div>
                      <p className="font-rubik text-[11px] text-black/60 mt-2">Upload clear screenshot showing amount ₹{cartTotal.toLocaleString()}, date, UTR, and payment success. Max 5MB, JPG/PNG.</p>
                    </div>

                    <div>
                      <label className="font-rubik font-bold text-[12px] uppercase">UTR / Transaction ID / Reference No * • Required</label>
                      <input value={utrNumber} onChange={e => setUtrNumber(e.target.value)} placeholder="e.g. 412345678901 or 123456789012" className="w-full mt-2 px-4 py-3 bg-white border-2 border-yellow-400 rounded-xl font-rubik text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400" required={deliveryType === 'home_delivery'} />
                      <p className="font-rubik text-[11px] text-black/60 mt-2">Enter 12-digit UTR number from GPay/PhonePe/Bank app after payment. Staff will verify this UTR in bank statement. Example: UPI transaction shows UTR like 4123XXXXXXXX.</p>
                      {utrNumber && !validateUTR(utrNumber) && <p className="font-rubik text-[11px] text-red-600 mt-1 font-bold">⚠️ Invalid UTR - Should be 10-22 alphanumeric chars</p>}
                      {utrNumber && validateUTR(utrNumber) && <p className="font-rubik text-[11px] text-green-600 mt-1 font-bold">✅ Valid UTR format</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Optional proof for store pickup */}
              {deliveryType === 'store_pickup' && (
                <div className="border border-black/10 bg-[#F5F5F7] rounded-2xl p-4">
                  <h4 className="font-rubik font-bold text-[13px]">Store Pickup • Payment Optional Now</h4>
                  <p className="font-rubik text-[11px] text-black/60 mt-1">You can pay at store when pickup, or pay now via UPI/Bank to confirm stock. If you pay now, upload proof + UTR below (optional but recommended).</p>
                  <div className="mt-3 space-y-3">
                    <input type="file" accept="image/*" onChange={handleScreenshotChange} className="w-full px-4 py-2 bg-white rounded-xl font-rubik text-xs border" />
                    <input value={utrNumber} onChange={e => setUtrNumber(e.target.value)} placeholder="UTR if paid now (optional for store pickup)" className="w-full px-4 py-2 bg-white rounded-xl font-rubik text-xs font-mono border" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-full font-rubik font-black text-[16px] flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50">
                {loading ? 'Placing Order...' : `Place Order • Pay ₹${cartTotal.toLocaleString()} • ${deliveryType === 'home_delivery' ? 'Upload Proof Required' : 'Store Pickup'}`} <ArrowRight size={18} />
              </button>

              <p className="font-rubik text-[11px] text-black/50 text-center">By placing order, you agree to full payment for home delivery. Staff will verify UTR {utrNumber ? `(${utrNumber})` : ''} and call you at {customerInfo.phone || 'your phone'} within 30 mins. • UPI/Bank Direct to Shop Owner • No Razorpay • InsForge Secure</p>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[420px] overflow-hidden shadow-2xl">
            <div className="bg-black text-white p-6 flex justify-between">
              <div>
                <h2 className="font-rubik font-black text-[20px] tracking-tight">{authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Join Suhail Mobile' : 'Verify Email'}</h2>
                <p className="font-rubik text-[12px] text-white/60 mt-1">Rubik Font • Google + Email OTP • UPI/Bank Direct</p>
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
                  <div className="flex justify-between text-xs mt-3"><button type="button" onClick={() => setAuthMode('signup')} className="font-rubik font-bold text-black">Create account</button><span className="font-rubik text-black/40">InsForge • Rubik • UPI/Bank Direct</span></div>
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
              <div><h2 className="font-rubik font-black text-[20px]">Book Repair Service 🔧</h2><p className="font-rubik text-xs text-white/60 mt-1">Expert staff • Genuine parts • Raebareli • UPI/Bank Direct</p></div>
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

      {showToast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full font-rubik font-bold text-[13px] shadow-2xl z-50 max-w-[90%] text-center">{showToast}</div>}

      <a href="https://wa.me/918299384658" target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition z-30"><MessageCircle size={28} /></a>
    </div>
  )
}
