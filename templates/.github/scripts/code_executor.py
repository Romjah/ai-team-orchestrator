#!/usr/bin/env python3
"""
💻 Code Executor
Applique les changements de code générés par les agents IA
"""

import os
import json
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import tempfile
import shutil

class CodeExecutor:
    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path)
        self.changes_made = False
        self.modified_files = []
        self.test_results = {"passed": 0, "failed": 0, "status": "unknown"}
        
    def parse_ai_generated_code(self, generated_code: str) -> Dict[str, str]:
        """Parse le code généré par l'IA et l'organise par fichiers"""
        files_code = {}
        
        # Pattern pour détecter les blocs de code avec nom de fichier
        file_pattern = r"```(?:[\w]+\s+)?([^\s\n]+\.[\w]+)\n(.*?)```"
        matches = re.findall(file_pattern, generated_code, re.DOTALL)
        
        for file_path, code_content in matches:
            # Nettoie le nom du fichier
            file_path = file_path.strip()
            if file_path and not file_path.startswith('#'):
                files_code[file_path] = code_content.strip()
        
        # Si aucun fichier spécifique n'est détecté, essaie de détecter par extension
        if not files_code:
            files_code = self._detect_code_blocks_by_language(generated_code)
        
        return files_code
    
    def _detect_code_blocks_by_language(self, generated_code: str) -> Dict[str, str]:
        """Détecte les blocs de code par langage"""
        files_code = {}
        
        # Patterns pour différents langages
        language_patterns = {
            "javascript": r"```(?:js|javascript)\n(.*?)```",
            "typescript": r"```(?:ts|typescript)\n(.*?)```", 
            "python": r"```(?:py|python)\n(.*?)```",
            "css": r"```css\n(.*?)```",
            "html": r"```html\n(.*?)```",
            "json": r"```json\n(.*?)```"
        }
        
        for lang, pattern in language_patterns.items():
            matches = re.findall(pattern, generated_code, re.DOTALL)
            for i, code_content in enumerate(matches):
                file_name = f"generated_{lang}_{i+1}.{self._get_extension(lang)}"
                files_code[file_name] = code_content.strip()
        
        return files_code
    
    def _get_extension(self, language: str) -> str:
        """Retourne l'extension appropriée pour un langage"""
        extensions = {
            "javascript": "js",
            "typescript": "ts", 
            "python": "py",
            "css": "css",
            "html": "html",
            "json": "json"
        }
        return extensions.get(language, "txt")
    
    def identify_target_files(self, files_code: Dict[str, str], task_data: Dict) -> Dict[str, str]:
        """Identifie où placer les fichiers générés"""
        target_mapping = {}
        affected_areas = task_data.get("affected_areas", [])
        task_type = task_data.get("task_type", "general")
        
        for generated_file, code in files_code.items():
            # Si le fichier a un chemin spécifique, on l'utilise
            if "/" in generated_file or "\\" in generated_file:
                target_mapping[generated_file] = code
                continue
            
            # Détermine le répertoire cible selon le type de fichier
            file_ext = Path(generated_file).suffix.lower()
            
            if file_ext in [".js", ".jsx", ".ts", ".tsx"]:
                if "frontend" in affected_areas:
                    target_path = self._find_frontend_dir() / generated_file
                else:
                    target_path = self._find_or_create_dir("src") / generated_file
            elif file_ext in [".py"]:
                if "backend" in affected_areas:
                    target_path = self._find_backend_dir() / generated_file
                else:
                    target_path = self._find_or_create_dir("src") / generated_file
            elif file_ext in [".css", ".scss"]:
                target_path = self._find_or_create_dir("src/styles") / generated_file
            elif "test" in generated_file.lower() or file_ext in [".test.js", ".spec.js"]:
                target_path = self._find_or_create_dir("tests") / generated_file
            else:
                target_path = self._find_or_create_dir("src") / generated_file
            
            target_mapping[str(target_path)] = code
        
        return target_mapping
    
    def _find_frontend_dir(self) -> Path:
        """Trouve le répertoire frontend approprié"""
        possible_dirs = ["src", "client", "frontend", "web", "app"]
        for dir_name in possible_dirs:
            dir_path = self.repo_path / dir_name
            if dir_path.exists():
                return dir_path
        return self._find_or_create_dir("src")
    
    def _find_backend_dir(self) -> Path:
        """Trouve le répertoire backend approprié"""
        possible_dirs = ["src", "server", "backend", "api", "app"]
        for dir_name in possible_dirs:
            dir_path = self.repo_path / dir_name
            if dir_path.exists():
                return dir_path
        return self._find_or_create_dir("src")
    
    def _find_or_create_dir(self, dir_name: str) -> Path:
        """Trouve ou crée un répertoire"""
        dir_path = self.repo_path / dir_name
        dir_path.mkdir(parents=True, exist_ok=True)
        return dir_path
    
    def apply_code_changes(self, target_files: Dict[str, str]) -> List[str]:
        """Applique les changements de code"""
        modified_files = []
        
        for file_path, code_content in target_files.items():
            try:
                full_path = Path(file_path)
                
                # Crée les répertoires parents si nécessaire
                full_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Sauvegarde l'ancien fichier si il existe
                if full_path.exists():
                    backup_path = full_path.with_suffix(full_path.suffix + ".backup")
                    shutil.copy2(full_path, backup_path)
                
                # Écrit le nouveau contenu
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(code_content)
                
                modified_files.append(str(full_path))
                print(f"✅ Fichier modifié: {file_path}")
                
            except Exception as e:
                print(f"❌ Erreur lors de la modification de {file_path}: {e}")
        
        return modified_files
    
    def run_tests(self) -> Dict[str, any]:
        """Exécute les tests du projet"""
        test_results = {"passed": 0, "failed": 0, "status": "unknown", "output": ""}
        
        # Détecte le framework de test
        if (self.repo_path / "package.json").exists():
            test_results = self._run_npm_tests()
        elif (self.repo_path / "requirements.txt").exists() or any(self.repo_path.glob("*.py")):
            test_results = self._run_python_tests()
        else:
            test_results["status"] = "no_tests_found"
        
        return test_results
    
    def _run_npm_tests(self) -> Dict[str, any]:
        """Exécute les tests npm/jest"""
        try:
            # Vérifie si npm test est configuré
            with open(self.repo_path / "package.json", 'r') as f:
                package_data = json.load(f)
            
            if "test" not in package_data.get("scripts", {}):
                return {"passed": 0, "failed": 0, "status": "no_test_script", "output": ""}
            
            # Exécute les tests
            result = subprocess.run(
                ["npm", "test", "--", "--passWithNoTests"],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            output = result.stdout + result.stderr
            
            # Parse les résultats Jest
            passed_match = re.search(r"(\d+) passing", output)
            failed_match = re.search(r"(\d+) failing", output)
            
            return {
                "passed": int(passed_match.group(1)) if passed_match else 0,
                "failed": int(failed_match.group(1)) if failed_match else 0,
                "status": "success" if result.returncode == 0 else "failed",
                "output": output[:1000]  # Limite la sortie
            }
            
        except Exception as e:
            return {"passed": 0, "failed": 0, "status": "error", "output": str(e)}
    
    def _run_python_tests(self) -> Dict[str, any]:
        """Exécute les tests Python (pytest)"""
        try:
            # Essaie pytest en premier
            result = subprocess.run(
                ["python", "-m", "pytest", "-v", "--tb=short"],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            output = result.stdout + result.stderr
            
            # Parse les résultats pytest
            passed_match = re.search(r"(\d+) passed", output)
            failed_match = re.search(r"(\d+) failed", output)
            
            return {
                "passed": int(passed_match.group(1)) if passed_match else 0,
                "failed": int(failed_match.group(1)) if failed_match else 0,
                "status": "success" if result.returncode == 0 else "failed",
                "output": output[:1000]
            }
            
        except Exception as e:
            return {"passed": 0, "failed": 0, "status": "error", "output": str(e)}
    
    def generate_summary(self, modified_files: List[str], test_results: Dict) -> str:
        """Génère un résumé des changements"""
        summary_parts = []
        
        if modified_files:
            summary_parts.append(f"✅ {len(modified_files)} fichier(s) modifié(s)")
            summary_parts.append("📁 Fichiers:")
            for file_path in modified_files[:10]:  # Limite à 10 fichiers
                summary_parts.append(f"  - {file_path}")
            if len(modified_files) > 10:
                summary_parts.append(f"  ... et {len(modified_files) - 10} autres")
        
        if test_results["status"] != "unknown":
            if test_results["status"] == "success":
                summary_parts.append(f"🧪 Tests: {test_results['passed']} réussis")
            elif test_results["status"] == "failed":
                summary_parts.append(f"⚠️ Tests: {test_results['passed']} réussis, {test_results['failed']} échoués")
            else:
                summary_parts.append(f"🔍 Tests: {test_results['status']}")
        
        return "\n".join(summary_parts)

def main():
    """Fonction principale d'exécution"""
    # Récupération du plan d'exécution
    execution_plan_json = os.environ.get("AGENT_PLAN", "{}")
    
    try:
        execution_plan = json.loads(execution_plan_json)
        generated_code = execution_plan.get("generated_code", "")
        task_analysis = execution_plan.get("task_analysis", {})
    except json.JSONDecodeError:
        print("❌ Erreur de parsing du plan d'exécution")
        exit(1)
    
    if not generated_code.strip():
        print("⚠️ Aucun code généré à appliquer")
        print("::set-output name=changes_made::false")
        exit(0)
    
    executor = CodeExecutor()
    
    # Parse et applique le code
    files_code = executor.parse_ai_generated_code(generated_code)
    print(f"🔍 {len(files_code)} fichier(s) de code détecté(s)")
    
    if not files_code:
        print("⚠️ Aucun fichier de code détecté dans la réponse IA")
        print("::set-output name=changes_made::false")
        exit(0)
    
    # Identifie les fichiers cibles
    target_files = executor.identify_target_files(files_code, task_analysis)
    
    # Applique les changements
    modified_files = executor.apply_code_changes(target_files)
    
    # Exécute les tests
    test_results = executor.run_tests()
    
    # Génère le résumé
    summary = executor.generate_summary(modified_files, test_results)
    
    # Output pour GitHub Actions
    changes_made = len(modified_files) > 0
    print(f"::set-output name=changes_made::{str(changes_made).lower()}")
    print(f"::set-output name=files_modified::{', '.join(modified_files[:5])}")
    print(f"::set-output name=changes_summary::{summary}")
    print(f"::set-output name=tests_status::{test_results['status']}")
    
    print(f"\n📊 Résumé d'exécution:")
    print(summary)

if __name__ == "__main__":
    main() 