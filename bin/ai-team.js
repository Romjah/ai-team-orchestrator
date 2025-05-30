#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Together from 'together-ai';
import { APIKeyManager } from '../lib/api-config.js';
import PromptTemplateManager from '../lib/prompt-templates.js';
import fs from 'fs';
import EnhancedTemplatesHelper from '../lib/enhanced-templates.js';

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
      .version('2.4.2')
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
    // Utilisation du nouveau système de templates performants
    console.log(chalk.cyan('🧠 Génération avec templates performants DeepSeek R1...'));
    
    // Analyser le contexte du projet si possible
    const additionalContext = await EnhancedTemplatesHelper.gatherProjectContext();
    
    // Générer le prompt optimisé selon le type de tâche
    const promptManager = new PromptTemplateManager();
    const optimizedPrompt = promptManager.generatePrompt(title, type, additionalContext);
    
    console.log(chalk.gray('📋 Template utilisé:'), chalk.yellow(type));
    if (additionalContext.complexity) {
      console.log(chalk.gray('🎯 Complexité détectée:'), chalk.blue(additionalContext.complexity));
    }
    if (additionalContext.technologies && additionalContext.technologies.length > 0) {
      console.log(chalk.gray('🔧 Technologies détectées:'), 
        chalk.green(additionalContext.technologies.map(t => t.techs.join(', ')).join(', ')));
    }

    try {
      const client = new Together({ apiKey });
      
      const response = await client.chat.completions.create({
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages: [
          {
            role: "system",
            content: "Tu es un expert développeur senior avec une expertise en architecture logicielle, DevOps et bonnes pratiques. Génère des spécifications techniques détaillées, précises et immédiatement exploitables. Utilise un style professionnel avec des sections claires et des critères d'acceptation mesurables."
          },
          {
            role: "user",
            content: optimizedPrompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.7
      });

      const generatedContent = response.choices[0].message.content;
      
      // Ajouter des métadonnées sur le template utilisé
      const enhancedDescription = `${generatedContent}

---
## 🤖 Métadonnées AI Team
- **Template utilisé:** ${type}
- **Complexité détectée:** ${additionalContext.complexity || 'medium'}
- **Modèle IA:** DeepSeek R1 (DeepSeek-R1-Distill-Llama-70B-free)
- **Version AI Team:** v2.5.0 avec templates performants

*Généré par AI Team Orchestrator avec système de templates avancés*`;

      return enhancedDescription;
      
    } catch (error) {
      console.log(chalk.yellow('⚠️ Génération DeepSeek échouée, utilisation d\'un template enrichi par défaut'));
      return EnhancedTemplatesHelper.getEnhancedDefaultDescription(title, type, additionalContext);
    }
  }

  /**
   * Collecte le contexte du projet pour enrichir les prompts
   */
  async gatherProjectContext() {
    const context = {};
    
    try {
      // Analyser package.json s'il existe
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        context.projectName = packageJson.name;
        context.dependencies = Object.keys(packageJson.dependencies || {});
        context.devDependencies = Object.keys(packageJson.devDependencies || {});
        context.scripts = Object.keys(packageJson.scripts || {});
        
        // Détecter le type de projet
        if (context.dependencies.includes('react') || context.dependencies.includes('vue') || context.dependencies.includes('angular')) {
          context.projectType = 'frontend';
        } else if (context.dependencies.includes('express') || context.dependencies.includes('fastify') || context.dependencies.includes('koa')) {
          context.projectType = 'backend';
        }
      }

      // Analyser la structure des dossiers
      const commonDirs = ['src', 'lib', 'components', 'pages', 'api', 'services', 'utils', 'tests', '__tests__'];
      context.projectStructure = commonDirs.filter(dir => fs.existsSync(dir));

      // Analyser les fichiers de configuration
      const configFiles = ['.eslintrc', 'tsconfig.json', 'tailwind.config.js', 'next.config.js', 'vite.config.js', 'webpack.config.js'];
      context.configFiles = configFiles.filter(file => 
        fs.existsSync(file) || fs.existsSync(file + '.js') || fs.existsSync(file + '.json')
      );

      // Détecter TypeScript
      if (fs.existsSync('tsconfig.json') || context.dependencies?.includes('typescript')) {
        context.hasTypeScript = true;
      }

      // Détecter les frameworks de test
      const testFrameworks = ['jest', 'vitest', 'mocha', 'cypress', 'playwright'];
      context.testFrameworks = testFrameworks.filter(framework => 
        context.dependencies?.includes(framework) || context.devDependencies?.includes(framework)
      );

    } catch (error) {
      console.log(chalk.gray('📝 Contexte projet non détecté, utilisation des defaults'));
    }

    return context;
  }

  /**
   * Description enrichie par défaut quand DeepSeek R1 n'est pas disponible
   */
  getEnhancedDefaultDescription(title, type, context) {
    const techStack = this.generateTechStackSuggestions(type, context);
    const complexity = context.complexity || 'medium';
    
    return `## 🎯 Objectif
${title}

## 📋 Description Technique
Tâche de développement **${type}** avec une complexité estimée à **${complexity}**.

${this.getTypeSpecificSection(type)}

## 🔧 Stack Technique Suggérée
${techStack}

## ⚡ Critères de Performance
${this.getPerformanceCriteria(type)}

## ✅ Critères d'Acceptation
${this.getAcceptanceCriteria(type)}

## 🧪 Tests Requis
${this.getTestingRequirements(type)}

## 📚 Documentation
- Documentation technique complète
- Commentaires de code explicatifs
- Guide d'utilisation si applicable
- Diagrammes d'architecture si nécessaire

---
## 🤖 Métadonnées AI Team
- **Template utilisé:** ${type} (fallback enrichi)
- **Complexité détectée:** ${complexity}
- **Contexte projet:** ${context.projectType || 'détection automatique'}
- **TypeScript:** ${context.hasTypeScript ? '✅ Détecté' : '❌ Non détecté'}
- **Frameworks de test:** ${context.testFrameworks?.join(', ') || 'À définir'}

*Généré par AI Team Orchestrator v2.5.0 avec système de templates avancés*`;
  }

  getTypeSpecificSection(type) {
    const sections = {
      frontend: `### 🎨 Spécifications Frontend
- Interface utilisateur moderne et responsive
- Composants réutilisables et maintenables
- Gestion d'état appropriée (local/global)
- Optimisations de performance (lazy loading, code splitting)
- Accessibilité (WCAG 2.1)`,

      backend: `### ⚙️ Spécifications Backend
- Architecture REST ou GraphQL selon le besoin
- Modélisation de données robuste
- Authentification et autorisation sécurisées
- Gestion d'erreurs et logging appropriés
- Optimisations de performance (cache, queries)`,

      testing: `### 🧪 Stratégie de Test
- Tests unitaires avec haute couverture
- Tests d'intégration pour les APIs
- Tests end-to-end pour les parcours critiques
- Tests de performance et de charge
- Validation de sécurité`,

      bug_fix: `### 🐛 Analyse et Correction
- Investigation approfondie de la cause racine
- Reproduction du bug en environnement de test
- Correction minimale et sûre
- Tests de régression pour éviter la récurrence
- Documentation de la solution`,

      refactor: `### 🏗️ Refactoring Structuré
- Analyse du code existant et identification des améliorations
- Refactoring incrémental avec validation continue
- Amélioration de la lisibilité et de la maintenabilité
- Réduction de la complexité cyclomatique
- Préservation des fonctionnalités existantes`,

      feature: `### 🚀 Nouvelle Fonctionnalité
- Spécifications fonctionnelles détaillées
- Conception technique adaptée à l'architecture existante
- Implémentation par étapes avec validation
- Tests complets de la fonctionnalité
- Documentation utilisateur et technique`
    };

    return sections[type] || sections.feature;
  }

  generateTechStackSuggestions(type, context) {
    const hasReact = context.dependencies?.includes('react');
    const hasVue = context.dependencies?.includes('vue');
    const hasNext = context.dependencies?.includes('next');
    const hasExpress = context.dependencies?.includes('express');
    const hasTypeScript = context.hasTypeScript;

    const suggestions = {
      frontend: `- **Framework:** ${hasReact ? 'React' : hasVue ? 'Vue.js' : hasNext ? 'Next.js' : 'React (recommandé)'}
- **Styling:** ${context.dependencies?.includes('tailwindcss') ? 'Tailwind CSS' : 'CSS Modules / Styled Components'}
- **State Management:** ${hasReact ? 'React Query + Zustand' : 'Pinia / Vuex'}
- **Testing:** ${context.testFrameworks?.includes('jest') ? 'Jest + Testing Library' : 'Vitest + Testing Library'}
- **Build:** ${hasNext ? 'Next.js' : 'Vite / Webpack'}`,

      backend: `- **Runtime:** ${context.dependencies?.includes('express') ? 'Node.js + Express' : 'Node.js + Fastify'}
- **Base de données:** PostgreSQL + Prisma ORM
- **Authentification:** JWT + bcrypt
- **Validation:** Zod / Joi
- **Testing:** ${context.testFrameworks?.includes('jest') ? 'Jest + Supertest' : 'Vitest + Supertest'}`,

      testing: `- **Unit Testing:** ${context.testFrameworks?.includes('jest') ? 'Jest' : 'Vitest'} + Testing Library
- **E2E Testing:** ${context.testFrameworks?.includes('cypress') ? 'Cypress' : 'Playwright'}
- **Performance:** K6 / Artillery
- **Visual Testing:** Percy / Chromatic
- **Coverage:** NYC / C8`,

      bug_fix: `- **Debugging:** Chrome DevTools / Node.js Inspector
- **Logging:** Winston / Pino
- **Monitoring:** Sentry / DataDog
- **Profiling:** Clinic.js / 0x
- **Testing:** Framework existant + tests de régression`,

      refactor: `- **Linting:** ESLint + Prettier
- **Type Checking:** ${hasTypeScript ? 'TypeScript strict mode' : 'TypeScript (migration recommandée)'}
- **Code Analysis:** SonarQube / CodeClimate
- **Testing:** Maintien de la couverture existante
- **Documentation:** JSDoc / TSDoc`
    };

    return suggestions[type] || suggestions.feature || `- Technologies adaptées au projet existant
- TypeScript pour la robustesse${hasTypeScript ? ' (déjà configuré)' : ''}
- Framework de test moderne
- Outils de qualité de code (ESLint, Prettier)`;
  }

  getPerformanceCriteria(type) {
    const criteria = {
      frontend: `- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1
- Bundle size optimisé avec code splitting`,

      backend: `- Response time API < 100ms (95th percentile)
- Throughput > 1000 req/sec
- Memory usage stable (pas de leaks)
- Database query time < 50ms
- Error rate < 0.1%`,

      testing: `- Test execution time < 5min (suite complète)
- Tests unitaires < 10s
- Tests E2E < 2min par parcours
- Coverage report génération < 30s
- Parallel execution optimisée`,

      bug_fix: `- Correction sans dégradation performance
- Temps de résolution < 24h pour bugs critiques
- Impact minimal sur l'existant
- Validation en staging avant production`,

      refactor: `- Performance égale ou améliorée
- Temps de build inchangé ou réduit
- Memory footprint maintenu
- Aucune régression fonctionnelle`
    };

    return criteria[type] || criteria.feature || `- Performance adaptée au type de tâche
- Monitoring des métriques clés
- Optimisation selon les besoins
- Validation avant déploiement`;
  }

  getAcceptanceCriteria(type) {
    const criteria = {
      frontend: `- [ ] Interface responsive (mobile, tablet, desktop)
- [ ] Accessibilité WCAG 2.1 AA validée
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Performance Web Vitals dans les seuils
- [ ] Tests E2E des parcours principaux`,

      backend: `- [ ] API complètement documentée (OpenAPI/Swagger)
- [ ] Authentification et autorisation implémentées
- [ ] Validation des données d'entrée robuste
- [ ] Gestion d'erreurs appropriée
- [ ] Logs structurés et monitoring`,

      testing: `- [ ] Couverture de code > 85%
- [ ] Tests stables et fiables (pas de flaky tests)
- [ ] Rapports de test détaillés et exploitables
- [ ] Intégration CI/CD fonctionnelle
- [ ] Documentation des scénarios de test`,

      bug_fix: `- [ ] Bug reproduit et corrigé
- [ ] Tests de régression ajoutés
- [ ] Validation en environnement de staging
- [ ] Aucune régression introduite
- [ ] Post-mortem documenté si critique`,

      refactor: `- [ ] Fonctionnalités existantes préservées
- [ ] Tests existants passent toujours
- [ ] Code plus lisible et maintenable
- [ ] Complexité réduite (métriques améliorées)
- [ ] Documentation technique mise à jour`
    };

    return criteria[type] || criteria.feature || `- [ ] Fonctionnalité implémentée selon les spécifications
- [ ] Tests complets (unitaires, intégration, E2E)
- [ ] Code review validé par l'équipe
- [ ] Documentation technique et utilisateur
- [ ] Déploiement validé en staging`;
  }

  getTestingRequirements(type) {
    const requirements = {
      frontend: `- Tests unitaires des composants React/Vue
- Tests d'intégration des hooks et stores
- Tests E2E des parcours utilisateur
- Tests de régression visuelle
- Tests d'accessibilité automatisés`,

      backend: `- Tests unitaires des services et utilitaires
- Tests d'intégration des APIs
- Tests de base de données avec fixtures
- Tests de sécurité (authentification, validation)
- Tests de performance et de charge`,

      testing: `- Stratégie de test complète définie
- Suites de tests automatisées
- Tests de performance intégrés
- Monitoring de la qualité des tests
- Formation équipe sur les outils`,

      bug_fix: `- Tests reproduisant le bug avant correction
- Tests de régression spécifiques
- Validation manuelle du fix
- Tests d'impact sur les fonctionnalités connexes`,

      refactor: `- Conservation des tests existants
- Tests additionnels pour le code refactorisé
- Validation de non-régression complète
- Tests de performance avant/après`
    };

    return requirements[type] || requirements.feature || `- Tests unitaires avec couverture > 80%
- Tests d'intégration des points d'entrée
- Tests E2E des fonctionnalités principales
- Tests de régression automatisés`;
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
        const scripts = ['ai_team_mcp.py', 'requirements.txt'];
        
        console.log(chalk.yellow('🐍 Installation des scripts Python...'));
        
        for (const script of scripts) {
          const source = path.join(templatesScriptsDir, script);
          const dest = path.join(scriptsDir, script);
          
          if (fs.existsSync(source)) {
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
          } else {
            console.log(chalk.yellow(`  ⚠️ ${script} non trouvé dans les templates`));
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
        const workflows = ['ai-team-mcp.yml'];
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
        const scripts = ['ai_team_mcp.py', 'requirements.txt'];
        
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