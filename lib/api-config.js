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
        return keyValue && keyValue.trim() !== '' && !keyValue.includes('votre-cle-api');
      }
    }

    return false;
  }

  /**
   * Obtient la clé API
   */
  getAPIKey() {
    this.loadDotEnv();
    const apiKey = process.env[this.apiKeyName];
    return apiKey && apiKey.trim() !== '' ? apiKey.trim() : null;
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
  async setupAPIKeyInteractively() {
    console.log(chalk.cyan('\n🧠 Configuration DeepSeek R1 - IA de dernière génération'));
    console.log(chalk.white('Together.ai offre DeepSeek R1 gratuitement !\n'));

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