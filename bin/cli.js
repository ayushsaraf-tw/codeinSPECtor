#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : { version: '1.3.0' };
const CURRENT_VERSION = pkg.version;

console.log(`🔍 Initializing codeinSPECtor v${CURRENT_VERSION}...`);

// 1. Initialize OpenSpec directory structure if missing
if (!fs.existsSync('.openspec')) {
  try {
    execSync('npx openspec init', { stdio: 'inherit' });
  } catch (err) {
    fs.mkdirSync('.openspec/specs', { recursive: true });
  }
} else if (!fs.existsSync('openspec/specs')) {
  fs.mkdirSync('openspec/specs', { recursive: true });
}

// 2. Deploy canonical openspec/specs/CONVENTIONS.md
const conventionsTemplate = path.resolve(__dirname, '..', 'templates', 'CONVENTIONS.md');
const targetConventionsPath = path.join('openspec', 'specs', 'CONVENTIONS.md');

if (fs.existsSync(conventionsTemplate)) {
  fs.copyFileSync(conventionsTemplate, targetConventionsPath);
  console.log("📋 Deployed engineering standards to openspec/specs/CONVENTIONS.md");
}

// 3. Update .gitignore for temporary analysis artifacts
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
  console.log("🔒 Updated .gitignore to exclude temporary analysis artifacts.");
}

// 4. Patch standard OpenSpec skills (propose & apply) to enforce CONVENTIONS.md
const skillsToPatch = [
  path.join('.openspec', 'skills', 'openspec-propose', 'SKILL.md'),
  path.join('.openspec', 'skills', 'openspec-apply', 'SKILL.md'),
  path.join('.claude', 'skills', 'openspec-propose', 'SKILL.md'),
  path.join('.claude', 'skills', 'openspec-apply', 'SKILL.md')
];

const patchNotice = `\n\n> ⚠️ **MANDATORY CONVENTIONS ENFORCED:** You MUST read and strictly adhere to all engineering, TDD, feature toggle, and diagram rules specified in \`openspec/specs/CONVENTIONS.md\` before generating or executing task checklists.\n`;

skillsToPatch.forEach(skillFilePath => {
  if (fs.existsSync(skillFilePath)) {
    const existingContent = fs.readFileSync(skillFilePath, 'utf8');
    if (!existingContent.includes('CONVENTIONS.md')) {
      fs.appendFileSync(skillFilePath, patchNotice, 'utf8');
      console.log(`🔒 Enforced CONVENTIONS.md rule on ${skillFilePath}`);
    }
  }
});

// 5. Deploy build-baseline SKILL.md template
const templatePath = path.resolve(__dirname, '..', 'templates', 'SKILL.md');
if (!fs.existsSync(templatePath)) {
  console.error(`❌ Error: SKILL.md template not found. Run 'npm run build' first.`);
  process.exit(1);
}

let skillContent = fs.readFileSync(templatePath, 'utf8');
skillContent = `<!-- codeinSPECtor-version: ${CURRENT_VERSION} -->\n` + skillContent;

const targetDirectories = [
  path.join('.openspec', 'skills', 'build-baseline'),
  path.join('.claude', 'skills', 'build-baseline'),
  path.join('.agents', 'skills', 'build-baseline')
];

targetDirectories.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), skillContent, 'utf8');
});

console.log(`\n✅ Registered codeinSPECtor build-baseline skill v${CURRENT_VERSION}!`);