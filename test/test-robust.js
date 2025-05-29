#!/usr/bin/env node

/**
 * Tests pour le système robuste d'AI Team Orchestrator
 */

import chalk from 'chalk';
import {
  Logger,
  EnvironmentValidator,
  GitValidator,
  OperationManager,
  ProgressManager,
  ErrorHandler,
  FileUtils,
  AITeamError
} from '../lib/utils.js';

class RobustSystemTester {
  constructor() {
    this.logger = new Logger(true);
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  addTest(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async runTests() {
    console.log(chalk.blue.bold('🧪 Tests du système robuste AI Team\n'));

    for (const test of this.tests) {
      try {
        const spinner = this.logger.progressManager?.start(`Test: ${test.name}...`);
        
        await test.testFn();
        
        if (spinner) spinner.succeed(`✅ ${test.name}`);
        else console.log(chalk.green(`✅ ${test.name}`));
        
        this.passed++;
      } catch (error) {
        if (this.logger.progressManager?.currentSpinner) {
          this.logger.progressManager.fail(`❌ ${test.name}`);
        } else {
          console.log(chalk.red(`❌ ${test.name}`));
        }
        
        console.log(chalk.red(`   Erreur: ${error.message}`));
        this.failed++;
      }
    }

    this.showResults();
  }

  showResults() {
    console.log(chalk.blue.bold('\n📊 Résultats des tests:\n'));
    console.log(chalk.green(`✅ Réussis: ${this.passed}`));
    console.log(chalk.red(`❌ Échoués: ${this.failed}`));
    console.log(chalk.blue(`📋 Total: ${this.passed + this.failed}`));

    if (this.failed === 0) {
      console.log(chalk.green.bold('\n🎉 Tous les tests sont passés !'));
    } else {
      console.log(chalk.yellow.bold('\n⚠️  Certains tests ont échoué'));
    }
  }
}

// Création du testeur
const tester = new RobustSystemTester();

// Test du Logger
tester.addTest('Logger - Messages colorés', async () => {
  const logger = new Logger(false);
  logger.info('Test info');
  logger.success('Test success');
  logger.warning('Test warning');
  logger.error('Test error');
});

// Test du Logger verbose
tester.addTest('Logger - Mode verbose', async () => {
  const logger = new Logger(true);
  logger.debug('Test debug visible');
  logger.title('Test title');
});

// Test EnvironmentValidator
tester.addTest('EnvironmentValidator - Validation Node.js', async () => {
  const logger = new Logger(false);
  const validator = new EnvironmentValidator(logger);
  
  const nodeReq = validator.requirements.get('node');
  const result = await validator.validateRequirement('node', nodeReq);
  
  if (!result.valid) {
    throw new Error('Node.js validation échouée');
  }
});

// Test EnvironmentValidator - Version
tester.addTest('EnvironmentValidator - Comparaison versions', async () => {
  const logger = new Logger(false);
  const validator = new EnvironmentValidator(logger);
  
  const result1 = validator.compareVersions('16.0.0', '14.0.0');
  const result2 = validator.compareVersions('14.0.0', '16.0.0');
  const result3 = validator.compareVersions('14.0.0', '14.0.0');
  
  if (result1 !== 1 || result2 !== -1 || result3 !== 0) {
    throw new Error('Comparaison de versions incorrecte');
  }
});

// Test GitValidator
tester.addTest('GitValidator - Repository détection', async () => {
  const logger = new Logger(false);
  const validator = new GitValidator(logger);
  
  try {
    await validator.checkGitRepo();
  } catch (error) {
    if (error.type !== 'not_git_repo') {
      throw error;
    }
    // C'est normal si nous ne sommes pas dans un repo git
  }
});

// Test OperationManager - Retry
tester.addTest('OperationManager - Retry avec succès', async () => {
  const logger = new Logger(false);
  const manager = new OperationManager(logger);
  
  let attempts = 0;
  const result = await manager.executeWithRetry(
    () => {
      attempts++;
      if (attempts < 2) {
        throw new Error('Échec simulé');
      }
      return 'Succès';
    },
    {
      maxRetries: 3,
      timeout: 1000,
      backoffMs: 10,
      description: 'Test retry'
    }
  );
  
  if (result !== 'Succès' || attempts !== 2) {
    throw new Error('Retry ne fonctionne pas correctement');
  }
});

// Test OperationManager - Timeout
tester.addTest('OperationManager - Timeout', async () => {
  const logger = new Logger(false);
  const manager = new OperationManager(logger);
  
  try {
    await manager.withTimeout(
      new Promise(resolve => setTimeout(resolve, 2000)),
      100
    );
    throw new Error('Timeout aurait dû se déclencher');
  } catch (error) {
    if (!error.message.includes('Timeout')) {
      throw error;
    }
  }
});

// Test ProgressManager
tester.addTest('ProgressManager - Spinners', async () => {
  const logger = new Logger(false);
  const manager = new ProgressManager(logger);
  
  const spinner = manager.start('Test spinner');
  await manager.sleep(100);
  manager.update('Mise à jour spinner');
  await manager.sleep(100);
  manager.succeed('Spinner terminé');
});

// Test ErrorHandler - AITeamError
tester.addTest('ErrorHandler - Gestion AITeamError', async () => {
  const logger = new Logger(false);
  const handler = new ErrorHandler(logger);
  
  const error = new AITeamError(
    'Test erreur',
    'test_error',
    ['Solution 1', 'Solution 2']
  );
  
  // Capture la sortie
  const originalLog = console.log;
  let captured = '';
  console.log = (...args) => {
    captured += args.join(' ') + '\n';
  };
  
  try {
    handler.handleAITeamError(error);
    
    if (!captured.includes('Test erreur') || !captured.includes('Solution 1')) {
      throw new Error('Gestion d\'erreur incorrecte');
    }
  } finally {
    console.log = originalLog;
  }
});

// Test FileUtils
tester.addTest('FileUtils - Vérification existence fichier', async () => {
  const logger = new Logger(false);
  const utils = new FileUtils(logger);
  
  const exists = await utils.fileExists('package.json');
  if (!exists) {
    throw new Error('package.json devrait exister');
  }
  
  const notExists = await utils.fileExists('fichier-inexistant.xyz');
  if (notExists) {
    throw new Error('Fichier inexistant détecté comme existant');
  }
});

// Test AITeamError
tester.addTest('AITeamError - Propriétés', async () => {
  const error = new AITeamError(
    'Message test',
    'type_test',
    ['Suggestion 1', 'Suggestion 2']
  );
  
  if (error.name !== 'AITeamError') {
    throw new Error('Nom d\'erreur incorrect');
  }
  
  if (error.type !== 'type_test') {
    throw new Error('Type d\'erreur incorrect');
  }
  
  if (error.suggestions.length !== 2) {
    throw new Error('Suggestions incorrectes');
  }
});

// Test intégration complète
tester.addTest('Intégration - Workflow complet', async () => {
  const logger = new Logger(false);
  const envValidator = new EnvironmentValidator(logger);
  const operationManager = new OperationManager(logger);
  const progressManager = new ProgressManager(logger);
  
  // Simulation d'un workflow complet
  const spinner = progressManager.start('Workflow de test...');
  
  try {
    // Étape 1: Validation
    const nodeReq = envValidator.requirements.get('node');
    await envValidator.validateRequirement('node', nodeReq);
    
    // Étape 2: Opération avec retry
    await operationManager.executeWithRetry(
      async () => {
        await operationManager.sleep(50);
        return 'OK';
      },
      { maxRetries: 2, timeout: 1000, description: 'Test opération' }
    );
    
    spinner.succeed('Workflow terminé');
  } catch (error) {
    spinner.fail('Workflow échoué');
    throw error;
  }
});

// Exécution des tests
console.log(chalk.blue('🚀 Démarrage des tests du système robuste...\n'));

tester.runTests().then(() => {
  console.log(chalk.blue('\n✨ Tests terminés!'));
}).catch((error) => {
  console.error(chalk.red('Erreur lors des tests:'), error);
  process.exit(1);
}); 