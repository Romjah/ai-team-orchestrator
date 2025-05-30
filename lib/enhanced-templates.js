/**
 * Enhanced Templates Helper - Méthodes utilitaires pour les templates
 * Support pour AI Team Orchestrator v2.5.0
 */

import fs from 'fs';

export class EnhancedTemplatesHelper {
  
  /**
   * Collecte le contexte du projet pour enrichir les prompts
   */
  static async gatherProjectContext() {
    const context = {};
    
    try {
      // Analyser package.json s'il existe
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        context.projectName = packageJson.name;
        context.dependencies = Object.keys(packageJson.dependencies || {});
        context.devDependencies = Object.keys(packageJson.devDependencies || {});
        context.scripts = Object.keys(packageJson.scripts || {});
        
        // Détecter le type de projet
        if (context.dependencies.includes('react') || context.dependencies.includes('vue') || context.dependencies.includes('angular')) {
          context.projectType = 'frontend';
        } else if (context.dependencies.includes('express') || context.dependencies.includes('fastify') || context.dependencies.includes('koa')) {
          context.projectType = 'backend';
        }
      }

      // Analyser la structure des dossiers
      const commonDirs = ['src', 'lib', 'components', 'pages', 'api', 'services', 'utils', 'tests', '__tests__'];
      context.projectStructure = commonDirs.filter(dir => fs.existsSync(dir));

      // Analyser les fichiers de configuration
      const configFiles = ['.eslintrc', 'tsconfig.json', 'tailwind.config.js', 'next.config.js', 'vite.config.js', 'webpack.config.js'];
      context.configFiles = configFiles.filter(file => 
        fs.existsSync(file) || fs.existsSync(file + '.js') || fs.existsSync(file + '.json')
      );

      // Détecter TypeScript
      if (fs.existsSync('tsconfig.json') || context.dependencies?.includes('typescript')) {
        context.hasTypeScript = true;
      }

      // Détecter les frameworks de test
      const testFrameworks = ['jest', 'vitest', 'mocha', 'cypress', 'playwright'];
      context.testFrameworks = testFrameworks.filter(framework => 
        context.dependencies?.includes(framework) || context.devDependencies?.includes(framework)
      );

    } catch (error) {
      console.log('📝 Contexte projet non détecté, utilisation des defaults');
    }

    return context;
  }

  /**
   * Génère des suggestions de stack technique selon le contexte
   */
  static generateTechStackSuggestions(type, context) {
    const hasReact = context.dependencies?.includes('react');
    const hasVue = context.dependencies?.includes('vue');
    const hasNext = context.dependencies?.includes('next');
    const hasExpress = context.dependencies?.includes('express');
    const hasTypeScript = context.hasTypeScript;

    const suggestions = {
      frontend: `- **Framework:** ${hasReact ? 'React' : hasVue ? 'Vue.js' : hasNext ? 'Next.js' : 'React (recommandé)'}
- **Styling:** ${context.dependencies?.includes('tailwindcss') ? 'Tailwind CSS' : 'CSS Modules / Styled Components'}
- **State Management:** ${hasReact ? 'React Query + Zustand' : 'Pinia / Vuex'}
- **Testing:** ${context.testFrameworks?.includes('jest') ? 'Jest + Testing Library' : 'Vitest + Testing Library'}
- **Build:** ${hasNext ? 'Next.js' : 'Vite / Webpack'}`,

      backend: `- **Runtime:** ${context.dependencies?.includes('express') ? 'Node.js + Express' : 'Node.js + Fastify'}
- **Base de données:** PostgreSQL + Prisma ORM
- **Authentification:** JWT + bcrypt
- **Validation:** Zod / Joi
- **Testing:** ${context.testFrameworks?.includes('jest') ? 'Jest + Supertest' : 'Vitest + Supertest'}`,

      testing: `- **Unit Testing:** ${context.testFrameworks?.includes('jest') ? 'Jest' : 'Vitest'} + Testing Library
- **E2E Testing:** ${context.testFrameworks?.includes('cypress') ? 'Cypress' : 'Playwright'}
- **Performance:** K6 / Artillery
- **Visual Testing:** Percy / Chromatic
- **Coverage:** NYC / C8`,

      bug_fix: `- **Debugging:** Chrome DevTools / Node.js Inspector
- **Logging:** Winston / Pino
- **Monitoring:** Sentry / DataDog
- **Profiling:** Clinic.js / 0x
- **Testing:** Framework existant + tests de régression`,

      refactor: `- **Linting:** ESLint + Prettier
- **Type Checking:** ${hasTypeScript ? 'TypeScript strict mode' : 'TypeScript (migration recommandée)'}
- **Code Analysis:** SonarQube / CodeClimate
- **Testing:** Maintien de la couverture existante
- **Documentation:** JSDoc / TSDoc`
    };

    return suggestions[type] || suggestions.feature || `- Technologies adaptées au projet existant
- TypeScript pour la robustesse${hasTypeScript ? ' (déjà configuré)' : ''}
- Framework de test moderne
- Outils de qualité de code (ESLint, Prettier)`;
  }

  /**
   * Description enrichie par défaut avec templates avancés
   */
  static getEnhancedDefaultDescription(title, type, context) {
    const techStack = this.generateTechStackSuggestions(type, context);
    const complexity = context.complexity || 'medium';
    
    return `## 🎯 Objectif
${title}

## 📋 Description Technique
Tâche de développement **${type}** avec une complexité estimée à **${complexity}**.

${this.getTypeSpecificSection(type)}

## 🔧 Stack Technique Suggérée
${techStack}

## ⚡ Critères de Performance
${this.getPerformanceCriteria(type)}

## ✅ Critères d'Acceptation
${this.getAcceptanceCriteria(type)}

## 🧪 Tests Requis
${this.getTestingRequirements(type)}

## 📚 Documentation
- Documentation technique complète
- Commentaires de code explicatifs
- Guide d'utilisation si applicable
- Diagrammes d'architecture si nécessaire

---
## 🤖 Métadonnées AI Team
- **Template utilisé:** ${type} (fallback enrichi)
- **Complexité détectée:** ${complexity}
- **Contexte projet:** ${context.projectType || 'détection automatique'}
- **TypeScript:** ${context.hasTypeScript ? '✅ Détecté' : '❌ Non détecté'}
- **Frameworks de test:** ${context.testFrameworks?.join(', ') || 'À définir'}

*Généré par AI Team Orchestrator v2.5.0 avec système de templates avancés*`;
  }

  static getTypeSpecificSection(type) {
    const sections = {
      frontend: `### 🎨 Spécifications Frontend
- Interface utilisateur moderne et responsive
- Composants réutilisables et maintenables
- Gestion d'état appropriée (local/global)
- Optimisations de performance (lazy loading, code splitting)
- Accessibilité (WCAG 2.1)`,

      backend: `### ⚙️ Spécifications Backend
- Architecture REST ou GraphQL selon le besoin
- Modélisation de données robuste
- Authentification et autorisation sécurisées
- Gestion d'erreurs et logging appropriés
- Optimisations de performance (cache, queries)`,

      testing: `### 🧪 Stratégie de Test
- Tests unitaires avec haute couverture
- Tests d'intégration pour les APIs
- Tests end-to-end pour les parcours critiques
- Tests de performance et de charge
- Validation de sécurité`,

      bug_fix: `### 🐛 Analyse et Correction
- Investigation approfondie de la cause racine
- Reproduction du bug en environnement de test
- Correction minimale et sûre
- Tests de régression pour éviter la récurrence
- Documentation de la solution`,

      refactor: `### 🏗️ Refactoring Structuré
- Analyse du code existant et identification des améliorations
- Refactoring incrémental avec validation continue
- Amélioration de la lisibilité et de la maintenabilité
- Réduction de la complexité cyclomatique
- Préservation des fonctionnalités existantes`,

      feature: `### 🚀 Nouvelle Fonctionnalité
- Spécifications fonctionnelles détaillées
- Conception technique adaptée à l'architecture existante
- Implémentation par étapes avec validation
- Tests complets de la fonctionnalité
- Documentation utilisateur et technique`
    };

    return sections[type] || sections.feature;
  }

  static getPerformanceCriteria(type) {
    const criteria = {
      frontend: `- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1
- Bundle size optimisé avec code splitting`,

      backend: `- Response time API < 100ms (95th percentile)
- Throughput > 1000 req/sec
- Memory usage stable (pas de leaks)
- Database query time < 50ms
- Error rate < 0.1%`,

      testing: `- Test execution time < 5min (suite complète)
- Tests unitaires < 10s
- Tests E2E < 2min par parcours
- Coverage report génération < 30s
- Parallel execution optimisée`,

      bug_fix: `- Correction sans dégradation performance
- Temps de résolution < 24h pour bugs critiques
- Impact minimal sur l'existant
- Validation en staging avant production`,

      refactor: `- Performance égale ou améliorée
- Temps de build inchangé ou réduit
- Memory footprint maintenu
- Aucune régression fonctionnelle`
    };

    return criteria[type] || criteria.feature || `- Performance adaptée au type de tâche
- Monitoring des métriques clés
- Optimisation selon les besoins
- Validation avant déploiement`;
  }

  static getAcceptanceCriteria(type) {
    const criteria = {
      frontend: `- [ ] Interface responsive (mobile, tablet, desktop)
- [ ] Accessibilité WCAG 2.1 AA validée
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Performance Web Vitals dans les seuils
- [ ] Tests E2E des parcours principaux`,

      backend: `- [ ] API complètement documentée (OpenAPI/Swagger)
- [ ] Authentification et autorisation implémentées
- [ ] Validation des données d'entrée robuste
- [ ] Gestion d'erreurs appropriée
- [ ] Logs structurés et monitoring`,

      testing: `- [ ] Couverture de code > 85%
- [ ] Tests stables et fiables (pas de flaky tests)
- [ ] Rapports de test détaillés et exploitables
- [ ] Intégration CI/CD fonctionnelle
- [ ] Documentation des scénarios de test`,

      bug_fix: `- [ ] Bug reproduit et corrigé
- [ ] Tests de régression ajoutés
- [ ] Validation en environnement de staging
- [ ] Aucune régression introduite
- [ ] Post-mortem documenté si critique`,

      refactor: `- [ ] Fonctionnalités existantes préservées
- [ ] Tests existants passent toujours
- [ ] Code plus lisible et maintenable
- [ ] Complexité réduite (métriques améliorées)
- [ ] Documentation technique mise à jour`
    };

    return criteria[type] || criteria.feature || `- [ ] Fonctionnalité implémentée selon les spécifications
- [ ] Tests complets (unitaires, intégration, E2E)
- [ ] Code review validé par l'équipe
- [ ] Documentation technique et utilisateur
- [ ] Déploiement validé en staging`;
  }

  static getTestingRequirements(type) {
    const requirements = {
      frontend: `- Tests unitaires des composants React/Vue
- Tests d'intégration des hooks et stores
- Tests E2E des parcours utilisateur
- Tests de régression visuelle
- Tests d'accessibilité automatisés`,

      backend: `- Tests unitaires des services et utilitaires
- Tests d'intégration des APIs
- Tests de base de données avec fixtures
- Tests de sécurité (authentification, validation)
- Tests de performance et de charge`,

      testing: `- Stratégie de test complète définie
- Suites de tests automatisées
- Tests de performance intégrés
- Monitoring de la qualité des tests
- Formation équipe sur les outils`,

      bug_fix: `- Tests reproduisant le bug avant correction
- Tests de régression spécifiques
- Validation manuelle du fix
- Tests d'impact sur les fonctionnalités connexes`,

      refactor: `- Conservation des tests existants
- Tests additionnels pour le code refactorisé
- Validation de non-régression complète
- Tests de performance avant/après`
    };

    return requirements[type] || requirements.feature || `- Tests unitaires avec couverture > 80%
- Tests d'intégration des points d'entrée
- Tests E2E des fonctionnalités principales
- Tests de régression automatisés`;
  }
}

export default EnhancedTemplatesHelper; 