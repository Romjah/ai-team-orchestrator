# 🔐 Guide complet de configuration GitHub

## 📋 Prérequis absolus

### 1. Repository GitHub
- ✅ Repository GitHub existant
- ✅ Accès admin au repository 
- ✅ GitHub Actions activé

### 2. Token GitHub (Personal Access Token)

#### 🔧 Création du token :
1. Allez sur : https://github.com/settings/tokens
2. Cliquez "Generate new token" → "Generate new token (classic)"
3. **Nom :** `AI Team Orchestrator`
4. **Expiration :** 90 days (ou plus)

#### 🔑 Permissions OBLIGATOIRES :
```
✅ repo (Full control of private repositories)
   ├── repo:status
   ├── repo_deployment  
   ├── public_repo
   └── repo:invite

✅ workflow (Update GitHub Action workflows)

✅ write:packages (optionnel)
✅ read:org (optionnel pour les organisations)
```

#### 🚨 Permissions minimales critiques :
- **`repo`** → Pour créer/modifier issues, PRs, fichiers
- **`workflow`** → Pour déclencher les GitHub Actions

### 3. Secrets Repository

#### 📍 Localisation :
`Repository → Settings → Secrets and variables → Actions`

#### 🔒 Secrets requis :

| Secret | Valeur | Obligatoire |
|--------|--------|-------------|
| `TOGETHER_AI_API_KEY` | Votre clé Together.ai | ✅ OUI |
| `GITHUB_TOKEN` | Votre PAT GitHub | ⚠️ Recommandé |

> **Note :** `GITHUB_TOKEN` est automatiquement fourni par GitHub Actions, mais avec des permissions limitées. Un PAT personnel donne plus de contrôle.

## 🚀 Configuration pas à pas

### Étape 1 : Installer les workflows
```bash
cd votre-projet
ai-team init
```

### Étape 2 : Configurer l'API
```bash
ai-team setup-api
```

### Étape 3 : Configurer le token GitHub
```bash
# Option A : Variable d'environnement (local)
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Option B : Secret repository (recommandé)
# Allez dans Settings → Secrets → Actions
# Créez : GITHUB_TOKEN = ghp_xxxxxxxxxxxxxxxxxxxx
```

### Étape 4 : Vérifier tout
```bash
ai-team check
```

## 🔍 Diagnostic des problèmes

### Workflows non déclenchés
✅ **Vérifications :**
1. `ai-team check` → Tout vert ?
2. Repository Settings → Actions → Activé ?
3. Secrets configurés correctement ?
4. Permissions du token suffisantes ?

### Erreurs de permissions
```
Error: Resource not accessible by integration
```

**Solutions :**
1. Vérifiez les permissions du token PAT
2. Recréez le token avec `repo` + `workflow`
3. Configurez le secret `GITHUB_TOKEN` dans le repository

### API Together.ai échoue
```
401 Unauthorized
```

**Solutions :**
1. Vérifiez la clé API : `ai-team setup-api`
2. Testez : `ai-team check`
3. Régénérez la clé sur together.ai

## ⚡ Test rapide

```bash
# 1. Diagnostic complet
ai-team check

# 2. Test avec une issue simple
ai-team issue "Test DeepSeek R1" --type feature

# 3. Vérifiez dans Actions → Workflows
```

## 🛠️ Dépannage avancé

### Token GitHub : Permissions détaillées

```json
{
  "repo": {
    "status": "✅ Requis - Status checks",
    "deployment": "✅ Requis - Deployments", 
    "public_repo": "✅ Requis - Public repos",
    "invite": "✅ Requis - Collaborators"
  },
  "workflow": "✅ CRITIQUE - GitHub Actions",
  "write:packages": "⚠️ Optionnel - Packages",
  "read:org": "⚠️ Optionnel - Organisation"
}
```

### Variables d'environnement alternatives

```bash
# Pour GitHub CLI
export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Pour Together.ai  
export TOGETHER_AI_API_KEY="votre-cle-together"

# Test
ai-team check
```

### Structure des fichiers requis

```
votre-projet/
├── .github/
│   ├── workflows/
│   │   ├── ai-team-mcp.yml          ✅ Principal DeepSeek R1
│   │   ├── ai-team-orchestrator.yml ✅ Orchestrateur
│   │   └── ai-team-zero-config.yml  ✅ Zero-config
│   └── scripts/
│       ├── ai_team_mcp.py           ✅ Script DeepSeek R1
│       ├── requirements.txt         ✅ Dépendances Python
│       └── zero_config_generator.py ✅ Générateur
└── .env (optionnel)
    ├── TOGETHER_AI_API_KEY=xxx
    └── GITHUB_TOKEN=xxx
```

## 🎯 Workflow de déclenchement

1. **Issue créée** → `ai-team issue "titre"`
2. **Workflow détecte** → `.github/workflows/ai-team-mcp.yml`
3. **Script Python** → `ai_team_mcp.py` + DeepSeek R1
4. **Code généré** → Fichiers créés automatiquement
5. **PR créée** → Pull Request automatique
6. **Review** → Code prêt à merger

---

## 🆘 Support

Si `ai-team check` montre tout en vert mais les workflows ne se déclenchent pas :

1. Vérifiez les logs dans **Actions** → **Workflows**
2. Recherchez les erreurs dans les logs de workflow
3. Confirmez que l'issue a bien le label `ai-team`
4. Vérifiez que le repository autorise les GitHub Actions

**🧠 AI Team Orchestrator - Propulsé par DeepSeek R1** 