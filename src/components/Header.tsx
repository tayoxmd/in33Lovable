import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, Home, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotificationBell } from "./NotificationBell";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "@/assets/logo-transparent.png";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileOrTablet = useIsMobile() || (typeof window !== 'undefined' && window.innerWidth <= 1024);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'manager') return '/admin';
    if (userRole === 'employee') return '/employee';
    if (userRole === 'company') return '/employee';
    return '/dashboard';
  };

  const isHomePage = location.pathname === '/';
  const isMobile = useIsMobile();
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1024 && window.innerWidth > 640;

  // الحصول على عنوان الصفحة الحالية
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return t({ ar: 'لوحة التحكم', en: 'Dashboard' });
    if (path === '/employee') return t({ ar: 'لوحة الموظف', en: 'Employee Panel' });
    if (path === '/customer-dashboard') return t({ ar: 'حجوزاتي', en: 'My Bookings' });
    if (path === '/my-tasks') return t({ ar: 'مهامي', en: 'My Tasks' });
    if (path === '/task-manager') return t({ ar: 'إدارة المهام', en: 'Task Manager' });
    if (path === '/private-accounting') return t({ ar: 'الحسابات', en: 'Accounting' });
    if (path === '/manage-hotels') return t({ ar: 'الفنادق', en: 'Hotels' });
    if (path === '/manage-employees') return t({ ar: 'المستخدمين', en: 'Users' });
    if (path.startsWith('/booking/')) return t({ ar: 'حجز', en: 'Booking' });
    return '';
  };

  const pageTitle = getPageTitle();

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-card/40 backdrop-blur-lg border-b border-border/30 shadow-elegant h-14`}>
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo + Page Title */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <img 
                  src={logo} 
                  alt="IN33" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </Link>
              {pageTitle && (
                <span className="text-sm font-semibold text-foreground truncate max-w-[100px] sm:max-w-[150px]">
                  {pageTitle}
                </span>
              )}
            </div>

            {/* Right Actions: Language + Theme + Notifications + Menu */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Language Selector */}
              <div className="scale-75 sm:scale-90 md:scale-100">
                <LanguageSelector />
              </div>
              
              {/* Theme Selector */}
              <div className="scale-75 sm:scale-90 md:scale-100">
                <ThemeSelector />
              </div>
              
              {/* Notification Bell */}
              <NotificationBell />

              {user ? (
                <>
                  <div className="hidden lg:flex items-center gap-2">
                    {(userRole === 'admin' || userRole === 'manager' || userRole === 'employee' || userRole === 'company') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-green-500 hover:bg-green-600 text-white border-green-500 relative h-8 text-xs"
                        onClick={() => navigate('/my-tasks')}
                      >
                        <LayoutDashboard className="w-3 h-3" />
                        {t({ ar: 'المهام', en: 'Tasks' })}
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      </Button>
                    )}

                    {(userRole === 'admin' || userRole === 'employee') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-8 text-xs"
                        style={{ backgroundColor: '#237bff', color: 'white', borderColor: '#237bff' }}
                        onClick={() => navigate(getDashboardPath())}
                      >
                        <LayoutDashboard className="w-3 h-3" />
                        {t('الإدارة', 'Management')}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs"
                      onClick={() => navigate('/customer-dashboard')}
                    >
                      <LayoutDashboard className="w-3 h-3" />
                      {t({ ar: "الحجوزات", en: "Bookings" })}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs"
                      onClick={() => signOut()}
                    >
                      <LogOut className="w-3 h-3" />
                      {t('خروج', 'Out')}
                    </Button>
                  </div>
                  
                  {/* Mobile/Tablet Quick Actions */}
                  <div className="lg:hidden flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => navigate('/customer-dashboard')}
                    >
                      {t({ ar: "الحجوزات", en: "Bookings" })}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex h-7 text-xs"
                    onClick={() => navigate('/auth?mode=login')}
                  >
                    {t('دخول', 'Sign In')}
                  </Button>

                  <Button
                    size="sm"
                    className="btn-luxury hidden sm:inline-flex h-7 text-xs"
                    onClick={() => navigate('/auth?mode=signup')}
                  >
                    {t('تسجيل', 'Sign Up')}
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden h-7 w-7 p-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`lg:hidden ${isMobile ? 'py-2' : 'py-4'} animate-fade-in`}>
              <nav className="flex flex-col gap-2">
                {/* تم إزالة الروابط: الرئيسية، الفنادق، العروض، من نحن */}
                {user ? (
                  <>
                    {/* Mobile: Tasks and Management in one row */}
                    <div className="md:hidden grid grid-cols-2 gap-2">
                      {(userRole === 'admin' || userRole === 'manager' || userRole === 'employee' || userRole === 'company') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start gap-2 bg-green-500 hover:bg-green-600 text-white border-green-500 relative"
                          onClick={() => navigate('/my-tasks')}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t({ ar: 'المهام', en: 'Tasks' })}
                          <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        </Button>
                      )}
                      
                      {(userRole === 'admin' || userRole === 'employee') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start gap-2"
                          style={{ backgroundColor: '#237bff', color: 'white', borderColor: '#237bff' }}
                          onClick={() => navigate(getDashboardPath())}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t('الإدارة', 'Management')}
                        </Button>
                      )}
                    </div>

                    {/* Desktop/Tablet: Original layout */}
                    <div className="hidden md:block space-y-2">
                      {(userRole === 'admin' || userRole === 'manager' || userRole === 'employee' || userRole === 'company') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start gap-2 bg-green-500 hover:bg-green-600 text-white border-green-500 relative w-full"
                          onClick={() => navigate('/my-tasks')}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t({ ar: 'المهام', en: 'Tasks' })}
                          <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        </Button>
                      )}
                      
                      {(userRole === 'admin' || userRole === 'employee') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start gap-2 w-full"
                          style={{ backgroundColor: '#237bff', color: 'white', borderColor: '#237bff' }}
                          onClick={() => navigate(getDashboardPath())}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t('الإدارة', 'Management')}
                        </Button>
                      )}
                    </div>

                    {/* Mobile: Dashboard and Logout in one row */}
                    <div className="md:hidden grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start gap-2"
                        onClick={() => navigate('/dashboard')}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t({ ar: "لوحة التحكم", en: "Dashboard" })}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start gap-2"
                        onClick={() => signOut()}
                      >
                        <LogOut className="w-4 h-4" />
                        {t('تسجيل الخروج', 'Sign Out')}
                      </Button>
                    </div>

                    {/* Desktop/Tablet: Original layout */}
                    <div className="hidden md:block space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start gap-2 w-full"
                        onClick={() => navigate('/dashboard')}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t({ ar: "لوحة التحكم", en: "Dashboard" })}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start gap-2 w-full"
                        onClick={() => signOut()}
                      >
                        <LogOut className="w-4 h-4" />
                        {t('تسجيل الخروج', 'Sign Out')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate('/auth?mode=login')}
                    >
                      {t('تسجيل الدخول', 'Sign In')}
                    </Button>
                    <Button 
                      size="sm" 
                      className="btn-luxury flex-1"
                      onClick={() => navigate('/auth?mode=signup')}
                    >
                      {t('سجل الآن', 'Sign Up')}
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

    </>
  );
}
