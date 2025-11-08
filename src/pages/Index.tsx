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
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default Index;
