
import { RAW_JSON_DATA } from './src/data/json_data.js';
import fs from 'fs';

// Convert to OutputData structure
const outputData = {};
RAW_JSON_DATA.forEach(country => {
  const { Code, ...rest } = country;
  outputData[Code] = rest;
});

// Write JSON to a file
fs.writeFileSync('output_data.json', JSON.stringify(outputData, null, 2));
