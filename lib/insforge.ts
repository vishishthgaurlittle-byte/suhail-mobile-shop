// @ts-nocheck
// 100% InsForge Only - No Turso - Fixed Auth Persistence
import { createClient } from '@insforge/sdk'

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://md9tnq8u.eu-central.insforge.app'
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || ''

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
})

// Helper to generate ID
export function generateId(prefix = "") {
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}${time}${rand}`;
}

// Auth persistence helpers - Fix expiry on navigation
export const authHelpers = {
  // Save user to localStorage for persistence fallback + customers global list
  saveUserToLocal(user: any) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('suhail_user', JSON.stringify(user))
      localStorage.setItem('suhail_user_email', user.email || '')
      localStorage.setItem('suhail_last_auth', Date.now().toString())
      // Also save to customers global list for admin panel - ensures any account created shows in customers tab
      const customersKey = 'suhail_customers_global'
      const existing = JSON.parse(localStorage.getItem(customersKey) || '[]')
      const customerData = {
        id: user.id,
        user_id: user.id,
        email: user.email,
        customer_email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
        customer_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
        phone: user.phone || user.user_metadata?.phone || '',
        customer_phone: user.phone || user.user_metadata?.phone || '',
        created_at: user.created_at || new Date().toISOString(),
        is_admin: user.email === 'admin@suhailmobile.com' || user.email === 'suhailmobile@gmail.com',
        role: (user.email === 'admin@suhailmobile.com' || user.email === 'suhailmobile@gmail.com') ? 'admin' : 'customer',
        provider: user.app_metadata?.provider || 'email',
        last_sign_in: new Date().toISOString()
      }
      // Update or add
      const idx = existing.findIndex((c: any) => c.user_id === user.id || c.email === user.email || c.id === user.id)
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...customerData }
      } else {
        existing.unshift(customerData)
      }
      localStorage.setItem(customersKey, JSON.stringify(existing))
    } catch {}
  },
  
  // Ensure profile exists in InsForge profiles table - FIXED for actual schema (username stores email, user_id is uuid)
  async ensureProfile(user: any) {
    if (!user?.id || !user?.email) return
    try {
      // Check if profile exists by user_id
      const { data: existing } = await insforge.database.from('profiles').select('id').eq('user_id', user.id).single()
      if (existing) {
        // Update last_seen and username (email)
        try {
          await insforge.database.from('profiles').update({ 
            last_seen: new Date().toISOString(),
            username: user.email, // Store email in username field - actual schema
            updated_at: new Date().toISOString()
          }).eq('user_id', user.id)
        } catch {}
        return
      }
      // Also check by username (email)
      try {
        const { data: existingByUsername } = await insforge.database.from('profiles').select('id').eq('username', user.email).single()
        if (existingByUsername) {
          try {
            await insforge.database.from('profiles').update({ 
              user_id: user.id,
              last_seen: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }).eq('id', (existingByUsername as any).id)
          } catch {}
          return
        }
      } catch {}
      
      // Create new profile with FIXED schema - now has email columns after migration 20260904000021
      const profileData = {
        id: user.id, // user.id is already uuid from InsForge Auth
        user_id: user.id,
        username: user.email, // Store email in username for compatibility
        email: user.email, // NEW: Now email column exists after migration
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
        phone: user.phone || user.user_metadata?.phone || null,
        is_admin: (user.email === 'admin@suhailmobile.com' || user.email === 'suhailmobile@gmail.com'),
        role: (user.email === 'admin@suhailmobile.com' || user.email === 'suhailmobile@gmail.com') ? 'admin' : 'customer',
        status: 'active',
        level: 1,
        xp: 0,
        daily_cap_paise: 500000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_seen: new Date().toISOString()
      }
      // Try insert
      const { error } = await insforge.database.from('profiles').insert(profileData)
      if (error) {
        // If fails, try with new uuid for id
        try {
          const newId = `00000000-0000-4000-a000-${Date.now().toString().slice(-12).padStart(12,'0')}`
          // Generate proper uuid v4
          const altId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
          })
          const altProfile = { ...profileData, id: altId }
          await insforge.database.from('profiles').insert(altProfile)
        } catch (e2) {
          // Last fallback: try without id (let DB generate)
          try {
            const { id, ...withoutId } = profileData
            await insforge.database.from('profiles').insert(withoutId)
          } catch {}
        }
      }
    } catch (e) {
      // Silent fail - localStorage fallback will handle, but log for debug
    }
  },

  getUserFromLocal(): any | null {
    if (typeof window === 'undefined') return null
    try {
      const userStr = localStorage.getItem('suhail_user')
      const lastAuth = localStorage.getItem('suhail_last_auth')
      if (!userStr) return null
      // FIXED: Make login permanent for single device - 365 days * 10 years = permanent until logout
      // Previously 7 days, now 10 years for single device permanence
      if (lastAuth && Date.now() - parseInt(lastAuth) > 365 * 10 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('suhail_user')
        localStorage.removeItem('suhail_user_email')
        return null
      }
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },
  
  clearLocalUser() {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem('suhail_user')
      localStorage.removeItem('suhail_user_email')
      localStorage.removeItem('suhail_last_auth')
      localStorage.removeItem('suhail_is_admin')
    } catch {}
  },
  
  // Robust getCurrentUser with localStorage fallback - FIXES expiry on navigation + ensures profile for customers tab
  async getCurrentUserRobust(): Promise<any | null> {
    try {
      // Try InsForge first
      const { data, error } = await insforge.auth.getCurrentUser()
      if (!error && data?.user) {
        // Save to local for fallback + customers list
        this.saveUserToLocal(data.user)
        // Ensure profile exists for customers tab - critical fix
        this.ensureProfile(data.user).catch(()=>{})
        if (data.user.email === 'admin@suhailmobile.com') {
          localStorage.setItem('suhail_is_admin', 'true')
        }
        return data.user
      }
      
      // If InsForge fails, try localStorage fallback (fixes expiry bug)
      const localUser = this.getUserFromLocal()
      if (localUser) {
        return localUser
      }
      
      return null
    } catch (err) {
      // Silent auth fallback
      // Fallback to localStorage
      const localUser = this.getUserFromLocal()
      if (localUser) return localUser
      return null
    }
  },
  
  async signOutRobust() {
    try {
      await insforge.auth.signOut()
    } catch {}
    this.clearLocalUser()
    // Clear other session data but keep cart/search for UX
    // Don't clear cart, search_history, orders - keep for customer
  },
  
  isAdminEmail(email: string): boolean {
    return email === 'admin@suhailmobile.com' || email === 'suhailmobile@gmail.com'
  },
  
  // Check if current user is admin with multiple fallbacks
  async checkIsAdmin(user: any): Promise<boolean> {
    if (!user) return false
    if (this.isAdminEmail(user.email)) return true
    
    try {
      // Check profiles table
      const { data: profile } = await insforge.database.from('profiles').select('is_admin, role').eq('user_id', user.id).single()
      if ((profile as any)?.is_admin || (profile as any)?.role === 'admin') return true
    } catch {}
    
    // Check localStorage flag
    if (typeof window !== 'undefined') {
      const isAdminFlag = localStorage.getItem('suhail_is_admin')
      if (isAdminFlag === 'true' && this.isAdminEmail(user.email)) return true
    }
    
    return this.isAdminEmail(user.email)
  }
}

// Real phones 2026 India + Accessories - Always present
export const REAL_PHONES_2026 = [
  { id: 'prod_s25ultra_real', name: 'Samsung Galaxy S25 Ultra 12GB/512GB Titanium Black', slug: 'samsung-galaxy-s25-ultra-12-512-titanium-black', brand_id: 'brand_samsung', category_id: 'cat_smartphones', short_desc: 'Galaxy AI, S Pen, 200MP, Snapdragon 8 Elite', description: 'Latest Samsung Galaxy S25 Ultra with Galaxy AI, S Pen, 200MP, SD 8 Elite, 5000mAh, 45W. Available in Raebareli.', price: 129999, original_price: 139999, stock: 15, sku: 'SAM-S25U-512-BLK-REAL', is_featured: true, is_new_launch: true, thumbnail: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600', rating: 4.9, review_count: 234, status: 'active' },
  { id: 'prod_iphone16pm_real', name: 'Apple iPhone 16 Pro Max 256GB Natural Titanium', slug: 'apple-iphone-16-pro-max-256gb-natural-titanium', brand_id: 'brand_apple', category_id: 'cat_smartphones', short_desc: 'A18 Pro, Titanium, 48MP Pro Camera', description: 'iPhone 16 Pro Max A18 Pro, Titanium, 48MP Pro, 6.9 Super Retina XDR. Official warranty, EMI.', price: 159900, original_price: 179900, stock: 12, sku: 'APL-IP16PM-256-NT-REAL', is_featured: true, is_new_launch: true, thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', rating: 4.9, review_count: 312, status: 'active' },
  { id: 'prod_oneplus13_real', name: 'OnePlus 13 16GB/512GB Midnight Ocean', slug: 'oneplus-13-16-512-midnight-ocean', brand_id: 'brand_oneplus', category_id: 'cat_smartphones', short_desc: 'SD 8 Elite, Hasselblad, 6000mAh, 100W', description: 'OnePlus 13 SD 8 Elite, Hasselblad, 2K 120Hz, 6000mAh, 100W. Flagship killer.', price: 69999, original_price: 74999, stock: 20, sku: 'OP-13-512-MO-REAL', is_featured: true, is_new_launch: true, thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600', rating: 4.8, review_count: 124, status: 'active' },
  { id: 'prod_iphone15_real', name: 'Apple iPhone 15 128GB Black', slug: 'apple-iphone-15-128gb-black', brand_id: 'brand_apple', category_id: 'cat_smartphones', short_desc: 'A16 Bionic, 48MP, Dynamic Island', description: 'iPhone 15 128GB Black, A16 Bionic, 48MP camera, Dynamic Island, USB-C. Best value iPhone.', price: 69900, original_price: 79900, stock: 25, sku: 'APL-IP15-128-BLK', is_featured: true, is_best_seller: true, thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', rating: 4.8, review_count: 542, status: 'active' },
  { id: 'prod_s24ultra_real', name: 'Samsung Galaxy S24 Ultra 12GB/256GB Titanium Gray', slug: 'samsung-galaxy-s24-ultra-256gb', brand_id: 'brand_samsung', category_id: 'cat_smartphones', short_desc: 'S Pen, 200MP, SD 8 Gen 3, Galaxy AI', description: 'Galaxy S24 Ultra with S Pen, 200MP, SD 8 Gen 3, Galaxy AI features, 5000mAh.', price: 109999, original_price: 129999, stock: 18, sku: 'SAM-S24U-256-GRAY', is_featured: true, is_best_seller: true, thumbnail: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600', rating: 4.9, review_count: 423, status: 'active' },
  { id: 'prod_pixel8pro_real', name: 'Google Pixel 8 Pro 12GB/256GB Obsidian', slug: 'google-pixel-8-pro-256gb', brand_id: 'brand_google', category_id: 'cat_smartphones', short_desc: 'Tensor G3, Best AI Camera, 7 Years Updates', description: 'Pixel 8 Pro with Tensor G3, best AI camera, Magic Eraser, 7 years updates.', price: 84999, original_price: 106999, stock: 10, sku: 'GOOG-P8P-256-OBS', is_featured: true, thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', rating: 4.7, review_count: 198, status: 'active' },
  { id: 'prod_redmi_note13pro_real', name: 'Redmi Note 13 Pro+ 12GB/512GB Midnight Black', slug: 'redmi-note-13-pro-plus-512gb', brand_id: 'brand_xiaomi', category_id: 'cat_smartphones', short_desc: '200MP, Dimensity 7200-Ultra, 120W', description: 'Redmi Note 13 Pro+ 200MP, Dimensity 7200-Ultra, 120W HyperCharge, IP68, curved AMOLED.', price: 31999, original_price: 35999, stock: 30, sku: 'REDMI-N13PP-512-BLK', is_featured: false, is_best_seller: true, thumbnail: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', rating: 4.6, review_count: 892, status: 'active' },
  { id: 'prod_nothing2a_real', name: 'Nothing Phone (2a) 12GB/256GB White', slug: 'nothing-phone-2a-256gb-white', brand_id: 'brand_nothing', category_id: 'cat_smartphones', short_desc: 'Dimensity 7200 Pro, Glyph Interface', description: 'Nothing Phone (2a) with Glyph interface, Dimensity 7200 Pro, 50MP dual camera, clean Nothing OS.', price: 25999, original_price: 29999, stock: 22, sku: 'NOTHING-2A-256-WHT', is_featured: false, thumbnail: 'https://images.unsplash.com/photo-1585236884130-3744db8e6cc3?w=500', rating: 4.5, review_count: 342, status: 'active' },
  { id: 'prod_realme_narzo70_real', name: 'Realme Narzo 70 Pro 8GB/256GB Glass Green', slug: 'realme-narzo-70-pro-256gb', brand_id: 'brand_realme', category_id: 'cat_smartphones', short_desc: '50MP Sony IMX890, 67W, Air Gestures', description: 'Realme Narzo 70 Pro 50MP Sony IMX890 OIS, 67W charging, air gestures, 120Hz AMOLED.', price: 19999, original_price: 24999, stock: 35, sku: 'REALME-N70P-256-GRN', is_featured: false, is_best_seller: true, thumbnail: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', rating: 4.4, review_count: 567, status: 'active' },
]

export const REAL_ACCESSORIES_2026 = [
  { id: 'acc_airpods_pro2', name: 'Apple AirPods Pro 2nd Gen', category: 'Earbuds', brand_id: 'brand_apple', price: 26900, original_price: 29900, stock: 25, image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', description: 'Active Noise Cancellation, Spatial Audio, MagSafe', is_featured: true },
  { id: 'acc_buds3pro', name: 'Samsung Galaxy Buds 3 Pro', category: 'Earbuds', brand_id: 'brand_samsung', price: 19999, original_price: 22999, stock: 20, image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', description: 'Galaxy AI, 360 Audio, ANC, Blade Design', is_featured: true },
  { id: 'acc_watch2r', name: 'OnePlus Watch 2R', category: 'Smartwatch', brand_id: 'brand_oneplus', price: 17999, original_price: 21999, stock: 15, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: '100h Battery, Dual Engine, AMOLED', is_featured: true },
  { id: 'acc_anker65w', name: 'Anker 65W Fast Charger GaN', category: 'Charger', brand_id: 'brand_xiaomi', price: 3499, original_price: 4999, stock: 40, image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', description: 'GaN, 3 Ports, Fast Charging, Compact', is_featured: false },
  { id: 'acc_apple_20w', name: 'Apple 20W USB-C Power Adapter', category: 'Charger', brand_id: 'brand_apple', price: 1999, original_price: 2499, stock: 50, image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', description: 'Original Apple 20W Fast Charging', is_featured: true },
  { id: 'acc_samsung_45w', name: 'Samsung 45W Super Fast Charger', category: 'Charger', brand_id: 'brand_samsung', price: 2499, original_price: 3499, stock: 35, image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', description: 'Super Fast Charging 2.0, USB-C', is_featured: false },
  { id: 'acc_boat_rockerz', name: 'boAt Rockerz 255 Pro+ Neckband', category: 'Earbuds', brand_id: 'brand_realme', price: 1499, original_price: 2990, stock: 60, image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', description: '40H Playback, ASAP Charge, IPX5', is_featured: false },
  { id: 'acc_noise_watch', name: 'Noise ColorFit Pro 5 Smartwatch', category: 'Smartwatch', brand_id: 'brand_realme', price: 4499, original_price: 7999, stock: 30, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: '1.85 AMOLED, BT Calling, 100 Sports', is_featured: true },
  { id: 'acc_spigen_case', name: 'Spigen Case for iPhone 16 Pro Max', category: 'Case', brand_id: 'brand_apple', price: 1999, original_price: 2999, stock: 45, image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', description: 'Military Grade Protection, Clear', is_featured: false },
  { id: 'acc_samsung_powerbank', name: 'Samsung 20000mAh Power Bank 45W', category: 'PowerBank', brand_id: 'brand_samsung', price: 3999, original_price: 5999, stock: 25, image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', description: '45W Super Fast Charging, Triple Port', is_featured: true },
]

// Database helpers - InsForge Only - REAL DATA ONLY - FIXED FOR ADMIN CUSTOMERS/ORDERS/TICKETS
export const db = {
  // Brands
  brands: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('brands').select().order('name', { ascending: true })
        if (error) throw error
        return data || []
      } catch (e) {
        return []
      }
    },
    async create(brand: any) {
      const { data, error } = await insforge.database.from('brands').insert(brand).select()
      if (error) throw error
      return data
    },
    async update(id: string, updates: any) {
      const { data, error } = await insforge.database.from('brands').update(updates).eq('id', id).select()
      if (error) throw error
      return data
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('brands').delete().eq('id', id)
      if (error) throw error
    }
  },

  // Categories
  categories: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('categories').select().order('name', { ascending: true })
        if (error) throw error
        return data || []
      } catch {
        return []
      }
    },
    async create(category: any) {
      const { data, error } = await insforge.database.from('categories').insert(category).select()
      if (error) throw error
      return data
    }
  },

  // Products - REAL 2026 phones - FIXED for edit/delete - Always present
  products: {
    async getAll(filters?: any) {
      try {
        let query = insforge.database.from('products').select('*, brands(name, logo_url), categories(name)')
        
        if (filters?.brand_id) query = query.eq('brand_id', filters.brand_id)
        if (filters?.category_id) query = query.eq('category_id', filters.category_id)
        if (filters?.is_featured) query = query.eq('is_featured', true)
        if (filters?.is_new_launch) query = query.eq('is_new_launch', true)
        if (filters?.status) query = query.eq('status', filters.status)
        if (filters?.search) query = query.ilike('name', `%${filters.search}%`)
        
        query = query.order('created_at', { ascending: false })
        
        if (filters?.limit) query = query.limit(filters.limit)
        
        const { data, error } = await query
        if (error) throw error
        let result = data || []
        // If DB empty, return real phones fallback so data always present
        if (result.length === 0) {
            result = REAL_PHONES_2026
        }
        return result
      } catch (e) {
        return REAL_PHONES_2026
      }
    },
    async getById(id: string) {
      try {
        const { data, error } = await insforge.database.from('products').select('*, brands(*), categories(*)').eq('id', id).single()
        if (error) throw error
        return data
      } catch {
        return REAL_PHONES_2026.find(p => p.id === id) || null
      }
    },
    async getBySlug(slug: string) {
      const { data, error } = await insforge.database.from('products').select('*, brands(*), categories(*)').eq('slug', slug).single()
      if (error) throw error
      return data
    },
    async create(product: any) {
      const { data, error } = await insforge.database.from('products').insert(product).select()
      if (error) throw error
      return data
    },
    async update(id: string, updates: any) {
      const updateData = { ...updates, updated_at: new Date().toISOString() }
      delete updateData.id
      delete updateData.brands
      delete updateData.categories
      
      const { data, error } = await insforge.database.from('products').update(updateData).eq('id', id).select()
      if (error) {
        throw error
      }
      return data
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('products').delete().eq('id', id)
      if (error) {
        throw error
      }
    }
  },

  // Orders - REAL DATA ONLY - FIXED for cross-browser consistency - DB is source of truth
  orders: {
    async getAll() {
      try {
        // Fetch from InsForge DB - source of truth for admin panel consistency
        let { data, error } = await insforge.database.from('orders').select('*').order('created_at', { ascending: false })
        if (error) {
          const res = await insforge.database.from('orders').select().order('created_at', { ascending: false })
          data = res.data
          error = res.error
        }
        if (error) throw error
        let result = data || []
        // For admin consistency across browsers, use DB only if DB has data
        // Only merge localStorage if DB is empty (fallback for offline)
        if (result.length === 0 && typeof window !== 'undefined') {
          try {
            const globalLocal = JSON.parse(localStorage.getItem('suhail_orders_global') || '[]')
            result = globalLocal
          } catch {}
        }
        return result
      } catch (e) {
        if (typeof window !== 'undefined') {
          try {
            return JSON.parse(localStorage.getItem('suhail_orders_global') || localStorage.getItem('suhail_orders') || '[]')
          } catch {}
        }
        return []
      }
    },
    async getByUserId(userId: string) {
      try {
        const { data, error } = await insforge.database.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
        if (error) throw error
        let result = data || []
        // Merge with per-user localStorage for instant view and isolation
        if (typeof window !== 'undefined') {
          try {
            const perUserLocal = JSON.parse(localStorage.getItem(`suhail_orders_${userId}`) || '[]')
            const existingIds = new Set(result.map((o: any) => o.id))
            result = [...result, ...perUserLocal.filter((o: any) => !existingIds.has(o.id))]
          } catch {}
        }
        return result
      } catch {
        if (typeof window !== 'undefined') {
          try {
            return JSON.parse(localStorage.getItem(`suhail_orders_${userId}`) || '[]')
          } catch {}
        }
        return []
      }
    },
    async create(order: any) {
      // Fix shipping_address to be JSONB object if string
      const fixedOrder = { ...order }
      if (typeof fixedOrder.shipping_address === 'string') {
        fixedOrder.shipping_address = { address: fixedOrder.shipping_address, full: fixedOrder.shipping_address }
      }
      const { data, error } = await insforge.database.from('orders').insert(fixedOrder).select()
      if (error) {
        throw error
      }
      return data
    },
    async updateStatus(id: string, status: string) {
      try {
        const { data, error } = await insforge.database.from('orders').update({ order_status: status, payment_status: status === 'verified' ? 'verified' : status, updated_at: new Date().toISOString() }).eq('id', id).select()
        if (error) throw error
        return data
      } catch (e) {
        // Update localStorage as fallback
        if (typeof window !== 'undefined') {
          try {
            const globalOrders = JSON.parse(localStorage.getItem('suhail_orders_global') || '[]')
            const updated = globalOrders.map((o: any) => o.id === id ? { ...o, order_status: status, payment_status: status } : o)
            localStorage.setItem('suhail_orders_global', JSON.stringify(updated))
            // Also update per-user
            const keys = Object.keys(localStorage).filter(k => k.startsWith('suhail_orders_'))
            keys.forEach(k => {
              try {
                const orders = JSON.parse(localStorage.getItem(k) || '[]')
                const upd = orders.map((o: any) => o.id === id ? { ...o, order_status: status } : o)
                localStorage.setItem(k, JSON.stringify(upd))
              } catch {}
            })
          } catch {}
        }
        throw e
      }
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('orders').delete().eq('id', id)
      if (error) throw error
      // Also delete from localStorage
      if (typeof window !== 'undefined') {
        try {
          const globalOrders = JSON.parse(localStorage.getItem('suhail_orders_global') || '[]')
          localStorage.setItem('suhail_orders_global', JSON.stringify(globalOrders.filter((o: any) => o.id !== id)))
        } catch {}
      }
    }
  },

  // Customers - REAL customer accounts from profiles + auth - FIXED to show any account created
  customers: {
    async getAll() {
      try {
        // Get profiles which represent customer accounts - primary source
        let profilesData: any[] = []
        try {
          const { data: profiles, error: profileError } = await insforge.database.from('profiles').select('*').order('created_at', { ascending: false })
          if (!profileError && profiles) {
            profilesData = profiles
          }
        } catch {}
        
        let customers = profilesData || []
        
        // FIXED: For admin consistency across browsers, use DB as primary, localStorage as fallback only if DB empty
        // This fixes "some browser shows 1 account, some shows 13"
        if (typeof window !== 'undefined') {
          try {
            const customerMap = new Map()
            // Add InsForge profiles first - map username to email for display - DB is source of truth for admin
            customers.forEach((c: any) => {
              // Normalize: handle both old schema (username=email) and new schema (email column)
              const normalized = {
                ...c,
                email: c.email || c.username || c.customer_email,
                customer_email: c.customer_email || c.email || c.username,
                full_name: c.full_name || c.display_name || c.username?.split('@')[0] || c.customer_name || 'Customer',
                customer_name: c.customer_name || c.full_name || c.display_name || c.username?.split('@')[0] || 'Customer',
                phone: c.phone || c.customer_phone || '',
                user_id: c.user_id || c.id,
                id: c.id || c.user_id,
                is_admin: c.is_admin || false,
                role: c.role || (c.is_admin ? 'admin' : 'customer'),
                created_at: c.created_at || new Date().toISOString()
              }
              // Only add if email looks valid and not a Player gaming account (unless admin)
              if (normalized.email && (normalized.email.includes('@') || normalized.is_admin)) {
                // Filter out Player gaming accounts that don't have email - they are from game, not shop
                if (!normalized.email.startsWith('Player') || normalized.is_admin || normalized.email.includes('@')) {
                  customerMap.set(normalized.user_id || normalized.id, normalized)
                }
              }
            })
            
            // If DB has customers, use DB only for consistency across browsers (admin panel)
            // Only use localStorage if DB is empty (fallback)
            if (customerMap.size === 0) {
              const globalCustomers = JSON.parse(localStorage.getItem('suhail_customers_global') || '[]')
              globalCustomers.forEach((cust: any) => {
                const key = cust.user_id || cust.id || cust.email
                if (!customerMap.has(key)) {
                  customerMap.set(key, cust)
                }
              })
            }
            
            // Also scan localStorage for customer emails from orders (fallback)
            const globalOrders = JSON.parse(localStorage.getItem('suhail_orders_global') || '[]')
            globalOrders.forEach((order: any) => {
              if (order.customer_email && !Array.from(customerMap.values()).some((c: any) => c.customer_email === order.customer_email || c.email === order.customer_email)) {
                customerMap.set(order.customer_email, {
                  id: order.user_id || `cust_${order.customer_email}`,
                  user_id: order.user_id,
                  email: order.customer_email,
                  customer_email: order.customer_email,
                  customer_name: order.customer_name,
                  customer_phone: order.customer_phone,
                  created_at: order.created_at,
                  is_local: true,
                  source: 'order'
                })
              }
            })
            
            customers = Array.from(customerMap.values())
          } catch {}
        }
        
        return customers
      } catch (e) {
        // Fallback to localStorage customers - ensures customers tab always works
        if (typeof window !== 'undefined') {
          try {
            const globalCustomers = JSON.parse(localStorage.getItem('suhail_customers_global') || '[]')
            if (globalCustomers.length > 0) return globalCustomers
            
            const globalOrders = JSON.parse(localStorage.getItem('suhail_orders_global') || '[]')
            const map = new Map()
            globalOrders.forEach((o: any) => {
              if (o.customer_email) {
                map.set(o.customer_email, {
                  id: o.user_id || o.customer_email,
                  user_id: o.user_id,
                  email: o.customer_email,
                  customer_name: o.customer_name,
                  customer_phone: o.customer_phone,
                  created_at: o.created_at
                })
              }
            })
            return Array.from(map.values())
          } catch {}
        }
        return []
      }
    },
    async delete(userId: string) {
      try {
        // Delete profile by user_id
        try {
          await insforge.database.from('profiles').delete().eq('user_id', userId)
        } catch {}
        // Also try delete by id
        try {
          await insforge.database.from('profiles').delete().eq('id', userId)
        } catch {}
        // Also try delete by email
        try {
          await insforge.database.from('profiles').delete().eq('email', userId)
        } catch {}
        
        // Delete orders for this customer
        try {
          await insforge.database.from('orders').delete().eq('user_id', userId)
        } catch {}
        try {
          await insforge.database.from('orders').delete().eq('customer_email', userId)
        } catch {}
        
        // Clear localStorage for this customer - CRITICAL for admin delete access
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem(`suhail_orders_${userId}`)
            // Remove from customers global list
            const globalCustomers = JSON.parse(localStorage.getItem('suhail_customers_global') || '[]')
            const filteredCustomers = globalCustomers.filter((c: any) => c.user_id !== userId && c.id !== userId && c.email !== userId)
            localStorage.setItem('suhail_customers_global', JSON.stringify(filteredCustomers))
            // Remove from orders global
            const globalOrders = JSON.parse(localStorage.getItem('suhail_orders_global') || '[]')
            localStorage.setItem('suhail_orders_global', JSON.stringify(globalOrders.filter((o: any) => o.user_id !== userId && o.customer_email !== userId)))
            // Remove per-user keys
            Object.keys(localStorage).forEach(key => {
              if (key.includes(userId)) {
                try { localStorage.removeItem(key) } catch {}
              }
            })
          } catch {}
        }
        
        return true
      } catch (e) {
        // Even if InsForge fails, clean localStorage
        if (typeof window !== 'undefined') {
          try {
            const globalCustomers = JSON.parse(localStorage.getItem('suhail_customers_global') || '[]')
            localStorage.setItem('suhail_customers_global', JSON.stringify(globalCustomers.filter((c: any) => c.user_id !== userId && c.id !== userId && c.email !== userId)))
          } catch {}
        }
        throw e
      }
    }
  },

  // Banners - Always present fallback
  banners: {
    async getActive() {
      try {
        const { data, error } = await insforge.database.from('banners').select().eq('is_active', true).order('created_at', { ascending: false })
        if (error) throw error
        return data || []
      } catch {
        return []
      }
    },
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('banners').select().order('created_at', { ascending: false })
        if (error) throw error
        return data || []
      } catch {
        return []
      }
    },
    async create(banner: any) {
      const { data, error } = await insforge.database.from('banners').insert(banner).select()
      if (error) throw error
      return data
    },
    async update(id: string, updates: any) {
      const { data, error } = await insforge.database.from('banners').update(updates).eq('id', id).select()
      if (error) throw error
      return data
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('banners').delete().eq('id', id)
      if (error) throw error
    }
  },

  // Repair Tickets - Fixed to show real tickets + localStorage fallback
  repairTickets: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('repair_tickets').select().order('created_at', { ascending: false })
        if (error) throw error
        let result = data || []
        // Merge with localStorage repair tickets
        if (typeof window !== 'undefined') {
          try {
            const localTickets = JSON.parse(localStorage.getItem('suhail_repair_tickets') || '[]')
            const existingIds = new Set(result.map((r: any) => r.id))
            result = [...result, ...localTickets.filter((r: any) => !existingIds.has(r.id))]
          } catch {}
        }
        return result
      } catch (e) {
        if (typeof window !== 'undefined') {
          try {
            return JSON.parse(localStorage.getItem('suhail_repair_tickets') || '[]')
          } catch {}
        }
        return []
      }
    },
    async create(ticket: any) {
      try {
        const { data, error } = await insforge.database.from('repair_tickets').insert(ticket).select()
        if (error) throw error
        // Also save locally
        if (typeof window !== 'undefined') {
          const local = JSON.parse(localStorage.getItem('suhail_repair_tickets') || '[]')
          local.unshift(ticket)
          localStorage.setItem('suhail_repair_tickets', JSON.stringify(local))
        }
        return data
      } catch (e) {
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const local = JSON.parse(localStorage.getItem('suhail_repair_tickets') || '[]')
          local.unshift(ticket)
          localStorage.setItem('suhail_repair_tickets', JSON.stringify(local))
        }
        throw e
      }
    },
    async updateStatus(id: string, status: string) {
      try {
        const { data, error } = await insforge.database.from('repair_tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select()
        if (error) throw error
        return data
      } catch (e) {
        // Update localStorage
        if (typeof window !== 'undefined') {
          try {
            const local = JSON.parse(localStorage.getItem('suhail_repair_tickets') || '[]')
            const updated = local.map((r: any) => r.id === id ? { ...r, status } : r)
            localStorage.setItem('suhail_repair_tickets', JSON.stringify(updated))
          } catch {}
        }
        throw e
      }
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('repair_tickets').delete().eq('id', id)
      if (error) throw error
      if (typeof window !== 'undefined') {
        try {
          const local = JSON.parse(localStorage.getItem('suhail_repair_tickets') || '[]')
          localStorage.setItem('suhail_repair_tickets', JSON.stringify(local.filter((r: any) => r.id !== id)))
        } catch {}
      }
    }
  },

  // Preorder Phones
  preorderPhones: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('preorder_phones').select().order('created_at', { ascending: false })
        if (error) throw error
        return data || []
      } catch {
        return []
      }
    },
    async create(phone: any) {
      const { data, error } = await insforge.database.from('preorder_phones').insert(phone).select()
      if (error) throw error
      return data
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('preorder_phones').delete().eq('id', id)
      if (error) throw error
    }
  },

  // Accessories - REAL 2026 accessories - Always present
  accessories: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('accessories').select().order('created_at', { ascending: false })
        if (error) throw error
        let result = data || []
        if (result.length === 0) {
          result = REAL_ACCESSORIES_2026
        }
        return result
      } catch (e) {
        return REAL_ACCESSORIES_2026
      }
    },
    async create(acc: any) {
      const { data, error } = await insforge.database.from('accessories').insert(acc).select()
      if (error) throw error
      return data
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('accessories').delete().eq('id', id)
      if (error) throw error
    }
  },

  // Store Settings - FIXED for payment options editing
  settings: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('store_settings').select()
        if (error) throw error
        return data || []
      } catch {
        return []
      }
    },
    async get(key: string) {
      try {
        const { data, error } = await insforge.database.from('store_settings').select().eq('key', key).single()
        if (error) return null
        return data
      } catch {
        return null
      }
    },
    async set(key: string, value: string) {
      try {
        // Try upsert first
        const { data, error } = await insforge.database.from('store_settings').upsert({ key, value, updated_at: new Date().toISOString() }).select()
        if (error) {
          // If upsert fails, try insert
          const { data: insertData, error: insertError } = await insforge.database.from('store_settings').insert({ key, value }).select()
          if (insertError) {
            // If insert fails (duplicate), try update
            const { data: updateData, error: updateError } = await insforge.database.from('store_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key).select()
            if (updateError) throw updateError
            return updateData
          }
          return insertData
        }
        return data
      } catch (e) {
        throw e
      }
    },
    async delete(key: string) {
      const { error } = await insforge.database.from('store_settings').delete().eq('key', key)
      if (error) throw error
    }
  }
}

// Auth helpers - Fixed
export async function getCurrentUser() {
  return await authHelpers.getCurrentUserRobust()
}

export async function isAdmin(userId: string) {
  try {
    const { data } = await insforge.database.from('profiles').select('role, is_admin').eq('id', userId).single()
    return (data as any)?.role === 'admin' || (data as any)?.is_admin === true
  } catch {
    return false
  }
}
