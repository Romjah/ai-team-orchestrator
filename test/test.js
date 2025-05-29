#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log(chalk.blue.bold('🧪 Running AI Team Orchestrator Tests\n'));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Vérifier la structure du package
  try {
    const packagePath = path.join(__dirname, '../package.json');
    const packageContent = await fs.readFile(packagePath, 'utf8');
    const pkg = JSON.parse(packageContent);
    
    if (pkg.name === '@ai-team/orchestrator') {
      console.log(chalk.green('✅ Package name correct'));
      passed++;
    } else {
      console.log(chalk.red('❌ Package name incorrect'));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red('❌ Package.json not found or invalid'));
    failed++;
  }
  
  // Test 2: Vérifier les fichiers CLI
  try {
    const cliPath = path.join(__dirname, '../bin/ai-team.js');
    await fs.access(cliPath);
    console.log(chalk.green('✅ CLI executable exists'));
    passed++;
  } catch (error) {
    console.log(chalk.red('❌ CLI executable missing'));
    failed++;
  }
  
  // Test 3: Vérifier les templates
  try {
    const templatesPath = path.join(__dirname, '../templates/.github');
    await fs.access(templatesPath);
    console.log(chalk.green('✅ Templates directory exists'));
    passed++;
  } catch (error) {
    console.log(chalk.red('❌ Templates directory missing'));
    failed++;
  }
  
  // Test 4: Vérifier les modules lib
  try {
    const installerPath = path.join(__dirname, '../lib/installer.js');
    await fs.access(installerPath);
    console.log(chalk.green('✅ Installer module exists'));
    passed++;
  } catch (error) {
    console.log(chalk.red('❌ Installer module missing'));
    failed++;
  }
  
  // Test 5: Vérifier le workflow zero-config
  try {
    const workflowPath = path.join(__dirname, '../templates/.github/workflows/ai-team-zero-config.yml');
    await fs.access(workflowPath);
    console.log(chalk.green('✅ Zero-config workflow template exists'));
    passed++;
  } catch (error) {
    console.log(chalk.red('❌ Zero-config workflow template missing'));
    failed++;
  }
  
  // Test 6: Vérifier le générateur Python
  try {
    const generatorPath = path.join(__dirname, '../templates/.github/scripts/zero_config_generator.py');
    await fs.access(generatorPath);
    console.log(chalk.green('✅ Python generator exists'));
    passed++;
  } catch (error) {
    console.log(chalk.red('❌ Python generator missing'));
    failed++;
  }
  
  // Résultats
  console.log(chalk.yellow('\n📊 Test Results:'));
  console.log(chalk.green(`✅ Passed: ${passed}`));
  console.log(chalk.red(`❌ Failed: ${failed}`));
  
  if (failed === 0) {
    console.log(chalk.green.bold('\n🎉 All tests passed! Package is ready for distribution.'));
    process.exit(0);
  } else {
    console.log(chalk.red.bold('\n💥 Some tests failed. Please check the package structure.'));
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error(chalk.red('Test execution failed:'), error);
    process.exit(1);
  });
} 