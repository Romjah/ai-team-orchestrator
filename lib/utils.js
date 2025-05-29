import { execSync, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Classe pour gérer les erreurs avec contexte
 */
export class AITeamError extends Error {
  constructor(message, type = 'generic', suggestions = []) {
    super(message);
    this.name = 'AITeamError';
    this.type = type;
    this.suggestions = suggestions;
  }
}

/**
 * Logger avec niveaux
 */
export class Logger {
  constructor(verbose = false) {
    this.verbose = verbose;
  }

  info(message) {
    console.log(chalk.blue('ℹ️'), message);
  }

  success(message) {
    console.log(chalk.green('✅'), message);
  }

  warning(message) {
    console.log(chalk.yellow('⚠️'), message);
  }

  error(message) {
    console.log(chalk.red('❌'), message);
  }

  debug(message) {
    if (this.verbose) {
      console.log(chalk.gray('🔍 DEBUG:'), message);
    }
  }

  title(message) {
    console.log(chalk.blue.bold(`\n🤖 ${message}\n`));
  }
}

/**
 * Validateur d'environnement système
 */
export class EnvironmentValidator {
  constructor(logger) {
    this.logger = logger;
    this.requirements = new Map();
    this.setupRequirements();
  }

  setupRequirements() {
    this.requirements.set('node', {
      command: 'node --version',
      minVersion: '14.0.0',
      name: 'Node.js',
      installUrl: 'https://nodejs.org'
    });

    this.requirements.set('git', {
      command: 'git --version',
      name: 'Git',
      installUrl: 'https://git-scm.com'
    });

    this.requirements.set('gh', {
      command: 'gh --version',
      name: 'GitHub CLI',
      installUrl: 'https://cli.github.com',
      optional: true
    });

    this.requirements.set('npm', {
      command: 'npm --version',
      name: 'npm',
      installUrl: 'https://www.npmjs.com'
    });
  }

  async validateAll() {
    this.logger.title('Validation de l\'environnement');
    const results = new Map();
    
    for (const [key, req] of this.requirements) {
      try {
        const result = await this.validateRequirement(key, req);
        results.set(key, result);
      } catch (error) {
        results.set(key, { valid: false, error: error.message });
      }
    }

    return this.processResults(results);
  }

  async validateRequirement(key, requirement) {
    this.logger.debug(`Validation de ${requirement.name}...`);
    
    try {
      const output = execSync(requirement.command, { 
        encoding: 'utf8', 
        stdio: 'pipe',
        timeout: 5000 
      });
      
      const version = this.extractVersion(output);
      const valid = requirement.minVersion ? 
        this.compareVersions(version, requirement.minVersion) >= 0 : true;

      if (valid) {
        this.logger.success(`${requirement.name} ${version ? `(${version})` : '✓'}`);
      } else {
        throw new Error(`Version ${version} < ${requirement.minVersion} requise`);
      }

      return { valid: true, version, output };
    } catch (error) {
      if (requirement.optional) {
        this.logger.warning(`${requirement.name} non installé (optionnel)`);
        return { valid: true, optional: true, missing: true };
      }
      
      this.logger.error(`${requirement.name} non trouvé`);
      throw new AITeamError(
        `${requirement.name} est requis`,
        'missing_dependency',
        [`Installer depuis: ${requirement.installUrl}`]
      );
    }
  }

  extractVersion(output) {
    const versionMatch = output.match(/(\d+\.\d+\.\d+)/);
    return versionMatch ? versionMatch[1] : null;
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  }

  processResults(results) {
    const failed = Array.from(results.entries())
      .filter(([_, result]) => !result.valid)
      .map(([key, _]) => key);

    if (failed.length > 0) {
      throw new AITeamError(
        'Prérequis manquants détectés',
        'environment_check_failed',
        failed.map(key => `Installer ${this.requirements.get(key).name}`)
      );
    }

    return true;
  }
}

/**
 * Validateur de repository Git
 */
export class GitValidator {
  constructor(logger) {
    this.logger = logger;
  }

  async validateRepository() {
    await this.checkGitRepo();
    await this.checkGitConfig();
    await this.checkRemotes();
    await this.checkWorkingDirectory();
    
    return true;
  }

  async checkGitRepo() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore', timeout: 3000 });
      this.logger.success('Repository Git détecté');
    } catch (error) {
      throw new AITeamError(
        'Pas un repository Git',
        'not_git_repo',
        [
          'Exécuter: git init',
          'Ou naviguer vers un repository Git existant'
        ]
      );
    }
  }

  async checkGitConfig() {
    try {
      const userName = execSync('git config user.name', { encoding: 'utf8', stdio: 'pipe' }).trim();
      const userEmail = execSync('git config user.email', { encoding: 'utf8', stdio: 'pipe' }).trim();
      
      if (!userName || !userEmail) {
        throw new Error('Configuration Git incomplète');
      }
      
      this.logger.success(`Configuration Git: ${userName} <${userEmail}>`);
    } catch (error) {
      throw new AITeamError(
        'Configuration Git manquante',
        'git_config_missing',
        [
          'git config --global user.name "Votre Nom"',
          'git config --global user.email "votre@email.com"'
        ]
      );
    }
  }

  async checkRemotes() {
    try {
      const remotes = execSync('git remote -v', { encoding: 'utf8', stdio: 'pipe' });
      if (remotes.trim()) {
        this.logger.success('Remotes Git configurés');
        this.logger.debug(`Remotes: ${remotes.split('\n').length / 2} configuré(s)`);
      } else {
        this.logger.warning('Aucun remote Git configuré');
      }
    } catch (error) {
      this.logger.warning('Impossible de vérifier les remotes Git');
    }
  }

  async checkWorkingDirectory() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8', stdio: 'pipe' });
      if (status.trim()) {
        this.logger.warning('Modifications non commitées détectées');
        this.logger.debug('Fichiers modifiés: ' + status.split('\n').length);
      } else {
        this.logger.success('Working directory propre');
      }
    } catch (error) {
      this.logger.warning('Impossible de vérifier le statut Git');
    }
  }
}

/**
 * Gestionnaire d'opérations avec retry et timeout
 */
export class OperationManager {
  constructor(logger) {
    this.logger = logger;
  }

  async executeWithRetry(operation, options = {}) {
    const {
      maxRetries = 3,
      timeout = 30000,
      backoffMs = 1000,
      description = 'Opération'
    } = options;

    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.debug(`${description} - Tentative ${attempt}/${maxRetries}`);
        
        const result = await this.withTimeout(operation(), timeout);
        
        if (attempt > 1) {
          this.logger.success(`${description} réussie après ${attempt} tentatives`);
        }
        
        return result;
      } catch (error) {
        lastError = error;
        this.logger.debug(`Tentative ${attempt} échouée: ${error.message}`);
        
        if (attempt < maxRetries) {
          const delay = backoffMs * Math.pow(2, attempt - 1);
          this.logger.debug(`Attente de ${delay}ms avant nouvelle tentative...`);
          await this.sleep(delay);
        }
      }
    }

    throw new AITeamError(
      `${description} échouée après ${maxRetries} tentatives`,
      'operation_failed',
      [`Dernière erreur: ${lastError.message}`]
    );
  }

  async withTimeout(promise, timeoutMs) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout après ${timeoutMs}ms`)), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Gestionnaire de progress avec spinners
 */
export class ProgressManager {
  constructor(logger) {
    this.logger = logger;
    this.currentSpinner = null;
  }

  start(text, options = {}) {
    if (this.currentSpinner) {
      this.currentSpinner.stop();
    }

    this.currentSpinner = ora({
      text,
      color: options.color || 'blue',
      spinner: options.spinner || 'dots'
    }).start();

    return this.currentSpinner;
  }

  update(text) {
    if (this.currentSpinner) {
      this.currentSpinner.text = text;
    }
  }

  succeed(text) {
    if (this.currentSpinner) {
      this.currentSpinner.succeed(text);
      this.currentSpinner = null;
    }
  }

  fail(text) {
    if (this.currentSpinner) {
      this.currentSpinner.fail(text);
      this.currentSpinner = null;
    }
  }

  stop() {
    if (this.currentSpinner) {
      this.currentSpinner.stop();
      this.currentSpinner = null;
    }
  }
}

/**
 * Gestionnaire d'erreurs global
 */
export class ErrorHandler {
  constructor(logger) {
    this.logger = logger;
  }

  handle(error) {
    this.logger.error('Erreur détectée:');
    
    if (error instanceof AITeamError) {
      this.handleAITeamError(error);
    } else if (error.code === 'ENOENT') {
      this.handleFileNotFound(error);
    } else if (error.code === 'EACCES') {
      this.handlePermissionError(error);
    } else if (error.code === 'ENOTDIR') {
      this.handleDirectoryError(error);
    } else {
      this.handleGenericError(error);
    }

    this.showSupportInfo();
  }

  handleAITeamError(error) {
    console.log(chalk.red(`\n📍 ${error.message}\n`));
    
    if (error.suggestions && error.suggestions.length > 0) {
      console.log(chalk.yellow('💡 Solutions suggérées:'));
      error.suggestions.forEach((suggestion, index) => {
        console.log(chalk.yellow(`   ${index + 1}. ${suggestion}`));
      });
    }

    console.log(chalk.gray(`\nType d'erreur: ${error.type}`));
  }

  handleFileNotFound(error) {
    console.log(chalk.red(`\n📁 Fichier ou commande non trouvé: ${error.path}`));
    console.log(chalk.yellow('💡 Vérifiez que le fichier existe et que le chemin est correct'));
  }

  handlePermissionError(error) {
    console.log(chalk.red(`\n🔒 Erreur de permissions: ${error.path}`));
    console.log(chalk.yellow('💡 Solutions:'));
    console.log(chalk.yellow('   1. sudo chmod +x <fichier>'));
    console.log(chalk.yellow('   2. Vérifiez les permissions du répertoire'));
  }

  handleDirectoryError(error) {
    console.log(chalk.red(`\n📂 Erreur de répertoire: ${error.path}`));
    console.log(chalk.yellow('💡 Vérifiez que le répertoire parent existe'));
  }

  handleGenericError(error) {
    console.log(chalk.red(`\n⚠️  ${error.message}`));
    
    if (error.stack && process.env.NODE_ENV === 'development') {
      console.log(chalk.gray('\nStack trace:'));
      console.log(chalk.gray(error.stack));
    }
  }

  showSupportInfo() {
    console.log(chalk.cyan('\n🆘 Besoin d\'aide ?'));
    console.log(chalk.cyan('   • Documentation: https://github.com/Romjah/ai-team-orchestrator#readme'));
    console.log(chalk.cyan('   • Issues: https://github.com/Romjah/ai-team-orchestrator/issues'));
    console.log(chalk.cyan('   • Mode verbose: --verbose pour plus de détails'));
  }
}

/**
 * Utilitaires de fichiers avec gestion d'erreurs
 */
export class FileUtils {
  constructor(logger) {
    this.logger = logger;
  }

  async ensureDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
      this.logger.debug(`Répertoire créé: ${dirPath}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw new AITeamError(
          `Impossible de créer le répertoire: ${dirPath}`,
          'directory_creation_failed',
          [`Vérifiez les permissions du répertoire parent`]
        );
      }
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async copyFile(source, destination) {
    try {
      await this.ensureDirectory(path.dirname(destination));
      await fs.copyFile(source, destination);
      this.logger.debug(`Fichier copié: ${source} → ${destination}`);
    } catch (error) {
      throw new AITeamError(
        `Impossible de copier le fichier: ${source} → ${destination}`,
        'file_copy_failed',
        [`Vérifiez que le fichier source existe`, `Vérifiez les permissions`]
      );
    }
  }

  async readJsonFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new AITeamError(
          `Fichier non trouvé: ${filePath}`,
          'file_not_found',
          [`Vérifiez le chemin du fichier`]
        );
      }
      throw new AITeamError(
        `Impossible de lire le fichier JSON: ${filePath}`,
        'json_parse_error',
        [`Vérifiez la syntaxe JSON du fichier`]
      );
    }
  }
}

// Exports individuels - les classes sont déjà exportées au-dessus 