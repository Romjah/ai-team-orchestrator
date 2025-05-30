# 🔧 Guide de Configuration AI Team Orchestrator

## 🎯 **Deux environnements, deux configurations**

### 📱 **Usage LOCAL (CLI)** 
**Utilise le fichier `.env`** → Pour créer des issues manuellement

### ☁️ **Usage GITHUB ACTIONS (Workflows)**
**Utilise les secrets GitHub** → Pour la génération automatique de code

---

## 📱 **Configuration LOCAL (.env)**

### ✅ **Pour les commandes CLI :**
```bash
ai-team issue "Landing page moderne" --type frontend
ai-team create "Dashboard admin" --auto-issue
```

### 🔧 **Setup en 30 secondes :**
```bash
# 1. Configuration automatique
ai-team setup-api  # Choisir "📁 Fichier .env local"

# 2. Ou configuration manuelle
echo "TOGETHER_AI_API_KEY=your-key" > .env
echo "GITHUB_TOKEN=ghp_your-token" >> .env
```

### 📁 **Fichier .env créé :**
```bash
# AI Team Orchestrator v2.3.4 - Configuration DeepSeek R1
TOGETHER_AI_API_KEY=your-together-ai-key
GITHUB_TOKEN=ghp_your-github-token  # Optionnel
```

**✅ Avantages :**
- 🔒 Sécurisé (`.gitignore` automatique)
- ⚡ Configuration instantanée
- 🔧 Facile à modifier/débugger

---

## ☁️ **Configuration GITHUB ACTIONS (Secrets)**

### ✅ **Pour les workflows automatiques :**
- Issue créée → Workflow se déclenche
- DeepSeek R1 génère le code
- Pull Request créée automatiquement

### 🔧 **Setup obligatoire :**

#### 1️⃣ **TOGETHER_AI_API_KEY (OBLIGATOIRE)**
```
Repository → Settings → Secrets and variables → Actions
→ New repository secret
→ Name: TOGETHER_AI_API_KEY
→ Value: votre-cle-together-ai
```

#### 2️⃣ **GITHUB_TOKEN (AUTOMATIQUE)**
✅ **GitHub le fournit automatiquement !**
- Permissions : `contents:write`, `pull-requests:write`, `issues:write`
- Aucune configuration manuelle requise

**✅ Avantages :**
- 🔒 Sécurité maximale (secrets chiffrés)
- 🤖 Disponible pour tous les workflows
- 🌐 Fonctionne sur tous les repositories

---

## 🔄 **Flux de travail complet**

### **1. Configuration initiale**
```bash
# Local
npm install -g ai-team-orchestrator@latest
ai-team setup-api        # Crée le .env local
ai-team init             # Installe les workflows

# GitHub (une seule fois par repository)
# → Settings → Secrets → Actions
# → TOGETHER_AI_API_KEY = votre-cle
```

### **2. Usage quotidien**
```bash
# Création d'issue (utilise .env local)
ai-team issue "API REST moderne" --type backend

# ↓ GitHub Actions se déclenche automatiquement
# ↓ Utilise les secrets GitHub
# ↓ Génère le code avec DeepSeek R1
# ↓ Crée la Pull Request
```

---

## 🧪 **Diagnostic complet**

```bash
ai-team check
```

**Vérifie :**
- ✅ Configuration locale (.env)
- ✅ Secrets GitHub configurés
- ✅ Workflows installés
- ✅ Permissions correctes

---

## ❓ **FAQ Configuration**

### **Q: Pourquoi deux configurations ?**
**R:** Sécurité ! Le `.env` local n'est jamais commité, les secrets GitHub sont chiffrés.

### **Q: Le .env est-il envoyé à GitHub ?**
**R:** NON ! Il est automatiquement ajouté au `.gitignore`.

### **Q: Puis-je utiliser uniquement les secrets GitHub ?**
**R:** Pour les workflows oui, mais le CLI local a besoin du `.env`.

### **Q: Comment synchroniser .env → secrets GitHub ?**
**R:** Copiez manuellement les valeurs du `.env` vers les secrets GitHub.

### **Q: GITHUB_TOKEN obligatoire ?**
**R:** 
- **Local :** Recommandé pour créer des issues
- **GitHub Actions :** Automatique, fourni par GitHub

---

## 🔐 **Sécurité**

### **✅ Bonnes pratiques**
- `.env` → Jamais commité (`.gitignore`)
- Secrets GitHub → Chiffrés par GitHub
- Tokens → Permissions minimales requises

### **❌ À éviter**
- ❌ Commiter le fichier `.env`
- ❌ Partager les clés API en clair
- ❌ Permissions trop larges sur les tokens

---

## 🎯 **Résumé**

| Environnement | Configuration | Usage | Sécurité |
|---------------|---------------|-------|----------|
| **Local** | Fichier `.env` | CLI commands | `.gitignore` |
| **GitHub Actions** | Secrets GitHub | Workflows | Chiffrement GitHub |

**🧠 AI Team Orchestrator v2.3.4 - Configuration claire et sécurisée !** 