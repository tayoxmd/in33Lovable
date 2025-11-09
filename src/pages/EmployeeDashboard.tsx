import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingManagement } from "@/components/BookingManagement";
import { playNotificationSound } from "@/utils/notificationSound";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getCurrencySymbol } from "@/utils/currency";
import { 
  FileText, 
  Clock, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  User,
  Home,
  LayoutDashboard,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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
import logo from "@/assets/logo-transparent.png";

export default function EmployeeDashboard() {
  const { userRole, loading, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [showBookings, setShowBookings] = useState(false);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pending: 0,
    confirmed: 0,
    pendingChange: 0
  });

  const [hasPrivateAccountingAccess, setHasPrivateAccountingAccess] = useState(false);
  const [hasTaskAccess, setHasTaskAccess] = useState(false);

  useEffect(() => {
    if (!loading) {
      const allowedRoles = ['employee', 'company'];
      if (!allowedRoles.includes(userRole || '')) {
        navigate('/');
      } else {
        fetchBookings();
        checkPrivateAccountingAccess();
        checkTaskAccess();
        
        const channel = supabase
          .channel('employee-bookings')
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
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [userRole, loading, navigate]);

  const checkPrivateAccountingAccess = async () => {
    if (!user) return;
    
    if (userRole === 'manager' || userRole === 'admin') {
      setHasPrivateAccountingAccess(true);
      return;
    }

    const { data } = await supabase
      .from('private_account_access')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    setHasPrivateAccountingAccess(!!data);
  };

  const checkTaskAccess = async () => {
    if (!user) return;
    
    if (userRole === 'manager' || userRole === 'admin') {
      setHasTaskAccess(true);
      return;
    }

    const { data } = await supabase
      .from('task_full_access_users')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    setHasTaskAccess(!!data);
  };

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
        .limit(20);

      if (error) throw error;
      setBookings(data || []);
      
      const pending = data?.filter(b => b.status === 'new' || b.status === 'pending').length || 0;
      const confirmed = data?.filter(b => b.status === 'confirmed').length || 0;
      
      setStats({
        totalAssigned: data?.length || 0,
        pending,
        confirmed,
        pendingChange: 5.2
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const StatCard = ({ title, value, icon: Icon, change, colorClass }: any) => (
    <Card className="card-luxury hover-lift transition-all rounded-md">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold">{value}</h3>
              {change !== undefined && change !== 0 && (
                <div className={`flex items-center text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
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

  const EmployeeSidebar = () => (
    <Sidebar side={sidebarSide} className={`${borderClass} z-50`} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="IN33" className="w-8 h-8 object-contain" />
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-bold text-sm">{t({ ar: "IN33", en: "IN33" })}</h2>
              <p className="text-xs text-muted-foreground">{t({ ar: "لوحة الموظف", en: "Employee" })}</p>
            </div>
          </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:mx-auto" />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">{t({ ar: 'القائمة', en: 'Menu' })}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/')} className="text-sm">
                  <Home className="w-4 h-4" />
                  <span>{t({ ar: "الرئيسية", en: "Home" })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {hasTaskAccess && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate('/my-tasks')} className="text-sm">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{t({ ar: "المهام", en: "Tasks" })}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/employee')} className="text-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t({ ar: "الإدارة", en: "Management" })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {hasPrivateAccountingAccess && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate('/private-accounting')} className="text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{t({ ar: "الحسابات الخاصة", en: "Private Accounting" })}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/profile')} className="text-sm">
                  <User className="w-4 h-4" />
                  <span>{t({ ar: "الملف الشخصي", en: "Profile" })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <EmployeeSidebar />
          
          <main className="flex-1 overflow-y-auto transition-all duration-300">
            <div className="p-4 lg:p-6 pt-20 lg:pt-6 max-w-[1600px] mx-auto">
              {/* Quick Actions - Mobile Only */}
              <div className="lg:hidden grid grid-cols-2 gap-2 mb-4">
                <Button onClick={() => navigate('/')} variant="outline" className="h-16 flex-col gap-1 text-xs">
                  <Home className="w-4 h-4" />
                  <span>{t({ ar: "الرئيسية", en: "Home" })}</span>
                </Button>
                {hasTaskAccess && (
                  <Button onClick={() => navigate('/my-tasks')} variant="outline" className="h-16 flex-col gap-1 text-xs bg-green-500 hover:bg-green-600 text-white border-green-500">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{t({ ar: "المهام", en: "Tasks" })}</span>
                  </Button>
                )}
                <Button onClick={() => navigate('/employee')} variant="outline" className="h-16 flex-col gap-1 text-xs" style={{ backgroundColor: '#237bff', color: 'white', borderColor: '#237bff' }}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t({ ar: "الإدارة", en: "Management" })}</span>
                </Button>
                {hasPrivateAccountingAccess ? (
                  <Button onClick={() => navigate('/private-accounting')} variant="outline" className="h-16 flex-col gap-1 text-xs">
                    <FileText className="w-4 h-4" />
                    <span>{t({ ar: "الحسابات", en: "Accounting" })}</span>
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/profile')} variant="outline" className="h-16 flex-col gap-1 text-xs">
                    <User className="w-4 h-4" />
                    <span>{t({ ar: "الملف", en: "Profile" })}</span>
                  </Button>
                )}
              </div>

              {/* Stats Cards - 2 per row on mobile */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                <StatCard
                  title={t({ ar: "الطلبات المسندة", en: "Assigned" })}
                  value={stats.totalAssigned}
                  icon={FileText}
                  change={undefined}
                  colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                  title={t({ ar: "قيد الانتظار", en: "Pending" })}
                  value={stats.pending}
                  icon={Clock}
                  change={stats.pendingChange}
                  colorClass="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <StatCard
                  title={t({ ar: "تم التأكيد", en: "Confirmed" })}
                  value={stats.confirmed}
                  icon={CheckCircle}
                  change={undefined}
                  colorClass="bg-gradient-to-br from-green-500 to-green-600"
                />
              </div>

              {/* Bookings - Collapsible */}
              <Card className="card-luxury rounded-md">
                <CardHeader className="pb-2 lg:pb-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto hover:bg-transparent"
                    onClick={() => setShowBookings(!showBookings)}
                  >
                    <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                      <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
                      {t({ ar: "الطلبات المسندة", en: "Assigned Bookings" })}
                    </CardTitle>
                    {showBookings ? <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5" /> : <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </Button>
                </CardHeader>
                {showBookings && (
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
    </div>
  );
}
