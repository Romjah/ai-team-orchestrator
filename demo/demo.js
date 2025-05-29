#!/usr/bin/env node

/**
 * AI Team Orchestrator - Demo Script
 * This demonstrates how to use the AI Team Orchestrator in your project
 */

import { quickSetup, createDemoIssue, checkStatus, listAgents } from '../index.js';
import chalk from 'chalk';

async function runDemo() {
  console.log(chalk.blue.bold('🚀 AI Team Orchestrator Demo\n'));
  
  console.log(chalk.yellow('1. Checking current status...'));
  await checkStatus();
  
  console.log(chalk.yellow('\n2. Listing available AI agents...'));
  listAgents();
  
  console.log(chalk.yellow('\n3. Example: Quick setup'));
  console.log(chalk.gray('To install AI Team in your project:'));
  console.log(chalk.cyan('await quickSetup({ type: "zero-config" })'));
  
  console.log(chalk.yellow('\n4. Example: Create a demo issue'));
  console.log(chalk.gray('To create a test issue:'));
  console.log(chalk.cyan('await createDemoIssue("frontend")'));
  
  console.log(chalk.green('\n✅ Demo complete!'));
  console.log(chalk.gray('Run "ai-team install" to set up AI Team in your project.'));
}

// Run demo if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().catch(error => {
    console.error(chalk.red('Demo failed:'), error);
    process.exit(1);
  });
} 