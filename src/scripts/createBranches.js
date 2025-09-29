const fs = require('fs');
const { execSync } = require('child_process');
const challengesEndpoint = 'https://api.github.com/repositories/1014427702/contents/projects/coding-challenges/src/app/challenges';

const angularProjectRoot = '.'; // Change if your ng project root is different
const execOptions = {
  stdio: 'inherit',
  cwd: angularProjectRoot,
  env: { ...process.env, NG_CLI_ANALYTICS: 'false' } // disables analytics prompt
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
  // 'challenge-01-product-list': {
  //   components: ['product-list'],
  //   models: ['product'],
  //   services: ['product'],
  //   requirementUrl: `${challengesEndpoint}/challenge-01-product-list/docs/CH-01-REQUIREMENT.md`
  // },

  // 'challenge-02-parallel-apis': {
  //   components: ['user-list', 'post-list', 'user-posts-dashboard'],
  //   models: ['user', 'post'],
  //   services: ['user', 'post'],
  //   requirementUrl: `${challengesEndpoint}/challenge-02-parallel-apis/docs/CH-02-REQUIREMENT.md`
  // },

  // 'challenge-03-client-side-search': {
  //   components: ['user-search'],
  //   models: ['user'],
  //   services: ['user'],
  //   requirementUrl: `${challengesEndpoint}/challenge-03-client-side-search/docs/CH-03-REQUIREMENT.md`
  // },
  // 'challenge-04-server-side-search': {
  //   components: ['user-search'],
  //   models: ['user'],
  //   services: ['user'],
  //   requirementUrl: `${challengesEndpoint}/challenge-04-server-side-search/docs/CH-04-REQUIREMENT.md`
  // },

  // 'challenge-05-product-category-management-system': {
  //   components: ['category-summary', 'product-filter', 'product-form'],
  //   models: ['category', 'product'],
  //   services: ['category', 'product'],
  //   requirementUrl: `${challengesEndpoint}/challenge-05-product-category-management-system/docs/CH-05-REQUIREMENT.md`
  // },

  'challenge-06-user-todos-filter': {
    components: ['user-list', 'todo-list', 'user-todo-dashboard'],
    models: ['user', 'todo', 'user-with-todo'],
    services: ['user', 'todo', 'user-todo-facade'],
    requirementUrl: `${challengesEndpoint}/challenge-06-user-todos-filter/docs/CH-06-REQUIREMENT.md`
  },

  'challenge-07-dependent-apis': {
    components: ['user-list', 'post-list', 'user-posts-dashboard'],
    models: ['user', 'post', 'user-with-posts'],
    services: ['user', 'post', 'user-post-facade'],
    requirementUrl: `${challengesEndpoint}/challenge-07-dependent-apis/docs/CH-07-REQUIREMENT.md`
  },

  'challenge-08-ecommerce-checkout': {
    components: ['checkout-form', 'order-summary'],
    models: ['product', 'payment', 'order'],
    services: ['product', 'order', 'checkout-facade'],
    requirementUrl: `${challengesEndpoint}/challenge-08-ecommerce-checkout/docs/CH-08-REQUIREMENT.md`
  },



  // Add more challenge entries here with requirementUrl
};

// ✅ Ensure analytics is disabled globally before anything else
try {
  execSync('ng analytics off', execOptions);
  console.log('✅ Angular analytics disabled');
} catch (e) {
  console.warn('⚠️ Failed to disable Angular analytics (may already be off)');
}

const baseBranch = 'develop';

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
    let command = '';

    if (type === 'component') {
      // Angular CLI auto adds .component suffix
      command = `ng generate component ${name} --path=${relativePath} --skip-tests`;
    }
    else if (type === 'service') {
      // Angular CLI auto adds .service suffix
      command = `ng generate service ${name} --path=${relativePath} --skip-tests`;
    }
    else if (type === 'interface') {
      // Always enforce .model suffix for models
      const modelName = name.endsWith('.model') ? name : `${name}.model`;
      command = `ng generate interface ${modelName} --path=${relativePath}`;
    }

    execSync(command, execOptions);
    console.log(`${type} '${name}' generated at '${relativePath}'`);
  } catch (error) {
    console.error(`Error generating ${type} '${name}':`, error.message);
  }
}


// Main: create branch, generate files, add requirement
async function createBranchWithFolders(baseBranch, branchName, components = [], models = [], services = [], requirementUrl = '') {
  try {
    // Checkout base branch and create new branch
    execSync(`git checkout ${baseBranch}`, { stdio: 'inherit' });
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

    const basePath = `src/app/${branchName}`;

    // ✅ Create base challenge folder + subfolders
    fs.mkdirSync(basePath, { recursive: true });
    fs.mkdirSync(`${basePath}/components`, { recursive: true });
    fs.mkdirSync(`${basePath}/models`, { recursive: true });
    fs.mkdirSync(`${basePath}/services`, { recursive: true });

    // ✅ Ensure shared folder exists globally
    fs.mkdirSync('src/app/shared', { recursive: true });

    // Fetch requirements content and write to file
    let requirementsContent = '# Default Requirements\nNo content available.';
    if (requirementUrl) {
      requirementsContent = await getRequirementContent(requirementUrl);
    }
    fs.writeFileSync(`${basePath}/REQUIREMENTS.md`, requirementsContent);

    // Placeholder MY_APPROACH file
    const approachContent = `# My Approach\nDescribe your approach here.\n\n# Approach for ${branchName}\n\n# Why Write Your Approach First?\nWriting down your approach before you start coding helps you clarify your thoughts, plan your solution, and catch potential issues early. It's a crucial step that increases your problem-solving effectiveness and code quality.`;
    fs.writeFileSync(`${basePath}/MY_APPROACH.md`, approachContent);

    // Generate Angular components, models, services
    for (const name of components) {
      generateAngularArtifact('component', name, `${basePath}/components`);
    }
    for (const name of models) {
      generateAngularArtifact('interface', name, `${basePath}/models`);
    }
    for (const name of services) {
      generateAngularArtifact('service', name, `${basePath}/services`);
    }

    // Stage all changes
    execSync('git add .', { stdio: 'inherit' });
    // Commit changes
    execSync(`git commit -m "Add challenge sample folders, requirements, and generate Angular artifacts for ${branchName}"`, { stdio: 'inherit' });

    // Push branch to remote (synchronously)
    execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

    // Wait before moving to the next challenge
    await new Promise(r => setTimeout(r, 2000));

    console.log(`✅ Branch ${branchName} created, artifacts generated, and pushed successfully.\n`);
  } catch (error) {
    console.error(`❌ Error on branch ${branchName}:`, error.message);
  }
}

// Run challenges one by one
(async () => {
  for (const branchName of Object.keys(challenges)) {
    const { components, models, services, requirementUrl } = challenges[branchName];
    await createBranchWithFolders(baseBranch, branchName, components, models, services, requirementUrl);
  }
})();
