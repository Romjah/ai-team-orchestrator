#!/bin/bash

# 🤖 AI Team Zero-Config Installation
# Installation sans aucune configuration manuelle requise

set -e

echo "🚀 Installation AI Team Zero-Config"
echo "=================================="

# Vérification des prérequis
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé"
    exit 1
fi

# Configuration automatique
REPO_URL="https://github.com/votre-username/ai-team-orchestrator"

# Détection du répertoire du projet
if [ -d ".git" ]; then
    echo "✅ Répertoire Git détecté"
    PROJECT_DIR=$(pwd)
else
    echo "❓ Voulez-vous initialiser un nouveau dépôt Git ? (y/n)"
    read -r INIT_GIT
    if [ "$INIT_GIT" = "y" ] || [ "$INIT_GIT" = "Y" ]; then
        git init
        echo "✅ Dépôt Git initialisé"
    fi
    PROJECT_DIR=$(pwd)
fi

echo "📁 Installation dans: $PROJECT_DIR"

# Création de la structure
echo "📂 Création de la structure des fichiers..."

# Création du répertoire .github/workflows
mkdir -p .github/workflows
mkdir -p .github/scripts

# Copie du workflow (si ce script est dans le répertoire source)
if [ -f ".github/workflows/ai-team-zero-config.yml" ]; then
    echo "✅ Workflow déjà présent"
else
    echo "📥 Création du workflow..."
    cat > .github/workflows/ai-team-zero-config.yml << 'EOF'
name: 🤖 AI Team Zero-Config

on:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created]
  workflow_dispatch:
    inputs:
      task_description:
        description: 'Description de la tâche à automatiser'
        required: true
        type: string

jobs:
  ai-coding:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
    
    steps:
    - name: 📥 Checkout repository
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        token: ${{ secrets.GITHUB_TOKEN }}

    - name: 🐍 Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'

    - name: 🔍 Analyze Task
      id: analyze
      run: python3 .github/scripts/zero_config_generator.py
      env:
        ACTION: 'analyze'
        GITHUB_EVENT_NAME: ${{ github.event_name }}
        ISSUE_TITLE: ${{ github.event.issue.title }}
        ISSUE_BODY: ${{ github.event.issue.body }}
        COMMENT_BODY: ${{ github.event.comment.body }}
        MANUAL_TASK: ${{ github.event.inputs.task_description }}

    - name: 🤖 Generate Code
      id: generate
      run: python3 .github/scripts/zero_config_generator.py
      env:
        ACTION: 'generate'
        TASK: ${{ steps.analyze.outputs.task }}
        AGENT: ${{ steps.analyze.outputs.agent }}
        TASK_TYPE: ${{ steps.analyze.outputs.task_type }}

    - name: 💻 Apply Generated Code
      id: apply
      run: python3 .github/scripts/zero_config_generator.py
      env:
        ACTION: 'apply'

    - name: 📝 Create Pull Request
      if: steps.apply.outputs.changes_made == 'true'
      uses: peter-evans/create-pull-request@v5
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        commit-message: |
          🤖 Code automatique généré par AI Team
          
          Agent: ${{ steps.analyze.outputs.agent }}
          Type: ${{ steps.analyze.outputs.task_type }}
        title: "🤖 [AI Team] ${{ steps.analyze.outputs.task_summary }}"
        body: |
          ## 🤖 Pull Request générée automatiquement
          
          **Agent IA utilisé:** ${{ steps.analyze.outputs.agent }}
          **Type de tâche:** ${{ steps.analyze.outputs.task_type }}
          
          ### 📋 Tâche demandée
          ${{ steps.analyze.outputs.task }}
          
          ### 📁 Fichiers créés
          ${{ steps.apply.outputs.files_created }}
          
          ### ✨ Fonctionnalités
          - Code généré automatiquement par IA
          - Tests inclus selon le type de tâche
          - Prêt à l'emploi
          
          ---
          *Généré par AI Team Orchestrator - Zero Config*
          
          **🎯 Aucune configuration manuelle requise !**
        branch: ai-team/auto-${{ github.run_number }}
        delete-branch: true

    - name: 📊 Update Issue Status
      if: github.event_name == 'issues' || github.event_name == 'issue_comment'
      uses: actions/github-script@v7
      with:
        script: |
          const issueNumber = context.issue.number;
          const success = '${{ steps.apply.outputs.changes_made }}' === 'true';
          
          const comment = success ? 
            `🎉 **AI Team a traité votre demande !**
            
            ✅ **Pull Request créée automatiquement**
            🤖 **Agent utilisé:** ${{ steps.analyze.outputs.agent }}
            📁 **Fichiers créés:** ${{ steps.apply.outputs.files_created }}
            
            **🔥 Aucune configuration manuelle nécessaire !**
            
            La PR contient du code prêt à l'emploi généré par notre équipe d'IA.` :
            `⚠️ **Aucun code généré**
            
            L'IA n'a pas pu traiter cette demande automatiquement.
            Essayez avec une description plus précise.`;
          
          github.rest.issues.createComment({
            issue_number: issueNumber,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: comment
          });
EOF
fi

# Copie du générateur Python
if [ -f ".github/scripts/zero_config_generator.py" ]; then
    echo "✅ Générateur Python déjà présent"
else
    echo "📥 Création du générateur Python..."
    
    # Copie du générateur depuis le répertoire source si disponible
    if [ -f ".github/scripts/zero_config_generator.py" ]; then
        cp .github/scripts/zero_config_generator.py .github/scripts/zero_config_generator.py
        echo "✅ Générateur Python copié"
    else
        echo "⚠️ Le générateur Python n'a pas été trouvé"
        echo "🔗 Téléchargez-le depuis : https://raw.githubusercontent.com/votre-repo/ai-team-orchestrator/main/.github/scripts/zero_config_generator.py"
        echo "📂 Et placez-le dans .github/scripts/"
    fi
    
    chmod +x .github/scripts/zero_config_generator.py 2>/dev/null || true
fi

# Création du README automatique
echo "📝 Création du README..."
cat > README-AI-TEAM.md << 'EOF'
# 🤖 AI Team Zero-Config

## ✨ Installation terminée !

Votre dépôt est maintenant équipé d'une équipe d'IA automatique.

### 🎯 Aucune configuration requise !

- ❌ Pas de secrets à configurer
- ❌ Pas de tokens API à ajouter  
- ❌ Pas de permissions à ajuster
- ✅ Tout fonctionne automatiquement avec GitHub Actions

### 🚀 Comment utiliser

#### Méthode 1: Issues GitHub
```
1. Créez une issue avec votre demande
2. L'IA analyse automatiquement
3. Une Pull Request est créée avec le code
```

#### Méthode 2: Commentaires
```
1. Commentez une issue existante
2. L'IA traite le commentaire
3. Code généré automatiquement
```

#### Méthode 3: Déclenchement manuel
```
1. Allez dans Actions > AI Team Zero-Config
2. Cliquez "Run workflow"
3. Entrez votre description de tâche
```

### 🤖 Agents disponibles

L'IA sélectionne automatiquement l'agent selon vos mots-clés :

- **Frontend Specialist** : ui, css, html, component
- **Backend Specialist** : api, server, database
- **Bug Hunter** : bug, fix, error, problème
- **QA Engineer** : test, testing, spec
- **Code Architect** : refactor, optimize, clean
- **Full-Stack Developer** : tout le reste

### 📋 Exemples de demandes

```
"Créer une page d'accueil moderne avec CSS"
→ Frontend Specialist

"Développer une API REST pour les utilisateurs" 
→ Backend Specialist

"Ajouter des tests pour la fonction login"
→ QA Engineer

"Corriger le bug dans le formulaire"
→ Bug Hunter
```

### 🔥 Avantages

- **100% Gratuit** : Utilise GitHub Actions (2000 min/mois gratuits)
- **Zero Config** : Aucune configuration manuelle
- **Multi-langages** : JavaScript, Python, HTML, CSS, etc.
- **Auto Pull Request** : Code prêt à merger
- **Smart Agents** : Sélection automatique de l'expert

### 🎯 Test rapide

Créez une issue avec le titre :
```
Créer une page web avec un bouton interactif
```

L'IA va automatiquement :
1. Détecter que c'est du frontend
2. Assigner le Frontend Specialist
3. Générer HTML + CSS + JS complets
4. Créer une Pull Request

---

*🤖 Votre équipe d'IA est prête !*
EOF

# Finalisation
echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📋 Étapes suivantes :"
echo "1. Copiez le fichier zero_config_generator.py dans .github/scripts/"
echo "2. Commitez les fichiers :"
echo "   git add ."
echo "   git commit -m '🤖 Add AI Team Zero-Config'"
echo "   git push"
echo ""
echo "3. Testez en créant une issue avec :"
echo "   'Créer une page web interactive'"
echo ""
echo "🔥 Aucune autre configuration nécessaire !"
echo ""

# Affichage des fichiers créés
echo "📁 Fichiers créés :"
echo "   .github/workflows/ai-team-zero-config.yml"
echo "   .github/scripts/ (répertoire)"
echo "   README-AI-TEAM.md"
echo ""

# Instructions pour GitHub
echo "💡 Pour activer sur GitHub :"
echo "1. Assurez-vous que GitHub Actions est activé"
echo "2. Les permissions par défaut sont suffisantes"
echo "3. Créez votre première issue pour tester !"
echo ""
echo "✅ Installation Zero-Config terminée !" 