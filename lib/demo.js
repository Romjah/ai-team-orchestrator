import { execSync } from 'child_process';
import chalk from 'chalk';

const demoIssues = {
  frontend: {
    title: "Créer une landing page moderne avec animations CSS",
    body: `Créer une landing page attractive avec :
- Design moderne et responsive
- Animations CSS fluides et élégantes
- Section hero avec call-to-action
- Sections features et testimonials
- Footer avec liens sociaux
- Couleurs modernes et typographie soignée
- Boutons interactifs avec hover effects
- Mobile-first design

Technologies : HTML5, CSS3, JavaScript vanilla

Cette issue va déclencher le **Frontend Specialist** 🎨`
  },
  
  backend: {
    title: "Développer une API REST pour gestion d'utilisateurs",
    body: `Créer une API REST complète avec :
- Routes CRUD pour les utilisateurs
- Authentification JWT
- Validation des données
- Gestion d'erreurs
- Documentation automatique
- Tests d'intégration
- Middleware de sécurité
- Rate limiting

Technologies : Node.js, Express.js

Cette issue va déclencher le **Backend Specialist** ⚙️`
  },
  
  testing: {
    title: "Ajouter des tests unitaires pour l'authentification",
    body: `Créer une suite de tests complète pour :
- Tests unitaires de login/logout
- Tests de validation des tokens
- Tests de gestion des erreurs
- Tests d'intégration API
- Mocking des dépendances
- Coverage reporting
- Tests de performance
- Tests de sécurité

Framework : Jest ou Mocha

Cette issue va déclencher le **QA Engineer** 🧪`
  },
  
  bug: {
    title: "Bug: Le formulaire de contact ne fonctionne pas",
    body: `Problème détecté :
- Le bouton submit ne répond pas
- Validation des champs échoue
- Messages d'erreur non affichés
- Données non envoyées au serveur
- Console affiche des erreurs JavaScript

Reproduire :
1. Aller sur la page contact
2. Remplir le formulaire
3. Cliquer sur "Envoyer"
4. Rien ne se passe

Cette issue va déclencher le **Bug Hunter** 🐛`
  },
  
  refactor: {
    title: "Refactoring: Optimiser la structure du code CSS",
    body: `Améliorer l'organisation du code :
- Restructurer les fichiers CSS
- Optimiser les sélecteurs
- Éliminer le code dupliqué
- Améliorer les performances
- Créer un système de design tokens
- Organiser en modules/composants
- Améliorer la maintenabilité

Cette issue va déclencher le **Code Architect** 🏗️`
  }
};

export async function createDemoIssue(type = 'frontend') {
  try {
    // Vérifier qu'on est dans un repo git
    checkGitRepo();
    
    // Vérifier que gh CLI est installé
    checkGitHubCLI();
    
    // Sélectionner l'issue de démo
    const issue = demoIssues[type];
    if (!issue) {
      throw new Error(`Unknown demo type: ${type}. Available: ${Object.keys(demoIssues).join(', ')}`);
    }
    
    // Créer l'issue via GitHub CLI
    const command = `gh issue create --title "${issue.title}" --body "${issue.body}"`;
    
    try {
      const output = execSync(command, { encoding: 'utf8' });
      console.log(chalk.green('✅ Demo issue created successfully!'));
      console.log(chalk.gray(output.trim()));
      
      console.log(chalk.yellow('\n🎯 What happens next:'));
      console.log('1. AI Team will analyze the issue automatically');
      console.log(`2. The appropriate agent will be selected (${getAgentForType(type)})`);
      console.log('3. Code will be generated and a PR created');
      console.log('4. Check back in ~2 minutes! ⏱️');
      
    } catch (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
    
  } catch (error) {
    throw error;
  }
}

function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('Not a git repository. Run "git init" first.');
  }
}

function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('GitHub CLI (gh) not found. Install it from https://cli.github.com/');
  }
}

function getAgentForType(type) {
  const agents = {
    frontend: 'Frontend Specialist 🎨',
    backend: 'Backend Specialist ⚙️',
    testing: 'QA Engineer 🧪',
    bug: 'Bug Hunter 🐛',
    refactor: 'Code Architect 🏗️'
  };
  
  return agents[type] || 'Full-Stack Developer 🚀';
}

export function listDemoTypes() {
  console.log(chalk.blue.bold('📋 Available Demo Types:\n'));
  
  Object.entries(demoIssues).forEach(([type, issue]) => {
    console.log(chalk.yellow(`${type}:`));
    console.log(chalk.gray(`  ${issue.title}`));
    console.log(chalk.cyan(`  → Triggers: ${getAgentForType(type)}\n`));
  });
  
  console.log(chalk.green('Usage: ai-team demo --type <type>'));
} 