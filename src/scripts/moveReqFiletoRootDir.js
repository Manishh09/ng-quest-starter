const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const branches = [
  'challenge-01-product-list',
  'challenge-02-parallel-apis',
  'challenge-03-client-side-search',
  'challenge-04-server-side-search',
  'challenge-05-product-category-management-system',
  'challenge-06-user-todos-filter',
  'challenge-07-dependent-apis',
  'challenge-08-ecommerce-checkout'
];

const angularRoot = '.'; // Change if your Angular project root is different

(async () => {
  for (const branch of branches) {
    try {
      console.log(`\n🔄 Processing branch: ${branch}`);

      // Checkout the branch
      execSync(`git checkout ${branch}`, { stdio: 'inherit' });

      const oldPath = path.join(angularRoot, `src/app/${branch}/REQUIREMENTS.md`);
      const newDir = path.join(angularRoot, 'src/docs');
      const newPath = path.join(newDir, `CH-${branch.split('-')[1].padStart(2, '0')}-REQUIREMENT.md`);

      // Create src/docs if it doesn't exist
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }

      // Move file if it exists
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Moved ${oldPath} → ${newPath}`);
      } else {
        console.warn(`⚠️ File not found: ${oldPath}`);
      }

      // Stage changes
      execSync(`git add ${newPath}`, { stdio: 'inherit' });

      // Commit changes
      execSync(`git commit -m "Move REQUIREMENTS.md for ${branch} to src/docs"`, { stdio: 'inherit' });

      // Push the branch
      execSync(`git push origin ${branch}`, { stdio: 'inherit' });

      // Optional delay for visibility
      await new Promise(res => setTimeout(res, 3000));

      console.log(`🚀 Pushed branch: ${branch}`);

    } catch (err) {
      console.error(`❌ Error processing branch ${branch}:`, err.message);
    }
  }

  console.log('\n✅ All challenge requirement files moved and pushed successfully!');
})();
// Usage: node src/scripts/moveReqFiletoRootDir.js
