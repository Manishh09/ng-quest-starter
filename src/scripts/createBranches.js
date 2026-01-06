const fs = require('fs');
const { execSync } = require('child_process');
const { S } = require('@angular/cdk/keycodes');
const categoryNames = {
  RXJS_API: 'ngc-rxjs-api',
  FORMS: 'ngc-forms',
  ROUTING: 'ngc-routing',
  CORE: 'ngc-core'
};
const BRANCH = 'develop';

const challengesEndpoint = (
  category,
  challengeId,
  filePath
) => `https://api.github.com/repos/Manishh09/ng-coding-challenges/contents/projects/${category}/src/app/challenges/${challengeId}/${filePath}?ref=${BRANCH}`;

const angularProjectRoot = '.'; // Change if ng project root is different
const execOptions = {
  stdio: 'inherit',
  cwd: angularProjectRoot,
  env: { ...process.env, NG_CLI_ANALYTICS: 'false' }
};



// ------------------ Challenge Definitions ------------------

const challenges = {
  'challenge-01-product-list': {
    components: ['product-list'],
    models: ['product'],
    services: ['product'],
    requirementUrl: `${challengesEndpoint(categoryNames.RXJS_API, 'challenge-01-product-list', 'docs/CH-01-REQUIREMENT.md')}`
  },
  'challenge-02-parallel-apis': {
    components: ['user-list', 'post-list', 'user-posts-dashboard'],
    models: ['user', 'post'],
    services: ['user', 'post'],
    requirementUrl: `${challengesEndpoint(categoryNames.RXJS_API, 'challenge-02-parallel-apis', 'docs/CH-02-REQUIREMENT.md')}`
  },
  'challenge-03-client-side-search': {
    components: ['user-search'],
    models: ['user'],
    services: ['user'],
    requirementUrl: `${challengesEndpoint(categoryNames.RXJS_API, 'challenge-03-client-side-search', 'docs/CH-03-REQUIREMENT.md')}`
  },
  'challenge-04-server-side-search': {
    components: ['user-search'],
    models: ['user'],
    services: ['user'],
    requirementUrl: `${challengesEndpoint(categoryNames.RXJS_API, 'challenge-04-server-side-search', 'docs/CH-04-REQUIREMENT.md')}`
  },
  'challenge-05-product-category-management-system': {
    components: ['category-summary', 'product-filter', 'product-form'],
    models: ['category', 'product'],
    services: ['category', 'product'],
    requirementUrl: `${challengesEndpoint(categoryNames.RXJS_API, 'challenge-05-product-category-management-system', 'docs/CH-05-REQUIREMENT.md')}`
  },
  'challenge-06-user-todos-filter': {
    components: ['user-list', 'todo-list', 'user-todo-dashboard'],
    models: ['user', 'todo', 'user-with-todo'],
    services: ['user', 'todo', 'user-todo-facade'],
    requirementUrl: `${challengesEndpoint(categoryNames.RXJS_API, 'challenge-06-user-todos-filter', 'docs/CH-06-REQUIREMENT.md')}`
  },
  'challenge-07-dependent-apis': {
    components: ['user-list', 'post-list', 'user-posts-dashboard'],
    models: ['user', 'post', 'user-with-posts'],
    services: ['user', 'post', 'user-post-facade'],
    requirementUrl: `${challengesEndpoint(categoryNames.RXJS_API, 'challenge-07-dependent-apis', 'docs/CH-07-REQUIREMENT.md')}`
  },
  'challenge-08-ecommerce-checkout': {
    components: ['checkout-form', 'order-summary'],
    models: ['product', 'payment', 'order'],
    services: ['product', 'order', 'checkout-facade'],
    requirementUrl: `${challengesEndpoint(categoryNames.RXJS_API, 'challenge-08-ecommerce-checkout', 'docs/CH-08-REQUIREMENT.md')}`
  },
  'challenge-09-component-communication': {
    components: ['product-selector', 'product-display', 'product-dashboard'],
    models: ['product-category'],
    services: ['product'],
    requirementUrl: `${challengesEndpoint(categoryNames.CORE, 'challenge-09-component-communication', 'docs/CH-09-REQUIREMENT.md')}`
  },
  'challenge-10-authorized-resource-access': {
    components: ['product-list', 'login'],
    models: [],
    services: ['auth'],
    requirementUrl: `${challengesEndpoint(categoryNames.ROUTING, 'challenge-10-authorized-resource-access', 'docs/CH-10-REQUIREMENT.md')}`
  },
  'challenge-11-admin-dashboard-access': {
    components: ['admin-dashboard', 'posts', 'users', 'login'],
    models: [],
    services: ['auth', 'post', 'user'],
    requirementUrl: `${challengesEndpoint(categoryNames.ROUTING, 'challenge-11-admin-dashboard-access', 'docs/CH-11-REQUIREMENT.md')}`
  },
  'challenge-12-reactive-login-form': {
    components: ['login-form'],
    models: ['login-credentials'],
    services: [],
    requirementUrl: `${challengesEndpoint(categoryNames.FORMS, 'challenge-12-reactive-login-form', 'docs/CH-12-REQUIREMENT.md')}`
  },

  'challenge-13-duplicate-project-name-validator': {
    components: ['project-form'],
    models: ['project'],
    services: ['project'],
    requirementUrl: `${challengesEndpoint(categoryNames.FORMS, 'challenge-13-duplicate-project-name-validator', 'docs/CH-13-REQUIREMENT.md')}`
  },

  'challenge-14-email-availability-check': {
    components: ['email-form'],
    models: ['email'],
    services: ['email-validation'],
    requirementUrl: `${challengesEndpoint(categoryNames.FORMS, 'challenge-14-email-availability-check', 'docs/CH-14-REQUIREMENT.md')}`
  },

  'challenge-15-date-range-validation': {
    components: ['leave-form'],
    models: ['leave-request'],
    services: [],
    requirementUrl: `${challengesEndpoint(categoryNames.FORMS, 'challenge-15-date-range-validation', 'docs/CH-15-REQUIREMENT.md')}`
  },

  'challenge-16-dynamic-form-array': {
    components: ['experience-form'],
    models: ['experience'],
    services: [],
    requirementUrl: `${challengesEndpoint(categoryNames.FORMS, 'challenge-16-dynamic-form-array', 'docs/CH-16-REQUIREMENTS.md')}`
  },

  'challenge-17-custom-input-cva': {
    components: ['custom-input', 'demo-form'],
    models: ['user-form'],
    services: [],
    requirementUrl: `${challengesEndpoint(categoryNames.FORMS, 'challenge-17-custom-input-cva', 'docs/CH-17-REQUIREMENT.md')}`
  },

  'challenge-18-server-driven-dynamic-form': {
    components: ['dynamic-form'],
    models: ['form-schema'],
    services: ['form-schema'],
    requirementUrl: `${challengesEndpoint(categoryNames.FORMS, 'challenge-18-server-driven-dynamic-form', 'docs/CH-18-REQUIREMENT.md')}`
  },
  'challenge-19-unsaved-form-changes': {
    components: ['user-profile-form'],
    models: ['user'],
    services: ['user'],
    requirementUrl: `${challengesEndpoint(categoryNames.FORMS, 'challenge-19-unsaved-form-changes', 'docs/CH-19-REQUIREMENT.md')}`
  }
};

// ------------------ Helpers ------------------

function branchExistsLocally(branchName) {
  try {
    execSync(`git rev-parse --verify ${branchName}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function branchExistsOnRemote(branchName) {
  try {
    execSync(`git ls-remote --exit-code --heads origin ${branchName}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getNextMissingBranch(challenges) {
  for (const branchName in challenges) {
    if (!branchExistsLocally(branchName) && !branchExistsOnRemote(branchName)) {
      return branchName; // return first missing branch
    }
  }
  return null;
}

async function getRequirementContent(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch requirement from ${url}`);
  const json = await response.json();
  if (!json.content) throw new Error('API response missing content field');
  const buff = Buffer.from(json.content, 'base64');
  return buff.toString('utf-8');
}

function generateAngularArtifact(type, name, relativePath) {
  try {
    let command = '';
    if (type === 'component') {
      command = `ng generate component ${name} --path=${relativePath} --skip-tests`;
    } else if (type === 'service') {
      command = `ng generate service ${name} --path=${relativePath} --skip-tests`;
    } else if (type === 'interface') {
      const modelName = name.endsWith('.model') ? name : `${name}.model`;
      command = `ng generate interface ${modelName} --path=${relativePath}`;
    }
    execSync(command, execOptions);
    console.log(`${type} '${name}' generated at '${relativePath}'`);
  } catch (error) {
    console.error(`Error generating ${type} '${name}':`, error.message);
  }
}

// ------------------ Main Branch Creation ------------------

async function createBranchWithFolders(baseBranch, branchName, components = [], models = [], services = [], requirementUrl = '') {
  try {
    if (branchExistsLocally(branchName) || branchExistsOnRemote(branchName)) {
      console.log(`⏩ Skipping ${branchName}, branch already exists.`);
      return;
    }

    execSync(`git checkout ${baseBranch}`, { stdio: 'inherit' });
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

    const basePath = `src/app/${branchName}`;
    fs.mkdirSync(basePath, { recursive: true });
    fs.mkdirSync(`${basePath}/components`, { recursive: true });
    fs.mkdirSync(`${basePath}/models`, { recursive: true });
    fs.mkdirSync(`${basePath}/services`, { recursive: true });

    fs.mkdirSync('src/app/shared', { recursive: true });
    fs.mkdirSync('src/docs', { recursive: true });

    // --- Requirement doc ---
    if (requirementUrl) {
      const requirementFileName = requirementUrl.split('/').pop();
      const requirementsContent = await getRequirementContent(requirementUrl);
      fs.writeFileSync(`src/docs/${requirementFileName}`, requirementsContent);
    }

    // --- Approach doc ---
    const approachContent = `# My Approach\n\n# Approach for ${branchName}\n\nDescribe your thought process here.`;
    fs.writeFileSync(`${basePath}/MY_IMPLEMENTATION_PLAN.md`, approachContent);

    for (const name of components) generateAngularArtifact('component', name, `${basePath}/components`);
    for (const name of models) generateAngularArtifact('interface', name, `${basePath}/models`);
    for (const name of services) generateAngularArtifact('service', name, `${basePath}/services`);

    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Add challenge artifacts and docs for ${branchName}"`, { stdio: 'inherit' });
    execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

    console.log(`✅ Branch ${branchName} created, artifacts generated, docs updated.\n`);
  } catch (error) {
    console.error(`❌ Error on branch ${branchName}:`, error.message);
  }
}

// ------------------ Updater for existing branches ------------------

async function updateRequirementDocs(branchName, requirementUrl) {
  try {
    // Checkout branch
    execSync(`git checkout ${branchName}`, { stdio: 'inherit' });

    // Extract filename (e.g. CH-01-REQUIREMENT.md)
    const requirementFileName = requirementUrl.split('/').pop();

    // Fetch requirement content
    const requirementsContent = await getRequirementContent(requirementUrl);

    // Write directly to src/docs (folder already exists in each branch)
    const filePath = `src/docs/${requirementFileName}`;
    fs.writeFileSync(filePath, requirementsContent);

    // Stage + commit + push
    execSync(`git add ${filePath}`, { stdio: 'inherit' });
    execSync(
      `git commit -m "🔄 Update ${requirementFileName} from external repo" || echo "⚠️ Nothing to commit"`,
      { stdio: 'inherit' }
    );
    execSync(`git push origin ${branchName}`, { stdio: 'inherit' });

    // Small pause to avoid API/GitHub push rate limits
    await new Promise(res => setTimeout(res, 3000));

    console.log(`✅ Updated ${requirementFileName} in ${branchName}`);
  } catch (err) {
    console.error(`❌ Failed to update requirements for ${branchName}:`, err.message);
  }
}


// ------------------ Run All ------------------

(async () => {
  try {
    execSync('ng analytics off', execOptions);
    console.log('✅ Angular analytics disabled');
  } catch {
    console.warn('⚠️ Failed to disable Angular analytics (may already be off)');
  }

  const baseBranch = 'develop';

  // Create missing branches first
  let branchName = getNextMissingBranch(challenges);
  while (branchName) {
    const { components, models, services, requirementUrl } = challenges[branchName];
    await createBranchWithFolders(baseBranch, branchName, components, models, services, requirementUrl);
    branchName = getNextMissingBranch(challenges);
  }

  console.log("🎉 All missing branches created.");

  // Update requirement docs for all branches
  for (const [branchName, { requirementUrl }] of Object.entries(challenges)) {
    if (requirementUrl) {
      await updateRequirementDocs(branchName, requirementUrl);
    }
  }

  console.log("✅ Requirement docs synced for all branches.");
})();
