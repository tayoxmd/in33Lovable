#!/usr/bin/env node

/**
 * سكريبت لاستعادة البيانات من المشروع الأصلي (ithraa) إلى المشروع الجديد (in33.in)
 * Script to restore data from original project (ithraa) to new project (in33.in)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// إعدادات المشروع الأصلي (ithraa)
const ORIGINAL_SUPABASE_URL = 'https://orqhoejabexcdjmdgzxg.supabase.co';
const ORIGINAL_SUPABASE_KEY = process.env.ORIGINAL_SUPABASE_KEY || '';

// إعدادات المشروع الجديد (in33.in)
const NEW_SUPABASE_URL = 'https://cpgwnqiywsawepdkccpj.supabase.co';
const NEW_SUPABASE_KEY = process.env.NEW_SUPABASE_KEY || '';

if (!ORIGINAL_SUPABASE_KEY || !NEW_SUPABASE_KEY) {
  console.error('❌ خطأ: تحتاج إلى تعيين مفاتيح Supabase');
  console.error('❌ Error: You need to set Supabase keys');
  console.error('\n💡 قم بتعيين:');
  console.error('💡 Set:');
  console.error('   export ORIGINAL_SUPABASE_KEY="your-original-key"');
  console.error('   export NEW_SUPABASE_KEY="your-new-key"');
  process.exit(1);
}

const originalClient = createClient(ORIGINAL_SUPABASE_URL, ORIGINAL_SUPABASE_KEY);
const newClient = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);

// خريطة لتخزين UUIDs القديمة والجديدة
const cityIdMap = new Map();
const hotelIdMap = new Map();
const userIdMap = new Map();

async function restoreCities() {
  console.log('🔄 استعادة المدن...');
  console.log('🔄 Restoring cities...');
  
  const { data: cities, error } = await originalClient
    .from('cities')
    .select('*')
    .order('name_ar');
  
  if (error) {
    console.error('❌ خطأ في جلب المدن:', error);
    return;
  }
  
  if (!cities || cities.length === 0) {
    console.log('⚠️ لا توجد مدن في المشروع الأصلي');
    return;
  }
  
  console.log(`✅ تم جلب ${cities.length} مدينة`);
  
  // حذف المدن الموجودة في المشروع الجديد
  await newClient.from('cities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // إدراج المدن في المشروع الجديد
  for (const city of cities) {
    const oldId = city.id;
    const { data: newCity, error: insertError } = await newClient
      .from('cities')
      .insert({
        name_ar: city.name_ar,
        name_en: city.name_en,
        active: city.active,
        created_at: city.created_at,
        updated_at: city.updated_at
      })
      .select()
      .single();
    
    if (insertError) {
      console.error(`❌ خطأ في إدراج مدينة ${city.name_ar}:`, insertError);
    } else {
      cityIdMap.set(oldId, newCity.id);
      console.log(`✅ تم إدراج: ${city.name_ar} (${oldId} -> ${newCity.id})`);
    }
  }
}

async function restoreHotels() {
  console.log('\n🔄 استعادة الفنادق...');
  console.log('🔄 Restoring hotels...');
  
  const { data: hotels, error } = await originalClient
    .from('hotels')
    .select('*')
    .order('name_ar');
  
  if (error) {
    console.error('❌ خطأ في جلب الفنادق:', error);
    return;
  }
  
  if (!hotels || hotels.length === 0) {
    console.log('⚠️ لا توجد فنادق في المشروع الأصلي');
    return;
  }
  
  console.log(`✅ تم جلب ${hotels.length} فندق`);
  
  // حذف الفنادق الموجودة في المشروع الجديد
  await newClient.from('hotels').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // إدراج الفنادق في المشروع الجديد
  for (const hotel of hotels) {
    const oldId = hotel.id;
    const newCityId = cityIdMap.get(hotel.city_id);
    
    if (!newCityId) {
      console.warn(`⚠️ تم تخطي فندق ${hotel.name_ar} - المدينة غير موجودة`);
      continue;
    }
    
    const { data: newHotel, error: insertError } = await newClient
      .from('hotels')
      .insert({
        name_ar: hotel.name_ar,
        name_en: hotel.name_en,
        description_ar: hotel.description_ar,
        description_en: hotel.description_en,
        location: hotel.location,
        location_url: hotel.location_url,
        city_id: newCityId,
        price_per_night: hotel.price_per_night,
        rating: hotel.rating,
        images: hotel.images,
        active: hotel.active,
        max_guests_per_room: hotel.max_guests_per_room,
        extra_guest_price: hotel.extra_guest_price,
        total_rooms: hotel.total_rooms,
        tax_percentage: hotel.tax_percentage,
        room_type: hotel.room_type,
        meal_plans: hotel.meal_plans,
        amenities: hotel.amenities,
        bed_type_double: hotel.bed_type_double,
        created_at: hotel.created_at,
        updated_at: hotel.updated_at
      })
      .select()
      .single();
    
    if (insertError) {
      console.error(`❌ خطأ في إدراج فندق ${hotel.name_ar}:`, insertError);
    } else {
      hotelIdMap.set(oldId, newHotel.id);
      console.log(`✅ تم إدراج: ${hotel.name_ar}`);
    }
  }
}

async function restoreProfiles() {
  console.log('\n🔄 استعادة المستخدمين...');
  console.log('🔄 Restoring profiles...');
  
  const { data: profiles, error } = await originalClient
    .from('profiles')
    .select('*')
    .order('full_name');
  
  if (error) {
    console.error('❌ خطأ في جلب المستخدمين:', error);
    return;
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('⚠️ لا يوجد مستخدمين في المشروع الأصلي');
    return;
  }
  
  console.log(`✅ تم جلب ${profiles.length} مستخدم`);
  
  // إدراج المستخدمين في المشروع الجديد (بدون حذف - قد يكون هناك مستخدمين موجودين)
  for (const profile of profiles) {
    const oldId = profile.id;
    
    // التحقق من وجود المستخدم
    const { data: existing } = await newClient
      .from('profiles')
      .select('id')
      .eq('id', oldId)
      .single();
    
    if (existing) {
      console.log(`⚠️ المستخدم ${profile.full_name} موجود بالفعل`);
      userIdMap.set(oldId, oldId);
      continue;
    }
    
    const { data: newProfile, error: insertError } = await newClient
      .from('profiles')
      .insert({
        id: profile.id, // استخدام نفس UUID
        full_name: profile.full_name,
        phone: profile.phone,
        email: profile.email,
        role: profile.role,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      })
      .select()
      .single();
    
    if (insertError) {
      console.error(`❌ خطأ في إدراج مستخدم ${profile.full_name}:`, insertError);
    } else {
      userIdMap.set(oldId, newProfile.id);
      console.log(`✅ تم إدراج: ${profile.full_name}`);
    }
  }
}

async function restoreBookings() {
  console.log('\n🔄 استعادة الحجوزات...');
  console.log('🔄 Restoring bookings...');
  
  const { data: bookings, error } = await originalClient
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ خطأ في جلب الحجوزات:', error);
    return;
  }
  
  if (!bookings || bookings.length === 0) {
    console.log('⚠️ لا توجد حجوزات في المشروع الأصلي');
    return;
  }
  
  console.log(`✅ تم جلب ${bookings.length} حجز`);
  
  // حذف الحجوزات الموجودة في المشروع الجديد
  await newClient.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // إدراج الحجوزات في المشروع الجديد
  for (const booking of bookings) {
    const newHotelId = hotelIdMap.get(booking.hotel_id);
    const newUserId = userIdMap.get(booking.user_id);
    
    if (!newHotelId || !newUserId) {
      console.warn(`⚠️ تم تخطي حجز - الفندق أو المستخدم غير موجود`);
      continue;
    }
    
    const { error: insertError } = await newClient
      .from('bookings')
      .insert({
        id: booking.id,
        user_id: newUserId,
        hotel_id: newHotelId,
        check_in: booking.check_in,
        check_out: booking.check_out,
        guests: booking.guests,
        total_price: booking.total_price,
        status: booking.status,
        created_at: booking.created_at,
        updated_at: booking.updated_at
      });
    
    if (insertError) {
      console.error(`❌ خطأ في إدراج حجز:`, insertError);
    } else {
      console.log(`✅ تم إدراج حجز`);
    }
  }
}

async function restoreAll() {
  console.log('🚀 بدء استعادة البيانات...');
  console.log('🚀 Starting data restoration...\n');
  
  try {
    await restoreCities();
    await restoreHotels();
    await restoreProfiles();
    await restoreBookings();
    
    console.log('\n✅ تم الانتهاء من استعادة البيانات بنجاح!');
    console.log('✅ Data restoration completed successfully!');
    console.log(`\n📊 الإحصائيات:`);
    console.log(`📊 Statistics:`);
    console.log(`   - المدن: ${cityIdMap.size}`);
    console.log(`   - Cities: ${cityIdMap.size}`);
    console.log(`   - الفنادق: ${hotelIdMap.size}`);
    console.log(`   - Hotels: ${hotelIdMap.size}`);
    console.log(`   - المستخدمين: ${userIdMap.size}`);
    console.log(`   - Users: ${userIdMap.size}`);
  } catch (error) {
    console.error('❌ خطأ عام:', error);
    process.exit(1);
  }
}

restoreAll();

