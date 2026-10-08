const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const buildPath = path.resolve(__dirname, '..', 'create_template.js');
const partFiles = [
  'privacy_guardrails.md',
  'phase1_recon.md',
  'phase2_slicing.md',
  'phase3_analysis.md',
  'phase4_aggregation.md',
  'stakeholder_views.md'
];

function createFixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'codeinspector-build-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.copyFileSync(buildPath, path.join(directory, 'create_template.js'));
  fs.mkdirSync(path.join(directory, 'templates/parts'), { recursive: true });
  for (const file of partFiles) {
    fs.writeFileSync(path.join(directory, 'templates/parts', file), `# ${file}\r\nContent for ${file}\r\n`);
  }
  fs.writeFileSync(path.join(directory, 'templates/parts/mandatory_conventions.md'), '# Conventions\r\nKeep this content unchanged.\r\n');
  return directory;
}

function runBuild(directory, cwd = directory) {
  return spawnSync(process.execPath, [path.join(directory, 'create_template.js')], {
    cwd,
    encoding: 'utf8'
  });
}

test('assembles all template parts in order with separators and LF line endings', (t) => {
  const directory = createFixture(t);
  const result = runBuild(directory);
  assert.equal(result.status, 0, result.stderr);
  const skill = fs.readFileSync(path.join(directory, 'templates/SKILL.md'), 'utf8');
  assert.match(skill, /^---\nname: build-baseline\n/);
  assert.match(skill, /\ncommand: \/opsx:build-baseline\n---\n/);
  assert.match(skill, /# OpenSpec Custom Skill: \/opsx:build-baseline/);
  const expectedParts = partFiles.map(file =>
    `# ${file}\nContent for ${file}\n`
  ).join('\n\n---\n\n');
  assert.ok(skill.endsWith(expectedParts));
  assert.equal(skill.includes('\r'), false);
});

test('copies mandatory conventions exactly into the deployment template', (t) => {
  const directory = createFixture(t);
  const result = runBuild(directory);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(
    fs.readFileSync(path.join(directory, 'templates/CONVENTIONS.md')),
    fs.readFileSync(path.join(directory, 'templates/parts/mandatory_conventions.md'))
  );
});

test('rebuilds deterministically and replaces stale output artifacts', (t) => {
  const directory = createFixture(t);
  fs.writeFileSync(path.join(directory, 'templates/SKILL.md'), 'Stale skill');
  fs.writeFileSync(path.join(directory, 'templates/CONVENTIONS.md'), 'Stale conventions');
  const first = runBuild(directory);
  assert.equal(first.status, 0, first.stderr);
  const skill = fs.readFileSync(path.join(directory, 'templates/SKILL.md'));
  const conventions = fs.readFileSync(path.join(directory, 'templates/CONVENTIONS.md'));
  assert.notEqual(skill.toString(), 'Stale skill');
  assert.notEqual(conventions.toString(), 'Stale conventions');
  const second = runBuild(directory);
  assert.equal(second.status, 0, second.stderr);
  assert.deepEqual(fs.readFileSync(path.join(directory, 'templates/SKILL.md')), skill);
  assert.deepEqual(fs.readFileSync(path.join(directory, 'templates/CONVENTIONS.md')), conventions);
});

test('resolves build inputs and outputs relative to the script, not the working directory', (t) => {
  const directory = createFixture(t);
  const workingDirectory = path.join(directory, 'unrelated-project');
  fs.mkdirSync(workingDirectory);
  const result = runBuild(directory, workingDirectory);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(directory, 'templates/SKILL.md')));
  assert.ok(fs.existsSync(path.join(directory, 'templates/CONVENTIONS.md')));
  assert.deepEqual(fs.readdirSync(workingDirectory), []);
});

test('includes updated source parts on subsequent builds', (t) => {
  const directory = createFixture(t);
  const first = runBuild(directory);
  assert.equal(first.status, 0, first.stderr);
  fs.writeFileSync(path.join(directory, 'templates/parts/phase3_analysis.md'), '# Updated analysis\n');
  const second = runBuild(directory);
  assert.equal(second.status, 0, second.stderr);
  const skill = fs.readFileSync(path.join(directory, 'templates/SKILL.md'), 'utf8');
  assert.match(skill, /# Updated analysis\n/);
  assert.doesNotMatch(skill, /Content for phase3_analysis.md/);
});

for (const missingFile of ['phase3_analysis.md', 'mandatory_conventions.md']) {
  test(`fails explicitly when ${missingFile} is missing`, (t) => {
    const directory = createFixture(t);
    fs.unlinkSync(path.join(directory, 'templates/parts', missingFile));
    const result = runBuild(directory);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /ENOENT/);
    assert.ok(result.stderr.includes(missingFile));
    assert.doesNotMatch(result.stdout, /Assembled .* successfully/);
  });
}
