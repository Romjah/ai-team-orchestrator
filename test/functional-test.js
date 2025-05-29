#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { execSync } from 'child_process';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runFunctionalTests() {
  console.log(chalk.blue.bold('🧪 Running Functional Tests for AI Team Orchestrator\n'));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Vérifier que le CLI principal fonctionne
  try {
    const output = execSync('node bin/ai-team.js --version', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    if (output.includes('1.2.6')) {
      console.log(chalk.green('✅ CLI version check'));
      passed++;
    } else {
      console.log(chalk.red('❌ CLI version incorrect'));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('❌ CLI execution failed'));
    failed++;
  }
  
  // Test 2: Vérifier que l'aide s'affiche
  try {
    const output = execSync('node bin/ai-team.js --help', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    if (output.includes('AI Team Orchestrator')) {
      console.log(chalk.green('✅ CLI help display'));
      passed++;
    } else {
      console.log(chalk.red('❌ CLI help not displayed'));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('❌ CLI help command failed'));
    failed++;
  }
  
  // Test 3: Vérifier la commande status
  try {
    const output = execSync('node bin/ai-team.js status', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    if (output.includes('Git repository')) {
      console.log(chalk.green('✅ Status command works'));
      passed++;
    } else {
      console.log(chalk.red('❌ Status command output incorrect'));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('❌ Status command failed'));
    failed++;
  }
  
  // Test 4: Vérifier la commande agents
  try {
    const output = execSync('node bin/ai-team.js agents', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    if (output.includes('Frontend Specialist') && output.includes('Backend Specialist')) {
      console.log(chalk.green('✅ Agents listing works'));
      passed++;
    } else {
      console.log(chalk.red('❌ Agents listing incomplete'));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('❌ Agents command failed'));
    failed++;
  }
  
  // Test 5: Vérifier que les modules peuvent être importés
  try {
    const installer = await import('../lib/installer.js');
    const demo = await import('../lib/demo.js');
    const utils = await import('../lib/utils.js');
    
    if (installer.installAITeam && demo.createDemoIssue && utils.Logger) {
      console.log(chalk.green('✅ All modules can be imported'));
      passed++;
    } else {
      console.log(chalk.red('❌ Some module exports missing'));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('❌ Module import failed:'), error.message);
    failed++;
  }
  
  // Test 6: Vérifier l'installation binaire
  try {
    const output = execSync('node bin/install.js --help', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    if (output.includes('Installation interactive')) {
      console.log(chalk.green('✅ Install binary works'));
      passed++;
    } else {
      console.log(chalk.red('❌ Install binary output incorrect'));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('❌ Install binary failed'));
    failed++;
  }
  
  // Test 7: Vérifier que le package.json a les bonnes dépendances
  try {
    const packagePath = path.join(__dirname, '../package.json');
    const packageContent = await fs.readFile(packagePath, 'utf8');
    const pkg = JSON.parse(packageContent);
    
    const requiredDeps = ['chalk', 'inquirer', 'ora', 'commander'];
    const hasAllDeps = requiredDeps.every(dep => pkg.dependencies[dep]);
    
    if (hasAllDeps) {
      console.log(chalk.green('✅ All required dependencies present'));
      passed++;
    } else {
      console.log(chalk.red('❌ Missing dependencies'));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('❌ Package.json check failed'));
    failed++;
  }
  
  // Résultats
  console.log(chalk.yellow('\n📊 Functional Test Results:'));
  console.log(chalk.green(`✅ Passed: ${passed}`));
  console.log(chalk.red(`❌ Failed: ${failed}`));
  
  if (failed === 0) {
    console.log(chalk.green.bold('\n🎉 All functional tests passed! The project is fully functional.'));
    process.exit(0);
  } else {
    console.log(chalk.red.bold('\n💥 Some functional tests failed. Please check the issues above.'));
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFunctionalTests().catch(error => {
    console.error(chalk.red('Functional test execution failed:'), error);
    process.exit(1);
  });
} 