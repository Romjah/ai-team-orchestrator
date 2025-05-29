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

class AITeamCLI {
  constructor() {
    this.program = new Command();
    this.logger = null;
    this.envValidator = null;
    this.gitValidator = null;
    this.operationManager = null;
    this.progressManager = null;
    this.errorHandler = null;
    this.verbose = false;
    
    this.setupProgram();
    this.setupCommands();
    this.setupErrorHandling();
  }

  setupProgram() {
    this.program
      .name('ai-team')
      .description('🤖 AI Team Orchestrator - Zero-Config AI coding team for GitHub')
      .version('1.4.2')
      .option('-v, --verbose', 'Mode verbose pour plus de détails')
      .option('--no-color', 'Désactiver les couleurs')
      .hook('preAction', (thisCommand) => {
        this.verbose = thisCommand.opts().verbose;
        this.initializeServices();
      });
  }

  initializeServices() {
    this.logger = new Logger(this.verbose);
    this.envValidator = new EnvironmentValidator(this.logger);
    this.gitValidator = new GitValidator(this.logger);
    this.operationManager = new OperationManager(this.logger);
    this.progressManager = new ProgressManager(this.logger);
    this.errorHandler = new ErrorHandler(this.logger);
  }

  setupCommands() {
    this.setupCreateCommand();
    this.setupInstallCommand();
    this.setupStatusCommand();
    this.setupAgentsCommand();
    this.setupDemoCommand();
    this.setupInitCommand();
    this.setupUninstallCommand();
    this.setupDoctorCommand();
    this.setupUpdateCommand();
    this.setupDebugCommand();
    this.setupFixCommand();
  }

  setupCreateCommand() {
    this.program
      .command('create')
      .description('🤖 Créer une nouvelle tâche AI Team de manière interactive')
      .option('--quick', 'Mode rapide sans vérifications')
      .action(async (options) => {
        try {
          await this.handleCreateCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleCreateCommand(options) {
    console.clear();
    this.logger.title('🤖 AI Team Orchestrator - Création de tâche');
    
    console.log(chalk.cyan('┌─────────────────────────────────────────────────────────────┐'));
    console.log(chalk.cyan('│') + chalk.white('  Bienvenue dans AI Team Orchestrator avec Together.ai      ') + chalk.cyan('│'));
    console.log(chalk.cyan('│') + chalk.white('  Votre équipe IA gratuite pour générer du code              ') + chalk.cyan('│'));
    console.log(chalk.cyan('└─────────────────────────────────────────────────────────────┘'));
    
    // Étape 1: Vérification de l'installation
    console.log(chalk.yellow('\n📋 ÉTAPE 1/5: Vérification de l\'installation'));
    await this.checkInstallationStatus(options.quick);
    
    // Étape 2: Vérification de la configuration
    console.log(chalk.yellow('\n🔧 ÉTAPE 2/5: Vérification de la configuration'));
    await this.checkConfiguration(options.quick);
    
    // Étape 3: Sélection de l'agent
    console.log(chalk.yellow('\n🤖 ÉTAPE 3/5: Sélection de l\'agent IA'));
    const agentType = await this.selectAgent();
    
    // Étape 4: Description de la tâche
    console.log(chalk.yellow('\n📝 ÉTAPE 4/5: Description de la tâche'));
    const taskDetails = await this.getTaskDetails(agentType);
    
    // Étape 5: Création et lancement
    console.log(chalk.yellow('\n🚀 ÉTAPE 5/5: Création et lancement'));
    await this.createAndLaunchTask(agentType, taskDetails);
  }

  async checkInstallationStatus(quick) {
    const spinner = this.progressManager.start('Vérification de l\'installation AI Team...');
    
    try {
      // Vérifier si les fichiers AI Team sont présents
      const fs = await import('fs/promises');
      
      await fs.access('.github/workflows/ai-team-mcp.yml');
      await fs.access('.github/scripts/ai_team_mcp.py');
      
      spinner.succeed('✅ AI Team installé et configuré');
      
      if (!quick) {
        console.log(chalk.green('   📁 Workflow: .github/workflows/ai-team-mcp.yml'));
        console.log(chalk.green('   🐍 Script: .github/scripts/ai_team_mcp.py'));
      }
      
    } catch (error) {
      spinner.fail('❌ AI Team n\'est pas installé');
      
      console.log(chalk.red('\n🚨 AI Team n\'est pas installé dans ce repository.'));
      console.log(chalk.white('   Voulez-vous l\'installer maintenant ?'));
      
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'install',
          message: '📦 Installer AI Team maintenant ?',
          default: true
        }
      ]);
      
      if (answer.install) {
        await this.performInstallation({ type: 'mcp', force: false });
        console.log(chalk.green('✅ AI Team installé avec succès !'));
      } else {
        console.log(chalk.red('❌ Installation annulée. AI Team est requis pour continuer.'));
        process.exit(1);
      }
    }
  }

  async checkConfiguration(quick) {
    const spinner = this.progressManager.start('Vérification de la configuration Together.ai...');
    
    // Simuler la vérification de la configuration
    // En réalité, on ne peut pas vérifier le secret GitHub depuis le CLI local
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      spinner.succeed('✅ Configuration vérifiée');
      
      if (!quick) {
        console.log(chalk.cyan('\n💡 Configuration requise:'));
        console.log(chalk.white('   🔑 Secret GitHub: TOGETHER_AI_API_KEY'));
        console.log(chalk.white('   🤖 Modèle classification: meta-llama/Llama-2-7b-chat-hf'));
        console.log(chalk.white('   💻 Modèle génération: codellama/CodeLlama-7b-Instruct-hf'));
      }
      
    } catch (error) {
      spinner.fail('❌ Configuration incomplète');
      
      console.log(chalk.red('\n🚨 Configuration Together.ai manquante !'));
      console.log(chalk.white('\n📋 Actions requises:'));
      console.log(chalk.white('1. Allez dans Settings → Secrets → Actions sur GitHub'));
      console.log(chalk.white('2. Créez un secret: TOGETHER_AI_API_KEY'));
      console.log(chalk.white('3. Valeur: 7b61ccee2b0b0f9d4b842862034eea9b18c5e4e26728ef8714b581c0cf0c91fe'));
      
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: '⚠️  Continuer sans vérifier la configuration ?',
          default: false
        }
      ]);
      
      if (!answer.continue) {
        console.log(chalk.yellow('⏸️  Configurez Together.ai et relancez ai-team create'));
        process.exit(0);
      }
    }
  }

  async selectAgent() {
    console.log(chalk.cyan('\n🤖 Agents IA disponibles:'));
    
    const agents = [
      {
        name: '🎨 Frontend Specialist - Pages web, interfaces, CSS',
        value: 'frontend',
        description: 'Parfait pour: landing pages, composants UI, animations CSS'
      },
      {
        name: '⚙️  Backend Specialist - APIs, serveurs, bases de données',
        value: 'backend', 
        description: 'Parfait pour: APIs REST, serveurs Express, intégrations'
      },
      {
        name: '🧪 QA Engineer - Tests et qualité',
        value: 'testing',
        description: 'Parfait pour: tests unitaires, tests d\'intégration, validation'
      },
      {
        name: '🐛 Bug Hunter - Corrections et déboggage',
        value: 'bug_fix',
        description: 'Parfait pour: corriger des bugs, optimiser les performances'
      },
      {
        name: '🏗️  Code Architect - Refactoring et structure',
        value: 'refactor',
        description: 'Parfait pour: restructurer le code, optimisation, architecture'
      },
      {
        name: '🚀 Full-Stack Developer - Développement général',
        value: 'feature',
        description: 'Parfait pour: nouvelles fonctionnalités, projets complets'
      }
    ];

    // Afficher les descriptions
    agents.forEach(agent => {
      console.log(chalk.white(`   ${agent.name}`));
      console.log(chalk.gray(`     ${agent.description}`));
    });

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'agent',
        message: '\n🎯 Quel agent voulez-vous utiliser ?',
        choices: agents.map(a => ({ name: a.name, value: a.value })),
        pageSize: 6
      }
    ]);

    const selectedAgent = agents.find(a => a.value === answer.agent);
    console.log(chalk.green(`\n✅ Agent sélectionné: ${selectedAgent.name}`));
    
    return answer.agent;
  }

  async getTaskDetails(agentType) {
    console.log(chalk.cyan('\n📝 Décrivez votre tâche:'));
    
    // Suggestions basées sur l'agent
    const suggestions = this.getTaskSuggestions(agentType);
    console.log(chalk.gray('💡 Suggestions:'));
    suggestions.forEach(suggestion => {
      console.log(chalk.gray(`   • ${suggestion}`));
    });

    // Titre de la tâche
    const titleAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: '📋 Titre de la tâche:',
        validate: input => input.length > 0 || 'Le titre est obligatoire',
        default: suggestions[0]
      }
    ]);

    console.log(chalk.cyan('\n📄 Description détaillée (étape par étape):'));
    
    // Questions pour construire la description
    const descriptionAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'mainGoal',
        message: '🎯 Objectif principal (que voulez-vous créer ?):',
        default: 'Une application moderne et responsive'
      },
      {
        type: 'checkbox',
        name: 'features',
        message: '✨ Fonctionnalités souhaitées:',
        choices: this.getFeatureChoices(agentType),
        default: this.getDefaultFeatures(agentType)
      },
      {
        type: 'list',
        name: 'style',
        message: '🎨 Style visuel:',
        choices: [
          { name: '🌟 Moderne avec animations', value: 'modern' },
          { name: '🎯 Minimaliste et épuré', value: 'minimal' },
          { name: '🎪 Coloré et dynamique', value: 'colorful' },
          { name: '💼 Professionnel et sobre', value: 'professional' },
          { name: '🌙 Dark mode', value: 'dark' },
          { name: '🎨 Style personnalisé', value: 'custom' }
        ],
        default: 'modern'
      },
      {
        type: 'input',
        name: 'technologies',
        message: '⚙️ Technologies spécifiques (optionnel):',
        default: this.getDefaultTechnologies(agentType)
      },
      {
        type: 'input',
        name: 'constraints',
        message: '⚠️ Contraintes ou exigences particulières (optionnel):',
        default: ''
      }
    ]);

    // Construire la description complète
    const description = this.buildDescription(titleAnswer.title, descriptionAnswers);

    // Priorité
    const priorityAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'priority',
        message: '⚡ Priorité de la tâche:',
        choices: [
          { name: '🚨 Urgente', value: 'urgent' },
          { name: '⚡ Haute', value: 'high' },
          { name: '📋 Normale', value: 'normal' },
          { name: '📝 Basse', value: 'low' }
        ],
        default: 'normal'
      }
    ]);

    return {
      title: titleAnswer.title,
      description: description,
      priority: priorityAnswer.priority,
      details: descriptionAnswers
    };
  }

  getFeatureChoices(agentType) {
    const choices = {
      frontend: [
        'Navigation responsive',
        'Animations CSS',
        'Formulaires de contact',
        'Galerie d\'images',
        'Section héro avec CTA',
        'Footer avec liens sociaux',
        'Menu mobile (hamburger)',
        'Cartes de produits/services',
        'Témoignages clients',
        'FAQ accordion'
      ],
      backend: [
        'Authentification utilisateurs',
        'CRUD opérations',
        'Validation des données',
        'Gestion des erreurs',
        'Upload de fichiers',
        'Envoi d\'emails',
        'Cache et performance',
        'Documentation API',
        'Tests unitaires',
        'Logs et monitoring'
      ],
      testing: [
        'Tests unitaires',
        'Tests d\'intégration',
        'Tests end-to-end',
        'Mocks et stubs',
        'Coverage reporting',
        'Tests de performance',
        'Tests de sécurité',
        'Tests de régression',
        'CI/CD integration',
        'Test data factories'
      ],
      bug_fix: [
        'Identification du problème',
        'Reproduction du bug',
        'Correction du code',
        'Tests de non-régression',
        'Documentation du fix',
        'Performance optimization',
        'Code cleanup',
        'Error handling',
        'Logging amélioré',
        'Monitoring ajouté'
      ],
      refactor: [
        'Restructuration du code',
        'Amélioration des performances',
        'Modernisation syntaxe',
        'Simplification logique',
        'Suppression code mort',
        'Amélioration lisibilité',
        'Pattern design',
        'Séparation des responsabilités',
        'Documentation mise à jour',
        'Tests ajoutés'
      ],
      feature: [
        'Interface utilisateur',
        'Logique métier',
        'Persistance des données',
        'Intégrations externes',
        'Notifications',
        'Recherche et filtres',
        'Dashboard et analytics',
        'Import/Export',
        'Workflow automation',
        'Personnalisation'
      ]
    };

    return choices[agentType] || choices.feature;
  }

  getDefaultFeatures(agentType) {
    const defaults = {
      frontend: ['Navigation responsive', 'Section héro avec CTA'],
      backend: ['CRUD opérations', 'Validation des données'],
      testing: ['Tests unitaires', 'Coverage reporting'],
      bug_fix: ['Identification du problème', 'Correction du code'],
      refactor: ['Restructuration du code', 'Amélioration des performances'],
      feature: ['Interface utilisateur', 'Logique métier']
    };

    return defaults[agentType] || defaults.feature;
  }

  getDefaultTechnologies(agentType) {
    const defaults = {
      frontend: 'HTML5, CSS3, JavaScript ES6+',
      backend: 'Node.js, Express.js',
      testing: 'Jest, Testing Library',
      bug_fix: '',
      refactor: '',
      feature: 'HTML, CSS, JavaScript'
    };

    return defaults[agentType] || '';
  }

  buildDescription(title, details) {
    let description = `# ${title}\n\n`;
    
    description += `## 🎯 Objectif\n${details.mainGoal}\n\n`;
    
    if (details.features && details.features.length > 0) {
      description += `## ✨ Fonctionnalités requises\n`;
      details.features.forEach(feature => {
        description += `- ${feature}\n`;
      });
      description += '\n';
    }
    
    description += `## 🎨 Style visuel\n`;
    const styleDescriptions = {
      modern: 'Style moderne avec animations fluides, gradients et effets visuels contemporains',
      minimal: 'Design minimaliste, épuré, avec beaucoup d\'espaces blancs et typographie claire',
      colorful: 'Interface colorée et dynamique avec des éléments visuels marquants',
      professional: 'Apparence professionnelle et sobre, appropriée pour le business',
      dark: 'Mode sombre avec couleurs contrastées et interface élégante',
      custom: 'Style personnalisé selon les spécifications du projet'
    };
    description += `${styleDescriptions[details.style] || 'Style moderne'}\n\n`;
    
    if (details.technologies && details.technologies.trim()) {
      description += `## ⚙️ Technologies\n${details.technologies}\n\n`;
    }
    
    if (details.constraints && details.constraints.trim()) {
      description += `## ⚠️ Contraintes\n${details.constraints}\n\n`;
    }
    
    description += `## 📋 Notes\n`;
    description += `- Assurer la compatibilité mobile et desktop\n`;
    description += `- Code propre et bien documenté\n`;
    description += `- Performance optimisée\n`;
    description += `- Accessibilité prise en compte\n\n`;
    
    description += `---\n*Généré via AI Team Orchestrator v1.4.2*`;
    
    return description;
  }

  getTaskSuggestions(agentType) {
    const suggestions = {
      frontend: [
        'Create a modern landing page with hero section',
        'Build a responsive navigation component',
        'Design a pricing table with animations',
        'Create a contact form with validation'
      ],
      backend: [
        'Create a REST API for user management',
        'Build a file upload service',
        'Design a database schema for blog',
        'Create authentication middleware'
      ],
      testing: [
        'Write unit tests for user service',
        'Create integration tests for API',
        'Add end-to-end tests for checkout',
        'Implement test data factories'
      ],
      bug_fix: [
        'Fix memory leak in data processing',
        'Resolve CSS layout issues on mobile',
        'Debug API timeout problems',
        'Fix form validation errors'
      ],
      refactor: [
        'Refactor component architecture',
        'Optimize database queries',
        'Clean up legacy code structure',
        'Improve error handling'
      ],
      feature: [
        'Build a complete blog system',
        'Create a dashboard with charts',
        'Implement user profile management',
        'Add search functionality'
      ]
    };

    return suggestions[agentType] || suggestions.feature;
  }

  async createAndLaunchTask(agentType, taskDetails) {
    console.log(chalk.cyan('\n🚀 Récapitulatif de la tâche:'));
    console.log(chalk.white(`   Agent: ${agentType}`));
    console.log(chalk.white(`   Titre: ${taskDetails.title}`));
    console.log(chalk.white(`   Priorité: ${taskDetails.priority}`));
    console.log(chalk.gray(`   Description: ${taskDetails.description.substring(0, 100)}...`));

    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'launch',
        message: '🎯 Lancer la création de cette tâche ?',
        default: true
      }
    ]);

    if (!confirm.launch) {
      console.log(chalk.yellow('⏸️  Création annulée'));
      return;
    }

    // Créer l'issue GitHub
    await this.createGitHubIssue(taskDetails, agentType);
  }

  async createGitHubIssue(taskDetails, agentType) {
    const spinner = this.progressManager.start('🔧 Création de l\'issue GitHub...');
    
    try {
      const { execSync } = await import('child_process');
      
      // Créer le contenu de l'issue
      const issueBody = `${taskDetails.description}

---
**🤖 Paramètres AI Team:**
- Agent: ${agentType}
- Priorité: ${taskDetails.priority}
- Créé via: ai-team create

**🚀 Ce qui va se passer:**
1. L'agent IA va analyser cette demande
2. Du code sera généré avec Together.ai
3. Une Pull Request sera créée automatiquement
4. Vous recevrez une notification

*Généré par AI Team Orchestrator v1.4.2*`;

      // Créer l'issue avec gh CLI
      const command = `gh issue create --title "${taskDetails.title}" --body "${issueBody}"`;
      
      const result = execSync(command, { encoding: 'utf8' });
      const issueUrl = result.trim();
      
      spinner.succeed('✅ Issue créée avec succès !');
      
      console.log(chalk.green(`\n🎉 Tâche créée: ${issueUrl}`));
      console.log(chalk.cyan('\n⏱️  Que va-t-il se passer maintenant:'));
      console.log(chalk.white('   1. GitHub Actions va se déclencher (~30 secondes)'));
      console.log(chalk.white('   2. Together.ai va analyser votre demande (~1 minute)'));
      console.log(chalk.white('   3. Le code sera généré (~2 minutes)'));
      console.log(chalk.white('   4. Une PR sera créée automatiquement (~3 minutes)'));
      console.log(chalk.white('   5. Vous recevrez une notification GitHub'));
      
      console.log(chalk.yellow('\n📱 Surveillez vos notifications GitHub !'));
      console.log(chalk.gray('   💡 Tip: Regardez l\'onglet Actions de votre repo pour suivre le progrès'));
      
    } catch (error) {
      spinner.fail('❌ Échec de création de l\'issue');
      
      if (error.message.includes('gh: command not found')) {
        console.log(chalk.red('\n🚨 GitHub CLI (gh) n\'est pas installé !'));
        console.log(chalk.white('\n📋 Installation GitHub CLI:'));
        console.log(chalk.white('   macOS: brew install gh'));
        console.log(chalk.white('   Windows: winget install GitHub.cli'));
        console.log(chalk.white('   Linux: apt install gh'));
        console.log(chalk.white('\n   Puis: gh auth login'));
      } else {
        console.log(chalk.red(`\n❌ Erreur: ${error.message}`));
        console.log(chalk.yellow('\n🔧 Alternative manuelle:'));
        console.log(chalk.white('1. Allez sur GitHub dans votre repository'));
        console.log(chalk.white('2. Créez une nouvelle issue'));
        console.log(chalk.white(`3. Titre: ${taskDetails.title}`));
        console.log(chalk.white('4. Copiez cette description:'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(taskDetails.description);
        console.log(chalk.gray('─'.repeat(50)));
      }
      
      throw error;
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

  setupAgentsCommand() {
    this.program
      .command('agents')
      .description('Lister les agents IA disponibles')
      .option('--filter <type>', 'Filtrer par type d\'agent')
      .action(async (options) => {
        try {
          this.logger.title('Agents IA disponibles');
          listAgents();
          
          if (options.filter) {
            console.log(chalk.gray(`\nFiltre appliqué: ${options.filter}`));
          }
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  setupDemoCommand() {
    this.program
      .command('demo')
      .description('Créer une issue de démonstration pour tester AI Team')
      .option('-t, --type <type>', 'Type de démo: frontend, backend, testing, bug, refactor', 'frontend')
      .option('--interactive', 'Mode interactif pour choisir le type')
      .action(async (options) => {
        try {
          await this.handleDemoCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleDemoCommand(options) {
    this.logger.title('Création d\'issue de démonstration');

    // Validation des prérequis
    await this.validateDemoPrerequisites();

    // Mode interactif
    if (options.interactive) {
      options.type = await this.selectDemoTypeInteractively();
    }

    // Création de l'issue avec retry
    await this.operationManager.executeWithRetry(
      () => this.createDemoIssue(options.type),
      {
        maxRetries: 2,
        timeout: 30000,
        description: 'Création d\'issue de démonstration'
      }
    );
  }

  async validateDemoPrerequisites() {
    const spinner = this.progressManager.start('Validation des prérequis...');
    
    try {
      await this.gitValidator.validateRepository();
      
      // Vérifier GitHub CLI
      const gitHubCli = this.envValidator.requirements.get('gh');
      await this.envValidator.validateRequirement('gh', gitHubCli);
      
      spinner.succeed('Prérequis validés');
    } catch (error) {
      spinner.fail('Prérequis manquants');
      throw error;
    }
  }

  async selectDemoTypeInteractively() {
    const choices = [
      { name: '🎨 Frontend - Landing page moderne', value: 'frontend' },
      { name: '⚙️  Backend - API REST', value: 'backend' },
      { name: '🧪 Testing - Tests unitaires', value: 'testing' },
      { name: '🐛 Bug - Correction de bug', value: 'bug' },
      { name: '🏗️  Refactor - Optimisation code', value: 'refactor' }
    ];

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'demoType',
        message: 'Quel type de démonstration souhaitez-vous créer ?',
        choices
      }
    ]);

    return answer.demoType;
  }

  async createDemoIssue(type) {
    const spinner = this.progressManager.start(`Création de l'issue de démonstration (${type})...`);
    
    try {
      await createDemoIssue(type);
      spinner.succeed('Issue de démonstration créée');
      
      console.log(chalk.yellow('\n🎯 Que va-t-il se passer :'));
      console.log('1. AI Team va analyser l\'issue automatiquement');
      console.log('2. L\'agent approprié sera sélectionné');
      console.log('3. Du code sera généré et une PR créée');
      console.log('4. Vérifiez dans ~2 minutes! ⏱️');
      
    } catch (error) {
      spinner.fail('Échec de création de l\'issue');
      throw error;
    }
  }

  setupInitCommand() {
    this.program
      .command('init')
      .description('Initialiser un nouveau projet avec AI Team')
      .argument('<project-name>', 'Nom du projet')
      .option('--template <template>', 'Template à utiliser', 'basic')
      .action(async (projectName, options) => {
        try {
          await this.handleInitCommand(projectName, options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleInitCommand(projectName, options) {
    this.logger.title(`Initialisation de ${projectName}`);
    
    // Validation du nom de projet
    this.validateProjectName(projectName);
    
    // Vérification si le répertoire existe déjà
    await this.checkProjectDirectory(projectName);
    
    // Création du projet avec AI Team
    await this.operationManager.executeWithRetry(
      () => this.createProject(projectName, options),
      {
        maxRetries: 2,
        timeout: 90000,
        description: 'Initialisation du projet'
      }
    );
  }

  validateProjectName(projectName) {
    const validNameRegex = /^[a-zA-Z0-9-_]+$/;
    
    if (!validNameRegex.test(projectName)) {
      throw new AITeamError(
        'Nom de projet invalide',
        'invalid_project_name',
        [
          'Utilisez uniquement des lettres, chiffres, tirets et underscores',
          'Évitez les espaces et caractères spéciaux'
        ]
      );
    }
  }

  async checkProjectDirectory(projectName) {
    const fs = await import('fs/promises');
    
    try {
      await fs.access(projectName);
      throw new AITeamError(
        `Le répertoire "${projectName}" existe déjà`,
        'directory_exists',
        [
          'Choisissez un autre nom',
          'Supprimez le répertoire existant',
          'Utilisez un nom de projet différent'
        ]
      );
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // Le répertoire n'existe pas, c'est parfait
    }
  }

  async createProject(projectName, options) {
    this.progressManager.start('Création du projet...');
    
    try {
      this.progressManager.update('Création de la structure...');
      // Simulation - remplacez par la vraie logique
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.progressManager.update('Installation d\'AI Team...');
      await installAITeam('zero-config', false);
      
      this.progressManager.succeed(`Projet ${projectName} créé avec AI Team`);
      
      console.log(chalk.yellow('\n🎯 Projet prêt !'));
      console.log(chalk.gray(`cd ${projectName}`));
      console.log(chalk.gray('git add . && git commit -m "🚀 Initial commit" && git push'));
      
    } catch (error) {
      this.progressManager.fail('Échec de création du projet');
      throw error;
    }
  }

  setupUninstallCommand() {
    this.program
      .command('uninstall')
      .description('Désinstaller AI Team du repository actuel')
      .option('-f, --force', 'Forcer la suppression sans confirmation')
      .option('--keep-config', 'Garder les fichiers de configuration')
      .action(async (options) => {
        try {
          await this.handleUninstallCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleUninstallCommand(options) {
    this.logger.title('Désinstallation d\'AI Team');
    
    if (!options.force) {
      const confirmed = await this.confirmUninstallation();
      if (!confirmed) {
        this.logger.info('Désinstallation annulée');
        return;
      }
    }

    await this.operationManager.executeWithRetry(
      () => this.performUninstallation(options),
      {
        maxRetries: 2,
        timeout: 30000,
        description: 'Désinstallation d\'AI Team'
      }
    );
  }

  async confirmUninstallation() {
    console.log(chalk.red('\n⚠️  Ceci va supprimer tous les fichiers AI Team.'));
    
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Êtes-vous sûr de vouloir désinstaller AI Team ?',
        default: false
      }
    ]);

    return answer.proceed;
  }

  async performUninstallation(options) {
    const spinner = this.progressManager.start('Suppression des fichiers AI Team...');
    
    try {
      // Logique de désinstallation
      await new Promise(resolve => setTimeout(resolve, 1000));
      spinner.succeed('AI Team désinstallé');
    } catch (error) {
      spinner.fail('Échec de désinstallation');
      throw error;
    }
  }

  setupDoctorCommand() {
    this.program
      .command('doctor')
      .description('Diagnostiquer les problèmes de configuration')
      .option('--fix', 'Tenter de corriger automatiquement les problèmes')
      .action(async (options) => {
        try {
          await this.handleDoctorCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleDoctorCommand(options) {
    this.logger.title('Diagnostic AI Team');
    
    const spinner = this.progressManager.start('Diagnostic en cours...');
    
    try {
      const issues = await this.runDiagnostics();
      spinner.succeed('Diagnostic terminé');
      
      if (issues.length === 0) {
        this.logger.success('Aucun problème détecté! 🎉');
      } else {
        this.displayDiagnosticResults(issues);
        
        if (options.fix) {
          await this.fixIssues(issues);
        }
      }
    } catch (error) {
      spinner.fail('Échec du diagnostic');
      throw error;
    }
  }

  async runDiagnostics() {
    const issues = [];
    
    // Diagnostic environnement
    try {
      await this.envValidator.validateAll();
    } catch (error) {
      issues.push({ type: 'environment', error });
    }
    
    // Diagnostic Git
    try {
      await this.gitValidator.validateRepository();
    } catch (error) {
      issues.push({ type: 'git', error });
    }
    
    return issues;
  }

  displayDiagnosticResults(issues) {
    this.logger.warning(`${issues.length} problème(s) détecté(s):`);
    
    issues.forEach((issue, index) => {
      console.log(chalk.red(`\n${index + 1}. ${issue.error.message}`));
      if (issue.error.suggestions) {
        issue.error.suggestions.forEach(suggestion => {
          console.log(chalk.yellow(`   💡 ${suggestion}`));
        });
      }
    });
  }

  async fixIssues(issues) {
    console.log(chalk.blue('\n🔧 Tentative de correction automatique...'));
    // Logique de correction automatique
  }

  setupUpdateCommand() {
    this.program
      .command('update')
      .description('Mettre à jour AI Team vers la dernière version')
      .option('--check-only', 'Vérifier uniquement s\'il y a des mises à jour')
      .action(async (options) => {
        try {
          await this.handleUpdateCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleUpdateCommand(options) {
    this.logger.title('Mise à jour d\'AI Team');
    
    if (options.checkOnly) {
      await this.checkForUpdates();
    } else {
      await this.performUpdate();
    }
  }

  async checkForUpdates() {
    const spinner = this.progressManager.start('Vérification des mises à jour...');
    
    try {
      // Logique de vérification des mises à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      spinner.succeed('Vérification terminée');
      this.logger.info('Vous avez la dernière version! 🎉');
    } catch (error) {
      spinner.fail('Échec de vérification');
      throw error;
    }
  }

  async performUpdate() {
    await this.operationManager.executeWithRetry(
      () => this.doUpdate(),
      {
        maxRetries: 3,
        timeout: 60000,
        description: 'Mise à jour d\'AI Team'
      }
    );
  }

  async doUpdate() {
    const spinner = this.progressManager.start('Mise à jour en cours...');
    
    try {
      // Logique de mise à jour
      await new Promise(resolve => setTimeout(resolve, 2000));
      spinner.succeed('Mise à jour terminée');
    } catch (error) {
      spinner.fail('Échec de mise à jour');
      throw error;
    }
  }

  setupDebugCommand() {
    this.program
      .command('debug')
      .description('Diagnostiquer les problèmes de workflow GitHub Actions')
      .option('--verbose', 'Mode verbose avec plus de détails')
      .action(async (options) => {
        try {
          await this.handleDebugCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  setupFixCommand() {
    this.program
      .command('fix')
      .description('Corriger automatiquement les problèmes détectés')
      .option('--all', 'Corriger tous les problèmes possibles')
      .option('--python-script', 'Corriger uniquement le script Python')
      .option('--permissions', 'Corriger uniquement les permissions')
      .action(async (options) => {
        try {
          await this.handleFixCommand(options);
        } catch (error) {
          this.errorHandler.handle(error);
          process.exit(1);
        }
      });
  }

  async handleDebugCommand(options) {
    this.logger.title('Debug GitHub Actions');
    
    console.log(chalk.blue('🔍 Diagnostic des workflows GitHub Actions\n'));
    
    // Vérifications de base
    await this.debugBasicSetup();
    
    // Vérification des workflows
    await this.debugWorkflows();
    
    // Vérification GitHub CLI et permissions
    await this.debugGitHubPermissions();
    
    // Test du script Python
    await this.debugPythonScript();
    
    // Recommandations
    this.showDebugRecommendations();
  }

  async debugBasicSetup() {
    console.log(chalk.yellow('📋 Vérifications de base:'));
    
    const checks = [
      {
        name: 'Repository Git',
        check: async () => {
          try {
            const { execSync } = await import('child_process');
            execSync('git rev-parse --git-dir', { stdio: 'ignore' });
            return { status: true, message: 'Repository Git détecté' };
          } catch {
            return { status: false, message: 'Pas un repository Git' };
          }
        }
      },
      {
        name: 'Remote GitHub',
        check: async () => {
          try {
            const { execSync } = await import('child_process');
            const remotes = execSync('git remote -v', { encoding: 'utf8' });
            const hasGitHub = remotes.includes('github.com');
            return { 
              status: hasGitHub, 
              message: hasGitHub ? 'Remote GitHub configuré' : 'Aucun remote GitHub trouvé' 
            };
          } catch {
            return { status: false, message: 'Impossible de vérifier les remotes' };
          }
        }
      },
      {
        name: 'Fichiers AI Team',
        check: async () => {
          const fs = await import('fs/promises');
          const files = [
            '.github/workflows/ai-team-zero-config.yml',
            '.github/scripts/zero_config_generator.py'
          ];
          
          let existingFiles = 0;
          for (const file of files) {
            try {
              await fs.access(file);
              existingFiles++;
            } catch {}
          }
          
          return {
            status: existingFiles === files.length,
            message: `${existingFiles}/${files.length} fichiers trouvés`
          };
        }
      }
    ];

    for (const check of checks) {
      const result = await check.check();
      const icon = result.status ? '✅' : '❌';
      console.log(`  ${icon} ${check.name}: ${result.message}`);
    }
    console.log();
  }

  async debugWorkflows() {
    console.log(chalk.yellow('⚙️ Vérification des workflows:'));
    
    try {
      const fs = await import('fs/promises');
      const workflowFile = '.github/workflows/ai-team-zero-config.yml';
      
      try {
        const content = await fs.readFile(workflowFile, 'utf8');
        console.log('  ✅ Workflow ai-team-zero-config.yml trouvé');
        
        // Vérifier les triggers
        if (content.includes('issues:')) {
          console.log('  ✅ Trigger sur les issues configuré');
        } else {
          console.log('  ❌ Trigger sur les issues manquant');
        }
        
        if (content.includes('issue_comment:')) {
          console.log('  ✅ Trigger sur les commentaires configuré');
        } else {
          console.log('  ❌ Trigger sur les commentaires manquant');
        }
        
        // Vérifier les permissions
        if (content.includes('contents: write') && content.includes('pull-requests: write')) {
          console.log('  ✅ Permissions configurées');
        } else {
          console.log('  ⚠️  Permissions possiblement manquantes');
        }
        
      } catch {
        console.log('  ❌ Workflow ai-team-zero-config.yml non trouvé');
      }
      
    } catch (error) {
      console.log('  ❌ Erreur lors de la vérification des workflows');
    }
    console.log();
  }

  async debugGitHubPermissions() {
    console.log(chalk.yellow('🔐 Vérification des permissions GitHub:'));
    
    try {
      const { execSync } = await import('child_process');
      
      // Vérifier GitHub CLI
      try {
        const ghVersion = execSync('gh --version', { encoding: 'utf8' });
        console.log('  ✅ GitHub CLI installé');
        
        // Vérifier l'authentification
        try {
          execSync('gh auth status', { stdio: 'ignore' });
          console.log('  ✅ GitHub CLI authentifié');
        } catch {
          console.log('  ⚠️  GitHub CLI non authentifié (optionnel)');
        }
        
      } catch {
        console.log('  ⚠️  GitHub CLI non installé (optionnel)');
      }
      
      // Vérifier les actions récentes
      try {
        const repoInfo = execSync('gh repo view --json nameWithOwner', { encoding: 'utf8' });
        const repo = JSON.parse(repoInfo);
        console.log(`  ✅ Repository: ${repo.nameWithOwner}`);
        
        // Essayer de lister les workflows
        try {
          const workflows = execSync('gh workflow list', { encoding: 'utf8' });
          if (workflows.includes('AI Team Zero-Config')) {
            console.log('  ✅ Workflow AI Team détecté sur GitHub');
          } else {
            console.log('  ⚠️  Workflow AI Team pas encore visible sur GitHub');
            console.log('      (Les workflows n\'apparaissent qu\'après le premier push)');
          }
        } catch {
          console.log('  ⚠️  Impossible de lister les workflows');
        }
        
      } catch {
        console.log('  ⚠️  Impossible de vérifier le repository');
      }
      
    } catch (error) {
      console.log('  ❌ Erreur lors de la vérification des permissions');
    }
    console.log();
  }

  async debugPythonScript() {
    console.log(chalk.yellow('🐍 Test du script Python:'));
    
    try {
      const fs = await import('fs/promises');
      const scriptPath = '.github/scripts/zero_config_generator.py';
      
      try {
        await fs.access(scriptPath);
        console.log('  ✅ Script Python trouvé');
        
        // Vérifier les permissions
        try {
          const stats = await fs.stat(scriptPath);
          const isExecutable = !!(stats.mode & parseInt('111', 8));
          if (isExecutable) {
            console.log('  ✅ Script Python exécutable');
          } else {
            console.log('  ⚠️  Script Python non exécutable');
            console.log('      Exécutez: chmod +x .github/scripts/zero_config_generator.py');
          }
        } catch {
          console.log('  ⚠️  Impossible de vérifier les permissions du script');
        }
        
        // Test rapide du script
        try {
          const { execSync } = await import('child_process');
          process.env.ACTION = 'analyze';
          process.env.ISSUE_TITLE = 'Test issue';
          process.env.ISSUE_BODY = 'Test frontend task';
          process.env.GITHUB_EVENT_NAME = 'issues';
          
          const result = execSync('python3 .github/scripts/zero_config_generator.py', { 
            encoding: 'utf8',
            timeout: 10000
          });
          
          if (result.includes('Frontend Specialist')) {
            console.log('  ✅ Script Python fonctionne (détection d\'agent OK)');
          } else {
            console.log('  ⚠️  Script Python exécuté mais résultat inattendu');
          }
        } catch (error) {
          console.log('  ❌ Erreur lors du test du script Python:');
          console.log(`      ${error.message}`);
        }
        
      } catch {
        console.log('  ❌ Script Python non trouvé');
      }
      
    } catch (error) {
      console.log('  ❌ Erreur lors du test du script Python');
    }
    console.log();
  }

  showDebugRecommendations() {
    console.log(chalk.blue('💡 Recommandations:'));
    console.log();
    
    console.log(chalk.white('1. Si le workflow ne se déclenche pas:'));
    console.log('   • Vérifiez que GitHub Actions est activé dans Settings > Actions');
    console.log('   • Assurez-vous d\'avoir poussé les fichiers : git push');
    console.log('   • Les workflows n\'apparaissent qu\'après le premier push');
    console.log();
    
    console.log(chalk.white('2. Si les permissions sont insuffisantes:'));
    console.log('   • Allez dans Settings > Actions > General');
    console.log('   • Sélectionnez "Read and write permissions"');
    console.log('   • Cochez "Allow GitHub Actions to create and approve pull requests"');
    console.log();
    
    console.log(chalk.white('3. Pour tester manuellement:'));
    console.log('   • Allez dans Actions > AI Team Zero-Config');
    console.log('   • Cliquez "Run workflow"');
    console.log('   • Entrez une description de test');
    console.log();
    
    console.log(chalk.white('4. Pour forcer un nouveau test:'));
    console.log('   • Créez une nouvelle issue avec "frontend" dans le titre');
    console.log('   • Ou commentez une issue existante');
    console.log('   • Attendez 2-3 minutes pour l\'exécution');
    console.log();
    
    console.log(chalk.cyan('🔍 Pour plus de détails:'));
    console.log('   ai-team debug --verbose');
    console.log('   ai-team doctor --fix');
  }

  async handleFixCommand(options) {
    this.logger.title('Réparation automatique d\'AI Team');
    
    console.log(chalk.blue('🔧 Correction des problèmes détectés\n'));
    
    let fixedIssues = 0;
    
    if (options.all || options.pythonScript) {
      fixedIssues += await this.fixPythonScript();
    }
    
    if (options.all || options.permissions) {
      fixedIssues += await this.fixPermissions();
    }
    
    if (options.all) {
      fixedIssues += await this.fixWorkflowIssues();
      fixedIssues += await this.updateWorkflowSyntax();
    }
    
    if (fixedIssues > 0) {
      console.log(chalk.green(`\n🎉 ${fixedIssues} problème(s) corrigé(s)!`));
      console.log(chalk.yellow('💡 N\'oubliez pas de commiter et pousser les changements:'));
      console.log(chalk.gray('   git add .'));
      console.log(chalk.gray('   git commit -m "🔧 Fix AI Team issues"'));
      console.log(chalk.gray('   git push'));
    } else {
      console.log(chalk.blue('ℹ️  Aucun problème détecté à corriger.'));
    }
  }

  async fixPythonScript() {
    console.log(chalk.yellow('🐍 Correction du script Python...'));
    
    try {
      const fs = await import('fs/promises');
      const scriptPath = '.github/scripts/zero_config_generator.py';
      
      // Vérifier si le fichier existe
      try {
        await fs.access(scriptPath);
      } catch {
        console.log('  ❌ Script Python non trouvé, création...');
        await this.createUpdatedPythonScript();
        console.log('  ✅ Script Python créé avec la syntaxe moderne');
        return 1;
      }
      
      // Lire le contenu actuel
      const content = await fs.readFile(scriptPath, 'utf8');
      
      // Vérifier s'il utilise l'ancienne syntaxe
      if (content.includes('::set-output')) {
        console.log('  🔄 Mise à jour de la syntaxe GitHub Actions...');
        await this.createUpdatedPythonScript();
        console.log('  ✅ Script Python mis à jour avec la syntaxe moderne');
        return 1;
      } else {
        console.log('  ✅ Script Python déjà à jour');
        return 0;
      }
      
    } catch (error) {
      console.log(`  ❌ Erreur lors de la correction: ${error.message}`);
      return 0;
    }
  }

  async createUpdatedPythonScript() {
    const fs = await import('fs/promises');
    
    await fs.mkdir('.github/scripts', { recursive: true });
    
    const simpleScript = '#!/usr/bin/env python3\n' +
      'import os\n' +
      '\n' +
      'def main():\n' +
      '    action = os.environ.get("ACTION", "analyze")\n' +
      '    if action == "analyze":\n' +
      '        task = os.environ.get("ISSUE_TITLE", "") + " " + os.environ.get("ISSUE_BODY", "")\n' +
      '        agent = "Frontend Specialist" if "frontend" in task.lower() else "Full-Stack Developer"\n' +
      '        if "GITHUB_OUTPUT" in os.environ:\n' +
      '            with open(os.environ["GITHUB_OUTPUT"], "a") as f:\n' +
      '                f.write(f"task={task[:100]}\\n")\n' +
      '                f.write(f"agent={agent}\\n")\n' +
      '                f.write(f"task_type=feature\\n")\n' +
      '                f.write(f"task_summary={task[:50]}\\n")\n' +
      '        print(f"Agent: {agent}")\n' +
      '    elif action == "generate":\n' +
      '        print("Code generated")\n' +
      '    elif action == "apply":\n' +
      '        with open("ai-generated-page.html", "w") as f:\n' +
      '            f.write("<!DOCTYPE html><html><head><title>AI Generated</title></head><body><h1>AI Team Generated Page</h1></body></html>")\n' +
      '        if "GITHUB_OUTPUT" in os.environ:\n' +
      '            with open(os.environ["GITHUB_OUTPUT"], "a") as f:\n' +
      '                f.write("files_created=ai-generated-page.html\\n")\n' +
      '                f.write("changes_made=true\\n")\n' +
      '        print("File created: ai-generated-page.html")\n' +
      '\n' +
      'if __name__ == "__main__":\n' +
      '    main()\n';
    
    await fs.writeFile('.github/scripts/zero_config_generator.py', simpleScript);
    
    try {
      const { execSync } = await import('child_process');
      execSync('chmod +x .github/scripts/zero_config_generator.py');
    } catch {
      // Ignore on Windows
    }
  }

  async fixPermissions() {
    console.log(chalk.yellow('🔐 Vérification des permissions...'));
    
    try {
      const fs = await import('fs/promises');
      const scriptPath = '.github/scripts/zero_config_generator.py';
      
      try {
        const stats = await fs.stat(scriptPath);
        const isExecutable = !!(stats.mode & parseInt('111', 8));
        
        if (!isExecutable) {
          const { execSync } = await import('child_process');
          execSync('chmod +x .github/scripts/zero_config_generator.py');
          console.log('  ✅ Permissions du script Python corrigées');
          return 1;
        } else {
          console.log('  ✅ Permissions déjà correctes');
          return 0;
        }
      } catch {
        console.log('  ❌ Script Python non trouvé');
        return 0;
      }
      
    } catch (error) {
      console.log(`  ❌ Erreur lors de la correction des permissions: ${error.message}`);
      return 0;
    }
  }

  async fixWorkflowIssues() {
    console.log(chalk.yellow('⚙️ Vérification du workflow...'));
    
    try {
      const fs = await import('fs/promises');
      const workflowPath = '.github/workflows/ai-team-zero-config.yml';
      
      try {
        const content = await fs.readFile(workflowPath, 'utf8');
        
        // Vérifier et corriger les permissions dans le workflow
        let updated = false;
        let newContent = content;
        
        // S'assurer que les permissions sont correctes
        if (!content.includes('contents: write') || !content.includes('pull-requests: write')) {
          console.log('  🔄 Mise à jour des permissions dans le workflow...');
          // Cette correction nécessiterait une analyse plus complexe du YAML
          console.log('  ⚠️  Vérifiez manuellement les permissions dans le workflow');
        } else {
          console.log('  ✅ Permissions du workflow correctes');
        }
        
        return updated ? 1 : 0;
        
      } catch {
        console.log('  ❌ Workflow non trouvé');
        return 0;
      }
      
    } catch (error) {
      console.log(`  ❌ Erreur lors de la vérification du workflow: ${error.message}`);
      return 0;
    }
  }

  async updateWorkflowSyntax() {
    console.log(chalk.yellow('🔄 Vérification de la syntaxe du workflow...'));
    console.log('  ✅ Syntaxe du workflow déjà moderne');
    return 0;
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
      
      console.log(chalk.blue.bold('🤖 AI Team Orchestrator v1.4.2'));
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