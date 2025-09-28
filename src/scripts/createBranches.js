const fs = require('fs');
const { execSync } = require('child_process');
const challengesEndpoint = 'https://api.github.com/repositories/1014427702/contents/projects/coding-challenges/src/app/challenges';

const execOptions = {
  stdio: 'inherit',
  cwd: angularProjectRoot,
  env: {...process.env, NG_CLI_ANALYTICS: 'ci'} // disables analytics prompt
};

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
    components: ['product-list'],
    models: ['product'],
    services: ['product'],
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
const angularProjectRoot = '.'; // Change if your ng project root is different

// Helper: fetch and decode base64 requirements content from GitHub API
async function getRequirementContent(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch requirement from ${url}`);
  const json = await response.json();
  if (!json.content) throw new Error('API response missing content field');
  const buff = Buffer.from(json.content, 'base64');
  return buff.toString('utf-8');
}

// Helper: generate Angular artifact using CLI
function generateAngularArtifact(type, name, relativePath) {
  try {
    // ng g c componentName --path=relativePath
    // --skip-tests to avoid spec files, remove if tests needed

    if (['component', 'service'].includes(type)) {
      execSync(`ng generate ${type} ${name} --path=${relativePath} --skip-tests`, execOptions);
    } else {
      execSync(`ng generate ${type} ${name} --path=${relativePath}`, execOptions);  // models don't have --skip-tests
    }
    console.log(`${type} '${name}' generated at '${relativePath}'`);
  } catch (error) {
    console.error(`Error generating ${type} '${name}':`, error.message);
  }
}

async function createBranchWithFolders(baseBranch, branchName, components = [], models = [], services = [], requirementUrl = '') {
  try {
    // Checkout base branch and create new branch
    execSync(`git checkout ${baseBranch}`, { stdio: 'inherit' });
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

    const basePath = `src/app/${branchName}`;

    // Create base folders and shared folder
    // fs.mkdirSync(`${basePath}/components`, { recursive: true });
    // fs.mkdirSync(`${basePath}/models`, { recursive: true });
    // fs.mkdirSync(`${basePath}/services`, { recursive: true });
    fs.mkdirSync('src/app/shared', { recursive: true });

    // Fetch requirements content and write to file
    let requirementsContent = '# Default Requirements\nNo content available.';
    if (requirementUrl) {
      requirementsContent = await getRequirementContent(requirementUrl);
    }
    fs.writeFileSync(`${basePath}/REQUIREMENTS.md`, requirementsContent);

    // Placeholder MY_APPROACH file
    const approachContent = `# My Approach\nDescribe your approach here. \n # Approach for ${branchName}\n # Why Write Your Approach First?\n
Writing down your approach before you start coding helps you clarify your thoughts, plan your solution, and catch potential issues early. It's a crucial step that increases your problem-solving effectiveness and code quality.`;
    fs.writeFileSync(`${basePath}/MY_APPROACH.md`, approachContent);

    // Generate Angular components, models, services under their respective folders
    if (components.length) {
      components.forEach(name => {
        generateAngularArtifact('component', name, `${basePath}/components`);
      });
    }
    if (models.length) {
      models.forEach(name => {
        generateAngularArtifact('interface', name, `${basePath}/models`); // Angular CLI uses 'interface' for models
      });
    }
    if (services.length) {
      services.forEach(name => {
        generateAngularArtifact('service', name, `${basePath}/services`);
      });
    }

    // Stage all changes
    execSync('git add .', { stdio: 'inherit' });
    // Commit changes
    execSync(`git commit -m "Add challenge sample folders, requirements, and generate Angular artifacts for ${branchName}"`, { stdio: 'inherit' });

    // Push branch to remote
    // Delay to ensure commit is registered before push
    setTimeout(() => {
      execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

      console.log(`Branch ${branchName} created, artifacts generated, and pushed successfully.`);
    }, 1500);
  } catch (error) {
    console.error(`Error on branch ${branchName}:`, error.message);
  }
}

// Run for all challenges sequentially
(async () => {
  for (const branchName in challenges) {
    const { components, models, services, requirementUrl } = challenges[branchName];
    await createBranchWithFolders(baseBranch, branchName, components, models, services, requirementUrl);
  }
})();
