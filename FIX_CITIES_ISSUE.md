# إصلاح مشكلة عدم ظهور المدن

## المشكلة
المدن لا تظهر في:
1. صندوق البحث في الصفحة الرئيسية
2. إعدادات الفنادق في لوحة التحكم

## الأسباب المحتملة

### 1. لا توجد مدن في قاعدة البيانات
- يجب إضافة مدن إلى جدول `cities` في Supabase

### 2. جميع المدن غير نشطة (active = false)
- الكود يجلب فقط المدن التي لديها `active = true`

### 3. لم يتم تطبيق migrations في Supabase
- يجب تطبيق ملفات migration في Supabase لإنشاء جدول المدن

## الحل

### الخطوة 1: التحقق من وجود جدول المدن

1. افتح [Supabase Dashboard](https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj)
2. اذهب إلى **Table Editor**
3. ابحث عن جدول `cities`
4. إذا لم يكن موجوداً، اتبع الخطوة 2

### الخطوة 2: تطبيق Migrations

1. افتح [Supabase SQL Editor](https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj/sql/new)
2. قم بتشغيل ملفات migration الموجودة في `home/supabase/migrations/`
3. ابدأ بأقدم ملف واعمل حتى الأحدث

### الخطوة 3: إضافة مدن

قم بتشغيل هذا الكود SQL في Supabase SQL Editor:

```sql
-- إضافة مدن مع التحقق من عدم وجودها
INSERT INTO cities (name_ar, name_en, active) VALUES
('مكة المكرمة', 'Makkah', true),
('المدينة المنورة', 'Madinah', true),
('جدة', 'Jeddah', true),
('الرياض', 'Riyadh', true)
ON CONFLICT (name_ar) DO UPDATE SET active = true;
```

### الخطوة 4: التحقق

1. أعد تحميل صفحة البحث
2. تحقق من أن المدن تظهر في القائمة المنسدلة
3. جرب البحث

## الكود الحالي

### في SearchBox.tsx
```typescript
const { data } = await supabase
  .from('cities')
  .select('*')
  .eq('active', true);
```

### في ManageHotels.tsx
```typescript
const { data, error } = await supabase
  .from('cities')
  .select('id, name_ar, name_en')
  .eq('active', true)
  .order('name_en', { ascending: true });
```

## التحقق السريع

قم بتشغيل هذا الكود SQL في Supabase SQL Editor:

```sql
-- التحقق من وجود مدن نشطة
SELECT * FROM cities WHERE active = true;
```

إذا لم يكن هناك نتائج، فالمشكلة هي أنه لا توجد مدن نشطة.

## حل سريع

إذا كان الجدول موجوداً لكن لا توجد مدن، قم بتشغيل:

```sql
-- حذف جميع المدن القديمة (اختياري)
DELETE FROM cities;

-- إضافة مدن جديدة
INSERT INTO cities (name_ar, name_en, active) VALUES
('مكة المكرمة', 'Makkah', true),
('المدينة المنورة', 'Madinah', true),
('جدة', 'Jeddah', true),
('الرياض', 'Riyadh', true),
('الطائف', 'Taif', true),
('الدمام', 'Dammam', true),
('أبها', 'Abha', true),
('تبوك', 'Tabuk', true);
```

## ملاحظة مهمة

تأكد من أن:
1. جدول `cities` موجود في Supabase
2. جدول `cities` يحتوي على أعمدة: `id`, `name_ar`, `name_en`, `active`
3. على الأقل مدينة واحدة لديها `active = true`


