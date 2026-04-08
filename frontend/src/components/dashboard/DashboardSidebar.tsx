import { Link, useLocation } from "react-router-dom";
import {
  Globe, FolderOpen, Users, Settings, CreditCard, Receipt, ChevronDown, LogOut, Sun
} from "lucide-react";

const navItems = [
  { icon: FolderOpen, label: "Projects", href: "/dashboard" },
  { icon: Users, label: "Leads", href: "/dashboard/leads" },
];

const settingsItems = [
  { icon: Settings, label: "General", href: "/dashboard/settings" },
  { icon: CreditCard, label: "Plans", href: "/dashboard/plans" },
  { icon: Receipt, label: "Billing", href: "/dashboard/billing" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-56 flex-shrink-0 bg-background border-r border-border flex flex-col min-h-screen">
      {/* Workspace */}
      <div className="p-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Priti's Workspace</p>
            <p className="text-[10px] text-muted-foreground">Starter Plan</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-0.5 px-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive(item.href)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Settings */}
      <div className="mt-6 px-3">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Settings</p>
        <nav className="space-y-0.5">
          {settingsItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom - Theme & User */}
      <div className="mt-auto p-4 space-y-3 border-t border-border">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sun className="h-3.5 w-3.5 text-yellow-500" />
            <span>Light</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            PS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Priti Sharma</p>
            <p className="text-[10px] text-muted-foreground truncate">priti@company.com</p>
          </div>
          <button 
            onClick={() => {
              // Simulated logout action
              window.location.href = "/login";
            }}
            title="Log out"
            className="flex-shrink-0 p-1 rounded-md hover:bg-muted transition-colors"
          >
            <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
