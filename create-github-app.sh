#!/bin/bash

# 🚀 Script de création automatique GitHub App
# Usage: ./create-github-app.sh

clear
echo "🤖 AI Team Orchestrator - Création GitHub App"
echo "=============================================="
echo ""

# Vérification des prérequis
command -v npm >/dev/null 2>&1 || { echo "❌ npm requis mais non installé"; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "❌ npx requis mais non installé"; exit 1; }

echo "✅ Prérequis OK"
echo ""

# Variables
APP_NAME="AI Team Orchestrator $(whoami)"
GITHUB_APP_DIR="github-app"

echo "📂 Préparation du projet..."
cd "$GITHUB_APP_DIR"

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install --silent

echo ""
echo "🚀 Déploiement sur Vercel..."
echo "ℹ️  Suivez les instructions Vercel :"
echo "   1. ✅ Link to existing project? NO"
echo "   2. ✅ What's your project's name? ai-team-orchestrator"  
echo "   3. ✅ In which directory is your code located? ./"
echo ""

# Déploiement Vercel
npx vercel --yes

# Récupération de l'URL de déploiement
echo ""
echo "📝 Récupération de l'URL de déploiement..."
VERCEL_URL=$(npx vercel --prod 2>/dev/null | grep -o 'https://[^[:space:]]*')

if [ -z "$VERCEL_URL" ]; then
    echo "⚠️  Impossible de récupérer l'URL automatiquement"
    echo "📋 Rendez-vous sur votre dashboard Vercel pour récupérer l'URL"
    read -p "Entrez votre URL Vercel (ex: https://ai-team-orchestrator.vercel.app): " VERCEL_URL
fi

echo "✅ URL de l'app: $VERCEL_URL"
echo ""

# Instructions GitHub App
echo "🔧 CRÉATION DE LA GITHUB APP :"
echo "=============================="
echo ""
echo "1. 🌐 Ouvrez: https://github.com/settings/apps"
echo "2. 📝 Cliquez 'New GitHub App'"
echo "3. 📋 Remplissez :"
echo ""
echo "   App name: $APP_NAME"
echo "   Homepage URL: $VERCEL_URL"
echo "   Webhook URL: $VERCEL_URL/api/webhook"
echo ""
echo "   Permissions (Repository):"
echo "   ✅ Contents: Read & write"
echo "   ✅ Issues: Read & write"  
echo "   ✅ Pull requests: Read & write"
echo "   ✅ Metadata: Read"
echo ""
echo "4. 🎯 Cliquez 'Create GitHub App'"
echo ""

read -p "Appuyez sur Entrée une fois la GitHub App créée..."

echo ""
echo "🔑 CONFIGURATION DES SECRETS :"
echo "==============================="
echo ""
echo "1. 📋 Récupérez depuis votre GitHub App :"
echo "   - App ID (nombre en haut de la page)"
echo "   - Private Key (Generate & Download)"
echo ""

read -p "App ID: " GITHUB_APP_ID
echo ""

echo "2. 🔐 Générez votre Private Key :"
echo "   - Scrollez vers 'Private keys'"
echo "   - Cliquez 'Generate a private key'"
echo "   - Téléchargez le fichier .pem"
echo ""

read -p "Chemin vers le fichier .pem (ex: ~/Downloads/app.private-key.pem): " PEM_FILE

if [ -f "$PEM_FILE" ]; then
    PRIVATE_KEY=$(cat "$PEM_FILE")
    echo "✅ Private Key lu"
else
    echo "❌ Fichier .pem non trouvé"
    read -p "Collez votre Private Key: " PRIVATE_KEY
fi

echo ""
echo "3. 🎯 Installez l'app sur un repository :"
echo "   - Retournez sur la page de votre GitHub App"
echo "   - Cliquez 'Install App'"
echo "   - Choisissez un repository de test"
echo "   - Cliquez 'Install'"
echo ""

read -p "Installation ID (visible dans l'URL après installation): " INSTALLATION_ID

echo ""
echo "4. 🔗 Tokens API IA :"
read -p "Hugging Face Token (gratuit sur huggingface.co/settings/tokens): " HF_TOKEN
read -p "Groq API Key (optionnel, gratuit sur console.groq.com): " GROQ_TOKEN

echo ""
echo "📤 Configuration des variables Vercel..."

# Configuration des variables d'environnement Vercel
npx vercel env add GITHUB_APP_ID production <<< "$GITHUB_APP_ID"
npx vercel env add GITHUB_PRIVATE_KEY production <<< "$PRIVATE_KEY"
npx vercel env add GITHUB_INSTALLATION_ID production <<< "$INSTALLATION_ID"
npx vercel env add HUGGINGFACE_TOKEN production <<< "$HF_TOKEN"

if [ -n "$GROQ_TOKEN" ]; then
    npx vercel env add GROQ_API_KEY production <<< "$GROQ_TOKEN"
fi

echo ""
echo "🚀 Redéploiement avec les nouvelles variables..."
npx vercel --prod

echo ""
echo "🎉 INSTALLATION TERMINÉE !"
echo "========================="
echo ""
echo "🔗 URL de votre AI Team: $VERCEL_URL"
echo ""
echo "📋 Pour utiliser :"
echo "1. Allez sur n'importe quel repo GitHub"
echo "2. Ajoutez ce bookmarklet à vos favoris :"
echo ""
echo "javascript:(function(){window.open('$VERCEL_URL?repository='+window.location.pathname.split('/').slice(1,3).join('/'))})()"
echo ""
echo "3. Cliquez le bookmarklet depuis un repo"
echo "4. Décrivez votre tâche et choisissez votre agent"
echo "5. Regardez l'IA créer une Pull Request !"
echo ""
echo "🤖 Votre équipe d'agents IA est opérationnelle !"

cd .. 