import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Activity, UserCheck, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface RoleStats {
  role: string;
  count: number;
  lastActivity: string | null;
}

const COLORS = {
  admin: 'hsl(var(--destructive))',
  manager: 'hsl(var(--primary))',
  employee: 'hsl(var(--secondary))',
  company: 'hsl(var(--accent))',
};

const ROLE_NAMES: Record<string, { ar: string; en: string }> = {
  admin: { ar: 'مدير النظام', en: 'Admin' },
  manager: { ar: 'مدير', en: 'Manager' },
  employee: { ar: 'موظف', en: 'Employee' },
  company: { ar: 'شركة', en: 'Company' },
};

export default function RoleStatistics() {
  const [roleStats, setRoleStats] = useState<RoleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoleStatistics();
  }, []);

  const fetchRoleStatistics = async () => {
    try {
      setLoading(true);

      // Get role counts and last activity
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role, created_at, user_id');

      if (rolesError) throw rolesError;

      // Group by role and calculate statistics
      const statsMap = new Map<string, { count: number; lastActivity: string | null }>();
      
      rolesData?.forEach((item) => {
        const role = item.role as string;
        const existing = statsMap.get(role);
        
        if (existing) {
          existing.count += 1;
          if (!existing.lastActivity || item.created_at > existing.lastActivity) {
            existing.lastActivity = item.created_at;
          }
        } else {
          statsMap.set(role, {
            count: 1,
            lastActivity: item.created_at,
          });
        }
      });

      const stats: RoleStats[] = Array.from(statsMap.entries()).map(([role, data]) => ({
        role,
        count: data.count,
        lastActivity: data.lastActivity,
      }));

      setRoleStats(stats);
      setTotalUsers(rolesData?.length || 0);
    } catch (error: any) {
      console.error('Error fetching role statistics:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب إحصائيات الأدوار",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'لا يوجد';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const chartData = roleStats.map(stat => ({
    name: ROLE_NAMES[stat.role]?.ar || stat.role,
    value: stat.count,
    fill: COLORS[stat.role as keyof typeof COLORS] || 'hsl(var(--muted))',
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              إحصائيات الأدوار
            </h1>
            <p className="text-muted-foreground">
              عرض تفصيلي لعدد المستخدمين حسب الدور وآخر نشاط
            </p>
          </div>
          <Button
            onClick={() => navigate('/manage-employees')}
            variant="outline"
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            إدارة المستخدمين
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                مستخدم مسجل في النظام
              </p>
            </CardContent>
          </Card>

          {roleStats.map((stat) => (
            <Card key={stat.role} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {ROLE_NAMES[stat.role]?.ar || stat.role}
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: COLORS[stat.role as keyof typeof COLORS] }}>
                  {stat.count}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  مستخدم
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                توزيع المستخدمين حسب الدور
              </CardTitle>
              <CardDescription>
                رسم بياني يوضح عدد المستخدمين في كل دور
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                نسبة توزيع الأدوار
              </CardTitle>
              <CardDescription>
                رسم دائري يوضح النسبة المئوية لكل دور
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Last Activity Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              آخر نشاط للأدوار
            </CardTitle>
            <CardDescription>
              عرض آخر نشاط مسجل لكل دور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-4 font-semibold text-foreground">الدور</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">عدد المستخدمين</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">آخر نشاط</th>
                  </tr>
                </thead>
                <tbody>
                  {roleStats.map((stat) => (
                    <tr key={stat.role} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[stat.role as keyof typeof COLORS] }}
                          />
                          <span className="font-medium">
                            {ROLE_NAMES[stat.role]?.ar || stat.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{stat.count}</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {formatDate(stat.lastActivity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
