#!/usr/bin/env node

import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Gestionnaire de configuration pour Together.ai API Key
 * Simplifié pour DeepSeek R1
 */

export class APIKeyManager {
  constructor() {
    this.envFilePath = '.env';
    this.apiKeyName = 'TOGETHER_AI_API_KEY';
  }

  /**
   * Vérifie si la clé API est configurée
   */
  isAPIKeyConfigured() {
    // Vérifier d'abord le fichier .env
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const apiKeyLine = envContent.split('\n').find(line => 
        line.trim().startsWith('TOGETHER_AI_API_KEY=') && 
        !line.trim().startsWith('#')
      );
      
      if (apiKeyLine) {
        const keyValue = apiKeyLine.split('=')[1];
        if (keyValue && keyValue.trim() !== '' && !keyValue.includes('votre-cle')) {
          return true;
        }
      }
    }

    // Fallback vers les variables d'environnement
    if (process.env[this.apiKeyName] && process.env[this.apiKeyName].trim() !== '') {
      return true;
    }

    // Fallback vers le fichier .env npm
    if (fs.existsSync(this.envFilePath)) {
      const envContent = fs.readFileSync(this.envFilePath, 'utf8');
      const keyLine = envContent.split('\n').find(line => 
        line.trim().startsWith(`${this.apiKeyName}=`) && 
        !line.trim().startsWith('#')
      );
      
      if (keyLine) {
        const keyValue = keyLine.split('=')[1];
        return keyValue && keyValue.trim() !== '' && !keyValue.includes('votre-cle-api');
      }
    }

    return false;
  }

  /**
   * Obtient la clé API
   */
  getAPIKey() {
    // 1. Vérifier le fichier .env local
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const apiKeyLine = envContent.split('\n').find(line => 
        line.trim().startsWith('TOGETHER_AI_API_KEY=') && 
        !line.trim().startsWith('#')
      );
      
      if (apiKeyLine) {
        const keyValue = apiKeyLine.split('=')[1];
        if (keyValue && keyValue.trim() !== '' && !keyValue.includes('votre-cle')) {
          return keyValue.trim();
        }
      }
    }

    // 2. Variables d'environnement
    this.loadDotEnv();
    const apiKey = process.env[this.apiKeyName];
    if (apiKey && apiKey.trim() !== '') {
      return apiKey.trim();
    }

    return null;
  }

  /**
   * Charge le fichier .env
   */
  loadDotEnv() {
    if (fs.existsSync(this.envFilePath)) {
      const envContent = fs.readFileSync(this.envFilePath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=');
          if (key && value) {
            process.env[key.trim()] = value.trim();
          }
        }
      }
    }
  }

  /**
   * Assistant ultra-rapide pour configurer la clé API
   */
  async setupAPIKeyInteractively(options = {}) {
    console.log(chalk.cyan('\n🧠 Configuration DeepSeek R1 - IA de dernière génération'));
    console.log(chalk.white('Together.ai offre DeepSeek R1 gratuitement !\n'));

    // Choix du mode de configuration
    const { configMode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'configMode',
        message: '🔧 Comment voulez-vous configurer les clés API ?',
        choices: [
          {
            name: '📁 Fichier .env local (RECOMMANDÉ - Simple et rapide)',
            value: 'env_file'
          },
          {
            name: '🔧 Configuration npm globale (Ancienne méthode)',
            value: 'npm_global'
          }
        ],
        default: 'env_file'
      }
    ]);

    if (configMode === 'env_file') {
      return await this.setupEnvFile();
    } else {
      return await this.setupNpmGlobal();
    }
  }

  /**
   * Configuration via fichier .env (nouveau et recommandé)
   */
  async setupEnvFile() {
    console.log(chalk.cyan('\n📁 Configuration via fichier .env'));
    console.log(chalk.white('Création d\'un fichier .env local pour vos clés API\n'));

    const { hasAccount } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'hasAccount',
        message: '❓ Avez-vous déjà un compte Together.ai ?',
        default: false
      }
    ]);

    if (!hasAccount) {
      console.log(chalk.cyan('\n🚀 Créons votre compte Together.ai (gratuit) !'));
      console.log(chalk.white('1. 🌐 Allez sur: https://together.ai'));
      console.log(chalk.white('2. 📝 Inscription gratuite en 30 secondes'));
      console.log(chalk.white('3. ✅ Accès immédiat à DeepSeek R1'));

      const { accountCreated } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'accountCreated',
          message: '✅ Compte créé ?',
          default: false
        }
      ]);

      if (!accountCreated) {
        console.log(chalk.yellow('\n⏸️  Revenez quand votre compte sera créé !'));
        return false;
      }
    }

    console.log(chalk.cyan('\n🔑 Récupération de votre clé API:'));
    console.log(chalk.white('1. 🏠 https://api.together.ai/settings/api-keys'));
    console.log(chalk.white('2. 🔑 "Create new API key"'));
    console.log(chalk.white('3. 📝 Nom: "AI Team DeepSeek R1"'));
    console.log(chalk.white('4. 💾 Copiez la clé'));

    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: '🔐 Collez votre clé API Together.ai:',
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'La clé API est obligatoire';
          }
          if (input.length < 20) {
            return 'La clé API semble trop courte';
          }
          return true;
        }
      }
    ]);

    // Demander optionnellement le token GitHub
    const { wantsGitHubToken } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'wantsGitHubToken',
        message: '🔐 Voulez-vous aussi configurer votre token GitHub ? (optionnel mais recommandé)',
        default: true
      }
    ]);

    let githubToken = '';
    if (wantsGitHubToken) {
      console.log(chalk.cyan('\n🔑 Configuration GitHub Token:'));
      console.log(chalk.white('1. 🌐 Allez sur: https://github.com/settings/tokens'));
      console.log(chalk.white('2. 🔑 "Generate new token (classic)"'));
      console.log(chalk.white('3. 📝 Permissions: repo + workflow'));
      console.log(chalk.white('4. 💾 Copiez le token'));

      const tokenInput = await inquirer.prompt([
        {
          type: 'password',
          name: 'token',
          message: '🔐 Collez votre token GitHub (optionnel):',
          mask: '*',
          validate: (input) => {
            if (input && input.length > 0 && input.length < 20) {
              return 'Le token GitHub semble trop court';
            }
            return true;
          }
        }
      ]);
      githubToken = tokenInput.token;
    }

    // Créer le fichier .env
    const success = this.createEnvFile(apiKey.trim(), githubToken.trim());
    
    if (success) {
      console.log(chalk.green('\n🎉 Fichier .env créé avec succès !'));
      console.log(chalk.cyan('📁 Localisation: .env (à la racine de votre projet)'));
      console.log(chalk.white('\n📋 Contenu configuré:'));
      console.log(chalk.gray('   • TOGETHER_AI_API_KEY (DeepSeek R1)'));
      if (githubToken) {
        console.log(chalk.gray('   • GITHUB_TOKEN (Permissions GitHub)'));
      }
      console.log(chalk.yellow('\n⚠️  IMPORTANT: Ajoutez .env à votre .gitignore !'));
      console.log(chalk.white('\n💡 Commandes prêtes à utiliser:'));
      console.log(chalk.white('   • ai-team check - Vérifier la configuration'));
      console.log(chalk.white('   • ai-team init - Installer les workflows'));
      console.log(chalk.white('   • ai-team issue "titre" - Créer une issue\n'));
      return true;
    } else {
      console.log(chalk.red('\n❌ Erreur lors de la création du fichier .env'));
      return false;
    }
  }

  /**
   * Configuration npm globale (ancienne méthode)
   */
  async setupNpmGlobal() {
    console.log(chalk.cyan('\n🔧 Configuration npm globale (ancienne méthode)'));
    console.log(chalk.white('Cette méthode configure dans le dossier npm\n'));

    const { hasAccount } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'hasAccount',
        message: '❓ Avez-vous déjà un compte Together.ai ?',
        default: false
      }
    ]);

    if (!hasAccount) {
      console.log(chalk.cyan('\n🚀 Créons votre compte Together.ai (gratuit) !'));
      console.log(chalk.white('1. 🌐 Allez sur: https://together.ai'));
      console.log(chalk.white('2. 📝 Inscription gratuite en 30 secondes'));
      console.log(chalk.white('3. ✅ Accès immédiat à DeepSeek R1'));

      const { accountCreated } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'accountCreated',
          message: '✅ Compte créé ?',
          default: false
        }
      ]);

      if (!accountCreated) {
        console.log(chalk.yellow('\n⏸️  Revenez quand votre compte sera créé !'));
        return false;
      }
    }

    console.log(chalk.cyan('\n🔑 Récupération de votre clé API:'));
    console.log(chalk.white('1. 🏠 https://api.together.ai/settings/api-keys'));
    console.log(chalk.white('2. 🔑 "Create new API key"'));
    console.log(chalk.white('3. 📝 Nom: "AI Team DeepSeek R1"'));
    console.log(chalk.white('4. 💾 Copiez la clé'));

    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: '🔐 Collez votre clé API Together.ai:',
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'La clé API est obligatoire';
          }
          if (input.length < 20) {
            return 'La clé API semble trop courte';
          }
          return true;
        }
      }
    ]);

    const success = this.saveAPIKey(apiKey.trim());
    
    if (success) {
      console.log(chalk.green('\n✅ DeepSeek R1 configuré avec succès !'));
      console.log(chalk.cyan('🧠 Vous avez maintenant accès à l\'IA la plus avancée !'));
      console.log(chalk.white('\n💡 Commandes ultra-rapides:'));
      console.log(chalk.white('   • ai-team issue "titre" - Création automatique'));
      console.log(chalk.white('   • ai-team create "desc" - Mode rapide\n'));
      return true;
    } else {
      console.log(chalk.red('\n❌ Erreur lors de la sauvegarde'));
      return false;
    }
  }

  /**
   * Crée un fichier .env local avec les clés API
   */
  createEnvFile(apiKey, githubToken = '') {
    try {
      let envContent = `# AI Team Orchestrator v2.2.0 - Configuration DeepSeek R1
# 🧠 Clés API pour l'IA la plus avancée

# Together.ai API Key pour DeepSeek R1 (OBLIGATOIRE)
TOGETHER_AI_API_KEY=${apiKey}

`;

      if (githubToken && githubToken.length > 0) {
        envContent += `# GitHub Token pour les permissions étendues (OPTIONNEL)
# Permissions requises: repo + workflow
GITHUB_TOKEN=${githubToken}

`;
      } else {
        envContent += `# GitHub Token pour les permissions étendues (OPTIONNEL)
# Décommentez et ajoutez votre token si nécessaire
# GITHUB_TOKEN=ghp_votre_GITHUB_TOKEN

`;
      }

      envContent += `# 💡 Instructions:
# 1. Ajoutez .env à votre .gitignore pour la sécurité
# 2. Utilisez 'ai-team check' pour vérifier la configuration
# 3. Utilisez 'ai-team init' pour installer les workflows
# 4. Créez des issues avec 'ai-team issue "titre" --type frontend'

# 🚀 AI Team Orchestrator - Propulsé par DeepSeek R1`;

      fs.writeFileSync('.env', envContent);
      
      // Ajouter .env au .gitignore s'il existe
      this.addToGitignore();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la création du fichier .env:', error.message);
      return false;
    }
  }

  /**
   * Ajoute .env au .gitignore si le fichier existe
   */
  addToGitignore() {
    try {
      if (fs.existsSync('.gitignore')) {
        const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
        
        if (!gitignoreContent.includes('.env')) {
          fs.appendFileSync('.gitignore', '\n# AI Team Orchestrator - Variables d\'environnement\n.env\n');
          console.log(chalk.green('✅ .env ajouté au .gitignore'));
        }
      } else {
        // Créer un .gitignore si il n'existe pas
        fs.writeFileSync('.gitignore', '# AI Team Orchestrator - Variables d\'environnement\n.env\n');
        console.log(chalk.green('✅ .gitignore créé avec .env'));
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ Impossible de modifier .gitignore automatiquement'));
      console.log(chalk.white('💡 Ajoutez manuellement .env à votre .gitignore'));
    }
  }

  /**
   * Sauvegarde rapide de la clé API
   */
  saveAPIKey(apiKey) {
    try {
      if (fs.existsSync(this.envFilePath)) {
        const currentContent = fs.readFileSync(this.envFilePath, 'utf8');
        const lines = currentContent.split('\n');
        let found = false;
        
        const newLines = lines.map(line => {
          if (line.trim().startsWith(`${this.apiKeyName}=`)) {
            found = true;
            return `${this.apiKeyName}=${apiKey}`;
          }
          return line;
        });
        
        if (!found) {
          newLines.push(`${this.apiKeyName}=${apiKey}`);
        }
        
        fs.writeFileSync(this.envFilePath, newLines.join('\n'));
      } else {
        const envContent = `# AI Team Orchestrator v2.0 - DeepSeek R1
${this.apiKeyName}=${apiKey}
`;
        fs.writeFileSync(this.envFilePath, envContent);
      }
      
      // Mettre à jour process.env immédiatement
      process.env[this.apiKeyName] = apiKey;
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error.message);
      return false;
    }
  }

  /**
   * Test de la clé API avec DeepSeek R1
   */
  async testAPIKey(apiKey) {
    try {
      const response = await fetch('https://api.together.xyz/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
} 