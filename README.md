# 🤖 AI Team Orchestrator

[![npm version](https://img.shields.io/npm/v/ai-team-orchestrator.svg)](https://www.npmjs.com/package/ai-team-orchestrator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)

> **Zero-Config AI coding team pour GitHub avec Together.ai** 🚀  
> Transformez vos issues GitHub en code fonctionnel automatiquement !

## 🚀 Installation rapide

```bash
# Installation globale
npm install -g ai-team-orchestrator

# Configuration de la clé API (assistant interactif)
ai-team setup-api

# Installation dans votre projet
cd votre-projet
ai-team install
```

## 📋 Prérequis

- **Node.js** 18+ et npm
- **Git** configuré
- **Compte Together.ai** (gratuit) pour l'API
- **Repository GitHub** (public ou privé)

## 🔑 Configuration API (Nouvelle approche intuitive !)

### Option 1: Assistant automatique (Recommandé)
```bash
ai-team setup-api
```
L'assistant vous guide étape par étape :
- ✅ Création de compte Together.ai
- ✅ Récupération de la clé API
- ✅ Configuration automatique
- ✅ Test de fonctionnement

### Option 2: Configuration manuelle
1. **Créez un compte gratuit sur [Together.ai](https://together.ai)**
2. **Obtenez votre clé API** :
   - Allez sur https://api.together.ai/settings/api-keys
   - Créez une nouvelle clé API
   - Copiez la clé (format alphanumérique)
3. **Configurez la clé** :
   ```bash
   # Créez un fichier .env à la racine de votre projet
   echo "TOGETHER_AI_API_KEY=votre-cle-api" > .env
   ```

### Vérification de la configuration
```bash
# Vérifier le statut de la clé API
ai-team setup-api --check

# Reconfigurer si nécessaire
ai-team setup-api
```

## 💻 Utilisation

### Méthode interactive (Recommandée)
```bash
ai-team create
```
Interface guidée pour :
- ✨ Sélectionner votre agent IA spécialisé
- 📝 Décrire votre tâche en détail
- 🎨 Choisir le style et les technologies
- 🚀 Lancer la génération automatique

### Méthode rapide
```bash
# Créer une démo frontend
ai-team demo frontend

# Créer une démo backend
ai-team demo backend

# Voir toutes les démos disponibles
ai-team demo --list
```

## 🤖 Agents IA disponibles

| Agent | Spécialité | Parfait pour |
|-------|------------|--------------|
| 🎨 **Frontend Specialist** | UI/UX, CSS, HTML | Landing pages, composants, animations |
| ⚙️ **Backend Specialist** | APIs, serveurs, BDD | REST APIs, authentification, CRUD |
| 🧪 **QA Engineer** | Tests, qualité | Tests unitaires, intégration, e2e |
| 🐛 **Bug Hunter** | Debug, fixes | Corrections de bugs, optimisation |
| 🏗️ **Code Architect** | Refactoring, structure | Amélioration du code, architecture |
| 🚀 **Full-Stack Developer** | Développement général | Fonctionnalités complètes, projets |

## 🔧 Commandes disponibles

```bash
# Configuration et installation
ai-team setup-api          # Assistant configuration API
ai-team install            # Installer AI Team dans le repo
ai-team status             # Vérifier l'installation

# Création de tâches
ai-team create             # Mode interactif complet
ai-team demo <type>        # Démos rapides

# Gestion et debug
ai-team agents             # Lister les agents disponibles
ai-team doctor             # Diagnostics automatiques
ai-team debug              # Debug avancé
ai-team fix                # Réparations automatiques

# Aide
ai-team --help            # Aide générale
ai-team <command> --help  # Aide spécifique
```

## ✨ Fonctionnalités

### 🎯 Ce que fait AI Team
- **Analyse intelligente** des issues GitHub avec Together.ai
- **Sélection automatique** de l'agent IA approprié
- **Génération de code** moderne et fonctionnel
- **Création automatique** de Pull Requests
- **Support multi-langages** (HTML, CSS, JS, Python, etc.)
- **Templates adaptatifs** selon le type de projet

### 🚀 Modèles IA utilisés
- **Classification** : `meta-llama/Llama-2-7b-chat-hf` (gratuit)
- **Génération de code** : `codellama/CodeLlama-7b-Instruct-hf` (gratuit)
- **API** : Together.ai (gratuite pour commencer)

## 🛠️ Résolution de problèmes

### Problèmes fréquents

**❌ Clé API invalide**
```bash
# Vérifier et reconfigurer
ai-team setup-api --check
ai-team setup-api
```

**❌ AI Team non installé**
```bash
# Installer dans le projet
ai-team install --force
```

**❌ Erreurs GitHub Actions**
```bash
# Diagnostics automatiques
ai-team doctor
ai-team debug
```

### Support et diagnostics
```bash
ai-team doctor    # Diagnostics complets
ai-team debug     # Informations de debug
ai-team fix       # Réparations automatiques
```

## 🎉 Exemple d'utilisation

1. **Configuration initiale** (une seule fois)
   ```bash
   npm install -g ai-team-orchestrator
   ai-team setup-api  # Assistant interactif
   ```

2. **Dans votre projet**
   ```bash
   cd mon-projet
   ai-team install
   ai-team create
   ```

3. **Créer une tâche**
   - Sélectionnez "🎨 Frontend Specialist"
   - Décrivez : "Create a modern landing page with hero section"
   - Choisissez le style "Moderne avec animations"
   - ✨ Magie ! Une PR est créée automatiquement

## 🌟 Pourquoi Together.ai ?

- ✅ **Gratuit** pour les modèles open source
- ✅ **Pas de limite stricte** comme OpenAI
- ✅ **Modèles Llama et CodeLlama** performants
- ✅ **API compatible** avec les standards
- ✅ **Idéal pour le développement** et l'apprentissage

## 📚 Documentation avancée

- [Guide d'installation détaillé](./INSTALLATION.md)
- [Configuration Together.ai](./TOGETHER_AI_SETUP.md)
- [Agents IA disponibles](#-agents-ia-disponibles)
- [Résolution de problèmes](#️-résolution-de-problèmes)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](CONTRIBUTING.md).

## 📄 Licence

MIT © AI Team Orchestrator

---

**🚀 Prêt à révolutionner votre workflow de développement ?**  
`npm install -g ai-team-orchestrator && ai-team setup-api`

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/Romjah/ai-team-orchestrator.git
cd ai-team-orchestrator

# Install dependencies
npm install

# Run locally
npm run setup

# Run tests
npm test

# Build for production
npm run build
```

## 📂 Project Structure

```
@ai-team/orchestrator/
├── bin/                    # CLI executables
│   ├── ai-team.js         # Main CLI
│   └── install.js         # Installation script
├── lib/                   # Core modules
│   ├── installer.js       # Installation logic
│   └── demo.js           # Demo issue creation
├── templates/             # GitHub workflow templates
│   └── .github/          # Workflow and script templates
├── test/                  # Test files
├── demo/                  # Demo examples
├── package.json          # Package configuration
└── README.md             # This file
```

## 🎯 Examples

### Frontend Development
```
Issue: "Create a responsive navbar with mobile menu"
→ Frontend Specialist generates HTML + CSS + JS
```

### Backend Development
```
Issue: "Build REST API for user authentication"
→ Backend Specialist generates Express.js server with routes
```

### Bug Fixing
```
Issue: "Bug: form validation not working"
→ Bug Hunter analyzes and fixes the issue
```

### Testing
```
Issue: "Add unit tests for login function"
→ QA Engineer creates comprehensive test suite
```

## 🔧 Configuration

### Environment Variables (Optional)

```bash
# For full configuration type only
HUGGINGFACE_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

### GitHub Permissions

The package automatically sets up the required permissions:
- Contents: write
- Issues: write
- Pull requests: write

## 🚨 Troubleshooting

### Installation Issues

```bash
# Check if you're in a Git repository
git status

# Verify GitHub CLI is installed (for demo issues)
gh --version

# Check AI Team status
ai-team status
```

### AI Team Not Responding

1. **Check GitHub Actions** is enabled in your repository
2. **Verify files** are in correct locations (`.github/workflows/`)
3. **Check issue keywords** match agent specializations
4. **Wait 2-3 minutes** for workflow execution

### Common Solutions

```bash
# Reinstall with force flag
ai-team install --force

# Check installation status
ai-team status

# Create test issue
ai-team demo --type frontend
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub Repository**: [Romjah/ai-team-orchestrator](https://github.com/Romjah/ai-team-orchestrator)
- **NPM Package**: [ai-team-orchestrator](https://www.npmjs.com/package/ai-team-orchestrator)
- **Documentation**: [GitHub Wiki](https://github.com/Romjah/ai-team-orchestrator/wiki)
- **Support**: [GitHub Issues](https://github.com/Romjah/ai-team-orchestrator/issues)

## 🙋 Support

- 📖 **Documentation**: Consultez notre [guide complet](GUIDE-FINAL-ZERO-CONFIG.md)
- 🐛 **Bug Reports**: [Créez une issue](https://github.com/Romjah/ai-team-orchestrator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Romjah/ai-team-orchestrator/discussions)
- 📧 **Email**: romain.jahier.pro@gmail.com

---

**🎉 Prêt à révolutionner votre workflow de développement ?**

```bash
npm install -g ai-team-orchestrator
ai-team setup-api
```

*Votre équipe IA de développement n'est qu'à une commande !* 🤖✨ 