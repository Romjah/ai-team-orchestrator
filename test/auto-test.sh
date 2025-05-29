#!/bin/bash

# AI Team Orchestrator - Test Automatique Complet
# Ce script exécute tous les tests pour vérifier que le projet est prêt à être publié

echo "🤖 AI Team Orchestrator - Test Automatique Complet"
echo "=================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
TESTS_PASSED=0
TESTS_FAILED=0

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((TESTS_FAILED++))
    fi
}

# 1. Vérifier les dépendances
echo -e "${YELLOW}📦 1. Vérification des dépendances...${NC}"
npm list --depth=0 > /dev/null 2>&1
print_result $? "Dépendances NPM valides"

# 2. Tests unitaires
echo -e "\n${YELLOW}🧪 2. Exécution des tests unitaires...${NC}"
npm test > /dev/null 2>&1
print_result $? "Tests unitaires"

# 3. Tests fonctionnels
echo -e "\n${YELLOW}🔧 3. Exécution des tests fonctionnels...${NC}"
node test/functional-test.js > /dev/null 2>&1
print_result $? "Tests fonctionnels"

# 4. Vérification du CLI principal
echo -e "\n${YELLOW}💻 4. Vérification du CLI...${NC}"

# Version
node bin/ai-team.js --version > /dev/null 2>&1
print_result $? "CLI: version"

# Help
node bin/ai-team.js --help > /dev/null 2>&1
print_result $? "CLI: help"

# Status
node bin/ai-team.js status > /dev/null 2>&1
print_result $? "CLI: status"

# Agents
node bin/ai-team.js agents > /dev/null 2>&1
print_result $? "CLI: agents"

# 5. Vérification du binaire d'installation
echo -e "\n${YELLOW}🛠️  5. Vérification du binaire d'installation...${NC}"
node bin/install.js --help > /dev/null 2>&1
print_result $? "Binaire d'installation"

# 6. Test de la démo
echo -e "\n${YELLOW}🚀 6. Test de la démo...${NC}"
npm run demo > /dev/null 2>&1
print_result $? "Script de démonstration"

# 7. Vérification des fichiers requis
echo -e "\n${YELLOW}📄 7. Vérification des fichiers requis...${NC}"

# Fichiers essentiels
files_to_check=(
    "package.json"
    "index.js"
    "README.md"
    "LICENSE"
    "bin/ai-team.js"
    "bin/install.js"
    "lib/installer.js"
    "lib/demo.js"
    "lib/utils.js"
    "templates/.github/workflows/ai-team-zero-config.yml"
    "templates/.github/scripts/zero_config_generator.py"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Fichier: $file"
    else
        print_result 1 "Fichier manquant: $file"
    fi
done

# 8. Vérification des permissions
echo -e "\n${YELLOW}🔐 8. Vérification des permissions...${NC}"
if [ -x "bin/ai-team.js" ]; then
    print_result 0 "Permissions: bin/ai-team.js"
else
    print_result 1 "Permissions manquantes: bin/ai-team.js"
fi

if [ -x "bin/install.js" ]; then
    print_result 0 "Permissions: bin/install.js"
else
    print_result 1 "Permissions manquantes: bin/install.js"
fi

# 9. Test d'importation du module
echo -e "\n${YELLOW}📚 9. Test d'importation du module...${NC}"
node -e "import('./index.js').then(() => process.exit(0)).catch(() => process.exit(1))" > /dev/null 2>&1
print_result $? "Module importable"

# 10. Vérification de la validité du package.json
echo -e "\n${YELLOW}📋 10. Validation du package.json...${NC}"
node -e "
const pkg = require('./package.json');
if (pkg.name && pkg.version && pkg.main && pkg.bin && pkg.license) {
    process.exit(0);
} else {
    process.exit(1);
}
" > /dev/null 2>&1
print_result $? "package.json valide"

# Résumé
echo -e "\n${YELLOW}📊 Résumé des tests automatiques${NC}"
echo "================================"
echo -e "${GREEN}✅ Tests réussis: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests échoués: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Tous les tests sont passés ! Le projet est prêt à être publié.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Certains tests ont échoué. Veuillez corriger les problèmes avant de publier.${NC}"
    exit 1
fi 