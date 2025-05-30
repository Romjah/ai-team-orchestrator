/**
 * AI Team Orchestrator - Templates de Prompts Performants
 * Système avancé de templates pour structurer les modifications de code avec DeepSeek R1
 */

export class PromptTemplateManager {
  constructor() {
    this.templates = this.initializeTemplates();
    this.contextAnalyzers = this.initializeContextAnalyzers();
  }

  /**
   * Génère un prompt optimisé selon le type de tâche et le contexte
   */
  generatePrompt(title, type, additionalContext = {}) {
    const template = this.templates[type] || this.templates.feature;
    const analyzedContext = this.analyzeContext(title, type, additionalContext);
    
    return this.compileTemplate(template, {
      title,
      type,
      ...analyzedContext,
      ...additionalContext
    });
  }

  /**
   * Analyse le contexte pour enrichir le prompt
   */
  analyzeContext(title, type, additionalContext) {
    const context = {
      complexity: this.detectComplexity(title),
      technologies: this.detectTechnologies(title),
      patterns: this.detectPatterns(title, type),
      scope: this.detectScope(title),
      priority: this.detectPriority(title, type)
    };

    return { ...context, ...additionalContext };
  }

  /**
   * Détecte la complexité de la tâche
   */
  detectComplexity(title) {
    const complexityIndicators = {
      high: ['architecture', 'microservice', 'system', 'integration', 'migration', 'performance', 'scalable', 'enterprise'],
      medium: ['dashboard', 'api', 'authentication', 'database', 'workflow', 'automation'],
      low: ['button', 'form', 'page', 'style', 'text', 'image', 'simple']
    };

    const titleLower = title.toLowerCase();
    
    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some(indicator => titleLower.includes(indicator))) {
        return level;
      }
    }
    
    return 'medium';
  }

  /**
   * Détecte les technologies impliquées
   */
  detectTechnologies(title) {
    const techMap = {
      frontend: ['react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'typescript', 'tailwind', 'css', 'html', 'javascript'],
      backend: ['node', 'express', 'fastify', 'python', 'django', 'flask', 'java', 'spring', 'php', 'laravel', 'go', 'rust'],
      database: ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'prisma', 'sequelize'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'serverless', 'lambda'],
      testing: ['jest', 'cypress', 'playwright', 'vitest', 'mocha', 'junit']
    };

    const titleLower = title.toLowerCase();
    const detectedTechs = [];

    for (const [category, techs] of Object.entries(techMap)) {
      const foundTechs = techs.filter(tech => titleLower.includes(tech));
      if (foundTechs.length > 0) {
        detectedTechs.push({ category, techs: foundTechs });
      }
    }

    return detectedTechs;
  }

  /**
   * Détecte les patterns architecturaux
   */
  detectPatterns(title, type) {
    const patterns = {
      'mvc': ['model', 'view', 'controller', 'mvc'],
      'microservices': ['microservice', 'service', 'api', 'distributed'],
      'spa': ['single page', 'spa', 'router', 'navigation'],
      'crud': ['create', 'read', 'update', 'delete', 'crud', 'form'],
      'rest': ['rest', 'restful', 'endpoint', 'api'],
      'graphql': ['graphql', 'query', 'mutation', 'subscription'],
      'auth': ['authentication', 'authorization', 'login', 'jwt', 'oauth'],
      'real-time': ['websocket', 'socket.io', 'real-time', 'live', 'stream']
    };

    const titleLower = title.toLowerCase();
    const detectedPatterns = [];

    for (const [pattern, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        detectedPatterns.push(pattern);
      }
    }

    return detectedPatterns;
  }

  /**
   * Détecte la portée du projet
   */
  detectScope(title) {
    const titleLower = title.toLowerCase();
    
    if (['landing', 'page', 'component', 'button', 'form'].some(word => titleLower.includes(word))) {
      return 'component';
    } else if (['dashboard', 'admin', 'panel', 'interface'].some(word => titleLower.includes(word))) {
      return 'interface';
    } else if (['api', 'service', 'backend', 'server'].some(word => titleLower.includes(word))) {
      return 'service';
    } else if (['app', 'application', 'system', 'platform'].some(word => titleLower.includes(word))) {
      return 'application';
    }
    
    return 'feature';
  }

  /**
   * Détecte la priorité
   */
  detectPriority(title, type) {
    const titleLower = title.toLowerCase();
    const urgentKeywords = ['urgent', 'critique', 'bug', 'fix', 'emergency', 'asap'];
    const highKeywords = ['important', 'priority', 'performance', 'security', 'optimization'];
    
    if (type === 'bug_fix' || urgentKeywords.some(word => titleLower.includes(word))) {
      return 'urgent';
    } else if (highKeywords.some(word => titleLower.includes(word))) {
      return 'high';
    }
    
    return 'normal';
  }

  /**
   * Compile le template avec les variables de contexte
   */
  compileTemplate(template, context) {
    let compiled = template.base;

    // Remplacer les variables
    compiled = compiled.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });

    // Ajouter les sections spécifiques
    if (template.sections) {
      for (const [condition, section] of Object.entries(template.sections)) {
        if (this.evaluateCondition(condition, context)) {
          compiled += '\n\n' + section;
        }
      }
    }

    // Ajouter les contraintes spécifiques au type
    if (template.constraints) {
      compiled += '\n\n## Contraintes Spécifiques\n' + template.constraints;
    }

    return compiled;
  }

  /**
   * Évalue une condition pour l'inclusion de sections
   */
  evaluateCondition(condition, context) {
    // Conditions simples pour ce PoC, peut être étendu
    if (condition.startsWith('complexity:')) {
      return context.complexity === condition.split(':')[1];
    }
    if (condition.startsWith('scope:')) {
      return context.scope === condition.split(':')[1];
    }
    if (condition.startsWith('priority:')) {
      return context.priority === condition.split(':')[1];
    }
    if (condition.startsWith('pattern:')) {
      return context.patterns && context.patterns.includes(condition.split(':')[1]);
    }
    
    return false;
  }

  /**
   * Initialise tous les templates de prompts
   */
  initializeTemplates() {
    return {
      frontend: this.getFrontendTemplate(),
      backend: this.getBackendTemplate(),
      testing: this.getTestingTemplate(),
      bug_fix: this.getBugFixTemplate(),
      refactor: this.getRefactorTemplate(),
      feature: this.getFeatureTemplate(),
      architecture: this.getArchitectureTemplate(),
      performance: this.getPerformanceTemplate()
    };
  }

  /**
   * Template optimisé pour les tâches frontend
   */
  getFrontendTemplate() {
    return {
      base: `En tant qu'expert développeur Frontend avec DeepSeek R1, analysez cette demande et générez une spécification technique détaillée.

## 🎯 DEMANDE
**Titre:** {{title}}
**Type:** Frontend Development
**Complexité:** {{complexity}}
**Portée:** {{scope}}

## 📋 ANALYSE TECHNIQUE REQUISE

### Architecture Frontend
- Structure des composants et hiérarchie
- Gestion d'état (local/global)
- Routing et navigation
- Architecture des dossiers

### Interface Utilisateur
- Design system et composants réutilisables
- Responsive design et breakpoints
- Accessibilité (WCAG 2.1)
- Performance UI (lazy loading, optimisations)

### Technologies et Stack
- Framework/Library recommandé
- Outils de build et bundling
- Styling (CSS/Sass/Styled-components/Tailwind)
- Testing framework

### Intégrations
- APIs et endpoints
- Gestion des données (cache, sync)
- Authentification
- Services externes

## 🎨 SPÉCIFICATIONS VISUELLES
- Wireframes ou mockups
- Charte graphique
- Interactions et animations
- États des composants (loading, error, success)

## ⚡ CRITÈRES DE PERFORMANCE
- Time to First Byte (TTFB) < 100ms
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1

## 🔧 IMPLÉMENTATION
Générez le code suivant:
1. Structure des fichiers et dossiers
2. Composants principaux avec TypeScript
3. Styles et thèmes
4. Tests unitaires et d'intégration
5. Configuration build/dev

## ✅ CRITÈRES D'ACCEPTATION
- [ ] Interface responsive (mobile-first)
- [ ] Accessibilité WCAG 2.1 AA
- [ ] Performance Web Vitals optimale
- [ ] Tests coverage > 80%
- [ ] Code TypeScript strict
- [ ] Documentation technique`,

      sections: {
        'complexity:high': `### Architecture Avancée
- Micro-frontends ou Module Federation
- State management complexe (Redux/Zustand)
- Server-Side Rendering (SSR/SSG)
- Progressive Web App (PWA)`,

        'pattern:spa': `### Single Page Application
- Routing client-side avec React Router ou équivalent
- Code splitting par routes
- Lazy loading des composants
- Gestion de l'historique navigateur`,

        'pattern:real-time': `### Fonctionnalités Temps Réel
- WebSocket ou Server-Sent Events
- Synchronisation des données en temps réel
- Gestion des connexions/déconnexions
- Fallback pour les connexions instables`
      },

      constraints: `- Utiliser les dernières versions stables des frameworks
- Implémenter les Web Vitals dès le développement
- Code splitting automatique pour optimiser le bundle
- Support des dernières versions de navigateurs (ES2020+)
- Sécurité: CSP headers, XSS protection, HTTPS only`
    };
  }

  /**
   * Template optimisé pour les tâches backend
   */
  getBackendTemplate() {
    return {
      base: `En tant qu'expert développeur Backend avec DeepSeek R1, analysez cette demande et générez une architecture technique robuste.

## 🎯 DEMANDE
**Titre:** {{title}}
**Type:** Backend Development  
**Complexité:** {{complexity}}
**Portée:** {{scope}}

## 🏗️ ARCHITECTURE TECHNIQUE

### Structure du Service
- Architecture hexagonale ou clean architecture
- Séparation des couches (Controller, Service, Repository)
- Injection de dépendances
- Design patterns appliqués

### API Design
- RESTful ou GraphQL endpoints
- Versioning strategy (v1, v2...)
- Documentation OpenAPI/Swagger
- Rate limiting et throttling

### Base de Données
- Modélisation des données
- Relations et contraintes
- Migrations et seeds
- Optimisations et indexes

### Sécurité
- Authentification (JWT, OAuth2, SAML)
- Autorisation (RBAC, ABAC)
- Validation des données
- Protection OWASP Top 10

## 💾 PERSISTANCE ET DONNÉES
- Schéma de base de données
- ORM/ODM configuration
- Cache strategy (Redis, Memcached)
- Backup et recovery

## 🚀 PERFORMANCE ET SCALABILITÉ
- Load balancing
- Horizontal scaling
- Database optimization
- Monitoring et observabilité

## 🔧 IMPLÉMENTATION
Générez le code suivant:
1. Structure projet avec modules/packages
2. Modèles de données et migrations
3. Controllers et routes
4. Services métier
5. Tests unitaires et d'intégration
6. Configuration Docker/docker-compose

## ✅ CRITÈRES D'ACCEPTATION
- [ ] API REST/GraphQL complètement documentée
- [ ] Authentification et autorisation sécurisées
- [ ] Tests coverage > 85%
- [ ] Performance: < 100ms response time
- [ ] Monitoring et logs structurés
- [ ] Code quality (ESLint, SonarQube)`,

      sections: {
        'complexity:high': `### Microservices Architecture
- Service discovery et service mesh
- Event-driven architecture
- CQRS et Event Sourcing
- Distributed tracing et observabilité`,

        'pattern:microservices': `### Décomposition en Microservices
- Bounded contexts et domain modeling
- Inter-service communication (HTTP, gRPC, events)
- Data consistency patterns (Saga, 2PC)
- Circuit breaker et retry policies`,

        'pattern:auth': `### Système d'Authentification
- Multi-factor authentication (MFA)
- Social login providers
- Session management
- Password policies et hashing`
      },

      constraints: `- Utiliser des frameworks éprouvés (Express, Fastify, NestJS)
- Implémenter les 12-factor app principles
- Sécurité by design avec validation stricte
- Monitoring avec Prometheus/Grafana ou équivalent
- Containerisation Docker avec multi-stage builds`
    };
  }

  /**
   * Template optimisé pour les tests
   */
  getTestingTemplate() {
    return {
      base: `En tant qu'expert QA Engineer avec DeepSeek R1, concevez une stratégie de test complète et automatisée.

## 🎯 DEMANDE
**Titre:** {{title}}
**Type:** Testing & Quality Assurance
**Complexité:** {{complexity}}
**Portée:** {{scope}}

## 🧪 STRATÉGIE DE TEST

### Pyramide de Test
- Tests unitaires (70%) - Logique métier isolée
- Tests d'intégration (20%) - APIs et services
- Tests end-to-end (10%) - Parcours utilisateur

### Types de Tests
- **Fonctionnels:** Happy path, edge cases, error handling
- **Non-fonctionnels:** Performance, sécurité, accessibilité
- **Régression:** Suites automatisées
- **Smoke tests:** Tests critiques post-déploiement

## 🔧 OUTILS ET FRAMEWORKS
- Framework de test (Jest, Vitest, Mocha)
- E2E testing (Cypress, Playwright, Puppeteer)
- Performance testing (K6, Artillery)
- Visual regression (Percy, Chromatic)

## 📊 COUVERTURE ET MÉTRIQUES
- Code coverage > 85%
- Branch coverage > 80%
- Mutation testing score > 75%
- Test execution time < 5min

## 🔧 IMPLÉMENTATION
Générez les tests suivants:
1. Tests unitaires avec mocks et stubs
2. Tests d'intégration API
3. Tests E2E pour parcours critiques
4. Tests de performance et charge
5. Tests de sécurité (OWASP ZAP)
6. Configuration CI/CD

## ✅ CRITÈRES D'ACCEPTATION
- [ ] Suite de tests complète et maintenable
- [ ] Rapports de tests détaillés
- [ ] Intégration CI/CD
- [ ] Tests parallélisés pour vitesse
- [ ] Documentation des scénarios de test`,

      constraints: `- Tests rapides et fiables (< 10 secondes unitaires)
- Isolation complète entre tests
- Data fixtures et cleanup automatique
- Rapports JUnit/Allure pour CI/CD
- Tests cross-browser pour E2E`
    };
  }

  /**
   * Template optimisé pour les corrections de bugs
   */
  getBugFixTemplate() {
    return {
      base: `En tant qu'expert debugger avec DeepSeek R1, analysez ce bug et proposez une solution robuste.

## 🐛 ANALYSE DU BUG
**Titre:** {{title}}
**Priority:** {{priority}}
**Complexité:** {{complexity}}

## 🔍 DIAGNOSTIC REQUIS

### Investigation
- Reproduction du bug (étapes précises)
- Analyse des logs et stack traces
- Identification de la root cause
- Impact et périmètre affecté

### Analyse Technique
- Code review des sections concernées
- Dependencies et versions impliquées
- Environment et configuration
- Performance impact

## 🛠️ PLAN DE RÉSOLUTION

### Solution Proposée
- Fix minimal et sûr
- Régression tests
- Validation du fix
- Plan de rollback si nécessaire

### Prévention
- Tests additionnels
- Monitoring amélioré
- Documentation mise à jour
- Code review checklist

## 🔧 IMPLÉMENTATION
Générez la correction suivante:
1. Fix du code avec commentaires explicatifs
2. Tests de régression spécifiques
3. Scripts de validation
4. Documentation technique
5. Monitoring/alerting additionnel

## ✅ CRITÈRES D'ACCEPTATION
- [ ] Bug reproduit et corrigé
- [ ] Tests de régression ajoutés
- [ ] Impact validé en staging
- [ ] Performance non dégradée
- [ ] Documentation mise à jour`,

      constraints: `- Fix minimal pour réduire les risques
- Tests automatisés pour prévenir la régression
- Monitoring pour détecter les récidives
- Rollback plan documenté
- Post-mortem si bug critique`
    };
  }

  /**
   * Template par défaut pour les features
   */
  getFeatureTemplate() {
    return {
      base: `En tant qu'expert développeur avec DeepSeek R1, concevez et implémentez cette nouvelle fonctionnalité.

## 🎯 DEMANDE
**Titre:** {{title}}
**Type:** Feature Development
**Complexité:** {{complexity}}
**Portée:** {{scope}}

## 📋 SPÉCIFICATIONS FONCTIONNELLES

### Objectifs
- Valeur business de la fonctionnalité
- Problème résolu pour l'utilisateur
- Métriques de succès

### Fonctionnalités Détaillées
- User stories et cas d'usage
- Workflows et parcours utilisateur
- Business rules et validations
- Edge cases et gestion d'erreurs

## 🏗️ CONCEPTION TECHNIQUE

### Architecture
- Design pattern approprié
- Intégration avec l'existant
- APIs et interfaces
- Data flow et state management

### Technologies
- Stack technique recommandée
- Librairies et dépendances
- Configuration et setup
- Build et déploiement

## 🔧 IMPLÉMENTATION
Générez l'implémentation suivante:
1. Architecture et structure
2. Code principal avec tests
3. Documentation technique
4. Guide d'utilisation
5. Scripts de déploiement

## ✅ CRITÈRES D'ACCEPTATION
- [ ] Fonctionnalité complète selon specs
- [ ] Tests unitaires et d'intégration
- [ ] Performance optimisée
- [ ] Sécurité validée
- [ ] Documentation utilisateur`,

      constraints: `- Code maintenable et évolutif
- Performance compatible avec l'existant
- Sécurité by design
- Backward compatibility préservée
- Monitoring et observabilité intégrés`
    };
  }

  /**
   * Template pour refactoring
   */
  getRefactorTemplate() {
    return {
      base: `En tant qu'expert en refactoring avec DeepSeek R1, améliorez ce code tout en préservant les fonctionnalités.

## 🎯 DEMANDE DE REFACTORING
**Titre:** {{title}}
**Complexité:** {{complexity}}
**Portée:** {{scope}}

## 🔍 ANALYSE DU CODE EXISTANT

### Code Smells Identifiés
- Duplications et violations DRY
- Complexité cyclomatique élevée
- Couplage fort entre modules
- Responsabilités mal définies

### Objectifs du Refactoring
- Amélioration de la lisibilité
- Réduction de la complexité
- Meilleure testabilité
- Performance optimisée

## 🛠️ STRATÉGIE DE REFACTORING

### Patterns à Appliquer
- Extract Method/Class
- Strategy Pattern
- Dependency Injection
- SOLID principles

### Plan d'Exécution
- Refactoring incrémental
- Tests de régression continus
- Validation des performances
- Code review étapes par étapes

## 🔧 IMPLÉMENTATION
Générez le refactoring suivant:
1. Analyse détaillée du code existant
2. Code refactorisé par étapes
3. Tests de régression complets
4. Comparaison performance avant/après
5. Documentation des changements

## ✅ CRITÈRES D'ACCEPTATION
- [ ] Fonctionnalités préservées (100%)
- [ ] Code coverage maintenu/amélioré
- [ ] Performance égale ou meilleure
- [ ] Complexité réduite (cyclomatic < 10)
- [ ] Code review validé`,

      constraints: `- Aucune régression fonctionnelle
- Refactoring par petites étapes validées
- Tests automatisés obligatoires
- Performance monitoring continu
- Documentation des changements architecturaux`
    };
  }

  /**
   * Template pour architecture
   */
  getArchitectureTemplate() {
    return {
      base: `En tant qu'architecte logiciel expert avec DeepSeek R1, concevez une architecture robuste et scalable.

## 🎯 DEMANDE ARCHITECTURALE
**Titre:** {{title}}
**Complexité:** {{complexity}}
**Portée:** {{scope}}

## 🏛️ CONCEPTION ARCHITECTURALE

### Vision Architecture
- Patterns architecturaux (MVC, MVP, MVVM, Hexagonal)
- Principes SOLID et Clean Architecture
- Domain-Driven Design si applicable
- Event-Driven ou Request-Response

### Scalabilité et Performance
- Horizontal vs Vertical scaling
- Load balancing strategy
- Caching layers (Redis, CDN)
- Database sharding/partitioning

### Sécurité Architecture
- Security by design
- Zero-trust principles
- Data encryption at rest/transit
- Access control et audit trails

## 🔧 IMPLÉMENTATION
Générez l'architecture suivante:
1. Diagrammes d'architecture (C4 model)
2. Structure de projet et modules
3. Interfaces et contrats
4. Configuration et infrastructure
5. Documentation architecturale
6. Migration plan si nécessaire

## ✅ CRITÈRES D'ACCEPTATION
- [ ] Architecture documentée et validée
- [ ] Patterns bien définis et appliqués
- [ ] Scalabilité prouvée par design
- [ ] Sécurité intégrée dès la conception
- [ ] Performance benchmarks définis`,

      constraints: `- Standards industry respectés
- Documentation architecture vivante
- Monitoring et observabilité intégrés
- Infrastructure as Code
- Disaster recovery plan`
    };
  }

  /**
   * Template pour performance
   */
  getPerformanceTemplate() {
    return {
      base: `En tant qu'expert performance avec DeepSeek R1, optimisez et améliorez les performances système.

## 🎯 OPTIMISATION PERFORMANCE
**Titre:** {{title}}
**Complexité:** {{complexity}}
**Portée:** {{scope}}

## 📊 ANALYSE PERFORMANCE

### Métriques Actuelles
- Response time et throughput
- Memory usage et CPU utilization
- Network latency et bandwidth
- Database query performance

### Bottlenecks Identifiés
- Code inefficace ou algorithms O(n²)
- N+1 queries ou missing indexes
- Memory leaks ou excessive GC
- Network round-trips inutiles

### Objectifs Performance
- Response time target: < 100ms
- Throughput target: X req/sec
- Memory usage: < Y MB
- 99th percentile: < Z ms

## 🚀 STRATÉGIES D'OPTIMISATION

### Frontend Optimizations
- Code splitting et lazy loading
- Image optimization et WebP
- Browser caching strategies
- Service Workers et PWA

### Backend Optimizations
- Database query optimization
- Connection pooling
- Caching layers (Redis, Memcached)
- Asynchronous processing

### Infrastructure Optimizations
- CDN configuration
- Load balancer tuning
- Auto-scaling policies
- Container optimization

## 🔧 IMPLÉMENTATION
Générez les optimisations suivantes:
1. Profiling et benchmarking tools
2. Code optimisé avec mesures
3. Caching implementation
4. Monitoring et alerting
5. Load testing scripts
6. Performance regression tests

## ✅ CRITÈRES D'ACCEPTATION
- [ ] Targets performance atteints
- [ ] Monitoring continu en place
- [ ] Load tests validés
- [ ] Regression tests automatisés
- [ ] Documentation des optimisations`,

      constraints: `- Optimizations mesurées et prouvées
- Performance budgets respectés
- Monitoring real-time en production
- Load testing automatisé en CI/CD
- Performance regression prevention`
    };
  }

  /**
   * Initialise les analyseurs de contexte
   */
  initializeContextAnalyzers() {
    return {
      projectSize: this.analyzeProjectSize.bind(this),
      techStack: this.analyzeTechStack.bind(this),
      teamSize: this.analyzeTeamSize.bind(this),
      timeline: this.analyzeTimeline.bind(this)
    };
  }

  analyzeProjectSize(context) {
    // Analyse basée sur les mots-clés pour déterminer la taille du projet
    return context.complexity === 'high' ? 'large' : 'medium';
  }

  analyzeTechStack(context) {
    // Retourne les technologies détectées
    return context.technologies || [];
  }

  analyzeTeamSize(context) {
    // Estimation de la taille d'équipe basée sur la complexité
    return context.complexity === 'high' ? 'large' : 'small';
  }

  analyzeTimeline(context) {
    // Estimation du timeline basée sur la priorité et complexité
    if (context.priority === 'urgent') return 'immediate';
    if (context.complexity === 'high') return 'long';
    return 'medium';
  }
}

export default PromptTemplateManager; 