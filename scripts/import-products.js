import XLSX from 'xlsx';
import fs from 'fs';

// Helper function to extract price from various price columns
function extractPrice(row) {
  // Try different price columns
  const priceColumns = ['price', 'price2', 'price3', 'price4', 'price5', 'price6', 'price7', 'price8', 'price9'];
  
  for (const col of priceColumns) {
    if (row[col]) {
      // Extract numeric value from price string (e.g., "48." -> 48.00, "$34.95" -> 34.95)
      const match = row[col].match(/[\d.]+/);
      if (match) {
        const price = parseFloat(match[0]);
        if (!isNaN(price) && price > 0) {
          return price;
        }
      }
    }
  }
  return 0;
}

// Helper function to extract rating
function extractRating(row) {
  const ratingColumns = ['data10', 'data12', 'data28'];
  for (const col of ratingColumns) {
    if (row[col]) {
      const match = row[col].match(/(\d+\.?\d*)/);
      if (match) {
        const rating = parseFloat(match[0]);
        if (!isNaN(rating) && rating >= 0 && rating <= 5) {
          return rating;
        }
      }
    }
  }
  return 0;
}

// Helper function to extract review count
function extractReviewCount(row) {
  const reviewColumns = ['data3', 'data4', 'data5'];
  for (const col of reviewColumns) {
    if (row[col]) {
      const match = row[col].match(/(\d+)/);
      if (match) {
        return parseInt(match[0]);
      }
    }
  }
  return 0;
}

// Helper function to generate SKU
function generateSKU(name, index) {
  const prefix = 'PKM';
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase();
  const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${cleanName}-${randomSuffix}`;
}

// Helper function to generate URL slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}

// Process a single row into product format
function processRow(row, index, source) {
  const productName = row.data || row.data2 || 'Unknown Product';
  const price = extractPrice(row);
  const rating = extractRating(row);
  const reviewCount = extractReviewCount(row);
  const imageUrl = row.image || row.image2 || '';
  
  return {
    title: productName,
    description: row.data2 || row.data5 || '',
    category: 'Trading Cards',
    subcategory: 'Pokémon TCG',
    price: price || 0,
    rating: rating || 0,
    review_count: reviewCount || 0,
    image_url: imageUrl,
    source_retailer: 'Amazon',
    source_url: row.web_scraper_start_url || '',
    sku: generateSKU(productName, index),
    url_slug: generateSlug(productName),
    is_active: true,
    is_featured: index < 10, // First 10 products are featured
    tags: ['Pokemon', 'TCG', 'Trading Cards', 'Collectible'],
    specifications: {
      source_file: source,
      web_scraper_order: row.web_scraper_order,
      amazon_url: row.web_scraper_start_url
    }
  };
}

// Parse and process both files
function processAllFiles() {
  const allProducts = [];
  
  // Process first file
  const workbook1 = XLSX.readFile('pokemon card best sellers.xlsx');
  const sheet1Name = workbook1.SheetNames[0];
  const sheet1 = workbook1.Sheets[sheet1Name];
  const data1 = XLSX.utils.sheet_to_json(sheet1);
  
  data1.forEach((row, index) => {
    const product = processRow(row, index, 'pokemon card best sellers.xlsx');
    allProducts.push(product);
  });
  
  // Process second file
  const workbook2 = XLSX.readFile('pokemon cards finale.xlsx');
  const sheet2Name = workbook2.SheetNames[0];
  const sheet2 = workbook2.Sheets[sheet2Name];
  const data2 = XLSX.utils.sheet_to_json(sheet2);
  
  data2.forEach((row, index) => {
    const product = processRow(row, index + data1.length, 'pokemon cards finale.xlsx');
    allProducts.push(product);
  });
  
  return allProducts;
}

// Generate SQL INSERT statements
function generateSQLInserts(products) {
  const inserts = products.map((product, index) => {
    const now = new Date().toISOString();
    return `INSERT INTO public.products (title, description, category, subcategory, price, rating, review_count, image_url, source_retailer, source_url, sku, url_slug, is_active, is_featured, tags, specifications, created_at, updated_at)
VALUES (
  '${product.title.replace(/'/g, "''")}',
  '${(product.description || '').replace(/'/g, "''")}',
  '${product.category}',
  '${product.subcategory}',
  ${product.price},
  ${product.rating},
  ${product.review_count},
  '${product.image_url}',
  '${product.source_retailer}',
  '${product.source_url}',
  '${product.sku}',
  '${product.url_slug}',
  ${product.is_active},
  ${product.is_featured},
  ARRAY[${product.tags.map(t => `'${t}'`).join(', ')}],
  '${JSON.stringify(product.specifications).replace(/'/g, "''")}'::jsonb,
  '${now}',
  '${now}'
);`;
  });
  
  return inserts.join('\n');
}

// Main execution
const products = processAllFiles();
console.log(`Processed ${products.length} products from both files`);

// Save as JSON for inspection
fs.writeFileSync('products-import.json', JSON.stringify(products, null, 2));
console.log('Saved products to products-import.json');

// Generate SQL file
const sql = `-- Import products from xlsx files
-- Generated on ${new Date().toISOString()}

${generateSQLInserts(products)}`;

fs.writeFileSync('products-import.sql', sql);
console.log('Generated SQL file: products-import.sql');

// Show sample
console.log('\nSample product:');
console.log(JSON.stringify(products[0], null, 2));
