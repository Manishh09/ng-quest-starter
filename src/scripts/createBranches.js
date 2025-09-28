const fs = require('fs');
const { execSync } = require('child_process');
const challengesEndpoint = 'https://api.github.com/repositories/1014427702/contents/projects/coding-challenges/src/app/challenges';
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

// Challenges with file names remain the same
const challenges = {
  'challenge-01-product-list': {
    components: ['product-list.component.ts'],
    models: ['product.model.ts'],
    services: ['product.service.ts'],
    requirementUrl: `${challengesEndpoint}/challenge-01-product-list/docs/CH-01-REQUIREMENT.md`
  },

  // 'challenge-02-parallel-apis': {
  //   components: ['user-list.component.ts', 'post-list.component.ts'],
  //   models: ['user.model.ts', 'post.model.ts'],
  //   services: ['user.service.ts', 'post.service.ts'],
  //   requirementUrl: `${challengesEndpoint}/challenge-02-parallel-apis/docs/CH-02-REQUIREMENT.md`
  // }
  // Add more challenge entries here with requirementUrl
};

const baseBranch = 'develop';

async function getRequirementContent(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch requirement from ${url}`);
  const json = await response.json();
  // GitHub API returns content base64 encoded
  const buff = Buffer.from(json.content, 'base64');
  return buff.toString('utf-8');
}

async function createBranchWithFolders(baseBranch, branchName, components = [], models = [], services = [], requirementUrl = '') {
  try {
    // Switch branch commands remain synchronous
    execSync(`git checkout ${baseBranch}`, { stdio: 'inherit' });
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

    const basePath = `src/app/${branchName}`;
    fs.mkdirSync(`${basePath}/components`, { recursive: true });
    fs.mkdirSync(`${basePath}/models`, { recursive: true });
    fs.mkdirSync(`${basePath}/services`, { recursive: true });
    fs.mkdirSync('src/app/shared', { recursive: true });

    components.forEach(name => {
      fs.writeFileSync(`${basePath}/components/${name}`, { recursive: true });
    });
    models.forEach(name => {
      fs.writeFileSync(`${basePath}/models/${name}`, { recursive: true });
    });
    services.forEach(name => {
      fs.writeFileSync(`${basePath}/services/${name}`, { recursive: true });
    });

    // Fetch requirements content from URL and write to file
    let requirementsContent = '# Default Requirements\n';
    if (requirementUrl) {
      requirementsContent = await getRequirementContent(requirementUrl);
    }
    fs.writeFileSync(`${basePath}/REQUIREMENTS.md`, requirementsContent);

    // Placeholder for approach file
    fs.writeFileSync(`${basePath}/MY_APPROACH.md`, `# Approach for ${branchName}`);

    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Add folders and requirements for ${branchName}"`, { stdio: 'inherit' });
    // execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

    console.log(`Branch ${branchName} created and pushed.`);
  } catch (error) {
    console.error(`Error creating branch ${branchName}:`, error.message);
  }
}

(async () => {
  for (const branchName in challenges) {
    const { components, models, services, requirementUrl } = challenges[branchName];
    await createBranchWithFolders(baseBranch, branchName, components, models, services, requirementUrl);
  }
})();
