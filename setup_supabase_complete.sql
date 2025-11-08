-- ============================================
-- إعداد قاعدة البيانات الكامل لـ Supabase
-- Complete Supabase Database Setup
-- ============================================

-- ============================================
-- 1. إنشاء الأنواع (ENUMs)
-- ============================================

-- Create enum types for statuses
DO $$ BEGIN
  CREATE TYPE public.booking_status AS ENUM ('new', 'pending', 'confirmed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.complaint_status AS ENUM ('new', 'pending', 'rejected', 'resolved');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create app_role enum if not exists (with basic values)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'employee', 'customer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add additional role values if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'manager' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'manager';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'assistant_manager' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'assistant_manager';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'specific_financial_manager' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'specific_financial_manager';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'visa_manager' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'visa_manager';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'specific_financial_employee' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'specific_financial_employee';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done', 'rejected', 'archived', 'pending', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.task_category AS ENUM ('general', 'financial', 'booking', 'support', 'maintenance');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. إنشاء الدوال المساعدة (Helper Functions)
-- ============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user has any of the roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  )
$$;

-- Function to check room availability
CREATE OR REPLACE FUNCTION public.check_room_availability(
  p_hotel_id uuid,
  p_check_in date,
  p_check_out date,
  p_rooms_needed integer
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_rooms integer;
  v_booked_rooms integer;
BEGIN
  -- Get total rooms for hotel
  SELECT total_rooms INTO v_total_rooms
  FROM public.hotels
  WHERE id = p_hotel_id;
  
  -- Calculate overlapping bookings
  SELECT COALESCE(SUM(rooms_booked), 0) INTO v_booked_rooms
  FROM public.room_availability
  WHERE hotel_id = p_hotel_id
    AND (
      (check_in <= p_check_in AND check_out > p_check_in)
      OR (check_in < p_check_out AND check_out >= p_check_out)
      OR (check_in >= p_check_in AND check_out <= p_check_out)
    );
  
  -- Return true if enough rooms available
  RETURN (v_total_rooms - v_booked_rooms) >= p_rooms_needed;
END;
$$;

-- Function to calculate task remaining amount
CREATE OR REPLACE FUNCTION calculate_task_remaining_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_financial = true AND NEW.amount_total IS NOT NULL THEN
    NEW.amount_remaining := NEW.amount_total - COALESCE(NEW.amount_paid, 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. إنشاء الجداول الأساسية
-- ============================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create hotels table
CREATE TABLE IF NOT EXISTS public.hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  location TEXT,
  location_url TEXT,
  price_per_night DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  images JSONB DEFAULT '[]',
  contact_person TEXT,
  contact_phone TEXT,
  total_rooms INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'new',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status complaint_status DEFAULT 'new',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create financial_transactions table
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_name TEXT,
  guest_phone TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  admin_response TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  min_booking_amount NUMERIC DEFAULT 0,
  applicable_to TEXT DEFAULT 'all' CHECK (applicable_to IN ('all', 'specific_hotels', 'specific_users')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coupon_users table
CREATE TABLE IF NOT EXISTS public.coupon_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(coupon_id, user_id)
);

-- Create coupon_hotels table
CREATE TABLE IF NOT EXISTS public.coupon_hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(coupon_id, hotel_id)
);

-- Create loyalty_points table
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_percentage numeric NOT NULL DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create hotel_responsible_persons table
CREATE TABLE IF NOT EXISTS public.hotel_responsible_persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  employee_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(hotel_id, employee_id)
);

-- Create room_availability table
CREATE TABLE IF NOT EXISTS public.room_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  rooms_booked integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create whatsapp_settings table
CREATE TABLE IF NOT EXISTS public.whatsapp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_link TEXT,
  reminder_hours INTEGER DEFAULT 24,
  no_booking_alert_hours INTEGER DEFAULT 24,
  send_confirmation BOOLEAN DEFAULT true,
  send_reminder BOOLEAN DEFAULT true,
  send_to_group BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_settings table
CREATE TABLE IF NOT EXISTS public.email_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  email_accounts JSONB DEFAULT '[]'::jsonb,
  email_colors JSONB DEFAULT '{
    "inbox": "#3b82f6",
    "sent": "#10b981",
    "drafts": "#f59e0b",
    "archive": "#8b5cf6",
    "trash": "#ef4444",
    "spam": "#6b7280"
  }'::jsonb,
  filters JSONB DEFAULT '[]'::jsonb,
  templates JSONB DEFAULT '[]'::jsonb,
  device_templates JSONB DEFAULT '{
    "mobile": "",
    "desktop": "",
    "tablet": ""
  }'::jsonb,
  access_permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create emails table
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id TEXT NOT NULL,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  folder TEXT NOT NULL DEFAULT 'inbox' CHECK (folder IN ('inbox', 'sent', 'drafts', 'trash', 'archive', 'spam')),
  read BOOLEAN DEFAULT false,
  starred BOOLEAN DEFAULT false,
  filter_ids JSONB DEFAULT '[]'::jsonb,
  is_archived BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  tags text[],
  order_index integer DEFAULT 0,
  category text,
  is_financial boolean DEFAULT false,
  amount_total numeric(10,2),
  amount_paid numeric(10,2) DEFAULT 0,
  amount_remaining numeric(10,2),
  payment_due_date date,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create task_comments table
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create task_attachments table
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create task_activity_log table
CREATE TABLE IF NOT EXISTS public.task_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create task_categories table
CREATE TABLE IF NOT EXISTS public.task_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT DEFAULT 'tag',
  color TEXT DEFAULT '#6b7280',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create task_full_access_users table
CREATE TABLE IF NOT EXISTS public.task_full_access_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  granted_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create task_sharing_settings table
CREATE TABLE IF NOT EXISTS public.task_sharing_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_via_email boolean DEFAULT false,
  share_via_whatsapp boolean DEFAULT false,
  share_via_whatsapp_group boolean DEFAULT false,
  whatsapp_group_link text,
  notify_on_create boolean DEFAULT true,
  notify_on_update boolean DEFAULT true,
  notify_on_status_change boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create private_account_access table
CREATE TABLE IF NOT EXISTS public.private_account_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  granted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create private_owners table
CREATE TABLE IF NOT EXISTS public.private_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  national_id TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create private_hotels table
CREATE TABLE IF NOT EXISTS public.private_hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.private_owners(id),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  location TEXT,
  city TEXT,
  total_rooms INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create private_rooms table
CREATE TABLE IF NOT EXISTS public.private_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES public.private_hotels(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  room_type TEXT,
  price_per_night NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create private_transactions table
CREATE TABLE IF NOT EXISTS public.private_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  hotel_id UUID REFERENCES public.private_hotels(id),
  category TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create private_vault table
CREATE TABLE IF NOT EXISTS public.private_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID
);

-- Create private_customers table
CREATE TABLE IF NOT EXISTS public.private_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create private_bookings table
CREATE TABLE IF NOT EXISTS public.private_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.private_customers(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.private_hotels(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.private_rooms(id) ON DELETE SET NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  total_amount NUMERIC(10,2) NOT NULL,
  paid_amount NUMERIC(10,2) DEFAULT 0,
  remaining_amount NUMERIC(10,2),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 4. تفعيل Row Level Security (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_responsible_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_full_access_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_sharing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_account_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. إنشاء السياسات (RLS Policies)
-- ============================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Cities policies
DROP POLICY IF EXISTS "Anyone can view active cities" ON public.cities;
CREATE POLICY "Anyone can view active cities"
ON public.cities FOR SELECT
USING (active = true);

DROP POLICY IF EXISTS "Admins can manage cities" ON public.cities;
CREATE POLICY "Admins can manage cities"
ON public.cities FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Hotels policies
DROP POLICY IF EXISTS "Anyone can view active hotels" ON public.hotels;
CREATE POLICY "Anyone can view active hotels"
ON public.hotels FOR SELECT
USING (active = true);

DROP POLICY IF EXISTS "Admins can manage hotels" ON public.hotels;
CREATE POLICY "Admins can manage hotels"
ON public.hotels FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Bookings policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
CREATE POLICY "Users can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins and employees can update bookings" ON public.bookings;
CREATE POLICY "Admins and employees can update bookings"
ON public.bookings FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'employee')
);

-- Complaints policies
DROP POLICY IF EXISTS "Users can view their own complaints" ON public.complaints;
CREATE POLICY "Users can view their own complaints"
ON public.complaints FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create complaints" ON public.complaints;
CREATE POLICY "Users can create complaints"
ON public.complaints FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all complaints" ON public.complaints;
CREATE POLICY "Admins can view all complaints"
ON public.complaints FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Financial transactions policies
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.financial_transactions;
CREATE POLICY "Admins can view all transactions"
ON public.financial_transactions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Reviews policies
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view approved reviews" ON public.reviews;
CREATE POLICY "Users can view approved reviews" ON public.reviews FOR SELECT 
USING (status = 'approved');

DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON public.reviews;
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE id = booking_id 
    AND (user_id = auth.uid() OR guest_phone = reviews.guest_phone)
  )
);

-- Coupons policies
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view active coupons" ON public.coupons;
CREATE POLICY "Users can view active coupons" ON public.coupons FOR SELECT 
USING (active = true AND valid_from <= CURRENT_DATE AND valid_to >= CURRENT_DATE);

-- Coupon users policies
DROP POLICY IF EXISTS "Admins can manage coupon users" ON public.coupon_users;
CREATE POLICY "Admins can manage coupon users" ON public.coupon_users FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view their coupons" ON public.coupon_users;
CREATE POLICY "Users can view their coupons" ON public.coupon_users FOR SELECT 
USING (user_id = auth.uid());

-- Coupon hotels policies
DROP POLICY IF EXISTS "Admins can manage coupon hotels" ON public.coupon_hotels;
CREATE POLICY "Admins can manage coupon hotels" ON public.coupon_hotels FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Everyone can view coupon hotels" ON public.coupon_hotels;
CREATE POLICY "Everyone can view coupon hotels" ON public.coupon_hotels FOR SELECT 
USING (true);

-- Loyalty points policies
DROP POLICY IF EXISTS "Admins can manage loyalty points" ON public.loyalty_points;
CREATE POLICY "Admins can manage loyalty points" ON public.loyalty_points FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view their loyalty points" ON public.loyalty_points;
CREATE POLICY "Users can view their loyalty points" ON public.loyalty_points FOR SELECT 
USING (user_id = auth.uid());

-- Site settings policies
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings"
ON public.site_settings FOR SELECT
USING (true);

-- Hotel responsible persons policies
DROP POLICY IF EXISTS "Admins can manage hotel responsible persons" ON public.hotel_responsible_persons;
CREATE POLICY "Admins can manage hotel responsible persons"
ON public.hotel_responsible_persons FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Employees can view their assignments" ON public.hotel_responsible_persons;
CREATE POLICY "Employees can view their assignments"
ON public.hotel_responsible_persons FOR SELECT
USING (employee_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Room availability policies
DROP POLICY IF EXISTS "Admins and employees can manage room availability" ON public.room_availability;
CREATE POLICY "Admins and employees can manage room availability"
ON public.room_availability FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'employee'::app_role));

-- WhatsApp settings policies
DROP POLICY IF EXISTS "Admins can manage WhatsApp settings" ON public.whatsapp_settings;
CREATE POLICY "Admins can manage WhatsApp settings" ON public.whatsapp_settings FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Email settings policies
DROP POLICY IF EXISTS "Admins can manage email settings" ON public.email_settings;
CREATE POLICY "Admins can manage email settings"
ON public.email_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Authenticated users can view email settings" ON public.email_settings;
CREATE POLICY "Authenticated users can view email settings"
ON public.email_settings FOR SELECT
USING (true);

-- Emails policies
DROP POLICY IF EXISTS "Users can manage their emails" ON public.emails;
CREATE POLICY "Users can manage their emails"
ON public.emails FOR ALL
USING (true);

-- Tasks policies
DROP POLICY IF EXISTS "Staff can create tasks" ON public.tasks;
CREATE POLICY "Staff can create tasks" ON public.tasks
FOR INSERT
WITH CHECK (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
);

DROP POLICY IF EXISTS "Staff can view all tasks" ON public.tasks;
CREATE POLICY "Staff can view all tasks" ON public.tasks
FOR SELECT
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
  OR assigned_to = auth.uid()
);

DROP POLICY IF EXISTS "Staff can update all tasks" ON public.tasks;
CREATE POLICY "Staff can update all tasks" ON public.tasks
FOR UPDATE
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
  OR assigned_to = auth.uid()
);

DROP POLICY IF EXISTS "Staff can delete tasks" ON public.tasks;
CREATE POLICY "Staff can delete tasks" ON public.tasks
FOR DELETE
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role])
);

-- Task comments policies
DROP POLICY IF EXISTS "Staff can view task comments" ON public.task_comments;
CREATE POLICY "Staff can view task comments" ON public.task_comments
FOR SELECT
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
);

DROP POLICY IF EXISTS "Staff can create task comments" ON public.task_comments;
CREATE POLICY "Staff can create task comments" ON public.task_comments
FOR INSERT
WITH CHECK (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
  AND user_id = auth.uid()
);

DROP POLICY IF EXISTS "Staff can update own comments" ON public.task_comments;
CREATE POLICY "Staff can update own comments" ON public.task_comments
FOR UPDATE
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Staff can delete own comments" ON public.task_comments;
CREATE POLICY "Staff can delete own comments" ON public.task_comments
FOR DELETE
USING (user_id = auth.uid() OR has_role(auth.uid(), 'manager'::app_role));

-- Task attachments policies
DROP POLICY IF EXISTS "Staff can view task attachments" ON public.task_attachments;
CREATE POLICY "Staff can view task attachments" ON public.task_attachments
FOR SELECT
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
);

DROP POLICY IF EXISTS "Staff can upload attachments" ON public.task_attachments;
CREATE POLICY "Staff can upload attachments" ON public.task_attachments
FOR INSERT
WITH CHECK (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
  AND uploaded_by = auth.uid()
);

DROP POLICY IF EXISTS "Staff can delete own attachments" ON public.task_attachments;
CREATE POLICY "Staff can delete own attachments" ON public.task_attachments
FOR DELETE
USING (uploaded_by = auth.uid() OR has_role(auth.uid(), 'manager'::app_role));

-- Task activity log policies
DROP POLICY IF EXISTS "Staff can view task activity logs" ON public.task_activity_log;
CREATE POLICY "Staff can view task activity logs"
ON public.task_activity_log
FOR SELECT
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
);

DROP POLICY IF EXISTS "Staff can create task activity logs" ON public.task_activity_log;
CREATE POLICY "Staff can create task activity logs"
ON public.task_activity_log
FOR INSERT
TO authenticated
WITH CHECK (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role, 'employee'::app_role])
  AND user_id = auth.uid()
);

-- Task categories policies
DROP POLICY IF EXISTS "Everyone can view active categories" ON public.task_categories;
CREATE POLICY "Everyone can view active categories"
ON public.task_categories
FOR SELECT
TO authenticated
USING (active = true);

DROP POLICY IF EXISTS "Staff can manage categories" ON public.task_categories;
CREATE POLICY "Staff can manage categories"
ON public.task_categories
FOR ALL
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role])
)
WITH CHECK (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role])
);

-- Task full access users policies
DROP POLICY IF EXISTS "Managers can manage full access users" ON public.task_full_access_users;
CREATE POLICY "Managers can manage full access users"
ON public.task_full_access_users
FOR ALL
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
)
WITH CHECK (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
);

DROP POLICY IF EXISTS "Users can view their own access status" ON public.task_full_access_users;
CREATE POLICY "Users can view their own access status"
ON public.task_full_access_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Task sharing settings policies
DROP POLICY IF EXISTS "Managers can manage sharing settings" ON public.task_sharing_settings;
CREATE POLICY "Managers can manage sharing settings"
ON public.task_sharing_settings
FOR ALL
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role])
)
WITH CHECK (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'assistant_manager'::app_role])
);

-- Private account access policies
DROP POLICY IF EXISTS "المدراء وموظفو الحسابات وأصحاب الصلاحية يمكنهم إدارة صلاحيات الوصول" ON public.private_account_access;
CREATE POLICY "المدراء وموظفو الحسابات وأصحاب الصلاحية يمكنهم إدارة صلاحيات الوصول"
ON public.private_account_access
FOR ALL
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'specific_financial_employee'::app_role])
)
WITH CHECK (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
);

DROP POLICY IF EXISTS "المستخدمون يمكنهم رؤية صلاحياتهم" ON public.private_account_access;
CREATE POLICY "المستخدمون يمكنهم رؤية صلاحياتهم"
ON public.private_account_access
FOR SELECT
USING (user_id = auth.uid());

-- Private owners policies
DROP POLICY IF EXISTS "أصحاب الصلاحية يمكنهم إدارة المُلاّك" ON public.private_owners;
CREATE POLICY "أصحاب الصلاحية يمكنهم إدارة المُلاّك"
ON public.private_owners
FOR ALL
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'specific_financial_employee'::app_role])
  OR EXISTS (SELECT 1 FROM public.private_account_access WHERE user_id = auth.uid())
);

-- Private hotels policies
DROP POLICY IF EXISTS "أصحاب الصلاحية يمكنهم إدارة الفنادق" ON public.private_hotels;
CREATE POLICY "أصحاب الصلاحية يمكنهم إدارة الفنادق"
ON public.private_hotels
FOR ALL
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'specific_financial_employee'::app_role])
  OR EXISTS (SELECT 1 FROM public.private_account_access WHERE user_id = auth.uid())
);

-- Private rooms policies
DROP POLICY IF EXISTS "أصحاب الصلاحية يمكنهم إدارة الغرف" ON public.private_rooms;
CREATE POLICY "أصحاب الصلاحية يمكنهم إدارة الغرف"
ON public.private_rooms
FOR ALL
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'specific_financial_employee'::app_role])
  OR EXISTS (SELECT 1 FROM public.private_account_access WHERE user_id = auth.uid())
);

-- Private transactions policies
DROP POLICY IF EXISTS "أصحاب الصلاحية يمكنهم إدارة المعاملات" ON public.private_transactions;
CREATE POLICY "أصحاب الصلاحية يمكنهم إدارة المعاملات"
ON public.private_transactions
FOR ALL
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'specific_financial_employee'::app_role])
  OR EXISTS (SELECT 1 FROM public.private_account_access WHERE user_id = auth.uid())
);

-- Private vault policies
DROP POLICY IF EXISTS "أصحاب الصلاحية يمكنهم إدارة الخزنة" ON public.private_vault;
CREATE POLICY "أصحاب الصلاحية يمكنهم إدارة الخزنة"
ON public.private_vault
FOR ALL
USING (
  has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role, 'specific_financial_employee'::app_role])
  OR EXISTS (SELECT 1 FROM public.private_account_access WHERE user_id = auth.uid())
);

-- ============================================
-- 6. إنشاء الفهارس (Indexes)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_emails_account_id ON public.emails(account_id);
CREATE INDEX IF NOT EXISTS idx_emails_folder ON public.emails(folder);
CREATE INDEX IF NOT EXISTS idx_emails_date ON public.emails(date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON public.tasks(category);
CREATE INDEX IF NOT EXISTS idx_room_availability_dates ON public.room_availability(hotel_id, check_in, check_out);

-- ============================================
-- 7. إنشاء المحفزات (Triggers)
-- ============================================

-- Trigger for updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on hotels
DROP TRIGGER IF EXISTS update_hotels_updated_at ON public.hotels;
CREATE TRIGGER update_hotels_updated_at
BEFORE UPDATE ON public.hotels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on bookings
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on complaints
DROP TRIGGER IF EXISTS update_complaints_updated_at ON public.complaints;
CREATE TRIGGER update_complaints_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on reviews
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on coupons
DROP TRIGGER IF EXISTS update_coupons_updated_at ON public.coupons;
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on loyalty_points
DROP TRIGGER IF EXISTS update_loyalty_points_updated_at ON public.loyalty_points;
CREATE TRIGGER update_loyalty_points_updated_at
BEFORE UPDATE ON public.loyalty_points
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on whatsapp_settings
DROP TRIGGER IF EXISTS update_whatsapp_settings_updated_at ON public.whatsapp_settings;
CREATE TRIGGER update_whatsapp_settings_updated_at
BEFORE UPDATE ON public.whatsapp_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on site_settings
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on email_settings
DROP TRIGGER IF EXISTS update_email_settings_updated_at ON public.email_settings;
CREATE TRIGGER update_email_settings_updated_at
BEFORE UPDATE ON public.email_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on emails
DROP TRIGGER IF EXISTS update_emails_updated_at ON public.emails;
CREATE TRIGGER update_emails_updated_at
BEFORE UPDATE ON public.emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on tasks
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on task_comments
DROP TRIGGER IF EXISTS update_task_comments_updated_at ON public.task_comments;
CREATE TRIGGER update_task_comments_updated_at
BEFORE UPDATE ON public.task_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on task_categories
DROP TRIGGER IF EXISTS update_task_categories_updated_at ON public.task_categories;
CREATE TRIGGER update_task_categories_updated_at
BEFORE UPDATE ON public.task_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on task_sharing_settings
DROP TRIGGER IF EXISTS update_task_sharing_settings_updated_at ON public.task_sharing_settings;
CREATE TRIGGER update_task_sharing_settings_updated_at
BEFORE UPDATE ON public.task_sharing_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on private_account_access
DROP TRIGGER IF EXISTS update_private_account_access_updated_at ON public.private_account_access;
CREATE TRIGGER update_private_account_access_updated_at
BEFORE UPDATE ON public.private_account_access
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on private_owners
DROP TRIGGER IF EXISTS update_private_owners_updated_at ON public.private_owners;
CREATE TRIGGER update_private_owners_updated_at
BEFORE UPDATE ON public.private_owners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on private_hotels
DROP TRIGGER IF EXISTS update_private_hotels_updated_at ON public.private_hotels;
CREATE TRIGGER update_private_hotels_updated_at
BEFORE UPDATE ON public.private_hotels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on private_rooms
DROP TRIGGER IF EXISTS update_private_rooms_updated_at ON public.private_rooms;
CREATE TRIGGER update_private_rooms_updated_at
BEFORE UPDATE ON public.private_rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on private_transactions
DROP TRIGGER IF EXISTS update_private_transactions_updated_at ON public.private_transactions;
CREATE TRIGGER update_private_transactions_updated_at
BEFORE UPDATE ON public.private_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for task remaining amount calculation
DROP TRIGGER IF EXISTS task_calculate_remaining ON public.tasks;
CREATE TRIGGER task_calculate_remaining
BEFORE INSERT OR UPDATE OF amount_total, amount_paid
ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION calculate_task_remaining_amount();

-- ============================================
-- 8. إدراج البيانات الافتراضية
-- ============================================

-- Insert default site settings
INSERT INTO public.site_settings (tax_percentage) 
VALUES (15)
ON CONFLICT DO NOTHING;

-- Insert default WhatsApp settings
INSERT INTO public.whatsapp_settings (id) 
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Insert default email settings
INSERT INTO public.email_settings (id) 
VALUES ('main')
ON CONFLICT DO NOTHING;

-- Insert default task categories
INSERT INTO public.task_categories (name_ar, name_en, icon, color) VALUES
('عامة', 'General', 'tag', '#6b7280'),
('مالية', 'Financial', 'dollar-sign', '#10b981'),
('حجوزات', 'Bookings', 'calendar', '#3b82f6'),
('دعم', 'Support', 'message-square', '#f59e0b'),
('صيانة', 'Maintenance', 'wrench', '#ef4444')
ON CONFLICT DO NOTHING;

-- Insert default task sharing settings
INSERT INTO public.task_sharing_settings (id, share_via_email, share_via_whatsapp)
VALUES (gen_random_uuid(), false, false)
ON CONFLICT DO NOTHING;

-- Insert default private vault
INSERT INTO public.private_vault (amount) 
VALUES (0) 
ON CONFLICT DO NOTHING;

-- ============================================
-- تم الانتهاء من الإعداد
-- Setup Complete
-- ============================================

