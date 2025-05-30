#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { installAITeam, checkStatus, listAgents } from '../lib/installer.js';
import { createDemoIssue } from '../lib/demo.js';
import {
  Logger,
  EnvironmentValidator,
  GitValidator,
  OperationManager,
  ProgressManager,
  ErrorHandler,
  AITeamError
} from '../lib/utils.js';
import { APIKeyManager, ensureAPIKeyConfigured } from '../lib/api-config.js';

class AITeamCLI {
  constructor() {
    this.program = new Command();
    this.logger = new Logger(false);
    this.setupProgram();
    this.setupCommands();
  }

  setupProgram() {
    this.program
      .name('ai-team')
      .description('🤖 AI Team Orchestrator - Création automatique d\'issues avec Together.ai')
      .version('2.0.0')
      .option('-v, --verbose', 'Mode verbose pour plus de détails')
      .option('--quick', 'Mode ultra-rapide (par défaut)')
      .option('--auto', 'Mode automatique complet');
  }

  setupCommands() {
    this.setupQuickCreateCommand();
    this.setupAutoIssueCommand();
    this.setupInstallCommand();
    this.setupStatusCommand();
    this.setupSetupApiCommand();
  }

  setupQuickCreateCommand() {
    this.program
      .command('create [description]')
      .description('🚀 Création rapide de tâche AI (nouvelle version simplifiée)')
      .option('-t, --type <type>', 'Type d\'agent (frontend, backend, testing, etc.)', 'feature')
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

  async handleQuickCreate(description, options) {
    console.log(chalk.cyan('🤖 AI Team Orchestrator v2.0 - Mode Rapide'));
    
    // Configuration rapide si nécessaire
    const apiKey = await this.ensureQuickSetup();
    
    // Description de la tâche
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

    // Type d'agent rapide
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

    // Création automatique d'issue si demandée
    if (options.autoIssue) {
      await this.createGitHubIssue(description, options.type, apiKey);
    } else {
      console.log(chalk.cyan('\n🎯 Prêt ! Lancez avec --auto-issue pour créer automatiquement l\'issue GitHub'));
    }
  }

  setupAutoIssueCommand() {
    this.program
      .command('issue <title> [description]')
      .description('🔥 Création automatique d\'issue GitHub avec IA')
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

  async handleAutoIssue(title, description, options) {
    console.log(chalk.cyan('🔥 Création automatique d\'issue avec Together.ai'));
    
    const apiKey = await this.ensureQuickSetup();
    
    // Génération automatique de description si manquante
    if (!description) {
      console.log(chalk.yellow('🤖 Génération automatique de la description...'));
      description = await this.generateDescriptionWithAI(title, options.type, apiKey);
    }

    await this.createGitHubIssue(title, description, options.type, apiKey, options.labels);
  }

  async ensureQuickSetup() {
    const apiManager = new APIKeyManager();
    
    // Vérification rapide et silencieuse
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

    // Sauvegarde rapide
    apiManager.saveAPIKey(apiKey);
    console.log(chalk.green('✅ Configuration sauvegardée !'));
    
    return apiKey;
  }

  async generateDescriptionWithAI(title, type, apiKey) {
    const prompt = `Génère une description détaillée pour cette tâche de développement:
Titre: ${title}
Type: ${type}

Retourne une description structurée avec:
- Objectif
- Fonctionnalités attendues
- Critères d'acceptation
- Technologies suggérées`;

    try {
      const response = await fetch('https://api.together.ai/inference', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-2-7b-chat-hf',
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.output?.choices?.[0]?.text || `## Objectif
${title}

## Description
Tâche de type ${type} à implémenter.

## Critères d'acceptation
- [ ] Implémentation fonctionnelle
- [ ] Tests inclus
- [ ] Documentation mise à jour`;

    } catch (error) {
      console.log(chalk.yellow('⚠️ Génération IA échouée, utilisation d\'un template par défaut'));
      return `## Objectif
${title}

## Description
Tâche de type ${type} à implémenter.

## Critères d'acceptation
- [ ] Implémentation fonctionnelle
- [ ] Tests inclus
- [ ] Documentation mise à jour`;
    }
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
      
      // Récupération du token GitHub depuis l'environnement
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
        body: description,
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
      
      // Lancement automatique du workflow
      console.log(chalk.yellow('🚀 Le workflow AI Team va se déclencher automatiquement...'));

    } catch (error) {
      console.log(chalk.red(`❌ Erreur lors de la création: ${error.message}`));
      console.log(chalk.white('\n📋 Créez l\'issue manuellement:'));
      console.log(chalk.cyan(`Titre: ${title}`));
      console.log(chalk.cyan(`Description:\n${description}`));
      console.log(chalk.cyan(`Labels: ${labels}`));
    }
  }

  setupInstallCommand() {
    this.program
      .command('install')
      .description('Installer AI Team dans le repository Git actuel')
      .option('-t, --type <type>', 'Type d\'installation: zero-config, full, github-app', 'zero-config')
      .option('-f, --force', 'Forcer la réinstallation')
      .option('--skip-validation', 'Ignorer la validation d\'environnement')
      .action(async (options) => {
        try {
          await this.handleInstallCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleInstallCommand(options) {
    this.logger.title('Installation d\'AI Team');

    // Validation pré-installation
    if (!options.skipValidation) {
      await this.validateEnvironment();
      await this.validateGitRepository();
    }

    // Confirmation interactive si nécessaire
    if (!options.force && await this.needsConfirmation()) {
      const confirmed = await this.confirmInstallation(options);
      if (!confirmed) {
        this.logger.info('Installation annulée par l\'utilisateur');
        return;
      }
    }

    // Installation avec retry automatique
    await this.operationManager.executeWithRetry(
      () => this.performInstallation(options),
      {
        maxRetries: 3,
        timeout: 60000,
        description: 'Installation d\'AI Team'
      }
    );

    this.showInstallationSuccess(options);
  }

  async validateEnvironment() {
    const spinner = this.progressManager.start('Validation de l\'environnement...');
    
    try {
      await this.envValidator.validateAll();
      spinner.succeed('Environnement validé');
    } catch (error) {
      spinner.fail('Échec de validation de l\'environnement');
      throw error;
    }
  }

  async validateGitRepository() {
    const spinner = this.progressManager.start('Validation du repository Git...');
    
    try {
      await this.gitValidator.validateRepository();
      spinner.succeed('Repository Git validé');
    } catch (error) {
      spinner.fail('Échec de validation Git');
      throw error;
    }
  }

  async needsConfirmation() {
    // Vérifier si AI Team est déjà installé
    try {
      const status = await checkStatus();
      return status.hasExistingInstallation;
    } catch {
      return false;
    }
  }

  async confirmInstallation(options) {
    console.log(chalk.yellow('\n⚠️  AI Team semble déjà installé.'));
    
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Continuer l'installation (${options.type}) ?`,
        default: false
      }
    ]);

    return answer.proceed;
  }

  async performInstallation(options) {
    this.progressManager.start(`Installation ${options.type}...`);
    
    try {
      this.progressManager.update('Création des répertoires...');
      await installAITeam(options.type, options.force);
      
      this.progressManager.succeed('Installation terminée');
    } catch (error) {
      this.progressManager.fail('Échec de l\'installation');
      throw new AITeamError(
        `Installation échouée: ${error.message}`,
        'installation_failed',
        [
          'Vérifiez les permissions du répertoire',
          'Essayez avec --force pour forcer la réinstallation',
          'Utilisez --verbose pour plus de détails'
        ]
      );
    }
  }

  showInstallationSuccess(options) {
    this.logger.success('AI Team installé avec succès! 🎉');
    
    console.log(chalk.yellow('\n🎯 Prochaines étapes:'));
    console.log(chalk.white('1.'), 'git add . && git commit -m "🤖 Add AI Team" && git push');
    console.log(chalk.white('2.'), 'Créer une issue: "Créer une page moderne"');
    console.log(chalk.white('3.'), 'Regarder la magie opérer! ✨');
    
    console.log(chalk.cyan('\n💡 Commandes utiles:'));
    console.log(chalk.gray('• ai-team status'), '- Vérifier l\'installation');
    console.log(chalk.gray('• ai-team demo'), '- Créer une issue de test');
    console.log(chalk.gray('• ai-team agents'), '- Voir les agents disponibles');
  }

  setupStatusCommand() {
    this.program
      .command('status')
      .description('Vérifier le statut d\'installation d\'AI Team')
      .option('--json', 'Sortie au format JSON')
      .action(async (options) => {
        try {
          await this.handleStatusCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleStatusCommand(options) {
    this.logger.title('Statut d\'AI Team');
    
    const spinner = this.progressManager.start('Vérification du statut...');
    
    try {
      const status = await checkStatus();
      spinner.succeed('Statut vérifié');
      
      if (options.json) {
        console.log(JSON.stringify(status, null, 2));
      } else {
        this.displayStatusResults(status);
      }
    } catch (error) {
      spinner.fail('Échec de vérification du statut');
      throw error;
    }
  }

  displayStatusResults(status) {
    // Implementation depends on what checkStatus returns
    console.log(chalk.green('✅ Statut d\'AI Team affiché'));
  }

  setupSetupApiCommand() {
    this.program
      .command('setup-api')
      .description('🔑 Assistant de configuration pour la clé API Together.ai')
      .option('--check', 'Vérifier le statut de la clé API')
      .action(async (options) => {
        try {
          await this.handleSetupApiCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleSetupApiCommand(options) {
    const apiManager = new APIKeyManager();
    
    if (options.check) {
      // Mode vérification
      this.logger.title('Vérification de la clé API');
      await apiManager.checkAPIKeyStatus();
      return;
    }
    
    // Mode configuration
    this.logger.title('Assistant de configuration - Clé API Together.ai');
    
    // Vérifier si déjà configurée
    if (apiManager.isAPIKeyConfigured()) {
      console.log(chalk.yellow('\n⚠️  Une clé API est déjà configurée.'));
      
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: '🔧 Que voulez-vous faire ?',
          choices: [
            { name: '🔍 Vérifier la clé actuelle', value: 'check' },
            { name: '🔄 Reconfigurer une nouvelle clé', value: 'reconfigure' },
            { name: '❌ Annuler', value: 'cancel' }
          ]
        }
      ]);
      
      if (action === 'check') {
        await apiManager.checkAPIKeyStatus();
        return;
      } else if (action === 'cancel') {
        console.log(chalk.yellow('⏸️  Configuration annulée.'));
        return;
      }
      // Continue pour reconfigurer
    }
    
    // Lancer l'assistant interactif
    const success = await apiManager.setupAPIKeyInteractively();
    
    if (success) {
      console.log(chalk.green('\n🎉 Parfait ! Votre clé API est maintenant configurée.'));
      console.log(chalk.cyan('\n💡 Prochaines étapes:'));
      console.log(chalk.white('   • ai-team install    - Installer AI Team dans votre repo'));
      console.log(chalk.white('   • ai-team create     - Créer votre première tâche'));
      console.log(chalk.white('   • ai-team demo       - Essayer avec une démo'));
    } else {
      console.log(chalk.red('\n❌ Configuration échouée.'));
      console.log(chalk.white('💡 Vous pouvez réessayer avec: ai-team setup-api'));
    }
  }

  setupErrorHandling() {
    // Gestion des erreurs non catchées
    process.on('uncaughtException', (error) => {
      if (this.errorHandler) {
        this.errorHandler.handle(error);
      } else {
        console.error(chalk.red('Erreur fatale:'), error.message);
      }
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      if (this.errorHandler) {
        this.errorHandler.handle(reason);
      } else {
        console.error(chalk.red('Promise rejetée:'), reason);
      }
      process.exit(1);
    });

    // Gestion de Ctrl+C
    process.on('SIGINT', () => {
      if (this.progressManager) {
        this.progressManager.stop();
      }
      console.log(chalk.yellow('\n\n👋 Opération interrompue par l\'utilisateur'));
      process.exit(0);
    });
  }

  // Affichage d'aide si aucun argument
  showDefaultHelp() {
    if (!process.argv.slice(2).length) {
      console.clear();
      
      console.log(chalk.blue.bold('🤖 AI Team Orchestrator v1.4.3'));
      console.log(chalk.cyan('✨ Votre équipe IA gratuite avec Together.ai'));
      console.log(chalk.gray('Zero-Config AI coding team for GitHub\n'));
      
      console.log(chalk.yellow('🚀 DÉMARRAGE RAPIDE:'));
      console.log(chalk.white('  ai-team create'), chalk.gray('- Mode interactif pour créer une tâche'));
      console.log(chalk.white('  ai-team install'), chalk.gray('- Installer AI Team dans votre repo'));
      console.log();
      
      console.log(chalk.yellow('📋 COMMANDES DISPONIBLES:'));
      console.log(chalk.white('  ai-team create'), chalk.gray('   - 🎯 Créer une tâche de manière interactive'));
      console.log(chalk.white('  ai-team install'), chalk.gray('  - 📦 Installer AI Team dans le repository'));
      console.log(chalk.white('  ai-team status'), chalk.gray('   - ✅ Vérifier le statut d\'installation'));
      console.log(chalk.white('  ai-team agents'), chalk.gray('   - 🤖 Lister les agents IA disponibles'));
      console.log(chalk.white('  ai-team demo'), chalk.gray('     - 🧪 Créer une issue de démonstration'));
      console.log(chalk.white('  ai-team debug'), chalk.gray('    - 🔍 Diagnostiquer les problèmes'));
      console.log(chalk.white('  ai-team doctor'), chalk.gray('   - 🩺 Réparer les problèmes détectés'));
      console.log();
      
      console.log(chalk.cyan('💡 NOUVEAU:'));
      console.log(chalk.white('• Together.ai - Modèles IA gratuits (Llama + CodeLlama)'));
      console.log(chalk.white('• Mode interactif avec guide étape par étape'));
      console.log(chalk.white('• Création d\'issues directement depuis le terminal'));
      console.log();
      
      console.log(chalk.green('🎯 Pour commencer immédiatement:'));
      console.log(chalk.blue.bold('  ai-team create'));
      console.log();
      
      console.log(chalk.gray('Pour plus d\'options: ai-team --help'));
    }
  }

  run() {
    this.showDefaultHelp();
    this.program.parse();
  }
}

// Point d'entrée principal
const cli = new AITeamCLI();
cli.run(); 