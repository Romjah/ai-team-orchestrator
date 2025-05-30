#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Together from 'together-ai';
import { APIKeyManager } from '../lib/api-config.js';
import fs from 'fs';

// Charger le fichier .env automatiquement si disponible
function loadEnvFile() {
  if (fs.existsSync('.env')) {
    try {
      const envContent = fs.readFileSync('.env', 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=');
          if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value.trim();
          }
        }
      }
      // Message silencieux par défaut, sauf si --verbose
      if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
        console.log(chalk.green('✅ Fichier .env chargé'));
      }
    } catch (error) {
      if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
        console.log(chalk.yellow('⚠️ Erreur lors du chargement de .env:', error.message));
      }
    }
  }
}

// Charger les variables d'environnement au démarrage
loadEnvFile();

class AITeamCLI {
  constructor() {
    this.program = new Command();
    this.setupProgram();
    this.setupCommands();
  }

  setupProgram() {
    this.program
      .name('ai-team')
      .description('🚀 AI Team Orchestrator - Création automatique d\'issues avec DeepSeek R1')
      .version('2.4.0')
      .option('-v, --verbose', 'Mode verbose')
      .option('--quick', 'Mode ultra-rapide (par défaut)');
  }

  setupCommands() {
    this.setupIssueCommand();
    this.setupCreateCommand();
    this.setupSetupCommand();
    this.setupInitCommand();
    this.setupCheckCommand();
    this.setupSyncSecretsCommand();
  }

  setupIssueCommand() {
    this.program
      .command('issue <title> [description]')
      .description('🔥 Création automatique d\'issue GitHub avec DeepSeek R1')
      .option('-t, --type <type>', 'Type d\'agent', 'feature')
      .option('--labels <labels>', 'Labels séparés par des virgules', 'ai-team,enhancement')
      .action(async (title, description, options) => {
        try {
          await this.handleAutoIssue(title, description, options);
        } catch (error) {
          console.log(chalk.red(`❌ Erreur: ${error.message}`));
          process.exit(1);
        }
      });
  }

  setupCreateCommand() {
    this.program
      .command('create [description]')
      .description('🚀 Création rapide de tâche')
      .option('-t, --type <type>', 'Type d\'agent', 'feature')
      .option('--auto-issue', 'Créer automatiquement une issue GitHub')
      .action(async (description, options) => {
        try {
          await this.handleQuickCreate(description, options);
    } catch (error) {
          console.log(chalk.red(`❌ Erreur: ${error.message}`));
        process.exit(1);
      }
      });
  }

  setupSetupCommand() {
    this.program
      .command('setup-api')
      .description('🔑 Configuration Together.ai pour DeepSeek R1')
      .option('--env-file', 'Créer un fichier .env local (recommandé)')
      .action(async (options) => {
        try {
          const apiManager = new APIKeyManager();
          await apiManager.setupAPIKeyInteractively(options);
        } catch (error) {
          console.log(chalk.red(`❌ Erreur: ${error.message}`));
          process.exit(1);
        }
      });
  }

  setupInitCommand() {
    this.program
      .command('init')
      .description('🚀 Initialisation du projet avec les workflows GitHub et scripts')
      .action(async () => {
        try {
          await this.handleInit();
        } catch (error) {
          console.log(chalk.red(`❌ Erreur: ${error.message}`));
          process.exit(1);
        }
      });
  }

  setupCheckCommand() {
    this.program
      .command('check')
      .description('🔍 Vérification des prérequis pour le workflow')
      .action(async () => {
        try {
          await this.handleCheck();
        } catch (error) {
          console.log(chalk.red(`❌ Erreur: ${error.message}`));
          process.exit(1);
        }
      });
  }

  setupSyncSecretsCommand() {
    this.program
      .command('sync-secrets')
      .description('🔄 Synchronisation des secrets GitHub à partir du fichier .env local')
      .action(async () => {
        try {
          await this.handleSyncSecrets();
        } catch (error) {
          console.log(chalk.red(`❌ Erreur: ${error.message}`));
          process.exit(1);
        }
      });
  }

  async handleAutoIssue(title, description, options) {
    console.log(chalk.cyan('🔥 Création automatique d\'issue avec DeepSeek R1'));
    
    const apiKey = await this.ensureQuickSetup();
    
    // Génération automatique de description si manquante
    if (!description) {
      console.log(chalk.yellow('🤖 Génération automatique avec DeepSeek R1...'));
      description = await this.generateDescriptionWithDeepSeek(title, options.type, apiKey);
    }

    await this.createGitHubIssue(title, description, options.type, apiKey, options.labels);
  }

  async handleQuickCreate(description, options) {
    console.log(chalk.cyan('🤖 AI Team Orchestrator v2.0 - Mode Ultra-Rapide avec DeepSeek R1'));
    
    const apiKey = await this.ensureQuickSetup();
    
    if (!description) {
    const answer = await inquirer.prompt([
      {
          type: 'input',
          name: 'description',
          message: '📝 Décrivez votre tâche:',
          validate: input => input.trim().length > 0 || 'Veuillez entrer une description'
        }
      ]);
      description = answer.description;
    }

    const agentTypes = {
      'frontend': '🎨 Frontend',
      'backend': '⚙️ Backend', 
      'testing': '🧪 Testing',
      'bug_fix': '🐛 Bug Fix',
      'refactor': '🏗️ Refactor',
      'feature': '🚀 Feature'
    };

    console.log(chalk.green(`✅ Agent: ${agentTypes[options.type] || agentTypes.feature}`));
    console.log(chalk.green(`✅ Tâche: ${description}`));

    if (options.autoIssue) {
      await this.createGitHubIssue(description, description, options.type, apiKey);
      } else {
      console.log(chalk.cyan('\n🎯 Prêt ! Utilisez --auto-issue pour créer l\'issue GitHub'));
    }
  }

  async ensureQuickSetup() {
    const apiManager = new APIKeyManager();
    
    if (apiManager.isAPIKeyConfigured()) {
      return apiManager.getAPIKey();
    }

    console.log(chalk.yellow('⚙️ Configuration rapide nécessaire...'));
    
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: '🔑 Clé API Together.ai (obtenez-la sur together.ai):',
        mask: '*',
        validate: input => input.trim().length > 10 || 'Clé API invalide'
      }
    ]);

    apiManager.saveAPIKey(apiKey);
    console.log(chalk.green('✅ Configuration sauvegardée !'));
    
    return apiKey;
  }

  async generateDescriptionWithDeepSeek(title, type, apiKey) {
    const prompt = `Génère une description détaillée pour cette tâche de développement:

Titre: ${title}
Type: ${type}

Retourne une description structurée avec:
- ## Objectif
- ## Fonctionnalités attendues  
- ## Critères d'acceptation
- ## Technologies suggérées

Sois précis et technique.`;

    try {
      const client = new Together({ apiKey });
      
      const response = await client.chat.completions.create({
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      return response.choices[0].message.content || this.getDefaultDescription(title, type);
      
    } catch (error) {
      console.log(chalk.yellow('⚠️ Génération DeepSeek échouée, utilisation d\'un template par défaut'));
      return this.getDefaultDescription(title, type);
    }
  }

  getDefaultDescription(title, type) {
    return `## Objectif
${title}

## Description
Tâche de type ${type} à implémenter avec DeepSeek R1.

## Fonctionnalités attendues
- Implémentation selon les meilleures pratiques
- Code moderne et maintenable
- Documentation intégrée

## Critères d'acceptation
- [ ] Implémentation fonctionnelle
- [ ] Tests inclus
- [ ] Documentation mise à jour
- [ ] Performance optimisée

## Technologies suggérées
À définir selon le contexte du projet.

---
*Généré par AI Team Orchestrator v2.0 avec DeepSeek R1*`;
  }

  async createGitHubIssue(title, description, type, apiKey, labels = 'ai-team,enhancement') {
    console.log(chalk.yellow('🔄 Création de l\'issue GitHub...'));

    try {
      // Détection automatique du repository
      const { execSync } = await import('child_process');
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
      
      if (!match) {
        throw new Error('Repository GitHub non détecté');
      }

      const [, owner, repo] = match;
      
      // Token GitHub depuis plusieurs sources
      const githubToken = process.env.GITHUB_TOKEN || 
                         process.env.GH_TOKEN || 
                         process.env.GITHUB_ACCESS_TOKEN;
      
      if (!githubToken) {
        console.log(chalk.red('❌ Token GitHub manquant'));
        console.log(chalk.cyan('\n📋 SOLUTIONS (au choix):'));
        
        console.log(chalk.white('\n🔧 Option 1: Fichier .env (RECOMMANDÉ)'));
        console.log(chalk.gray('   1. Ajoutez à votre fichier .env:'));
        console.log(chalk.blue('      GITHUB_TOKEN=ghp_votre_token_github'));
        console.log(chalk.gray('   2. Créez le token sur: https://github.com/settings/tokens'));
        console.log(chalk.gray('   3. Permissions requises: repo + workflow'));
        
        console.log(chalk.white('\n🔧 Option 2: Variable d\'environnement'));
        console.log(chalk.blue('   export GITHUB_TOKEN="ghp_votre_token_github"'));
        
        console.log(chalk.white('\n🔧 Option 3: Utiliser GitHub CLI'));
        console.log(chalk.blue('   gh auth login'));
        console.log(chalk.blue('   export GITHUB_TOKEN=$(gh auth token)'));
        
        console.log(chalk.white('\n💡 Ou créez l\'issue manuellement:'));
        console.log(chalk.cyan(`   Repository: https://github.com/${owner}/${repo}/issues/new`));
        console.log(chalk.cyan(`   Titre: ${title}`));
        console.log(chalk.cyan(`   Description:\n${description}`));
        console.log(chalk.cyan(`   Labels: ${labels}`));
        return;
      }

      const issueData = {
        title: title,
        body: `${description}

---
**🤖 Paramètres AI Team:**
- Agent: ${type}
- Modèle: DeepSeek R1 (DeepSeek-R1-Distill-Llama-70B-free)
- Créé via: ai-team v2.3.4

**🚀 Workflow automatique:**
1. L'agent IA va analyser cette demande
2. Du code sera généré avec DeepSeek R1
3. Une Pull Request sera créée automatiquement

*Généré par AI Team Orchestrator v2.3.4 avec DeepSeek R1*`,
        labels: labels.split(',').map(l => l.trim())
      };

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(issueData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token GitHub invalide ou expiré');
        } else if (response.status === 403) {
          throw new Error('Permissions insuffisantes pour ce repository');
    } else {
          throw new Error(`GitHub API Error: ${response.status}`);
        }
      }

      const issue = await response.json();
      
      console.log(chalk.green('🎉 Issue créée avec succès !'));
      console.log(chalk.cyan(`📋 Issue #${issue.number}: ${issue.title}`));
      console.log(chalk.cyan(`🔗 URL: ${issue.html_url}`));
      console.log(chalk.yellow('🚀 Le workflow AI Team va se déclencher avec DeepSeek R1...'));
      
    } catch (error) {
      console.log(chalk.red(`❌ Erreur lors de la création: ${error.message}`));
      console.log(chalk.white('\n📋 Créez l\'issue manuellement:'));
      console.log(chalk.cyan(`Titre: ${title}`));
      console.log(chalk.cyan(`Description:\n${description}`));
      console.log(chalk.cyan(`Labels: ${labels}`));
    }
  }

  async handleInit() {
    console.log(chalk.cyan('🚀 Initialisation du projet AI Team Orchestrator'));
    console.log(chalk.white('Installation des workflows GitHub et scripts DeepSeek R1...\n'));

    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const { execSync } = await import('child_process');

      // Détecter si nous sommes dans un repo git
      try {
        execSync('git rev-parse --git-dir', { stdio: 'ignore' });
        } catch (error) {
        throw new Error('Ce dossier n\'est pas un repository Git. Initialisez d\'abord avec: git init');
      }

      // Trouver le dossier des templates dans le package npm
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const templatesDir = path.join(__dirname, '..', 'templates');
      
      console.log(chalk.yellow('📁 Vérification des templates...'));
      
      if (!fs.existsSync(templatesDir)) {
        throw new Error('Dossier templates non trouvé. Réinstallez le package: npm install -g ai-team-orchestrator');
      }

      // Créer le dossier .github s'il n'existe pas
      const githubDir = '.github';
      const scriptsDir = path.join(githubDir, 'scripts');
      const workflowsDir = path.join(githubDir, 'workflows');

      console.log(chalk.yellow('📂 Création de la structure GitHub...'));
      
      if (!fs.existsSync(githubDir)) {
        fs.mkdirSync(githubDir, { recursive: true });
      }
      if (!fs.existsSync(scriptsDir)) {
        fs.mkdirSync(scriptsDir, { recursive: true });
      }
      if (!fs.existsSync(workflowsDir)) {
        fs.mkdirSync(workflowsDir, { recursive: true });
      }

      // Copier les workflows
      const templatesWorkflowsDir = path.join(templatesDir, '.github', 'workflows');
      if (fs.existsSync(templatesWorkflowsDir)) {
        const workflows = fs.readdirSync(templatesWorkflowsDir);
        
        console.log(chalk.yellow('🔧 Installation des workflows...'));
        
        for (const workflow of workflows) {
          if (workflow.endsWith('.yml')) {
            const source = path.join(templatesWorkflowsDir, workflow);
            const dest = path.join(workflowsDir, workflow);
            
            fs.copyFileSync(source, dest);
            console.log(chalk.green(`  ✅ ${workflow}`));
          }
        }
      }

      // Copier les scripts
      const templatesScriptsDir = path.join(templatesDir, '.github', 'scripts');
      if (fs.existsSync(templatesScriptsDir)) {
        const scripts = fs.readdirSync(templatesScriptsDir);
        
        console.log(chalk.yellow('🐍 Installation des scripts Python...'));
        
        for (const script of scripts) {
          if (script.endsWith('.py') || script.endsWith('.txt')) {
            const source = path.join(templatesScriptsDir, script);
            const dest = path.join(scriptsDir, script);
            
            fs.copyFileSync(source, dest);
            
            // Donner les permissions d'exécution aux scripts Python
            if (script.endsWith('.py')) {
              try {
                execSync(`chmod +x "${dest}"`, { stdio: 'ignore' });
              } catch (e) {
                // Ignorer les erreurs de permissions sur Windows
              }
            }
            
            console.log(chalk.green(`  ✅ ${script}`));
          }
        }
      }

      console.log(chalk.green('\n🎉 Installation terminée avec succès !'));
      console.log(chalk.cyan('\n📋 Prochaines étapes:'));
      console.log(chalk.white('1. Configurez vos secrets GitHub:'));
      console.log(chalk.gray('   • Repository Settings → Secrets and variables → Actions'));
      console.log(chalk.gray('   • Créez: TOGETHER_AI_API_KEY (votre clé Together.ai)'));
      console.log(chalk.gray('   • Créez: GITHUB_TOKEN (token GitHub avec permissions)'));
      console.log();
      console.log(chalk.white('2. Testez avec une issue:'));
      console.log(chalk.blue('   ai-team issue "Landing page moderne" --type frontend'));
      console.log();
      console.log(chalk.white('3. Le workflow se déclenchera automatiquement !'));
      console.log(chalk.gray('   • Analyse avec DeepSeek R1'));
      console.log(chalk.gray('   • Génération de code'));
      console.log(chalk.gray('   • Création de Pull Request'));
      console.log();
      console.log(chalk.cyan('🧠 Propulsé par DeepSeek R1 - L\'IA la plus avancée !'));

    } catch (error) {
      throw new Error(`Erreur lors de l'initialisation: ${error.message}`);
    }
  }

  async handleCheck() {
    console.log(chalk.cyan('🔍 AI Team Orchestrator - Diagnostic complet'));
    console.log(chalk.white('Vérification de tous les prérequis pour DeepSeek R1...\n'));

    let allGood = true;
    const issues = [];

    try {
      const fs = await import('fs');
      const { execSync } = await import('child_process');

      // 1. Vérification Git
      console.log(chalk.yellow('📁 1. Vérification du repository Git...'));
      try {
        const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
        const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
        
        if (match) {
          const [, owner, repo] = match;
          console.log(chalk.green(`  ✅ Repository GitHub détecté: ${owner}/${repo}`));
          } else {
          console.log(chalk.red(`  ❌ URL remote non GitHub: ${remoteUrl}`));
          issues.push('Repository non GitHub détecté');
          allGood = false;
        }
      } catch (error) {
        console.log(chalk.red('  ❌ Pas de repository Git ou remote non configuré'));
        issues.push('Repository Git non configuré');
        allGood = false;
      }

      // 2. Vérification des workflows
      console.log(chalk.yellow('\n🔧 2. Vérification des workflows GitHub...'));
      const workflowsDir = '.github/workflows';
      
      if (fs.existsSync(workflowsDir)) {
        const workflows = ['ai-team-mcp.yml', 'ai-team-orchestrator.yml', 'ai-team-zero-config.yml'];
        let workflowsPresent = 0;
        
        workflows.forEach(workflow => {
          const workflowPath = `${workflowsDir}/${workflow}`;
          if (fs.existsSync(workflowPath)) {
            console.log(chalk.green(`  ✅ ${workflow}`));
            workflowsPresent++;
          } else {
            console.log(chalk.red(`  ❌ ${workflow} manquant`));
            issues.push(`Workflow ${workflow} manquant`);
            allGood = false;
          }
        });
        
        if (workflowsPresent === 0) {
          console.log(chalk.red('  💡 Exécutez: ai-team init'));
        }
      } else {
        console.log(chalk.red('  ❌ Dossier .github/workflows/ non trouvé'));
        console.log(chalk.yellow('  💡 Exécutez: ai-team init'));
        issues.push('Workflows non installés');
        allGood = false;
      }

      // 3. Vérification des scripts
      console.log(chalk.yellow('\n🐍 3. Vérification des scripts Python...'));
      const scriptsDir = '.github/scripts';
      
      if (fs.existsSync(scriptsDir)) {
        const scripts = ['ai_team_mcp.py', 'requirements.txt', 'zero_config_generator.py'];
        
        scripts.forEach(script => {
          const scriptPath = `${scriptsDir}/${script}`;
          if (fs.existsSync(scriptPath)) {
            console.log(chalk.green(`  ✅ ${script}`));
          } else {
            console.log(chalk.red(`  ❌ ${script} manquant`));
            issues.push(`Script ${script} manquant`);
            allGood = false;
          }
        });
      } else {
        console.log(chalk.red('  ❌ Dossier .github/scripts/ non trouvé'));
        issues.push('Scripts non installés');
        allGood = false;
      }

      // 4. Vérification Together.ai API Key
      console.log(chalk.yellow('\n🔑 4. Vérification Together.ai API Key...'));
      const apiManager = new APIKeyManager();
      
      let configSource = '';
      if (apiManager.isAPIKeyConfigured()) {
        const apiKey = apiManager.getAPIKey();
        console.log(chalk.green(`  ✅ Clé API configurée (${apiKey.length} caractères)`));
        
        // Détecter la source de configuration
        if (fs.existsSync('.env')) {
          const envContent = fs.readFileSync('.env', 'utf8');
          if (envContent.includes('TOGETHER_AI_API_KEY=')) {
            configSource = '📁 Fichier .env local (RECOMMANDÉ)';
            console.log(chalk.cyan(`  🎯 Source: ${configSource}`));
          }
        } else {
          configSource = '🔧 Configuration npm ou variables d\'environnement';
          console.log(chalk.yellow(`  📋 Source: ${configSource}`));
          console.log(chalk.white('  💡 Conseil: Utilisez "ai-team setup-api" pour créer un .env local'));
        }
        
        // Test de la clé API
        try {
          console.log(chalk.yellow('  🧪 Test de la clé API...'));
          const testValid = await this.testTogetherAI(apiKey);
          if (testValid) {
            console.log(chalk.green('  ✅ Clé API valide et fonctionnelle'));
    } else {
            console.log(chalk.red('  ❌ Clé API invalide ou non fonctionnelle'));
            issues.push('Clé Together.ai invalide');
            allGood = false;
          }
        } catch (error) {
          console.log(chalk.red(`  ❌ Erreur test API: ${error.message}`));
          issues.push('Erreur lors du test Together.ai');
          allGood = false;
        }
      } else {
        console.log(chalk.red('  ❌ Clé API Together.ai non configurée'));
        console.log(chalk.yellow('  💡 Exécutez: ai-team setup-api'));
        issues.push('Clé Together.ai non configurée');
        allGood = false;
      }

      // 5. Vérification GitHub Token et permissions
      console.log(chalk.yellow('\n🔐 5. Vérification GitHub Token...'));
      const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
      
      if (githubToken) {
        console.log(chalk.green(`  ✅ GitHub Token détecté (${githubToken.length} caractères)`));
        
        try {
          const permissions = await this.checkGitHubTokenPermissions(githubToken);
          console.log(chalk.green('  ✅ Token valide'));
          
          // Vérifier les permissions spécifiques
          const requiredPermissions = [
            'contents:write',
            'pull-requests:write', 
            'issues:write',
            'actions:read'
          ];
          
          console.log(chalk.yellow('  📋 Permissions détectées:'));
          if (permissions && permissions.length > 0) {
            permissions.forEach(perm => {
              console.log(chalk.cyan(`    • ${perm}`));
            });
      } else {
            console.log(chalk.yellow('    • Impossible de détecter les permissions exactes'));
            console.log(chalk.yellow('    • Le token semble valide mais vérifiez manuellement'));
      }
      
    } catch (error) {
          console.log(chalk.red(`  ❌ Token GitHub invalide: ${error.message}`));
          issues.push('Token GitHub invalide');
          allGood = false;
        }
      } else {
        console.log(chalk.red('  ❌ Token GitHub non configuré'));
        console.log(chalk.yellow('  💡 Configurez GITHUB_TOKEN dans vos variables d\'environnement'));
        console.log(chalk.gray('    export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"'));
        issues.push('Token GitHub non configuré');
        allGood = false;
      }

      // 6. Vérification des secrets GitHub Actions
      console.log(chalk.yellow('\n🔒 6. Vérification recommandations secrets...'));
      console.log(chalk.cyan('  📋 Secrets requis pour GitHub Actions:'));
      console.log(chalk.white('    • TOGETHER_AI_API_KEY (obligatoire)'));
      console.log(chalk.white('    • GITHUB_TOKEN (automatique ou manuel)'));
      console.log(chalk.gray('  💡 Configurez dans: Repository Settings → Secrets → Actions'));

      // Résumé final
      console.log(chalk.yellow('\n📊 RÉSUMÉ DU DIAGNOSTIC'));
      console.log('='.repeat(50));
      
      if (allGood) {
        console.log(chalk.green('🎉 TOUT EST PRÊT !'));
        console.log(chalk.green('✅ Tous les prérequis sont satisfaits'));
        console.log(chalk.cyan('\n🚀 Prochaines étapes:'));
        console.log(chalk.white('1. Créez une issue: ai-team issue "votre demande" --type frontend'));
        console.log(chalk.white('2. Le workflow se déclenchera automatiquement'));
        console.log(chalk.white('3. DeepSeek R1 analysera et générera le code'));
        console.log(chalk.white('4. Une Pull Request sera créée'));
      } else {
        console.log(chalk.red('❌ PROBLÈMES DÉTECTÉS'));
        console.log(chalk.red(`${issues.length} problème(s) à résoudre:\n`));
        issues.forEach((issue, index) => {
          console.log(chalk.red(`${index + 1}. ${issue}`));
        });
        
        console.log(chalk.yellow('\n🔧 ACTIONS RECOMMANDÉES:'));
        if (issues.some(i => i.includes('Workflows'))) {
          console.log(chalk.white('• Exécutez: ai-team init'));
        }
        if (issues.some(i => i.includes('Together.ai'))) {
          console.log(chalk.white('• Exécutez: ai-team setup-api'));
        }
        if (issues.some(i => i.includes('GitHub'))) {
          console.log(chalk.white('• Configurez GITHUB_TOKEN: export GITHUB_TOKEN="ghp_xxx"'));
          console.log(chalk.white('• Permissions requises: contents:write, pull-requests:write, issues:write'));
        }
      }
      
      console.log(chalk.cyan('\n🧠 AI Team Orchestrator - Propulsé par DeepSeek R1'));
      
    } catch (error) {
      throw new Error(`Erreur lors du diagnostic: ${error.message}`);
    }
  }

  async testTogetherAI(apiKey) {
    try {
      const response = await fetch('https://api.together.xyz/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async checkGitHubTokenPermissions(token) {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Vérifier les scopes dans les headers
      const scopes = response.headers.get('X-OAuth-Scopes');
      return scopes ? scopes.split(', ').map(s => s.trim()) : [];

    } catch (error) {
      throw new Error(`Token invalide: ${error.message}`);
    }
  }

  async handleSyncSecrets() {
    console.log(chalk.cyan('🔄 Synchronisation des secrets GitHub à partir du fichier .env local'));
    
    const apiManager = new APIKeyManager();
    
    if (apiManager.isAPIKeyConfigured()) {
      const apiKey = apiManager.getAPIKey();
      console.log(chalk.green(`✅ Clé API configurée (${apiKey.length} caractères)`));
      
      // Détecter la source de configuration
      if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf8');
        if (envContent.includes('TOGETHER_AI_API_KEY=')) {
          console.log(chalk.cyan('📁 Fichier .env local (RECOMMANDÉ)'));
        }
      } else {
        console.log(chalk.yellow('🔧 Configuration npm ou variables d\'environnement'));
        console.log(chalk.white('💡 Conseil: Utilisez "ai-team setup-api" pour créer un .env local'));
      }
      
      // Test de la clé API
      try {
        console.log(chalk.yellow('🧪 Test de la clé API...'));
        const testValid = await this.testTogetherAI(apiKey);
        if (testValid) {
          console.log(chalk.green('✅ Clé API valide et fonctionnelle'));
    } else {
          console.log(chalk.red('❌ Clé API invalide ou non fonctionnelle'));
          return;
        }
      } catch (error) {
        console.log(chalk.red(`❌ Erreur test API: ${error.message}`));
        return;
      }
      } else {
      console.log(chalk.red('❌ Clé API Together.ai non configurée'));
      console.log(chalk.yellow('💡 Exécutez: ai-team setup-api'));
      return;
    }

    console.log(chalk.cyan('\n🎯 Synchronisation des secrets GitHub terminée avec succès !'));
  }

  run() {
    // Affichage par défaut si aucune commande
    if (!process.argv.slice(2).length) {
      console.log(chalk.blue.bold('🤖 AI Team Orchestrator v2.0'));
      console.log(chalk.cyan('🧠 Propulsé par DeepSeek R1 - Plus intelligent, plus rapide !'));
      console.log(chalk.gray('Création automatique d\'issues GitHub en quelques secondes\n'));
      
      console.log(chalk.yellow('🚀 COMMANDES ULTRA-RAPIDES:'));
      console.log(chalk.white('  ai-team check'), chalk.gray('      - Diagnostic complet'));
      console.log(chalk.white('  ai-team init'), chalk.gray('       - Initialisation du projet'));
      console.log(chalk.white('  ai-team issue "titre"'), chalk.gray('- Création automatique d\'issue'));
      console.log(chalk.white('  ai-team create "desc"'), chalk.gray('- Mode création rapide'));
      console.log(chalk.white('  ai-team setup-api'), chalk.gray('   - Configuration en 30s'));
      console.log();
      
      console.log(chalk.green('🎯 Exemples instantanés:'));
      console.log(chalk.blue('  ai-team setup-api'), chalk.gray('   - Configuration .env (recommandé)'));
      console.log(chalk.blue('  ai-team init'), chalk.gray('          - Installation workflows'));
      console.log(chalk.blue('  ai-team issue "Landing page moderne" --type frontend'));
      console.log(chalk.blue('  ai-team issue "API REST avec auth" --type backend'));
      console.log();
      
      console.log(chalk.cyan('💡 NOUVEAU: Configuration ultra-simple avec fichier .env !'));
      console.log(chalk.gray('Plus de secrets GitHub complexes, tout se fait en local ! ⚡'));
    }
    
    this.program.parse();
  }
}

// Point d'entrée
const cli = new AITeamCLI();
cli.run(); 