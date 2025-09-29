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

const angularRoot = '.'; // Angular project root

(async () => {
  for (const branch of branches) {
    try {
      console.log(`\n🔄 Processing branch: ${branch}`);

      // Checkout branch
      execSync(`git checkout ${branch}`, { stdio: 'inherit' });

      const oldPath = path.join(angularRoot, `src/app/${branch}`);
      const newDir = path.join(angularRoot, 'src/docs');

      // Ensure src/docs exists
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }

      // List of files to move
      const filesToMove = ['REQUIREMENTS.md', 'MY_APPROACH.md'];

      filesToMove.forEach(file => {
        const oldFilePath = path.join(oldPath, file);
        const newFilePath = path.join(newDir, `${file}`);

        if (fs.existsSync(oldFilePath)) {
          if (!fs.existsSync(newFilePath)) {
            fs.renameSync(oldFilePath, newFilePath); // Moves the file (deletes at old, appears at new)
            console.log(`✅ Moved ${oldFilePath} → ${newFilePath}`);
          } else {
            console.warn(`⚠️ Destination file already exists: ${newFilePath}. Skipped moving.`);
          }
        } else {
          console.warn(`⚠️ File not found at source: ${oldFilePath}`);
        }
      });

      // Stage all changes (both deletions and additions)
      execSync(`git add -A`, { stdio: 'inherit' });

      // Commit changes
      execSync(`git commit -m "Move requirement and approach files for ${branch} to src/docs"`, { stdio: 'inherit' });

      // Push to remote branch
      execSync(`git push origin ${branch}`, { stdio: 'inherit' });

      // Optional delay
      await new Promise(res => setTimeout(res, 3000));

      console.log(`🚀 Branch ${branch} updated and pushed.`);

    } catch (err) {
      console.error(`❌ Error processing branch ${branch}:`, err.message);
    }
  }

  console.log('\n✅ All challenge files moved and pushed successfully!');
})();

// Usage: node src/scripts/moveReqFiletoRootDir.js
