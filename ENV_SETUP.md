# 📁 Configuration .env ultra-simple

## 🎉 **NOUVEAU dans v2.3.0 : Plus besoin de secrets GitHub !**

### ✅ **Révolution : Configuration locale avec fichier .env**

Fini les secrets GitHub complexes ! Configurez tout en local avec un simple fichier `.env`.

## 🚀 Installation en 30 secondes

```bash
# 1. Installation
npm install -g ai-team-orchestrator@2.3.0

# 2. Dans votre projet Git
cd votre-projet
ai-team setup-api  # ← Choix automatique du fichier .env

# 3. Installation des workflows
ai-team init

# 4. Test immédiat
ai-team issue "Test configuration .env" --type frontend
```

## 📁 **Fichier .env automatique**

La commande `ai-team setup-api` crée automatiquement :

```bash
# AI Team Orchestrator v2.3.0 - Configuration DeepSeek R1
# 🧠 Clés API pour l'IA la plus avancée

# Together.ai API Key pour DeepSeek R1 (OBLIGATOIRE)
TOGETHER_AI_API_KEY=votre-cle-together-ai

# GitHub Token pour les permissions étendues (OPTIONNEL)
GITHUB_TOKEN=ghp_votre_GITHUB_TOKEN

# 💡 Instructions:
# 1. Ajoutez .env à votre .gitignore pour la sécurité
# 2. Utilisez 'ai-team check' pour vérifier la configuration  
# 3. Utilisez 'ai-team init' pour installer les workflows
# 4. Créez des issues avec 'ai-team issue "titre" --type frontend'

# 🚀 AI Team Orchestrator - Propulsé par DeepSeek R1
```

## 🔧 **Avantages de la configuration .env**

| Aspect | Avant (Secrets GitHub) | Maintenant (.env) |
|--------|------------------------|-------------------|
| **Setup** | 5-10 minutes | 30 secondes |
| **Complexité** | Secrets, permissions, PAT | Un seul fichier |
| **Sécurité** | Secrets dans GitHub | Local + .gitignore |
| **Debug** | Difficile | Facile à vérifier |
| **Migration** | Complexe | Copier/coller |

## 🔍 **Détection automatique**

Les workflows GitHub détectent automatiquement :

```bash
# 1. Fichier .env local (PRIORITÉ)
TOGETHER_AI_API_KEY=xxx
GITHUB_TOKEN=xxx

# 2. Variables d'environnement système
export TOGETHER_AI_API_KEY=xxx

# 3. Secrets GitHub (fallback)
Repository → Settings → Secrets
```

## ⚡ **Workflow mis à jour**

Le workflow GitHub charge automatiquement le fichier `.env` :

```yaml
- name: 🧠 Run AI Team DeepSeek R1
  run: |
    # Charger le fichier .env s'il existe
    if [ -f ".env" ]; then
      echo "✅ Fichier .env détecté, chargement des variables..."
      export $(grep -v '^#' .env | xargs)
    fi
    
    # Vérifier la configuration
    if [ -z "$TOGETHER_AI_API_KEY" ]; then
      echo "❌ TOGETHER_AI_API_KEY non configuré!"
      echo "🔧 Option 1: Fichier .env (RECOMMANDÉ)"
      echo "🔧 Option 2: Secrets GitHub"
      exit 1
    fi
```

## 🔒 **Sécurité automatique**

### .gitignore automatique
```bash
# AI Team Orchestrator - Variables d'environnement
.env
```

### Protection des clés
- ✅ Fichier `.env` automatiquement ajouté au `.gitignore`
- ✅ Clés stockées localement uniquement
- ✅ Pas de transmission vers GitHub
- ✅ Contrôle total sur vos clés

## 🆚 **Migration depuis secrets GitHub**

### Si vous utilisez déjà les secrets GitHub :
```bash
# Nouvelle installation recommandée
ai-team setup-api  # Choisir fichier .env

# Ou migration manuelle
echo "TOGETHER_AI_API_KEY=votre-cle" > .env
echo "GITHUB_TOKEN=votre-token" >> .env
```

### Les deux méthodes fonctionnent !
- 📁 **Fichier .env** → Recommandé, plus simple
- 🔒 **Secrets GitHub** → Toujours supporté

## 🧪 **Test de configuration**

```bash
# Diagnostic complet
ai-team check

# Doit afficher :
# ✅ Clé API configurée (64 caractères)
# 🎯 Source: 📁 Fichier .env local (RECOMMANDÉ)
```

## 💡 **FAQ Configuration .env**

### **Q: Dois-je migrer vers .env ?**
**R:** Recommandé ! C'est plus simple et plus rapide.

### **Q: Les secrets GitHub fonctionnent encore ?**
**R:** Oui ! Backward compatible à 100%.

### **Q: Où est stocké le .env ?**
**R:** À la racine de votre projet, ajouté automatiquement au .gitignore.

### **Q: Token GitHub obligatoire ?**
**R:** Non ! Optionnel. GitHub fournit un token automatique avec permissions limitées.

### **Q: Comment voir ma configuration ?**
**R:** `ai-team check` vous dit tout !

## 🚀 **Exemple complet**

```bash
# Projet existant
cd mon-projet-github

# Configuration .env en 30 secondes
ai-team setup-api
# → Choisir "📁 Fichier .env local"
# → Entrer clé Together.ai
# → Entrer token GitHub (optionnel)

# Installation workflows
ai-team init

# Vérification
ai-team check
# → ✅ Tout vert !

# Test
ai-team issue "API REST moderne" --type backend
# → Workflow se déclenche
# → DeepSeek R1 génère le code
# → PR créée automatiquement
```

---

## 🎯 **Résultat : Configuration ultra-simple !**

**Avant :** 
1. Créer secrets GitHub
2. Configurer permissions
3. Gérer les tokens
4. Débugger les erreurs

**Maintenant :**
1. `ai-team setup-api`
2. C'est tout ! 🎉

**🧠 AI Team Orchestrator v2.3.0 - Configuration .env révolutionnaire !** 