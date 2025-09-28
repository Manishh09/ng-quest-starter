const fs = require('fs');
const { execSync } = require('child_process');

// List of challenge branch names (copy-paste from your image)
const branchNames = [
  'challenge-01-product-list',
  // 'challenge-02-parallel-apis',
  // 'challenge-03-client-side-search',
  // 'challenge-04-server-side-search',
  // 'challenge-05-product-category-management-system',
  // 'challenge-06-user-todos-filter',
  // 'challenge-07-dependent-apis',
  // 'challenge-08-ecommerce-checkout'
];

// Provide your main branch name
const baseBranch = 'develop';

// // Optionally provide folder names (customize per challenge if needed)
// const components = ['header', 'footer', 'button'];
// const models = ['user', 'product'];
// const services = ['auth', 'data'];

function createBranchWithFolders(baseBranch, branchName, components = [], models = [], services = []) {
  try {
    execSync(`git checkout ${baseBranch}`, { stdio: 'inherit' });
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

    const basePath = `src/app/${branchName}`;
    fs.mkdirSync(`${basePath}/components`, { recursive: true });
    fs.mkdirSync(`${basePath}/models`, { recursive: true });
    fs.mkdirSync(`${basePath}/services`, { recursive: true });
    fs.mkdirSync(`${basePath}/requirements`, { recursive: true });

    fs.mkdirSync('src/app/shared', { recursive: true });

    // components.forEach(name => {
    //   fs.mkdirSync(`${basePath}/components/${name}`, { recursive: true });
    // });
    // models.forEach(name => {
    //   fs.mkdirSync(`${basePath}/models/${name}`, { recursive: true });
    // });
    // services.forEach(name => {
    //   fs.mkdirSync(`${basePath}/services/${name}`, { recursive: true });
    // });

    // Add README files so folders are tracked by git
    fs.writeFileSync(`${basePath}/requirements/REQUIREMENTS.md`, `# Requirements for ${branchName}`);


    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Add folders for ${branchName}"`, { stdio: 'inherit' });
    execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

    console.log(`Branch ${branchName} created and pushed.`);
  } catch (error) {
    console.error(`Error creating branch ${branchName}:`, error.message);
  }
}

// Loop through your challenge branch names and create everything
branchNames.forEach(branchName => {
  createBranchWithFolders(baseBranch, branchName, components, models, services);
});
