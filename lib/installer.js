import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function installAITeam(type = 'zero-config', force = false) {
  try {
    // Vérifier qu'on est dans un repo git
    await checkGitRepo();
    
    // Créer la structure de dossiers
    await createDirectories();
    
    // Copier les templates selon le type
    switch (type) {
      case 'zero-config':
        await installZeroConfig(force);
        break;
      case 'full':
        await installFullConfig(force);
        break;
      case 'github-app':
        await installGitHubApp(force);
        break;
      default:
        throw new Error(`Unknown installation type: ${type}`);
    }
    
    console.log(chalk.green('✅ Installation completed successfully!'));
    
  } catch (error) {
    throw new Error(`Installation failed: ${error.message}`);
  }
}

async function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('Not a git repository. Run "git init" first.');
  }
}

async function createDirectories() {
  const dirs = ['.github/workflows', '.github/scripts'];
  
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory ${dir}: ${error.message}`);
    }
  }
}

async function installZeroConfig(force) {
  const templateDir = path.join(__dirname, '../templates/.github');
  
  const files = [
    {
      source: 'workflows/ai-team-zero-config.yml',
      dest: '.github/workflows/ai-team-zero-config.yml'
    },
    {
      source: 'scripts/zero_config_generator.py',
      dest: '.github/scripts/zero_config_generator.py'
    }
  ];
  
  for (const file of files) {
    const sourcePath = path.join(templateDir, file.source);
    const destPath = file.dest;
    
    // Vérifier si le fichier existe déjà
    if (!force && await fileExists(destPath)) {
      throw new Error(`File ${destPath} already exists. Use --force to overwrite.`);
    }
    
    try {
      await fs.copyFile(sourcePath, destPath);
      console.log(chalk.gray(`✓ Copied ${file.dest}`));
    } catch (error) {
      throw new Error(`Failed to copy ${file.source}: ${error.message}`);
    }
  }
  
  // Rendre le script Python exécutable
  try {
    await fs.chmod('.github/scripts/zero_config_generator.py', 0o755);
  } catch (error) {
    console.warn(chalk.yellow('Warning: Could not make Python script executable'));
  }
}

async function installFullConfig(force) {
  const templateDir = path.join(__dirname, '../templates/.github');
  
  const files = [
    {
      source: 'workflows/ai-team-orchestrator.yml',
      dest: '.github/workflows/ai-team-orchestrator.yml'
    },
    {
      source: 'scripts/repo_analyzer.py',
      dest: '.github/scripts/repo_analyzer.py'
    },
    {
      source: 'scripts/agent_orchestrator.py',
      dest: '.github/scripts/agent_orchestrator.py'
    },
    {
      source: 'scripts/code_executor.py',
      dest: '.github/scripts/code_executor.py'
    },
    {
      source: 'scripts/requirements.txt',
      dest: '.github/scripts/requirements.txt'
    }
  ];
  
  for (const file of files) {
    const sourcePath = path.join(templateDir, file.source);
    const destPath = file.dest;
    
    if (!force && await fileExists(destPath)) {
      throw new Error(`File ${destPath} already exists. Use --force to overwrite.`);
    }
    
    try {
      await fs.copyFile(sourcePath, destPath);
      console.log(chalk.gray(`✓ Copied ${file.dest}`));
    } catch (error) {
      throw new Error(`Failed to copy ${file.source}: ${error.message}`);
    }
  }
}

async function installGitHubApp(force) {
  // TODO: Implémenter l'installation de la GitHub App
  throw new Error('GitHub App installation not yet implemented');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function checkStatus() {
  const checks = [
    {
      name: 'Git repository',
      check: async () => {
        try {
          execSync('git rev-parse --git-dir', { stdio: 'ignore' });
          return true;
        } catch {
          return false;
        }
      }
    },
    {
      name: 'Zero-Config workflow',
      check: () => fileExists('.github/workflows/ai-team-zero-config.yml')
    },
    {
      name: 'Zero-Config generator',
      check: () => fileExists('.github/scripts/zero_config_generator.py')
    },
    {
      name: 'Full workflow',
      check: () => fileExists('.github/workflows/ai-team-orchestrator.yml')
    },
    {
      name: 'GitHub Actions enabled',
      check: async () => {
        // Vérifier si GitHub Actions est activé (approximatif)
        return await fileExists('.github/workflows');
      }
    }
  ];
  
  for (const check of checks) {
    const result = await check.check();
    const status = result ? chalk.green('✅') : chalk.red('❌');
    console.log(`${status} ${check.name}`);
  }
}

export function listAgents() {
  const agents = [
    {
      name: 'Frontend Specialist',
      description: 'HTML, CSS, JavaScript, React, Vue.js',
      keywords: 'ui, css, html, component, frontend'
    },
    {
      name: 'Backend Specialist', 
      description: 'APIs, servers, databases, Node.js, Python',
      keywords: 'api, server, database, backend'
    },
    {
      name: 'Bug Hunter',
      description: 'Bug fixing, debugging, error resolution',
      keywords: 'bug, fix, error, problème'
    },
    {
      name: 'QA Engineer',
      description: 'Testing, test automation, quality assurance',
      keywords: 'test, testing, spec, qa'
    },
    {
      name: 'Code Architect',
      description: 'Refactoring, optimization, code structure',
      keywords: 'refactor, optimize, clean, architecture'
    },
    {
      name: 'Full-Stack Developer',
      description: 'General development, features, integrations',
      keywords: 'feature, development, integration'
    }
  ];
  
  for (const agent of agents) {
    console.log(chalk.blue.bold(`🤖 ${agent.name}`));
    console.log(chalk.gray(`   ${agent.description}`));
    console.log(chalk.yellow(`   Keywords: ${agent.keywords}\n`));
  }
  
  console.log(chalk.cyan('💡 Use these keywords in your GitHub issues to automatically select the right agent!'));
} 