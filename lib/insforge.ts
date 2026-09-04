// @ts-nocheck
// 100% InsForge Only - No Turso
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

// Database helpers - InsForge Only
export const db = {
  // Brands
  brands: {
    async getAll() {
      const { data, error } = await insforge.database.from('brands').select().order('name', { ascending: true })
      if (error) throw error
      return data || []
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
      const { data, error } = await insforge.database.from('categories').select().order('name', { ascending: true })
      if (error) throw error
      return data || []
    },
    async create(category: any) {
      const { data, error } = await insforge.database.from('categories').insert(category).select()
      if (error) throw error
      return data
    }
  },

  // Products
  products: {
    async getAll(filters?: any) {
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
      const { data, error } = await insforge.database.from('products').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select()
      if (error) throw error
      return data
    },
    async delete(id: string) {
      const { error } = await insforge.database.from('products').delete().eq('id', id)
      if (error) throw error
    }
  },

  // Orders
  orders: {
    async getAll() {
      const { data, error } = await insforge.database.from('orders').select('*, order_items(*, products(name, thumbnail))').order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    async getByUserId(userId: string) {
      const { data, error } = await insforge.database.from('orders').select('*, order_items(*)').eq('user_id', userId).order('created_at', { ascending: false })
      if (error) throw error
      return data || []
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
      const { data, error } = await insforge.database.from('banners').select().eq('is_active', true).order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    async getAll() {
      const { data, error } = await insforge.database.from('banners').select().order('created_at', { ascending: false })
      if (error) throw error
      return data || []
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
      const { data, error } = await insforge.database.from('repair_tickets').select().order('created_at', { ascending: false })
      if (error) throw error
      return data || []
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
      const { data, error } = await insforge.database.from('preorder_phones').select().order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    async create(phone: any) {
      const { data, error } = await insforge.database.from('preorder_phones').insert(phone).select()
      if (error) throw error
      return data
    }
  },

  // Store Settings
  settings: {
    async getAll() {
      const { data, error } = await insforge.database.from('store_settings').select()
      if (error) throw error
      return data || []
    },
    async get(key: string) {
      const { data, error } = await insforge.database.from('store_settings').select().eq('key', key).single()
      if (error) return null
      return data
    },
    async set(key: string, value: string) {
      const { data, error } = await insforge.database.from('store_settings').upsert({ key, value, updated_at: new Date().toISOString() }).select()
      if (error) throw error
      return data
    }
  }
}

// Auth helpers
export async function getCurrentUser() {
  try {
    const { data, error } = await insforge.auth.getCurrentUser()
    if (error) return null
    return data?.user || null
  } catch {
    return null
  }
}

export async function isAdmin(userId: string) {
  try {
    // Check if user has admin role in profiles table or check email
    const { data } = await insforge.database.from('profiles').select('role').eq('id', userId).single()
    return (data as any)?.role === 'admin'
  } catch {
    // Fallback: check if email is admin
    return false
  }
}
