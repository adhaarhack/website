import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState, useEffect } from "react";
import { Language } from "@/lib/translations";

const mockData = [
  { name: 'District A', failures: 400, silent: 240 },
  { name: 'District B', failures: 300, silent: 139 },
  { name: 'District C', failures: 200, silent: 980 },
  { name: 'District D', failures: 278, silent: 390 },
  { name: 'District E', failures: 189, silent: 480 },
];

export default function SilentFailureZones() {
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
                Silent Failure Zones
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
                      <p className="max-w-xs">Identifies regions where users experience high authentication failures but low grievance reporting.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>

              <Card className="mb-8 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Silent vs. Reported Failures</CardTitle>
                  <CardDescription>Divergence between actual friction and official reports</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={mockData}>
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="failures" fill="#413ea0" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="silent" stroke="#ff7300" strokeWidth={3} />
                    </ComposedChart>
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
