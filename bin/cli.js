#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("🔍 Initializing codeinSPECtor into workspace...");

// 1. Resolve template path
const templatePath = path.resolve(__dirname, '..', 'templates', 'SKILL.md');

if (!fs.existsSync(templatePath)) {
  console.error(`❌ Error: Skill template not found at ${templatePath}`);
  process.exit(1);
}

const skillContent = fs.readFileSync(templatePath, 'utf8');

// 2. Initialize openspec config structure if missing
if (!fs.existsSync('.openspec')) {
  try {
    execSync('npx openspec init', { stdio: 'inherit' });
  } catch (err) {
    fs.mkdirSync('openspec/specs', { recursive: true });
  }
}

// 3. Inject skill into OpenSpec & Agent skill paths
const targetDirectories = [
  path.join('.openspec', 'skills', 'build-baseline'),
  path.join('.agents', 'skills', 'build-baseline'),
  path.join('.claude', 'skills', 'build-baseline')
];

targetDirectories.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), skillContent, 'utf8');
});

console.log(" ✅ OpenSpec skill /opsx:build-baseline successfully registered!");
console.log("\n🎉 codeinSPECtor setup complete!");
console.log("👉 Now open your AI Chat and type:");
console.log("   /opsx:build-baseline\n");