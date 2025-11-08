import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

export default function AddAdminRole() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const addAdminRole = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('add-admin-role', {
        body: {
          user_id: '1bec96ff-4555-456d-8181-a7dbecce49f9',
          role: 'admin'
        }
      });

      if (response.error) throw response.error;

      setDone(true);
      toast({
        title: t({ ar: "نجح", en: "Success" }),
        description: t({ ar: "تم إضافة دور المدير بنجاح", en: "Admin role added successfully" }),
      });
    } catch (error: any) {
      console.error('Error adding admin role:', error);
      toast({
        title: t({ ar: "خطأ", en: "Error" }),
        description: error.message || t({ ar: "فشل في إضافة دور المدير", en: "Failed to add admin role" }),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!done) {
      addAdminRole();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            {t({ ar: "إضافة دور المدير", en: "Add Admin Role" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="text-center text-muted-foreground">
              {t({ ar: "جاري الإضافة...", en: "Adding..." })}
            </p>
          )}
          {done && (
            <div className="space-y-4">
              <p className="text-center text-green-600">
                {t({ ar: "تم إضافة دور المدير بنجاح!", en: "Admin role added successfully!" })}
              </p>
              <Button onClick={() => window.location.href = '/manage-employees'} className="w-full">
                {t({ ar: "الذهاب إلى إدارة المستخدمين", en: "Go to Manage Users" })}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
