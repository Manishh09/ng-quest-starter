const { execSync } = require('child_process');

const baseBranch = 'develop';

// ✅ challenge branches
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

function run(cmd) {
  console.log(`\n▶️ Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

(async () => {
  try {
    // First make sure develop is up to date
    run(`git checkout ${baseBranch}`);
    run(`git pull origin ${baseBranch}`);

    // Loop through all challenge branches
    for (const branch of branches) {
      try {
        console.log(`\n🔄 Syncing ${branch} with ${baseBranch}...`);

        // checkout branch
        run(`git checkout ${branch}`);

        // merge latest develop into it
        run(`git pull origin ${baseBranch}`);

        // push updated branch
        run(`git push origin ${branch}`);

        // delay for clarity in logs
        await new Promise((res) => setTimeout(res, 2000));

        console.log(`✅ ${branch} synced with ${baseBranch}\n`);
      } catch (err) {
        console.error(`❌ Failed to sync ${branch}:`, err.message);
      }
    }

    // go back to develop at end
    run(`git checkout ${baseBranch}`);

    console.log("\n🎉 All challenge branches merged with develop and pushed!");
  } catch (err) {
    console.error("🚨 Script failed:", err.message);
  }
})();
