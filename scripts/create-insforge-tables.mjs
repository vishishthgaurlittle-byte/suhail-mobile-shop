// @ts-nocheck
// Create all tables in InsForge via Migrations API - 100% InsForge Only
const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://md9tnq8u.eu-central.insforge.app'
const API_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || ''

console.log('🚀 Creating tables in InsForge:', INSFORGE_URL)

const tables = [
  {
    version: '20260904000001',
    name: 'create-brands-table',
    sql: `
      CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        logo_url TEXT,
        is_featured BOOLEAN DEFAULT false,
        product_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
    `
  },
  {
    version: '20260904000002',
    name: 'create-categories-table',
    sql: `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon TEXT,
        parent_id TEXT,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    version: '20260904000003',
    name: 'create-products-table',
    sql: `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        brand_id TEXT REFERENCES brands(id),
        category_id TEXT REFERENCES categories(id),
        description TEXT,
        short_desc TEXT,
        price INTEGER NOT NULL,
        original_price INTEGER,
        specs JSONB,
        stock INTEGER DEFAULT 0,
        sku TEXT UNIQUE,
        is_featured BOOLEAN DEFAULT false,
        is_new_launch BOOLEAN DEFAULT false,
        is_best_seller BOOLEAN DEFAULT false,
        is_preorder BOOLEAN DEFAULT false,
        preorder_date DATE,
        images JSONB,
        thumbnail TEXT,
        meta_title TEXT,
        meta_desc TEXT,
        rating DECIMAL DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
      CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
      CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
    `
  },
  {
    version: '20260904000004',
    name: 'create-product-variants-table',
    sql: `
      CREATE TABLE IF NOT EXISTS product_variants (
        id TEXT PRIMARY KEY,
        product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
        color TEXT,
        storage TEXT,
        ram TEXT,
        price INTEGER,
        stock INTEGER,
        image_url TEXT,
        sku TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    version: '20260904000005',
    name: 'create-orders-table',
    sql: `
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        total_amount INTEGER NOT NULL,
        discount_amount INTEGER DEFAULT 0,
        delivery_charge INTEGER DEFAULT 0,
        payment_method TEXT,
        payment_status TEXT DEFAULT 'pending',
        order_status TEXT DEFAULT 'pending',
        shipping_address JSONB,
        customer_phone TEXT,
        customer_name TEXT,
        customer_email TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
    `
  },
  {
    version: '20260904000006',
    name: 'create-order-items-table',
    sql: `
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
        product_id TEXT REFERENCES products(id),
        variant_id TEXT,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        product_name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    version: '20260904000007',
    name: 'create-banners-table',
    sql: `
      CREATE TABLE IF NOT EXISTS banners (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        image_url TEXT NOT NULL,
        mobile_image_url TEXT,
        cta_text TEXT,
        cta_link TEXT,
        position TEXT,
        is_active BOOLEAN DEFAULT true,
        starts_at TIMESTAMPTZ,
        ends_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    version: '20260904000008',
    name: 'create-store-settings-table',
    sql: `
      CREATE TABLE IF NOT EXISTS store_settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    version: '20260904000009',
    name: 'create-repair-tickets-table',
    sql: `
      CREATE TABLE IF NOT EXISTS repair_tickets (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        device_model TEXT NOT NULL,
        device_brand TEXT,
        issue_type TEXT NOT NULL,
        issue_description TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'normal',
        assigned_to TEXT,
        estimated_cost INTEGER,
        actual_cost INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_repair_status ON repair_tickets(status);
    `
  },
  {
    version: '20260904000010',
    name: 'create-preorder-phones-table',
    sql: `
      CREATE TABLE IF NOT EXISTS preorder_phones (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand_id TEXT REFERENCES brands(id),
        expected_launch DATE,
        expected_price INTEGER,
        specs JSONB,
        image_url TEXT,
        preorder_price INTEGER,
        preorder_bonus TEXT,
        status TEXT DEFAULT 'upcoming',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    version: '20260904000011',
    name: 'create-accessories-table',
    sql: `
      CREATE TABLE IF NOT EXISTS accessories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        brand_id TEXT REFERENCES brands(id),
        price INTEGER NOT NULL,
        original_price INTEGER,
        stock INTEGER DEFAULT 0,
        image_url TEXT,
        description TEXT,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    version: '20260904000012',
    name: 'create-reviews-table',
    sql: `
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
        user_id TEXT,
        rating INTEGER CHECK(rating BETWEEN 1 AND 5),
        comment TEXT,
        images JSONB,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  }
]

async function createTables() {
  for (const table of tables) {
    console.log(`\n📦 Creating: ${table.name} (v${table.version})...`)
    try {
      const res = await fetch(`${INSFORGE_URL}/api/database/migrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'apikey': API_KEY
        },
        body: JSON.stringify({
          version: table.version,
          name: table.name,
          sql: table.sql
        })
      })

      const result = await res.text()
      console.log(`Status: ${res.status}`)
      
      if (res.ok) {
        console.log(`✅ ${table.name} created successfully`)
        console.log(result.substring(0, 500))
      } else {
        console.log(`⚠️ ${table.name} response:`, result.substring(0, 1000))
        // If already exists, continue
        if (result.includes('already exists') || result.includes('duplicate') || res.status === 409) {
          console.log(`ℹ️ ${table.name} already exists, skipping`)
        }
      }
    } catch (e) {
      console.error(`❌ Error creating ${table.name}:`, e.message)
    }
    
    // Small delay between migrations
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log('\n🎉 All tables creation attempted!')
  console.log('\n📋 Checking existing tables...')
  
  try {
    const res = await fetch(`${INSFORGE_URL}/api/database/tables`, {
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`
      }
    })
    const tablesList = await res.json()
    console.log('Existing tables:', tablesList)
  } catch (e) {
    console.error('Error listing tables:', e.message)
  }
}

createTables()
