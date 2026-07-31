const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seed.js');
let content = fs.readFileSync(filePath, 'utf8');

// The file has a productsData array. We need to assign unique SKUs to every product.
// Let's parse it somewhat manually or use regex to replace SKUs.
let counter = 1;
content = content.replace(/sku:\s*'[^']+'/g, () => {
    return `sku: 'HG-GEN-${counter++}'`;
});

fs.writeFileSync(filePath, content);
console.log('Seed file SKUs updated successfully.');
