import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  HOME_DIR: path.join(__dirname, 'home'),
  DIST_DIR: path.join(__dirname, 'home', 'dist'),
  BACKUP_DIR: path.join(__dirname, 'backup', 'backup-cursor'),
};

async function buildProject() {
  console.log('📦 جاري بناء المشروع...');
  try {
    execSync('npm run build', { 
      cwd: CONFIG.HOME_DIR,
      stdio: 'inherit'
    });
    console.log('✅ تم بناء المشروع بنجاح');
    return true;
  } catch (error) {
    console.error('❌ فشل بناء المشروع:', error.message);
    return false;
  }
}

async function createCpanelBackup() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const dateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  
  const backupFolderName = `cpanel-backup_${dateTime}`;
  const backupFolderPath = path.join(CONFIG.BACKUP_DIR, backupFolderName);
  
  // إنشاء مجلد النسخة الاحتياطية
  fs.mkdirSync(backupFolderPath, { recursive: true });
  
  // إنشاء ملف معلومات النسخة الاحتياطية
  const infoPath = path.join(backupFolderPath, 'backup-info.txt');
  const infoContent = `نسخة احتياطية جاهزة لـ cPanel - cPanel Ready Backup
تاريخ ووقت النسخة الاحتياطية: ${now.toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'long' })}
========================================

تفاصيل النسخة الاحتياطية:
- تحتوي على جميع ملفات المشروع المبنية (dist)
- جاهزة للرفع مباشرة على cPanel
- المسار المستهدف: /public_html/in33.in
- الملف المضغوط: ${backupFolderName}.zip

تعليمات الاستخدام:
1. قم بفك ضغط الملف ${backupFolderName}.zip
2. ارفع محتويات مجلد dist إلى /public_html/in33.in في cPanel
3. تأكد من أن جميع الملفات تم رفعها بشكل صحيح

========================================
Project: IN33 - إدارة النقل
Domain: in33.in
Version: ${dateTime}
`;
  
  fs.writeFileSync(infoPath, infoContent, 'utf8');
  
  // نسخ مجلد dist
  const distBackupPath = path.join(backupFolderPath, 'dist');
  fs.mkdirSync(distBackupPath, { recursive: true });
  
  console.log('📋 جاري نسخ ملفات dist...');
  copyDirectory(CONFIG.DIST_DIR, distBackupPath);
  
  // إنشاء ملف مضغوط
  const zipFileName = `${backupFolderName}.zip`;
  const zipFilePath = path.join(backupFolderPath, zipFileName);
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    output.on('close', () => {
      console.log(`✅ تم إنشاء النسخة الاحتياطية: ${zipFilePath} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
      resolve({
        folder: backupFolderPath,
        zip: zipFilePath,
        info: infoPath,
        timestamp: now,
        size: archive.pointer()
      });
    });
    
    archive.on('error', (err) => {
      reject(err);
    });
    
    archive.pipe(output);
    
    // إضافة مجلد dist
    archive.directory(distBackupPath, 'dist');
    
    // إضافة ملف المعلومات
    archive.file(infoPath, { name: 'backup-info.txt' });
    
    archive.finalize();
  });
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

(async () => {
  console.log('=== إنشاء نسخة احتياطية جاهزة لـ cPanel ===\n');
  
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
    console.log('✓ تم إنشاء مجلد النسخ الاحتياطية');
  }
  
  // بناء المشروع
  const buildSuccess = await buildProject();
  
  if (!buildSuccess) {
    console.error('❌ فشل بناء المشروع. لا يمكن إنشاء النسخة الاحتياطية.');
    process.exit(1);
  }
  
  // التحقق من وجود مجلد dist
  if (!fs.existsSync(CONFIG.DIST_DIR)) {
    console.error('❌ مجلد dist غير موجود. فشل البناء.');
    process.exit(1);
  }
  
  try {
    const backupInfo = await createCpanelBackup();
    console.log('\n✅ تم إنشاء النسخة الاحتياطية بنجاح!');
    console.log(`📁 الموقع: ${backupInfo.folder}`);
    console.log(`📦 الملف المضغوط: ${backupInfo.zip}`);
    console.log(`📄 ملف المعلومات: ${backupInfo.info}`);
    console.log(`💾 الحجم: ${(backupInfo.size / 1024 / 1024).toFixed(2)} MB`);
    console.log('\n🎉 النسخة الاحتياطية جاهزة للرفع على cPanel!');
  } catch (error) {
    console.error('❌ خطأ في إنشاء النسخة الاحتياطية:', error);
    process.exit(1);
  }
})();

