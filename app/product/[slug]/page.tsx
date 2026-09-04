'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Search, User, ShoppingCart, Star, ArrowLeft, Check, Shield, Truck, Award, Package, Heart, Share2, Zap, Smartphone, Battery, Camera, Cpu, Monitor, Gift, X, LogOut } from 'lucide-react'
import { insforge, db, authHelpers, REAL_PHONES_2026, REAL_ACCESSORIES_2026 } from '@/lib/insforge'
import LoadingScreen from '@/components/LoadingScreen'

export default function ProductPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showToast, setShowToast] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    loadProduct()
    checkUser()
    loadCart()
  }, [slug])

  const checkUser = async () => {
    try {
      const userData = await authHelpers.getCurrentUserRobust()
      if (userData) {
        setUser(userData)
        const adminCheck = await authHelpers.checkIsAdmin(userData).catch(() => authHelpers.isAdminEmail(userData.email))
        setIsAdmin(adminCheck)
      }
    } catch {}
  }

  const loadCart = () => {
    try {
      const uid = user?.id || authHelpers.getUserFromLocal()?.id
      const key = uid ? `suhail_cart_${uid}` : 'suhail_cart'
      const saved = JSON.parse(localStorage.getItem(key) || localStorage.getItem('suhail_cart') || '[]')
      setCartItems(saved)
    } catch {}
  }

  const loadProduct = async () => {
    setLoading(true)
    try {
      // Try InsForge first by slug
      let prod = null
      try {
        prod = await db.products.getBySlug(slug)
      } catch {}
      
      if (!prod) {
        // Try by id
        try {
          prod = await db.products.getById(slug)
        } catch {}
      }
      
      if (!prod) {
        // Search in REAL_PHONES_2026 fallback - always present
        prod = REAL_PHONES_2026.find(p => p.slug === slug || p.id === slug)
      }
      
      if (!prod) {
        // Search in REAL_ACCESSORIES_2026
        const acc = REAL_ACCESSORIES_2026.find(a => a.id === slug)
        if (acc) {
          prod = {
            id: acc.id,
            name: acc.name,
            slug: acc.id,
            price: acc.price,
            original_price: acc.original_price,
            thumbnail: acc.image_url,
            images: [acc.image_url],
            short_desc: acc.description,
            description: `${acc.name} - ${acc.description}. Genuine product available at Suhail Mobile Shop Raebareli. Best price, warranty, EMI available.`,
            brand_id: acc.brand_id,
            category: acc.category,
            stock: acc.stock,
            rating: 4.8,
            review_count: 234,
            status: 'active',
            specs: {
              Category: acc.category,
              Brand: acc.brand_id,
              Warranty: '1 Year',
              Availability: 'In Stock at Raebareli Store'
            }
          }
        }
      }
      
      if (!prod) {
        // Try all products getAll and find
        try {
          const all = await db.products.getAll()
          prod = all.find((p: any) => p.slug === slug || p.id === slug || p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
        } catch {}
      }

      if (prod) {
        // Parse specs if string
        let specs = prod.specs
        if (typeof specs === 'string') {
          try { specs = JSON.parse(specs) } catch { specs = { Details: specs } }
        }
        // Ensure specs object exists with detailed specifications
        if (!specs || Object.keys(specs).length === 0) {
          specs = {
            Brand: prod.brands?.name || prod.brand_id || 'Premium Brand',
            Model: prod.name,
            Price: `₹${prod.price?.toLocaleString()}`,
            Stock: `${prod.stock} units available`,
            Warranty: '1 Year Official Warranty',
            Availability: 'Available at Suhail Mobile Shop Raebareli',
            Delivery: 'Home Delivery via UPI/Bank Full Payment + Proof',
            Store: 'Beside Canara Bank, Chandapur Kothi, Raebareli'
          }
        }
        prod = { ...prod, specs_parsed: specs }
        setProduct(prod)
      }
    } catch (e) {
      console.error('Load product error:', e)
    } finally {
      setLoading(false)
    }
  }

  const showToastMessage = (msg: string) => {
    setShowToast(msg)
    setTimeout(() => setShowToast(''), 4000)
  }

  const addToCart = () => {
    if (!product) return
    const newCart = [...cartItems]
    for (let i = 0; i < qty; i++) {
      newCart.push({ ...product, cartId: `${product.id}_${Date.now()}_${i}`, qty: 1, image: product.thumbnail })
    }
    setCartItems(newCart)
    const uid = user?.id || authHelpers.getUserFromLocal()?.id
    const cartKey = uid ? `suhail_cart_${uid}` : 'suhail_cart'
    localStorage.setItem(cartKey, JSON.stringify(newCart))
    localStorage.setItem('suhail_cart', JSON.stringify(newCart))
    if (user?.email) localStorage.setItem(`suhail_cart_${user.email}`, JSON.stringify(newCart))
    showToastMessage(`${product.name} x${qty} added! 🛒 Total: ${newCart.length} items`)
  }

  if (loading) {
    return <LoadingScreen message="Loading product..." subMessage={slug} />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-rubik">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">📱</div>
          <h1 className="font-black text-2xl">Product not found</h1>
          <p className="text-black/60 mt-2">Slug: {slug}</p>
          <p className="text-sm text-black/50 mt-1">This product may have been removed or slug changed. Check admin panel products list.</p>
          <button onClick={() => window.location.href = '/'} className="mt-6 bg-black text-white px-6 py-3 rounded-full font-bold">Back to Shop</button>
        </div>
      </div>
    )
  }

  const images = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [product.thumbnail]
  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0

  return (
    <div className="min-h-screen bg-white font-rubik">
      {/* Header */}
      <header className="bg-[#0A0A0A] text-white sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = '/'} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"><ArrowLeft size={18} /></button>
            <div className="flex items-center gap-3">
              <img src="/logo-demo-2.png" alt="Suhail Mobile Shop" className="w-10 h-10 object-contain rounded-xl bg-white" />
              <div>
                <h1 className="font-bold text-[16px] tracking-tight leading-none">Suhail Mobile Shop</h1>
                <p className="text-[11px] text-white/60">RAEBARELI • BEST MOBILE STORE SINCE 2015</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 bg-white/10 rounded-full pl-1 pr-3 py-1">
                <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold">{(user.email || 'U')[0].toUpperCase()}</div>
                <span className="hidden md:block font-semibold text-[13px]">{user.email?.split('@')[0]}</span>
              </div>
            ) : (
              <button onClick={() => window.location.href = '/?login=required'} className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-[13px]">Login</button>
            )}
            <button onClick={() => window.location.href = '/'} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center relative">
              <ShoppingCart size={18} />
              <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartItems.length}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-2 text-[13px] text-black/60 mb-6">
          <button onClick={() => window.location.href = '/'} className="hover:text-black">Home</button>
          <span>/</span>
          <span className="text-black font-bold">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-[#F5F5F7] rounded-[24px] p-8 h-[400px] md:h-[500px] flex items-center justify-center relative overflow-hidden">
              <img src={images[selectedImage] || product.thumbnail} alt={product.name} className="max-h-full max-w-full object-contain drop-shadow-2xl" />
              {discount > 0 && <span className="absolute top-4 left-4 bg-[#FF3B30] text-white text-[12px] font-bold px-3 py-1.5 rounded-full">-{discount}% OFF</span>}
              <span className="absolute top-4 right-4 bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{product.status || 'In Stock'}</span>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 bg-[#F5F5F7] rounded-xl p-2 flex-shrink-0 border-2 ${selectedImage === i ? 'border-black' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full">{product.brands?.name || product.brand_id || 'Premium'}</span>
                <span className="bg-green-100 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full">● {product.stock} in Stock • Raebareli</span>
              </div>
              <h1 className="font-black text-[28px] md:text-[36px] leading-[0.9] tracking-tight">{product.name}</h1>
              <p className="text-[14px] text-black/60 mt-3">{product.short_desc || product.description?.substring(0, 100)}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1"><Star size={16} className="fill-black" /><span className="font-bold">{product.rating || 4.8}</span><span className="text-black/50 text-[13px]">({product.review_count || 234} reviews)</span></div>
                <span className="text-black/20">•</span>
                <span className="text-[13px] text-black/60">SKU: {product.sku || product.id}</span>
              </div>
            </div>

            <div className="bg-[#F5F5F7] rounded-2xl p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-black text-[32px] tracking-tight">₹{product.price?.toLocaleString()}</span>
                {product.original_price && <span className="text-[18px] text-black/40 line-through">₹{product.original_price?.toLocaleString()}</span>}
                {discount > 0 && <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[12px] font-bold">Save ₹{(product.original_price - product.price).toLocaleString()} ({discount}%)</span>}
              </div>
              <p className="text-[12px] text-black/60 mt-2">Inclusive of all taxes • EMI from ₹{(Math.round(product.price / 12)).toLocaleString()}/month • Official Warranty</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#F5F5F7] rounded-full px-4 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold hover:bg-black hover:text-white">-</button>
                <span className="font-bold w-8 text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock || 10, qty + 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold hover:bg-black hover:text-white">+</button>
              </div>
              <button onClick={addToCart} className="flex-1 bg-black text-white py-3.5 rounded-full font-black text-[15px] flex items-center justify-center gap-2 hover:bg-zinc-800 shadow-xl">
                <ShoppingCart size={18} /> Add to Cart • ₹{(product.price * qty).toLocaleString()}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, title: 'Home Delivery', desc: 'UPI/Bank Full Payment + Proof' },
                { icon: Shield, title: '1 Year Warranty', desc: 'Official Brand Warranty' },
                { icon: Package, title: 'Store Pickup', desc: 'Chandapur Kothi, Raebareli' },
                { icon: Award, title: 'Genuine Product', desc: '100% Original • Bill + Box' },
              ].map((item, i) => (
                <div key={i} className="bg-[#F5F5F7] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><item.icon size={16} /></div>
                  <div><p className="font-bold text-[12px]">{item.title}</p><p className="text-[11px] text-black/60">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications - Admin mentioned specs */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-black/10 rounded-[24px] p-6 md:p-8">
              <h2 className="font-black text-[22px] tracking-tight flex items-center gap-2"><Smartphone size={20} /> Product Description</h2>
              <p className="text-[14px] leading-relaxed text-black/70 mt-4">{product.description || product.short_desc || 'Latest genuine mobile phone available at Suhail Mobile Shop Raebareli. Best price, EMI, exchange, repair service. Since 2015.'}</p>
            </div>

            <div className="bg-white border border-black/10 rounded-[24px] p-6 md:p-8">
              <h2 className="font-black text-[22px] tracking-tight flex items-center gap-2"><Cpu size={20} /> Detailed Specifications • Mentioned by Admin</h2>
              <p className="text-[12px] text-black/60 mt-1">All specifications mentioned by admin in product form. Auto-updates when admin edits product.</p>
              
              <div className="mt-6 grid md:grid-cols-2 gap-3">
                {Object.entries(product.specs_parsed || {}).map(([key, value]: any, i) => (
                  <div key={i} className="bg-[#F5F5F7] rounded-xl p-4 flex justify-between gap-4">
                    <span className="font-bold text-[12px] uppercase tracking-wide text-black/50 min-w-[100px]">{key}</span>
                    <span className="font-semibold text-[13px] text-right flex-1">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-black text-white rounded-2xl p-5">
                <h3 className="font-bold text-[14px]">📋 Admin Can Edit Specifications:</h3>
                <p className="text-[12px] text-white/70 mt-2">When you add new product in Admin Panel → Products → Add Product, fill Description, Short Desc, Price, Stock, Brand. For detailed specs, add in Description as JSON or bullet points. Example: RAM, Storage, Processor, Camera, Battery, Display, Network etc. This page auto-shows them. All new products automatically get dedicated page at /product/[slug].</p>
                <div className="mt-3 bg-white/10 rounded-xl p-3 text-[11px] space-y-1">
                  <p>• Product Slug auto-generated from name: e.g. "Samsung Galaxy S25 Ultra" → "samsung-galaxy-s25-ultra-12-512-titanium-black"</p>
                  <p>• Dedicated page: /product/[slug] - works for all new products</p>
                  <p>• Specs field: Admin can add JSON like {`{"RAM":"12GB","Storage":"512GB","Processor":"Snapdragon 8 Elite"}`}</p>
                  <p>• Or simple text specs in description - will show here</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#FFF4E6] border border-orange-200 rounded-[24px] p-6">
              <h3 className="font-black text-[16px]">🏪 Visit Store • Raebareli</h3>
              <p className="text-[13px] text-black/70 mt-2">Beside Canara Bank, Chandapur Kothi, Kuchery Road, Rae Bareli - 229001</p>
              <p className="text-[12px] mt-3">📞 +91 8299384658</p>
              <p className="text-[12px]">⏰ 10AM - 9:30PM • 7 Days Open</p>
              <button onClick={() => window.location.href = '/'} className="mt-4 w-full bg-black text-white py-2.5 rounded-full font-bold text-[13px]">View More Products</button>
            </div>

            <div className="bg-white border border-black/10 rounded-[24px] p-6">
              <h3 className="font-bold text-[14px]">💳 Payment Options</h3>
              <div className="mt-3 space-y-2 text-[12px]">
                <div className="flex justify-between bg-[#F5F5F7] p-3 rounded-xl"><span>UPI</span><span className="font-bold">suhailmobile@okicici</span></div>
                <div className="flex justify-between bg-[#F5F5F7] p-3 rounded-xl"><span>Bank</span><span className="font-bold">Canara • Full Payment</span></div>
                <p className="text-[11px] text-black/60 mt-2">Full payment + Screenshot + UTR required for home delivery. Staff verifies in 10-30 mins.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-black text-white mt-12 py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo-demo-2.png" alt="Logo" className="w-10 h-10 rounded-xl bg-white object-contain" />
            <span className="font-bold">Suhail Mobile Shop Raebareli • Since 2015</span>
          </div>
          <button onClick={() => window.location.href = '/'} className="bg-white text-black px-5 py-2 rounded-full font-bold text-[13px]">Back to Shop</button>
        </div>
      </footer>

      {showToast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full font-bold text-[13px] shadow-2xl z-50">{showToast}</div>}
    </div>
  )
}
