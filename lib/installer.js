import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function installAITeam(type = 'mcp', force = false) {
  try {
    // Vérifier qu'on est dans un repo git
    await checkGitRepo();
    
    // Créer la structure de dossiers
    await createDirectories();
    
    // Installer directement MCP
    await installMCPConfig(force);
    
    console.log(chalk.green('✅ AI Team MCP installed successfully!'));
    
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

async function installMCPConfig(force) {
  const templateDir = path.join(__dirname, '../templates/.github');
  
  const files = [
    {
      source: 'workflows/ai-team-zero-config.yml',
      dest: '.github/workflows/ai-team-mcp.yml'
    },
    {
      source: 'scripts/ai_team_mcp.py',
      dest: '.github/scripts/ai_team_mcp.py'
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
      // Pour le workflow MCP, on utilise une version simplifiée
      if (file.dest.includes('ai-team-mcp.yml')) {
        const mcpWorkflow = `name: AI Team MCP
on:
  issues:
    types: [opened, edited]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  ai-team-mcp:
    runs-on: ubuntu-latest
    name: 🤖 AI Team MCP
    
    steps:
      - uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
          
      - uses: actions/setup-python@v4
        with:
          python-version: '3.x'
          
      - name: Setup Git
        run: |
          git config --global user.name "AI Team MCP"
          git config --global user.email "ai-team@mcp.local"
          
      - name: 🤖 Run AI Team MCP
        id: ai_team
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          ISSUE_TITLE: \${{ github.event.issue.title }}
          ISSUE_BODY: \${{ github.event.issue.body }}
        run: |
          chmod +x .github/scripts/ai_team_mcp.py
          python3 .github/scripts/ai_team_mcp.py
          
      - name: 🌿 Create Branch and Push
        if: steps.ai_team.outputs.changes_made == 'true'
        run: |
          BRANCH_NAME="\${{ steps.ai_team.outputs.branch_name }}"
          git checkout -b \$BRANCH_NAME
          git add -A
          git commit -m "🤖 AI Team MCP: \${{ steps.ai_team.outputs.task_summary }}"
          git push origin \$BRANCH_NAME
          
      - name: 🔄 Create Pull Request
        if: steps.ai_team.outputs.changes_made == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const branch = '\${{ steps.ai_team.outputs.branch_name }}';
            const agent = '\${{ steps.ai_team.outputs.agent }}';
            const summary = '\${{ steps.ai_team.outputs.task_summary }}';
            const files = '\${{ steps.ai_team.outputs.files_created }}';
            const issue = '\${{ github.event.issue.number }}';
            
            const pr = await github.rest.pulls.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🤖 ' + agent + ': ' + summary,
              head: branch,
              base: 'main',
              body: '🤖 Pull Request générée par AI Team MCP\\n\\nAgent: ' + agent + '\\nFichiers: ' + files + (issue ? '\\n\\nCloses #' + issue : '')
            });
            
            if (issue && context.payload.issue) {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: parseInt(issue),
                body: '🎉 Pull Request créée: ' + pr.data.html_url
              });
            }
            
      - name: 🎉 Summary
        run: |
          echo "🤖 AI Team MCP completed!"
          echo "Agent: \${{ steps.ai_team.outputs.agent }}"`;
        
        await fs.writeFile(destPath, mcpWorkflow);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
      console.log(chalk.gray(`✓ Copied ${file.dest}`));
    } catch (error) {
      throw new Error(`Failed to copy ${file.source}: ${error.message}`);
    }
  }
  
  // Rendre le script Python exécutable
  try {
    await fs.chmod('.github/scripts/ai_team_mcp.py', 0o755);
  } catch (error) {
    console.warn(chalk.yellow('Warning: Could not make Python script executable'));
  }
  
  console.log(chalk.cyan('\n💡 MCP Configuration installed!'));
  console.log(chalk.yellow('Note: This uses Model Context Protocol for native GitHub integration.'));
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