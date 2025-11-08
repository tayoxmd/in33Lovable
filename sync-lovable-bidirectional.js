import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_DIR = __dirname;
const GIT_REMOTE = 'https://github.com/tayoxmd/in33Lovable.git';
const SYNC_LOG_FILE = path.join(PROJECT_DIR, 'sync-log.json');

// إعدادات المزامنة
const SYNC_CONFIG = {
  watchInterval: 5000, // 5 ثواني
  autoCommit: true,
  autoPush: true,
  excludePatterns: [
    'node_modules',
    '.git',
    'dist',
    'backup',
    '.env',
    'sync-log.json',
    '*.log'
  ]
};

/**
 * تسجيل التغييرات
 */
function logSync(action, details) {
  const log = {
    timestamp: new Date().toISOString(),
    action,
    details
  };
  
  let logs = [];
  if (fs.existsSync(SYNC_LOG_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(SYNC_LOG_FILE, 'utf8'));
    } catch (e) {
      logs = [];
    }
  }
  
  logs.push(log);
  
  // الاحتفاظ بآخر 100 سجل فقط
  if (logs.length > 100) {
    logs = logs.slice(-100);
  }
  
  fs.writeFileSync(SYNC_LOG_FILE, JSON.stringify(logs, null, 2));
  console.log(`[${new Date().toLocaleTimeString()}] ${action}: ${details}`);
}

/**
 * التحقق من وجود Git repository
 */
function ensureGitRepo() {
  const gitDir = path.join(PROJECT_DIR, '.git');
  if (!fs.existsSync(gitDir)) {
    console.log('تهيئة Git repository...');
    execSync('git init', { cwd: PROJECT_DIR, stdio: 'inherit' });
    execSync(`git remote add origin ${GIT_REMOTE}`, { cwd: PROJECT_DIR, stdio: 'inherit' });
    logSync('INIT', 'Git repository initialized');
  }
}

/**
 * جلب التحديثات من GitHub
 */
async function pullFromGitHub() {
  try {
    ensureGitRepo();
    
    console.log('جاري جلب التحديثات من GitHub...');
    
    // حفظ التغييرات المحلية
    try {
      execSync('git stash', { cwd: PROJECT_DIR, stdio: 'pipe' });
    } catch (e) {
      // لا توجد تغييرات لحفظها
    }
    
    // جلب التحديثات
    execSync('git pull origin main', { cwd: PROJECT_DIR, stdio: 'inherit' });
    
    // استعادة التغييرات المحلية
    try {
      execSync('git stash pop', { cwd: PROJECT_DIR, stdio: 'pipe' });
    } catch (e) {
      // لا توجد تغييرات لاستعادتها
    }
    
    logSync('PULL', 'Pulled updates from GitHub');
    return true;
  } catch (error) {
    console.error('خطأ في جلب التحديثات:', error.message);
    logSync('PULL_ERROR', error.message);
    return false;
  }
}

/**
 * رفع التحديثات إلى GitHub
 */
async function pushToGitHub() {
  try {
    ensureGitRepo();
    
    // التحقق من وجود تغييرات
    const status = execSync('git status --porcelain', { cwd: PROJECT_DIR, encoding: 'utf8' });
    if (!status.trim()) {
      return false; // لا توجد تغييرات
    }
    
    console.log('جاري رفع التحديثات إلى GitHub...');
    
    // إضافة جميع الملفات
    execSync('git add .', { cwd: PROJECT_DIR, stdio: 'inherit' });
    
    // عمل commit
    const commitMessage = `Auto-sync: ${new Date().toISOString()}`;
    execSync(`git commit -m "${commitMessage}"`, { cwd: PROJECT_DIR, stdio: 'inherit' });
    
    // رفع التحديثات
    execSync('git push origin main', { cwd: PROJECT_DIR, stdio: 'inherit' });
    
    logSync('PUSH', 'Pushed updates to GitHub');
    return true;
  } catch (error) {
    console.error('خطأ في رفع التحديثات:', error.message);
    logSync('PUSH_ERROR', error.message);
    return false;
  }
}

/**
 * مراقبة التغييرات في الملفات
 */
function watchFiles() {
  console.log('بدء مراقبة التغييرات...');
  
  let lastSync = Date.now();
  const syncInterval = 30000; // 30 ثانية
  
  // مراقبة التغييرات في المجلد
  const watcher = fs.watch(PROJECT_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    
    // تجاهل الملفات المستبعدة
    if (SYNC_CONFIG.excludePatterns.some(pattern => filename.includes(pattern))) {
      return;
    }
    
    // تجاهل ملفات Git
    if (filename.startsWith('.git')) {
      return;
    }
    
    const now = Date.now();
    if (now - lastSync < syncInterval) {
      return; // تجنب المزامنة المتكررة
    }
    
    lastSync = now;
    
    console.log(`تم اكتشاف تغيير: ${filename}`);
    logSync('FILE_CHANGE', filename);
    
    // رفع التحديثات بعد فترة قصيرة
    setTimeout(() => {
      pushToGitHub();
    }, 5000);
  });
  
  // مزامنة دورية
  setInterval(async () => {
    await pullFromGitHub();
  }, SYNC_CONFIG.watchInterval * 6); // كل 30 ثانية
  
  // مزامنة أولية
  pullFromGitHub();
  
  console.log('✅ تم بدء نظام المزامنة الثنائية');
  console.log(`📁 المجلد: ${PROJECT_DIR}`);
  console.log(`🌐 GitHub: ${GIT_REMOTE}`);
  console.log('⏸️  اضغط Ctrl+C لإيقاف المراقبة');
  
  return watcher;
}

/**
 * مزامنة يدوية
 */
async function manualSync() {
  console.log('🔄 بدء المزامنة اليدوية...');
  
  await pullFromGitHub();
  await pushToGitHub();
  
  console.log('✅ تم إكمال المزامنة');
}

// معالجة الأوامر
const command = process.argv[2];

if (command === 'watch') {
  watchFiles();
} else if (command === 'pull') {
  pullFromGitHub().then(() => process.exit(0));
} else if (command === 'push') {
  pushToGitHub().then(() => process.exit(0));
} else if (command === 'sync') {
  manualSync().then(() => process.exit(0));
} else {
  console.log('استخدام:');
  console.log('  node sync-lovable-bidirectional.js watch  - بدء المراقبة التلقائية');
  console.log('  node sync-lovable-bidirectional.js pull   - جلب التحديثات من GitHub');
  console.log('  node sync-lovable-bidirectional.js push   - رفع التحديثات إلى GitHub');
  console.log('  node sync-lovable-bidirectional.js sync    - مزامنة يدوية (pull + push)');
}

