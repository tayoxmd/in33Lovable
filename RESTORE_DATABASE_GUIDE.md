# دليل استعادة قاعدة البيانات من ithraa إلى in33.in

## تم نسخ جميع الملفات

تم نسخ جميع ملفات قاعدة البيانات من المشروع الأصلي (ithraa) إلى المشروع الجديد (in33.in):

- ✅ جميع migrations
- ✅ setup_supabase_complete.sql
- ✅ جميع البيانات الأولية

## الخطوات لاستعادة قاعدة البيانات في Supabase

### الطريقة 1: استخدام setup_supabase_complete.sql (موصى بها)

1. **افتح Supabase Dashboard**
   - [https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj](https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj)

2. **اذهب إلى SQL Editor**
   - من القائمة الجانبية، اختر **SQL Editor**
   - أو اذهب مباشرة: [SQL Editor](https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj/sql/new)

3. **افتح ملف setup_supabase_complete.sql**
   - افتح الملف: `C:\Users\xmd55\Desktop\in33.in\setup_supabase_complete.sql`
   - انسخ جميع محتوياته

4. **الصق في SQL Editor**
   - الصق الكود المنسوخ في SQL Editor
   - اضغط **Run** (أو Ctrl+Enter)

5. **انتظر حتى ينتهي التنفيذ**
   - قد يستغرق بضع دقائق
   - ستظهر رسالة نجاح عند الانتهاء

### الطريقة 2: استخدام Migrations (بديلة)

إذا فشلت الطريقة الأولى:

1. افتح SQL Editor في Supabase
2. قم بتشغيل ملفات migrations واحداً تلو الآخر من مجلد:
   ```
   C:\Users\xmd55\Desktop\in33.in\home\supabase\migrations\
   ```
3. ابدأ بأقدم ملف واعمل حتى الأحدث

## ما سيتم استعادته

### الجداول
- ✅ cities (المدن)
- ✅ hotels (الفنادق)
- ✅ profiles (المستخدمين)
- ✅ user_roles (الأدوار)
- ✅ bookings (الحجوزات)
- ✅ reviews (التقييمات)
- ✅ coupons (القسائم)
- ✅ meal_plans (خطط الوجبات)
- ✅ site_settings (الإعدادات)
- ✅ whatsapp_settings (إعدادات واتساب)
- ✅ pdf_settings (إعدادات PDF)
- ✅ وجميع الجداول الأخرى

### البيانات الأولية
- ✅ المدن: مكة، المدينة، جدة، الرياض
- ✅ الفنادق: مع جميع البيانات (الأسعار، الصور، الوجبات، إلخ)
- ✅ المستخدمين: admin والمستخدمين الآخرين
- ✅ الإعدادات: جميع إعدادات الموقع

### الدوال (Functions)
- ✅ get_public_hotels
- ✅ create_system_backup
- ✅ وجميع الدوال الأخرى

## التحقق بعد الاستعادة

1. **تحقق من المدن**
   ```sql
   SELECT * FROM cities WHERE active = true;
   ```

2. **تحقق من الفنادق**
   ```sql
   SELECT id, name_ar, name_en, city_id FROM hotels LIMIT 10;
   ```

3. **تحقق من المستخدمين**
   ```sql
   SELECT id, full_name FROM profiles LIMIT 10;
   ```

## بعد الاستعادة

1. أعد تحميل صفحة البحث في موقعك
2. يجب أن تظهر المدن في القائمة المنسدلة
3. يجب أن تظهر الفنادق عند البحث
4. يجب أن تعمل جميع الوظائف

## ملاحظات مهمة

- **لا تقلق بشأن البيانات الموجودة**: إذا كان هناك بيانات موجودة، سيتم استبدالها
- **النسخ الاحتياطية**: تم إنشاء نسخة احتياطية تلقائية قبل التطبيق
- **الوقت المطلوب**: قد يستغرق التنفيذ 2-5 دقائق

## مساعدة إضافية

إذا واجهت مشاكل:
1. تحقق من سجل الأخطاء في Supabase SQL Editor
2. تأكد من أنك تستخدم Project ID الصحيح
3. تحقق من أن لديك صلاحيات admin في Supabase

---

**المسار**: `C:\Users\xmd55\Desktop\in33.in\setup_supabase_complete.sql`


