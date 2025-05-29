#!/usr/bin/env node

/**
 * AI Team Orchestrator
 * Zero-Config AI coding team for GitHub
 */

export { installAITeam, checkStatus, listAgents } from './lib/installer.js';
export { createDemoIssue, listDemoTypes } from './lib/demo.js';

// Version info
export const version = '1.1.0';
export const name = '@ai-team/orchestrator';

// Quick setup function
export async function quickSetup(options = {}) {
  const { installAITeam } = await import('./lib/installer.js');
  
  const config = {
    type: options.type || 'zero-config',
    force: options.force || false
  };
  
  try {
    await installAITeam(config.type, config.force);
    return {
      success: true,
      message: 'AI Team installed successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// If called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🤖 AI Team Orchestrator');
  console.log('Use "ai-team --help" for available commands');
} 