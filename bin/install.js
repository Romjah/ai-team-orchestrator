#!/usr/bin/env node

/**
 * AI Team Orchestrator - Installation CLI
 * Zero-Config AI coding team for GitHub
 */

import { installAITeam } from '../lib/installer.js';
import { program } from 'commander';
import chalk from 'chalk';

program
  .name('ai-team-install')
  .description('Install AI Team Orchestrator for your GitHub repository')
  .version('1.0.0')
  .option('-t, --type <type>', 'installation type (zero-config, custom)', 'zero-config')
  .option('-f, --force', 'force reinstallation', false)
  .option('-v, --verbose', 'verbose output', false);

program.action(async (options) => {
  console.log(chalk.blue('🤖 AI Team Orchestrator - Installation'));
  console.log(chalk.gray('Zero-Config AI coding team for GitHub\n'));

  try {
    await installAITeam(options.type, options.force);
    console.log(chalk.green('\n✅ AI Team installed successfully!'));
  } catch (error) {
    console.error(chalk.red('\n❌ Installation failed:'), error.message);
    process.exit(1);
  }
});

program.parse(); 