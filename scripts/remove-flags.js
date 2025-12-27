import fs from "fs";

const filePath = "public/data/countries.json";

const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Remove the 'flag' field from each country object
const cleaned = data.map((country) => {
  const { flag, ...rest } = country;
  return rest;
});

// Write the cleaned data back to the file
fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2));
console.log("Flag fields removed.");
