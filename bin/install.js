#!/usr/bin/env node

/**
 * AI Team Orchestrator - Installation CLI
 * Zero-Config AI coding team for GitHub
 */

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { installAITeam } from '../lib/installer.js';
import {
  Logger,
  EnvironmentValidator,
  GitValidator,
  OperationManager,
  ProgressManager,
  ErrorHandler,
  AITeamError
} from '../lib/utils.js';

class AITeamInstaller {
  constructor() {
    this.logger = null;
    this.envValidator = null;
    this.gitValidator = null;
    this.operationManager = null;
    this.progressManager = null;
    this.errorHandler = null;
    this.verbose = false;
    
    this.setupProgram();
  }

  setupProgram() {
    program
      .name('ai-team-install')
      .description('Installation interactive d\'AI Team Orchestrator pour votre repository GitHub')
      .version('1.1.0')
      .option('-t, --type <type>', 'Type d\'installation (zero-config, full, custom)', 'zero-config')
      .option('-f, --force', 'Forcer la réinstallation sans confirmation', false)
      .option('-v, --verbose', 'Mode verbose pour plus de détails', false)
      .option('--interactive', 'Mode installation interactive', true)
      .option('--no-validation', 'Ignorer les validations d\'environnement')
      .option('--dry-run', 'Simulation sans modification réelle')
      .action((options) => this.handleInstallation(options));
  }

  initializeServices(verbose = false) {
    this.verbose = verbose;
    this.logger = new Logger(verbose);
    this.envValidator = new EnvironmentValidator(this.logger);
    this.gitValidator = new GitValidator(this.logger);
    this.operationManager = new OperationManager(this.logger);
    this.progressManager = new ProgressManager(this.logger);
    this.errorHandler = new ErrorHandler(this.logger);
  }

  async handleInstallation(options) {
    this.initializeServices(options.verbose);
    
    try {
      await this.runInstallationProcess(options);
    } catch (error) {
      this.handleInstallationError(error, options);
    }
  }

  async runInstallationProcess(options) {
    // Bannière d'accueil
    this.showWelcomeBanner();

    // Mode interactif
    if (options.interactive) {
      options = await this.runInteractiveSetup(options);
    }

    // Validation de l'environnement
    if (options.validation !== false) {
      await this.validateEnvironment();
    }

    // Analyse du repository actuel
    const repoInfo = await this.analyzeRepository();
    
    // Confirmation avant installation
    if (!options.force) {
      const confirmed = await this.confirmInstallation(options, repoInfo);
      if (!confirmed) {
        this.logger.info('Installation annulée par l\'utilisateur');
        return;
      }
    }

    // Installation avec monitoring
    await this.performInstallation(options, repoInfo);

    // Vérification post-installation
    await this.verifyInstallation(options);

    // Guide de démarrage
    this.showPostInstallationGuide(options, repoInfo);
  }

  showWelcomeBanner() {
    console.clear();
    console.log(chalk.blue.bold('🤖 AI Team Orchestrator - Installation'));
    console.log(chalk.gray('Zero-Config AI coding team for GitHub\n'));
    
    console.log(chalk.cyan('✨ Fonctionnalités:'));
    console.log('  • 6 agents IA spécialisés (Frontend, Backend, QA, etc.)');
    console.log('  • Génération automatique de code depuis les issues GitHub');
    console.log('  • Workflows GitHub Actions inclus');
    console.log('  • Configuration zéro required\n');
  }

  async runInteractiveSetup(options) {
    console.log(chalk.yellow('🎯 Configuration interactive\n'));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'installationType',
        message: 'Quel type d\'installation souhaitez-vous ?',
        choices: [
          {
            name: '⚡ Zero-Config - Installation rapide (recommandé)',
            value: 'zero-config',
            short: 'Zero-Config'
          },
          {
            name: '🔧 Full - Installation complète avec tous les agents',
            value: 'full',
            short: 'Full'
          },
          {
            name: '⚙️  Custom - Configuration personnalisée',
            value: 'custom',
            short: 'Custom'
          }
        ],
        default: 'zero-config'
      },
      {
        type: 'confirm',
        name: 'runValidation',
        message: 'Exécuter les validations d\'environnement ?',
        default: true
      },
      {
        type: 'confirm',
        name: 'autoCommit',
        message: 'Committer automatiquement les changements ?',
        default: false,
        when: (answers) => answers.installationType !== 'dry-run'
      }
    ]);

    // Configuration avancée pour custom
    if (answers.installationType === 'custom') {
      const customOptions = await this.getCustomInstallationOptions();
      Object.assign(answers, customOptions);
    }

    return {
      ...options,
      type: answers.installationType,
      validation: answers.runValidation,
      autoCommit: answers.autoCommit,
      ...answers
    };
  }

  async getCustomInstallationOptions() {
    return await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedAgents',
        message: 'Quels agents souhaitez-vous installer ?',
        choices: [
          { name: '🎨 Frontend Specialist', value: 'frontend', checked: true },
          { name: '⚙️  Backend Specialist', value: 'backend', checked: true },
          { name: '🐛 Bug Hunter', value: 'bug-hunter', checked: true },
          { name: '🧪 QA Engineer', value: 'qa-engineer', checked: false },
          { name: '🏗️  Code Architect', value: 'architect', checked: false },
          { name: '🚀 Full-Stack Developer', value: 'fullstack', checked: true }
        ]
      },
      {
        type: 'confirm',
        name: 'enableNotifications',
        message: 'Activer les notifications Slack/Discord ?',
        default: false
      },
      {
        type: 'input',
        name: 'webhookUrl',
        message: 'URL du webhook (optionnel):',
        when: (answers) => answers.enableNotifications,
        validate: (input) => {
          if (!input) return true;
          try {
            new URL(input);
            return true;
          } catch {
            return 'URL invalide';
          }
        }
      }
    ]);
  }

  async validateEnvironment() {
    this.logger.title('Validation de l\'environnement');

    const validationSteps = [
      {
        name: 'Prérequis système',
        action: () => this.envValidator.validateAll()
      },
      {
        name: 'Configuration Git',
        action: () => this.gitValidator.validateRepository()
      },
      {
        name: 'Permissions d\'écriture',
        action: () => this.checkWritePermissions()
      },
      {
        name: 'Connectivité GitHub',
        action: () => this.checkGitHubConnectivity()
      }
    ];

    for (const step of validationSteps) {
      const spinner = this.progressManager.start(`Validation: ${step.name}...`);
      
      try {
        await this.operationManager.executeWithRetry(
          step.action,
          {
            maxRetries: 2,
            timeout: 10000,
            description: step.name
          }
        );
        spinner.succeed(`${step.name} ✓`);
      } catch (error) {
        spinner.fail(`${step.name} ✗`);
        
        const shouldContinue = await this.handleValidationError(error, step.name);
        if (!shouldContinue) {
          throw new AITeamError('Validation échouée', 'validation_failed');
        }
      }
    }

    this.logger.success('Environnement validé avec succès!');
  }

  async checkWritePermissions() {
    const fs = await import('fs/promises');
    const testFile = '.ai-team-test';
    
    try {
      await fs.writeFile(testFile, 'test');
      await fs.unlink(testFile);
    } catch (error) {
      throw new AITeamError(
        'Permissions d\'écriture insuffisantes',
        'permission_error',
        [
          'Vérifiez les permissions du répertoire',
          'Exécutez avec sudo si nécessaire'
        ]
      );
    }
  }

  async checkGitHubConnectivity() {
    try {
      const { execSync } = await import('child_process');
      execSync('gh auth status', { stdio: 'ignore', timeout: 5000 });
    } catch (error) {
      // Optionnel pour GitHub CLI
      this.logger.warning('GitHub CLI non authentifié (optionnel)');
    }
  }

  async handleValidationError(error, stepName) {
    console.log(chalk.red(`\n❌ Échec de validation: ${stepName}`));
    console.log(chalk.yellow(`Erreur: ${error.message}`));
    
    if (error.suggestions) {
      console.log(chalk.cyan('\n💡 Solutions suggérées:'));
      error.suggestions.forEach(suggestion => {
        console.log(chalk.gray(`  • ${suggestion}`));
      });
    }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Comment souhaitez-vous procéder ?',
        choices: [
          { name: '🔄 Réessayer', value: 'retry' },
          { name: '⏭️  Ignorer et continuer', value: 'continue' },
          { name: '🛠️  Afficher l\'aide', value: 'help' },
          { name: '❌ Annuler l\'installation', value: 'cancel' }
        ]
      }
    ]);

    switch (answer.action) {
      case 'retry':
        return true;
      case 'continue':
        this.logger.warning(`Validation ignorée: ${stepName}`);
        return true;
      case 'help':
        this.showTroubleshootingHelp(error);
        return await this.handleValidationError(error, stepName);
      case 'cancel':
        return false;
    }
  }

  showTroubleshootingHelp(error) {
    console.log(chalk.blue('\n🆘 Guide de résolution des problèmes\n'));
    
    const troubleshooting = {
      'missing_dependency': [
        'Installer les dépendances manquantes',
        'Vérifier les variables d\'environnement PATH',
        'Redémarrer le terminal après installation'
      ],
      'git_config_missing': [
        'Configurer Git: git config --global user.name "Nom"',
        'Configurer email: git config --global user.email "email@example.com"'
      ],
      'not_git_repo': [
        'Initialiser Git: git init',
        'Ajouter un remote: git remote add origin <url>'
      ]
    };

    const solutions = troubleshooting[error.type] || error.suggestions || [];
    solutions.forEach((solution, index) => {
      console.log(chalk.yellow(`${index + 1}. ${solution}`));
    });

    console.log(chalk.cyan('\n📚 Ressources utiles:'));
    console.log('• Documentation: https://github.com/Romjah/ai-team-orchestrator#readme');
    console.log('• Support: https://github.com/Romjah/ai-team-orchestrator/issues');
  }

  async analyzeRepository() {
    const spinner = this.progressManager.start('Analyse du repository...');
    
    try {
      const repoInfo = await this.gatherRepositoryInfo();
      spinner.succeed('Repository analysé');
      return repoInfo;
    } catch (error) {
      spinner.fail('Échec d\'analyse du repository');
      throw error;
    }
  }

  async gatherRepositoryInfo() {
    const { execSync } = await import('child_process');
    const fs = await import('fs/promises');
    
    const info = {
      hasPackageJson: false,
      language: 'unknown',
      framework: 'unknown',
      hasExistingWorkflows: false,
      size: 'small'
    };

    try {
      // Détecter package.json
      await fs.access('package.json');
      info.hasPackageJson = true;
      
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      info.language = 'javascript';
      
      // Détecter le framework
      if (packageJson.dependencies) {
        if (packageJson.dependencies.react) info.framework = 'react';
        else if (packageJson.dependencies.vue) info.framework = 'vue';
        else if (packageJson.dependencies.express) info.framework = 'express';
        else if (packageJson.dependencies.next) info.framework = 'nextjs';
      }
    } catch {
      // Pas de package.json
    }

    try {
      // Vérifier workflows existants
      await fs.access('.github/workflows');
      const workflows = await fs.readdir('.github/workflows');
      info.hasExistingWorkflows = workflows.length > 0;
    } catch {
      // Pas de workflows
    }

    // Estimer la taille du projet
    try {
      const files = execSync('find . -type f | wc -l', { encoding: 'utf8' });
      const fileCount = parseInt(files.trim());
      if (fileCount > 1000) info.size = 'large';
      else if (fileCount > 100) info.size = 'medium';
    } catch {
      // Estimation impossible
    }

    return info;
  }

  async confirmInstallation(options, repoInfo) {
    console.log(chalk.blue('\n📋 Résumé de l\'installation:\n'));
    
    console.log(chalk.white('Type:'), chalk.cyan(options.type));
    console.log(chalk.white('Language détecté:'), chalk.cyan(repoInfo.language));
    console.log(chalk.white('Framework:'), chalk.cyan(repoInfo.framework));
    console.log(chalk.white('Taille du projet:'), chalk.cyan(repoInfo.size));
    
    if (repoInfo.hasExistingWorkflows) {
      console.log(chalk.yellow('\n⚠️  Des workflows GitHub Actions existent déjà'));
    }

    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Confirmer l\'installation avec ces paramètres ?',
        default: true
      }
    ]);

    return answer.proceed;
  }

  async performInstallation(options, repoInfo) {
    this.logger.title('Installation d\'AI Team');

    const steps = this.getInstallationSteps(options, repoInfo);
    let stepIndex = 0;

    for (const step of steps) {
      stepIndex++;
      const spinner = this.progressManager.start(
        `[${stepIndex}/${steps.length}] ${step.description}...`
      );

      try {
        await this.operationManager.executeWithRetry(
          () => step.action(options, repoInfo),
          {
            maxRetries: step.retries || 2,
            timeout: step.timeout || 30000,
            description: step.description
          }
        );
        
        spinner.succeed(`${step.description} ✓`);
        
        if (step.onSuccess) {
          await step.onSuccess(options, repoInfo);
        }
        
      } catch (error) {
        spinner.fail(`${step.description} ✗`);
        
        if (step.optional) {
          this.logger.warning(`Étape optionnelle échouée: ${step.description}`);
          continue;
        }
        
        throw new AITeamError(
          `Échec de l'étape: ${step.description}`,
          'installation_step_failed',
          [`Erreur: ${error.message}`]
        );
      }
    }

    this.logger.success('Installation terminée avec succès! 🎉');
  }

  getInstallationSteps(options, repoInfo) {
    const steps = [
      {
        description: 'Création des répertoires',
        action: () => this.createDirectories(),
        timeout: 5000
      },
      {
        description: 'Installation des templates',
        action: (opts) => installAITeam(opts.type, opts.force),
        timeout: 30000
      },
      {
        description: 'Configuration personnalisée',
        action: (opts, info) => this.applyCustomConfiguration(opts, info),
        optional: true
      }
    ];

    if (options.autoCommit) {
      steps.push({
        description: 'Commit automatique',
        action: () => this.autoCommitChanges(),
        optional: true,
        timeout: 15000
      });
    }

    return steps;
  }

  async createDirectories() {
    const fs = await import('fs/promises');
    const dirs = ['.github/workflows', '.github/scripts'];
    
    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async applyCustomConfiguration(options, repoInfo) {
    if (options.selectedAgents) {
      this.logger.debug(`Configuration des agents: ${options.selectedAgents.join(', ')}`);
    }
    
    if (options.webhookUrl) {
      this.logger.debug(`Configuration webhook: ${options.webhookUrl}`);
    }
  }

  async autoCommitChanges() {
    const { execSync } = await import('child_process');
    
    execSync('git add .github/', { stdio: 'pipe' });
    execSync('git commit -m "🤖 Add AI Team Orchestrator"', { stdio: 'pipe' });
    
    this.logger.success('Changements commitées automatiquement');
  }

  async verifyInstallation(options) {
    const spinner = this.progressManager.start('Vérification de l\'installation...');
    
    try {
      const fs = await import('fs/promises');
      
      // Vérifier les fichiers essentiels
      const requiredFiles = [
        '.github/workflows/ai-team-zero-config.yml',
        '.github/scripts/zero_config_generator.py'
      ];
      
      for (const file of requiredFiles) {
        await fs.access(file);
      }
      
      spinner.succeed('Installation vérifiée');
    } catch (error) {
      spinner.fail('Vérification échouée');
      throw new AITeamError(
        'Installation incomplète',
        'verification_failed',
        ['Réexécuter l\'installation avec --force']
      );
    }
  }

  showPostInstallationGuide(options, repoInfo) {
    console.log(chalk.blue.bold('\n🎉 Installation réussie!\n'));
    
    console.log(chalk.yellow('🚀 Prochaines étapes:'));
    console.log(chalk.white('1.'), 'git push (pour activer les workflows)');
    console.log(chalk.white('2.'), 'Créer une issue GitHub avec une description détaillée');
    console.log(chalk.white('3.'), 'Observer l\'IA analyser et générer du code automatiquement');
    
    console.log(chalk.cyan('\n💡 Commandes utiles:'));
    console.log(chalk.gray('• ai-team status'), '- Vérifier l\'installation');
    console.log(chalk.gray('• ai-team demo'), '- Créer une issue de test');
    console.log(chalk.gray('• ai-team agents'), '- Voir les agents disponibles');
    console.log(chalk.gray('• ai-team doctor'), '- Diagnostiquer les problèmes');
    
    console.log(chalk.green('\n✨ Votre équipe IA est prête à coder!'));
    
    if (repoInfo.language !== 'unknown') {
      console.log(chalk.gray(`\nOptimisé pour: ${repoInfo.language}/${repoInfo.framework}`));
    }
  }

  handleInstallationError(error, options) {
    this.progressManager?.stop();
    
    if (!this.errorHandler) {
      console.error(chalk.red('Erreur d\'installation:'), error.message);
      process.exit(1);
    }
    
    this.errorHandler.handle(error);
    
    console.log(chalk.blue('\n🔧 Options de récupération:'));
    console.log('• Réexécuter avec --verbose pour plus de détails');
    console.log('• Utiliser --force pour forcer la réinstallation');
    console.log('• Exécuter ai-team doctor pour diagnostiquer');
    
    process.exit(1);
  }

  run() {
    program.parse();
  }
}

// Point d'entrée
const installer = new AITeamInstaller();
installer.run(); 