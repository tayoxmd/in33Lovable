import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعدادات النسخ الاحتياطي من Lovable
const CONFIG = {
  PROJECT_DIR: __dirname,
  BACKUP_DIR: path.join(__dirname, 'backup', 'backup-lovable'), // نسخ احتياطي من Lovable
  EXCLUDE_PATTERNS: [
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    'bun.lockb',
    'backup/**',
    '.env',
    '.env.local',
    '.env.production'
  ]
};

/**
 * إنشاء نسخة احتياطية من Lovable
 */
async function createLovableBackup() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const dateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  
  const backupFolderName = `lovable-backup_${dateTime}`;
  const backupFolderPath = path.join(CONFIG.BACKUP_DIR, backupFolderName);
  
  // إنشاء مجلد النسخ الاحتياطي
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
  }
  
  fs.mkdirSync(backupFolderPath, { recursive: true });
  
  const changelogPath = path.join(backupFolderPath, 'changelog.txt');
  const changelogContent = `نسخة احتياطية من Lovable - Lovable Backup Report
تاريخ ووقت النسخة الاحتياطية: ${now.toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'long' })}
========================================

تفاصيل النسخة الاحتياطية:
- تم نسخ جميع الملفات من Lovable
- المصدر: GitHub (in33Lovable)
- الملف المضغوط: lovable-backup_${dateTime}.zip

========================================
`;
  
  fs.writeFileSync(changelogPath, changelogContent, 'utf8');
  
  const zipFileName = `lovable-backup_${dateTime}.zip`;
  const zipFilePath = path.join(backupFolderPath, zipFileName);
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    output.on('close', () => {
      console.log(`✓ تم إنشاء النسخة الاحتياطية من Lovable: ${zipFilePath} (${archive.pointer()} bytes)`);
      resolve({
        folder: backupFolderPath,
        zip: zipFilePath,
        changelog: changelogPath,
        timestamp: now
      });
    });
    
    archive.on('error', (err) => {
      reject(err);
    });
    
    archive.pipe(output);
    
    // نسخ الملفات الأساسية
    const essentialFiles = [
      'package.json',
      'package-lock.json',
      'index.html',
      'vite.config.ts',
      'tsconfig.json',
      'tsconfig.app.json',
      'tsconfig.node.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'components.json',
      'eslint.config.js',
      'README.md',
      '.gitignore'
    ];
    
    // نسخ الملفات الأساسية
    essentialFiles.forEach(file => {
      const filePath = path.join(CONFIG.PROJECT_DIR, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    });
    
    // نسخ مجلد src
    if (fs.existsSync(path.join(CONFIG.PROJECT_DIR, 'src'))) {
      archive.directory(path.join(CONFIG.PROJECT_DIR, 'src'), 'src', {
        filter: (filePath) => {
          const relativePath = path.relative(CONFIG.PROJECT_DIR, filePath);
          return !CONFIG.EXCLUDE_PATTERNS.some(pattern => {
            const glob = pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
            return new RegExp(glob).test(relativePath);
          });
        }
      });
    }
    
    // نسخ مجلد public
    if (fs.existsSync(path.join(CONFIG.PROJECT_DIR, 'public'))) {
      archive.directory(path.join(CONFIG.PROJECT_DIR, 'public'), 'public', {
        filter: (filePath) => {
          const relativePath = path.relative(CONFIG.PROJECT_DIR, filePath);
          return !CONFIG.EXCLUDE_PATTERNS.some(pattern => {
            const glob = pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
            return new RegExp(glob).test(relativePath);
          });
        }
      });
    }
    
    archive.file(changelogPath, { name: 'changelog.txt' });
    archive.finalize();
  });
}

// تشغيل النسخ الاحتياطي
(async () => {
  console.log('=== إنشاء نسخة احتياطية من Lovable ===');
  
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
  }
  
  try {
    const backupInfo = await createLovableBackup();
    console.log('\n✓ تم إنشاء النسخة الاحتياطية من Lovable بنجاح!');
    console.log(`الموقع: ${backupInfo.folder}`);
    console.log(`الملف المضغوط: ${backupInfo.zip}`);
    console.log(`سجل التغييرات: ${backupInfo.changelog}`);
  } catch (error) {
    console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
    process.exit(1);
  }
})();


