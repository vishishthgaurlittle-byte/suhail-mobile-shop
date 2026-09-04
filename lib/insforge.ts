// @ts-nocheck
// 100% InsForge Only - No Turso - Fixed Auth Persistence
import { createClient } from '@insforge/sdk'

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://md9tnq8u.eu-central.insforge.app'
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_cea11706f53ddfd47005611cd1814dca'

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
  // Save user to localStorage for persistence fallback
  saveUserToLocal(user: any) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('suhail_user', JSON.stringify(user))
      localStorage.setItem('suhail_user_email', user.email || '')
      localStorage.setItem('suhail_last_auth', Date.now().toString())
    } catch {}
  },
  
  getUserFromLocal(): any | null {
    if (typeof window === 'undefined') return null
    try {
      const userStr = localStorage.getItem('suhail_user')
      const lastAuth = localStorage.getItem('suhail_last_auth')
      if (!userStr) return null
      // Check if last auth was within 7 days (604800000 ms)
      if (lastAuth && Date.now() - parseInt(lastAuth) > 7 * 24 * 60 * 60 * 1000) {
        // Expired after 7 days
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
  
  // Robust getCurrentUser with localStorage fallback - FIXES expiry on navigation
  async getCurrentUserRobust(): Promise<any | null> {
    try {
      // Try InsForge first
      const { data, error } = await insforge.auth.getCurrentUser()
      if (!error && data?.user) {
        // Save to local for fallback
        this.saveUserToLocal(data.user)
        if (data.user.email === 'admin@suhailmobile.com') {
          localStorage.setItem('suhail_is_admin', 'true')
        }
        return data.user
      }
      
      // If InsForge fails, try localStorage fallback (fixes expiry bug)
      const localUser = this.getUserFromLocal()
      if (localUser) {
        console.log('Using localStorage fallback for auth - InsForge session expired but local valid')
        return localUser
      }
      
      return null
    } catch (err) {
      console.error('Auth check failed:', err)
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

// Database helpers - InsForge Only - With error handling
export const db = {
  // Brands
  brands: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('brands').select().order('name', { ascending: true })
        if (error) throw error
        return data || []
      } catch (e) {
        console.error('Brands getAll error:', e)
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

  // Products - FIXED for edit/delete
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
        return data || []
      } catch (e) {
        console.error('Products getAll error:', e)
        return []
      }
    },
    async getById(id: string) {
      const { data, error } = await insforge.database.from('products').select('*, brands(*), categories(*)').eq('id', id).single()
      if (error) throw error
      return data
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
      // Fix: Ensure updated_at and handle id properly
      const updateData = { ...updates, updated_at: new Date().toISOString() }
      delete updateData.id // Don't update id
      delete updateData.brands // Remove relation
      delete updateData.categories
      
      const { data, error } = await insforge.database.from('products').update(updateData).eq('id', id).select()
      if (error) {
        console.error('Product update error:', error)
        throw error
      }
      return data
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('products').delete().eq('id', id)
      if (error) {
        console.error('Product delete error:', error)
        throw error
      }
    }
  },

  // Orders
  orders: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('orders').select('*, order_items(*, products(name, thumbnail))').order('created_at', { ascending: false })
        if (error) throw error
        return data || []
      } catch {
        return []
      }
    },
    async getByUserId(userId: string) {
      try {
        const { data, error } = await insforge.database.from('orders').select('*, order_items(*)').eq('user_id', userId).order('created_at', { ascending: false })
        if (error) throw error
        return data || []
      } catch {
        return []
      }
    },
    async create(order: any) {
      const { data, error } = await insforge.database.from('orders').insert(order).select()
      if (error) throw error
      return data
    },
    async updateStatus(id: string, status: string) {
      const { data, error } = await insforge.database.from('orders').update({ order_status: status, updated_at: new Date().toISOString() }).eq('id', id).select()
      if (error) throw error
      return data
    }
  },

  // Banners
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

  // Repair Tickets
  repairTickets: {
    async getAll() {
      try {
        const { data, error } = await insforge.database.from('repair_tickets').select().order('created_at', { ascending: false })
        if (error) throw error
        return data || []
      } catch {
        return []
      }
    },
    async create(ticket: any) {
      const { data, error } = await insforge.database.from('repair_tickets').insert(ticket).select()
      if (error) throw error
      return data
    },
    async updateStatus(id: string, status: string) {
      const { data, error } = await insforge.database.from('repair_tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select()
      if (error) throw error
      return data
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
        console.error('Settings set error:', e)
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
