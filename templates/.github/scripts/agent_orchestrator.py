#!/usr/bin/env python3
"""
🧠 Agent Orchestrator
Orchestre l'équipe d'agents IA selon les tâches à accomplir
"""

import os
import json
import time
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

# Imports pour les APIs IA gratuites
import requests
from huggingface_hub import InferenceClient

@dataclass
class Agent:
    """Définition d'un agent IA spécialisé"""
    name: str
    specialization: str
    model: str
    api_provider: str
    capabilities: List[str]
    prompt_template: str

class AgentType(Enum):
    """Types d'agents disponibles"""
    FRONTEND = "frontend"
    BACKEND = "backend"
    TESTING = "testing"
    REFACTOR = "refactor"
    FULLSTACK = "fullstack"
    BUGFIX = "bugfix"
    DOCUMENTATION = "documentation"

class AgentOrchestrator:
    def __init__(self):
        self.agents = self._initialize_agents()
        self.hf_client = None
        self.groq_client = None
        
        # Configuration des clients API
        if os.environ.get("HUGGINGFACE_TOKEN"):
            self.hf_client = InferenceClient(token=os.environ["HUGGINGFACE_TOKEN"])
        
    def _initialize_agents(self) -> Dict[str, Agent]:
        """Initialise l'équipe d'agents IA"""
        return {
            AgentType.FRONTEND.value: Agent(
                name="Frontend Specialist",
                specialization="Développement Frontend",
                model="codellama/CodeLlama-7b-Instruct-hf",
                api_provider="huggingface",
                capabilities=["react", "vue", "css", "html", "javascript", "typescript", "ui", "ux"],
                prompt_template="""Tu es un expert en développement frontend. 
Analysez cette tâche et générez le code nécessaire:

TÂCHE: {task_description}
STRUCTURE DU PROJET: {project_structure}
ZONE AFFECTÉE: Frontend

Instructions:
1. Analysez la tâche et identifiez les composants à modifier/créer
2. Générez le code en respectant les bonnes pratiques
3. Assurez-vous de la compatibilité avec le framework existant
4. Incluez les tests nécessaires

Répondez UNIQUEMENT avec du code propre et fonctionnel."""
            ),
            
            AgentType.BACKEND.value: Agent(
                name="Backend Specialist", 
                specialization="Développement Backend",
                model="codellama/CodeLlama-7b-Instruct-hf",
                api_provider="huggingface",
                capabilities=["api", "database", "server", "node", "python", "rest", "graphql"],
                prompt_template="""Tu es un expert en développement backend.
Analysez cette tâche et générez le code nécessaire:

TÂCHE: {task_description}
STRUCTURE DU PROJET: {project_structure}
ZONE AFFECTÉE: Backend

Instructions:
1. Créez/modifiez les endpoints ou services nécessaires
2. Gérez la logique métier appropriée
3. Implémentez la gestion d'erreurs
4. Assurez la sécurité et les validations
5. Incluez les tests unitaires

Répondez UNIQUEMENT avec du code propre et fonctionnel."""
            ),
            
            AgentType.TESTING.value: Agent(
                name="QA Engineer",
                specialization="Tests et Qualité",
                model="codellama/CodeLlama-7b-Instruct-hf", 
                api_provider="huggingface",
                capabilities=["testing", "jest", "cypress", "pytest", "unit-tests", "integration-tests"],
                prompt_template="""Tu es un expert en tests et qualité logicielle.
Analysez cette tâche et générez les tests nécessaires:

TÂCHE: {task_description}
STRUCTURE DU PROJET: {project_structure}
ZONE AFFECTÉE: Testing

Instructions:
1. Créez des tests unitaires complets
2. Ajoutez des tests d'intégration si nécessaire
3. Assurez une couverture de code optimale
4. Incluez les cas de test edge cases
5. Utilisez le framework de test approprié

Répondez UNIQUEMENT avec du code de tests propre et complet."""
            ),
            
            AgentType.BUGFIX.value: Agent(
                name="Bug Hunter",
                specialization="Correction de bugs",
                model="deepseek-coder",
                api_provider="groq",
                capabilities=["debugging", "error-handling", "performance", "security"],
                prompt_template="""Tu es un expert en débogage et correction de bugs.
Analysez ce problème et proposez une solution:

PROBLÈME: {task_description}
STRUCTURE DU PROJET: {project_structure}
ZONE AFFECTÉE: {affected_areas}

Instructions:
1. Identifiez la cause racine du problème
2. Proposez une solution minimale et efficace
3. Prévenez les régressions
4. Ajoutez des vérifications appropriées
5. Incluez des tests pour éviter la récurrence

Répondez UNIQUEMENT avec le code corrigé et les tests associés."""
            ),
            
            AgentType.REFACTOR.value: Agent(
                name="Code Architect",
                specialization="Refactoring et Architecture",
                model="codellama/CodeLlama-7b-Instruct-hf",
                api_provider="huggingface", 
                capabilities=["refactoring", "architecture", "optimization", "clean-code"],
                prompt_template="""Tu es un expert en architecture et refactoring.
Analysez ce code et améliorez-le:

TÂCHE: {task_description}
STRUCTURE DU PROJET: {project_structure}
ZONE AFFECTÉE: Architecture/Code Quality

Instructions:
1. Identifiez les améliorations possibles
2. Appliquez les principes SOLID et DRY
3. Optimisez les performances si possible
4. Améliorez la lisibilité et maintenabilité
5. Conservez la fonctionnalité existante

Répondez UNIQUEMENT avec le code refactorisé et propre."""
            ),
            
            AgentType.FULLSTACK.value: Agent(
                name="Full-Stack Developer",
                specialization="Développement Full-Stack",
                model="codellama/CodeLlama-13b-Instruct-hf",
                api_provider="huggingface",
                capabilities=["frontend", "backend", "database", "integration", "deployment"],
                prompt_template="""Tu es un développeur full-stack expérimenté.
Analysez cette tâche complète et implémentez-la:

TÂCHE: {task_description}
STRUCTURE DU PROJET: {project_structure}
ZONES AFFECTÉES: Frontend + Backend

Instructions:
1. Implémentez les changements frontend ET backend
2. Assurez l'intégration complète entre les couches
3. Gérez les communications API appropriées
4. Incluez les validations côté client et serveur
5. Ajoutez les tests pour toutes les couches

Répondez avec le code complet organisé par fichiers."""
            )
        }
    
    def select_best_agent(self, task_data: Dict) -> Agent:
        """Sélectionne le meilleur agent pour la tâche"""
        task_type = task_data.get("task_type", "general")
        affected_areas = task_data.get("affected_areas", [])
        complexity = task_data.get("estimated_complexity", "medium")
        
        # Mappage des types de tâches vers les agents
        agent_mapping = {
            "bug_fix": AgentType.BUGFIX,
            "feature": AgentType.FULLSTACK,
            "frontend": AgentType.FRONTEND,
            "backend": AgentType.BACKEND,
            "testing": AgentType.TESTING,
            "refactor": AgentType.REFACTOR,
            "documentation": AgentType.FULLSTACK
        }
        
        # Sélection basée sur les zones affectées
        if len(affected_areas) > 1:
            # Tâche multi-zones = Full-stack
            selected_agent_type = AgentType.FULLSTACK
        elif "frontend" in affected_areas:
            selected_agent_type = AgentType.FRONTEND
        elif "backend" in affected_areas:
            selected_agent_type = AgentType.BACKEND
        elif "testing" in affected_areas:
            selected_agent_type = AgentType.TESTING
        else:
            # Utilisation du mappage par défaut
            selected_agent_type = agent_mapping.get(task_type, AgentType.FULLSTACK)
        
        # Agent préféré manuel
        preferred_agent = task_data.get("preferred_agent")
        if preferred_agent and preferred_agent in self.agents:
            return self.agents[preferred_agent]
        
        return self.agents[selected_agent_type.value]
    
    def call_ai_api(self, agent: Agent, prompt: str) -> str:
        """Appelle l'API IA appropriée"""
        try:
            if agent.api_provider == "huggingface" and self.hf_client:
                return self._call_huggingface(agent.model, prompt)
            elif agent.api_provider == "groq":
                return self._call_groq(agent.model, prompt)
            else:
                return self._fallback_response(prompt)
        except Exception as e:
            print(f"⚠️ Erreur API {agent.api_provider}: {e}")
            return self._fallback_response(prompt)
    
    def _call_huggingface(self, model: str, prompt: str) -> str:
        """Appelle l'API Hugging Face"""
        try:
            response = self.hf_client.text_generation(
                prompt=prompt,
                model=model,
                max_new_tokens=2000,
                temperature=0.1,
                do_sample=True,
                return_full_text=False
            )
            return response if isinstance(response, str) else response.get('generated_text', '')
        except Exception as e:
            print(f"⚠️ Erreur Hugging Face: {e}")
            return ""
    
    def _call_groq(self, model: str, prompt: str) -> str:
        """Appelle l'API Groq (plus rapide)"""
        if not os.environ.get("GROQ_API_KEY"):
            return ""
            
        try:
            headers = {
                "Authorization": f"Bearer {os.environ['GROQ_API_KEY']}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 2000,
                "temperature": 0.1
            }
            
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                print(f"⚠️ Erreur Groq API: {response.status_code}")
                return ""
                
        except Exception as e:
            print(f"⚠️ Erreur Groq: {e}")
            return ""
    
    def _fallback_response(self, prompt: str) -> str:
        """Réponse de fallback en cas d'échec des APIs"""
        return f"""
# 🤖 Tâche identifiée mais API indisponible

## Analyse de la tâche:
{prompt[:500]}...

## Action recommandée:
1. Vérifiez la configuration des tokens API
2. Réessayez plus tard
3. Ou implémentez manuellement

*Cette réponse a été générée en mode dégradé.*
"""

def main():
    """Fonction principale d'orchestration"""
    # Récupération des données d'analyse
    task_data_json = os.environ.get("TASK_DATA", "{}")
    
    try:
        analysis_data = json.loads(task_data_json)
        task_data = analysis_data.get("task", {})
        project_structure = analysis_data.get("project_structure", {})
    except json.JSONDecodeError:
        print("❌ Erreur de parsing des données de tâche")
        exit(1)
    
    orchestrator = AgentOrchestrator()
    
    # Sélection de l'agent optimal
    selected_agent = orchestrator.select_best_agent(task_data)
    print(f"🤖 Agent sélectionné: {selected_agent.name}")
    
    # Préparation du prompt
    prompt = selected_agent.prompt_template.format(
        task_description=task_data.get("description", "Tâche non définie"),
        project_structure=json.dumps(project_structure, indent=2),
        affected_areas=", ".join(task_data.get("affected_areas", ["general"]))
    )
    
    # Génération du plan d'exécution
    ai_response = orchestrator.call_ai_api(selected_agent, prompt)
    
    execution_plan = {
        "agent": selected_agent.name,
        "agent_type": selected_agent.specialization,
        "task_analysis": task_data,
        "generated_code": ai_response,
        "next_steps": [
            "Analyser le code généré",
            "Appliquer les changements",
            "Exécuter les tests",
            "Créer la pull request"
        ]
    }
    
    # Output pour GitHub Actions
    print(f"::set-output name=execution_plan::{json.dumps(execution_plan)}")
    print(f"::set-output name=primary_agent::{selected_agent.name}")
    
    print(f"✅ Plan d'exécution généré par {selected_agent.name}")
    print(f"🔧 Code généré: {len(ai_response)} caractères")

if __name__ == "__main__":
    main() 