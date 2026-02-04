// Script to generate CB icon with white background and black text
const fs = require('fs');
const path = require('path');

// For now, we'll create a simple SVG and note that the user needs to convert it
// In production, you'd use a library like sharp or canvas to generate PNGs

const iconDir = path.join(__dirname, '../src-tauri/icons');

// Create SVG icon
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="white"/>
  <text x="256" y="380" font-family="Arial, sans-serif" font-size="320" font-weight="bold" text-anchor="middle" fill="black">CB</text>
</svg>`;

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

fs.writeFileSync(path.join(iconDir, 'icon.svg'), svgIcon);
console.log('SVG icon created. You may need to convert it to PNG/ICNS/ICO formats.');
