# دليل النشر - IN33

## ✅ تم إعداد المشروع

### 📦 ما تم إنجازه:

1. ✅ **بناء المشروع**: تم بناء المشروع بنجاح في `home/dist`
2. ✅ **Git Repository**: تم تهيئة Git وربطه بـ GitHub
3. ⚠️ **cPanel FTP**: يحتاج إلى إعداد يدوي

## 🚀 خطوات النشر

### 1. رفع الكود إلى GitHub

```bash
cd C:\Users\xmd55\Desktop\in33.in
git add .
git commit -m "Update"
git push origin main
```

**الرابط**: https://github.com/tayoxmd/in33.git

### 2. رفع الملفات إلى cPanel

#### الطريقة الأولى: استخدام File Manager في cPanel

1. سجل الدخول إلى cPanel: https://cpanel.regruhosting.ru
2. افتح **File Manager**
3. اذهب إلى مجلد `public_html` أو `www`
4. ارفع جميع الملفات من `C:\Users\xmd55\Desktop\in33.in\home\dist`

#### الطريقة الثانية: استخدام FTP Client (FileZilla)

**إعدادات FTP:**
- **Host**: ftp.u2890132.cp.regruhosting.ru
- **Username**: in@in33.in
- **Password**: @@@Tayo0991
- **Port**: 21
- **Protocol**: FTP

**المسار على السيرفر:**
- `/public_html` أو `/www` أو `/httpdocs`

**الملفات المطلوب رفعها:**
- جميع الملفات من `C:\Users\xmd55\Desktop\in33.in\home\dist`

#### الطريقة الثالثة: استخدام سكريبت Node.js

```bash
cd C:\Users\xmd55\Desktop\in33.in
node upload-to-cpanel.js
```

**ملاحظة**: قد تحتاج إلى تعديل المسار في السكريبت حسب إعدادات cPanel الخاصة بك.

### 3. إعداد قاعدة البيانات في Supabase

1. افتح: https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj
2. اذهب إلى **SQL Editor**
3. قم بتشغيل ملفات migration الموجودة في:
   - `home/supabase/migrations/`

أو استخدم الأمر:
```bash
cd C:\Users\xmd55\Desktop\in33.in\home
npm run setup-db
```

## 📋 معلومات الاتصال

### Supabase
- **URL**: https://cpgwnqiywsawepdkccpj.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj
- **API Keys**: موجودة في `home/.env`

### cPanel
- **URL**: https://cpanel.regruhosting.ru
- **FTP Host**: ftp.u2890132.cp.regruhosting.ru
- **Username**: in@in33.in
- **Password**: @@@Tayo0991

### GitHub
- **Repository**: https://github.com/tayoxmd/in33.git
- **Remote**: https://github.com/tayoxmd/in33.git

## 🔧 إعادة البناء والنشر

عند إجراء أي تعديلات:

1. **بناء المشروع**:
```bash
cd C:\Users\xmd55\Desktop\in33.in\home
npm run build
```

2. **رفع الكود إلى GitHub**:
```bash
cd C:\Users\xmd55\Desktop\in33.in
git add .
git commit -m "Update"
git push origin main
```

3. **رفع الملفات إلى cPanel**:
- استخدم File Manager في cPanel
- أو استخدم FTP Client
- ارفع جميع الملفات من `home/dist`

## ⚠️ ملاحظات مهمة

1. **ملف .env**: لا ترفع ملف `.env` إلى GitHub (موجود في `.gitignore`)
2. **ملفات dist**: ارفع فقط ملفات `dist` إلى cPanel، وليس ملفات المصدر
3. **قاعدة البيانات**: تأكد من إعداد قاعدة البيانات في Supabase قبل استخدام الموقع
4. **المسار**: قد يختلف مسار الموقع في cPanel حسب الإعدادات

## 🎯 الموقع النهائي

بعد رفع الملفات، سيكون الموقع متاحاً على:
- **https://in33.in** (إذا تم ربط الدومين)
- أو على المسار المحدد في cPanel

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من إعدادات FTP في cPanel
2. تأكد من صحة المسار على السيرفر
3. تحقق من أن قاعدة البيانات تم إعدادها في Supabase

