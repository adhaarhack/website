import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState, useEffect } from "react";
import { Language } from "@/lib/translations";

const mockData = [
  { name: 'Day 1', baseline: 100, actual: 95 },
  { name: 'Day 2', baseline: 100, actual: 40 },
  { name: 'Day 3', baseline: 100, actual: 60 },
  { name: 'Day 4', baseline: 100, actual: 98 },
  { name: 'Day 5', baseline: 100, actual: 105 },
];

export default function ShockResilience() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar lang={lang} setLang={setLang} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold font-display tracking-tight text-primary">
                Shock & Resilience Analyzer
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="h-5 w-5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Monitors system behavior during unexpected surges or outages (e.g., policy changes or technical failures).</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>

              <Card className="mb-8 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>System Recovery Velocity</CardTitle>
                  <CardDescription>Response time vs. Expected baseline during shock events</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="baseline" stroke="#ccc" fill="#eee" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="actual" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
