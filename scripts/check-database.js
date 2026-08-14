// Database diagnostic script
// Run with: node scripts/check-database.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env file manually
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim().replace(/"/g, '');
  }
});

const SUPABASE_URL = envVars.SUPABASE_URL || envVars.VITE_SUPABASE_URL;
const SUPABASE_KEY = envVars.SUPABASE_PUBLISHABLE_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database...\n');
  
  // Check products
  console.log('📦 Checking products table...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title, price, stock_count, status')
    .limit(5);
  
  if (productsError) {
    console.error('❌ Products query failed:', productsError.message);
  } else {
    console.log(`✅ Found ${products.length} products`);
    if (products.length > 0) {
      console.log('Sample products:', products.map(p => ({ id: p.id, title: p.title, price: p.price, status: p.status })));
    } else {
      console.log('⚠️  No products in database - you need to add products');
    }
  }
  
  // Check user_roles
  console.log('\n👤 Checking user_roles table...');
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('*');
  
  if (rolesError) {
    console.error('❌ User roles query failed:', rolesError.message);
  } else {
    console.log(`✅ Found ${roles.length} admin users`);
    if (roles.length > 0) {
      console.log('Admin roles:', roles);
    } else {
      console.log('⚠️  No admin users - you need to set up admin access');
    }
  }
  
  // Check categories
  console.log('\n📂 Checking categories table...');
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, slug')
    .limit(5);
  
  if (categoriesError) {
    console.error('❌ Categories query failed:', categoriesError.message);
  } else {
    console.log(`✅ Found ${categories.length} categories`);
    if (categories.length > 0) {
      console.log('Categories:', categories);
    } else {
      console.log('⚠️  No categories - you may need to add categories');
    }
  }
  
  console.log('\n✅ Database check complete');
}

checkDatabase().catch(console.error);
