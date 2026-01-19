import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { KpiStatsResponse, StateWiseStatsResponse, TrendsStatsResponse } from "@/types/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  RefreshCw, 
  UserCheck, 
  Fingerprint,
  Database,
  Activity
} from "lucide-react";
import { TopStatesChart, TrendChart, BreakdownChart } from "@/components/DashboardCharts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Language } from "@/lib/translations";
import { translations } from "@/lib/translations";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const t = translations[lang];

  const { data: kpi, isLoading: kpiLoading } = useQuery<KpiStatsResponse>({ 
    queryKey: [api.stats.kpi.path] 
  });
  
  const { data: stateWise, isLoading: statesLoading } = useQuery<StateWiseStatsResponse>({ 
    queryKey: [api.stats.stateWise.path] 
  });
  
  const { data: trends, isLoading: trendsLoading } = useQuery<TrendsStatsResponse>({ 
    queryKey: [api.stats.trends.path] 
  });

  const isLoading = kpiLoading || statesLoading || trendsLoading;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar lang={lang} setLang={setLang} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold font-display tracking-tight text-primary">
                  {t.dashboardTitle}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="hidden sm:inline">System: Operational</span>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                  title={t.totalEnrollments}
                  value={kpi?.totalEnrollments} 
                  icon={<Users className="w-5 h-5" />} 
                  loading={isLoading}
                  color="bg-blue-500/10 text-blue-600"
                />
                <KpiCard 
                  title={t.totalUpdates}
                  value={kpi?.totalUpdates} 
                  icon={<RefreshCw className="w-5 h-5" />} 
                  loading={isLoading}
                  color="bg-orange-500/10 text-orange-600"
                />
                <KpiCard 
                  title={t.demographicUpdates}
                  value={kpi?.totalDemographicUpdates} 
                  icon={<UserCheck className="w-5 h-5" />} 
                  loading={isLoading}
                  color="bg-emerald-500/10 text-emerald-600"
                />
                <KpiCard 
                  title={t.biometricUpdates}
                  value={kpi?.totalBiometricUpdates} 
                  icon={<Fingerprint className="w-5 h-5" />} 
                  loading={isLoading}
                  color="bg-purple-500/10 text-purple-600"
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {stateWise ? <TopStatesChart data={stateWise} lang={lang} /> : <Skeleton className="h-[400px] w-full" />}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {trends ? <TrendChart data={trends} lang={lang} /> : <Skeleton className="h-[350px] w-full" />}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {kpi ? (
                    <BreakdownChart 
                      demographic={kpi.totalDemographicUpdates} 
                      biometric={kpi.totalBiometricUpdates} 
                      lang={lang}
                    />
                  ) : (
                    <Skeleton className="h-[350px] w-full" />
                  )}
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function KpiCard({ title, value, icon, loading, color }: any) {
  return (
    <Card className="border-border/50 shadow-sm hover-elevate active-elevate-2 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-md ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold font-display">{(value || 0).toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}