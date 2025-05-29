# 🚀 Installation GitHub App - AI Team Orchestrator

## 🎯 Version Extension GitHub

Une interface directe dans GitHub pour utiliser vos agents IA !

### ⚡ Installation Express (5 minutes)

#### 1️⃣ Déployer l'app sur Vercel (gratuit)

```bash
# Clone ce dossier
cd github-app

# Installe les dépendances
npm install

# Connecte à Vercel
npx vercel

# Suit les instructions Vercel
# ✅ Crée un nouveau projet
# ✅ Deploy automatiquement
```

#### 2️⃣ Créer la GitHub App

1. Va sur [GitHub Developer Settings](https://github.com/settings/apps)
2. **New GitHub App**
3. Remplis :
   - **App name:** `AI Team Orchestrator - Votre Nom`
   - **Homepage URL:** `https://votre-app.vercel.app`
   - **Webhook URL:** `https://votre-app.vercel.app/api/webhook`
   - **Permissions:**
     - Repository permissions:
       - ✅ Contents: Read & write
       - ✅ Issues: Read & write
       - ✅ Pull requests: Read & write
       - ✅ Metadata: Read
4. **Create GitHub App**

#### 3️⃣ Configurer les variables Vercel

```bash
# Dans le dashboard Vercel de ton projet
# Settings > Environment Variables

GITHUB_APP_ID=123456  # Depuis la page de ton app GitHub
GITHUB_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...  # Generate & download
GITHUB_INSTALLATION_ID=12345678  # Après installation sur un repo
HUGGINGFACE_TOKEN=hf_xxxxx  # Token gratuit Hugging Face
GROQ_API_KEY=gsk_xxxxx  # Token gratuit Groq (optionnel)
```

#### 4️⃣ Installer l'app sur tes repos

1. Retourne sur la page de ton GitHub App
2. **Install App**
3. Choisis tes repositories
4. **Install**

---

## 🎮 Utilisation

### Option 1: Interface directe
Va sur `https://votre-app.vercel.app?repository=username/repo`

### Option 2: Bookmarklet (pratique !)
Ajoute ce bookmarklet à tes favoris :

```javascript
javascript:(function(){window.open('https://votre-app.vercel.app?repository='+window.location.pathname.split('/').slice(1,3).join('/'))})()
```

Clique dessus depuis n'importe quel repo GitHub !

---

## 🎯 Workflow complet

1. **Ouvre l'interface** depuis ton repo
2. **Décris ta tâche** (ex: "Créer une page de contact responsive")
3. **Choisis ton agent** (Frontend, Backend, Full-Stack, etc.)
4. **Clique "Lancer l'équipe IA"**
5. **Regarde la Pull Request** se créer automatiquement !

---

## 🔧 Avantages vs GitHub Actions

| Feature | GitHub Actions | GitHub App |
|---------|---------------|------------|
| **Interface** | Issues/Comments | Interface web directe |
| **Setup** | Copier des fichiers | 1 déploiement Vercel |
| **Utilisation** | Créer des issues | Formulaire simple |
| **Réactivité** | 2-3 minutes | Immédiat |
| **Contrôle** | Labels et templates | Dropdown et sélection |

---

## 🆓 Coûts

- **Vercel:** Gratuit (hobby plan)
- **GitHub App:** Gratuit
- **APIs IA:** Gratuites (Hugging Face + Groq)
- **Bandwidth:** Négligeable

**💰 Total: 0€/mois**

---

## 🚨 Troubleshooting

### App ne répond pas
- Vérifiez les variables d'environnement Vercel
- Regardez les logs Vercel Functions

### Pas de code généré
- Vérifiez `HUGGINGFACE_TOKEN` ou `GROQ_API_KEY`
- Testez les tokens en direct

### Erreur GitHub API
- Vérifiez `GITHUB_APP_ID` et `GITHUB_PRIVATE_KEY`
- Assurez-vous que l'app est installée sur le repo

---

## 🎉 Résultat

**🤖 Une interface professionnelle directement dans GitHub pour orchestrer vos agents IA !**

Plus besoin de créer des issues - juste un clic et l'IA code pour vous ! 