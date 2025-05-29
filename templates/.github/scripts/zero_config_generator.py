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
    """Analyse la tâche et détermine l'agent approprié"""
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
    
    # Classification automatique
    task_lower = task.lower()
    
    if any(word in task_lower for word in ['bug', 'fix', 'error', 'problème']):
        task_type = 'bug_fix'
        agent = 'Bug Hunter'
    elif any(word in task_lower for word in ['test', 'testing', 'spec']):
        task_type = 'testing'
        agent = 'QA Engineer'
    elif any(word in task_lower for word in ['frontend', 'ui', 'css', 'html', 'component']):
        task_type = 'frontend'
        agent = 'Frontend Specialist'
    elif any(word in task_lower for word in ['backend', 'api', 'server', 'database']):
        task_type = 'backend'
        agent = 'Backend Specialist'
    elif any(word in task_lower for word in ['refactor', 'optimize', 'clean']):
        task_type = 'refactor'
        agent = 'Code Architect'
    else:
        task_type = 'feature'
        agent = 'Full-Stack Developer'
    
    return {
        'task': task,
        'task_type': task_type,
        'agent': agent,
        'task_summary': task[:100]
    }

def generate_frontend_code(task):
    """Génère du code frontend"""
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 AI Generated Page</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }}
        .ai-button {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            margin: 10px 5px;
        }}
        .ai-button:hover {{
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }}
        .ai-generated {{
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            background: linear-gradient(45deg, #f0f4ff, #e8f2ff);
        }}
        blockquote {{
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px 25px;
            margin: 20px 0;
            font-style: italic;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Page générée par AI Team</h1>
        <p>Cette page a été créée automatiquement pour :</p>
        <blockquote>{task[:200]}...</blockquote>
        
        <button class="ai-button" onclick="showDemo()">Démonstration IA</button>
        <button class="ai-button" onclick="showInfo()">Informations</button>
        
        <div id="output" class="ai-generated" style="display: none;">
            <h3>✅ Fonctionnalité IA activée !</h3>
            <p>Code généré automatiquement le: <span id="timestamp"></span></p>
            <p><strong>Agent:</strong> Frontend Specialist</p>
            <p><strong>Statut:</strong> Opérationnel ✅</p>
        </div>
        
        <div id="info" class="ai-generated" style="display: none;">
            <h3>📋 Informations sur AI Team</h3>
            <ul>
                <li>🎨 Frontend Specialist - HTML, CSS, JavaScript</li>
                <li>⚙️ Backend Specialist - APIs, serveurs</li>
                <li>🐛 Bug Hunter - Correction d'erreurs</li>
                <li>🧪 QA Engineer - Tests automatiques</li>
                <li>🏗️ Code Architect - Refactoring</li>
                <li>🚀 Full-Stack Developer - Développement complet</li>
            </ul>
        </div>
    </div>
    
    <script>
        function showDemo() {{
            const output = document.getElementById('output');
            const info = document.getElementById('info');
            info.style.display = 'none';
            output.style.display = 'block';
            document.getElementById('timestamp').textContent = new Date().toLocaleString();
        }}
        
        function showInfo() {{
            const output = document.getElementById('output');
            const info = document.getElementById('info');
            output.style.display = 'none';
            info.style.display = 'block';
        }}
        
        console.log('🤖 AI Team Frontend - Page prête!');
    </script>
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

def generate_code(task_info):
    """Génère le code selon le type de tâche"""
    task = task_info['task']
    task_type = task_info['task_type']
    
    if task_type == 'frontend':
        return generate_frontend_code(task)
    elif task_type == 'backend':
        return generate_backend_code(task)
    else:
        # Code générique pour autres types
        return f'''// 🤖 Code généré par AI Team - {task_info['agent']}
// Tâche: {task[:100]}

console.log('🤖 Application AI Team générée automatiquement');

function processTask() {{
    return {{
        status: 'success',
        message: 'Code généré par {task_info['agent']}',
        timestamp: new Date().toISOString()
    }};
}}

// Test de l'application
const result = processTask();
console.log('✅ Test:', result);'''

def apply_code(generated_code, task_info):
    """Applique le code généré"""
    if not generated_code:
        print("❌ Aucun code généré")
        return []
    
    created_files = []
    task_type = task_info.get('task_type', 'feature')
    
    # Déterminer le nom de fichier selon le type
    if task_type == 'frontend':
        filename = 'ai-generated-page.html'
    elif task_type == 'backend':
        filename = 'ai-generated-api.js'
    else:
        filename = 'ai-generated-code.js'
    
    try:
        # Créer le fichier
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(generated_code)
        
        created_files.append(filename)
        print(f"✅ Fichier créé: {filename}")
        
        # Créer un README explicatif
        readme_content = f'''# 🤖 Code généré par AI Team

## Agent utilisé
**{task_info.get('agent', 'AI Agent')}**

## Tâche traitée
{task_info.get('task', 'Tâche automatique')[:200]}...

## Fichier généré
- `{filename}` - Code principal

## Utilisation
{'Ouvrez le fichier HTML dans votre navigateur' if task_type == 'frontend' else 'Exécutez: node ' + filename}

## Généré le
{time.strftime('%Y-%m-%d %H:%M:%S')}

---
*Créé automatiquement par AI Team Orchestrator*
'''
        
        readme_filename = 'AI-TEAM-README.md'
        with open(readme_filename, 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        created_files.append(readme_filename)
        print(f"✅ Documentation créée: {readme_filename}")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des fichiers: {e}")
        return []
    
    return created_files

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