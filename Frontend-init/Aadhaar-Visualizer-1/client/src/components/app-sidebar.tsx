import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Activity, 
  Brain, 
  EyeOff, 
  ShieldAlert, 
  Zap, 
  Fingerprint, 
  MapPinOff,
  Languages
} from "lucide-react";
import { Language } from "@/lib/translations";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/friction-index", label: "Aadhaar Friction Index", icon: Activity },
  { href: "/life-event", label: "Life-Event Intelligence", icon: Brain },
  { href: "/blind-spot", label: "Blind-Spot Detector", icon: EyeOff },
  { href: "/shock-resilience", label: "Shock & Resilience", icon: ShieldAlert },
  { href: "/update-paradox", label: "Update Paradox", icon: Zap },
  { href: "/identity-entropy", label: "Identity Entropy", icon: Fingerprint },
  { href: "/failure-zones", label: "Silent Failure Zones", icon: MapPinOff },
];

export function AppSidebar({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) {
  const [location] = useLocation();

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r">
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-lg font-display tracking-tight text-primary">
            Aadhar Analytics
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto border-t">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Language">
                  <Languages className="h-4 w-4" />
                  <select 
                    className="bg-transparent border-none outline-none text-sm w-full cursor-pointer"
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Language)}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="bn">বাংলা</option>
                    <option value="mr">मराठी</option>
                    <option value="te">తెలుగు</option>
                    <option value="ta">தமிழ்</option>
                    <option value="gu">ગુજરાતી</option>
                    <option value="kn">ಕನ್ನಡ</option>
                  </select>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
