/**
 * Debug Excel file structure
 */

import XLSX from 'xlsx';

const filePath = '/Users/harryliu/Documents/gym/Master_Workout_History_FIXED.xlsx';

// Read Excel file
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data: any[] = XLSX.utils.sheet_to_json(worksheet);

console.log('Total rows:', data.length);

// Get all unique column names
const allColumns = new Set<string>();
data.forEach(row => {
  Object.keys(row).forEach(col => allColumns.add(col));
});

console.log('\nAll unique columns:');
Array.from(allColumns).sort().forEach(col => console.log('  -', col));

// Check categories
const categories = new Set<string>();
data.forEach(r => {
  if (r['Category']) categories.add(r['Category']);
});
console.log('\nUnique categories:');
Array.from(categories).sort().forEach(c => console.log('  -', c));

// Check Day column
const days = new Set<string>();
data.forEach(r => {
  if (r['Day']) days.add(String(r['Day']));
});
console.log('\nUnique Day values:');
Array.from(days).sort().forEach(d => console.log('  -', d));

// Check which rows have reps data
const withReps = data.filter(r => r['Reps_S1'] || r['Reps_S2'] || r['Reps_S3']);
console.log('\nRows with reps data:', withReps.length, '/', data.length);

console.log('\nFirst row with reps:');
console.log(JSON.stringify(withReps[0], null, 2));
