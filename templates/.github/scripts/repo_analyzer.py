#!/usr/bin/env python3
"""
🔍 Repository Analyzer
Analyse un repository GitHub pour identifier les tâches et la structure du projet
"""

import os
import json
import re
from pathlib import Path
from github import Github
from typing import Dict, List, Optional
import yaml

class RepositoryAnalyzer:
    def __init__(self, github_token: str, repository: str):
        self.github = Github(github_token)
        self.repo = self.github.get_repo(repository)
        self.repository_name = repository
        
    def analyze_project_structure(self) -> Dict:
        """Analyse la structure du projet"""
        structure = {
            "languages": {},
            "frameworks": [],
            "directories": [],
            "key_files": [],
            "package_managers": [],
            "test_frameworks": []
        }
        
        try:
            # Analyse des langages
            languages = self.repo.get_languages()
            structure["languages"] = languages
            
            # Analyse des fichiers de configuration
            contents = self.repo.get_contents("")
            for content in contents:
                file_name = content.name.lower()
                
                # Package managers
                if file_name in ["package.json", "requirements.txt", "composer.json", "cargo.toml", "go.mod"]:
                    structure["package_managers"].append(content.name)
                    structure["key_files"].append(content.name)
                
                # Configuration files
                if file_name in ["dockerfile", ".gitignore", "readme.md", "makefile"]:
                    structure["key_files"].append(content.name)
                
                # Frameworks detection
                if file_name == "package.json":
                    package_content = self.repo.get_contents(content.name).decoded_content.decode()
                    package_data = json.loads(package_content)
                    deps = {**package_data.get("dependencies", {}), **package_data.get("devDependencies", {})}
                    
                    if "react" in deps:
                        structure["frameworks"].append("React")
                    if "vue" in deps:
                        structure["frameworks"].append("Vue.js")
                    if "angular" in deps:
                        structure["frameworks"].append("Angular")
                    if "next" in deps:
                        structure["frameworks"].append("Next.js")
                    if "express" in deps:
                        structure["frameworks"].append("Express")
                    
        except Exception as e:
            print(f"⚠️ Erreur lors de l'analyse de structure: {e}")
            
        return structure
    
    def extract_task_from_issue(self, issue_number: int, issue_title: str, issue_body: str) -> Dict:
        """Extrait une tâche depuis une issue GitHub"""
        task = {
            "type": "issue",
            "source": f"Issue #{issue_number}",
            "title": issue_title,
            "description": issue_body,
            "priority": "medium",
            "estimated_complexity": "medium",
            "task_type": self.classify_task_type(issue_title, issue_body),
            "affected_areas": self.identify_affected_areas(issue_title, issue_body)
        }
        
        # Classification de priorité basée sur les labels
        try:
            issue = self.repo.get_issue(issue_number)
            labels = [label.name.lower() for label in issue.labels]
            
            if any(label in labels for label in ["urgent", "critical", "high priority"]):
                task["priority"] = "high"
            elif any(label in labels for label in ["low priority", "enhancement"]):
                task["priority"] = "low"
                
            if "bug" in labels:
                task["task_type"] = "bug_fix"
            elif "feature" in labels:
                task["task_type"] = "feature"
            elif "refactor" in labels:
                task["task_type"] = "refactor"
                
        except Exception as e:
            print(f"⚠️ Erreur lors de l'analyse des labels: {e}")
            
        return task
    
    def extract_task_from_comment(self, comment_body: str) -> Dict:
        """Extrait une tâche depuis un commentaire"""
        task = {
            "type": "comment",
            "source": "Issue Comment",
            "description": comment_body,
            "priority": "medium",
            "task_type": self.classify_task_type("", comment_body),
            "affected_areas": self.identify_affected_areas("", comment_body)
        }
        
        return task
    
    def classify_task_type(self, title: str, description: str) -> str:
        """Classifie le type de tâche"""
        text = f"{title} {description}".lower()
        
        # Bug fixes
        if any(keyword in text for keyword in ["bug", "error", "fix", "issue", "problem", "crash"]):
            return "bug_fix"
        
        # New features
        if any(keyword in text for keyword in ["feature", "add", "implement", "create", "new"]):
            return "feature"
        
        # Refactoring
        if any(keyword in text for keyword in ["refactor", "optimize", "improve", "clean"]):
            return "refactor"
        
        # Testing
        if any(keyword in text for keyword in ["test", "testing", "coverage", "unit test"]):
            return "testing"
        
        # Documentation
        if any(keyword in text for keyword in ["documentation", "docs", "readme", "comment"]):
            return "documentation"
        
        # UI/UX
        if any(keyword in text for keyword in ["ui", "ux", "design", "style", "css", "layout"]):
            return "frontend"
        
        # Backend/API
        if any(keyword in text for keyword in ["api", "backend", "server", "database", "endpoint"]):
            return "backend"
        
        return "general"
    
    def identify_affected_areas(self, title: str, description: str) -> List[str]:
        """Identifie les zones du code potentiellement affectées"""
        text = f"{title} {description}".lower()
        areas = []
        
        # Frontend areas
        if any(keyword in text for keyword in ["component", "ui", "css", "html", "react", "vue"]):
            areas.append("frontend")
        
        # Backend areas
        if any(keyword in text for keyword in ["api", "server", "database", "model", "controller"]):
            areas.append("backend")
        
        # Testing areas
        if any(keyword in text for keyword in ["test", "spec", "testing"]):
            areas.append("testing")
        
        # Configuration
        if any(keyword in text for keyword in ["config", "environment", "deploy", "ci/cd"]):
            areas.append("config")
        
        return areas if areas else ["general"]

def main():
    """Fonction principale d'analyse"""
    # Récupération des variables d'environnement
    github_token = os.environ.get("GITHUB_TOKEN")
    repository = os.environ.get("REPOSITORY")
    event_name = os.environ.get("EVENT_NAME")
    
    if not all([github_token, repository]):
        print("❌ Variables d'environnement manquantes")
        exit(1)
    
    analyzer = RepositoryAnalyzer(github_token, repository)
    
    # Analyse de la structure du projet
    project_structure = analyzer.analyze_project_structure()
    
    # Extraction de la tâche selon l'événement
    task_data = {}
    
    if event_name == "issues":
        issue_number = int(os.environ.get("ISSUE_NUMBER", 0))
        issue_title = os.environ.get("ISSUE_TITLE", "")
        issue_body = os.environ.get("ISSUE_BODY", "")
        
        task_data = analyzer.extract_task_from_issue(issue_number, issue_title, issue_body)
        
    elif event_name == "issue_comment":
        comment_body = os.environ.get("COMMENT_BODY", "")
        task_data = analyzer.extract_task_from_comment(comment_body)
        
    elif event_name == "workflow_dispatch":
        manual_task = os.environ.get("MANUAL_TASK", "")
        manual_agent = os.environ.get("MANUAL_AGENT", "")
        
        task_data = {
            "type": "manual",
            "source": "Manual Trigger",
            "description": manual_task,
            "preferred_agent": manual_agent,
            "task_type": analyzer.classify_task_type("", manual_task),
            "affected_areas": analyzer.identify_affected_areas("", manual_task)
        }
    
    # Combinaison des données
    analysis_result = {
        "project_structure": project_structure,
        "task": task_data,
        "timestamp": "2025-05-28T21:39:00Z"
    }
    
    # Output pour GitHub Actions
    task_summary = task_data.get("title", task_data.get("description", "Unknown task"))[:100]
    task_type = task_data.get("task_type", "general")
    
    print(f"::set-output name=task_data::{json.dumps(analysis_result)}")
    print(f"::set-output name=task_summary::{task_summary}")
    print(f"::set-output name=task_type::{task_type}")
    
    print(f"✅ Analyse terminée - Type: {task_type}")
    print(f"📋 Résumé: {task_summary}")

if __name__ == "__main__":
    main() 