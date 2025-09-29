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

const fileRelativePath = 'src/docs/REQUIREMENTS.md';

(async () => {
  for (const branch of branches) {
    try {
      console.log(`\n🔄 Processing branch: ${branch}`);

      // Checkout branch
      execSync(`git checkout ${branch}`, { stdio: 'inherit' });

      // Full file path
      const filePath = path.join('.', fileRelativePath);

      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath);
        console.log(`✅ Deleted ${filePath}`);

        // Stage deletion
        execSync(`git add ${fileRelativePath}`, { stdio: 'inherit' });

        // Commit deletion
        execSync(`git commit -m "Delete REQUIREMENTS.md from src/docs"`, { stdio: 'inherit' });

        // Push branch
        execSync(`git push origin ${branch}`, { stdio: 'inherit' });

        await new Promise(res => setTimeout(res, 3000));

        console.log(`🚀 Branch ${branch} updated and pushed.`);
      } else {
        console.warn(`⚠️ File not found: ${filePath}. Skipping deletion.`);
      }

    } catch (err) {
      console.error(`❌ Error processing branch ${branch}:`, err.message);
    }
  }

  console.log('\n✅ Completed deleting REQUIREMENTS.md from src/docs in all branches!');
})();
