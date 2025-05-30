# 🚀 AI Team Orchestrator - Démarrage Ultra-Rapide

## ⚡ Installation en 3 étapes (2 minutes)

### 1️⃣ **Installation du package**
```bash
npm install -g ai-team-orchestrator@latest
```

### 2️⃣ **Configuration locale (.env) - Pour le CLI**
```bash
# Dans votre projet Git
ai-team setup-api
```
→ Choisir "📁 Fichier .env local"  
→ Entrer votre clé Together.ai  
→ Entrer votre token GitHub (optionnel)

### 3️⃣ **Installation des workflows GitHub**
```bash
ai-team init
```

## ✅ **C'est prêt ! Test immédiat**
```bash
ai-team issue "Landing page moderne" --type frontend
```

---

## 🔑 **Configuration des clés API**

### **📱 LOCAL (CLI) - Fichier .env**
Pour utiliser les commandes `ai-team issue`, `ai-team create`

#### **Together.ai (obligatoire)**
1. 🌐 **Créer un compte:** https://together.ai
2. 🔑 **Générer une clé:** https://api.together.ai/settings/api-keys
3. 📝 **Nom:** "AI Team DeepSeek R1"
4. 💾 **Copier la clé**

#### **GitHub Token (optionnel mais recommandé)**
1. 🌐 **Créer un token:** https://github.com/settings/tokens
2. 🔑 **"Generate new token (classic)"**
3. 📝 **Permissions:** `repo` + `workflow`
4. 💾 **Copier le token**

### **☁️ GITHUB ACTIONS - Secrets**
Pour que les workflows génèrent automatiquement le code

#### **TOGETHER_AI_API_KEY (obligatoire)**
```
Repository → Settings → Secrets and variables → Actions
→ New repository secret
→ Name: TOGETHER_AI_API_KEY  
→ Value: votre-cle-together-ai
```

#### **GITHUB_TOKEN (automatique)**
✅ **Fourni automatiquement par GitHub !** Aucune action requise.

---

## 📁 **Fichier .env automatique**

La commande `ai-team setup-api` crée (LOCAL uniquement) :

```bash
# AI Team Orchestrator v2.3.4 - Configuration DeepSeek R1
TOGETHER_AI_API_KEY=votre-cle-together-ai
GITHUB_TOKEN=ghp_votre-token-github  # Optionnel
```

⚠️ **Important:** Ce fichier est LOCAL uniquement, jamais envoyé à GitHub (sécurité).

---

## 🔄 **Flux complet**

### **Configuration unique :**
```bash
# 1. Local (.env)
ai-team setup-api    # Crée le .env pour le CLI
ai-team init         # Installe les workflows

# 2. GitHub (une seule fois)
# Repository → Settings → Secrets → Actions  
# TOGETHER_AI_API_KEY = votre-cle
```

### **Usage quotidien :**
```bash
# CLI local (utilise .env)
ai-team issue "API REST moderne" --type backend

# ↓ Issue créée sur GitHub
# ↓ Workflow GitHub Actions se déclenche (utilise secrets)
# ↓ DeepSeek R1 génère le code  
# ↓ Pull Request créée automatiquement
```

---

## 🧪 **Vérifier la configuration**
```bash
ai-team check
```

Doit afficher :
- ✅ Repository GitHub détecté
- ✅ Workflows installés  
- ✅ Clé API configurée (locale)
- ✅ Token GitHub configuré (local)

**Note:** Les secrets GitHub ne sont pas vérifiables depuis le CLI (sécurité).

---

## 🎯 **Exemples d'utilisation**

### **Frontend**
```bash
ai-team issue "Landing page SaaS avec pricing" --type frontend
ai-team issue "Dashboard analytics moderne" --type frontend
ai-team issue "Portfolio avec animations" --type frontend
```

### **Backend**
```bash
ai-team issue "API REST avec authentification" --type backend
ai-team issue "Microservice notifications" --type backend
ai-team issue "Base de données optimisée" --type backend
```

### **Autres**
```bash
ai-team issue "Tests E2E complets" --type testing
ai-team issue "Fix memory leak images" --type bug_fix
ai-team issue "Refactor architecture" --type refactor
```

---

## ❓ **Résolution de problèmes**

### **❌ CLI : Token GitHub manquant**
**Solution:** Ajoutez à votre `.env`
```bash
GITHUB_TOKEN=ghp_votre_token_github
```

### **❌ GitHub Actions : Secret manquant**
**Solution:** Configurez le secret
```
Repository → Settings → Secrets → Actions
TOGETHER_AI_API_KEY = votre-cle
```

### **❌ Clé Together.ai manquante**
```bash
ai-team setup-api  # Configuration locale + GitHub
```

### **❌ Workflows non installés**
```bash
ai-team init
```

---

## 🎉 **Résultat attendu**

1. **Issue créée** → CLI local (`.env`)  
2. **Workflow déclenché** → GitHub Actions (secrets)  
3. **Code généré** → DeepSeek R1  
4. **PR créée** → Prête à review  

**⏱️ Temps total: ~2 minutes**

---

## 🆘 **Support**

- **Diagnostic:** `ai-team check`
- **Aide:** `ai-team --help`
- **Configuration:** Voir `CONFIGURATION.md`

---

**🧠 AI Team Orchestrator v2.3.4 - Configuration .env locale + Secrets GitHub !**

*Deux environnements, configuration claire ! 🚀* 