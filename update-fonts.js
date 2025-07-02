const fs = require('fs');
const path = require('path');

// Function to update font references in a file
function updateFontReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Caveat font references with optimized version
    content = content.replace(
      /font-family:\s*['"]Caveat['"],\s*['"]Brush Script MT['"],\s*cursive;/g,
      "font-family: var(--caveat-font, 'Brush Script MT', cursive);"
    );
    
    content = content.replace(
      /font-family:\s*['"]Caveat['"],\s*cursive;/g,
      "font-family: var(--caveat-font, 'Brush Script MT', cursive);"
    );
    
    content = content.replace(
      /font-family:\s*["']Caveat["'];/g,
      "font-family: var(--caveat-font, 'Brush Script MT', cursive);"
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Update CSS files
const cssFiles = [
  'src/styles/Hero.css',
  'src/styles/Support.css'
];

cssFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    updateFontReferences(fullPath);
  }
});

console.log('Font reference updates completed!');
