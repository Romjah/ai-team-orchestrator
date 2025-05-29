#!/bin/bash

# 🚀 AI Team Orchestrator - Script d'installation automatique
# Usage: ./setup.sh [TARGET_REPO_PATH]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🤖 AI Team Orchestrator - Installation${NC}"
echo "=========================================="

# Vérifie les arguments
TARGET_REPO=${1:-$(pwd)}

if [ ! -d "$TARGET_REPO" ]; then
    echo -e "${RED}❌ Le répertoire cible n'existe pas: $TARGET_REPO${NC}"
    exit 1
fi

echo -e "${YELLOW}📂 Répertoire cible: $TARGET_REPO${NC}"

# Vérifie si c'est un repo Git
if [ ! -d "$TARGET_REPO/.git" ]; then
    echo -e "${YELLOW}⚠️ Le répertoire n'est pas un repository Git.${NC}"
    read -p "Voulez-vous l'initialiser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd "$TARGET_REPO"
        git init
        echo -e "${GREEN}✅ Repository Git initialisé${NC}"
    else
        echo -e "${RED}❌ Installation annulée${NC}"
        exit 1
    fi
fi

# Copie les fichiers GitHub Actions
echo -e "${YELLOW}📋 Copie des fichiers GitHub Actions...${NC}"

mkdir -p "$TARGET_REPO/.github/workflows"
mkdir -p "$TARGET_REPO/.github/scripts"

# Copie le workflow principal
cp ".github/workflows/ai-team-orchestrator.yml" "$TARGET_REPO/.github/workflows/"
echo -e "${GREEN}✅ Workflow copié${NC}"

# Copie les scripts Python
cp ".github/scripts/"* "$TARGET_REPO/.github/scripts/"
echo -e "${GREEN}✅ Scripts Python copiés${NC}"

# Rend les scripts exécutables
chmod +x "$TARGET_REPO/.github/scripts/"*.py

# Vérifie les permissions GitHub Actions
echo -e "${YELLOW}🔐 Configuration des permissions GitHub...${NC}"

cat << 'EOF' > "$TARGET_REPO/.github/workflows/permissions-check.yml"
name: Check Permissions
on:
  workflow_dispatch:
jobs:
  check:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
    steps:
      - run: echo "Permissions configurées ✅"
EOF

echo -e "${GREEN}✅ Vérificateur de permissions ajouté${NC}"

# Création du fichier de configuration
echo -e "${YELLOW}⚙️ Création de la configuration...${NC}"

cat << 'EOF' > "$TARGET_REPO/.ai-team-config.yml"
# Configuration AI Team Orchestrator
ai_team:
  # Agents activés
  enabled_agents:
    - frontend
    - backend
    - testing
    - refactor
    - fullstack
    - bugfix

  # Modèles préférés par provider
  preferred_models:
    huggingface: "codellama/CodeLlama-7b-Instruct-hf"
    groq: "deepseek-coder"

  # Répertoires par défaut
  directories:
    frontend: "src"
    backend: "src"
    tests: "tests"
    styles: "src/styles"

  # Auto-création de PR
  auto_pr: true

  # Exécution automatique des tests
  run_tests: true

  # Labels GitHub pour classification automatique
  labels:
    bug: "bugfix"
    feature: "fullstack"
    frontend: "frontend"
    backend: "backend"
    refactor: "refactor"
    testing: "testing"
EOF

echo -e "${GREEN}✅ Configuration créée${NC}"

# Crée le fichier d'exemple d'issue
cat << 'EOF' > "$TARGET_REPO/.github/ISSUE_TEMPLATE/ai-task.md"
---
name: 🤖 Tâche pour l'équipe IA
about: Créer une tâche à automatiser par l'équipe d'agents IA
title: "[AI-TASK] "
labels: ["ai-task"]
assignees: []
---

## 📋 Description de la tâche

<!-- Décrivez clairement ce que vous voulez que l'IA implémente -->

## 🎯 Résultat attendu

<!-- Expliquez le résultat final souhaité -->

## 🏷️ Type de tâche

<!-- Cochez la case appropriée -->
- [ ] 🐛 Correction de bug
- [ ] ✨ Nouvelle fonctionnalité
- [ ] 🎨 Frontend/UI
- [ ] ⚙️ Backend/API
- [ ] 🧪 Tests
- [ ] 🔄 Refactoring

## 📁 Zones affectées

<!-- Indiquez les parties du code concernées -->
- [ ] Frontend
- [ ] Backend
- [ ] Base de données
- [ ] Tests
- [ ] Configuration

## 🔧 Détails techniques

<!-- Ajoutez des spécifications techniques si nécessaire -->

---
*Cette issue sera traitée automatiquement par l'équipe d'agents IA*
EOF

mkdir -p "$TARGET_REPO/.github/ISSUE_TEMPLATE"
echo -e "${GREEN}✅ Template d'issue créé${NC}"

# Instructions pour les secrets
echo ""
echo -e "${YELLOW}🔑 CONFIGURATION DES SECRETS REQUISE${NC}"
echo "=========================================="
echo ""
echo "Pour finaliser l'installation, configurez les secrets dans votre repository GitHub :"
echo ""
echo "1. Allez dans Settings > Secrets and variables > Actions"
echo "2. Ajoutez AU MOINS UN de ces secrets :"
echo ""
echo "   HUGGINGFACE_TOKEN (Recommandé)"
echo "   - Créez un compte sur https://huggingface.co"
echo "   - Générez un token d'accès (Read permissions)"
echo ""
echo "   GROQ_API_KEY (Plus rapide)"
echo "   - Créez un compte sur https://console.groq.com"
echo "   - Générez une clé API gratuite"
echo ""
echo "3. Activez les permissions dans Settings > Actions > General :"
echo "   ✅ Read and write permissions"
echo "   ✅ Allow GitHub Actions to create and approve pull requests"
echo ""

# Test de l'installation
echo -e "${YELLOW}🧪 Test de l'installation...${NC}"

if [ -f "$TARGET_REPO/.github/workflows/ai-team-orchestrator.yml" ] && \
   [ -f "$TARGET_REPO/.github/scripts/repo_analyzer.py" ] && \
   [ -f "$TARGET_REPO/.github/scripts/agent_orchestrator.py" ] && \
   [ -f "$TARGET_REPO/.github/scripts/code_executor.py" ]; then
    echo -e "${GREEN}✅ Installation réussie !${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'installation${NC}"
    exit 1
fi

# Commit automatique si demandé
echo ""
read -p "Voulez-vous commiter ces changements automatiquement? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$TARGET_REPO"
    git add .github/ .ai-team-config.yml
    git commit -m "🤖 Ajouter AI Team Orchestrator

- Workflow GitHub Actions configuré
- Équipe d'agents IA spécialisés
- Configuration et templates ajoutés
- Prêt pour l'automatisation du code"
    
    echo -e "${GREEN}✅ Changements committés${NC}"
    
    # Push si une remote existe
    if git remote get-url origin >/dev/null 2>&1; then
        read -p "Voulez-vous pusher vers origin? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push
            echo -e "${GREEN}✅ Changements pushés${NC}"
        fi
    fi
fi

echo ""
echo -e "${GREEN}🎉 Installation terminée !${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes :${NC}"
echo "1. Configurez les secrets GitHub (voir instructions ci-dessus)"
echo "2. Créez une issue avec le label 'ai-task'"
echo "3. Regardez la magie opérer ! ✨"
echo ""
echo -e "${GREEN}Happy coding with AI! 🤖${NC}" 