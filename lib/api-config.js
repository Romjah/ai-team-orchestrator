#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Gestionnaire de configuration pour Together.ai API Key
 * Fournit une expérience utilisateur intuitive pour configurer la clé API
 */

export class APIKeyManager {
  constructor() {
    this.envFilePath = '.env';
    this.envExamplePath = '.env.example';
    this.apiKeyName = 'TOGETHER_AI_API_KEY';
  }

  /**
   * Vérifie si la clé API est configurée
   * @returns {boolean}
   */
  isAPIKeyConfigured() {
    // Vérifier les variables d'environnement
    if (process.env[this.apiKeyName] && process.env[this.apiKeyName].trim() !== '') {
      return true;
    }

    // Vérifier le fichier .env
    if (fs.existsSync(this.envFilePath)) {
      const envContent = fs.readFileSync(this.envFilePath, 'utf8');
      const keyLine = envContent.split('\n').find(line => 
        line.trim().startsWith(`${this.apiKeyName}=`) && 
        !line.trim().startsWith('#')
      );
      
      if (keyLine) {
        const keyValue = keyLine.split('=')[1];
        return keyValue && keyValue.trim() !== '' && !keyValue.includes('sk-votre-cle-api');
      }
    }

    return false;
  }

  /**
   * Obtient la clé API depuis l'environnement ou le fichier .env
   * @returns {string|null}
   */
  getAPIKey() {
    // D'abord, charger le fichier .env s'il existe
    this.loadDotEnv();
    
    const apiKey = process.env[this.apiKeyName];
    
    if (!apiKey || apiKey.trim() === '') {
      return null;
    }
    
    return apiKey.trim();
  }

  /**
   * Charge le fichier .env dans process.env
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
   * Assistant interactif pour configurer la clé API
   */
  async setupAPIKeyInteractively() {
    console.log(chalk.cyan('\n🔑 Configuration de la clé API Together.ai'));
    console.log(chalk.white('Cette étape est nécessaire pour utiliser AI Team Orchestrator.\n'));

    // Étapes de configuration
    const steps = [
      '🌐 Créer un compte gratuit sur Together.ai',
      '🔑 Obtenir votre clé API',
      '💾 Sauvegarder la clé dans votre projet'
    ];

    console.log(chalk.yellow('📋 Étapes requises:'));
    steps.forEach((step, index) => {
      console.log(chalk.white(`   ${index + 1}. ${step}`));
    });

    // Demander si l'utilisateur a déjà un compte
    const { hasAccount } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'hasAccount',
        message: '❓ Avez-vous déjà un compte Together.ai ?',
        default: false
      }
    ]);

    if (!hasAccount) {
      console.log(chalk.cyan('\n🚀 Créons votre compte Together.ai !'));
      console.log(chalk.white('1. 🌐 Allez sur: https://together.ai'));
      console.log(chalk.white('2. 📝 Cliquez sur "Sign Up" (inscription gratuite)'));
      console.log(chalk.white('3. ✨ Créez votre compte avec votre email'));
      console.log(chalk.white('4. ✅ Vérifiez votre email et connectez-vous'));

      const { accountCreated } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'accountCreated',
          message: '✅ Compte créé et vous êtes connecté ?',
          default: false
        }
      ]);

      if (!accountCreated) {
        console.log(chalk.yellow('\n⏸️  Revenez quand votre compte sera créé !'));
        console.log(chalk.white('💡 Tapez: ai-team setup-api\n'));
        return false;
      }
    }

    // Instructions pour obtenir la clé API
    console.log(chalk.cyan('\n🔑 Récupération de votre clé API:'));
    console.log(chalk.white('1. 🏠 Allez sur: https://api.together.ai/settings/api-keys'));
    console.log(chalk.white('2. 🔑 Cliquez sur "Create new API key"'));
    console.log(chalk.white('3. 📝 Donnez-lui un nom (ex: "AI Team Orchestrator")'));
    console.log(chalk.white('4. 💾 Copiez la clé qui commence par "sk-..."'));

    const { hasAPIKey } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'hasAPIKey',
        message: '🔑 Avez-vous copié votre clé API ?',
        default: false
      }
    ]);

    if (!hasAPIKey) {
      console.log(chalk.yellow('\n⏸️  Revenez avec votre clé API !'));
      console.log(chalk.white('💡 Tapez: ai-team setup-api\n'));
      return false;
    }

    // Demander la clé API
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: '🔐 Collez votre clé API Together.ai:',
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'La clé API est obligatoire';
          }
          if (!input.startsWith('sk-')) {
            return 'La clé API Together.ai doit commencer par "sk-"';
          }
          if (input.length < 20) {
            return 'La clé API semble trop courte';
          }
          return true;
        }
      }
    ]);

    // Choix de stockage
    const { storageMethod } = await inquirer.prompt([
      {
        type: 'list',
        name: 'storageMethod',
        message: '💾 Comment voulez-vous sauvegarder la clé ?',
        choices: [
          {
            name: '📁 Fichier .env local (recommandé)',
            value: 'env_file',
            short: 'Fichier .env'
          },
          {
            name: '🌍 Variable d\'environnement système',
            value: 'system_env',
            short: 'Variable système'
          }
        ],
        default: 'env_file'
      }
    ]);

    // Sauvegarder la clé
    const success = await this.saveAPIKey(apiKey.trim(), storageMethod);
    
    if (success) {
      console.log(chalk.green('\n✅ Configuration terminée avec succès !'));
      console.log(chalk.cyan('🚀 Vous pouvez maintenant utiliser AI Team Orchestrator.'));
      console.log(chalk.white('\n💡 Commandes utiles:'));
      console.log(chalk.white('   • ai-team create     - Créer une nouvelle tâche'));
      console.log(chalk.white('   • ai-team status     - Vérifier le statut'));
      console.log(chalk.white('   • ai-team demo       - Créer une démo\n'));
      return true;
    } else {
      console.log(chalk.red('\n❌ Erreur lors de la sauvegarde'));
      return false;
    }
  }

  /**
   * Sauvegarde la clé API selon la méthode choisie
   */
  async saveAPIKey(apiKey, method) {
    try {
      if (method === 'env_file') {
        return await this.saveToEnvFile(apiKey);
      } else if (method === 'system_env') {
        return this.showSystemEnvInstructions(apiKey);
      }
      return false;
    } catch (error) {
      console.error(chalk.red(`Erreur lors de la sauvegarde: ${error.message}`));
      return false;
    }
  }

  /**
   * Sauvegarde dans le fichier .env
   */
  async saveToEnvFile(apiKey) {
    try {
      // Créer le fichier .env.example s'il n'existe pas
      this.createEnvExample();

      let envContent = '';
      const envLine = `${this.apiKeyName}=${apiKey}`;
      
      if (fs.existsSync(this.envFilePath)) {
        // Fichier .env existe, le mettre à jour
        envContent = fs.readFileSync(this.envFilePath, 'utf8');
        
        if (envContent.includes(`${this.apiKeyName}=`)) {
          // Remplacer la ligne existante
          const lines = envContent.split('\n');
          const updatedLines = lines.map(line => {
            if (line.startsWith(`${this.apiKeyName}=`)) {
              return envLine;
            }
            return line;
          });
          envContent = updatedLines.join('\n');
        } else {
          // Ajouter la nouvelle ligne
          envContent += envContent.endsWith('\n') ? '' : '\n';
          envContent += envLine + '\n';
        }
      } else {
        // Créer un nouveau fichier .env
        envContent = `# Configuration AI Team Orchestrator\n# Généré automatiquement\n\n${envLine}\n`;
      }

      fs.writeFileSync(this.envFilePath, envContent);
      
      console.log(chalk.green(`✅ Clé API sauvegardée dans ${this.envFilePath}`));
      console.log(chalk.yellow(`⚠️  Ce fichier est ignoré par Git pour votre sécurité`));
      
      return true;
    } catch (error) {
      console.error(chalk.red(`Erreur: ${error.message}`));
      return false;
    }
  }

  /**
   * Affiche les instructions pour configurer la variable système
   */
  showSystemEnvInstructions(apiKey) {
    console.log(chalk.cyan('\n🌍 Configuration variable d\'environnement système:'));
    
    const platform = process.platform;
    
    if (platform === 'win32') {
      console.log(chalk.white('📋 Windows (PowerShell):'));
      console.log(chalk.gray(`setx ${this.apiKeyName} "${apiKey}"`));
    } else {
      console.log(chalk.white('📋 macOS/Linux (.bashrc ou .zshrc):'));
      console.log(chalk.gray(`export ${this.apiKeyName}="${apiKey}"`));
      console.log(chalk.white('\nPuis rechargez votre shell:'));
      console.log(chalk.gray('source ~/.bashrc  # ou ~/.zshrc'));
    }
    
    console.log(chalk.yellow('\n⚠️  N\'oubliez pas de redémarrer votre terminal !'));
    
    return true;
  }

  /**
   * Crée le fichier .env.example
   */
  createEnvExample() {
    if (!fs.existsSync(this.envExamplePath)) {
      const exampleContent = `# Configuration AI Team Orchestrator
# Copiez ce fichier vers .env et ajoutez vos vraies valeurs

# Clé API Together.ai (obligatoire)
# Obtenez votre clé sur: https://api.together.ai/settings/api-keys
${this.apiKeyName}=sk-votre-cle-api-together-ai

# Autres variables (optionnelles)
# GITHUB_TOKEN=ghp_votre-token-github
`;
      
      fs.writeFileSync(this.envExamplePath, exampleContent);
      console.log(chalk.green(`✅ Fichier ${this.envExamplePath} créé`));
    }
  }

  /**
   * Vérifie et affiche le statut de la clé API
   */
  async checkAPIKeyStatus() {
    console.log(chalk.cyan('\n🔍 Vérification de la configuration API...\n'));
    
    const isConfigured = this.isAPIKeyConfigured();
    const apiKey = this.getAPIKey();
    
    if (isConfigured && apiKey) {
      console.log(chalk.green('✅ Clé API Together.ai configurée'));
      console.log(chalk.white(`   Clé: ${apiKey.substring(0, 8)}...${apiKey.slice(-4)}`));
      
      // Test de la connexion (optionnel)
      const isValid = await this.testAPIKey(apiKey);
      if (isValid) {
        console.log(chalk.green('✅ Clé API valide et fonctionnelle'));
      } else {
        console.log(chalk.yellow('⚠️  Clé API présente mais impossible de la valider'));
        console.log(chalk.gray('   (Vérification en ligne échouée)'));
      }
      
      return true;
    } else {
      console.log(chalk.red('❌ Clé API Together.ai non configurée'));
      console.log(chalk.white('\n💡 Pour configurer:'));
      console.log(chalk.white('   ai-team setup-api'));
      return false;
    }
  }

  /**
   * Test basique de la clé API
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

  /**
   * Affiche un message d'erreur formaté quand la clé API est manquante
   */
  showMissingAPIKeyError() {
    console.log(chalk.red('\n🚨 Clé API Together.ai manquante !'));
    console.log(chalk.white('\nAI Team Orchestrator a besoin d\'une clé API Together.ai pour fonctionner.'));
    console.log(chalk.cyan('\n🚀 Configuration automatique:'));
    console.log(chalk.white('   ai-team setup-api'));
    console.log(chalk.cyan('\n📖 Configuration manuelle:'));
    console.log(chalk.white('   1. Créez un compte sur https://together.ai'));
    console.log(chalk.white('   2. Obtenez votre clé API'));
    console.log(chalk.white('   3. Créez un fichier .env avec:'));
    console.log(chalk.gray(`   ${this.apiKeyName}=sk-votre-cle-api`));
    console.log(chalk.yellow('\n💡 La clé API est gratuite pour commencer !\n'));
  }
}

// Instance globale
export const apiKeyManager = new APIKeyManager();

// Fonction helper pour vérifier avant toute opération
export async function ensureAPIKeyConfigured() {
  const manager = new APIKeyManager();
  
  if (!manager.isAPIKeyConfigured()) {
    manager.showMissingAPIKeyError();
    
    const { setupNow } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setupNow',
        message: '🔧 Voulez-vous configurer la clé API maintenant ?',
        default: true
      }
    ]);
    
    if (setupNow) {
      const success = await manager.setupAPIKeyInteractively();
      return success;
    } else {
      console.log(chalk.yellow('⏸️  Configuration reportée. Relancez quand vous serez prêt.'));
      return false;
    }
  }
  
  return true;
} 