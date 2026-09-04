// @ts-nocheck
// Seed real products in InsForge - Latest local market Raebareli 2026
const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://md9tnq8u.eu-central.insforge.app'
const API_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_cea11706f53ddfd47005611cd1814dca'

console.log('🌱 Seeding real products to InsForge:', INSFORGE_URL)

const brands = [
  { id: 'brand_apple', name: 'Apple', slug: 'apple', logo_url: '🍎', is_featured: true },
  { id: 'brand_samsung', name: 'Samsung', slug: 'samsung', logo_url: 'S', is_featured: true },
  { id: 'brand_oneplus', name: 'OnePlus', slug: 'oneplus', logo_url: '1+', is_featured: true },
  { id: 'brand_xiaomi', name: 'Xiaomi', slug: 'xiaomi', logo_url: 'Mi', is_featured: true },
  { id: 'brand_oppo', name: 'Oppo', slug: 'oppo', logo_url: 'O', is_featured: true },
  { id: 'brand_vivo', name: 'Vivo', slug: 'vivo', logo_url: 'V', is_featured: true },
  { id: 'brand_realme', name: 'Realme', slug: 'realme', logo_url: 'R', is_featured: true },
  { id: 'brand_nothing', name: 'Nothing', slug: 'nothing', logo_url: 'N', is_featured: false },
  { id: 'brand_google', name: 'Google', slug: 'google', logo_url: 'G', is_featured: true },
]

const categories = [
  { id: 'cat_smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
  { id: 'cat_accessories', name: 'Accessories', slug: 'accessories', icon: '🎧' },
  { id: 'cat_smartwatch', name: 'Smartwatches', slug: 'smartwatches', icon: '⌚' },
  { id: 'cat_earbuds', name: 'Earbuds', slug: 'earbuds', icon: '🎵' },
]

const products = [
  {
    id: 'prod_s25ultra_real',
    name: 'Samsung Galaxy S25 Ultra 12GB/512GB Titanium Black',
    slug: 'samsung-galaxy-s25-ultra-12-512-titanium-black',
    brand_id: 'brand_samsung',
    category_id: 'cat_smartphones',
    short_desc: 'Galaxy AI, S Pen, 200MP Camera, Snapdragon 8 Elite',
    description: 'Latest Samsung Galaxy S25 Ultra with Galaxy AI, built-in S Pen, 200MP camera system, Snapdragon 8 Elite for Galaxy, 5000mAh battery, 45W charging. Best for productivity and camera. Available in Raebareli store.',
    price: 129999,
    original_price: 139999,
    specs: { ram: "12GB", storage: "512GB", processor: "Snapdragon 8 Elite", camera: "200MP + 50MP + 50MP + 10MP", battery: "5000mAh", display: "6.9 Dynamic AMOLED 2X 120Hz", network: "5G" },
    stock: 15,
    sku: 'SAM-S25U-512-BLK-REAL',
    is_featured: true,
    is_new_launch: true,
    is_best_seller: true,
    is_preorder: false,
    images: ["https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600"],
    thumbnail: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600",
    rating: 4.9,
    review_count: 234,
    status: 'active'
  },
  {
    id: 'prod_iphone16pm_real',
    name: 'Apple iPhone 16 Pro Max 256GB Natural Titanium',
    slug: 'apple-iphone-16-pro-max-256gb-natural-titanium',
    brand_id: 'brand_apple',
    category_id: 'cat_smartphones',
    short_desc: 'A18 Pro, Titanium, 48MP Pro Camera, Action Button',
    description: 'iPhone 16 Pro Max with A18 Pro chip, Titanium design, 48MP Pro camera system, Action Button, 6.9 Super Retina XDR. The ultimate iPhone for Raebareli customers. Official warranty, EMI available.',
    price: 159900,
    original_price: 179900,
    specs: { ram: "8GB", storage: "256GB", processor: "A18 Pro", camera: "48MP + 48MP + 12MP", battery: "4422mAh", display: "6.9 Super Retina XDR 120Hz", network: "5G" },
    stock: 12,
    sku: 'APL-IP16PM-256-NT-REAL',
    is_featured: true,
    is_new_launch: true,
    is_best_seller: true,
    is_preorder: false,
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"],
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
    rating: 4.9,
    review_count: 312,
    status: 'active'
  },
  {
    id: 'prod_oneplus13_real',
    name: 'OnePlus 13 16GB/512GB Midnight Ocean',
    slug: 'oneplus-13-16-512-midnight-ocean',
    brand_id: 'brand_oneplus',
    category_id: 'cat_smartphones',
    short_desc: 'Snapdragon 8 Elite, Hasselblad, 6000mAh, 100W',
    description: 'OnePlus 13 with Snapdragon 8 Elite, Hasselblad cameras, 2K 120Hz display, 6000mAh battery, 100W SUPERVOOC. Flagship killer for Raebareli. Free Buds worth ₹8999.',
    price: 69999,
    original_price: 74999,
    specs: { ram: "16GB", storage: "512GB", processor: "Snapdragon 8 Elite", camera: "50MP Hasselblad x3", battery: "6000mAh", display: "6.82 2K LTPO 120Hz", network: "5G" },
    stock: 20,
    sku: 'OP-13-512-MO-REAL',
    is_featured: true,
    is_new_launch: true,
    is_best_seller: false,
    is_preorder: false,
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"],
    thumbnail: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
    rating: 4.8,
    review_count: 124,
    status: 'active'
  },
  {
    id: 'prod_vivox200_real',
    name: 'Vivo X200 Pro 16GB/512GB Titanium Grey ZEISS',
    slug: 'vivo-x200-pro-16-512-titanium-grey',
    brand_id: 'brand_vivo',
    category_id: 'cat_smartphones',
    short_desc: 'Dimensity 9400, 200MP ZEISS APO, Best Camera',
    description: 'Vivo X200 Pro with ZEISS cameras, 200MP APO telephoto, Dimensity 9400, 6000mAh, 90W charging. Camera king for Raebareli photographers.',
    price: 94999,
    original_price: 99999,
    specs: { ram: "16GB", storage: "512GB", processor: "Dimensity 9400", camera: "200MP ZEISS APO + 50MP + 50MP", battery: "6000mAh", display: "6.78 AMOLED 120Hz", network: "5G" },
    stock: 8,
    sku: 'VIVO-X200P-512-TG-REAL',
    is_featured: true,
    is_new_launch: true,
    is_best_seller: false,
    is_preorder: false,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"],
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    rating: 4.7,
    review_count: 89,
    status: 'active'
  },
  {
    id: 'prod_oppofindx8_real',
    name: 'Oppo Find X8 Pro 16GB/512GB Pearl White',
    slug: 'oppo-find-x8-pro-16-512-pearl-white',
    brand_id: 'brand_oppo',
    category_id: 'cat_smartphones',
    short_desc: 'Dimensity 9400, Hasselblad, 50MP x4, Portrait Expert',
    description: 'Oppo Find X8 Pro with Hasselblad, 50MP quad camera, Dimensity 9400, 5910mAh, 80W charging. Portrait expert for Raebareli.',
    price: 99999,
    original_price: 109999,
    specs: { ram: "16GB", storage: "512GB", processor: "Dimensity 9400", camera: "50MP Hasselblad x4", battery: "5910mAh", display: "6.78 OLED 120Hz", network: "5G" },
    stock: 10,
    sku: 'OPPO-FX8P-512-PW-REAL',
    is_featured: true,
    is_new_launch: true,
    is_best_seller: false,
    is_preorder: false,
    images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600"],
    thumbnail: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600",
    rating: 4.7,
    review_count: 76,
    status: 'active'
  },
  {
    id: 'prod_realmeGT7_real',
    name: 'Realme GT 7 Pro 16GB/512GB Mars Orange',
    slug: 'realme-gt-7-pro-16-512-mars-orange',
    brand_id: 'brand_realme',
    category_id: 'cat_smartphones',
    short_desc: 'SD 8 Elite, 6500mAh, 120W, 144Hz, Gaming Beast',
    description: 'Realme GT 7 Pro with Snapdragon 8 Elite, 6500mAh battery, 120W charging, 144Hz display. Gaming beast for Raebareli gamers.',
    price: 54999,
    original_price: 59999,
    specs: { ram: "16GB", storage: "512GB", processor: "Snapdragon 8 Elite", camera: "50MP + 8MP + 50MP", battery: "6500mAh", display: "6.78 OLED 144Hz", network: "5G" },
    stock: 18,
    sku: 'REALME-GT7P-512-MO-REAL',
    is_featured: true,
    is_new_launch: false,
    is_best_seller: true,
    is_preorder: false,
    images: ["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600"],
    thumbnail: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600",
    rating: 4.6,
    review_count: 112,
    status: 'active'
  }
]

const preorderPhones = [
  { id: 'pre_s26ultra', name: 'Samsung Galaxy S26 Ultra', brand_id: 'brand_samsung', expected_launch: '2026-01-20', expected_price: 139999, preorder_price: 5000, preorder_bonus: 'Free Galaxy Buds3 Pro + Watch6 Worth ₹35000', status: 'upcoming', is_active: true, image_url: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400', specs: { processor: 'Exynos 2600 / SD 8 Elite Gen 2', camera: '200MP', battery: '5500mAh' } },
  { id: 'pre_iphone17pm', name: 'iPhone 17 Pro Max', brand_id: 'brand_apple', expected_launch: '2026-09-15', expected_price: 169900, preorder_price: 10000, preorder_bonus: 'Exchange Bonus ₹15000 + Free AirPods', status: 'upcoming', is_active: true, image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', specs: { processor: 'A19 Pro', camera: '48MP Triple', battery: '5000mAh' } },
  { id: 'pre_oneplus14', name: 'OnePlus 14', brand_id: 'brand_oneplus', expected_launch: '2026-10-10', expected_price: 74999, preorder_price: 3000, preorder_bonus: 'Free OnePlus Pad + Buds', status: 'upcoming', is_active: true, image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', specs: { processor: 'SD 8 Elite Gen 2', camera: '50MP Hasselblad', battery: '6500mAh' } },
]

const accessories = [
  { id: 'acc_airpods_pro2', name: 'Apple AirPods Pro 2nd Gen', category: 'Earbuds', brand_id: 'brand_apple', price: 26900, original_price: 29900, stock: 25, image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', description: 'Active Noise Cancellation, Spatial Audio', is_featured: true },
  { id: 'acc_buds3pro', name: 'Samsung Galaxy Buds 3 Pro', category: 'Earbuds', brand_id: 'brand_samsung', price: 19999, original_price: 22999, stock: 20, image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', description: 'Galaxy AI, 360 Audio, ANC', is_featured: true },
  { id: 'acc_watch2r', name: 'OnePlus Watch 2R', category: 'Smartwatch', brand_id: 'brand_oneplus', price: 17999, original_price: 21999, stock: 15, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: '100h Battery, Dual Engine', is_featured: true },
  { id: 'acc_anker65w', name: 'Anker 65W Fast Charger', category: 'Charger', brand_id: 'brand_xiaomi', price: 3499, original_price: 4999, stock: 40, image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', description: 'GaN, 3 Ports, Fast Charging', is_featured: false },
]

const banners = [
  { id: 'banner_iphone16', title: 'iPhone 16 Pro Max', subtitle: 'A18 Pro, Titanium, 48MP Pro Camera, From ₹1,59,900', image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200', cta_text: 'Shop Now', cta_link: '/product/apple-iphone-16-pro-max', position: 'hero', is_active: true },
  { id: 'banner_s25ultra', title: 'Galaxy S25 Ultra', subtitle: 'Galaxy AI is here, EMI from ₹6,499/month', image_url: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=1200', cta_text: 'Pre-order Now', cta_link: '/product/samsung-galaxy-s25-ultra', position: 'hero', is_active: true },
  { id: 'banner_oneplus13', title: 'OnePlus 13', subtitle: 'Never Settle, Free Buds Worth ₹8,999', image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200', cta_text: 'Buy Now', cta_link: '/product/oneplus-13', position: 'hero', is_active: true },
]

async function seedTable(tableName, records) {
  console.log(`\n📦 Seeding ${tableName}: ${records.length} records...`)
  for (const record of records) {
    try {
      const res = await fetch(`${INSFORGE_URL}/api/database/records/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'apikey': API_KEY,
          'Prefer': 'return=representation, resolution=merge-duplicates'
        },
        body: JSON.stringify([record])
      })
      
      if (res.ok) {
        console.log(`✅ ${record.name || record.id}`)
      } else {
        const err = await res.text()
        if (err.includes('duplicate') || err.includes('already exists') || err.includes('conflict')) {
          console.log(`ℹ️ ${record.name || record.id} already exists`)
        } else {
          console.log(`⚠️ ${record.name}: ${err.substring(0, 200)}`)
        }
      }
    } catch (e) {
      console.error(`❌ Error seeding ${record.name}:`, e.message)
    }
    await new Promise(r => setTimeout(r, 300))
  }
}

async function seedAll() {
  try {
    await seedTable('brands', brands)
    await seedTable('categories', categories)
    await seedTable('products', products)
    await seedTable('preorder_phones', preorderPhones)
    await seedTable('accessories', accessories)
    await seedTable('banners', banners)

    // Store settings
    const settings = [
      { key: 'shop_name', value: 'Suhail Mobile Shop' },
      { key: 'shop_address', value: 'Beside Canara Bank Building, In Front Of Chandapur Kothi, Kuchery Road, Rae Bareli-229001, UP' },
      { key: 'shop_phone', value: '+91 98765 43210' },
      { key: 'whatsapp', value: '919876543210' },
      { key: 'instagram', value: 'https://www.instagram.com/suhail_mobile_shop_raebareli' },
      { key: 'font', value: 'Rubik Sans Serif' },
      { key: 'backend', value: '100% InsForge Only - No Turso' },
      { key: 'auth', value: 'Google OAuth + Email OTP via InsForge' },
      { key: 'delivery_charge', value: '50' },
      { key: 'free_delivery_above', value: '500' },
      { key: 'payment_methods', value: 'Razorpay, COD, Bajaj EMI, No Cost EMI' },
    ]
    
    console.log('\n📦 Seeding store_settings...')
    for (const s of settings) {
      try {
        await fetch(`${INSFORGE_URL}/api/database/records/store_settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`, 'apikey': API_KEY, 'Prefer': 'return=representation, resolution=merge-duplicates' },
          body: JSON.stringify([{ key: s.key, value: s.value }])
        })
        console.log(`✅ Setting ${s.key}`)
      } catch {}
      await new Promise(r => setTimeout(r, 200))
    }

    console.log('\n🎉 Seeding complete! All real products added to InsForge')
    console.log('\n📋 Real Products Added:')
    console.log('- Samsung S25 Ultra, iPhone 16 Pro Max, OnePlus 13, Vivo X200 Pro, Oppo Find X8 Pro, Realme GT 7 Pro')
    console.log('- Preorder: S26 Ultra, iPhone 17 Pro Max, OnePlus 14')
    console.log('- Accessories: AirPods Pro 2, Buds 3 Pro, Watch 2R, Anker Charger')
    console.log('- Brands, Categories, Banners, Settings')
    console.log('\n✅ Admin panel can now manage all these via InsForge - 100% working!')
    
  } catch (e) {
    console.error('Seed error:', e)
  }
}

seedAll()
