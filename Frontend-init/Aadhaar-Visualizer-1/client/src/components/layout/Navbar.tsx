import { Link, useLocation } from "wouter";
import { 
  Search, Bell, Menu, User, LayoutDashboard, FileBarChart, Settings as SettingsIcon,
  Activity, Brain, EyeOff, ShieldAlert, Zap, Fingerprint, MapPinOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();

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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] pr-0 overflow-y-auto">
            <Link href="/" className="flex items-center gap-2 mb-8 px-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">A</div>
              <span className="font-bold text-lg font-display tracking-tight text-primary">Aadhar Analytics</span>
            </Link>
            <nav className="flex flex-col gap-1 px-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={location === item.href ? "secondary" : "ghost"} 
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="my-2 border-t" />
              <Link href="/reports">
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                  <FileBarChart className="h-4 w-4" />
                  Reports
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="mr-4 hidden md:flex ml-2">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-display font-bold sm:inline-block text-lg tracking-tight text-primary">
              Aadhar Analytics
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search metrics..."
                className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-4 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted">
            <User className="h-4 w-4" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
