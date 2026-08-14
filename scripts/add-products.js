// Add products from Excel to database
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import xlsx from 'xlsx';
import { randomUUID } from 'crypto';

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

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Category mapping
const categories = {
  'trading-cards': 'Trading Cards',
  'pokemon-tcg': 'Pokémon TCG',
  'watches': 'Watches',
  'jewelry': 'Jewelry & Bangles',
  'outdoor-fitness': 'Outdoor & Fitness'
};

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  // Remove currency symbols and convert to number
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  // Convert XAF to USD (approximate rate: 1 XAF = 0.0016 USD)
  return num > 1000 ? num * 0.0016 : num;
}

function parseRating(ratingStr) {
  if (!ratingStr) return 4.0;
  const num = parseFloat(ratingStr);
  return isNaN(num) ? 4.0 : Math.min(5, Math.max(0, num));
}

function parseReviewCount(reviewStr) {
  if (!reviewStr) return 0;
  const cleaned = reviewStr.replace(/[^0-9K]/g, '');
  if (cleaned.includes('K')) {
    return parseFloat(cleaned.replace('K', '')) * 1000;
  }
  return parseInt(cleaned) || 0;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function addProducts() {
  try {
    // Read Excel file
    const workbook = xlsx.readFile('../findhive/pokemon cardz.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelData = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Found ${excelData.length} products in Excel file`);
    
    // Get existing products to avoid duplicates
    const { data: existingProducts } = await supabase
      .from('products')
      .select('title');
    
    const existingTitles = new Set(existingProducts?.map(p => p.title) || []);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const row of excelData) {
      const title = row.data?.trim();
      if (!title) continue;
      
      // Skip if already exists
      if (existingTitles.has(title)) {
        skippedCount++;
        continue;
      }
      
      const price = parsePrice(row.data6);
      const rating = parseRating(row.data9);
      const reviewCount = parseReviewCount(row.data4);
      const imageUrl = row.image || '';
      
      // Determine category based on title
      let category = 'trading-cards';
      let subcategory = 'pokemon-tcg';
      
      if (title.toLowerCase().includes('pokemon')) {
        category = 'trading-cards';
        subcategory = 'pokemon-tcg';
      } else if (title.toLowerCase().includes('watch')) {
        category = 'watches';
        subcategory = 'luxury-watches';
      } else if (title.toLowerCase().includes('jewelry') || title.toLowerCase().includes('bracelet') || title.toLowerCase().includes('necklace')) {
        category = 'jewelry';
        subcategory = 'bracelets';
      } else if (title.toLowerCase().includes('fitness') || title.toLowerCase().includes('outdoor')) {
        category = 'outdoor-fitness';
        subcategory = 'fitness-gear';
      }
      
      const product = {
        id: randomUUID(),
        title: title,
        category: category,
        subcategory: subcategory,
        price: price || 29.99,
        original_price: null,
        image_url: imageUrl,
        rating: rating,
        review_count: reviewCount,
        source_retailer: 'Amazon',
        source_url: row.web_scraper_start_url || '',
        description: row.data || title,
        created_at: new Date().toISOString(),
        meta_title: title,
        meta_description: `Buy ${title} at FindHive - Authentic products at great prices.`,
        short_description: title.substring(0, 150),
        long_description: title,
        sold_count: 0,
        stock_count: Math.floor(Math.random() * 50) + 10,
        viewer_count: Math.floor(Math.random() * 1000) + 100,
        images: [imageUrl],
        attributes: {},
        status: 'published',
        slug: slugify(title),
        tags: ['pokemon', 'trading-cards', 'tcg'],
        low_stock_threshold: 5,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('products').insert(product);
      
      if (error) {
        console.error(`Error adding product "${title}":`, error.message);
      } else {
        addedCount++;
        console.log(`✅ Added: ${title} ($${price.toFixed(2)})`);
      }
    }
    
    console.log(`\n✅ Complete!`);
    console.log(`Added: ${addedCount} products`);
    console.log(`Skipped: ${skippedCount} duplicates`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addProducts();
