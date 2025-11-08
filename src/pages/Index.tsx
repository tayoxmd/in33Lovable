<<<<<<< HEAD
import { Header } from "@/components/Header";
import { SearchBox } from "@/components/SearchBox";
import { HotelCard } from "@/components/HotelCard";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LiveChatButton } from "@/components/LiveChatButton";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { ServicesSection } from "@/components/ServicesSection";

interface Hotel {
  id: string;
  name_ar: string;
  name_en: string;
  location: string;
  price_per_night: number;
  rating: number;
  images: any;
  city_name_ar: string;
  city_name_en: string;
  meal_plans?: any;
  amenities?: any;
  bed_type_single?: string;
  bed_type_double?: string;
  max_guests_per_room?: number;
}

const Index = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const fetchFeaturedHotels = async () => {
    try {
      const { data, error } = await supabase.rpc("get_public_hotels", {
        p_city_id: null,
        p_active_only: true,
      });

      if (error) throw error;
      if (data) {
        // Sort by pinned first, then by rating, limit to 10
        const sortedData = data
          .sort((a: any, b: any) => {
            if (a.pinned_to_homepage && !b.pinned_to_homepage) return -1;
            if (!a.pinned_to_homepage && b.pinned_to_homepage) return 1;
            return b.rating - a.rating;
          })
          .slice(0, 10);
        setHotels(sortedData);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <LiveChatButton />

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[650px] flex items-center justify-center pt-16 md:pt-20 overflow-hidden">
        {/* Hero Slideshow with 3D Logo */}
        <HeroSlideshow />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">جوار الحرم</h1>
            <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-md">
              احجز أفضل الفنادق والشقق الفندقية بأسعار تنافسية وخدمة استثنائية
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-32">
            <SearchBox />
=======
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Truck, Users, BarChart3, Shield, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-transport.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-95" />
        <img 
          src={heroImage} 
          alt="نظام إدارة النقل الحديث" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              نظام إدارة النقل الذكي
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              منصة متكاملة لإدارة أساطيل النقل والسائقين والمشرفين بكفاءة عالية
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  ابدأ مجاناً
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                تعرف أكثر
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              لماذا تختار in33.in؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نوفر لك جميع الأدوات اللازمة لإدارة عمليات النقل بسهولة واحترافية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border hover:shadow-[var(--shadow-smooth)] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>إدارة الأسطول</CardTitle>
                <CardDescription>
                  تتبع شامل لجميع المركبات والشاحنات في الوقت الفعلي
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-[var(--shadow-smooth)] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>إدارة السائقين</CardTitle>
                <CardDescription>
                  متابعة أداء السائقين ومواعيد عملهم وتقييماتهم
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-[var(--shadow-smooth)] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>تقارير مفصلة</CardTitle>
                <CardDescription>
                  احصائيات دقيقة وتحليلات شاملة لأداء العمليات
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-[var(--shadow-smooth)] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>تتبع الموقع</CardTitle>
                <CardDescription>
                  تتبع لحظي لموقع المركبات والشحنات على الخريطة
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-[var(--shadow-smooth)] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>أمان عالي</CardTitle>
                <CardDescription>
                  حماية متقدمة للبيانات مع نظام صلاحيات متكامل
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-[var(--shadow-smooth)] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>توفير الوقت</CardTitle>
                <CardDescription>
                  أتمتة العمليات اليومية وتقليل الأعمال اليدوية
                </CardDescription>
              </CardHeader>
            </Card>
>>>>>>> a6ad102384374fc3696efdda3640e9866dbbd366
          </div>
        </div>
      </section>

<<<<<<< HEAD
  {/* Services Section */}
  <ServicesSection />

  {/* Featured Hotels Section */}
  <section className="container mx-auto px-4 py-16" id="hotels">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-luxury">الفنادق المميزة</span>
          </h2>
          <p className="text-muted-foreground text-lg">اختر من بين مجموعة مختارة من أفضل الفنادق والشقق الفندقية</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {hotels.map((hotel, index) => (
              <div key={hotel.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up w-full">
                <HotelCard
                  id={hotel.id}
                  name={language === "ar" ? hotel.name_ar : hotel.name_en}
                  nameEn={hotel.name_en}
                  location={`${language === "ar" ? hotel.city_name_ar : hotel.city_name_en}`}
                  price={Number(hotel.price_per_night)}
                  rating={Number(hotel.rating)}
                  image={
                    hotel.images && hotel.images[0]
                      ? hotel.images[0]
                      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000"
                  }
                  images={hotel.images}
                  featured={index < 2}
                  meal_plans={hotel.meal_plans}
                  amenities={hotel.amenities}
                  bed_type_single={hotel.bed_type_single as any}
                  bed_type_double={hotel.bed_type_double as any}
                  max_guests_per_room={hotel.max_guests_per_room}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16" id="about">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-gradient-luxury">لماذا IN33؟</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            نحن في IN33 نؤمن بأن إدارة النقل يجب أن تكون فعالة وموثوقة. نوفر لك أفضل الحلول لإدارة عمليات النقل
            الفاخرة بأسعار تنافسية وخدمة عملاء متميزة على مدار الساعة.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            <div className="card-luxury p-6">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">فندق وشقة فندقية</p>
            </div>
            <div className="card-luxury p-6">
              <div className="text-4xl font-bold text-primary mb-2">4.8</div>
              <p className="text-muted-foreground">تقييم العملاء</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
=======
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-light to-primary-glow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            جاهز للبدء؟
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            انضم إلى مئات الشركات التي تستخدم نظامنا لإدارة عمليات النقل بكفاءة
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-10">
              ابدأ الآن مجاناً
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xl font-bold text-primary">
              <Truck className="w-6 h-6" />
              <span>in33.in</span>
            </div>
            <p className="text-muted-foreground">
              © 2025 in33.in - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
>>>>>>> a6ad102384374fc3696efdda3640e9866dbbd366
    </div>
  );
};

export default Index;
