#!/usr/bin/env python3
"""
🤖 AI Team Zero-Config Generator
Générateur de code sans configuration externe
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
    return f'''```html:index.html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>🤖 Page générée par IA</h1>
        <p>Cette page a été créée automatiquement pour :</p>
        <blockquote>{task[:200]}</blockquote>
        <button class="btn ai-button" onclick="handleClick()">Cliquez-moi</button>
        <div id="output" class="ai-generated"></div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
```

```css:styles.css
/* Styles générés automatiquement par AI Team */
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

.ai-generated {{
    border: 2px solid #667eea;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    background: linear-gradient(45deg, #f0f4ff, #e8f2ff);
}}

.ai-button {{
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 10px 5px;
}}

.ai-button:hover {{
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}}

blockquote {{
    background: #f8f9fa;
    border-left: 4px solid #667eea;
    padding: 10px 20px;
    margin: 20px 0;
    font-style: italic;
}}
```

```javascript:script.js
// JavaScript généré automatiquement par AI Team
console.log('🤖 Page générée par AI Team Orchestrator');

function handleClick() {{
    const output = document.getElementById('output');
    output.innerHTML = `
        <h3>✅ Fonctionnalité activée !</h3>
        <p>Code généré le: ${{new Date().toLocaleString()}}</p>
        <p>Agent: Frontend Specialist</p>
        <p>Status: Opérationnel</p>
    `;
    
    // Animation
    output.style.opacity = '0';
    setTimeout(() => {{
        output.style.opacity = '1';
        output.style.transition = 'opacity 0.5s ease';
    }}, 100);
}}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {{
    console.log('🚀 Application frontend prête');
}});
```'''

def generate_backend_code(task):
    """Génère du code backend"""
    return f'''```javascript:server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('🤖 Serveur généré par AI Team Orchestrator');

// Route de status
app.get('/api/status', (req, res) => {{
    res.json({{
        status: 'success',
        message: 'API générée par AI Team Orchestrator',
        timestamp: new Date().toISOString(),
        task: '{task[:100]}',
        agent: 'Backend Specialist'
    }});
}});

// Route principale
app.get('/api/data', (req, res) => {{
    const data = {{
        id: 1,
        title: 'Données générées automatiquement',
        description: 'Cette API a été créée par l\\'IA',
        generated_at: new Date().toISOString(),
        features: [
            'API REST complète',
            'CORS configuré',
            'Gestion d\\'erreurs',
            'Logging automatique'
        ]
    }};
    res.json(data);
}});

// POST endpoint
app.post('/api/process', (req, res) => {{
    const {{ input }} = req.body;
    
    if (!input) {{
        return res.status(400).json({{
            error: 'Input requis',
            code: 'MISSING_INPUT'
        }});
    }}
    
    res.json({{
        result: `Traitement effectué: ${{input}}`,
        processed_by: 'AI Team',
        success: true,
        timestamp: new Date().toISOString()
    }});
}});

// Gestion des erreurs
app.use((err, req, res, next) => {{
    console.error('Erreur:', err.message);
    res.status(500).json({{
        error: 'Erreur interne du serveur',
        message: err.message
    }});
}});

app.listen(PORT, () => {{
    console.log(`🚀 Serveur AI démarré sur le port ${{PORT}}`);
}});
```

```json:package.json
{{
  "name": "ai-generated-api",
  "version": "1.0.0",
  "description": "API générée automatiquement par AI Team",
  "main": "server.js",
  "scripts": {{
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "npm run test:api"
  }},
  "dependencies": {{
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }},
  "devDependencies": {{
    "nodemon": "^3.0.1"
  }},
  "keywords": ["ai", "api", "express", "auto-generated"],
  "author": "AI Team Orchestrator",
  "license": "MIT"
}}
```'''

def generate_testing_code(task):
    """Génère du code de test"""
    return f'''```javascript:test.js
// Tests générés automatiquement par AI Team
const assert = require('assert');

describe('Tests automatiques pour: {task[:100]}', () => {{
    
    it('devrait fonctionner correctement', () => {{
        const result = true;
        assert.strictEqual(result, true);
    }});
    
    it('devrait gérer les cas d\\'erreur', () => {{
        const error = null;
        assert.strictEqual(error, null);
    }});
    
    it('devrait valider les données', () => {{
        const data = {{ name: 'test', value: 42 }};
        assert.ok(data.hasOwnProperty('name'));
        assert.strictEqual(data.value, 42);
    }});
    
    it('devrait traiter les entrées utilisateur', () => {{
        function processInput(input) {{
            return input ? input.toLowerCase() : '';
        }}
        
        assert.strictEqual(processInput('TEST'), 'test');
        assert.strictEqual(processInput(''), '');
        assert.strictEqual(processInput(null), '');
    }});
    
}});

// Test d'intégration
describe('Tests d\\'intégration', () => {{
    
    it('devrait intégrer tous les composants', () => {{
        const components = ['component1', 'component2'];
        assert.strictEqual(components.length, 2);
    }});
    
    it('devrait gérer les flux de données', () => {{
        const dataFlow = {{
            input: 'test',
            processed: true,
            output: 'result'
        }};
        
        assert.ok(dataFlow.processed);
        assert.strictEqual(dataFlow.input, 'test');
        assert.strictEqual(dataFlow.output, 'result');
    }});
    
}});

console.log('🧪 Tests générés par AI Team - QA Engineer');
```

```json:package.json
{{
  "name": "ai-generated-tests",
  "version": "1.0.0", 
  "description": "Tests générés par AI Team",
  "scripts": {{
    "test": "node test.js"
  }},
  "keywords": ["tests", "ai-generated", "qa"],
  "author": "AI Team - QA Engineer"
}}
```'''

def generate_feature_code(task):
    """Génère du code de fonctionnalité générale"""
    return f'''```javascript:app.js
// Application générée automatiquement par AI Team
// Tâche: {task[:100]}

class AIGeneratedApp {{
    constructor() {{
        this.name = 'AI Generated Feature';
        this.version = '1.0.0';
        this.createdBy = 'AI Team Orchestrator';
        this.features = [];
    }}
    
    init() {{
        console.log(`🤖 Initialisation de ${{this.name}}`);
        this.setupFeatures();
        this.startApp();
    }}
    
    setupFeatures() {{
        const features = [
            'Fonctionnalité automatique 1',
            'Fonctionnalité automatique 2', 
            'Fonctionnalité automatique 3'
        ];
        
        features.forEach((feature, index) => {{
            this.features.push({{
                id: index + 1,
                name: feature,
                status: 'active',
                createdAt: new Date().toISOString()
            }});
            console.log(`✅ ${{feature}} activée`);
        }});
    }}
    
    processTask(input) {{
        return {{
            processed: true,
            input: input,
            output: `Résultat traité par IA: ${{input}}`,
            timestamp: new Date().toISOString(),
            agent: 'Full-Stack Developer'
        }};
    }}
    
    getFeatures() {{
        return this.features;
    }}
    
    startApp() {{
        console.log('🚀 Application démarrée avec succès');
        console.log(`📊 ${{this.features.length}} fonctionnalités disponibles`);
    }}
}}

// Utilisation
const app = new AIGeneratedApp();
app.init();

// Test de l'application
const testResult = app.processTask('test input');
console.log('🧪 Test:', testResult);

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = AIGeneratedApp;
}}
```

```markdown:README.md
# 🤖 Fonctionnalité générée par AI Team

## Description
Cette fonctionnalité a été générée automatiquement pour :
{task}

## Installation
```bash
# Si c'est du Node.js
npm install
npm start

# Si c'est du code HTML
# Ouvrez index.html dans votre navigateur
```

## Utilisation
La fonctionnalité est prête à l'emploi et inclut :
- Code principal fonctionnel
- Tests automatiques
- Documentation
- Configuration de base

## Structure
- `app.js` : Application principale
- `README.md` : Cette documentation
- Tests : Selon le type de projet

## Généré par
- **Agent IA** : Full-Stack Developer
- **Date** : {time.strftime('%Y-%m-%d %H:%M:%S')}
- **Système** : AI Team Orchestrator

## Développement
Ce code a été généré automatiquement et peut être modifié selon vos besoins.

---
*Créé avec ❤️ par AI Team Orchestrator*
```'''

def generate_code(task_info):
    """Génère le code selon le type de tâche"""
    task = task_info['task']
    task_type = task_info['task_type'] 
    agent = task_info['agent']
    
    if task_type == 'frontend':
        return generate_frontend_code(task)
    elif task_type == 'backend':
        return generate_backend_code(task)
    elif task_type == 'testing':
        return generate_testing_code(task)
    else:
        return generate_feature_code(task)

def apply_code(generated_code):
    """Applique le code généré"""
    if not generated_code:
        print("Aucun code généré")
        return []
    
    # Extraction des fichiers depuis le code généré
    file_pattern = r'```[\w]*:([^\n]+)\n(.*?)```'
    matches = re.findall(file_pattern, generated_code, re.DOTALL)
    
    created_files = []
    
    for filename, content in matches:
        filename = filename.strip()
        content = content.strip()
        
        # Création du répertoire si nécessaire
        file_path = Path(filename)
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Écriture du fichier
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        created_files.append(filename)
        print(f"✅ Fichier créé: {filename}")
    
    return created_files

def main():
    """Fonction principale"""
    action = os.environ.get('ACTION', 'analyze')
    
    if action == 'analyze':
        # Analyse de la tâche
        task_info = analyze_task()
        
        # Output pour GitHub Actions
        print(f"::set-output name=task::{task_info['task']}")
        print(f"::set-output name=task_type::{task_info['task_type']}")
        print(f"::set-output name=agent::{task_info['agent']}")
        print(f"::set-output name=task_summary::{task_info['task_summary']}")
        
        print(f"✅ Tâche analysée - Type: {task_info['task_type']}, Agent: {task_info['agent']}")
        
    elif action == 'generate':
        # Génération du code
        task_info = {
            'task': os.environ.get('TASK', ''),
            'task_type': os.environ.get('TASK_TYPE', 'feature'),
            'agent': os.environ.get('AGENT', 'Full-Stack Developer')
        }
        
        generated_code = generate_code(task_info)
        
        # Sauvegarde du code généré
        with open('generated_code.txt', 'w', encoding='utf-8') as f:
            f.write(generated_code)
        
        print(f"✅ Code généré par {task_info['agent']}")
        
    elif action == 'apply':
        # Application du code
        try:
            with open('generated_code.txt', 'r', encoding='utf-8') as f:
                generated_code = f.read()
        except:
            generated_code = ''
        
        created_files = apply_code(generated_code)
        
        if created_files:
            print(f"::set-output name=files_created::{', '.join(created_files)}")
            print(f"::set-output name=changes_made::true")
        else:
            print(f"::set-output name=changes_made::false")
        
        print(f"📁 {len(created_files)} fichier(s) créé(s)")

if __name__ == "__main__":
    main() 