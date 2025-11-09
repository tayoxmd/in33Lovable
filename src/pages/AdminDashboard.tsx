import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingManagement } from "@/components/BookingManagement";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  FileText, 
  Clock, 
  Users, 
  UserCog, 
  Hotel,
  TrendingDown,
  TrendingUp,
  Settings,
  User,
  Home,
  LayoutDashboard,
  CheckCircle,
  Briefcase,
  Tag,
  Gift,
  Calendar,
  MessageSquare,
  Clapperboard,
  Mail,
  Bus,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { playNotificationSound } from "@/utils/notificationSound";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getCurrencySymbol } from "@/utils/currency";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "@/assets/logo-transparent.png";

export default function AdminDashboard() {
  const { userRole, loading, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [showRecentBookings, setShowRecentBookings] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    profits: 0,
    losses: 0,
    totalBookingsValue: 0,
    pendingPayments: 0,
  });

  const adminMenuItems = [
    { icon: Home, label: t({ ar: 'الصفحة الرئيسية', en: 'Home' }), path: '/' },
    { icon: LayoutDashboard, label: t({ ar: 'إدارة المهام', en: 'Task Manager' }), path: '/task-manager' },
    { icon: DollarSign, label: t({ ar: 'الحسابات الخاصة', en: 'Private Accounting' }), path: '/private-accounting' },
    { icon: Hotel, label: t({ ar: 'إدارة الفنادق', en: 'Manage Hotels' }), path: '/manage-hotels' },
    { icon: Users, label: t({ ar: 'إدارة المستخدمين', en: 'Manage Users' }), path: '/manage-employees' },
    { icon: Mail, label: t({ ar: 'البريد', en: 'Email' }), path: '/email' },
    { icon: Briefcase, label: t({ ar: 'شؤون الموظفين', en: 'Employee Management' }), path: '/employee-management' },
    { icon: FileText, label: t({ ar: 'التقييمات والمراجعات', en: 'Reviews & Ratings' }), path: '/reviews' },
    { icon: MessageSquare, label: t({ ar: 'الدردشة المباشرة', en: 'Live Chat' }), path: '/live-chat' },
    { icon: Tag, label: t({ ar: 'الكوبونات', en: 'Coupons' }), path: '/coupons' },
    { icon: Gift, label: t({ ar: 'العروض الخاصة', en: 'Special Offers' }), path: '/special-offers' },
    { icon: Calendar, label: t({ ar: 'الأسعار الموسمية', en: 'Seasonal Pricing' }), path: '/seasonal-pricing' },
    { icon: Briefcase, label: t({ ar: 'برنامج الولاء', en: 'Loyalty Program' }), path: '/loyalty-program' },
    { icon: Clapperboard, label: t({ ar: 'الاستديو', en: 'Studio' }), path: '/studio' },
    { icon: Settings, label: t({ ar: 'إعدادات الموقع', en: 'Site Settings' }), path: '/site-settings' },
    { icon: DollarSign, label: t({ ar: 'إعدادات API', en: 'API Settings' }), path: '/api-settings' },
    { icon: FileText, label: t({ ar: 'إعدادات PDF', en: 'PDF Settings' }), path: '/pdf-settings' },
    { icon: FileText, label: t({ ar: 'سجل التدقيق', en: 'Audit Logs' }), path: '/audit-logs' },
    { icon: User, label: t({ ar: 'الملف الشخصي', en: 'Profile' }), path: '/profile' },
  ];

  useEffect(() => {
    if (!loading) {
      if (userRole !== 'admin') {
        navigate('/');
      } else {
        fetchBookings();
        fetchStats();
        
        const channel = supabase
          .channel('admin-bookings')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'bookings'
            },
            (payload) => {
              console.log('New booking received:', payload);
              playNotificationSound();
              fetchBookings();
              fetchStats();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [userRole, loading, navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id (full_name, phone),
          hotels:hotel_id (name_ar, name_en, location, location_url, price_per_night, max_guests_per_room, extra_guest_price, tax_percentage, room_type)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: totalCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      const { count: newCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      const { count: pendingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: confirmedCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      const { data: customerRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'customer');

      const { data: allBookings } = await supabase
        .from('bookings')
        .select('total_amount, amount_paid, payment_status, status');

      let totalRevenue = 0;
      let totalBookingsValue = 0;
      let losses = 0;
      let pendingPayments = 0;

      if (allBookings) {
        allBookings.forEach(booking => {
          totalBookingsValue += booking.total_amount || 0;
          
          if (booking.payment_status === 'paid') {
            totalRevenue += booking.amount_paid || 0;
          } else if (booking.payment_status === 'partially_paid') {
            totalRevenue += booking.amount_paid || 0;
            pendingPayments += (booking.total_amount - (booking.amount_paid || 0));
          } else if (booking.payment_status === 'unpaid') {
            pendingPayments += booking.total_amount || 0;
          }
          
          if (booking.status === 'cancelled' || booking.status === 'rejected') {
            losses += (booking.total_amount - (booking.amount_paid || 0));
          }
        });
      }

      const profits = totalRevenue - losses;

      setStats({
        totalBookings: totalCount || 0,
        pending: (newCount || 0) + (pendingCount || 0),
        confirmed: confirmedCount || 0,
        totalCustomers: customerRoles?.length || 0,
        totalRevenue: Math.round(totalRevenue),
        profits: Math.round(profits),
        losses: Math.round(losses),
        totalBookingsValue: Math.round(totalBookingsValue),
        pendingPayments: Math.round(pendingPayments),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const BigStatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <Card className="card-luxury hover-lift transition-all">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <h3 className="text-xl lg:text-2xl font-bold">{value}</h3>
          </div>
          <div className={`p-2 lg:p-3 rounded-lg ${colorClass}`}>
            <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <Card className="card-luxury hover-lift transition-all rounded-md">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <h3 className="text-lg lg:text-xl font-bold">{value}</h3>
          </div>
          <div className={`p-2 rounded-md ${colorClass}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const sidebarSide = language === "ar" ? "right" : "left";
  const borderClass = language === "ar" ? "border-l" : "border-r";
  
  const AdminSidebar = () => (
    <Sidebar side={sidebarSide} className={`${borderClass} z-50`} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="IN33" className="w-8 h-8 object-contain" />
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-bold text-sm">{t({ ar: "IN33", en: "IN33" })}</h2>
              <p className="text-xs text-muted-foreground">{t({ ar: "لوحة التحكم", en: "Dashboard" })}</p>
            </div>
          </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:mx-auto" />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">{t({ ar: 'إدارة الموقع', en: 'Site Management' })}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton onClick={() => navigate(item.path)} className="text-sm">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  const currency = getCurrencySymbol(language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />
      {isMobile ? (
        <div className="flex h-screen">
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 pt-20">
              <div className="mb-4 flex items-center gap-2">
                <Sheet open={adminMenuOpen} onOpenChange={setAdminMenuOpen}>
                  <SheetTrigger asChild>
                    <Button className="gap-2 text-xs h-8" style={{ backgroundColor: '#237bff', color: 'white' }}>
                      <Settings className="w-3 h-3" />
                      {t({ ar: "إدارة متكاملة", en: "Management" })}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-[280px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="text-sm">{t({ ar: 'إدارة متكاملة', en: 'Integrated Management' })}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-1">
                      {adminMenuItems.map((item) => (
                        <Button
                          key={item.path}
                          variant="ghost"
                          className="w-full justify-start gap-2 h-9 text-xs"
                          onClick={() => {
                            navigate(item.path);
                            setAdminMenuOpen(false);
                          }}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
                <Button variant="outline" className="gap-2 text-xs h-8" onClick={() => navigate('/')}> 
                  <Home className="w-3 h-3" />
                  {t({ ar: "الرئيسية", en: "Home" })}
                </Button>
              </div>

              {/* Financial Stats - 2 per row on mobile */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <BigStatCard
                  title={t({ ar: "إجمالي الطلبات", en: "Total Orders" })}
                  value={stats.totalBookings}
                  icon={Briefcase}
                  colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <BigStatCard
                  title={t({ ar: "الباصات النشطة", en: "Active Buses" })}
                  value={stats.confirmed}
                  icon={Bus}
                  colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <BigStatCard
                  title={t({ ar: "العملاء", en: "Customers" })}
                  value={stats.totalCustomers}
                  icon={Users}
                  colorClass="bg-gradient-to-br from-cyan-500 to-cyan-600"
                />
                <BigStatCard
                  title={t({ ar: "الأرباح", en: "Profits" })}
                  value={`${stats.profits || 0} ${currency}`}
                  icon={TrendingUp}
                  colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                />
              </div>

              {/* Status Cards - 2 per row */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <StatCard
                  title={t({ ar: "قيد الانتظار", en: "Pending" })}
                  value={stats.pending}
                  icon={Clock}
                  colorClass="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <StatCard
                  title={t({ ar: "مؤكد", en: "Confirmed" })}
                  value={stats.confirmed}
                  icon={CheckCircle}
                  colorClass="bg-gradient-to-br from-green-500 to-green-600"
                />
              </div>

              {/* Financial Details - 2 per row */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <StatCard
                  title={t({ ar: "الإيرادات المكتملة", en: "Completed Revenue" })}
                  value={`${stats.totalRevenue || 0} ${currency}`}
                  icon={DollarSign}
                  colorClass="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                  title={t({ ar: "الإيرادات المتوقعة", en: "Expected Revenue" })}
                  value={`${stats.pendingPayments || 0} ${currency}`}
                  icon={Clock}
                  colorClass="bg-gradient-to-br from-amber-500 to-amber-600"
                />
              </div>

              {/* Recent Bookings - Collapsible */}
              <Card className="card-luxury">
                <CardHeader className="pb-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto"
                    onClick={() => setShowRecentBookings(!showRecentBookings)}
                  >
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      {t({ ar: "أحدث الطلبات", en: "Recent Orders" })}
                    </CardTitle>
                    {showRecentBookings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                {showRecentBookings && (
                  <CardContent className="pt-2">
                    {loadingBookings ? (
                      <div className="flex justify-center py-4"><LoadingSpinner size="sm" /></div>
                    ) : (
                      <BookingManagement bookings={bookings} onUpdate={fetchBookings} />
                    )}
                  </CardContent>
                )}
              </Card>
            </div>
          </main>
        </div>
      ) : (
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto transition-all duration-300">
              <div className="p-6 max-w-[1600px] mx-auto">
                {/* Financial Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <BigStatCard
                    title={t({ ar: "الأرباح", en: "Profits" })}
                    value={`${stats.profits || 0} ${currency}`}
                    icon={TrendingUp}
                    colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                  />
                  <BigStatCard
                    title={t({ ar: "في انتظار الدفع", en: "Pending Payment" })}
                    value={`${stats.pendingPayments || 0} ${currency}`}
                    icon={Clock}
                    colorClass="bg-gradient-to-br from-amber-500 to-amber-600"
                  />
                  <BigStatCard
                    title={t({ ar: "إجمالي قيمة الطلبات", en: "Total Orders Value" })}
                    value={`${stats.totalBookingsValue || 0} ${currency}`}
                    icon={FileText}
                    colorClass="bg-gradient-to-br from-sky-500 to-sky-600"
                  />
                  <BigStatCard
                    title={t({ ar: "الخسائر", en: "Losses" })}
                    value={`${stats.losses || 0} ${currency}`}
                    icon={TrendingDown}
                    colorClass="bg-gradient-to-br from-rose-500 to-rose-600"
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    title={t({ ar: "إجمالي الحجوزات", en: "Total Bookings" })}
                    value={stats.totalBookings}
                    icon={Briefcase}
                    colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
                  />
                  <StatCard
                    title={t({ ar: "قيد الانتظار", en: "Pending" })}
                    value={stats.pending}
                    icon={Clock}
                    colorClass="bg-gradient-to-br from-orange-500 to-orange-600"
                  />
                  <StatCard
                    title={t({ ar: "مؤكد", en: "Confirmed" })}
                    value={stats.confirmed}
                    icon={CheckCircle}
                    colorClass="bg-gradient-to-br from-green-500 to-green-600"
                  />
                  <StatCard
                    title={t({ ar: "عدد العملاء", en: "Customers" })}
                    value={stats.totalCustomers}
                    icon={Users}
                    colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                  />
                </div>

                {/* Recent Bookings - Collapsible */}
                <Card className="card-luxury">
                  <CardHeader className="pb-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto hover:bg-transparent"
                      onClick={() => setShowRecentBookings(!showRecentBookings)}
                    >
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="w-5 h-5" />
                        {t({ ar: "أحدث الحجوزات", en: "Recent Bookings" })}
                      </CardTitle>
                      {showRecentBookings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </Button>
                  </CardHeader>
                  {showRecentBookings && (
                    <CardContent className="pt-0">
                      {loadingBookings ? (
                        <div className="flex justify-center py-8"><LoadingSpinner size="md" /></div>
                      ) : (
                        <BookingManagement bookings={bookings} onUpdate={fetchBookings} />
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>
            </main>
          </div>
        </SidebarProvider>
      )}
    </div>
  );
}
