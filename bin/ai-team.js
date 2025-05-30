#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Together from 'together-ai';
import { APIKeyManager } from '../lib/api-config.js';

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
      .version('2.0.0')
      .option('-v, --verbose', 'Mode verbose')
      .option('--quick', 'Mode ultra-rapide (par défaut)');
  }

  setupCommands() {
    this.setupIssueCommand();
    this.setupCreateCommand();
    this.setupSetupCommand();
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
      .action(async () => {
        try {
          const apiManager = new APIKeyManager();
          await apiManager.setupAPIKeyInteractively();
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
      
      // Token GitHub depuis l'environnement
      const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
      
      if (!githubToken) {
        console.log(chalk.red('❌ Token GitHub manquant'));
        console.log(chalk.white('💡 Configurez GITHUB_TOKEN dans votre environnement'));
        console.log(chalk.white('   ou créez l\'issue manuellement:'));
        console.log(chalk.cyan(`   Titre: ${title}`));
        console.log(chalk.cyan(`   Description:\n${description}`));
        return;
      }

      const issueData = {
        title: title,
        body: `${description}

---
**🤖 Paramètres AI Team:**
- Agent: ${type}
- Modèle: DeepSeek R1 (DeepSeek-R1-Distill-Llama-70B-free)
- Créé via: ai-team v2.0

**🚀 Workflow automatique:**
1. L'agent IA va analyser cette demande
2. Du code sera généré avec DeepSeek R1
3. Une Pull Request sera créée automatiquement

*Généré par AI Team Orchestrator v2.0 avec DeepSeek R1*`,
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
        throw new Error(`GitHub API Error: ${response.status}`);
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

  run() {
    // Affichage par défaut si aucune commande
    if (!process.argv.slice(2).length) {
      console.log(chalk.blue.bold('🤖 AI Team Orchestrator v2.0'));
      console.log(chalk.cyan('🧠 Propulsé par DeepSeek R1 - Plus intelligent, plus rapide !'));
      console.log(chalk.gray('Création automatique d\'issues GitHub en quelques secondes\n'));
      
      console.log(chalk.yellow('🚀 COMMANDES ULTRA-RAPIDES:'));
      console.log(chalk.white('  ai-team issue "titre"'), chalk.gray('- Création automatique d\'issue'));
      console.log(chalk.white('  ai-team create "desc"'), chalk.gray('- Mode création rapide'));
      console.log(chalk.white('  ai-team setup-api'), chalk.gray('   - Configuration en 30s'));
      console.log();
      
      console.log(chalk.green('🎯 Exemples instantanés:'));
      console.log(chalk.blue('  ai-team issue "Landing page moderne" --type frontend'));
      console.log(chalk.blue('  ai-team issue "API REST avec auth" --type backend'));
      console.log();
      
      console.log(chalk.cyan('💡 NOUVEAU: DeepSeek R1 - IA de dernière génération gratuite !'));
      console.log(chalk.gray('Plus d\'étapes complexes, place à l\'action immédiate ! ⚡'));
    }
    
    this.program.parse();
  }
}

// Point d'entrée
const cli = new AITeamCLI();
cli.run(); 