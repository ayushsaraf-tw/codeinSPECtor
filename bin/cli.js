#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load package.json for version stamping
const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : { version: '1.3.0' };
const CURRENT_VERSION = pkg.version;

console.log(`🔍 Initializing codeinSPECtor v${CURRENT_VERSION}...`);

// 1. Resolve template path
const templatePath = path.resolve(__dirname, '..', 'templates', 'SKILL.md');

if (!fs.existsSync(templatePath)) {
  console.error(`❌ Error: Skill template not found at ${templatePath}`);
  process.exit(1);
}

let skillContent = fs.readFileSync(templatePath, 'utf8');
skillContent = `<!-- codeinSPECtor-version: ${CURRENT_VERSION} -->\n` + skillContent;

// 2. Initialize openspec config structure if missing
if (!fs.existsSync('.openspec')) {
  try {
    execSync('npx openspec init', { stdio: 'inherit' });
  } catch (err) {
    fs.mkdirSync('.openspec/specs', { recursive: true });
  }
}

// 3. Auto-Generate / Update .gitignore Entries
const gitignorePath = path.join(process.cwd(), '.gitignore');
const codeinspectorIgnoreEntries = [
  '# codeinSPECtor local working files & pre-flight privacy logs',
  '.openspec/tmp/',
  '.openspec/preflight_logs/',
  '.openspec/cache/'
];

let currentGitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

const missingEntries = codeinspectorIgnoreEntries.filter(entry => {
  if (entry.startsWith('#')) return false;
  return !currentGitignore.includes(entry);
});

if (missingEntries.length > 0) {
  const appendContent = '\n\n' + codeinspectorIgnoreEntries.join('\n') + '\n';
  fs.appendFileSync(gitignorePath, appendContent, 'utf8');
  console.log(" 🔒 Updated .gitignore to exclude local temporary logs & privacy caches.");
}

// 4. Inject skill into OpenSpec & Agent skill paths
const targetDirectories = [
  path.join('.openspec', 'skills', 'build-baseline'),
  path.join('.agents', 'skills', 'build-baseline'),
  path.join('.claude', 'skills', 'build-baseline')
];

targetDirectories.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), skillContent, 'utf8');
});

console.log(` ✅ Registered codeinSPECtor skill v${CURRENT_VERSION}`);
console.log("\n🎉 codeinSPECtor setup complete!");
console.log("👉 Open your AI Chat and type:");
console.log("   /opsx:build-baseline\n");