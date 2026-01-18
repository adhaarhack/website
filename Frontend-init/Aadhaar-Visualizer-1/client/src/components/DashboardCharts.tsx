import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { StateWiseStatsResponse, TrendsStatsResponse } from "@shared/routes";
import { motion } from "framer-motion";
import { Language, translations } from "@/lib/translations";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// === Custom Tooltip ===
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-sm font-bold font-display mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-muted-foreground" style={{ color: entry.color }}>
            {entry.name}: <span className="font-mono font-medium text-foreground">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// === Top States Bar Chart ===
export function TopStatesChart({ data, lang }: { data: StateWiseStatsResponse, lang: Language }) {
  const t = translations[lang];
  const sortedData = [...data]
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 10); // Top 10

  return (
    <Card className="h-full border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>{t.topStatesEnrollments}</CardTitle>
        <CardDescription>{t.performanceBreakdown}</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={sortedData} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="state" 
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
              interval={0} 
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
              tickFormatter={(val) => val.toLocaleString()} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.4)" }} />
            <Legend verticalAlign="top" align="right" />
            <Bar 
              dataKey="enrollments" 
              name={t.enrollments} 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
            <Bar 
              dataKey="updates" 
              name={t.updates} 
              fill="hsl(var(--accent))" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// === Trend Line Chart ===
export function TrendChart({ data, lang }: { data: TrendsStatsResponse, lang: Language }) {
  const t = translations[lang];
  return (
    <Card className="h-full border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>{t.trendsTitle}</CardTitle>
        <CardDescription>{t.dailyActivity}</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
              tickFormatter={(val) => val.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area 
              type="monotone" 
              dataKey="enrollments" 
              name={t.enrollments}
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEnrollments)" 
              animationDuration={2000}
            />
            <Area 
              type="monotone" 
              dataKey="updates" 
              name={t.updates}
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorUpdates)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// === Breakdown Pie Chart ===
export function BreakdownChart({ 
  demographic, 
  biometric,
  lang
}: { 
  demographic: number, 
  biometric: number,
  lang: Language
}) {
  const t = translations[lang];
  const data = [
    { name: t.demographicUpdates, value: demographic, color: 'hsl(var(--primary))' },
    { name: t.biometricUpdates, value: biometric, color: 'hsl(var(--accent))' },
  ];

  const total = demographic + biometric;

  return (
    <Card className="h-full border-border/50 shadow-sm flex flex-col">
      <CardHeader>
        <CardTitle>{t.updateTypesTitle}</CardTitle>
        <CardDescription>{t.updateTypesTitle}</CardDescription>
      </CardHeader>
      <CardContent className="h-full min-h-[300px] flex-1">
        <div className="h-full w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total</div>
              <div className="text-xl font-bold font-display">{total.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
