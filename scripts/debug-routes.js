const fs = require('fs');
const path = require('path');

function scanForPages(dir, baseRoute = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const routePath = item.isDirectory() ? `${baseRoute}/${item.name}` : baseRoute;

    if (item.isDirectory()) {
      routes = routes.concat(scanForPages(fullPath, routePath));
    } else if (item.name === 'page.tsx' ||  item.name === 'page.jsx') {
      routes.push({
        route: baseRoute + '/',
        filePath: fullPath,
        exists: true
      });
    }
  }

  return routes;
}

console.log('🔍 Scanning for pages...\n');
try {
  const pages = scanForPages('./app');
  console.log('📋 Found pages:');
  pages.forEach(page => {
    console.log(`${page.route} -> ${page.filePath}`);
  });

  const testPage = pages.find(p => p.route.includes('test'));
  console.log('\n🔎 Test page found:', !!testPage);
  if (testPage) {
    console.log('   Route:', testPage.route);
    console.log('   File:', testPage.filePath);
  }
} catch (error) {
  console.log('!Error scanning:', error.message);
}
