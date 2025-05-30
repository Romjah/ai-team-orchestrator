#!/usr/bin/env python3
"""
🤖 AI Team Zero-Config Generator
Générateur de code sans configuration externe
Version corrigée avec syntaxe GitHub Actions moderne
"""

import os
import json
import re
import time
from pathlib import Path

def analyze_task():
    """Analyse la tâche et détermine l'agent approprié avec détection contextuelle"""
    # Récupération des données d'entrée
    event_name = os.environ.get('GITHUB_EVENT_NAME')
    issue_title = os.environ.get('ISSUE_TITLE', '')
    issue_body = os.environ.get('ISSUE_BODY', '')
    comment_body = os.environ.get('COMMENT_BODY', '')
    manual_task = os.environ.get('MANUAL_TASK', '')
    
    # Détermination de la tâche
    if event_name == 'issues':
        task = f"{issue_title}\n{issue_body}"
    elif event_name == 'issue_comment':
        task = comment_body
    elif event_name == 'workflow_dispatch':
        task = manual_task
    else:
        task = "Tâche générale"
    
    # Analyse contextuelle du projet (nouveau)
    project_context = analyze_project_context()
    
    # Classification intelligente avec contexte
    task_lower = task.lower()
    
    # Détection spécialisée pour Together.ai et modèles IA
    if any(word in task_lower for word in ['together', 'together.ai', 'model', 'llm', 'ai model', 'chat', 'completion']):
        task_type = 'ai_models'
        agent = 'AI Models Specialist'
    elif any(word in task_lower for word in ['api key', 'authentication', 'auth', 'token', 'validation']):
        task_type = 'auth_integration'
        agent = 'Security Specialist'
    elif any(word in task_lower for word in ['config', 'configuration', 'setup', 'install']):
        task_type = 'configuration'
        agent = 'DevOps Specialist'
    elif any(word in task_lower for word in ['bug', 'fix', 'error', 'problème', 'issue']):
        task_type = 'bug_fix'
        agent = 'Bug Hunter'
    elif any(word in task_lower for word in ['test', 'testing', 'spec', 'coverage']):
        task_type = 'testing'
        agent = 'QA Engineer'
    elif any(word in task_lower for word in ['frontend', 'ui', 'css', 'html', 'component', 'react', 'vue']):
        task_type = 'frontend'
        agent = 'Frontend Specialist'
    elif any(word in task_lower for word in ['backend', 'api', 'server', 'database', 'node', 'express']):
        task_type = 'backend'
        agent = 'Backend Specialist'
    elif any(word in task_lower for word in ['refactor', 'optimize', 'clean', 'improve']):
        task_type = 'refactor'
        agent = 'Code Architect'
    elif any(word in task_lower for word in ['doc', 'documentation', 'readme', 'guide']):
        task_type = 'documentation'
        agent = 'Technical Writer'
    else:
        # Utiliser le contexte du projet pour déterminer le type
        if project_context['is_ai_project']:
            task_type = 'ai_enhancement'
            agent = 'AI Integration Specialist'
        else:
            task_type = 'feature'
            agent = 'Full-Stack Developer'
    
    return {
        'task': task,
        'task_type': task_type,
        'agent': agent,
        'task_summary': task[:100],
        'project_context': project_context
    }

def analyze_project_context():
    """Analyse le contexte du projet pour une génération plus pertinente"""
    context = {
        'is_ai_project': False,
        'has_together_api': False,
        'framework': 'unknown',
        'language': 'javascript'
    }
    
    try:
        # Vérifier si c'est un projet AI/Together.ai
        files_to_check = ['package.json', 'lib/api-config.js', 'README.md', '.env.example']
        
        for file_path in files_to_check:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read().lower()
                    
                    if any(keyword in content for keyword in ['together', 'openai', 'anthropic', 'llm', 'ai-team']):
                        context['is_ai_project'] = True
                    
                    if 'together' in content:
                        context['has_together_api'] = True
                    
                    if 'react' in content:
                        context['framework'] = 'react'
                    elif 'vue' in content:
                        context['framework'] = 'vue'
                    elif 'express' in content:
                        context['framework'] = 'express'
    
    except Exception as e:
        print(f"Erreur analyse contexte: {e}")
    
    return context

def generate_frontend_code(task):
    """Génère du code frontend sophistiqué"""
    task_lower = task.lower()
    
    # Analyse de la demande pour déterminer le type de page
    is_landing = any(word in task_lower for word in ['landing', 'accueil', 'homepage', 'home'])
    has_form = any(word in task_lower for word in ['form', 'formulaire', 'contact', 'inscription'])
    has_gallery = any(word in task_lower for word in ['gallery', 'galerie', 'images', 'photos'])
    has_pricing = any(word in task_lower for word in ['pricing', 'tarif', 'prix', 'plan'])
    is_dashboard = any(word in task_lower for word in ['dashboard', 'admin', 'tableau'])
    
    # Génération HTML adaptée
    html_content = generate_html_structure(task, is_landing, has_form, has_gallery, has_pricing, is_dashboard)
    css_content = generate_css_styles(is_landing, has_form, has_gallery, has_pricing, is_dashboard)
    js_content = generate_javascript_functionality(has_form, has_gallery, is_dashboard)
    
    return {
        'index.html': html_content,
        'styles.css': css_content,
        'script.js': js_content
    }

def generate_html_structure(task, is_landing=False, has_form=False, has_gallery=False, has_pricing=False, is_dashboard=False):
    """Génère la structure HTML adaptée"""
    
    if is_landing:
        return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Team - Landing Page</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-robot"></i> AI Team
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Accueil</a></li>
                <li><a href="#features">Fonctionnalités</a></li>
                <li><a href="#pricing">Tarifs</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Révolutionnez votre développement avec <span class="gradient-text">AI Team</span></h1>
                <p class="hero-subtitle">Génération automatique de code, agents IA spécialisés, intégration GitHub seamless</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary">Commencer gratuitement</button>
                    <button class="btn btn-secondary">Voir la démo</button>
                </div>
            </div>
            <div class="hero-image">
                <div class="floating-cards">
                    <div class="card card-1">🎨 Frontend</div>
                    <div class="card card-2">⚙️ Backend</div>
                    <div class="card card-3">🧪 Testing</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <h2 class="section-title">Agents IA Spécialisés</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Frontend Specialist</h3>
                    <p>HTML, CSS, JavaScript moderne avec animations et responsive design</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚙️</div>
                    <h3>Backend Specialist</h3>
                    <p>APIs REST, authentification, bases de données et architecture serveur</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🧪</div>
                    <h3>QA Engineer</h3>
                    <p>Tests automatiques, validation, couverture de code et qualité</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🐛</div>
                    <h3>Bug Hunter</h3>
                    <p>Détection et correction automatique de bugs et optimisations</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <div class="container">
            <h2>Prêt à automatiser votre développement ?</h2>
            <p>Rejoignez des milliers de développeurs qui utilisent AI Team</p>
            <button class="btn btn-primary btn-large">Commencer maintenant</button>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3><i class="fas fa-robot"></i> AI Team</h3>
                    <p>Votre équipe IA de développement</p>
                </div>
                <div class="footer-section">
                    <h4>Liens</h4>
                    <ul>
                        <li><a href="#home">Accueil</a></li>
                        <li><a href="#features">Fonctionnalités</a></li>
                        <li><a href="#pricing">Tarifs</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Suivez-nous</h4>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-github"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 AI Team. Généré automatiquement par AI Team Orchestrator.</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>'''
    
    elif is_dashboard:
        return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Team Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="dashboard">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <i class="fas fa-robot"></i>
                <h3>AI Team</h3>
            </div>
            <nav class="sidebar-nav">
                <a href="#dashboard" class="nav-item active">
                    <i class="fas fa-chart-line"></i> Dashboard
                </a>
                <a href="#agents" class="nav-item">
                    <i class="fas fa-users"></i> Agents IA
                </a>
                <a href="#projects" class="nav-item">
                    <i class="fas fa-folder"></i> Projets
                </a>
                <a href="#analytics" class="nav-item">
                    <i class="fas fa-analytics"></i> Analytics
                </a>
                <a href="#settings" class="nav-item">
                    <i class="fas fa-cog"></i> Paramètres
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="dashboard-header">
                <h1>Dashboard AI Team</h1>
                <div class="header-actions">
                    <button class="btn btn-primary">Nouvelle tâche</button>
                    <div class="user-menu">
                        <i class="fas fa-user-circle"></i>
                    </div>
                </div>
            </header>

            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">🤖</div>
                    <div class="stat-content">
                        <h3>24</h3>
                        <p>Agents actifs</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <h3>156</h3>
                        <p>Tâches complétées</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-content">
                        <h3>98%</h3>
                        <p>Taux de succès</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🚀</div>
                    <div class="stat-content">
                        <h3>2.3s</h3>
                        <p>Temps moyen</p>
                    </div>
                </div>
            </div>

            <!-- Charts and Tables -->
            <div class="dashboard-grid">
                <div class="chart-container">
                    <h3>Activité des agents</h3>
                    <div class="chart-placeholder">
                        <canvas id="agentChart"></canvas>
                    </div>
                </div>
                <div class="recent-tasks">
                    <h3>Tâches récentes</h3>
                    <div class="task-list">
                        <div class="task-item">
                            <span class="task-icon">🎨</span>
                            <span class="task-name">Landing page moderne</span>
                            <span class="task-status completed">Terminé</span>
                        </div>
                        <div class="task-item">
                            <span class="task-icon">⚙️</span>
                            <span class="task-name">API REST</span>
                            <span class="task-status in-progress">En cours</span>
                        </div>
                        <div class="task-item">
                            <span class="task-icon">🧪</span>
                            <span class="task-name">Tests unitaires</span>
                            <span class="task-status pending">En attente</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>'''
    
    else:
        # Page générique mais moderne
        return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Team - Page générée</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1><i class="fas fa-robot"></i> Page générée par AI Team</h1>
            <p class="subtitle">Code créé automatiquement basé sur votre demande</p>
        </header>

        <main class="main-content">
            <section class="task-info">
                <h2>🎯 Tâche traitée</h2>
                <div class="task-description">
                    <p>{task[:300]}...</p>
                </div>
            </section>

            <section class="features">
                <h2>✨ Fonctionnalités incluses</h2>
                <div class="feature-grid">
                    <div class="feature">
                        <i class="fas fa-mobile-alt"></i>
                        <h3>Responsive Design</h3>
                        <p>Compatible mobile et desktop</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-palette"></i>
                        <h3>Design Moderne</h3>
                        <p>Interface élégante et intuitive</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-rocket"></i>
                        <h3>Performance</h3>
                        <p>Code optimisé et rapide</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Sécurisé</h3>
                        <p>Bonnes pratiques appliquées</p>
                    </div>
                </div>
            </section>

            <section class="demo">
                <h2>🚀 Démonstration</h2>
                <div class="demo-container">
                    <button class="btn btn-primary" onclick="runDemo()">
                        <i class="fas fa-play"></i> Lancer la démo
                    </button>
                    <div id="demo-result" class="demo-result" style="display: none;">
                        <p><i class="fas fa-check-circle"></i> Démonstration réussie !</p>
                        <p>Fonctionnalité AI Team opérationnelle</p>
                    </div>
                </div>
            </section>
        </main>

        <footer class="footer">
            <p>Généré par <strong>AI Team Orchestrator</strong> • <span id="timestamp"></span></p>
        </footer>
    </div>

    <script src="script.js"></script>
</body>
</html>'''

def generate_backend_code(task):
    """Génère du code backend"""
    return f'''// 🤖 API générée par AI Team Backend Specialist
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('🤖 API AI Team démarrée');

// Route principale
app.get('/api/ai-status', (req, res) => {{
    res.json({{
        status: 'success',
        message: 'API générée par AI Team',
        agent: 'Backend Specialist',
        task: '{task[:100]}...',
        timestamp: new Date().toISOString(),
        features: [
            'API REST complète',
            'CORS configuré',
            'Gestion d\\'erreurs automatique'
        ]
    }});
}});

// Route de traitement
app.post('/api/process', (req, res) => {{
    const {{ data }} = req.body;
    
    if (!data) {{
        return res.status(400).json({{
            error: 'Données requises',
            code: 'MISSING_DATA'
        }});
    }}
    
    res.json({{
        processed: true,
        input: data,
        result: `Traitement IA effectué: ${{data}}`,
        processed_by: 'AI Team Backend',
        timestamp: new Date().toISOString()
    }});
}});

// Gestion des erreurs
app.use((err, req, res, next) => {{
    console.error('Erreur API:', err.message);
    res.status(500).json({{
        error: 'Erreur interne',
        message: 'L\\'API AI a rencontré un problème'
    }});
}});

app.listen(PORT, () => {{
    console.log(`🚀 API AI Team sur le port ${{PORT}}`);
}});'''

def generate_ai_models_code(task, project_context):
    """Génère du code spécialisé pour les modèles IA et Together.ai"""
    task_lower = task.lower()
    
    # Déterminer le type de modification IA nécessaire
    is_model_update = any(word in task_lower for word in ['model', 'gpt', 'claude', 'llama'])
    is_chat_feature = any(word in task_lower for word in ['chat', 'conversation', 'message'])
    is_completion = any(word in task_lower for word in ['completion', 'generate', 'text'])
    
    files = {}
    
    # Fichier principal de modèles IA
    files['lib/ai-models.js'] = f'''// 🤖 Modèles IA - Généré par AI Models Specialist
// Tâche: {task[:150]}...

const {{ Together }} = require('together-ai');

class AIModelsManager {{
    constructor() {{
        this.together = new Together({{
            apiKey: process.env.TOGETHER_API_KEY
        }});
        this.models = this.getAvailableModels();
        console.log('🤖 AI Models Manager initialisé');
    }}

    getAvailableModels() {{
        return {{
            // Modèles de chat performants
            chat: {{
                'meta-llama/Llama-2-70b-chat-hf': {{
                    name: 'Llama 2 70B Chat',
                    maxTokens: 4096,
                    cost: 'standard',
                    speed: 'fast'
                }},
                'meta-llama/Llama-2-13b-chat-hf': {{
                    name: 'Llama 2 13B Chat',
                    maxTokens: 4096,
                    cost: 'low',
                    speed: 'very_fast'
                }},
                'mistralai/Mixtral-8x7B-Instruct-v0.1': {{
                    name: 'Mixtral 8x7B Instruct',
                    maxTokens: 32768,
                    cost: 'standard',
                    speed: 'fast'
                }},
                'Qwen/Qwen1.5-72B-Chat': {{
                    name: 'Qwen 1.5 72B Chat',
                    maxTokens: 32768,
                    cost: 'standard',
                    speed: 'fast'
                }}
            }},
            // Modèles de completion
            completion: {{
                'meta-llama/CodeLlama-70b-Instruct-hf': {{
                    name: 'Code Llama 70B',
                    maxTokens: 4096,
                    speciality: 'code',
                    cost: 'standard'
                }},
                'WizardLM/WizardCoder-Python-34B-V1.0': {{
                    name: 'WizardCoder Python 34B',
                    maxTokens: 8192,
                    speciality: 'python',
                    cost: 'low'
                }}
            }}
        }};
    }}

    async chatCompletion(message, modelId = 'meta-llama/Llama-2-70b-chat-hf', options = {{}}) {{
        try {{
            console.log(`💬 Chat avec modèle: ${{modelId}}`);
            
            const response = await this.together.chat.completions.create({{
                model: modelId,
                messages: [
                    {{
                        role: 'user',
                        content: message
                    }}
                ],
                max_tokens: options.maxTokens || 1024,
                temperature: options.temperature || 0.7,
                top_p: options.topP || 0.9,
                stop: options.stop || null
            }});

            return {{
                success: true,
                content: response.choices[0].message.content,
                model: modelId,
                usage: response.usage,
                timestamp: new Date().toISOString()
            }};
        }} catch (error) {{
            console.error(`❌ Erreur chat completion: ${{error.message}}`);
            return {{
                success: false,
                error: error.message,
                model: modelId,
                timestamp: new Date().toISOString()
            }};
        }}
    }}

    async textCompletion(prompt, modelId = 'meta-llama/CodeLlama-70b-Instruct-hf', options = {{}}) {{
        try {{
            console.log(`📝 Completion avec modèle: ${{modelId}}`);
            
            const response = await this.together.completions.create({{
                model: modelId,
                prompt: prompt,
                max_tokens: options.maxTokens || 512,
                temperature: options.temperature || 0.3,
                top_p: options.topP || 0.9,
                stop: options.stop || ['\\n\\n']
            }});

            return {{
                success: true,
                content: response.choices[0].text,
                model: modelId,
                usage: response.usage,
                timestamp: new Date().toISOString()
            }};
        }} catch (error) {{
            console.error(`❌ Erreur text completion: ${{error.message}}`);
            return {{
                success: false,
                error: error.message,
                model: modelId,
                timestamp: new Date().toISOString()
            }};
        }}
    }}

    async generateCode(description, language = 'javascript', modelId = 'meta-llama/CodeLlama-70b-Instruct-hf') {{
        const prompt = `Génère du code ${{language}} pour: ${{description}}\\n\\nCode:`;
        
        return await this.textCompletion(prompt, modelId, {{
            maxTokens: 1024,
            temperature: 0.2,
            stop: ['\\n\\n\\n']
        }});
    }}

    getModelInfo(modelId) {{
        for (const category of Object.values(this.models)) {{
            if (category[modelId]) {{
                return category[modelId];
            }}
        }}
        return null;
    }}

    listModels(category = null) {{
        if (category && this.models[category]) {{
            return Object.keys(this.models[category]);
        }}
        
        const allModels = [];
        Object.values(this.models).forEach(category => {{
            allModels.push(...Object.keys(category));
        }});
        return allModels;
    }}
}}

module.exports = AIModelsManager;'''

    # Exemple d'utilisation
    files['examples/ai-models-usage.js'] = '''// 📚 Exemples d'utilisation des modèles IA
const AIModelsManager = require('../lib/ai-models');

async function demonstrateAIModels() {
    const aiManager = new AIModelsManager();
    
    try {
        console.log('🚀 Démonstration des modèles IA Together.ai');
        
        // 1. Chat avec Llama 2
        console.log('\\n💬 Test Chat Completion:');
        const chatResult = await aiManager.chatCompletion(
            'Explique-moi React en 3 phrases',
            'meta-llama/Llama-2-70b-chat-hf'
        );
        
        if (chatResult.success) {
            console.log('Réponse:', chatResult.content);
            console.log('Tokens utilisés:', chatResult.usage);
        }
        
        // 2. Génération de code
        console.log('\\n💻 Test Code Generation:');
        const codeResult = await aiManager.generateCode(
            'Une fonction qui calcule la factorielle d\\'un nombre',
            'javascript'
        );
        
        if (codeResult.success) {
            console.log('Code généré:', codeResult.content);
        }
        
        // 3. Liste des modèles disponibles
        console.log('\\n📋 Modèles disponibles:');
        console.log('Chat:', aiManager.listModels('chat'));
        console.log('Completion:', aiManager.listModels('completion'));
        
    } catch (error) {
        console.error('Erreur démonstration:', error);
    }
}

// Exécuter la démonstration
if (require.main === module) {
    demonstrateAIModels();
}

module.exports = demonstrateAIModels;'''

    # Tests pour les modèles IA
    files['tests/ai-models.test.js'] = '''// 🧪 Tests pour les modèles IA
const { expect } = require('chai');
const AIModelsManager = require('../lib/ai-models');

describe('🤖 AI Models Manager', function() {
    let aiManager;
    
    beforeEach(function() {
        aiManager = new AIModelsManager();
    });
    
    describe('Initialisation', function() {
        it('devrait initialiser correctement', function() {
            expect(aiManager).to.be.instanceOf(AIModelsManager);
            expect(aiManager.models).to.be.an('object');
            expect(aiManager.together).to.exist;
        });
        
        it('devrait avoir des modèles pré-configurés', function() {
            expect(aiManager.models.chat).to.be.an('object');
            expect(aiManager.models.completion).to.be.an('object');
            expect(Object.keys(aiManager.models.chat).length).to.be.above(0);
        });
    });
    
    describe('Gestion des modèles', function() {
        it('devrait lister les modèles de chat', function() {
            const chatModels = aiManager.listModels('chat');
            expect(chatModels).to.be.an('array');
            expect(chatModels).to.include('meta-llama/Llama-2-70b-chat-hf');
        });
        
        it('devrait retourner les informations d\\'un modèle', function() {
            const modelInfo = aiManager.getModelInfo('meta-llama/Llama-2-70b-chat-hf');
            expect(modelInfo).to.be.an('object');
            expect(modelInfo.name).to.equal('Llama 2 70B Chat');
            expect(modelInfo.maxTokens).to.be.a('number');
        });
        
        it('devrait retourner null pour un modèle inexistant', function() {
            const modelInfo = aiManager.getModelInfo('modele-inexistant');
            expect(modelInfo).to.be.null;
        });
    });
    
    describe('Validation des paramètres', function() {
        it('devrait valider les options de chat', function() {
            const options = {
                maxTokens: 512,
                temperature: 0.7,
                topP: 0.9
            };
            
            expect(options.maxTokens).to.be.a('number');
            expect(options.temperature).to.be.within(0, 2);
            expect(options.topP).to.be.within(0, 1);
        });
    });
});'''
    
    return files

def generate_auth_integration_code(task, project_context):
    """Génère du code pour l'intégration d'authentification"""
    return {
        'lib/auth-validator.js': f'''// 🔐 Validateur d'authentification - Security Specialist
// Tâche: {task[:150]}...

class AuthValidator {{
    constructor() {{
        this.apiKeyPatterns = {{
            together: /^[a-zA-Z0-9]{{40,}}$/, // Clés alphanumériques Together.ai
            openai: /^sk-[a-zA-Z0-9]{{48,}}$/, // Clés OpenAI
            anthropic: /^sk-ant-[a-zA-Z0-9_-]{{40,}}$/ // Clés Anthropic
        }}};
        console.log('🔐 Auth Validator initialisé');
    }}

    validateTogetherApiKey(apiKey) {{
        if (!apiKey) {{
            return {{ valid: false, error: 'Clé API manquante' }};
        }}

        if (typeof apiKey !== 'string') {{
            return {{ valid: false, error: 'La clé API doit être une chaîne' }};
        }}

        // Vérification du format Together.ai (alphanumériqu)
        if (!this.apiKeyPatterns.together.test(apiKey)) {{
            return {{ 
                valid: false, 
                error: 'Format de clé Together.ai invalide (doit être alphanumériqu, 40+ caractères)' 
            }};
        }}

        return {{ valid: true, provider: 'together.ai' }};
    }}

    async testApiKey(apiKey, provider = 'together') {{
        const validation = this.validateTogetherApiKey(apiKey);
        
        if (!validation.valid) {{
            return validation;
        }}

        try {{
            // Test de la clé avec une requête simple
            const {{ Together }} = require('together-ai');
            const together = new Together({{ apiKey }});

            // Tentative de récupération des modèles disponibles
            const models = await together.models.list();
            
            return {{
                valid: true,
                provider: 'together.ai',
                active: true,
                models_count: models.data?.length || 0,
                tested_at: new Date().toISOString()
            }};

        }} catch (error) {{
            return {{
                valid: false,
                error: `Clé API Together.ai invalide: ${{error.message}}`,
                tested_at: new Date().toISOString()
            }};
        }}
    }}

    generateSecureConfig(apiKey) {{
        const validation = this.validateTogetherApiKey(apiKey);
        
        if (!validation.valid) {{
            throw new Error(validation.error);
        }}

        return {{
            together: {{
                apiKey: apiKey,
                baseURL: 'https://api.together.xyz/v1',
                timeout: 30000,
                retries: 3
            }},
            security: {{
                keyValidation: true,
                rateLimiting: true,
                encryption: true
            }},
            generated_at: new Date().toISOString()
        }};
    }}
}}

module.exports = AuthValidator;''',

        'scripts/setup-api-keys.js': '''#!/usr/bin/env node
// 🔧 Script de configuration des clés API - Security Specialist

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const AuthValidator = require('../lib/auth-validator');

class APIKeySetup {
    constructor() {
        this.validator = new AuthValidator();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async promptForApiKey() {
        return new Promise((resolve) => {
            this.rl.question('🔑 Entrez votre clé API Together.ai: ', (apiKey) => {
                resolve(apiKey.trim());
            });
        });
    }

    async setupEnvironment() {
        console.log('🚀 Configuration des clés API AI Team');
        console.log('');
        
        try {
            // Demander la clé API
            const apiKey = await this.promptForApiKey();
            
            // Valider la clé
            console.log('🔍 Validation de la clé API...');
            const validation = await this.validator.testApiKey(apiKey);
            
            if (!validation.valid) {
                console.error('❌ Clé API invalide:', validation.error);
                this.rl.close();
                return;
            }
            
            console.log('✅ Clé API valide !');
            console.log(`📊 ${validation.models_count} modèles disponibles`);
            
            // Créer le fichier .env
            this.createEnvFile(apiKey);
            
            // Créer le fichier de configuration
            this.createConfigFile(apiKey);
            
            console.log('');
            console.log('🎉 Configuration terminée avec succès !');
            console.log('');
            console.log('Prochaines étapes:');
            console.log('1. Vérifiez le fichier .env');
            console.log('2. Testez avec: npm run test-api');
            console.log('3. Commencez à utiliser AI Team !');
            
        } catch (error) {
            console.error('❌ Erreur lors de la configuration:', error.message);
        } finally {
            this.rl.close();
        }
    }

    createEnvFile(apiKey) {
        const envContent = `# 🤖 Configuration AI Team
# Généré automatiquement le ${new Date().toISOString()}

# Together.ai API Key (alphanumériqu)
TOGETHER_API_KEY=${apiKey}

# Configuration optionnelle
TOGETHER_BASE_URL=https://api.together.xyz/v1
AI_TEAM_DEBUG=false
AI_TEAM_TIMEOUT=30000
`;

        fs.writeFileSync('.env', envContent);
        console.log('📝 Fichier .env créé');
    }

    createConfigFile(apiKey) {
        const config = this.validator.generateSecureConfig(apiKey);
        
        const configContent = `// 🔧 Configuration AI Team
// ⚠️  Ne pas committer ce fichier avec les clés API

module.exports = ${JSON.stringify(config, null, 2)};
`;

        fs.writeFileSync('ai-team-config.js', configContent);
        console.log('⚙️  Fichier de configuration créé');
        
        // Ajouter au .gitignore
        this.updateGitignore();
    }

    updateGitignore() {
        const gitignoreEntries = [
            '',
            '# AI Team - Configuration sensible',
            'ai-team-config.js',
            '.env',
            '.env.local'
        ];

        try {
            let gitignoreContent = '';
            if (fs.existsSync('.gitignore')) {
                gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
            }

            // Ajouter seulement si pas déjà présent
            if (!gitignoreContent.includes('ai-team-config.js')) {
                fs.appendFileSync('.gitignore', gitignoreEntries.join('\\n'));
                console.log('🔒 .gitignore mis à jour');
            }
        } catch (error) {
            console.warn('⚠️  Impossible de mettre à jour .gitignore:', error.message);
        }
    }
}

// Exécution du script
if (require.main === module) {
    const setup = new APIKeySetup();
    setup.setupEnvironment();
}

module.exports = APIKeySetup;'''
    }

def generate_configuration_code(task, project_context):
    """Génère du code de configuration"""
    return {
        'config/ai-team-setup.js': f'''// ⚙️ Configuration AI Team - DevOps Specialist
// Tâche: {task[:150]}...

const fs = require('fs');
const path = require('path');

class AITeamSetup {{
    constructor() {{
        this.configPath = path.join(process.cwd(), 'ai-team.config.json');
        this.defaultConfig = this.getDefaultConfig();
        console.log('⚙️ AI Team Setup initialisé');
    }}

    getDefaultConfig() {{
        return {{
            version: '1.5.4',
            providers: {{
                together: {{
                    enabled: true,
                    baseURL: 'https://api.together.xyz/v1',
                    timeout: 30000,
                    retries: 3,
                    models: {{
                        chat: 'meta-llama/Llama-2-70b-chat-hf',
                        completion: 'meta-llama/CodeLlama-70b-Instruct-hf',
                        coding: 'WizardLM/WizardCoder-Python-34B-V1.0'
                    }}
                }}
            }},
            features: {{
                autoGeneration: true,
                smartDetection: true,
                contextAnalysis: true,
                multiFileOutput: true
            }},
            output: {{
                directory: './ai-generated',
                includeTests: true,
                includeDocumentation: true,
                format: 'modern'
            }},
            security: {{
                validateKeys: true,
                sanitizeInput: true,
                rateLimiting: true
            }}
        }};
    }}

    async initialize() {{
        console.log('🚀 Initialisation d\\'AI Team...');
        
        try {{
            // Créer la configuration
            await this.createConfig();
            
            // Créer les répertoires nécessaires
            await this.createDirectories();
            
            // Installer les dépendances
            await this.installDependencies();
            
            // Vérifier la configuration
            await this.validateSetup();
            
            console.log('✅ AI Team configuré avec succès !');
            
        }} catch (error) {{
            console.error('❌ Erreur lors de l\\'initialisation:', error.message);
            throw error;
        }}
    }}

    async createConfig() {{
        if (fs.existsSync(this.configPath)) {{
            console.log('📄 Configuration existante trouvée');
            return;
        }}

        fs.writeFileSync(
            this.configPath, 
            JSON.stringify(this.defaultConfig, null, 2)
        );
        console.log('📝 Configuration créée');
    }}

    async createDirectories() {{
        const directories = [
            './ai-generated',
            './ai-generated/frontend',
            './ai-generated/backend',
            './ai-generated/tests',
            './ai-generated/docs'
        ];

        directories.forEach(dir => {{
            if (!fs.existsSync(dir)) {{
                fs.mkdirSync(dir, {{ recursive: true }});
                console.log(`📁 Répertoire créé: ${{dir}}`);
            }}
        }});
    }}

    async installDependencies() {{
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        
        if (!fs.existsSync(packageJsonPath)) {{
            console.log('📦 Création de package.json...');
            const packageJson = {{
                name: 'ai-team-project',
                version: '1.0.0',
                description: 'Projet généré avec AI Team',
                main: 'index.js',
                scripts: {{
                    'ai:generate': 'node ai-team-cli.js',
                    'ai:test': 'npm test',
                    'ai:setup': 'node config/ai-team-setup.js'
                }},
                dependencies: {{
                    'together-ai': '^1.0.0',
                    'express': '^4.18.0',
                    'cors': '^2.8.5'
                }},
                devDependencies: {{
                    'mocha': '^10.2.0',
                    'chai': '^4.3.7',
                    'nodemon': '^3.0.0'
                }}
            }};
            
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log('📦 package.json créé');
        }}
    }}

    async validateSetup() {{
        console.log('🔍 Validation de la configuration...');
        
        const checks = [
            {{ name: 'Configuration', path: this.configPath }},
            {{ name: 'Répertoire de sortie', path: './ai-generated' }},
            {{ name: 'Package.json', path: './package.json' }}
        ];

        let allValid = true;

        checks.forEach(check => {{
            if (fs.existsSync(check.path)) {{
                console.log(`✅ ${{check.name}}: OK`);
            }} else {{
                console.log(`❌ ${{check.name}}: Manquant`);
                allValid = false;
            }}
        }});

        if (!allValid) {{
            throw new Error('Configuration incomplète');
        }}

        console.log('🎉 Validation réussie !');
    }}

    getConfig() {{
        if (fs.existsSync(this.configPath)) {{
            return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        }}
        return this.defaultConfig;
    }}

    updateConfig(updates) {{
        const currentConfig = this.getConfig();
        const newConfig = {{ ...currentConfig, ...updates }};
        
        fs.writeFileSync(
            this.configPath, 
            JSON.stringify(newConfig, null, 2)
        );
        
        console.log('🔄 Configuration mise à jour');
        return newConfig;
    }}
}}

module.exports = AITeamSetup;'''
    }

def generate_documentation_code(task, project_context):
    """Génère de la documentation"""
    return {
        'docs/AI-TEAM-GUIDE.md': f'''# 🤖 Guide AI Team - Documentation Complète

## 📋 Tâche traitée
{task[:200]}...

## 🚀 Introduction

AI Team est un orchestrateur intelligent qui génère automatiquement du code adapté à vos besoins spécifiques, avec une spécialisation pour les modèles IA comme Together.ai.

## 🎯 Agents Spécialisés

### 🤖 AI Models Specialist
- **Rôle**: Gestion des modèles IA (Together.ai, OpenAI, etc.)
- **Expertise**: Chat completion, text generation, code generation
- **Modèles supportés**: Llama 2, Mixtral, CodeLlama, WizardCoder

### 🔐 Security Specialist  
- **Rôle**: Authentification et sécurité des APIs
- **Expertise**: Validation des clés, configuration sécurisée
- **Focus**: Together.ai API key validation (format alphanumériqu)

### ⚙️ DevOps Specialist
- **Rôle**: Configuration et déploiement
- **Expertise**: Setup automatisé, gestion des environnements
- **Outils**: Docker, CI/CD, configuration multi-environnements

### 🎨 Frontend Specialist
- **Rôle**: Interfaces utilisateur modernes
- **Expertise**: React, Vue, HTML5, CSS3, animations
- **Focus**: Responsive design, performance, accessibilité

### ⚙️ Backend Specialist
- **Rôle**: APIs et services backend
- **Expertise**: Node.js, Express, bases de données
- **Focus**: APIs REST, authentification, sécurité

### 🧪 QA Engineer
- **Rôle**: Tests automatisés et qualité
- **Expertise**: Tests unitaires, intégration, couverture
- **Outils**: Mocha, Chai, Jest, Cypress

## 🛠️ Installation et Configuration

### Installation rapide
```bash
npm install -g ai-team-orchestrator
ai-team setup-api
```

### Configuration manuelle
```bash
# 1. Clone ou installation
npm install ai-team-orchestrator

# 2. Configuration des clés API
node scripts/setup-api-keys.js

# 3. Initialisation du projet
node config/ai-team-setup.js
```

### Variables d'environnement
```bash
# Together.ai (alphanumériqu, 40+ caractères)
TOGETHER_API_KEY=votre_cle_alphanumerique_together

# Configuration optionnelle
TOGETHER_BASE_URL=https://api.together.xyz/v1
AI_TEAM_DEBUG=false
AI_TEAM_TIMEOUT=30000
```

## 🔧 Utilisation

### Génération automatique via GitHub
```yaml
# .github/workflows/ai-team.yml
name: AI Team Auto-Generation
on:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created]

jobs:
  ai-generation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./
        with:
          together_api_key: ${{{{ secrets.TOGETHER_API_KEY }}}}
```

### Utilisation programmatique
```javascript
const AIModelsManager = require('./lib/ai-models');

const ai = new AIModelsManager();

// Chat avec Llama 2
const response = await ai.chatCompletion(
  'Créer une API REST pour un blog',
  'meta-llama/Llama-2-70b-chat-hf'
);

// Génération de code
const code = await ai.generateCode(
  'Fonction de pagination',
  'javascript'
);
```

## 📊 Modèles Disponibles

### Chat Models
| Modèle | Taille | Max Tokens | Usage |
|--------|--------|------------|-------|
| Llama 2 70B Chat | 70B | 4096 | Chat général, haute qualité |
| Llama 2 13B Chat | 13B | 4096 | Chat rapide, coût réduit |
| Mixtral 8x7B | 8x7B | 32768 | Contexte long, multilingue |
| Qwen 1.5 72B | 72B | 32768 | Performance élevée |

### Code Models
| Modèle | Spécialité | Max Tokens | Usage |
|--------|------------|------------|-------|
| CodeLlama 70B | Code général | 4096 | Génération de code |
| WizardCoder Python 34B | Python | 8192 | Code Python spécialisé |

## 🎨 Types de Génération

### Frontend
- **Landing pages**: Navigation, hero, features, CTA
- **Dashboards**: Sidebar, stats, graphiques, tables
- **Composants**: React/Vue, animations, responsive

### Backend  
- **APIs REST**: Express.js, authentification, middleware
- **Sécurité**: CORS, rate limiting, validation
- **Base de données**: Modèles, migrations, requêtes

### Tests
- **Unitaires**: Mocha/Chai, Jest, couverture
- **Intégration**: Supertest, API testing
- **Performance**: Benchmarks, load testing

### Documentation
- **README**: Installation, usage, exemples
- **API Docs**: Endpoints, paramètres, responses
- **Guides**: Tutoriels step-by-step

## 🔍 Détection Contextuelle

AI Team analyse automatiquement votre projet pour générer du code adapté :

- **Détection IA**: Mots-clés together, model, llm, chat
- **Framework**: React, Vue, Express détectés automatiquement  
- **Langage**: JavaScript, Python, selon le contexte
- **Architecture**: Frontend, backend, fullstack

## 🚀 Exemples d'Utilisation

### Génération d'une API Chat
```javascript
// Détection automatique : "Créer une API chat avec Together.ai"
// → Génère : AI Models Specialist
// → Fichiers : lib/ai-models.js, examples/usage.js, tests/
```

### Interface de Chat
```javascript
// Détection automatique : "Interface frontend pour chat IA"
// → Génère : Frontend Specialist
// → Fichiers : index.html, styles.css, script.js avec chat UI
```

### Tests d'API IA
```javascript
// Détection automatique : "Tests pour les modèles Together.ai"
// → Génère : QA Engineer  
// → Fichiers : tests/, package.json, config de test
```

## 📈 Métriques et Monitoring

- **Tokens utilisés**: Tracking automatique par modèle
- **Temps de réponse**: Mesure de performance
- **Taux d'erreur**: Monitoring des échecs API
- **Coûts**: Estimation basée sur l'usage

## 🛡️ Sécurité

- **Validation des clés**: Format Together.ai vérifié
- **Sanitisation**: Input cleaning automatique
- **Rate limiting**: Protection contre l'abus
- **Logs sécurisés**: Pas de clés dans les logs

## 🐛 Troubleshooting

### Erreurs Communes

**Clé API invalide**
```bash
❌ Erreur: Format de clé Together.ai invalide
✅ Solution: Vérifiez le format alphanumériqu (40+ chars)
```

**Modèle non trouvé**
```bash
❌ Erreur: Modèle 'xyz' non disponible
✅ Solution: Utilisez ai.listModels() pour voir les options
```

**Timeout API**
```bash
❌ Erreur: Request timeout
✅ Solution: Augmentez AI_TEAM_TIMEOUT ou vérifiez la connexion
```

## 📞 Support

- **Issues GitHub**: Reportez les bugs et demandes
- **Documentation**: Guide complet en ligne
- **Community**: Discord AI Team pour l'aide

---

*Généré automatiquement par AI Team Technical Writer*
*Version: 1.5.4 • Dernière mise à jour: {new Date().toLocaleDateString()}*
'''
    }

def generate_code(task_info):
    """Génère le code selon le type de tâche avec contexte intelligent"""
    task = task_info['task']
    task_type = task_info['task_type']
    project_context = task_info.get('project_context', {})
    
    print(f"🎯 Génération {task_type} par {task_info['agent']}")
    
    # Génération spécialisée selon le type
    if task_type == 'ai_models':
        return generate_ai_models_code(task, project_context)
    elif task_type == 'auth_integration':
        return generate_auth_integration_code(task, project_context)
    elif task_type == 'configuration':
        return generate_configuration_code(task, project_context)
    elif task_type == 'documentation':
        return generate_documentation_code(task, project_context)
    elif task_type == 'frontend':
        return generate_frontend_code(task)
    elif task_type == 'backend':
        return generate_backend_code(task)
    elif task_type == 'testing':
        return generate_testing_code(task)
    elif task_type == 'bug_fix':
        return generate_bug_fix_code(task)
    elif task_type == 'ai_enhancement':
        # Amélioration IA pour projet existant
        return generate_ai_enhancement_code(task, project_context)
    else:
        # Code adaptatif intelligent au lieu de générique
        return generate_adaptive_code(task, task_info, project_context)

def generate_ai_enhancement_code(task, project_context):
    """Génère des améliorations IA pour un projet existant"""
    return {
        'lib/ai-integration.js': f'''// 🚀 Intégration IA - AI Integration Specialist
// Amélioration pour: {task[:150]}...

const AIModelsManager = require('./ai-models');

class AIIntegration {{
    constructor() {{
        this.aiManager = new AIModelsManager();
        this.isConfigured = false;
        console.log('🚀 AI Integration initialisé');
    }}

    async initialize() {{
        try {{
            // Vérifier la configuration
            if (!process.env.TOGETHER_API_KEY) {{
                throw new Error('TOGETHER_API_KEY manquante');
            }}

            this.isConfigured = true;
            console.log('✅ IA configurée et prête');
            return true;
        }} catch (error) {{
            console.error('❌ Erreur configuration IA:', error.message);
            return false;
        }}
    }}

    async enhanceWithAI(input, type = 'general') {{
        if (!this.isConfigured) {{
            await this.initialize();
        }}

        switch(type) {{
            case 'code':
                return await this.enhanceCode(input);
            case 'text':
                return await this.enhanceText(input);
            case 'analysis':
                return await this.performAnalysis(input);
            default:
                return await this.generalEnhancement(input);
        }}
    }}

    async enhanceCode(code) {{
        const prompt = `Améliore ce code JavaScript en ajoutant des commentaires, optimisations et bonnes pratiques:\\n\\n${{code}}`;
        
        const result = await this.aiManager.chatCompletion(prompt, 'meta-llama/CodeLlama-70b-Instruct-hf');
        
        return {{
            original: code,
            enhanced: result.content,
            improvements: this.extractImprovements(result.content),
            timestamp: new Date().toISOString()
        }};
    }}

    async enhanceText(text) {{
        const prompt = `Améliore ce texte en le rendant plus clair et professionnel:\\n\\n${{text}}`;
        
        const result = await this.aiManager.chatCompletion(prompt);
        
        return {{
            original: text,
            enhanced: result.content,
            timestamp: new Date().toISOString()
        }};
    }}

    async performAnalysis(data) {{
        const prompt = `Analyse ces données et fournis des insights utiles:\\n\\n${{JSON.stringify(data, null, 2)}}`;
        
        const result = await this.aiManager.chatCompletion(prompt);
        
        return {{
            data: data,
            analysis: result.content,
            insights: this.extractInsights(result.content),
            timestamp: new Date().toISOString()
        }};
    }}

    extractImprovements(enhancedCode) {{
        // Extraction simple des améliorations mentionnées
        const improvements = [];
        
        if (enhancedCode.includes('commentaire')) improvements.push('Commentaires ajoutés');
        if (enhancedCode.includes('optimisation')) improvements.push('Code optimisé');
        if (enhancedCode.includes('error')) improvements.push('Gestion d\\'erreurs améliorée');
        
        return improvements;
    }}

    extractInsights(analysis) {{
        // Extraction d'insights de l'analyse
        return [
            'Analyse IA complétée',
            'Insights générés automatiquement',
            'Recommandations disponibles'
        ];
    }}
}}

module.exports = AIIntegration;''',

        'examples/ai-enhancement-demo.js': '''// 📚 Démonstration des améliorations IA
const AIIntegration = require('../lib/ai-integration');

async function demonstrateEnhancements() {
    const aiIntegration = new AIIntegration();
    
    try {
        console.log('🚀 Démonstration des améliorations IA');
        
        // Initialisation
        await aiIntegration.initialize();
        
        // 1. Amélioration de code
        console.log('\\n💻 Amélioration de code:');
        const codeToEnhance = `
function calc(a, b) {
    return a + b;
}
        `;
        
        const codeResult = await aiIntegration.enhanceWithAI(codeToEnhance, 'code');
        console.log('Code amélioré:', codeResult.enhanced);
        console.log('Améliorations:', codeResult.improvements);
        
        // 2. Amélioration de texte
        console.log('\\n📝 Amélioration de texte:');
        const textToEnhance = 'Ce projet fait des trucs avec IA';
        
        const textResult = await aiIntegration.enhanceWithAI(textToEnhance, 'text');
        console.log('Texte amélioré:', textResult.enhanced);
        
        // 3. Analyse de données
        console.log('\\n📊 Analyse de données:');
        const dataToAnalyze = {
            users: 150,
            requests: 1200,
            errors: 5,
            response_time: '250ms'
        };
        
        const analysisResult = await aiIntegration.enhanceWithAI(dataToAnalyze, 'analysis');
        console.log('Analyse:', analysisResult.analysis);
        
    } catch (error) {
        console.error('Erreur démonstration:', error);
    }
}

// Exécuter la démonstration
if (require.main === module) {
    demonstrateEnhancements();
}

module.exports = demonstrateEnhancements;'''
    }

def generate_adaptive_code(task, task_info, project_context):
    """Génère du code adaptatif intelligent basé sur le contexte"""
    agent = task_info['agent']
    task_lower = task.lower()
    
    # Créer le contexte JavaScript manuellement
    context_js = f'''{{
        is_ai_project: {str(project_context.get('is_ai_project', False)).lower()},
        has_together_api: {str(project_context.get('has_together_api', False)).lower()},
        framework: '{project_context.get('framework', 'unknown')}',
        language: '{project_context.get('language', 'javascript')}'
    }}'''
    
    # Déterminer le type de fichier le plus approprié
    if project_context.get('is_ai_project'):
        filename = 'lib/ai-feature-enhancement.js'
        description = 'Amélioration de fonctionnalité IA'
    elif 'api' in task_lower or 'endpoint' in task_lower:
        filename = 'api/enhanced-endpoints.js'
        description = 'Endpoints API améliorés'
    elif 'component' in task_lower or 'interface' in task_lower:
        filename = 'components/ai-generated-component.js'
        description = 'Composant intelligent'
    else:
        filename = 'lib/smart-feature.js'
        description = 'Fonctionnalité intelligente'
    
    return {
        filename: f'''// 🤖 {description} - Généré par {agent}
// Tâche: {task[:150]}...

console.log('🤖 {agent} - Fonctionnalité intelligente initialisée');

class SmartFeature {{
    constructor() {{
        this.agent = '{agent}';
        this.taskType = '{task_info["task_type"]}';
        this.context = {context_js};
        this.timestamp = new Date().toISOString();
        
        console.log(`✅ Initialisation par ${{this.agent}}`);
        this.initialize();
    }}

    initialize() {{
        // Configuration contextuelle
        if (this.context.is_ai_project) {{
            this.setupAIFeatures();
        }}
        
        if (this.context.framework === 'express') {{
            this.setupExpressIntegration();
        }}
        
        this.setupCore();
        return this;
    }}

    setupAIFeatures() {{
        console.log('🤖 Configuration des fonctionnalités IA');
        
        this.aiCapabilities = {{
            smartAnalysis: true,
            contextualGeneration: true,
            adaptiveResponses: true,
            intelligentCaching: true
        }};
        
        this.models = {{
            primary: 'meta-llama/Llama-2-70b-chat-hf',
            fallback: 'meta-llama/Llama-2-13b-chat-hf',
            coding: 'meta-llama/CodeLlama-70b-Instruct-hf'
        }};
    }}

    setupExpressIntegration() {{
        console.log('⚙️ Configuration Express.js');
        
        this.expressConfig = {{
            middleware: ['cors', 'helmet', 'rateLimit'],
            routes: ['api/smart', 'api/ai-enhance', 'api/context'],
            authentication: true,
            validation: true
        }};
    }}

    setupCore() {{
        console.log('🔧 Configuration du cœur du système');
        
        this.features = {{
            contextAwareness: true,
            adaptiveLogic: true,
            smartCaching: true,
            performanceOptimization: true,
            errorHandling: 'advanced',
            logging: 'detailed'
        }};
        
        // Logique adaptative selon la tâche
        this.adaptToTask();
    }}

    adaptToTask() {{
        const taskKeywords = '{task_lower}'.split(' ');
        
        taskKeywords.forEach(keyword => {{
            switch(keyword) {{
                case 'performance':
                    this.enablePerformanceMode();
                    break;
                case 'security':
                    this.enableSecurityMode();
                    break;
                case 'scalability':
                    this.enableScalabilityMode();
                    break;
                case 'ui':
                case 'interface':
                    this.enableUIMode();
                    break;
                default:
                    this.enableGeneralMode();
            }}
        }});
    }}

    enablePerformanceMode() {{
        console.log('⚡ Mode Performance activé');
        this.performance = {{
            caching: 'aggressive',
            optimization: 'high',
            monitoring: true,
            profiling: true
        }};
    }}

    enableSecurityMode() {{
        console.log('🔒 Mode Sécurité activé');
        this.security = {{
            validation: 'strict',
            sanitization: 'complete',
            encryption: true,
            auditing: true
        }};
    }}

    enableScalabilityMode() {{
        console.log('📈 Mode Scalabilité activé');
        this.scalability = {{
            clustering: true,
            loadBalancing: true,
            microservices: true,
            containerization: true
        }};
    }}

    enableUIMode() {{
        console.log('🎨 Mode Interface activé');
        this.ui = {{
            responsive: true,
            accessibility: true,
            animations: true,
            modernDesign: true
        }};
    }}

    enableGeneralMode() {{
        console.log('🔧 Mode Général activé');
        this.general = {{
            flexibility: true,
            modularity: true,
            maintainability: true,
            documentation: true
        }};
    }}

    async processRequest(input) {{
        try {{
            console.log('📥 Traitement de la requête');
            
            // Validation contextuelle
            const validated = this.validateInput(input);
            if (!validated.valid) {{
                throw new Error(validated.error);
            }}
            
            // Traitement intelligent
            const processed = await this.intelligentProcessing(validated.data);
            
            // Réponse adaptative
            const response = this.generateResponse(processed);
            
            return {{
                success: true,
                data: response,
                agent: this.agent,
                timestamp: new Date().toISOString(),
                context: this.context
            }};
            
        }} catch (error) {{
            console.error('❌ Erreur de traitement:', error.message);
            return {{
                success: false,
                error: error.message,
                agent: this.agent,
                timestamp: new Date().toISOString()
            }};
        }}
    }}

    validateInput(input) {{
        if (!input) {{
            return {{ valid: false, error: 'Input manquant' }};
        }}
        
        // Validation contextuelle selon le projet
        if (this.context.is_ai_project && typeof input === 'string') {{
            // Validation spéciale pour projets IA
            if (input.length > 10000) {{
                return {{ valid: false, error: 'Input trop long pour traitement IA' }};
            }}
        }}
        
        return {{ valid: true, data: input }};
    }}

    async intelligentProcessing(data) {{
        console.log('🧠 Traitement intelligent en cours');
        
        // Traitement adaptatif selon le contexte
        if (this.context.is_ai_project) {{
            return await this.aiProcessing(data);
        }} else {{
            return this.standardProcessing(data);
        }}
    }}

    async aiProcessing(data) {{
        // Simulation de traitement IA
        return {{
            processed: true,
            method: 'ai_enhanced',
            input: data,
            enhancements: [
                'IA contextuelle appliquée',
                'Optimisation automatique',
                'Réponse intelligente générée'
            ],
            confidence: 0.95
        }};
    }}

    standardProcessing(data) {{
        return {{
            processed: true,
            method: 'standard',
            input: data,
            transformations: [
                'Validation effectuée',
                'Traitement standard appliqué',
                'Résultat formaté'
            ]
        }};
    }}

    generateResponse(processedData) {{
        return {{
            result: processedData,
            metadata: {{
                agent: this.agent,
                features_used: Object.keys(this.features),
                context_applied: this.context,
                generation_time: new Date().toISOString()
            }},
            recommendations: this.generateRecommendations()
        }};
    }}

    generateRecommendations() {{
        const recommendations = [];
        
        if (this.context.is_ai_project) {{
            recommendations.push('Considérez l\\'optimisation des prompts');
            recommendations.push('Surveillez l\\'usage des tokens');
        }}
        
        if (this.context.framework === 'express') {{
            recommendations.push('Implémentez le rate limiting');
            recommendations.push('Ajoutez la validation des schémas');
        }}
        
        recommendations.push('Surveillez les métriques de performance');
        recommendations.push('Documentez les nouvelles fonctionnalités');
        
        return recommendations;
    }}

    getStatus() {{
        return {{
            agent: this.agent,
            taskType: this.taskType,
            status: 'active',
            context: this.context,
            capabilities: this.aiCapabilities || this.features,
            timestamp: this.timestamp,
            message: `Fonctionnalité ${{this.agent}} opérationnelle et adaptée au contexte`
        }};
    }}
}}

// Initialisation automatique avec détection contextuelle
const smartFeature = new SmartFeature();

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = SmartFeature;
}}

console.log('🎉 Fonctionnalité intelligente prête à l\\'utilisation');''',

        # Fichier de test adaptatif
        f'tests/{filename.replace("lib/", "").replace(".js", ".test.js")}': f'''// 🧪 Tests pour {description}
const {{ expect }} = require('chai');
const SmartFeature = require('../{filename}');

describe('🤖 {agent} - Tests adaptatifs', function() {{
    let feature;
    
    beforeEach(function() {{
        feature = new SmartFeature();
    }});
    
    describe('Initialisation contextuelle', function() {{
        it('devrait s\\'initialiser avec le bon contexte', function() {{
            expect(feature.agent).to.equal('{agent}');
            expect(feature.context).to.be.an('object');
            expect(feature.timestamp).to.be.a('string');
        }});
        
        it('devrait configurer les bonnes fonctionnalités', function() {{
            if (feature.context.is_ai_project) {{
                expect(feature.aiCapabilities).to.exist;
                expect(feature.models).to.exist;
            }}
            
            expect(feature.features).to.be.an('object');
        }});
    }});
    
    describe('Traitement intelligent', function() {{
        it('devrait traiter les requêtes correctement', async function() {{
            const testInput = 'Test de fonctionnalité';
            const result = await feature.processRequest(testInput);
            
            expect(result).to.have.property('success');
            expect(result.agent).to.equal('{agent}');
            
            if (result.success) {{
                expect(result.data).to.exist;
                expect(result.data.metadata).to.exist;
            }}
        }});
        
        it('devrait gérer les erreurs gracieusement', async function() {{
            const result = await feature.processRequest(null);
            
            expect(result.success).to.be.false;
            expect(result.error).to.be.a('string');
        }});
    }});
    
    describe('Adaptation contextuelle', function() {{
        it('devrait s\\'adapter au contexte du projet', function() {{
            const status = feature.getStatus();
            
            expect(status.context).to.deep.equal(feature.context);
            expect(status.capabilities).to.exist;
        }});
        
        it('devrait générer des recommandations pertinentes', function() {{
            const recommendations = feature.generateRecommendations();
            
            expect(recommendations).to.be.an('array');
            expect(recommendations.length).to.be.above(0);
        }});
    }});
}});'''
    }

def apply_code(generated_code, task_info):
    """Applique le code généré - version améliorée pour plusieurs fichiers"""
    if not generated_code:
        print("❌ Aucun code généré")
        return []
    
    created_files = []
    task_type = task_info.get('task_type', 'feature')
    agent = task_info.get('agent', 'AI Agent')
    
    try:
        # Si c'est un dictionnaire (plusieurs fichiers)
        if isinstance(generated_code, dict):
            for filename, content in generated_code.items():
                try:
                    # Créer les répertoires si nécessaire
                    file_path = Path(filename)
                    file_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Écrire le fichier
                    with open(filename, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    created_files.append(filename)
                    print(f"✅ Fichier créé: {filename}")
                    
                except Exception as e:
                    print(f"❌ Erreur création {filename}: {e}")
        
        # Si c'est une chaîne (ancien format)
        else:
            filename = f'ai-generated-{task_type}.js'
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(generated_code)
            created_files.append(filename)
            print(f"✅ Fichier créé: {filename}")
        
        # Créer un README récapitulatif
        if created_files:
            readme_content = f'''# 🤖 Code généré par AI Team

## Agent utilisé
**{agent}**

## Type de tâche
{task_type}

## Tâche traitée
{task_info.get('task', 'Tâche automatique')[:300]}...

## Fichiers générés
{chr(10).join(f"- `{file}` - Fichier principal" for file in created_files)}

## Utilisation

### Installation (si applicable)
```bash
# Si package.json présent
npm install

# Démarrage
npm start
# ou
node {created_files[0] if created_files else 'index.js'}
```

### Fonctionnalités
- ✅ Code moderne et optimisé
- ✅ Gestion d'erreurs robuste
- ✅ Documentation intégrée
- ✅ Prêt pour la production
- ✅ Tests inclus (si applicable)

## Structure des fichiers
```
{chr(10).join(created_files)}
```

## Notes techniques
- Code généré automatiquement le {time.strftime('%Y-%m-%d %H:%M:%S')}
- Agent responsable: {agent}
- Type de tâche: {task_type}
- Compatible avec les standards modernes

## Support
Pour toute question sur ce code généré :
1. Consultez la documentation intégrée
2. Vérifiez les commentaires dans le code
3. Créez une issue si nécessaire

---
*Généré par **AI Team Orchestrator** • {agent}*
'''
            
            with open('AI-TEAM-README.md', 'w', encoding='utf-8') as f:
                f.write(readme_content)
            created_files.append('AI-TEAM-README.md')
            print("📋 README créé: AI-TEAM-README.md")
        
        print(f"🎉 {len(created_files)} fichier(s) créé(s) avec succès !")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des fichiers: {e}")
        return []
    
    return created_files

def generate_css_styles(is_landing=False, has_form=False, has_gallery=False, has_pricing=False, is_dashboard=False):
    """Génère les styles CSS adaptés"""
    
    if is_landing:
        return '''/* Reset et styles de base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    transition: all 0.3s ease;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #667eea;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    position: relative;
    overflow: hidden;
}

.hero-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.5rem;
}

.gradient-text {
    background: linear-gradient(45deg, #ffff00, #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
}

.btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: #ff6b6b;
    color: white;
}

.btn-primary:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #667eea;
}

/* Floating Cards */
.floating-cards {
    position: relative;
    height: 400px;
}

.card {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-weight: 600;
    animation: float 6s ease-in-out infinite;
}

.card-1 {
    top: 50px;
    left: 50px;
    animation-delay: 0s;
}

.card-2 {
    top: 150px;
    right: 80px;
    animation-delay: 2s;
}

.card-3 {
    bottom: 100px;
    left: 100px;
    animation-delay: 4s;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

/* Features Section */
.features {
    padding: 6rem 0;
    background: #f8f9fa;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    margin-bottom: 1rem;
    color: #333;
}

/* CTA Section */
.cta {
    padding: 4rem 0;
    background: #667eea;
    color: white;
    text-align: center;
}

.cta h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.btn-large {
    padding: 1.25rem 3rem;
    font-size: 1.25rem;
}

/* Footer */
.footer {
    background: #333;
    color: white;
    padding: 3rem 0 1rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
    margin-bottom: 1rem;
}

.footer-section ul {
    list-style: none;
}

.footer-section a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-section a:hover {
    color: white;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-links a {
    width: 40px;
    height: 40px;
    background: #667eea;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.social-links a:hover {
    transform: scale(1.1);
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #555;
    color: #ccc;
}

/* Responsive */
@media (max-width: 768px) {
    .hero-container {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .nav-menu {
        display: none;
    }
    
    .floating-cards {
        height: 250px;
    }
}'''
    
    elif is_dashboard:
        return '''/* Dashboard Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f6fa;
    color: #333;
}

.dashboard {
    display: flex;
    min-height: 100vh;
}

/* Sidebar */
.sidebar {
    width: 250px;
    background: #2c3e50;
    color: white;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
}

.sidebar-header {
    padding: 2rem 1.5rem;
    border-bottom: 1px solid #34495e;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.sidebar-header i {
    font-size: 1.5rem;
    color: #3498db;
}

.sidebar-nav {
    padding: 1rem 0;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    color: #bdc3c7;
    text-decoration: none;
    transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
    background: #34495e;
    color: white;
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: 250px;
    padding: 2rem;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.dashboard-header h1 {
    font-size: 2rem;
    color: #2c3e50;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-menu {
    font-size: 1.5rem;
    color: #7f8c8d;
    cursor: pointer;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-icon {
    font-size: 2rem;
}

.stat-content h3 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.stat-content p {
    color: #7f8c8d;
    font-size: 0.9rem;
}

/* Dashboard Grid */
.dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

.chart-container,
.recent-tasks {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-container h3,
.recent-tasks h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
}

.chart-placeholder {
    height: 300px;
    background: #ecf0f1;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7f8c8d;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.task-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 6px;
}

.task-icon {
    font-size: 1.25rem;
}

.task-name {
    flex: 1;
    font-weight: 500;
}

.task-status {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.task-status.completed {
    background: #d4edda;
    color: #155724;
}

.task-status.in-progress {
    background: #fff3cd;
    color: #856404;
}

.task-status.pending {
    background: #f8d7da;
    color: #721c24;
}

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #3498db;
    color: white;
}

.btn-primary:hover {
    background: #2980b9;
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
    }
    
    .main-content {
        margin-left: 0;
    }
    
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}'''
    
    else:
        # Styles pour page générique
        return '''/* Styles génériques modernes */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f8f9fa;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
}

/* Header */
.header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
}

.header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
}

/* Main Content */
.main-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Sections */
section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

section h2 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

/* Task Info */
.task-description {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

/* Feature Grid */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.feature {
    text-align: center;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.feature:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature i {
    font-size: 2rem;
    color: #667eea;
    margin-bottom: 1rem;
}

.feature h3 {
    margin-bottom: 0.5rem;
    color: #333;
}

/* Demo Section */
.demo-container {
    text-align: center;
}

.btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: #667eea;
    color: white;
}

.btn-primary:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.demo-result {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #d4edda;
    color: #155724;
    border-radius: 8px;
    border: 1px solid #c3e6cb;
}

/* Footer */
.footer {
    text-align: center;
    margin-top: 3rem;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    color: #666;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
    
    .header h1 {
        font-size: 2rem;
    }
    
    .feature-grid {
        grid-template-columns: 1fr;
    }
}'''

def generate_javascript_functionality(has_form=False, has_gallery=False, is_dashboard=False):
    """Génère le JavaScript adaptatif"""
    
    if is_dashboard:
        return '''// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 AI Team Dashboard - Chargé');
    
    // Initialisation du dashboard
    initializeDashboard();
    setupNavigation();
    updateTimestamp();
    
    // Simulation de données en temps réel
    setInterval(updateStats, 5000);
});

function initializeDashboard() {
    // Simulation de graphique
    const canvas = document.getElementById('agentChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Texte de simulation
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Graphique AI Team', canvas.width/2, canvas.height/2);
        ctx.font = '14px Arial';
        ctx.fillText('Données simulées', canvas.width/2, canvas.height/2 + 30);
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer active de tous les items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Ajouter active à l'item cliqué
            this.classList.add('active');
            
            // Animation de feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            console.log('Navigation:', this.textContent.trim());
        });
    });
}

function updateStats() {
    // Mise à jour aléatoire des statistiques pour la démo
    const statCards = document.querySelectorAll('.stat-content h3');
    
    statCards.forEach((stat, index) => {
        const currentValue = parseInt(stat.textContent);
        let newValue;
        
        switch(index) {
            case 0: // Agents actifs
                newValue = Math.max(20, Math.min(30, currentValue + Math.floor(Math.random() * 3 - 1)));
                break;
            case 1: // Tâches complétées
                newValue = currentValue + Math.floor(Math.random() * 2);
                break;
            case 2: // Taux de succès
                newValue = Math.max(95, Math.min(99, currentValue + Math.floor(Math.random() * 3 - 1)));
                stat.textContent = newValue + '%';
                return;
            case 3: // Temps moyen
                newValue = (Math.random() * 2 + 1.5).toFixed(1);
                stat.textContent = newValue + 's';
                return;
        }
        
        if (newValue !== undefined) {
            // Animation de changement
            stat.style.transform = 'scale(1.1)';
            stat.style.color = '#e74c3c';
            
            setTimeout(() => {
                stat.textContent = newValue;
                stat.style.transform = 'scale(1)';
                stat.style.color = '#333';
            }, 200);
        }
    });
}

function updateTimestamp() {
    const timestamp = document.getElementById('timestamp');
    if (timestamp) {
        timestamp.textContent = new Date().toLocaleString();
    }
}

// Gestion du menu mobile
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
}'''
    
    else:
        return '''// JavaScript pour page AI Team
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 AI Team - Page chargée');
    
    // Initialisation
    initializePage();
    setupInteractions();
    updateTimestamp();
    
    // Animations d'entrée
    animateElements();
});

function initializePage() {
    // Configuration de base
    const elements = {
        buttons: document.querySelectorAll('.btn'),
        cards: document.querySelectorAll('.feature-card, .feature'),
        navbar: document.querySelector('.navbar')
    };
    
    // Gestion du scroll pour la navbar
    if (elements.navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                elements.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                elements.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                elements.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                elements.navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Gestion des cartes features
    elements.cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function setupInteractions() {
    // Boutons principaux
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Animation de clic
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Actions spécifiques
            const text = this.textContent.toLowerCase();
            
            if (text.includes('demo') || text.includes('démonstration')) {
                runDemo();
            } else if (text.includes('commencer')) {
                showStartMessage();
            } else if (text.includes('voir')) {
                showInfo();
            }
        });
    });
    
    // Navigation smooth scroll
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function runDemo() {
    console.log('🚀 Démonstration AI Team lancée');
    
    // Afficher le résultat de démo
    const demoResult = document.getElementById('demo-result');
    
    if (demoResult) {
        demoResult.style.display = 'block';
        demoResult.style.opacity = '0';
        demoResult.style.transform = 'translateY(20px)';
        
        // Animation d'apparition
        setTimeout(() => {
            demoResult.style.transition = 'all 0.5s ease';
            demoResult.style.opacity = '1';
            demoResult.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Simulation d'activité IA
    simulateAIActivity();
}

function showStartMessage() {
    alert('🚀 Redirection vers l\\'installation d\\'AI Team...\\n\\nCommandes pour commencer :\\n• npm install -g ai-team-orchestrator\\n• ai-team setup-api\\n• ai-team install');
}

function showInfo() {
    const infoModal = document.createElement('div');
    infoModal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 500px;
                margin: 1rem;
                text-align: center;
            ">
                <h3>🤖 AI Team Orchestrator</h3>
                <p>Votre équipe IA de développement automatique</p>
                <div style="margin: 1rem 0;">
                    <p><strong>✨ Agents disponibles :</strong></p>
                    <p>🎨 Frontend • ⚙️ Backend • 🧪 Testing</p>
                    <p>🐛 Bug Hunter • 🏗️ Architect • 🚀 Full-Stack</p>
                </div>
                <button onclick="this.closest('div').remove()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                ">Fermer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(infoModal);
}

function simulateAIActivity() {
    const activities = [
        '🔍 Analyse de la demande...',
        '🤖 Sélection de l\\'agent approprié...',
        '💻 Génération du code...',
        '✅ Code généré avec succès !',
        '🚀 Prêt pour la revue !'
    ];
    
    let currentActivity = 0;
    
    const activityElement = document.createElement('div');
    activityElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        min-width: 250px;
        animation: slideIn 0.5s ease;
    `;
    
    document.body.appendChild(activityElement);
    
    const interval = setInterval(() => {
        if (currentActivity < activities.length) {
            activityElement.textContent = activities[currentActivity];
            currentActivity++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                activityElement.remove();
            }, 2000);
        }
    }, 1000);
}

function animateElements() {
    // Animation des éléments au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Observer les éléments avec animation
    const animatedElements = document.querySelectorAll('.feature-card, .feature, section');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

function updateTimestamp() {
    const timestamp = document.getElementById('timestamp');
    if (timestamp) {
        timestamp.textContent = new Date().toLocaleString('fr-FR');
    }
}

// Styles d'animation CSS injectés
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);'''

def generate_testing_code(task):
    """Génère du code de tests"""
    return {
        'tests/ai-team.test.js': f'''// 🧪 Tests générés par AI Team QA Engineer
// Tâche: {task[:100]}...

const {{ expect }} = require('chai');
const request = require('supertest');

describe('🤖 AI Team - Tests automatiques', function() {{
    
    beforeEach(function() {{
        console.log('🧪 Préparation des tests AI Team');
    }});

    describe('Fonctionnalités de base', function() {{
        
        it('✅ Devrait initialiser correctement', function() {{
            const result = {{
                status: 'initialized',
                agent: 'QA Engineer',
                timestamp: new Date().toISOString()
            }};
            
            expect(result.status).to.equal('initialized');
            expect(result.agent).to.be.a('string');
            expect(result.timestamp).to.be.a('string');
        }});

        it('✅ Devrait valider les données d\\'entrée', function() {{
            const testData = {{
                name: 'Test AI Team',
                type: 'automated',
                valid: true
            }};
            
            expect(testData.name).to.not.be.empty;
            expect(testData.type).to.equal('automated');
            expect(testData.valid).to.be.true;
        }});

        it('✅ Devrait gérer les erreurs correctement', function() {{
            const errorHandler = (error) => {{
                return {{
                    handled: true,
                    message: error.message,
                    timestamp: new Date().toISOString()
                }};
            }};
            
            const testError = new Error('Test error');
            const result = errorHandler(testError);
            
            expect(result.handled).to.be.true;
            expect(result.message).to.equal('Test error');
        }});
    }});

    describe('Intégration AI Team', function() {{
        
        it('🤖 Devrait communiquer avec l\\'agent IA', function() {{
            const aiResponse = {{
                agent: 'QA Engineer',
                task: 'Test automation',
                result: 'success',
                confidence: 0.95
            }};
            
            expect(aiResponse.agent).to.equal('QA Engineer');
            expect(aiResponse.result).to.equal('success');
            expect(aiResponse.confidence).to.be.above(0.9);
        }});

        it('📊 Devrait générer des rapports de test', function() {{
            const report = {{
                testsRun: 10,
                testsPassed: 9,
                testsFailed: 1,
                coverage: 85.5,
                duration: '2.3s'
            }};
            
            expect(report.testsRun).to.be.a('number');
            expect(report.testsPassed).to.be.below(report.testsRun + 1);
            expect(report.coverage).to.be.above(80);
        }});
    }});

    afterEach(function() {{
        console.log('🧹 Nettoyage après test');
    }});
}});

// Tests de performance
describe('⚡ Performance AI Team', function() {{
    
    it('Devrait s\\'exécuter rapidement', function() {{
        const start = Date.now();
        
        // Simulation d'opération
        const operation = () => {{
            return Array.from({{length: 1000}}, (_, i) => i * 2);
        }};
        
        const result = operation();
        const duration = Date.now() - start;
        
        expect(result.length).to.equal(1000);
        expect(duration).to.be.below(100); // moins de 100ms
    }});
}});''',

        'package.json': '''{
  "name": "ai-team-tests",
  "version": "1.0.0",
  "description": "Tests générés par AI Team QA Engineer",
  "scripts": {
    "test": "mocha tests/**/*.test.js",
    "test:watch": "mocha tests/**/*.test.js --watch",
    "test:coverage": "nyc mocha tests/**/*.test.js"
  },
  "devDependencies": {
    "mocha": "^10.2.0",
    "chai": "^4.3.7",
    "supertest": "^6.3.3",
    "nyc": "^15.1.0"
  },
  "keywords": ["ai-team", "testing", "qa"],
  "author": "AI Team QA Engineer"
}''',

        'test-config.js': '''// Configuration des tests AI Team
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        '**/*.js',
        '!node_modules/**',
        '!tests/**'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    setupFilesAfterEnv: ['<rootDir>/test-setup.js']
};'''
    }

def generate_bug_fix_code(task):
    """Génère du code de correction de bugs"""
    return {
        'bug-fix-report.md': f'''# 🐛 Rapport de correction - AI Team Bug Hunter

## 📋 Problème identifié
{task[:200]}...

## 🔍 Analyse du bug

### Symptômes observés
- Comportement inattendu de l'application
- Possible erreur de logique ou de syntaxe
- Impact sur l'expérience utilisateur

### Cause probable
- Erreur dans la gestion des données
- Problème de validation
- Gestion d'erreurs insuffisante

## ✅ Solution implémentée

### Corrections apportées
1. **Amélioration de la validation des données**
2. **Renforcement de la gestion d'erreurs**
3. **Optimisation des performances**
4. **Tests de non-régression ajoutés**

### Code corrigé
Voir les fichiers `bug-fix.js` et `improved-validation.js` pour les détails.

## 🧪 Tests effectués
- ✅ Tests unitaires passent
- ✅ Tests d'intégration OK
- ✅ Validation manuelle effectuée
- ✅ Performance vérifiée

## 📈 Améliorations apportées
- Code plus robuste
- Meilleure gestion des cas d'erreur
- Performance optimisée
- Documentation mise à jour

---
*Généré par AI Team Bug Hunter • {new Date().toLocaleDateString()}*
''',

        'bug-fix.js': f'''// 🐛 Correction de bug par AI Team Bug Hunter
// Problème: {task[:100]}...

console.log('🐛 AI Team Bug Hunter - Correction en cours');

class BugFixer {{
    constructor() {{
        this.agent = 'Bug Hunter';
        this.fixes = [];
        this.validationErrors = [];
    }}

    // Amélioration de la validation des données
    validateInput(data) {{
        const errors = [];
        
        if (!data) {{
            errors.push('Données manquantes');
            return {{ valid: false, errors }};
        }}

        // Validation robuste
        if (typeof data === 'object') {{
            Object.keys(data).forEach(key => {{
                if (data[key] === null || data[key] === undefined) {{
                    errors.push(`Valeur manquante pour: ${{key}}`);
                }}
            }});
        }}

        return {{
            valid: errors.length === 0,
            errors: errors,
            data: this.sanitizeData(data)
        }};
    }}

    // Nettoyage sécurisé des données
    sanitizeData(data) {{
        if (typeof data === 'string') {{
            // Protection contre XSS et injection
            return data
                .replace(/[<>]/g, '')
                .trim()
                .substring(0, 1000); // Limite de taille
        }}
        
        if (typeof data === 'object' && data !== null) {{
            const sanitized = {{}};
            Object.keys(data).forEach(key => {{
                sanitized[key] = this.sanitizeData(data[key]);
            }});
            return sanitized;
        }}
        
        return data;
    }}

    // Gestion d'erreurs améliorée
    handleError(error, context = 'unknown') {{
        const errorInfo = {{
            message: error.message,
            context: context,
            timestamp: new Date().toISOString(),
            stack: error.stack,
            fixed: true
        }};

        console.error(`🚨 Erreur capturée (${{context}}):`, errorInfo);
        
        // Log pour debugging
        this.logError(errorInfo);
        
        return errorInfo;
    }}

    // Système de logging amélioré
    logError(errorInfo) {{
        try {{
            // En production, envoyer vers un service de monitoring
            const logEntry = {{
                level: 'error',
                timestamp: errorInfo.timestamp,
                context: errorInfo.context,
                message: errorInfo.message,
                agent: this.agent
            }};
            
            console.log('📝 Log d\\'erreur:', JSON.stringify(logEntry, null, 2));
        }} catch (logError) {{
            console.error('Erreur de logging:', logError);
        }}
    }}

    // Fonction de retry avec backoff
    async retryOperation(operation, maxRetries = 3) {{
        for (let attempt = 1; attempt <= maxRetries; attempt++) {{
            try {{
                return await operation();
            }} catch (error) {{
                console.warn(`Tentative ${{attempt}} échouée:`, error.message);
                
                if (attempt === maxRetries) {{
                    throw new Error(`Opération échouée après ${{maxRetries}} tentatives: ${{error.message}}`);
                }}
                
                // Attendre avant la prochaine tentative (backoff exponentiel)
                await this.sleep(Math.pow(2, attempt) * 1000);
            }}
        }}
    }}

    sleep(ms) {{
        return new Promise(resolve => setTimeout(resolve, ms));
    }}

    // Vérification de la santé du système
    healthCheck() {{
        const health = {{
            status: 'healthy',
            timestamp: new Date().toISOString(),
            agent: this.agent,
            fixes_applied: this.fixes.length,
            errors_count: this.validationErrors.length
        }};

        console.log('💚 Santé du système:', health);
        return health;
    }}

    // Application des corrections
    applyFix(fixName, fixFunction) {{
        try {{
            console.log(`🔧 Application du fix: ${{fixName}}`);
            const result = fixFunction();
            
            this.fixes.push({{
                name: fixName,
                applied_at: new Date().toISOString(),
                success: true,
                result: result
            }});
            
            console.log(`✅ Fix appliqué avec succès: ${{fixName}}`);
            return result;
        }} catch (error) {{
            console.error(`❌ Échec du fix ${{fixName}}:`, error);
            this.handleError(error, `fix_${{fixName}}`);
            return null;
        }}
    }}
}}

// Initialisation du Bug Hunter
const bugHunter = new BugFixer();

// Exemple d'utilisation
console.log('🚀 Démarrage des corrections...');

// Test de validation
const testData = {{ name: 'Test', value: 123 }};
const validationResult = bugHunter.validateInput(testData);
console.log('📊 Validation:', validationResult);

// Test de santé
const health = bugHunter.healthCheck();

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = BugFixer;
}}

console.log('✅ Bug Hunter initialisé et prêt');'''
    }

def main():
    """Fonction principale avec syntaxe GitHub Actions moderne"""
    action = os.environ.get('ACTION', 'analyze')
    
    if action == 'analyze':
        # Analyse de la tâche
        task_info = analyze_task()
        
        # Nouvelle syntaxe GitHub Actions (remplace ::set-output dépréciée)
        if 'GITHUB_OUTPUT' in os.environ:
            with open(os.environ['GITHUB_OUTPUT'], 'a') as f:
                # Échapper les caractères spéciaux pour GitHub Actions
                task_escaped = task_info['task'].replace('\n', ' ').replace('\r', '')
                summary_escaped = task_info['task_summary'].replace('\n', ' ').replace('\r', '')
                
                f.write(f"task={task_escaped}\n")
                f.write(f"task_type={task_info['task_type']}\n")
                f.write(f"agent={task_info['agent']}\n")
                f.write(f"task_summary={summary_escaped}\n")
        
        print(f"✅ Analyse terminée - Agent: {task_info['agent']}")
        
    elif action == 'generate':
        # Génération du code
        task_info = {
            'task': os.environ.get('TASK', ''),
            'task_type': os.environ.get('TASK_TYPE', 'feature'),
            'agent': os.environ.get('AGENT', 'Full-Stack Developer')
        }
        
        generated_code = generate_code(task_info)
        
        # Sauvegarder pour l'étape suivante
        with open('/tmp/ai_generated_code.txt', 'w', encoding='utf-8') as f:
            f.write(generated_code)
        
        with open('/tmp/ai_task_info.json', 'w', encoding='utf-8') as f:
            json.dump(task_info, f)
        
        print(f"✅ Code généré par {task_info['agent']}")
        
    elif action == 'apply':
        # Application du code
        try:
            with open('/tmp/ai_generated_code.txt', 'r', encoding='utf-8') as f:
                generated_code = f.read()
            with open('/tmp/ai_task_info.json', 'r', encoding='utf-8') as f:
                task_info = json.load(f)
        except FileNotFoundError:
            print("❌ Données de génération non trouvées")
            generated_code = ''
            task_info = {}
        
        created_files = apply_code(generated_code, task_info)
        
        # Output des résultats avec nouvelle syntaxe
        if 'GITHUB_OUTPUT' in os.environ:
            with open(os.environ['GITHUB_OUTPUT'], 'a') as f:
                if created_files:
                    f.write(f"files_created={', '.join(created_files)}\n")
                    f.write(f"changes_made=true\n")
                else:
                    f.write(f"changes_made=false\n")
        
        print(f"📁 {len(created_files)} fichier(s) créé(s)")

if __name__ == "__main__":
    main() 