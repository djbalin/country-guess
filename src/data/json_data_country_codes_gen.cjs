const fs = require("fs");
const path = require("path");

// Read the json_data.ts file as text
const inputPath = path.join(__dirname, "json_data.ts");
const outputDataPath = path.join(__dirname, "json_data2.js");
const outputCodesPath = path.join(__dirname, "country_codes.js");
const input = fs.readFileSync(inputPath, "utf8");

// Extract the array
const match = input.match(/export const JSON_DATA = (\[.*\]);/s);
if (!match) {
  throw new Error("Could not find JSON_DATA array in json_data.ts");
}
let arrText = match[1];

// Parse the array as JS (not JSON, so use eval in a sandbox)
let arr;
try {
  arr = eval(arrText);
} catch (e) {
  throw new Error("Failed to eval JSON_DATA array: " + e.message);
}

// 1. Remove Country field and write new array
const arrNoCountry = arr.map(({ Country, ...rest }) => rest);
const outputData = `export const JSON_DATA = ${JSON.stringify(
  arrNoCountry,
  null,
  2
)};\n`;
fs.writeFileSync(outputDataPath, outputData);
console.log("Wrote", outputDataPath);

// 2. Create country_codes.js
const codeToCountry = {};
for (const obj of arr) {
  if (obj.Code && obj.Country) {
    codeToCountry[obj.Code] = obj.Country;
  }
}
const outputCodes = `export const COUNTRY_CODES = ${JSON.stringify(
  codeToCountry,
  null,
  2
)};\n`;
fs.writeFileSync(outputCodesPath, outputCodes);
console.log("Wrote", outputCodesPath);
