#!/usr/bin/env node

/**
 * 🧪 Script de test pour le système de templates performants
 * AI Team Orchestrator v2.5.0
 */

import PromptTemplateManager from '../lib/prompt-templates.js';
import EnhancedTemplatesHelper from '../lib/enhanced-templates.js';
import chalk from 'chalk';

console.log(chalk.blue.bold('🧪 AI Team Orchestrator v2.5.0 - Test des Templates Performants'));
console.log(chalk.cyan('='.repeat(70)));

async function testTemplateSystem() {
  console.log(chalk.yellow('\n📋 Test 1: Frontend Template avec analyse de contexte'));
  
  // Simuler un contexte de projet React + TypeScript
  const mockContext = {
    projectName: 'modern-dashboard',
    projectType: 'frontend',
    dependencies: ['react', 'typescript', 'tailwindcss'],
    hasTypeScript: true,
    testFrameworks: ['jest', 'cypress'],
    configFiles: ['tsconfig.json', 'tailwind.config.js']
  };

  const promptManager = new PromptTemplateManager();
  const frontendPrompt = promptManager.generatePrompt(
    'Dashboard analytics moderne avec animations',
    'frontend',
    mockContext
  );

  console.log(chalk.green('✅ Prompt Frontend généré:'));
  console.log(chalk.gray(frontendPrompt.substring(0, 300) + '...'));
  
  console.log(chalk.yellow('\n📋 Test 2: Backend Template'));
  
  const backendPrompt = promptManager.generatePrompt(
    'API REST avec authentification JWT',
    'backend',
    {
      projectType: 'backend',
      dependencies: ['express', 'prisma'],
      hasTypeScript: true
    }
  );

  console.log(chalk.green('✅ Prompt Backend généré:'));
  console.log(chalk.gray(backendPrompt.substring(0, 300) + '...'));

  console.log(chalk.yellow('\n📋 Test 3: Enhanced Default Description'));
  
  const enhancedDefault = EnhancedTemplatesHelper.getEnhancedDefaultDescription(
    'Landing page moderne',
    'frontend',
    mockContext
  );

  console.log(chalk.green('✅ Description enrichie générée:'));
  console.log(chalk.gray(enhancedDefault.substring(0, 400) + '...'));

  console.log(chalk.yellow('\n📋 Test 4: Détection de complexité'));
  
  const complexityTests = [
    'Simple button component',
    'Dashboard with real-time analytics',
    'Microservice architecture with event sourcing'
  ];

  complexityTests.forEach(title => {
    const complexity = promptManager.detectComplexity(title);
    console.log(chalk.cyan(`"${title}" → Complexité: ${complexity}`));
  });

  console.log(chalk.yellow('\n📋 Test 5: Détection de technologies'));
  
  const techTests = [
    'React dashboard with TypeScript',
    'Express API with MongoDB',
    'Next.js app with Tailwind CSS'
  ];

  techTests.forEach(title => {
    const techs = promptManager.detectTechnologies(title);
    console.log(chalk.cyan(`"${title}" → Technologies: ${JSON.stringify(techs)}`));
  });

  console.log(chalk.green('\n🎉 Tous les tests terminés avec succès !'));
  console.log(chalk.cyan('\n💡 Le système de templates performants est opérationnel.'));
  console.log(chalk.white('\n🚀 Testez maintenant avec:'));
  console.log(chalk.blue('   ai-team issue "Landing page moderne" --type frontend'));
}

// Exécuter les tests
testTemplateSystem().catch(error => {
  console.error(chalk.red('❌ Erreur lors des tests:'), error);
  process.exit(1);
}); 