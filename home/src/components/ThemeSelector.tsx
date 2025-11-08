import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Moon, Sun, Monitor, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ThemeSelectorProps {
  isAdmin?: boolean;
}

export function ThemeSelector({ isAdmin = false }: ThemeSelectorProps) {
  const { t } = useLanguage();
  const { userRole } = useAuth();
  const isMobile = useIsMobile();
  const [currentTheme, setCurrentTheme] = useState('design1');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'neutral' | 'comfort'>('light');
  const [loading, setLoading] = useState(false);
  
  // إظهار زر التصميم فقط للادمن (مدير)
  const isManager = userRole === 'admin' || userRole === 'manager';

  const loadCurrentTheme = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('admin_theme, user_theme')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      const theme = isAdmin ? (data as any).admin_theme : (data as any).user_theme;
      if (theme) {
        // استخراج الوضع من اسم التصميم
        if (theme.includes('-dark')) {
          setThemeMode('dark');
          setCurrentTheme(theme.replace('-dark', ''));
        } else if (theme.includes('-neutral')) {
          setThemeMode('neutral');
          setCurrentTheme(theme.replace('-neutral', ''));
        } else if (theme.includes('-comfort')) {
          setThemeMode('comfort');
          setCurrentTheme(theme.replace('-comfort', ''));
        } else {
          setThemeMode('light');
          setCurrentTheme(theme);
        }
      }
    }
  };

  useEffect(() => {
    if (isManager) {
      loadCurrentTheme();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isManager]);

  const applyTheme = async (theme: string, mode: 'light' | 'dark' | 'neutral' | 'comfort') => {
    setLoading(true);
    try {
      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const finalTheme = mode === 'light' ? theme : `${theme}-${mode}`;
      const updateData = isAdmin 
        ? { admin_theme: finalTheme }
        : { user_theme: finalTheme };

      if (existingSettings) {
        const { error } = await supabase
          .from('site_settings')
          .update(updateData)
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert(updateData);
        if (error) throw error;
      }

      setCurrentTheme(theme);
      setThemeMode(mode);

      toast({
        title: t({ ar: "تم التطبيق", en: "Applied" }),
        description: t({ ar: "جاري تحديث التصميم...", en: "Updating theme..." }),
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast({
        title: t({ ar: "خطأ", en: "Error" }),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const themes = isAdmin 
    ? [
        { id: 'design1', name: t({ ar: 'تصميم 1', en: 'Design 1' }) },
        { id: 'admin-design2', name: t({ ar: 'تصميم 2', en: 'Design 2' }) },
        { id: 'admin-design3', name: t({ ar: 'تصميم 3', en: 'Design 3' }) },
        { id: 'admin-design4', name: t({ ar: 'تصميم 4', en: 'Design 4' }) },
        { id: 'admin-design5', name: t({ ar: 'تصميم 5', en: 'Design 5' }) },
      ]
    : [
        { id: 'design1', name: t({ ar: 'تصميم 1', en: 'Design 1' }) },
        { id: 'design2', name: t({ ar: 'تصميم 2', en: 'Design 2' }) },
        { id: 'design3', name: t({ ar: 'تصميم 3', en: 'Design 3' }) },
        { id: 'design4', name: t({ ar: 'تصميم 4', en: 'Design 4' }) },
        { id: 'design5', name: t({ ar: 'تصميم 5', en: 'Design 5' }) },
      ];

  // إظهار زر التصميم فقط للادمن (مدير)
  if (!isManager) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${isMobile ? 'px-2' : ''}`}
          disabled={loading}
        >
          <Palette className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          {!isMobile && t({ ar: 'التصميم', en: 'Theme' })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {t({ ar: 'اختر التصميم', en: 'Select Theme' })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => applyTheme(theme.id, themeMode)}
            className={currentTheme === theme.id ? 'bg-accent' : ''}
          >
            {theme.name}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t({ ar: 'الوضع', en: 'Mode' })}
        </DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => applyTheme(currentTheme, 'light')}
          className={themeMode === 'light' ? 'bg-accent' : ''}
        >
          <Sun className="w-4 h-4 ml-2" />
          {t({ ar: 'فاتح', en: 'Light' })}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => applyTheme(currentTheme, 'dark')}
          className={themeMode === 'dark' ? 'bg-accent' : ''}
        >
          <Moon className="w-4 h-4 ml-2" />
          {t({ ar: 'داكن', en: 'Dark' })}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => applyTheme(currentTheme, 'neutral')}
          className={themeMode === 'neutral' ? 'bg-accent' : ''}
        >
          <Monitor className="w-4 h-4 ml-2" />
          {t({ ar: 'حيادي', en: 'Neutral' })}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => applyTheme(currentTheme, 'comfort')}
          className={themeMode === 'comfort' ? 'bg-accent' : ''}
        >
          <Eye className="w-4 h-4 ml-2" />
          {t({ ar: 'راحة', en: 'Comfort' })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
