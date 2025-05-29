// API endpoint pour exécuter les tâches IA
// Compatible Vercel (serverless functions)

const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

// Import des agents IA (réutilisation du code existant)
const AgentOrchestrator = require('../lib/agent-orchestrator');
const CodeExecutor = require('../lib/code-executor');

export default async function handler(req, res) {
    // Configuration CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { repository, taskDescription, selectedAgent } = req.body;

        if (!repository || !taskDescription || !selectedAgent) {
            return res.status(400).json({ 
                error: 'Paramètres manquants: repository, taskDescription, selectedAgent requis' 
            });
        }

        // Authentification GitHub App
        const octokit = new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: process.env.GITHUB_APP_ID,
                privateKey: process.env.GITHUB_PRIVATE_KEY,
                installationId: await getInstallationId(repository),
            },
        });

        // 1. Analyse du repository
        console.log(`🔍 Analyse du repository: ${repository}`);
        const repoAnalysis = await analyzeRepository(octokit, repository);

        // 2. Préparation des données pour l'agent
        const taskData = {
            type: "manual",
            source: "GitHub App Interface",
            description: taskDescription,
            preferred_agent: selectedAgent,
            task_type: classifyTaskType(taskDescription),
            affected_areas: identifyAffectedAreas(taskDescription)
        };

        // 3. Orchestration de l'agent IA
        console.log(`🤖 Sélection de l'agent: ${selectedAgent}`);
        const orchestrator = new AgentOrchestrator();
        const executionPlan = await orchestrator.executeTask(taskData, repoAnalysis);

        if (!executionPlan.generated_code) {
            return res.status(500).json({
                error: 'Aucun code généré par l\'agent IA. Vérifiez vos tokens API.'
            });
        }

        // 4. Application des changements
        console.log(`💻 Application des changements...`);
        const executor = new CodeExecutor();
        const changes = await executor.processGeneratedCode(
            executionPlan.generated_code,
            taskData,
            octokit,
            repository
        );

        // 5. Création de la Pull Request
        const pullRequest = await createPullRequest(
            octokit,
            repository,
            changes,
            taskData,
            executionPlan
        );

        // 6. Réponse de succès
        res.status(200).json({
            success: true,
            pullRequestUrl: pullRequest.html_url,
            pullRequestNumber: pullRequest.number,
            agent: executionPlan.agent,
            filesModified: changes.modifiedFiles.length,
            summary: changes.summary
        });

    } catch (error) {
        console.error('❌ Erreur lors de l\'exécution:', error);
        res.status(500).json({
            error: error.message || 'Erreur interne du serveur'
        });
    }
}

// Fonctions utilitaires
async function getInstallationId(repository) {
    // Récupère l'installation ID pour ce repository
    // (simplifié - en réalité il faut faire une requête GitHub)
    return process.env.GITHUB_INSTALLATION_ID;
}

async function analyzeRepository(octokit, repository) {
    const [owner, repo] = repository.split('/');
    
    try {
        // Récupération des informations du repository
        const { data: repoData } = await octokit.rest.repos.get({
            owner,
            repo,
        });

        // Analyse des langages
        const { data: languages } = await octokit.rest.repos.listLanguages({
            owner,
            repo,
        });

        // Analyse des fichiers principaux
        const { data: contents } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: '',
        });

        return {
            languages,
            main_files: contents.map(item => item.name),
            description: repoData.description,
            framework: detectFramework(contents, languages)
        };
    } catch (error) {
        console.warn('Erreur analyse repository:', error.message);
        return {
            languages: {},
            main_files: [],
            description: '',
            framework: 'unknown'
        };
    }
}

function detectFramework(contents, languages) {
    const fileNames = contents.map(item => item.name.toLowerCase());
    
    if (fileNames.includes('package.json')) {
        return 'nodejs';
    } else if (fileNames.includes('requirements.txt') || 'Python' in languages) {
        return 'python';
    } else if (fileNames.includes('composer.json')) {
        return 'php';
    } else {
        return 'unknown';
    }
}

function classifyTaskType(description) {
    const text = description.toLowerCase();
    
    if (text.includes('bug') || text.includes('fix') || text.includes('error')) {
        return 'bug_fix';
    } else if (text.includes('test')) {
        return 'testing';
    } else if (text.includes('refactor') || text.includes('optimize')) {
        return 'refactor';
    } else if (text.includes('api') || text.includes('backend') || text.includes('server')) {
        return 'backend';
    } else if (text.includes('ui') || text.includes('frontend') || text.includes('component')) {
        return 'frontend';
    } else {
        return 'feature';
    }
}

function identifyAffectedAreas(description) {
    const text = description.toLowerCase();
    const areas = [];
    
    if (text.includes('frontend') || text.includes('ui') || text.includes('component') || text.includes('css')) {
        areas.push('frontend');
    }
    if (text.includes('backend') || text.includes('api') || text.includes('server') || text.includes('database')) {
        areas.push('backend');
    }
    if (text.includes('test')) {
        areas.push('testing');
    }
    
    return areas.length > 0 ? areas : ['general'];
}

async function createPullRequest(octokit, repository, changes, taskData, executionPlan) {
    const [owner, repo] = repository.split('/');
    const branchName = `ai-team/task-${Date.now()}`;
    
    try {
        // Récupération de la branche principale
        const { data: mainBranch } = await octokit.rest.repos.getBranch({
            owner,
            repo,
            branch: 'main'
        });

        // Création de la nouvelle branche
        await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha: mainBranch.commit.sha
        });

        // Application des changements
        for (const file of changes.files) {
            await octokit.rest.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: file.path,
                message: `🤖 Update ${file.path}`,
                content: Buffer.from(file.content).toString('base64'),
                branch: branchName
            });
        }

        // Création de la Pull Request
        const { data: pullRequest } = await octokit.rest.pulls.create({
            owner,
            repo,
            title: `🤖 [AI Team] ${taskData.description.substring(0, 50)}...`,
            head: branchName,
            base: 'main',
            body: `## 🤖 Pull Request générée par AI Team

**Agent utilisé:** ${executionPlan.agent}
**Type de tâche:** ${taskData.task_type}

### 📋 Description
${taskData.description}

### 🔧 Changements apportés
${changes.summary}

### 📁 Fichiers modifiés
${changes.modifiedFiles.map(f => `- ${f}`).join('\n')}

---
*Généré automatiquement par AI Team Orchestrator*`
        });

        return pullRequest;

    } catch (error) {
        console.error('Erreur création PR:', error);
        throw new Error(`Impossible de créer la Pull Request: ${error.message}`);
    }
} 