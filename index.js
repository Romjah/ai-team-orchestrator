#!/usr/bin/env node

/**
 * AI Team Orchestrator v2.0
 * Propulsé par DeepSeek R1 - L'IA la plus avancée !
 * Création automatique d'issues GitHub ultra-rapide
 */

export { APIKeyManager } from './lib/api-config.js';

// Version info
export const version = '2.0.0';
export const name = 'ai-team-orchestrator';

// Point d'entrée principal
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🧠 AI Team Orchestrator v2.0 - Propulsé par DeepSeek R1');
  console.log('Utilisez "ai-team --help" pour voir les commandes disponibles');
  console.log('');
  console.log('🚀 Commandes principales:');
  console.log('  ai-team issue "titre" --type frontend');
  console.log('  ai-team create "description"');
  console.log('  ai-team setup-api');
} 