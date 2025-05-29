# 📦 AI Team Orchestrator - Guide d'utilisation du package

## 🎯 Package NPM professionnel prêt

Votre projet est maintenant **un vrai package NPM** distributable et installable !

## 📁 Structure du package

```
@ai-team/orchestrator/
├── 📦 package.json          # Configuration NPM
├── 🚀 index.js              # Point d'entrée principal
├── 📄 LICENSE               # Licence MIT
├── 📖 README.md             # Documentation principale
├── 
├── bin/                     # Exécutables CLI
│   └── ai-team.js          # CLI principal
├── 
├── lib/                     # Modules principaux
│   ├── installer.js        # Logique d'installation
│   └── demo.js             # Création d'issues de test
├── 
├── templates/               # Templates GitHub
│   └── .github/            # Workflows et scripts
│       ├── workflows/      # GitHub Actions
│       └── scripts/        # Scripts Python
├── 
├── test/                    # Tests du package
│   └── test.js            # Tests principaux
└── 
└── demo/                    # Exemples et démos
```

## 🚀 Utilisation du package

### 1. Installation globale (Recommandée)

```bash
# Publier le package (pour les mainteneurs)
npm publish

# Installer globalement
npm install -g @ai-team/orchestrator

# Utiliser partout
ai-team install
```

### 2. Utilisation directe avec npx

```bash
# Sans installation
npx @ai-team/orchestrator install

# Ou avec tous les paramètres
npx @ai-team/orchestrator install --type zero-config --force
```

### 3. Utilisation locale dans un projet

```bash
# Installer localement
npm install @ai-team/orchestrator

# Utiliser via npm scripts
npm run ai-team-setup
```

## 🔧 Commandes CLI disponibles

```bash
# Installation
ai-team install [--type zero-config|full|github-app] [--force]

# Status et diagnostic
ai-team status              # Vérifier l'installation
ai-team agents              # Lister les agents disponibles

# Tests et démo
ai-team demo [--type frontend|backend|testing|bug|refactor]

# Gestion de projets
ai-team init <project-name> # Nouveau projet avec AI Team
ai-team uninstall [--force] # Désinstaller

# Aide
ai-team --help              # Aide générale
ai-team <command> --help    # Aide pour une commande
```

## 💻 Utilisation programmatique

```javascript
// Import ES6
import { quickSetup, createDemoIssue, listAgents } from '@ai-team/orchestrator';

// Installation programmatique
const result = await quickSetup({
  type: 'zero-config',
  force: false
});

if (result.success) {
  console.log('✅ AI Team installé !');
} else {
  console.error('❌ Erreur:', result.error);
}

// Créer une issue de test
await createDemoIssue('frontend');

// Lister les agents (pour un dashboard)
listAgents();
```

## 🧪 Tests du package

```bash
# Lancer les tests
npm test

# Ou directement
node test/test.js
```

**Tests inclus :**
- ✅ Structure du package
- ✅ Fichiers CLI présents
- ✅ Templates GitHub disponibles
- ✅ Modules lib fonctionnels
- ✅ Workflow zero-config valide
- ✅ Générateur Python présent

## 📦 Distribution et publication

### Préparer la publication

```bash
# Vérifier que tout est prêt
npm test

# Voir ce qui sera publié
npm pack --dry-run

# Créer un package local pour test
npm pack
```

### Publier sur NPM

```bash
# Se connecter à NPM
npm login

# Publier (première fois)
npm publish --access public

# Publier une mise à jour
npm version patch  # ou minor/major
npm publish
```

### Installation depuis GitHub

```bash
# Installer directement depuis GitHub
npm install -g git+https://github.com/ai-team-orchestrator/ai-team-orchestrator.git

# Ou depuis une branche spécifique
npm install -g git+https://github.com/ai-team-orchestrator/ai-team-orchestrator.git#main
```

## 🎯 Workflow de développement

### Pour les mainteneurs

```bash
# 1. Cloner et développer
git clone https://github.com/ai-team-orchestrator/ai-team-orchestrator.git
cd ai-team-orchestrator
npm install

# 2. Développer et tester
# ... modifications ...
npm test

# 3. Tester localement
npm link
ai-team install  # Teste la version locale

# 4. Publier
npm version patch
npm publish
git push --tags
```

### Pour les utilisateurs

```bash
# Installation simple
npm install -g @ai-team/orchestrator

# Utilisation immédiate
cd mon-projet
ai-team install
git add . && git commit -m "🤖 Add AI Team" && git push

# Test
ai-team demo --type frontend
```

## 🔥 Exemples d'utilisation

### Nouveau projet from scratch

```bash
# Créer et initialiser
ai-team init mon-super-projet
cd mon-super-projet

# Déjà configuré avec AI Team !
git remote add origin https://github.com/user/mon-super-projet.git
git push -u origin main

# Tester immédiatement
ai-team demo --type frontend
```

### Projet existant

```bash
# Aller dans le projet
cd projet-existant

# Installer AI Team
ai-team install

# Vérifier le status
ai-team status

# Pousser les changements
git add .github/
git commit -m "🤖 Add AI Team Zero-Config"
git push

# Créer une issue de test
ai-team demo --type backend
```

### CI/CD automatique

```yaml
# .github/workflows/setup-ai-team.yml
name: Setup AI Team
on:
  workflow_dispatch:

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install AI Team
      run: |
        npx @ai-team/orchestrator install --type zero-config
        
    - name: Commit AI Team files
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add .github/
        git commit -m "🤖 Auto-install AI Team" || exit 0
        git push
```

## 🎉 Avantages du package NPM

### ✅ Pour les utilisateurs
- **Installation simple** : `npm install -g @ai-team/orchestrator`
- **Commandes CLI** : `ai-team install` et c'est tout !
- **Mises à jour** : `npm update -g @ai-team/orchestrator`
- **Aucune configuration** : Zero-config par défaut

### ✅ Pour les développeurs
- **Package professionnel** : Structure standard NPM
- **Distribution facile** : Publiable sur npm.js
- **Tests automatiques** : `npm test`
- **Versioning** : Semantic versioning
- **CI/CD ready** : Utilisable dans les pipelines

## 🏆 Résultat final

**Vous avez créé un package NPM professionnel qui :**

1. **S'installe** avec une commande
2. **Configure** automatiquement n'importe quel repo Git
3. **Fonctionne** immédiatement sans setup
4. **Génère** du code via des agents IA spécialisés
5. **Crée** des Pull Requests automatiquement

### 🚀 Pour commencer dès maintenant

```bash
# Dans n'importe quel projet Git
npx @ai-team/orchestrator install
git add . && git commit -m "🤖 Add AI Team" && git push

# Créer une issue de test
npx @ai-team/orchestrator demo --type frontend

# Attendre 2 minutes → Pull Request automatique ! 🎉
```

---

**🎊 Félicitations ! Vous avez un package NPM professionnel et distributable !**

*L'IA coding team est maintenant accessible à tous les développeurs du monde ! 🌍🤖* 