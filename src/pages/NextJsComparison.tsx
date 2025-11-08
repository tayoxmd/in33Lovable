import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2, Zap, Server, Code, Globe, Shield, TrendingUp } from "lucide-react";

export default function NextJsComparison() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [renderTime, setRenderTime] = useState<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    // Simulate data fetching
    setTimeout(() => {
      setData([
        { id: 1, name: "City 1", hotels: 10 },
        { id: 2, name: "City 2", hotels: 15 },
        { id: 3, name: "City 3", hotels: 8 },
      ]);
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
    }, 100);
  }, []);

  const handleAction = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {t({ ar: "مقارنة Next.js vs React/Vite", en: "Next.js vs React/Vite Comparison" })}
          </h1>
          <p className="text-muted-foreground">
            {t({ ar: "هذه الصفحة تم بناؤها باستخدام React/Vite (الطريقة الحالية)", en: "This page is built with React/Vite (Current Method)" }))}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Metrics */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {t({ ar: "مقاييس الأداء", en: "Performance Metrics" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {t({ ar: "وقت التحميل الأولي", en: "Initial Load Time" })}
                </div>
                <div className="text-2xl font-bold">
                  {renderTime ? `${renderTime.toFixed(2)}ms` : "..."}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {t({ ar: "حجم Bundle", en: "Bundle Size" })}
                </div>
                <div className="text-2xl font-bold">~500KB</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {t({ ar: "نوع التحميل", en: "Loading Type" })}
                </div>
                <div className="text-2xl font-bold">
                  {t({ ar: "Client-Side", en: "Client-Side" })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                {t({ ar: "المميزات", en: "Features" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-green-500" />
                <span>{t({ ar: "Hot Module Replacement (HMR)", en: "Hot Module Replacement (HMR)" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span>{t({ ar: "Client-Side Rendering", en: "Client-Side Rendering" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span>{t({ ar: "تطوير سريع", en: "Fast Development" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-500" />
                <span>{t({ ar: "SEO محدود", en: "Limited SEO" })}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Display */}
        <Card className="card-luxury mb-8">
          <CardHeader>
            <CardTitle>{t({ ar: "عرض البيانات", en: "Data Display" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.length > 0 ? (
                data.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {t({ ar: "عدد الفنادق", en: "Hotels" })}: {item.hotels}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>{t({ ar: "جاري التحميل...", en: "Loading..." })}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle>{t({ ar: "اختبار الأداء", en: "Performance Test" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAction} 
              disabled={loading}
              className="btn-luxury w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t({ ar: "جاري المعالجة...", en: "Processing..." })}
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t({ ar: "تشغيل اختبار الأداء", en: "Run Performance Test" })}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Comparison Info */}
        <Card className="card-luxury mt-8">
          <CardHeader>
            <CardTitle>{t({ ar: "معلومات المقارنة", en: "Comparison Information" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="font-semibold mb-2">
                {t({ ar: "React/Vite (الحالي)", en: "React/Vite (Current)" })}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>{t({ ar: "✅ تطوير سريع مع HMR", en: "✅ Fast development with HMR" })}</li>
                <li>{t({ ar: "✅ Bundle صغير نسبياً", en: "✅ Relatively small bundle" })}</li>
                <li>{t({ ar: "⚠️ SEO محدود (Client-Side)", en: "⚠️ Limited SEO (Client-Side)" })}</li>
                <li>{t({ ar: "⚠️ وقت تحميل أولي أطول", en: "⚠️ Longer initial load time" })}</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold mb-2">
                {t({ ar: "Next.js (مقترح)", en: "Next.js (Suggested)" })}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>{t({ ar: "✅ Server-Side Rendering (SSR)", en: "✅ Server-Side Rendering (SSR)" })}</li>
                <li>{t({ ar: "✅ SEO ممتاز", en: "✅ Excellent SEO" })}</li>
                <li>{t({ ar: "✅ وقت تحميل أولي أسرع", en: "✅ Faster initial load time" })}</li>
                <li>{t({ ar: "✅ Static Site Generation (SSG)", en: "✅ Static Site Generation (SSG)" })}</li>
                <li>{t({ ar: "✅ API Routes مدمجة", en: "✅ Built-in API Routes" })}</li>
                <li>{t({ ar: "⚠️ تعقيد أكبر قليلاً", en: "⚠️ Slightly more complex" })}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

