# إعادة توليد ملف types.ts من Supabase

## المشكلة
TypeScript لا يتعرف على أسماء الجداول في قاعدة البيانات لأن ملف `types.ts` قديم أو تالف.

## الحل

### الطريقة 1: من Supabase Dashboard (الأسهل)

1. افتح [Supabase Dashboard](https://supabase.com/dashboard/project/cpgwnqiywsawepdkccpj)
2. اذهب إلى **Project Settings → API**
3. انزل إلى قسم **"Generate types"**
4. اختر **TypeScript** من القائمة المنسدلة
5. انسخ الأنواع المولدة
6. استبدلها في ملف `src/integrations/supabase/types.ts`

### الطريقة 2: استخدام Supabase CLI (الأسرع)

**ملاحظة:** تحتاج إلى تسجيل الدخول أولاً:

```bash
# تسجيل الدخول إلى Supabase
npx supabase login

# إعادة توليد الأنواع
npx supabase gen types typescript --project-id cpgwnqiywsawepdkccpj > src/integrations/supabase/types.ts
```

## النتيجة المتوقعة

بعد إعادة التوليد، سيتعرف TypeScript على جميع الجداول والأعمدة بشكل صحيح، وستختفي جميع الأخطاء.

## معلومات المشروع

- **Project ID**: `cpgwnqiywsawepdkccpj`
- **Project URL**: `https://cpgwnqiywsawepdkccpj.supabase.co`
- **ملف الأنواع**: `src/integrations/supabase/types.ts`


