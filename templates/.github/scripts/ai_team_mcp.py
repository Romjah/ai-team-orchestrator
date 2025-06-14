#!/usr/bin/env python3
"""
🤖 AI Team Orchestrator avec Together.ai
Utilise DeepSeek R1 pour la génération de code de haute qualité
"""

import os
import json
import time
import subprocess
import sys
import requests
from pathlib import Path
from typing import Dict, List, Optional

# Charger les variables d'environnement depuis .env si disponible
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Variables d'environnement chargées depuis .env")
except ImportError:
    print("💡 python-dotenv non disponible, utilisation des variables d'environnement système")
except Exception as e:
    print(f"⚠️ Erreur lors du chargement de .env: {e}")

class AITeamMCP:
    def __init__(self):
        self.repo_owner = os.environ.get('GITHUB_REPOSITORY_OWNER', '')
        self.repo_name = os.environ.get('GITHUB_REPOSITORY', '').split('/')[-1]
        self.issue_number = os.environ.get('GITHUB_EVENT_ISSUE_NUMBER', '')
        self.GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
        self.together_api_key = os.environ.get('TOGETHER_AI_API_KEY', '')
        self.together_url = "https://api.together.xyz/v1/chat/completions"
        
    def analyze_task(self) -> Dict:
        """Analyse la tâche et détermine l'agent approprié avec DeepSeek R1"""
        issue_title = os.environ.get('ISSUE_TITLE', '')
        issue_body = os.environ.get('ISSUE_BODY', '')
        
        task = f"{issue_title}\n{issue_body}"
        task_lower = task.lower()
        
        # Classification intelligente avec DeepSeek R1
        headers = {
            "Authorization": f"Bearer {self.together_api_key}",
            "Content-Type": "application/json"
        }
        
        classification_prompt = f"""Analyze this development task and classify it. Return ONLY a JSON object:

Task: {task}

Return format:
{{
    "task_type": "frontend|backend|testing|bug_fix|refactor|feature",
    "agent": "agent name with emoji",
    "task_summary": "brief summary in French",
    "priority": "high|medium|low",
    "technologies": ["tech1", "tech2"]
}}

Choose the best task_type based on the content."""

        try:
            response = requests.post(
                self.together_url,
                headers=headers,
                json={
                    "model": "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
                    "messages": [
                        {"role": "system", "content": "You are an expert development task analyzer. Always return valid JSON."},
                        {"role": "user", "content": classification_prompt}
                    ],
                    "max_tokens": 300,
                    "temperature": 0.1
                },
                timeout=30
            )
            response.raise_for_status()
            
            result_data = response.json()
            content = result_data['choices'][0]['message']['content']
            
            # Extraire le JSON de la réponse
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                classification = json.loads(json_match.group())
                return {
                    'task': task,
                    'task_type': classification.get('task_type', 'feature'),
                    'agent': classification.get('agent', 'Full-Stack Developer 🚀'),
                    'task_summary': classification.get('task_summary', task[:100].replace('\n', ' ')),
                    'priority': classification.get('priority', 'medium'),
                    'technologies': classification.get('technologies', [])
                }
            else:
                # Fallback si le parsing JSON échoue
                raise Exception("JSON parsing failed")
                
        except Exception as e:
            print(f"DeepSeek R1 classification failed: {e}, using fallback classification")
            # Fallback à la classification basique si DeepSeek R1 échoue
            if any(word in task_lower for word in ['bug', 'fix', 'error', 'problème', 'broken']):
                task_type = 'bug_fix'
                agent = 'Bug Hunter 🐛'
            elif any(word in task_lower for word in ['test', 'testing', 'spec', 'qa']):
                task_type = 'testing'
                agent = 'QA Engineer 🧪'
            elif any(word in task_lower for word in ['frontend', 'ui', 'css', 'html', 'component', 'landing', 'page', 'design']):
                task_type = 'frontend'
                agent = 'Frontend Specialist 🎨'
            elif any(word in task_lower for word in ['backend', 'api', 'server', 'database', 'endpoint']):
                task_type = 'backend'
                agent = 'Backend Specialist ⚙️'
            elif any(word in task_lower for word in ['refactor', 'optimize', 'clean', 'improve']):
                task_type = 'refactor'
                agent = 'Code Architect 🏗️'
            else:
                task_type = 'feature'
                agent = 'Full-Stack Developer 🚀'
            
            return {
                'task': task,
                'task_type': task_type,
                'agent': agent,
                'task_summary': task[:100].replace('\n', ' '),
                'priority': 'medium',
                'technologies': []
            }
    
    def generate_code_with_ai(self, task_info: Dict) -> Dict[str, str]:
        """Génère du code en utilisant DeepSeek R1"""
        headers = {
            "Authorization": f"Bearer {self.together_api_key}",
            "Content-Type": "application/json"
        }
        
        # Préparer le prompt pour DeepSeek R1 basé sur le type de tâche
        if task_info['task_type'] == 'frontend':
            prompt = f"""Create a modern, professional frontend solution for this task:

Task: {task_info['task']}
Technologies: {', '.join(task_info.get('technologies', ['HTML', 'CSS', 'JavaScript']))}

Generate a complete, production-ready solution with:
1. Modern HTML structure with semantic elements
2. Advanced CSS with animations, gradients, and responsive design
3. Interactive JavaScript functionality
4. Mobile-first responsive design
5. Accessibility features
6. Performance optimizations

Return ONLY the code files in this exact format:
FILE: index.html
[complete HTML content]

FILE: styles.css
[complete CSS content]

FILE: script.js
[complete JavaScript content]

Make it modern, professional, and production-ready."""

        elif task_info['task_type'] == 'backend':
            prompt = f"""Create a professional backend solution for this task:

Task: {task_info['task']}
Technologies: {', '.join(task_info.get('technologies', ['Node.js', 'Express']))}

Generate a complete, production-ready backend with:
1. Express.js server with proper structure
2. RESTful API endpoints
3. Error handling and validation
4. Security middleware
5. Environment configuration
6. Database integration (if needed)
7. API documentation

Return ONLY the code files in this exact format:
FILE: server.js
[complete server code]

FILE: package.json
[complete package.json with all dependencies]

FILE: .env.example
[environment variables template]

Make it secure, scalable, and production-ready."""

        elif task_info['task_type'] == 'bug_fix':
            prompt = f"""Create a bug fix solution for this task:

Task: {task_info['task']}

Generate:
1. Analysis of the potential bug
2. Fix implementation
3. Prevention measures
4. Test cases

Return code files that address the bug with proper error handling and documentation."""

        else:
            prompt = f"""Create a {task_info['task_type']} solution for this task:

Task: {task_info['task']}
Agent: {task_info['agent']}
Technologies: {', '.join(task_info.get('technologies', []))}

Generate appropriate, production-ready code files based on the task requirements.
Include proper documentation, error handling, and best practices.

Return in this format:
FILE: filename.ext
[file content here]

FILE: filename2.ext  
[file content here]"""
        
        try:
            response = requests.post(
                self.together_url,
                headers=headers,
                json={
                    "model": "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
                    "messages": [
                        {"role": "system", "content": f"You are an expert {task_info['agent']} developer. Generate clean, modern, production-ready code with best practices. Always include proper error handling, documentation, and security considerations."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 4000,
                    "temperature": 0.2
                },
                timeout=60
            )
            response.raise_for_status()
            
            result_data = response.json()
            content = result_data['choices'][0]['message']['content']
            
            # Parser les fichiers générés
            files = self.parse_generated_files(content, task_info)
            return files
            
        except Exception as e:
            print(f"DeepSeek R1 code generation failed: {e}, using fallback generation")
            # Fallback à la génération basique
            if task_info['task_type'] == 'frontend':
                return self.generate_frontend_code(task_info['task'])
            elif task_info['task_type'] == 'backend':
                return self.generate_backend_code(task_info['task'])
            else:
                return self.generate_feature_code(task_info)
    
    def parse_generated_files(self, content: str, task_info: Dict) -> Dict[str, str]:
        """Parse les fichiers générés à partir du contenu DeepSeek R1"""
        files = {}
        
        # Chercher les patterns FILE: filename
        lines = content.split('\n')
        current_file = None
        current_content = []
        
        for line in lines:
            if line.startswith('FILE:'):
                # Sauvegarder le fichier précédent
                if current_file and current_content:
                    files[current_file] = '\n'.join(current_content)
                
                # Commencer un nouveau fichier
                current_file = line.replace('FILE:', '').strip()
                current_content = []
            elif current_file:
                current_content.append(line)
        
        # Sauvegarder le dernier fichier
        if current_file and current_content:
            files[current_file] = '\n'.join(current_content)
        
        # Si aucun fichier n'a été parsé, traiter tout le contenu comme un seul fichier
        if not files:
            if task_info['task_type'] == 'frontend':
                files['index.html'] = content
            elif task_info['task_type'] == 'backend':
                files['server.js'] = content
            else:
                files['generated-code.js'] = content
        
        # Ajouter un README
        files['AI-TEAM-README.md'] = f"""# 🤖 Code généré par AI Team

## Agent utilisé
**{task_info['agent']}**

## Tâche traitée
{task_info['task'][:300]}...

## Fichiers générés
{chr(10).join([f'- `{filename}`' for filename in files.keys() if filename != 'AI-TEAM-README.md'])}

## Généré le
{time.strftime('%Y-%m-%d %H:%M:%S')}

---
*Créé automatiquement par AI Team Orchestrator avec DeepSeek R1*
"""
        
        return files

    def generate_code(self, task_info: Dict) -> Dict[str, str]:
        """Point d'entrée principal pour la génération de code"""
        return self.generate_code_with_ai(task_info)

    def generate_frontend_code(self, task):
        """Génère du code frontend moderne"""
        timestamp = int(time.time())
        
        html_content = f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 AI Generated Landing Page</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        
        .hero {{
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            padding: 2rem;
        }}
        
        .hero-content {{
            max-width: 800px;
            animation: fadeInUp 1s ease-out;
        }}
        
        .hero h1 {{
            font-size: 3.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }}
        
        .hero p {{
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }}
        
        .cta-button {{
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            border: 2px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
        }}
        
        .cta-button:hover {{
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }}
        
        .features {{
            padding: 4rem 2rem;
            background: white;
        }}
        
        .features-grid {{
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }}
        
        .feature-card {{
            text-align: center;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }}
        
        .feature-card:hover {{ transform: translateY(-5px); }}
        
        .ai-badge {{
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 0.9rem;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }}
        
        @keyframes fadeInUp {{
            from {{ opacity: 0; transform: translateY(30px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
        
        @media (max-width: 768px) {{
            .hero h1 {{ font-size: 2.5rem; }}
            .features-grid {{ grid-template-columns: 1fr; }}
        }}
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1>🤖 AI Team Generated</h1>
            <p>Cette landing page a été créée automatiquement par AI Team Orchestrator en réponse à votre demande.</p>
            <a href="#features" class="cta-button">🚀 Découvrir</a>
        </div>
    </section>
    
    <section id="features" class="features">
        <div class="features-grid">
            <div class="feature-card">
                <h3>🤖 Code Automatique</h3>
                <p>Génération de code intelligent basée sur vos demandes en langage naturel.</p>
            </div>
            
            <div class="feature-card">
                <h3>🔧 Intégration GitHub</h3>
                <p>Workflow automatique avec création de PR et gestion des issues.</p>
            </div>
            
            <div class="feature-card">
                <h3>⚡ Zero Configuration</h3>
                <p>Aucune configuration requise, ça marche directement après installation.</p>
            </div>
        </div>
    </section>
    
    <div class="ai-badge">
        🤖 Généré par AI Team MCP
    </div>
    
    <script>
        console.log('🤖 Landing page générée par AI Team MCP');
        console.log('Timestamp: {timestamp}');
        console.log('Task: {task[:50]}...');
        
        // Smooth scroll
        document.querySelector('.cta-button').addEventListener('click', function(e) {{
            e.preventDefault();
            document.querySelector('#features').scrollIntoView({{ behavior: 'smooth' }});
        }});
    </script>
</body>
</html>'''
        
        return {
            'ai-generated-page.html': html_content,
            'README-AI-TEAM.md': f'''# 🤖 Code généré par AI Team MCP

## Agent utilisé
**Frontend Specialist 🎨**

## Tâche traitée
{task[:200]}...

## Fichier généré
- `ai-generated-page.html` - Landing page moderne

## Utilisation
Ouvrez le fichier HTML dans votre navigateur pour voir la page.

## Généré le
{time.strftime('%Y-%m-%d %H:%M:%S')}

---
*Créé automatiquement par AI Team Orchestrator avec DeepSeek R1*
'''
        }
    
    def generate_backend_code(self, task):
        """Génère du code backend avec API REST"""
        return {
            'ai-generated-api.js': f'''// 🤖 API générée par AI Team Backend Specialist
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log('🤖 AI Team API démarrée');

app.get('/api/status', (req, res) => {{
    res.json({{
        status: 'success',
        message: 'API générée par AI Team Backend Specialist ⚙️',
        agent: 'Backend Specialist',
        task: '{task[:100]}...',
        timestamp: new Date().toISOString()
    }});
}});

app.post('/api/process', (req, res) => {{
    const {{ data }} = req.body;
    res.json({{
        processed: true,
        input: data,
        result: `Traitement IA: ${{data}}`,
        processed_by: 'AI Team Backend ⚙️',
        timestamp: new Date().toISOString()
    }});
}});

app.listen(PORT, () => {{
    console.log(`🚀 API AI Team sur le port ${{PORT}}`);
}});''',
            
            'package.json': '''{
  "name": "ai-team-generated-api",
  "version": "1.0.0",
  "description": "API générée par AI Team Backend Specialist",
  "main": "ai-generated-api.js",
  "scripts": {
    "start": "node ai-generated-api.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "author": "AI Team Backend Specialist",
  "license": "MIT"
}'''
        }
    
    def generate_feature_code(self, task_info):
        """Génère du code pour les fonctionnalités générales"""
        task = task_info['task']
        agent = task_info['agent']
        task_type = task_info['task_type']
        
        return {
            'ai-generated-feature.js': f'''// 🤖 Fonctionnalité générée par {agent}
// Type: {task_type}
// Tâche: {task[:100]}...

class AIGeneratedFeature {{
    constructor() {{
        this.agent = '{agent}';
        this.taskType = '{task_type}';
        this.timestamp = new Date().toISOString();
        console.log('🤖 Fonctionnalité AI Team initialisée');
    }}
    
    initialize() {{
        console.log(`🚀 Initialisation par ${{this.agent}}`);
        this.setupFeature();
        return this;
    }}
    
    setupFeature() {{
        // Configuration de la fonctionnalité
        const config = {{
            name: 'AI Generated Feature',
            version: '1.0.0',
            agent: this.agent,
            type: this.taskType,
            created: this.timestamp
        }};
        
        console.log('⚙️ Configuration:', config);
        return config;
    }}
    
    execute(data) {{
        console.log(`🔧 Exécution par ${{this.agent}}:`, data);
        
        return {{
            success: true,
            result: `Traité par ${{this.agent}}`,
            data: data,
            timestamp: new Date().toISOString()
        }};
    }}
}}

// Utilisation
const feature = new AIGeneratedFeature();
feature.initialize();

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = AIGeneratedFeature;
}}

console.log('✅ Fonctionnalité AI Team prête!');''',
            
            'test-feature.html': f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 AI Generated Feature Test</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            color: white;
        }}
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }}
        .feature-card {{
            background: rgba(255,255,255,0.2);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }}
        button {{
            background: #00b894;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }}
        button:hover {{ background: #00a085; }}
        #output {{
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-family: monospace;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI Generated Feature</h1>
        <div class="feature-card">
            <h3>Agent: {agent}</h3>
            <p><strong>Type:</strong> {task_type}</p>
            <p><strong>Tâche:</strong> {task[:150]}...</p>
        </div>
        
        <div class="feature-card">
            <h3>Test de la fonctionnalité</h3>
            <button onclick="testFeature()">🚀 Tester</button>
            <div id="output"></div>
        </div>
    </div>
    
    <script src="ai-generated-feature.js"></script>
    <script>
        function testFeature() {{
            const output = document.getElementById('output');
            const feature = new AIGeneratedFeature();
            const result = feature.execute({{ test: 'data', user: 'AI Team User' }});
            
            output.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
        }}
    </script>
</body>
</html>'''
        }
    
    def create_files(self, files_content: Dict[str, str], task_info: Dict) -> None:
        """Crée les fichiers générés"""
        for filename, content in files_content.items():
            try:
                # Créer les dossiers nécessaires
                Path(filename).parent.mkdir(parents=True, exist_ok=True)
                
                # Écrire le fichier
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"Created {filename}")
            except Exception as e:
                print(f"Error creating {filename}: {e}")
    
    def create_branch_name(self, task_info: Dict) -> str:
        """Crée un nom de branche basé sur la tâche"""
        timestamp = int(time.time())
        task_type = task_info['task_type']
        summary = task_info['task_summary'][:30].lower()
        summary = ''.join(c if c.isalnum() else '-' for c in summary)
        return f"ai-team-{task_type}-{summary}-{timestamp}"

def set_github_output(key: str, value: str) -> None:
    """Définit une sortie GitHub Actions"""
    with open(os.environ['GITHUB_OUTPUT'], 'a') as f:
        f.write(f"{key}={value}\n")

def main():
    try:
        ai_team = AITeamMCP()
        
        # Vérifier que la clé API DeepSeek R1 est présente
        if not ai_team.together_api_key:
            print("❌ ERREUR: Clé API DeepSeek R1 manquante!")
            print("📋 SOLUTION:")
            print("1. Allez dans Settings → Secrets and variables → Actions")
            print("2. Créez un secret: TOGETHER_AI_API_KEY")
            print("3. Valeur: 7b61ccee2b0b0f9d4b842862034eea9b18c5e4e26728ef8714b581c0cf0c91fe")
            print("4. Relancez le workflow")
            set_github_output('changes_made', 'false')
            set_github_output('error', 'Missing TOGETHER_AI_API_KEY secret')
            sys.exit(1)
        
        print(f"✅ DeepSeek R1 API key found (length: {len(ai_team.together_api_key)})")
        
        # Analyser la tâche
        task_info = ai_team.analyze_task()
        print(f"🤖 Task analyzed: {task_info['task_type']}")
        
        # Générer le code
        files_content = ai_team.generate_code(task_info)
        print(f"🤖 Code generated: {len(files_content)} files")
        
        # Créer les fichiers
        ai_team.create_files(files_content, task_info)
        
        # Créer le nom de branche
        branch_name = ai_team.create_branch_name(task_info)
        
        # Définir les sorties GitHub Actions
        set_github_output('changes_made', 'true')
        set_github_output('agent', task_info['agent'])
        set_github_output('task_summary', task_info['task_summary'])
        set_github_output('branch_name', branch_name)
        set_github_output('files_created', ', '.join(files_content.keys()))
        
        print("✅ AI Team DeepSeek R1 completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        set_github_output('changes_made', 'false')
        set_github_output('error', str(e))
        sys.exit(1)

if __name__ == "__main__":
    main() 