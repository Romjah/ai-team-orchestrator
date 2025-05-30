# 🤖 AI Team Orchestrator v2.5.0

[![npm version](https://img.shields.io/npm/v/ai-team-orchestrator.svg)](https://www.npmjs.com/package/ai-team-orchestrator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Template System](https://img.shields.io/badge/Template%20System-Advanced-blue.svg)](./TEMPLATES_SYSTEM.md)

> **🧠 Révolution IA : Templates intelligents + DeepSeek R1 !**  
> **NOUVEAU v2.5.0 :** Système de templates performants qui s'adapte à votre projet !

## ⚡ Installation ultra-rapide

```bash
# Installation globale
npm install -g ai-team-orchestrator

# Initialisation du projet (NOUVEAU!)
cd votre-projet-git
ai-team init

# Configuration API (30 secondes)
ai-team setup-api

# Utilisation immédiate avec templates intelligents
ai-team issue "Landing page moderne" --type frontend
```

## 🚀 **NOUVEAU v2.5.0 : Templates Performants !**

### ✅ **Système de templates avancés**
- 🎯 **Templates spécialisés** par type de tâche (frontend, backend, testing, etc.)
- 🔍 **Analyse intelligente** du contexte projet (package.json, structure, stack)
- 📊 **Critères d'acceptation** précis et mesurables
- 🛠️ **Suggestions technologiques** adaptées à votre stack existant

### 🧠 **Détection automatique du contexte**
```bash
# Le système analyse automatiquement votre projet :
# ✅ React + TypeScript détecté → Templates frontend optimisés
# ✅ Express + Prisma détecté → Templates backend spécialisés
# ✅ Jest + Cypress détecté → Stratégies de test appropriées
```

## 🎨 **Templates Disponibles (NOUVEAU !)**

### 🎨 **Frontend Template**
```bash
ai-team issue "Dashboard analytics moderne" --type frontend
```
**Génère automatiquement :**
- Architecture des composants React/Vue/Angular
- Gestion d'état (Redux, Zustand, Pinia) selon votre stack
- Critères de performance Web Vitals
- Tests d'accessibilité WCAG 2.1

### ⚙️ **Backend Template**
```bash
ai-team issue "API REST avec authentification JWT" --type backend
```
**Génère automatiquement :**
- Architecture hexagonale/clean architecture
- Stratégies de sécurité (OWASP, JWT, validation)
- Optimisations base de données
- Monitoring et observabilité

### 🧪 **Testing Template**
```bash
ai-team issue "Tests E2E complets avec Cypress" --type testing
```
**Génère automatiquement :**
- Stratégie de test complète (unitaire, intégration, E2E)
- Configuration CI/CD avec tests automatisés
- Métriques de qualité et coverage

### 🐛 **Bug Fix Template**
```bash
ai-team issue "Fix memory leak dans le component Table" --type bug_fix
```
**Génère automatiquement :**
- Plan d'investigation structuré
- Méthodologie de reproduction
- Tests de régression préventifs

### 🏗️ **Refactor Template**
```bash
ai-team issue "Refactor service utilisateurs en modules" --type refactor
```
**Génère automatiquement :**
- Analyse des code smells existants
- Plan de refactoring incrémental
- Métriques de qualité avant/après

## 💡 **NOUVEAU : Configuration .env ultra-simple !**

### ✅ **Plus besoin de secrets GitHub complexes !**
- 📁 **Fichier .env local** → Configuration automatique
- 🔧 **Zero secrets GitHub** → Tout se fait en local  
- ⚡ **Setup en 30 secondes** → Plus de complexité
- 🔒 **Sécurisé** → Clés en local dans .gitignore

### 🚀 **Exemple de fichier .env créé automatiquement :**
```bash
# AI Team Orchestrator v2.5.0 - Configuration DeepSeek R1
TOGETHER_AI_API_KEY=your-key-here
GITHUB_TOKEN=ghp_your-token-here  # Optionnel
```

## 🧠 **DeepSeek R1 - Révolution IA !**

### ✅ **L'IA la plus intelligente disponible gratuitement**
- 🔥 **DeepSeek R1** - Modèle de dernière génération
- 🆓 **Gratuit** via Together.ai
- ⚡ **Plus intelligent** que GPT-4 sur le code
- 🚀 **Plus rapide** que tous les autres modèles
- 🎯 **Templates optimisés** pour DeepSeek R1

## 🔥 Utilisation ultra-simplifiée

### **Templates intelligents avec détection automatique**
```bash
# Frontend (détecte React/Vue/Angular automatiquement)
ai-team issue "Landing page avec animations" --type frontend

# Backend (s'adapte à Express/Fastify/NestJS)
ai-team issue "API REST avec authentification" --type backend

# Testing (utilise vos frameworks existants)
ai-team issue "Tests E2E complets" --type testing

# Bug fixes (analyse le contexte d'erreur)
ai-team issue "Fix memory leak images" --type bug_fix

# Refactor (détecte les patterns à améliorer)
ai-team issue "Refactor auth service" --type refactor
```

### **Mode création rapide**
```bash
# Description manuelle
ai-team create "Dashboard analytics" --type frontend

# Avec création automatique d'issue
ai-team create "Microservice notifications" --auto-issue
```

## 🔧 Commandes ultra-rapides

| Commande | Action | Temps |
|----------|--------|-------|
| `ai-team init` | Installation workflows GitHub | **10 sec** |
| `ai-team issue "titre"` | Issue GitHub + Description IA avec templates | **5 sec** |
| `ai-team create "desc"` | Préparation rapide | **3 sec** |
| `ai-team setup-api` | Configuration complète | **30 sec** |
| `ai-team check` | Diagnostic système complet | **15 sec** |

## 🤖 Templates Intelligents (NOUVEAU !)

Sélection automatique basée sur les mots-clés et l'analyse de projet :

- **`frontend`** → 🎨 UI/UX, animations, responsive + détection React/Vue/Angular
- **`backend`** → ⚙️ APIs, microservices, databases + détection Express/Fastify
- **`testing`** → 🧪 Tests automatisés, E2E, performance + frameworks existants
- **`bug_fix`** → 🐛 Debugging, optimisation, fixes + analyse contextuelle
- **`refactor`** → 🏗️ Code quality, architecture + patterns détectés
- **`feature`** → 🚀 Nouvelles fonctionnalités + stack adapté

## 📊 **Amélioration des Résultats v2.5.0**

### **Avant (prompt générique) :**
```markdown
## Objectif
Landing page moderne

## Description
Tâche de type frontend à implémenter.
```

### **Après (template intelligent) :**
```markdown
## 🎯 Objectif
Landing page moderne avec animations

## 📋 Architecture Frontend
- Structure des composants React avec TypeScript (détecté)
- Gestion d'état locale (useState/useReducer)
- Routing avec React Router pour navigation

## 🎨 Interface Utilisateur
- Design system avec Tailwind CSS (détecté)
- Responsive design mobile-first
- Accessibilité WCAG 2.1 AA
- Animations avec Framer Motion

## ⚡ Critères de Performance
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Bundle size optimisé avec code splitting

## ✅ Critères d'Acceptation
- [ ] Interface responsive (mobile, tablet, desktop)
- [ ] Accessibilité WCAG 2.1 AA validée
- [ ] Performance Web Vitals dans les seuils

## 🤖 Métadonnées
- Template: frontend | Complexité: medium
- Technologies détectées: react, typescript, tailwindcss
```

## 🎯 Exemples avec Templates Performants

### **Projets web modernes**
```bash
ai-team issue "SPA React avec TypeScript et tests" --type frontend
# → Détecte React, génère architecture complète avec TypeScript
ai-team issue "API GraphQL avec authentification" --type backend
# → Génère schema GraphQL, resolvers, auth middleware
```

### **Applications mobiles**
```bash
ai-team issue "App React Native avec navigation" --type frontend
# → Architecture mobile-first, navigation stack
ai-team issue "Backend mobile avec push notifications" --type backend
# → APIs mobile, intégration FCM/APNS
```

### **Microservices**
```bash
ai-team issue "Microservice de notifications en temps réel" --type backend
# → Event-driven architecture, WebSockets
ai-team issue "Tests de charge pour microservices" --type testing
# → K6 scripts, métriques distribuées
```

## 🚀 Workflow automatique DeepSeek R1 + Templates

1. **Créez l'issue** → `ai-team issue "votre demande"`
2. **Analyse du projet** → Détection stack, technologies, structure
3. **Template intelligent** → Sélection du template optimisé
4. **DeepSeek R1 analyse** → Compréhension intelligente avec contexte
5. **Description générée** → Précise, technique et adaptée
6. **GitHub Actions déclenché** → Automatiquement
7. **Code généré** → Qualité professionnelle avec stack détecté
8. **Pull Request créée** → Prête à review

**Temps total: ~2 minutes** ⏱️ **Qualité: +300%** 📈

## 🧪 **Test du système (NOUVEAU !)**

```bash
# Testez le système de templates
node demo/test-templates.js

# Diagnostic complet
ai-team check

# Test d'un template spécifique
ai-team issue "Test landing page" --type frontend --verbose
```

## 📚 **Documentation Complète**

- 📖 **[Guide des Templates](./TEMPLATES_SYSTEM.md)** - Documentation complète du système
- 🚀 **[Guide de Démarrage Rapide](./QUICK_START.md)** - Setup en 5 minutes
- ⚙️ **[Configuration Avancée](./CONFIGURATION.md)** - Personnalisation
- 🐞 **[Troubleshooting](./ENV_SETUP.md)** - Résolution de problèmes

## 💡 Tips pour vitesse maximale

### **Aliases bash magiques**
```bash
# Ajoutez à votre .bashrc/.zshrc
alias ait="ai-team issue"
alias aif="ai-team issue --type frontend"
alias aib="ai-team issue --type backend"
alias aitf="ai-team issue --type bug_fix"
alias aitr="ai-team issue --type refactor"

# Utilisation instantanée avec templates
aif "Portfolio moderne"        # → Template frontend intelligent
aib "API e-commerce"          # → Template backend avec sécurité
aitf "Memory leak fix"        # → Template bug fix avec investigation
aitr "Clean up auth service"  # → Template refactor avec métriques
```

### **Templates pro avec détection automatique**
```bash
# Startup tech stack (détection auto React/Next.js)
aif "Landing page SaaS avec pricing dynamique"
aib "API SaaS avec billing Stripe et analytics"

# E-commerce complet (adaptation au stack existant)
aif "Boutique avec panier temps réel et paiements"
aib "Backend e-commerce avec inventory management"

# Applications d'entreprise (patterns enterprise détectés)
aif "Dashboard enterprise avec metrics temps réel"
aib "Microservices avec monitoring et tracing"
```

## 🧠 Pourquoi Templates + DeepSeek R1 ?

- **🔥 Plus intelligent** - Templates spécialisés + IA de pointe
- **⚡ Plus rapide** - Contexte projet automatique
- **🎯 Plus précis** - Critères mesurables et technologies adaptées
- **🆓 Gratuit** - Via Together.ai (pas de limite stricte)
- **🌟 Évolutif** - Templates qui s'améliorent avec votre projet

## 🔗 Intégrations zero-config

- **GitHub** → Issues et PRs automatiques avec templates
- **Together.ai** → DeepSeek R1 gratuit avec prompts optimisés
- **GitHub Actions** → Workflows pré-configurés
- **Project Analysis** → Détection automatique du stack

## ❓ Support ultra-rapide

- **Aide** → `ai-team --help`
- **Configuration** → `ai-team setup-api`
- **Diagnostic** → `ai-team check`
- **Templates** → Voir [TEMPLATES_SYSTEM.md](./TEMPLATES_SYSTEM.md)

---

**🧠 AI Team Orchestrator v2.5.0 - Templates Intelligents + DeepSeek R1**

*L'IA la plus avancée au service de votre productivité avec des templates qui s'adaptent !* 🚀 