#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("🔍 Initializing codeinSPECtor into target workspace...");

// 1. Check/Run openspec init
if (!fs.existsSync('.openspec')) {
  try {
    console.log("📦 Running openspec init...");
    execSync('npx openspec init', { stdio: 'inherit' });
  } catch (err) {
    console.warn("⚠️ Could not run openspec init automatically. Creating folders manually...");
    fs.mkdirSync('openspec/specs', { recursive: true });
  }
}

// 2. Locate master SKILL.md template
const templatePath = path.join(__dirname, '../templates/SKILL.md');
if (!fs.existsSync(templatePath)) {
  console.error("❌ Error: Skill template not found at templates/SKILL.md");
  process.exit(1);
}
const skillContent = fs.readFileSync(templatePath, 'utf8');

// 3. Define target skill folders across major AI tools
const targetDirectories = [
  path.join('.openspec', 'skills', 'openspec-build-baseline'),
  path.join('.agents', 'skills', 'openspec-build-baseline'),
  path.join('.claude', 'skills', 'openspec-build-baseline'),
  path.join('.github', 'skills', 'openspec-build-baseline')
];

// 4. Inject the skill into all configuration paths
targetDirectories.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'SKILL.md');
  fs.writeFileSync(filePath, skillContent, 'utf8');
  console.log(` ✅ Injected skill: ${filePath}`);
});

console.log("\n🎉 codeinSPECtor setup complete!");
console.log("👉 Next Step: Open your AI Assistant Chat and run:");
console.log("   /opsx:build-baseline\n");