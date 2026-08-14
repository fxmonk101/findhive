// Excel reader script
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import xlsx from 'xlsx';

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

async function readExcelFile() {
  try {
    const workbook = xlsx.readFile('../findhive/pokemon cardz.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Found ${data.length} products in Excel file`);
    console.log('Sample data:', JSON.stringify(data.slice(0, 2), null, 2));
    
    return data;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
}

readExcelFile();
