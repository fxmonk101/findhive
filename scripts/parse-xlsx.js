import XLSX from 'xlsx';
import fs from 'fs';

// Parse the first xlsx file to see its structure
const workbook1 = XLSX.readFile('pokemon card best sellers.xlsx');
const sheet1Name = workbook1.SheetNames[0];
const sheet1 = workbook1.Sheets[sheet1Name];
const data1 = XLSX.utils.sheet_to_json(sheet1);

console.log('=== Pokemon Card Best Sellers ===');
console.log('Columns:', Object.keys(data1[0] || {}));
console.log('Sample row:', data1[0]);
console.log('Total rows:', data1.length);
console.log('\n');

// Parse the second xlsx file to see its structure
const workbook2 = XLSX.readFile('pokemon cards finale.xlsx');
const sheet2Name = workbook2.SheetNames[0];
const sheet2 = workbook2.Sheets[sheet2Name];
const data2 = XLSX.utils.sheet_to_json(sheet2);

console.log('=== Pokemon Cards Finale ===');
console.log('Columns:', Object.keys(data2[0] || {}));
console.log('Sample row:', data2[0]);
console.log('Total rows:', data2.length);
