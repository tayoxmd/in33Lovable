import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FtpClient from 'basic-ftp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعدادات cPanel
const CPANEL_CONFIG = {
  host: 'ftp.u2890132.cp.regruhosting.ru',
  user: 'in@in33.in',
  password: '@@@Tayo0991',
  secure: false,
  port: 21
};

const DIST_DIR = path.join(__dirname, 'home', 'dist');

/**
 * رفع ملفات dist إلى cPanel
 */
async function uploadDistToCpanel() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ مجلد dist غير موجود. قم ببناء المشروع أولاً: npm run build');
    return false;
  }

  console.log('🔄 جاري الاتصال بـ cPanel...');
  
  const client = new FtpClient.Client();
  
  try {
    await client.access({
      host: CPANEL_CONFIG.host,
      user: CPANEL_CONFIG.user,
      password: CPANEL_CONFIG.password,
      secure: CPANEL_CONFIG.secure,
      port: CPANEL_CONFIG.port
    });
    
    console.log('✅ تم الاتصال بنجاح');
    
    // محاولة المسارات المختلفة
    const remotePaths = ['/public_html', '/www', '/httpdocs', '/'];
    let foundPath = null;
    
    for (const remotePath of remotePaths) {
      try {
        await client.cd(remotePath);
        console.log(`✅ تم الانتقال إلى: ${remotePath}`);
        foundPath = remotePath;
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!foundPath) {
      console.log('⚠️  استخدام المسار الحالي');
      foundPath = '.';
    }
    
    console.log('📤 جاري رفع ملفات dist...');
    
    // رفع جميع الملفات من dist
    const files = fs.readdirSync(DIST_DIR, { withFileTypes: true });
    
    for (const file of files) {
      const localPath = path.join(DIST_DIR, file.name);
      const remoteFilePath = foundPath === '.' ? file.name : `${foundPath}/${file.name}`;
      
      if (file.isDirectory()) {
        // رفع المجلدات بشكل متكرر
        await uploadDirectory(client, localPath, remoteFilePath);
      } else {
        // رفع الملفات
        console.log(`  📄 رفع: ${file.name}`);
        await client.uploadFrom(localPath, remoteFilePath);
      }
    }
    
    console.log('✅ تم رفع جميع الملفات بنجاح إلى cPanel');
    console.log(`🌐 الموقع متاح على: https://in33.in`);
    
    return true;
  } catch (error) {
    console.error('❌ خطأ أثناء الرفع:', error.message);
    console.log('\n💡 نصائح:');
    console.log('1. تأكد من صحة بيانات FTP');
    console.log('2. تأكد من أن FTP مفعل في cPanel');
    console.log('3. تحقق من المسار الصحيح في cPanel (عادة public_html)');
    return false;
  } finally {
    client.close();
  }
}

/**
 * رفع مجلد بشكل متكرر
 */
async function uploadDirectory(client, localDir, remoteDir) {
  const files = fs.readdirSync(localDir, { withFileTypes: true });
  
  for (const file of files) {
    const localPath = path.join(localDir, file.name);
    const remotePath = `${remoteDir}/${file.name}`;
    
    if (file.isDirectory()) {
      try {
        await client.ensureDir(remotePath);
        await uploadDirectory(client, localPath, remotePath);
      } catch (e) {
        // المجلد موجود بالفعل
        await uploadDirectory(client, localPath, remotePath);
      }
    } else {
      await client.uploadFrom(localPath, remotePath);
    }
  }
}

// تشغيل الرفع
uploadDistToCpanel().then(success => {
  process.exit(success ? 0 : 1);
});

