# ✅ تم إعداد المشروع بنجاح - IN33

## 📋 ملخص الإعداد

تم إعداد وتشغيل نظام إدارة النقل IN33 بنجاح!

## 🚀 حالة المشروع

- ✅ تم نسخ المشروع إلى `C:\Users\xmd55\Desktop\in33.in`
- ✅ تم تحديث جميع المراجع من ithraa إلى in33.in
- ✅ تم تثبيت جميع المتطلبات (npm packages)
- ✅ تم إنشاء ملف `.env` مع بيانات Supabase
- ✅ تم تهيئة Git repository وربطه بـ GitHub
- ✅ تم تشغيل خادم التطوير

## 🌐 الوصول إلى المشروع

### خادم التطوير المحلي
```
http://localhost:5173
```

### معلومات الربط

#### Supabase
- **URL**: https://cpgwnqiywsawepdkccpj.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj
- **API Key (anon)**: تم إضافتها في ملف `.env`
- **Service Role Key**: تم إضافتها في ملف `.env`

#### cPanel / FTP
- **Host**: ftp.u2890132.cp.regruhosting.ru
- **Username**: in@in33.in
- **Password**: @@@Tayo0991
- **Port**: 21
- **Path**: /var/www/u2890132/in33.in

#### GitHub
- **Repository**: https://github.com/tayoxmd/in33.git
- **Remote**: git@github.com:tayoxmd/in33.git

## 📝 الأوامر المفيدة

### تشغيل المشروع
```bash
cd C:\Users\xmd55\Desktop\in33.in\home
npm run dev
```

### بناء المشروع للإنتاج
```bash
cd C:\Users\xmd55\Desktop\in33.in\home
npm run build
```

### رفع الملفات إلى cPanel
```bash
cd C:\Users\xmd55\Desktop\in33.in
npm run cpanel:upload
```

### رفع الكود إلى GitHub
```bash
cd C:\Users\xmd55\Desktop\in33.in
git add .
git commit -m "Update"
git push origin main
```

### إعداد قاعدة البيانات في Supabase
```bash
cd C:\Users\xmd55\Desktop\in33.in\home
npm run setup-db
```

## 🔧 الخطوات التالية

1. **إعداد قاعدة البيانات في Supabase**:
   - افتح: https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj
   - اذهب إلى SQL Editor
   - قم بتشغيل ملفات migration الموجودة في `home/supabase/migrations/`

2. **رفع الملفات إلى cPanel**:
   ```bash
   npm run cpanel:upload
   ```

3. **رفع الكود إلى GitHub**:
   ```bash
   git push -u origin main
   ```

4. **اختبار المشروع**:
   - افتح: http://localhost:5173
   - تحقق من أن كل شيء يعمل بشكل صحيح

## 📧 معلومات الاتصال

- **البريد الإلكتروني**: in@in33.in
- **كلمة المرور**: @@@Tayo0991

## ⚠️ ملاحظات مهمة

1. ملف `.env` موجود في `home/.env` ويحتوي على بيانات Supabase
2. تأكد من أن قاعدة البيانات في Supabase تم إعدادها قبل استخدام الموقع
3. استخدم `npm run build` لبناء المشروع قبل رفعه إلى cPanel
4. تأكد من رفع ملفات `dist` بعد البناء إلى cPanel

## 🎉 تم الإعداد بنجاح!

المشروع جاهز للاستخدام والتطوير.

