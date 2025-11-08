# إصلاح دالة create_system_backup

## المشكلة
الدالة `create_system_backup` غير موجودة في قاعدة البيانات Supabase أو تعيد `void` بدلاً من `jsonb`.

## الحل

### الخطوة 1: تطبيق Migration في Supabase

1. افتح [Supabase Dashboard](https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj)
2. اذهب إلى **SQL Editor**
3. انسخ محتوى ملف `supabase/migrations/20251108000000_fix_create_system_backup.sql`
4. الصقه في SQL Editor
5. اضغط **Run** لتطبيق الدالة

### الخطوة 2: التحقق من الدالة

بعد تطبيق Migration، يجب أن تكون الدالة `create_system_backup()` موجودة وتعيد `jsonb`.

### الخطوة 3: اختبار النسخ الاحتياطي

1. افتح صفحة **إعدادات الموقع** (Site Settings)
2. اضغط على **"إنشاء نسخة احتياطية جديدة"** أو **"إنشاء نسخة احتياطية شاملة"**
3. يجب أن تعمل بدون أخطاء

## ملاحظات

- الدالة الآن تعيد `jsonb` بدلاً من `void`
- الدالة تجمع جميع البيانات من جميع الجداول
- الدالة تحفظ النسخة الاحتياطية في `site_settings.backup_data`
- الدالة تزيد رقم الإصدار تلقائياً

## الملفات المحدثة

- `supabase/migrations/20251108000000_fix_create_system_backup.sql` - Migration جديد
- `src/pages/SiteSettings.tsx` - تحديث معالجة النسخ الاحتياطي

