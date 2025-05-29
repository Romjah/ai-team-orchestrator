#!/usr/bin/env python3
"""
🤖 AI Team Orchestrator avec MCP GitHub
Utilise le Model Context Protocol de GitHub pour une intégration native
"""

import os
import json
import time
import subprocess
import sys
from pathlib import Path

class AITeamMCP:
    def __init__(self):
        self.repo_owner = os.environ.get('GITHUB_REPOSITORY_OWNER', '')
        self.repo_name = os.environ.get('GITHUB_REPOSITORY', '').split('/')[-1]
        self.issue_number = os.environ.get('GITHUB_EVENT_ISSUE_NUMBER', '')
        
    def analyze_task(self):
        """Analyse la tâche et détermine l'agent approprié"""
        issue_title = os.environ.get('ISSUE_TITLE', '')
        issue_body = os.environ.get('ISSUE_BODY', '')
        
        task = f"{issue_title}\n{issue_body}"
        task_lower = task.lower()
        
        # Classification intelligente
        if any(word in task_lower for word in ['bug', 'fix', 'error', 'problème']):
            task_type = 'bug_fix'
            agent = 'Bug Hunter 🐛'
        elif any(word in task_lower for word in ['test', 'testing', 'spec']):
            task_type = 'testing'
            agent = 'QA Engineer 🧪'
        elif any(word in task_lower for word in ['frontend', 'ui', 'css', 'html', 'component', 'landing', 'page', 'design', 'interface']):
            task_type = 'frontend'
            agent = 'Frontend Specialist 🎨'
        elif any(word in task_lower for word in ['backend', 'api', 'server', 'database']):
            task_type = 'backend'
            agent = 'Backend Specialist ⚙️'
        elif any(word in task_lower for word in ['refactor', 'optimize', 'clean']):
            task_type = 'refactor'
            agent = 'Code Architect 🏗️'
        else:
            task_type = 'frontend'  # Par défaut frontend pour les landing pages
            agent = 'Frontend Specialist 🎨'
        
        return {
            'task': task,
            'task_type': task_type,
            'agent': agent,
            'task_summary': task[:100].replace('\n', ' ')
        }
    
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
*Créé automatiquement par AI Team Orchestrator avec MCP GitHub*
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
    
    def generate_code(self, task_info):
        """Génère le code selon le type de tâche"""
        task_type = task_info['task_type']
        task = task_info['task']
        
        if task_type == 'frontend':
            return self.generate_frontend_code(task)
        elif task_type == 'backend':
            return self.generate_backend_code(task)
        else:
            # Code générique
            return {
                'ai-generated.js': f'''// 🤖 Code généré par AI Team - {task_info['agent']}
// Tâche: {task[:100]}

console.log('🤖 Application AI Team générée automatiquement');
console.log('Agent: {task_info['agent']}');
console.log('Type: {task_type}');

const result = {{
    status: 'success',
    message: 'Code généré par {task_info['agent']}',
    task_type: '{task_type}',
    timestamp: new Date().toISOString()
}};

console.log('✅ Test:', result);'''
            }
    
    def create_files(self, files_content, task_info):
        """Crée les fichiers générés"""
        try:
            created_files = []
            
            for filename, content in files_content.items():
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                created_files.append(filename)
                print(f"✅ Fichier créé: {filename}")
            
            return {
                'success': True,
                'files_created': created_files,
                'changes_made': True,
                'branch_name': f"ai-team-mcp-{int(time.time())}"
            }
            
        except Exception as e:
            print(f"❌ Erreur: {e}")
            return {
                'success': False,
                'error': str(e),
                'changes_made': False
            }

def set_github_output(key, value):
    """Set GitHub Actions output"""
    if 'GITHUB_OUTPUT' in os.environ:
        with open(os.environ['GITHUB_OUTPUT'], 'a') as f:
            f.write(f"{key}={value}\n")

def main():
    """Fonction principale MCP GitHub"""
    print("🤖 AI Team MCP Starting...")
    
    ai_team = AITeamMCP()
    
    # 1. Analyser la tâche
    task_info = ai_team.analyze_task()
    print(f"✅ Analyse terminée - Agent: {task_info['agent']}")
    
    # Set outputs pour GitHub Actions
    set_github_output('task', task_info['task'].replace('\n', ' '))
    set_github_output('task_type', task_info['task_type'])
    set_github_output('agent', task_info['agent'])
    set_github_output('task_summary', task_info['task_summary'])
    
    # 2. Générer le code
    files_content = ai_team.generate_code(task_info)
    print(f"✅ Code généré - Type: {task_info['task_type']}")
    
    # 3. Créer les fichiers
    result = ai_team.create_files(files_content, task_info)
    
    # Set outputs des résultats
    if result['success']:
        set_github_output('files_created', ', '.join(result['files_created']))
        set_github_output('changes_made', 'true')
        set_github_output('branch_name', result['branch_name'])
        print(f"📁 {len(result['files_created'])} fichier(s) créé(s)")
    else:
        set_github_output('changes_made', 'false')
        set_github_output('error', result.get('error', 'Unknown error'))
        print(f"❌ Échec: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main() 