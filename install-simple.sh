#!/bin/bash

# 🚀 Installation AI Team Orchestrator - VERSION ULTRA SIMPLE
# Usage: ./install-simple.sh

clear
echo "🤖 AI Team Orchestrator - Installation Express"
echo "=============================================="
echo ""

# Demande le chemin du repo
echo "📂 Dans quel repository veux-tu installer l'AI Team ?"
echo "(Appuie sur Entrée pour le répertoire actuel)"
read -p "Chemin du repo: " REPO_PATH

# Utilise le répertoire actuel si rien n'est saisi
if [ -z "$REPO_PATH" ]; then
    REPO_PATH=$(pwd)
fi

echo ""
echo "📋 Installation dans: $REPO_PATH"
echo ""

# Copie les fichiers essentiels
echo "✅ Copie des fichiers..."
mkdir -p "$REPO_PATH/.github/workflows"
mkdir -p "$REPO_PATH/.github/scripts"

cp .github/workflows/ai-team-orchestrator.yml "$REPO_PATH/.github/workflows/"
cp .github/scripts/* "$REPO_PATH/.github/scripts/"

echo "✅ Installation terminée !"
echo ""
echo "🔑 PROCHAINES ÉTAPES :"
echo "===================="
echo ""
echo "1. 📤 Push les fichiers sur GitHub :"
echo "   git add .github"
echo "   git commit -m 'Add AI Team'"
echo "   git push"
echo ""
echo "2. 🔐 Configure les secrets dans ton repo GitHub :"
echo "   → Va dans Settings > Secrets and variables > Actions"
echo "   → Ajoute: HUGGINGFACE_TOKEN (gratuit sur huggingface.co)"
echo ""
echo "3. ✅ Active les permissions :"
echo "   → Settings > Actions > General"
echo "   → ✅ Read and write permissions"
echo "   → ✅ Allow GitHub Actions to create pull requests"
echo ""
echo "4. 🎯 Teste avec une issue :"
echo "   → Crée une issue avec le label 'frontend' ou 'backend'"
echo "   → Décris ce que tu veux coder"
echo "   → Regarde l'IA créer une PR !"
echo ""
echo "🎉 C'est tout ! Ton équipe IA est prête !" 