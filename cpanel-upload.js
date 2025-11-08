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
  password: '@@@Tayo0991', // كلمة مرور FTP
  secure: false,
  port: 21
};

const CONFIG = {
  BACKUP_DIR: path.join(__dirname, 'backup'),
  HOME_DIR: path.join(__dirname, 'home')
};

/**
 * رفع نسخة احتياطية إلى cPanel
 */
async function uploadToCpanel(backupZipPath) {
  if (!fs.existsSync(backupZipPath)) {
    console.error(`لم يتم العثور على الملف: ${backupZipPath}`);
    return false;
  }
  
  console.log('جاري الاتصال بـ cPanel...');
  
  const client = new FtpClient.Client();
  
  try {
    await client.access({
      host: CPANEL_CONFIG.host,
      user: CPANEL_CONFIG.user,
      password: CPANEL_CONFIG.password,
      secure: CPANEL_CONFIG.secure,
      port: CPANEL_CONFIG.port
    });
    
    console.log('✓ تم الاتصال بنجاح');
    
    // رفع الملف المضغوط
    const fileName = path.basename(backupZipPath);
    console.log(`جاري رفع الملف: ${fileName}...`);
    
    // محاولة المسارات المختلفة
    const remotePaths = ['/public_html', '/www', '/httpdocs'];
    let uploaded = false;
    
    for (const remotePath of remotePaths) {
      try {
        await client.cd(remotePath);
        await client.uploadFrom(backupZipPath, `${remotePath}/${fileName}`);
        console.log('✓ تم رفع الملف بنجاح إلى cPanel');
        console.log(`الموقع على السيرفر: ${remotePath}/${fileName}`);
        uploaded = true;
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!uploaded) {
      throw new Error('لم يتم العثور على مسار صحيح للرفع');
    }
    
    return true;
  } catch (error) {
    console.error('خطأ أثناء الرفع:', error.message);
    return false;
  } finally {
    client.close();
  }
}

/**
 * رفع الملفات مباشرة إلى cPanel
 */
async function uploadFilesToCpanel() {
  console.log('جاري الاتصال بـ cPanel...');
  
  const client = new FtpClient.Client();
  
  try {
    await client.access({
      host: CPANEL_CONFIG.host,
      user: CPANEL_CONFIG.user,
      password: CPANEL_CONFIG.password,
      secure: CPANEL_CONFIG.secure,
      port: CPANEL_CONFIG.port
    });
    
    console.log('✓ تم الاتصال بنجاح');
    
    // الانتقال إلى مجلد الموقع (عادة public_html في cPanel)
    const remotePath = '/public_html';
    try {
      await client.cd(remotePath);
      console.log(`✓ تم الانتقال إلى ${remotePath}`);
    } catch (error) {
      // محاولة مسارات بديلة
      const altPaths = ['/www', '/httpdocs', '/var/www/u2890132/in33.in'];
      let found = false;
      for (const altPath of altPaths) {
        try {
          await client.cd(altPath);
          console.log(`✓ تم الانتقال إلى ${altPath}`);
          found = true;
          break;
        } catch (e) {
          continue;
        }
      }
      if (!found) {
        console.log('⚠ استخدام المسار الحالي');
      }
    }
    
    console.log('جاري رفع ملفات dist من مجلد home/dist...');
    
    // رفع ملفات dist فقط (الملفات المبنية)
    const distPath = path.join(CONFIG.HOME_DIR, 'dist');
    if (fs.existsSync(distPath)) {
      await client.uploadFromDir(distPath, '.');
      console.log('✓ تم رفع ملفات dist بنجاح');
    } else {
      console.log('⚠ مجلد dist غير موجود، جاري البناء...');
      return false;
    }
    
    console.log('✓ تم رفع جميع الملفات بنجاح');
    
    return true;
  } catch (error) {
    console.error('خطأ أثناء الرفع:', error.message);
    console.log('\nملاحظة: قد تحتاج إلى:');
    console.log('1. كلمة مرور FTP من cPanel (قد تكون مختلفة عن كلمة مرور قاعدة البيانات)');
    console.log('2. التأكد من أن FTP مفعل في cPanel');
    console.log('3. استخدام File Manager في cPanel للرفع اليدوي');
    return false;
  } finally {
    client.close();
  }
}

const command = process.argv[2];
const filePath = process.argv[3];

if (command === 'upload-backup' && filePath) {
  uploadToCpanel(filePath).then(success => {
    process.exit(success ? 0 : 1);
  });
} else if (command === 'upload-files') {
  uploadFilesToCpanel().then(success => {
    process.exit(success ? 0 : 1);
  });
} else {
  console.log('استخدام:');
  console.log('  رفع نسخة احتياطية: node cpanel-upload.js upload-backup <path-to-backup.zip>');
  console.log('  رفع الملفات مباشرة: node cpanel-upload.js upload-files');
  console.log('\nملاحظة: قد تحتاج إلى كلمة مرور FTP من cPanel');
}




