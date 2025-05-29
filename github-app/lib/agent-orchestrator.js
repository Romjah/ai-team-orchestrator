// Agent Orchestrator simplifié pour GitHub App
const fetch = require('node-fetch');

class AgentOrchestrator {
    constructor() {
        this.agents = {
            frontend: {
                name: "Frontend Specialist",
                model: "codellama/CodeLlama-7b-Instruct-hf",
                provider: "huggingface",
                prompt: "Tu es un expert frontend. Génère du code HTML/CSS/JS moderne et responsive pour: {task}"
            },
            backend: {
                name: "Backend Specialist", 
                model: "codellama/CodeLlama-7b-Instruct-hf",
                provider: "huggingface",
                prompt: "Tu es un expert backend. Génère du code API/serveur robuste et sécurisé pour: {task}"
            },
            fullstack: {
                name: "Full-Stack Developer",
                model: "codellama/CodeLlama-13b-Instruct-hf",
                provider: "huggingface",
                prompt: "Tu es un développeur full-stack. Génère une solution complète frontend + backend pour: {task}"
            },
            testing: {
                name: "QA Engineer",
                model: "codellama/CodeLlama-7b-Instruct-hf",
                provider: "huggingface",
                prompt: "Tu es un expert en tests. Génère des tests unitaires et d'intégration complets pour: {task}"
            },
            bugfix: {
                name: "Bug Hunter",
                model: "deepseek-coder",
                provider: "groq",
                prompt: "Tu es un expert en débogage. Analyse et corrige ce problème: {task}"
            },
            refactor: {
                name: "Code Architect",
                model: "codellama/CodeLlama-7b-Instruct-hf",
                provider: "huggingface",
                prompt: "Tu es un architecte logiciel. Refactorise et optimise ce code: {task}"
            }
        };
    }

    async executeTask(taskData, repoAnalysis) {
        const agent = this.agents[taskData.preferred_agent] || this.agents.fullstack;
        
        const prompt = agent.prompt.replace('{task}', 
            `${taskData.description}
            
            CONTEXTE DU PROJET:
            - Langages: ${Object.keys(repoAnalysis.languages).join(', ')}
            - Framework: ${repoAnalysis.framework}
            - Fichiers principaux: ${repoAnalysis.main_files.join(', ')}
            
            INSTRUCTIONS:
            1. Génère du code propre et fonctionnel
            2. Respecte les conventions du projet
            3. Inclus des commentaires explicatifs
            4. Assure la compatibilité avec l'architecture existante
            
            RÉPONSE ATTENDUE:
            Fournis le code dans des blocs markdown avec les noms de fichiers.
            Exemple:
            \`\`\`javascript:src/components/Example.jsx
            // Ton code ici
            \`\`\``
        );

        const generatedCode = await this.callAI(agent, prompt);

        return {
            agent: agent.name,
            agent_type: taskData.preferred_agent,
            generated_code: generatedCode,
            task_analysis: taskData
        };
    }

    async callAI(agent, prompt) {
        try {
            if (agent.provider === 'huggingface') {
                return await this.callHuggingFace(agent.model, prompt);
            } else if (agent.provider === 'groq') {
                return await this.callGroq(agent.model, prompt);
            }
        } catch (error) {
            console.warn(`Erreur API ${agent.provider}:`, error.message);
            return this.fallbackResponse(prompt);
        }
    }

    async callHuggingFace(model, prompt) {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 2000,
                    temperature: 0.1,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status}`);
        }

        const result = await response.json();
        return result[0]?.generated_text || result.generated_text || '';
    }

    async callGroq(model, prompt) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 2000,
                temperature: 0.1
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const result = await response.json();
        return result.choices[0]?.message?.content || '';
    }

    fallbackResponse(prompt) {
        return `
# 🤖 Code Template Généré

\`\`\`javascript:src/generated.js
// Code généré automatiquement
// TODO: Implémenter la fonctionnalité demandée

console.log("Tâche: ${prompt.substring(0, 100)}...");

// Structure de base générée
export default function GeneratedComponent() {
    return {
        message: "Fonctionnalité à implémenter",
        status: "generated"
    };
}
\`\`\`

> ⚠️ Code de fallback généré - Vérifiez la configuration des API IA
`;
    }
}

module.exports = AgentOrchestrator; 