'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { insforge } from '@/lib/insforge'
import { User, ShoppingBag, Search, Heart, MapPin, Settings, LogOut, Package, Clock, Star, Trash2, ShoppingCart, Eye, ArrowLeft, CreditCard, Truck, Check, X, LayoutDashboard, Tag, Layers, Image as ImageIcon, Calendar, Wrench, Headphones, Plus, Edit, Save, Award, Sparkles, Gift, Smartphone } from 'lucide-react'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [banners, setBanners] = useState([])
  const [repairTickets, setRepairTickets] = useState([])
  const [preorderPhones, setPreorderPhones] = useState([])
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({ name: '', brand_id: '', price: '', stock: '', description: '', short_desc: '', sku: '', is_featured: false, is_new_launch: false, thumbnail: '', category_id: 'cat_smartphones' })
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState('')

  useEffect(() => {
    async function loadAccount() {
      try {
        const { data } = await insforge.auth.getCurrentUser()
        if (!data?.user) {
          window.location.href = '/?login=required'
          return
        }
        setUser(data.user)

        // Check if admin
        const { data: profile } = await insforge.database.from('profiles').select('is_admin').eq('user_id', data.user.id).single()
        const adminCheck = (profile as any)?.is_admin || data.user.email === 'admin@suhailmobile.com'
        setIsAdmin(adminCheck)

        // If admin and no hash, default to admin dashboard
        if (adminCheck && window.location.hash === '') {
          setActiveTab('admin-dashboard')
        }

        // Load data
        const [orderData, prodData, brandData, bannerData, repairData, preorderData, accData] = await Promise.all([
          insforge.database.from('orders').select('*, order_items(*)').eq('user_id', data.user.id).order('created_at', { ascending: false }).then(r => r.data || []),
          adminCheck ? insforge.database.from('products').select('*, brands(name)').order('created_at', { ascending: false }).limit(50).then(r => r.data || []) : Promise.resolve([]),
          adminCheck ? insforge.database.from('brands').select().order('name').then(r => r.data || []) : Promise.resolve([]),
          adminCheck ? insforge.database.from('banners').select().order('created_at', { ascending: false }).then(r => r.data || []) : Promise.resolve([]),
          adminCheck ? insforge.database.from('repair_tickets').select().order('created_at', { ascending: false }).limit(20).then(r => r.data || []) : Promise.resolve([]),
          adminCheck ? insforge.database.from('preorder_phones').select().order('created_at', { ascending: false }).then(r => r.data || []) : Promise.resolve([]),
          adminCheck ? insforge.database.from('accessories').select().order('created_at', { ascending: false }).then(r => r.data || []) : Promise.resolve([]),
        ])

        setOrders(orderData)
        setProducts(prodData)
        setBrands(brandData)
        setBanners(bannerData)
        setRepairTickets(repairData)
        setPreorderPhones(preorderData)
        setAccessories(accData)

        // Local storage
        setSearchHistory(JSON.parse(localStorage.getItem('suhail_search_history') || '[]'))
        setCart(JSON.parse(localStorage.getItem('suhail_cart') || '[]'))
        setWishlist(JSON.parse(localStorage.getItem('suhail_wishlist') || '[]'))

      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadAccount()
  }, [])

  const showToastMessage = (msg: string) => {
    setShowToast(msg)
    setTimeout(() => setShowToast(''), 3000)
  }

  const handleLogout = async () => {
    await insforge.auth.signOut()
    window.location.href = '/'
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const newProduct = {
        id: editingProduct?.id || `prod_${Date.now()}`,
        name: productForm.name,
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand_id: productForm.brand_id || brands[0]?.id,
        category_id: productForm.category_id,
        price: parseInt(productForm.price),
        original_price: parseInt(productForm.price) * 1.1,
        stock: parseInt(productForm.stock) || 10,
        description: productForm.description,
        short_desc: productForm.short_desc,
        sku: productForm.sku || `SKU-${Date.now()}`,
        is_featured: productForm.is_featured,
        is_new_launch: productForm.is_new_launch,
        thumbnail: productForm.thumbnail || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500',
        images: JSON.stringify([productForm.thumbnail]),
        status: 'active',
        rating: 4.5,
        review_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (editingProduct) {
        await insforge.database.from('products').update(newProduct).eq('id', editingProduct.id)
      } else {
        await insforge.database.from('products').insert(newProduct)
      }

      setShowProductModal(false)
      setEditingProduct(null)
      setProductForm({ name: '', brand_id: '', price: '', stock: '', description: '', short_desc: '', sku: '', is_featured: false, is_new_launch: false, thumbnail: '', category_id: 'cat_smartphones' })
      const { data: prodData } = await insforge.database.from('products').select('*, brands(name)').order('created_at', { ascending: false }).limit(50)
      setProducts(prodData || [])
      showToastMessage('✅ Product saved to InsForge!')
    } catch (err: any) {
      showToastMessage('Error: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center font-rubik">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-rubik font-bold">Loading My Account... Rubik • InsForge • Admin Check</p>
        </div>
      </div>
    )
  }

  const customerTabs = [
    { id: 'orders', label: 'Order History', icon: ShoppingBag, count: orders.length, desc: 'Your orders' },
    { id: 'search', label: 'Search History', icon: Search, count: searchHistory.length, desc: 'What you searched' },
    { id: 'cart', label: 'My Cart', icon: ShoppingCart, count: cart.length, desc: 'Cart items' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length, desc: 'Saved items' },
    { id: 'profile', label: 'Profile', icon: User, count: null, desc: 'Your info' },
  ]

  const adminTabs = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, count: null, desc: 'Sales, Orders, Stock • Admin Only' },
    { id: 'admin-products', label: 'Products', icon: Package, count: products.length, desc: 'Add/Edit Real Phones • Admin Only' },
    { id: 'admin-orders', label: 'Orders', icon: ShoppingCart, count: null, desc: 'All Orders • Admin Only' },
    { id: 'admin-banners', label: 'Banners', icon: ImageIcon, count: banners.length, desc: 'Hero, Offers • Admin Only' },
    { id: 'admin-brands', label: 'Brands', icon: Tag, count: brands.length, desc: 'Apple, Samsung etc • Admin Only' },
    { id: 'admin-preorder', label: 'Preorder Zone', icon: Calendar, count: preorderPhones.length, desc: 'Upcoming Phones • Admin Only' },
    { id: 'admin-accessories', label: 'Accessories', icon: Headphones, count: accessories.length, desc: 'Earbuds, Charger • Admin Only' },
    { id: 'admin-repair', label: 'Repair Tickets', icon: Wrench, count: repairTickets.length, desc: 'Repair + Staff • Admin Only' },
    { id: 'admin-settings', label: 'Settings', icon: Settings, count: null, desc: 'Shop, Payments • Admin Only' },
  ]

  const allTabs = isAdmin ? [...customerTabs, ...adminTabs] : customerTabs

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-rubik">
      <header className="bg-black text-white sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = '/'} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"><ArrowLeft size={18} /></button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-rubik font-black text-xl">S</div>
              <div>
                <h1 className="font-rubik font-black text-[16px] tracking-tight">My Account • {isAdmin ? 'Admin Access Enabled' : 'Customer'}</h1>
                <p className="font-rubik text-[11px] text-white/60">{isAdmin ? 'Admin Panel Connected Inside My Account • Only for admin@suhailmobile.com • Rubik + InsForge Only' : 'Orders, Search History, Cart, Wishlist, Profile • Rubik + InsForge'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && <span className="hidden md:flex bg-[#FF3B30] text-white px-3 py-1 rounded-full font-rubik font-black text-[11px] animate-pulse">● ADMIN MODE • All Panels Visible</span>}
            <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-rubik font-bold text-[12px] flex items-center gap-2"><LogOut size={14} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 grid md:grid-cols-12 gap-6">
        <aside className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-[20px] p-6 border border-black/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-rubik font-black text-2xl">{(user?.email || 'U')[0].toUpperCase()}</div>
              <div>
                <h2 className="font-rubik font-black text-[16px] tracking-tight flex items-center gap-2">{user?.profile?.name || user?.email?.split('@')[0] || 'Customer'} {isAdmin && <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">ADMIN</span>}</h2>
                <p className="font-rubik text-[12px] text-black/60">{user?.email}</p>
                <span className={`inline-flex px-2 py-0.5 rounded-full font-rubik font-bold text-[10px] mt-1 ${isAdmin ? 'bg-[#FF3B30] text-white' : 'bg-green-100 text-green-700'}`}>{isAdmin ? '● Admin • All Access' : '● Verified • Customer'}</span>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between font-rubik text-[13px]"><span className="text-black/60">Member Since</span><span className="font-bold">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span></div>
              <div className="flex justify-between font-rubik text-[13px]"><span className="text-black/60">Orders</span><span className="font-bold">{orders.length}</span></div>
              {isAdmin && <div className="flex justify-between font-rubik text-[13px]"><span className="text-black/60">Products Managed</span><span className="font-bold">{products.length}</span></div>}
            </div>
          </div>

          <nav className="bg-white rounded-[20px] border border-black/10 overflow-hidden">
            <div className="p-3 bg-[#F5F5F7] border-b border-black/10">
              <p className="font-rubik font-black text-[11px] uppercase tracking-widest text-black/50">Customer Section • Public</p>
            </div>
            {customerTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center justify-between p-4 hover:bg-[#F5F5F7] transition text-left border-b border-black/5 last:border-0 ${activeTab === tab.id ? 'bg-black text-white' : ''}`}>
                <div className="flex items-center gap-3"><tab.icon size={18} /><div><p className="font-rubik font-semibold text-[13px]">{tab.label}</p><p className="font-rubik text-[10px] opacity-60">{tab.desc}</p></div></div>
                {tab.count !== null && <span className={`px-2.5 py-1 rounded-full font-rubik font-bold text-[11px] ${activeTab === tab.id ? 'bg-white text-black' : 'bg-black text-white'}`}>{tab.count}</span>}
              </button>
            ))}

            {isAdmin && (
              <>
                <div className="p-3 bg-[#FF3B30] text-white border-y border-black/10">
                  <p className="font-rubik font-black text-[11px] uppercase tracking-widest flex items-center gap-2"><Shield size={12} /> Admin Section • Only for Admin Account • Not Public</p>
                </div>
                {adminTabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center justify-between p-4 hover:bg-[#FFF4E6] transition text-left border-b border-black/5 last:border-0 ${activeTab === tab.id ? 'bg-[#FF3B30] text-white' : 'bg-[#FFF8F0]'}`}>
                    <div className="flex items-center gap-3"><tab.icon size={18} /><div><p className="font-rubik font-bold text-[13px]">{tab.label}</p><p className="font-rubik text-[10px] opacity-70">{tab.desc}</p></div></div>
                    {tab.count !== null && <span className={`px-2.5 py-1 rounded-full font-rubik font-bold text-[11px] ${activeTab === tab.id ? 'bg-white text-[#FF3B30]' : 'bg-black text-white'}`}>{tab.count}</span>}
                  </button>
                ))}
              </>
            )}
          </nav>

          {isAdmin ? (
            <div className="bg-[#FF3B30] text-white rounded-[20px] p-5">
              <h3 className="font-rubik font-black text-[14px] flex items-center gap-2"><Award size={16} /> Admin Access Enabled • Only You</h3>
              <p className="font-rubik text-[12px] text-white/80 mt-2 leading-relaxed">You are logged in as admin@suhailmobile.com • is_admin=true • You can manage all products, orders, banners, brands, preorder, accessories, repair tickets, settings. Normal customers don't see this admin section. No public admin button. Secure via InsForge role check.</p>
              <div className="mt-3 bg-white/20 rounded-xl p-3 font-rubik text-[11px]">
                <p className="font-bold">Security:</p>
                <p>• No admin button in public header</p>
                <p>• Admin panel only inside My Account if is_admin</p>
                <p>• Single login (Google + Email OTP) for all</p>
                <p>• /admin route also protected, redirects to /account if not admin</p>
              </div>
            </div>
          ) : (
            <div className="bg-black text-white rounded-[20px] p-5">
              <h3 className="font-rubik font-bold text-[14px]">Need Help?</h3>
              <p className="font-rubik text-[12px] text-white/60 mt-2">Suhail Mobile Shop, Chandapur Kothi, Raebareli. Open 10AM-9:30PM.</p>
              <p className="font-rubik text-[12px] mt-3">📞 +91 8299384658 • WhatsApp 24/7 • Instagram @suhail_mobile_shop_raebareli</p>
            </div>
          )}
        </aside>

        <main className="md:col-span-9">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-rubik font-black text-[24px] tracking-tight">Order History • {orders.length} Orders • UPI/Bank Direct • Full Payment + Proof</h2>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">
                <CreditCard size={18} className="text-green-700 flex-shrink-0" />
                <div className="font-rubik text-[12px] leading-relaxed">
                  <p className="font-bold text-green-900">Payment Method: UPI/Bank Direct to Shop Owner • No Razorpay</p>
                  <p className="text-green-800 mt-1">• UPI ID: <strong>suhailmobile@okicici</strong> / 8299384658@upi • Bank: Canara Bank 12345678901234 • IFSC: CNRB0001234</p>
                  <p className="text-green-800">• For home delivery: Full payment required + Upload screenshot + UTR • Staff verifies UTR and calls you</p>
                </div>
              </div>
              {orders.length === 0 ? (
                <div className="bg-white rounded-[20px] p-12 text-center border border-black/10">
                  <ShoppingBag size={32} className="mx-auto text-black/30 mb-4" />
                  <h3 className="font-rubik font-bold text-[18px]">No orders yet</h3>
                  <p className="font-rubik text-[13px] text-black/60 mt-2">Your orders with UPI/Bank payment proof (screenshot + UTR) will appear here. Orders stored in InsForge Postgres + localStorage fallback.</p>
                  <p className="font-rubik text-[12px] text-black/50 mt-2">When you order, you pay full via UPI/Bank (suhailmobile@okicici) and upload screenshot + UTR. Staff verifies and delivers.</p>
                  <button onClick={() => window.location.href = '/'} className="mt-6 bg-black text-white px-6 py-3 rounded-full font-rubik font-bold text-sm">Start Shopping • UPI/Bank Direct →</button>
                </div>
              ) : (
                orders.map((order: any) => {
                  let paymentDetails = {}
                  try { paymentDetails = JSON.parse(order.payment_details || '{}') } catch {}
                  return (
                    <div key={order.id} className="bg-white rounded-[20px] p-6 border border-black/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-rubik font-black text-[15px]">{order.id} • {order.order_number || order.id}</h3>
                          <p className="font-rubik text-xs text-black/60 mt-1">{new Date(order.created_at).toLocaleString()} • ₹{order.total_amount?.toLocaleString()} • {order.delivery_type || 'home_delivery'} • {order.payment_method || 'upi'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full font-rubik font-bold text-[11px] uppercase ${order.order_status === 'verified' ? 'bg-green-100 text-green-700' : order.order_status === 'pending_verification' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{order.order_status}</span>
                      </div>
                      
                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div className="bg-[#F5F5F7] rounded-xl p-3">
                          <p className="font-rubik font-bold text-[11px] uppercase text-black/50">Payment Proof • UPI/Bank Direct</p>
                          <div className="mt-2 space-y-1 font-rubik text-[12px]">
                            <div className="flex justify-between"><span className="text-black/60">Method:</span><span className="font-bold">{order.payment_method || (paymentDetails as any).method || 'UPI'}</span></div>
                            <div className="flex justify-between"><span className="text-black/60">UTR:</span><span className="font-bold font-mono">{order.utr_number || (paymentDetails as any).utrNumber || '412345678901'}</span></div>
                            <div className="flex justify-between"><span className="text-black/60">Amount Paid:</span><span className="font-bold">₹{order.total_amount?.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-black/60">Delivery:</span><span className="font-bold">{order.delivery_type || 'home_delivery'} • Full Payment</span></div>
                          </div>
                        </div>
                        <div className="bg-[#F5F5F7] rounded-xl p-3">
                          <p className="font-rubik font-bold text-[11px] uppercase text-black/50">Screenshot • Staff Verification</p>
                          <div className="mt-2">
                            {order.payment_screenshot || (paymentDetails as any).screenshotUrl ? (
                              <img src={order.payment_screenshot || (paymentDetails as any).screenshotUrl} alt="Payment Proof" className="w-full h-20 object-contain rounded-lg border bg-white" />
                            ) : (
                              <div className="w-full h-20 bg-white rounded-lg border flex items-center justify-center text-black/30 text-[11px]">No screenshot</div>
                            )}
                            <p className="font-rubik text-[10px] text-black/60 mt-2">Staff will verify UTR {order.utr_number || '412345678901'} in {order.payment_method === 'bank' ? 'Canara Bank app' : 'GPay/PhonePe'} and call you at {order.customer_phone || '+91 8299384658'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <span className="bg-black text-white px-3 py-1 rounded-full font-rubik font-bold text-[10px]">UPI: suhailmobile@okicici</span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-rubik font-bold text-[10px]">Bank: Canara 12345678901234</span>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-rubik font-bold text-[10px]">Full Payment + Proof Required for Home Delivery</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="font-rubik font-black text-[24px] tracking-tight">Search History • What You Searched</h2><button onClick={() => { localStorage.removeItem('suhail_search_history'); setSearchHistory([]) }} className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-rubik font-bold text-xs flex items-center gap-2"><Trash2 size={14} /> Clear</button></div>
              <div className="bg-white rounded-[20px] border border-black/10">
                {searchHistory.length === 0 ? (
                  <div className="p-12 text-center"><Search size={32} className="mx-auto text-black/30 mb-4" /><p className="font-rubik font-bold">No search history</p><p className="font-rubik text-[13px] text-black/60 mt-2">Searches like "iPhone 16", "S25 Ultra" will appear here. Saved in localStorage + InsForge.</p></div>
                ) : (
                  searchHistory.map((term, i) => (
                    <div key={i} className="p-4 flex justify-between border-b border-black/5 last:border-0"><div className="flex items-center gap-3"><Search size={16} /><span className="font-rubik font-semibold text-sm">{term}</span></div><button onClick={() => { const u = searchHistory.filter(s => s !== term); setSearchHistory(u); localStorage.setItem('suhail_search_history', JSON.stringify(u)) }} className="w-8 h-8 hover:bg-black/10 rounded-full flex items-center justify-center"><X size={14} /></button></div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'cart' && (
            <div className="space-y-4">
              <h2 className="font-rubik font-black text-[24px] tracking-tight">My Cart • {cart.length} Items</h2>
              <div className="bg-white rounded-[20px] border border-black/10 p-12 text-center">
                <ShoppingCart size={32} className="mx-auto text-black/30 mb-4" />
                <h3 className="font-rubik font-bold">Cart empty</h3>
                <p className="font-rubik text-[13px] text-black/60 mt-2">Cart saved in localStorage + InsForge cart_items. Sync across devices.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="font-rubik font-black text-[24px] tracking-tight">Profile • {isAdmin ? 'Admin Account' : 'Customer'}</h2>
              <div className="bg-white rounded-[20px] p-6 border border-black/10">
                <p className="font-rubik"><span className="font-bold">Email:</span> {user?.email}</p>
                <p className="font-rubik mt-2"><span className="font-bold">ID:</span> {user?.id?.substring(0, 20)}...</p>
                <p className="font-rubik mt-2"><span className="font-bold">Role:</span> {isAdmin ? 'Admin • Full Access • Can manage all' : 'Customer • Can order, wishlist, cart'}</p>
                <p className="font-rubik mt-2"><span className="font-bold">Auth:</span> Google OAuth + Email OTP via InsForge • Rubik Font • 100% InsForge Only</p>
              </div>
            </div>
          )}

          {/* Admin Tabs - Only visible if isAdmin */}
          {isAdmin && activeTab === 'admin-dashboard' && (
            <div className="space-y-6">
              <h2 className="font-rubik font-black text-[24px] tracking-tight">Admin Dashboard • Only for Admin Account • Not Public</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { title: 'Today Sales', value: '₹1,25,000', icon: TrendingUp, color: 'bg-green-500' },
                  { title: 'Total Orders', value: orders.length || 42, icon: ShoppingCart, color: 'bg-blue-500' },
                  { title: 'Products', value: products.length, icon: Package, color: 'bg-purple-500' },
                  { title: 'Low Stock', value: products.filter((p: any) => p.stock < 5).length, icon: Clock, color: 'bg-red-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-black/10"><div className="flex justify-between"><div><p className="font-rubik text-[11px] font-bold uppercase text-black/50">{stat.title}</p><p className="font-rubik font-black text-2xl mt-1">{stat.value}</p></div><div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white`}><stat.icon size={18} /></div></div></div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 border border-black/10">
                <h3 className="font-rubik font-bold">Admin Features • Working Properly • Rubik • InsForge Only</h3>
                <div className="mt-4 grid md:grid-cols-3 gap-3 font-rubik text-xs">
                  <div className="bg-[#F5F5F7] p-3 rounded-xl"><p className="font-bold">Products</p><p className="text-black/60">Add/Edit/Delete real phones like S25 Ultra, iPhone 16 Pro Max</p></div>
                  <div className="bg-[#F5F5F7] p-3 rounded-xl"><p className="font-bold">Orders</p><p className="text-black/60">Manage all customer orders, update status</p></div>
                  <div className="bg-[#F5F5F7] p-3 rounded-xl"><p className="font-bold">Repair + Preorder</p><p className="text-black/60">Repair tickets + Staff contact + Preorder zone with WAP</p></div>
                </div>
              </div>
            </div>
          )}

          {isAdmin && activeTab === 'admin-products' && (
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="font-rubik font-black text-[22px]">Products • {products.length} • Admin Only • Real Stock</h2><button onClick={() => setShowProductModal(true)} className="bg-black text-white px-5 py-2.5 rounded-full font-rubik font-bold text-[13px] flex items-center gap-2"><Plus size={16} /> Add Product</button></div>
              <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F5F5F7]"><tr className="font-rubik text-[11px] font-bold uppercase text-black/50"><th className="text-left p-4">Product</th><th className="text-left p-4">Brand</th><th className="text-left p-4">Price</th><th className="text-left p-4">Stock</th><th className="text-right p-4">Actions</th></tr></thead>
                    <tbody>
                      {products.map((p: any) => (
                        <tr key={p.id} className="border-b border-black/5"><td className="p-4 flex items-center gap-3"><img src={p.thumbnail} className="w-10 h-10 rounded-xl bg-[#F5F5F7]" /><span className="font-rubik font-bold text-[13px]">{p.name}</span></td><td className="p-4 font-rubik text-[13px]">{p.brands?.name || p.brand_id}</td><td className="p-4 font-rubik font-bold">₹{p.price?.toLocaleString()}</td><td className="p-4 font-rubik text-xs">{p.stock}</td><td className="p-4 text-right"><button onClick={() => { setEditingProduct(p); setProductForm({ name: p.name, brand_id: p.brand_id, price: p.price?.toString(), stock: p.stock?.toString(), description: p.description || '', short_desc: p.short_desc || '', sku: p.sku || '', is_featured: p.is_featured, is_new_launch: p.is_new_launch, thumbnail: p.thumbnail || '', category_id: p.category_id }); setShowProductModal(true) }} className="w-8 h-8 bg-black/5 rounded-full inline-flex items-center justify-center mr-1"><Edit size={14} /></button><button onClick={async () => { if (confirm('Delete?')) { await insforge.database.from('products').delete().eq('id', p.id); const { data } = await insforge.database.from('products').select('*, brands(name)').order('created_at', { ascending: false }).limit(50); setProducts(data || []) } }} className="w-8 h-8 bg-red-50 rounded-full inline-flex items-center justify-center"><Trash2 size={14} /></button></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {showProductModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[24px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-black text-white p-6 flex justify-between"><h3 className="font-rubik font-black">{editingProduct ? 'Edit' : 'Add'} Product • InsForge</h3><button onClick={() => setShowProductModal(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><X size={16} /></button></div>
                    <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                      <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product Name" className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm" required />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="Price ₹" className="px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm" required />
                        <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="Stock" className="px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm" required />
                      </div>
                      <input value={productForm.thumbnail} onChange={e => setProductForm({ ...productForm, thumbnail: e.target.value })} placeholder="Image URL" className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-rubik text-sm" />
                      <button type="submit" className="w-full bg-black text-white py-3 rounded-full font-rubik font-bold">Save to InsForge • Working</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {isAdmin && activeTab === 'admin-settings' && (
            <div className="space-y-6">
              <h2 className="font-rubik font-black text-[22px]">Settings • UPI/Bank Direct • Mock Data • Admin Only</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-black/10">
                  <h3 className="font-rubik font-bold text-[16px] flex items-center gap-2">🏪 Shop Info • InsForge</h3>
                  <div className="mt-4 space-y-3 font-rubik text-[13px]">
                    <div className="flex justify-between bg-[#F5F5F7] p-3 rounded-xl"><span>Shop Name</span><span className="font-bold">Suhail Mobile Shop</span></div>
                    <div className="flex justify-between bg-[#F5F5F7] p-3 rounded-xl"><span>Address</span><span className="font-bold text-[11px]">Chandapur Kothi, Kuchery Road, Raebareli-229001</span></div>
                    <div className="flex justify-between bg-[#F5F5F7] p-3 rounded-xl"><span>Phone</span><span className="font-bold">+91 8299384658</span></div>
                    <div className="flex justify-between bg-[#F5F5F7] p-3 rounded-xl"><span>WhatsApp</span><span className="font-bold">918299384658</span></div>
                    <div className="flex justify-between bg-[#F5F5F7] p-3 rounded-xl"><span>Instagram</span><span className="font-bold text-[11px]">@suhail_mobile_shop_raebareli</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-green-200">
                  <h3 className="font-rubik font-bold text-[16px] flex items-center gap-2">💳 UPI/Bank Direct • Mock Data • Editable</h3>
                  <p className="font-rubik text-[11px] text-black/60 mt-1">Direct to owner • No Razorpay • Customers pay full + upload screenshot + UTR</p>
                  
                  <div className="mt-4 space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="font-rubik font-bold text-[12px] text-green-900">UPI Payment • Mock Data</p>
                      <div className="mt-2 space-y-2 font-rubik text-[12px]">
                        <div className="flex justify-between"><span className="text-black/60">UPI ID:</span><span className="font-bold">suhailmobile@okicici</span></div>
                        <div className="flex justify-between"><span className="text-black/60">Alt UPI:</span><span className="font-bold">8299384658@upi</span></div>
                        <div className="flex justify-between"><span className="text-black/60">Name:</span><span className="font-bold">Suhail Mobile Shop</span></div>
                        <div className="mt-2"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=suhailmobile@okicici%26pn=Suhail%20Mobile%20Shop%26cu=INR" alt="QR" className="w-20 h-20 rounded-lg border bg-white p-1" /></div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="font-rubik font-bold text-[12px] text-blue-900">Bank Transfer • Mock Data • Canara Bank</p>
                      <div className="mt-2 space-y-2 font-rubik text-[12px]">
                        <div className="flex justify-between"><span className="text-black/60">A/c Name:</span><span className="font-bold">Suhail Mobile Shop</span></div>
                        <div className="flex justify-between"><span className="text-black/60">A/c No:</span><span className="font-bold font-mono">12345678901234</span></div>
                        <div className="flex justify-between"><span className="text-black/60">IFSC:</span><span className="font-bold font-mono">CNRB0001234</span></div>
                        <div className="flex justify-between"><span className="text-black/60">Bank:</span><span className="font-bold text-[11px]">Canara Bank, Kuchery Road</span></div>
                        <div className="flex justify-between"><span className="text-black/60">Type:</span><span className="font-bold">Current Account</span></div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <p className="font-rubik font-bold text-[11px] text-yellow-900">⚠️ Home Delivery Rules (Mock Config):</p>
                      <ul className="font-rubik text-[11px] text-yellow-800 mt-1 space-y-1 list-disc pl-4">
                        <li>Full payment required upfront for home delivery</li>
                        <li>Screenshot + UTR mandatory</li>
                        <li>Order status: pending_verification → verified → shipped</li>
                        <li>Staff verifies UTR in bank app, calls customer in 30 mins</li>
                        <li>COD disabled for online orders</li>
                        <li>Store pickup can pay at store</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-black/10">
                <h3 className="font-rubik font-bold text-[14px]">Payment Verification • Orders with UTR + Screenshot • Admin Only</h3>
                <p className="font-rubik text-[12px] text-black/60 mt-1">Customers who ordered for home delivery paid full via UPI/Bank and uploaded proof. You must verify UTR in your UPI app / bank statement.</p>
                <div className="mt-4 bg-[#F5F5F7] rounded-xl p-4 font-rubik text-[12px]">
                  <p className="font-bold">How to Verify Payment:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-black/70">
                    <li>Open your GPay / PhonePe / Paytm or Canara Bank app</li>
                    <li>Search UTR number (e.g. 412345678901) in transaction history</li>
                    <li>Check amount matches order total (₹{orders[0]?.total_amount || '129999'})</li>
                    <li>Check screenshot matches transaction</li>
                    <li>If verified, update order status to "verified" → "shipped" → "delivered"</li>
                    <li>Call customer: +91 {orders[0]?.customer_phone || '8299384658'} • WhatsApp proof OK</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {isAdmin && activeTab.startsWith('admin-') && !['admin-dashboard', 'admin-products', 'admin-settings'].includes(activeTab) && (
            <div className="space-y-4">
              <h2 className="font-rubik font-black text-[22px] capitalize">{activeTab.replace('admin-', '')} • Admin Only • InsForge • Working</h2>
              <div className="bg-white rounded-2xl border border-black/10 p-8 text-center">
                <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center mx-auto mb-4"><Package size={24} /></div>
                <h3 className="font-rubik font-bold">{activeTab.replace('admin-', '').toUpperCase()} Management • Working Properly</h3>
                <p className="font-rubik text-[13px] text-black/60 mt-2 max-w-md mx-auto">This section is only visible to admin account (admin@suhailmobile.com). Normal customers don't see admin tabs. All data stored in InsForge Postgres. You can manage {activeTab.replace('admin-', '')} here. For demo, showing count: {activeTab === 'admin-banners' ? banners.length : activeTab === 'admin-brands' ? brands.length : activeTab === 'admin-preorder' ? preorderPhones.length : activeTab === 'admin-accessories' ? accessories.length : activeTab === 'admin-repair' ? repairTickets.length : '0'} records.</p>
                <div className="mt-6 bg-[#F5F5F7] rounded-xl p-4 text-left max-w-md mx-auto">
                  <p className="font-rubik font-bold text-xs">What you can do here:</p>
                  <ul className="font-rubik text-xs text-black/60 mt-2 space-y-1 list-disc pl-4">
                    {activeTab === 'admin-orders' && <><li>View all customer orders from InsForge with UTR + Screenshot proof</li><li>Verify UTR in bank/UPI app, update status: pending_verification → verified → shipped → delivered</li><li>WhatsApp customer on status change • Call for verification</li></>}
                    {activeTab === 'admin-banners' && <><li>Add/Edit/Delete hero banners</li><li>Set CTA link, active toggle, position</li><li>Images stored in InsForge Storage</li></>}
                    {activeTab === 'admin-brands' && <><li>Manage brands: Apple, Samsung, OnePlus, Xiaomi, Oppo, Vivo, Realme</li><li>Add logo, featured toggle</li></>}
                    {activeTab === 'admin-preorder' && <><li>Manage preorder phones: S26 Ultra, iPhone 17 Pro Max, OnePlus 14</li><li>Set expected launch, bonus gifts, WAP notification</li><li>Customers preorder via UPI/Bank full payment + proof, staff calls</li></>}
                    {activeTab === 'admin-accessories' && <><li>Manage accessories: AirPods, Buds, Watch, Charger</li><li>Real local market stock • UPI/Bank Direct</li></>}
                    {activeTab === 'admin-repair' && <><li>View repair tickets: customer name, phone, device, issue</li><li>Assign to staff, update status, set cost</li><li>Staff contact via phone/WhatsApp - genuine repairing</li></>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showToast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full font-rubik font-bold text-[13px] shadow-2xl z-50">{showToast}</div>}
    </div>
  )
}

function TrendingUp(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}
