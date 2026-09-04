// Seed InsForge with 9 real phones + 10 real accessories - Always present
const url = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://md9tnq8u.eu-central.insforge.app'
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_cea11706f53ddfd47005611cd1814dca'

const REAL_PHONES = [
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

const REAL_ACCESSORIES = [
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

async function api(path, method='GET', body=null) {
  const headers = {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
    'Content-Type': 'application/json'
  }
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  return { status: res.status, data, text }
}

async function seed() {
  console.log('Seeding real phones 2026...')
  for (const phone of REAL_PHONES) {
    // Try upsert via POST with on_conflict
    const payload = {
      id: phone.id,
      name: phone.name,
      slug: phone.slug,
      brand_id: phone.brand_id,
      category_id: phone.category_id,
      price: phone.price,
      original_price: phone.original_price,
      stock: phone.stock,
      sku: phone.sku,
      short_desc: phone.short_desc,
      description: phone.description,
      thumbnail: phone.thumbnail,
      is_featured: phone.is_featured,
      is_new_launch: phone.is_new_launch || false,
      is_best_seller: phone.is_best_seller || false,
      status: 'active',
      rating: phone.rating,
      review_count: phone.review_count
    }
    const res = await api('products', 'POST', payload)
    if (res.status === 201 || res.status === 200) {
      console.log(`✅ ${phone.name} - ₹${phone.price} - inserted`)
    } else if (res.text.includes('duplicate') || res.status === 409) {
      // Try update
      const upd = await api(`products?id=eq.${phone.id}`, 'PATCH', payload)
      console.log(`♻️ ${phone.name} - update status ${upd.status}`)
    } else {
      console.log(`❌ ${phone.name} failed ${res.status}: ${res.text.substring(0,200)}`)
    }
  }

  console.log('\nSeeding real accessories 2026...')
  for (const acc of REAL_ACCESSORIES) {
    const payload = {
      id: acc.id,
      name: acc.name,
      category: acc.category,
      brand_id: acc.brand_id,
      price: acc.price,
      original_price: acc.original_price,
      stock: acc.stock,
      image_url: acc.image_url,
      description: acc.description,
      is_featured: acc.is_featured,
      status: 'active'
    }
    const res = await api('accessories', 'POST', payload)
    if (res.status === 201 || res.status === 200) {
      console.log(`✅ ${acc.name} - ₹${acc.price}`)
    } else if (res.text.includes('duplicate') || res.status === 409) {
      const upd = await api(`accessories?id=eq.${acc.id}`, 'PATCH', payload)
      console.log(`♻️ ${acc.name} - update ${upd.status}`)
    } else {
      console.log(`❌ ${acc.name} failed ${res.status}: ${res.text.substring(0,200)}`)
    }
  }

  // Check counts
  const prodCheck = await api('products?select=id', 'GET')
  console.log(`\nProducts count: ${Array.isArray(prodCheck.data) ? prodCheck.data.length : 'unknown'}`)
  const accCheck = await api('accessories?select=id', 'GET')
  console.log(`Accessories count: ${Array.isArray(accCheck.data) ? accCheck.data.length : 'unknown'}`)
}

seed()
