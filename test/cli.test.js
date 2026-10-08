const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const cliPath = path.resolve(__dirname, '..', 'bin', 'cli.js');
const templatesPath = path.resolve(__dirname, '..', 'templates');
const pkg = require('../package.json');
const ignoreEntries = ['.openspec/tmp/', '.openspec/preflight_logs/', '.openspec/cache/'];
const agentDirectories = ['.openspec', '.claude', '.agents'];

function createProject(t) {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), 'codeinspector-cli-'));
  t.after(() => fs.rmSync(project, { recursive: true, force: true }));
  return project;
}

function runInit(project, mode, entrypoint = cliPath) {
  const script = `
    const fs = require('node:fs');
    require('node:child_process').execSync = (command, options) => {
      require('node:assert/strict').equal(command, 'npx openspec init');
      require('node:assert/strict').deepEqual(options, { stdio: 'inherit' });
      console.log('MOCK_OPENSPEC_INIT');
      if (${JSON.stringify(mode)} === 'failure') {
        throw new Error('OpenSpec initialization failed');
      }
      if (${JSON.stringify(mode)} === 'creates-specs') {
        fs.mkdirSync('openspec/specs', { recursive: true });
      }
    };
    require(${JSON.stringify(entrypoint)});
  `;
  return spawnSync(process.execPath, ['-e', script, 'init'], {
    cwd: project,
    encoding: 'utf8'
  });
}

function assertDeployed(project) {
  assert.equal(
    fs.readFileSync(path.join(project, 'openspec/specs/CONVENTIONS.md'), 'utf8'),
    fs.readFileSync(path.join(templatesPath, 'CONVENTIONS.md'), 'utf8')
  );
  for (const agentDirectory of agentDirectories) {
    const skill = fs.readFileSync(
      path.join(project, agentDirectory, 'skills/build-baseline/SKILL.md'), 'utf8'
    );
    assert.equal(skill, `<!-- codeinSPECtor-version: ${pkg.version} -->\n` +
      fs.readFileSync(path.join(templatesPath, 'SKILL.md'), 'utf8'));
  }
  const gitignore = fs.readFileSync(path.join(project, '.gitignore'), 'utf8');
  for (const entry of ignoreEntries) {
    assert.ok(gitignore.split('\n').includes(entry));
  }
}

function writeProjectFile(project, relativePath, content) {
  const file = path.join(project, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

function createPackage(t) {
  const directory = createProject(t);
  fs.mkdirSync(path.join(directory, 'bin'));
  fs.copyFileSync(cliPath, path.join(directory, 'bin/cli.js'));
  fs.cpSync(templatesPath, path.join(directory, 'templates'), { recursive: true });
  fs.copyFileSync(path.resolve(__dirname, '..', 'package.json'), path.join(directory, 'package.json'));
  return directory;
}

for (const mode of ['creates-specs', 'no-specs', 'failure']) {
  test(`initializes a fresh project when OpenSpec returns ${mode}`, (t) => {
    const project = createProject(t);
    const result = runInit(project, mode);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /MOCK_OPENSPEC_INIT/);
    assertDeployed(project);
    if (mode === 'failure') {
      assert.match(result.stderr, /OpenSpec initialization failed/);
    }
  });
}

test('creates canonical specs when only .openspec exists', (t) => {
  const project = createProject(t);
  fs.mkdirSync(path.join(project, '.openspec'));
  const result = runInit(project, 'no-specs');
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /MOCK_OPENSPEC_INIT/);
  assertDeployed(project);
});

test('creates canonical specs when only openspec exists', (t) => {
  const project = createProject(t);
  fs.mkdirSync(path.join(project, 'openspec'));
  const result = runInit(project, 'no-specs');
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /MOCK_OPENSPEC_INIT/);
  assertDeployed(project);
});

test('preserves existing conventions and ignores repeated initialization', (t) => {
  const project = createProject(t);
  fs.mkdirSync(path.join(project, 'openspec/specs'), { recursive: true });
  const conventions = path.join(project, 'openspec/specs/CONVENTIONS.md');
  fs.writeFileSync(conventions, 'Custom project conventions\n');
  const first = runInit(project, 'creates-specs');
  assert.equal(first.status, 0, first.stderr);
  const gitignore = fs.readFileSync(path.join(project, '.gitignore'), 'utf8');
  const second = runInit(project, 'no-specs');
  assert.equal(second.status, 0, second.stderr);
  assert.doesNotMatch(second.stdout, /MOCK_OPENSPEC_INIT/);
  assert.equal(fs.readFileSync(conventions, 'utf8'), 'Custom project conventions\n');
  assert.equal(fs.readFileSync(path.join(project, '.gitignore'), 'utf8'), gitignore);
});

test('preserves unrelated project files and appends missing ignore rules', (t) => {
  const project = createProject(t);
  const original = 'node_modules/\n.env';
  const gitignore = writeProjectFile(project, '.gitignore', original);
  const source = writeProjectFile(project, 'src/index.js', 'module.exports = 42;\n');
  const result = runInit(project, 'no-specs');
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.readFileSync(gitignore, 'utf8').startsWith(original + '\n'));
  assert.equal(fs.readFileSync(source, 'utf8'), 'module.exports = 42;\n');
  assertDeployed(project);
});

test('leaves a complete existing .gitignore unchanged', (t) => {
  const project = createProject(t);
  const original = ['node_modules/', ...ignoreEntries].join('\r\n');
  const gitignore = writeProjectFile(project, '.gitignore', original);
  const result = runInit(project, 'no-specs');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(gitignore, 'utf8'), original);
  assert.doesNotMatch(result.stdout, /Updated .gitignore/);
});

test('adds missing privacy rules to a partially configured .gitignore', (t) => {
  const project = createProject(t);
  const original = 'node_modules/\n.openspec/tmp/\n';
  const gitignore = writeProjectFile(project, '.gitignore', original);
  const first = runInit(project, 'no-specs');
  assert.equal(first.status, 0, first.stderr);
  const updated = fs.readFileSync(gitignore, 'utf8');
  assert.ok(updated.startsWith(original));
  assertDeployed(project);
  const second = runInit(project, 'no-specs');
  assert.equal(second.status, 0, second.stderr);
  assert.equal(fs.readFileSync(gitignore, 'utf8'), updated);
});

for (const directory of ['.openspec', '.claude']) {
  for (const skill of ['openspec-propose', 'openspec-apply']) {
    test(`patches ${directory}/${skill} once without replacing its contents`, (t) => {
      const project = createProject(t);
      const original = `# ${skill}\nExisting instructions.\n`;
      const file = writeProjectFile(project, `${directory}/skills/${skill}/SKILL.md`, original);
      const first = runInit(project, 'no-specs');
      assert.equal(first.status, 0, first.stderr);
      const patched = fs.readFileSync(file, 'utf8');
      assert.ok(patched.startsWith(original));
      assert.match(patched, /MANDATORY CONVENTIONS ENFORCED/);
      assert.match(patched, /`openspec\/specs\/CONVENTIONS.md`/);
      const second = runInit(project, 'no-specs');
      assert.equal(second.status, 0, second.stderr);
      assert.equal(fs.readFileSync(file, 'utf8'), patched);
    });
  }
}

test('preserves lifecycle skills already referencing conventions', (t) => {
  const project = createProject(t);
  const files = [];
  const original = '# Custom instructions\nRead openspec/specs/CONVENTIONS.md first.\n';
  for (const directory of ['.openspec', '.claude']) {
    for (const skill of ['openspec-propose', 'openspec-apply']) {
      files.push(writeProjectFile(project, `${directory}/skills/${skill}/SKILL.md`, original));
    }
  }
  const result = runInit(project, 'no-specs');
  assert.equal(result.status, 0, result.stderr);
  for (const file of files) {
    assert.equal(fs.readFileSync(file, 'utf8'), original);
  }
});

test('does not create absent lifecycle skills', (t) => {
  const project = createProject(t);
  const result = runInit(project, 'no-specs');
  assert.equal(result.status, 0, result.stderr);
  for (const directory of agentDirectories) {
    for (const skill of ['openspec-propose', 'openspec-apply']) {
      assert.equal(fs.existsSync(path.join(project, directory, 'skills', skill)), false);
    }
  }
});

test('refreshes existing baseline skills in all supported directories', (t) => {
  const project = createProject(t);
  for (const directory of agentDirectories) {
    writeProjectFile(project, `${directory}/skills/build-baseline/SKILL.md`, 'Old baseline skill\n');
  }
  const first = runInit(project, 'no-specs');
  assert.equal(first.status, 0, first.stderr);
  assertDeployed(project);
  const second = runInit(project, 'no-specs');
  assert.equal(second.status, 0, second.stderr);
  assertDeployed(project);
});

test('reads the installed package version when stamping baseline skills', (t) => {
  const project = createProject(t);
  const installed = createPackage(t);
  fs.writeFileSync(path.join(installed, 'package.json'), JSON.stringify({ version: '9.8.7' }));
  const result = runInit(project, 'no-specs', path.join(installed, 'bin/cli.js'));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /codeinSPECtor v9\.8\.7/);
  for (const directory of agentDirectories) {
    assert.equal(
      fs.readFileSync(path.join(project, directory, 'skills/build-baseline/SKILL.md'), 'utf8'),
      '<!-- codeinSPECtor-version: 9.8.7 -->\n' +
        fs.readFileSync(path.join(installed, 'templates/SKILL.md'), 'utf8')
    );
  }
});

test('uses the fallback version when package metadata is absent', (t) => {
  const project = createProject(t);
  const installed = createPackage(t);
  fs.unlinkSync(path.join(installed, 'package.json'));
  const result = runInit(project, 'no-specs', path.join(installed, 'bin/cli.js'));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /codeinSPECtor v1\.3\.0/);
  for (const directory of agentDirectories) {
    assert.match(
      fs.readFileSync(path.join(project, directory, 'skills/build-baseline/SKILL.md'), 'utf8'),
      /^<!-- codeinSPECtor-version: 1\.3\.0 -->\n/
    );
  }
});

test('reports a missing baseline template and exits unsuccessfully', (t) => {
  const project = createProject(t);
  const installed = createPackage(t);
  fs.unlinkSync(path.join(installed, 'templates/SKILL.md'));
  const result = runInit(project, 'no-specs', path.join(installed, 'bin/cli.js'));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /SKILL.md template not found/);
  assert.match(result.stderr, /npm run build/);
  assert.doesNotMatch(result.stdout, /Registered codeinSPECtor/);
  for (const directory of agentDirectories) {
    assert.equal(fs.existsSync(path.join(project, directory, 'skills/build-baseline/SKILL.md')), false);
  }
});

test('surfaces a blocked canonical directory instead of reporting success', (t) => {
  const project = createProject(t);
  writeProjectFile(project, 'openspec', 'Not a directory\n');
  const result = runInit(project, 'no-specs');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ENOTDIR|EEXIST/);
  assert.doesNotMatch(result.stdout, /Registered codeinSPECtor/);
  assert.equal(fs.readFileSync(path.join(project, 'openspec'), 'utf8'), 'Not a directory\n');
});
