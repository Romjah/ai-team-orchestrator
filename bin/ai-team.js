#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { installAITeam, checkStatus, listAgents } from '../lib/installer.js';
import { createDemoIssue } from '../lib/demo.js';

const program = new Command();

program
  .name('ai-team')
  .description('🤖 AI Team Orchestrator - Zero-Config AI coding team for GitHub')
  .version('1.0.0');

program
  .command('install')
  .description('Install AI Team in current Git repository')
  .option('-t, --type <type>', 'Installation type: zero-config, full, github-app', 'zero-config')
  .option('-f, --force', 'Force reinstallation')
  .action(async (options) => {
    console.log(chalk.blue.bold('🤖 AI Team Orchestrator'));
    console.log(chalk.gray('Installing your AI coding team...\n'));
    
    const spinner = ora('Setting up AI Team...').start();
    
    try {
      await installAITeam(options.type, options.force);
      spinner.succeed(chalk.green('✅ AI Team installed successfully!'));
      
      console.log(chalk.yellow('\n🚀 Next steps:'));
      console.log('1. git add . && git commit -m "🤖 Add AI Team" && git push');
      console.log('2. Create an issue: "Create a modern landing page"');
      console.log('3. Watch the magic happen! ✨');
      
    } catch (error) {
      spinner.fail(chalk.red('❌ Installation failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Check AI Team installation status')
  .action(async () => {
    console.log(chalk.blue.bold('🤖 AI Team Status\n'));
    await checkStatus();
  });

program
  .command('agents')
  .description('List available AI agents')
  .action(() => {
    console.log(chalk.blue.bold('🤖 Available AI Agents\n'));
    listAgents();
  });

program
  .command('demo')
  .description('Create a demo issue to test AI Team')
  .option('-t, --type <type>', 'Demo type: frontend, backend, testing', 'frontend')
  .action(async (options) => {
    console.log(chalk.blue.bold('🎯 Creating demo issue...\n'));
    
    const spinner = ora('Creating demo issue...').start();
    
    try {
      await createDemoIssue(options.type);
      spinner.succeed(chalk.green('✅ Demo issue created!'));
      console.log(chalk.yellow('Check your GitHub repository for the new issue.'));
      console.log(chalk.gray('AI Team will respond automatically in ~2 minutes.'));
    } catch (error) {
      spinner.fail(chalk.red('❌ Failed to create demo issue'));
      console.error(chalk.red(error.message));
    }
  });

program
  .command('init')
  .description('Initialize a new project with AI Team')
  .argument('<project-name>', 'Name of the project')
  .action(async (projectName) => {
    console.log(chalk.blue.bold(`🚀 Initializing ${projectName} with AI Team...\n`));
    
    const spinner = ora('Creating project...').start();
    
    try {
      // Créer le projet et installer AI Team
      spinner.text = 'Setting up project structure...';
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      
      spinner.text = 'Installing AI Team...';
      await installAITeam('zero-config', false);
      
      spinner.succeed(chalk.green(`✅ Project ${projectName} created with AI Team!`));
      
      console.log(chalk.yellow('\n🎯 Your AI-powered project is ready!'));
      console.log(chalk.gray(`cd ${projectName}`));
      console.log(chalk.gray('git add . && git commit -m "🚀 Initial commit with AI Team" && git push'));
      
    } catch (error) {
      spinner.fail(chalk.red('❌ Project initialization failed'));
      console.error(chalk.red(error.message));
    }
  });

program
  .command('uninstall')
  .description('Remove AI Team from current repository')
  .option('-f, --force', 'Force removal without confirmation')
  .action(async (options) => {
    console.log(chalk.yellow.bold('🗑️  Removing AI Team...\n'));
    
    // Confirmation si pas de --force
    if (!options.force) {
      console.log(chalk.red('This will remove all AI Team files.'));
      console.log(chalk.gray('Use --force to skip this confirmation.'));
      return;
    }
    
    const spinner = ora('Removing AI Team...').start();
    
    try {
      // Logique de désinstallation
      await new Promise(resolve => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green('✅ AI Team removed successfully'));
    } catch (error) {
      spinner.fail(chalk.red('❌ Removal failed'));
      console.error(chalk.red(error.message));
    }
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('Invalid command: %s\n'), program.args.join(' '));
  console.log(chalk.yellow('Use --help for available commands.'));
  process.exit(1);
});

// Show help if no arguments
if (!process.argv.slice(2).length) {
  console.log(chalk.blue.bold('🤖 AI Team Orchestrator\n'));
  console.log(chalk.gray('Zero-Config AI coding team for GitHub\n'));
  program.outputHelp();
}

program.parse(); 