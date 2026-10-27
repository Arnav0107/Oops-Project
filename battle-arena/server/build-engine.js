const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('============================================================');
console.log('🔨 BUILDING BATTLE ARENA C++17 ENGINE FOR DEPLOYMENT');
console.log('============================================================');

const isWindows = process.platform === 'win32';
const engineDir = path.resolve(__dirname, '..', 'engine');
const outputBinaryName = isWindows ? 'battle_engine.exe' : 'battle_engine';
const outputPath = path.join(engineDir, outputBinaryName);

console.log(`Platform: ${process.platform} (${process.arch})`);
console.log(`Engine Directory: ${engineDir}`);
console.log(`Target Binary: ${outputPath}`);

// Check if g++ is installed
try {
  const gxxVersion = execSync('g++ --version').toString().split('\n')[0];
  console.log(`Compiler found: ${gxxVersion}`);
} catch (err) {
  console.error('❌ Error: g++ compiler not found in PATH.');
  console.error('On Render / Ubuntu, ensure build-essential or g++ is available.');
  process.exit(1);
}

// Ensure include and src directories exist
const includeDir = path.join(engineDir, 'include');
const srcDir = path.join(engineDir, 'src');

if (!fs.existsSync(srcDir)) {
  console.error(`❌ Error: Source directory does not exist: ${srcDir}`);
  process.exit(1);
}

// Use relative paths within engineDir to safely handle paths with spaces
const srcFiles = [
  path.join('src', 'Item.cpp'),
  path.join('src', 'Character.cpp'),
  path.join('src', 'Warrior.cpp'),
  path.join('src', 'Mage.cpp'),
  path.join('src', 'Archer.cpp'),
  path.join('src', 'Healer.cpp'),
  path.join('src', 'Arena.cpp'),
  path.join('src', 'main.cpp')
].map(f => `"${f}"`).join(' ');

const compileCmd = `g++ -std=c++17 -Wall -Wextra -O2 -Iinclude ${srcFiles} -o "${outputBinaryName}"`;

console.log(`Executing in ${engineDir}: ${compileCmd}`);

try {
  execSync(compileCmd, {
    cwd: engineDir,
    stdio: 'inherit'
  });
  console.log('✓ C++ Compilation succeeded.');
} catch (compileErr) {
  console.error('❌ Compilation failed:', compileErr.message);
  process.exit(1);
}

// On Linux / macOS, ensure execute permissions (chmod 755)
if (!isWindows) {
  try {
    fs.chmodSync(outputPath, 0o755);
    console.log(`✓ Set permissions 755 on ${outputPath}`);
  } catch (chmodErr) {
    console.warn('⚠️ Warning: Could not chmod binary:', chmodErr.message);
  }
}

// Verify the binary exists and has non-zero size
if (fs.existsSync(outputPath)) {
  const stats = fs.statSync(outputPath);
  console.log(`✓ Binary verified: ${outputBinaryName} (${(stats.size / 1024).toFixed(1)} KB)`);
  console.log('============================================================');
  console.log('🎉 C++ ENGINE READY FOR DEPLOYMENT');
  console.log('============================================================');
} else {
  console.error(`❌ Output binary not found at ${outputPath}`);
  process.exit(1);
}
