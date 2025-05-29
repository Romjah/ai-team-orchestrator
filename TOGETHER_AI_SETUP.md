# 🤖 Configuration Together.ai pour AI Team Orchestrator

Ce guide explique comment configurer Together.ai pour utiliser des modèles IA gratuits avec AI Team Orchestrator.

## 1. Créer un compte Together.ai

1. Allez sur [together.ai](https://together.ai)
2. Créez un compte gratuit
3. Obtenez votre clé API depuis le dashboard

## 2. Configurer le secret GitHub

1. Dans votre repository GitHub, allez dans `Settings` → `Secrets and variables` → `Actions`
2. Cliquez sur `New repository secret`
3. Nom : `TOGETHER_AI_API_KEY`
4. Valeur : Votre clé API Together.ai (comme celle fournie : `7b61ccee2b0b0f9d4b842862034eea9b18c5e4e26728ef8714b581c0cf0c91fe`)
5. Cliquez sur `Add secret`

## 3. Modèles utilisés

AI Team Orchestrator utilise ces modèles gratuits de Together.ai :

- **Classification** : `meta-llama/Llama-2-7b-chat-hf`
- **Génération de code** : `codellama/CodeLlama-7b-Instruct-hf`

## 4. Test de configuration

Pour tester que tout fonctionne :

1. Créez une issue GitHub avec le titre "Create a simple landing page"
2. Le workflow devrait se déclencher automatiquement
3. Un agent AI va analyser la tâche et générer du code
4. Une PR sera créée avec le code généré

## 5. Dépannage

Si le workflow échoue :

- Vérifiez que le secret `TOGETHER_AI_API_KEY` est bien configuré
- Vérifiez que votre clé API Together.ai est valide
- Consultez les logs GitHub Actions pour plus de détails

## 6. Avantages de Together.ai

- ✅ Gratuit pour les modèles open source
- ✅ Pas de limite stricte comme OpenAI
- ✅ Modèles Llama et CodeLlama performants
- ✅ API compatible avec les standards

---

*AI Team Orchestrator v1.3.1 avec Together.ai* 