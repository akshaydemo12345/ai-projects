import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Globe, FolderOpen, Users, Settings, CreditCard, Receipt, ChevronDown, LogOut, Sun, MailOpen, Layout,
  ChevronLeft, ChevronRight, LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/services/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: FolderOpen, label: "Projects", href: "/dashboard" },
  { icon: Users, label: "Leads Management", href: "/dashboard/leads" },
  { icon: MailOpen, label: "Email Settings", href: "/dashboard/mail-management" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    // If user has never set a preference, default to collapsed on desktop (≥1280px)
    if (stored === null) {
      return window.innerWidth >= 1280;
    }
    return stored === "true";
  });

  const { data: userProjects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });
  // Synchronously extract project ID from URL or localStorage so it doesn't flash /dashboard on refresh
  const urlMatch = location.pathname.match(/\/dashboard\/projects\/([^\/]+)/);
  const urlProjectId = urlMatch && urlMatch[1] !== 'new' ? urlMatch[1] : null;
  const activeId = localStorage.getItem("active_project_id");
  const matchedProject = (userProjects as any[]).find((p: any) => p._id === activeId);
  const activeProjectId = urlProjectId || activeId || matchedProject?._id || (userProjects.length > 0 ? (userProjects as any[])[0]._id : null);
  const projectHref = activeProjectId ? `/dashboard/projects/${activeProjectId}` : "/dashboard/projects/new";

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };


  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname === href || (href !== "/dashboard" && location.pathname.startsWith(href));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "U";

  const currentNavItems = [
    { icon: LayoutDashboard, label: "My Project", href: projectHref },
    ...navItems.filter(i => i.href !== "/dashboard")
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <div className={`relative flex-shrink-0 bg-background border-r border-border flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? "w-16" : "w-56"}`}>
        {/* Collapse Toggle floating on the border line */}
        <button
          onClick={toggleCollapse}
          className="absolute top-6 -right-3 z-50 h-6 w-6 rounded-full border border-border bg-background flex items-center justify-center shadow-sm hover:shadow hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {/* Workspace Logo */}
        <div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link to={projectHref} className="flex items-center gap-2 min-w-0">
            {isCollapsed ? (
              <img
                src="/assets/Buildify-logo-mini.png"
                alt="Buildify"
                className="h-9 w-9 object-contain flex-shrink-0 dark:brightness-0 dark:invert"
              />
            ) : (
              <img 
                src="/assets/Buildify-logo.png" 
                alt="Buildify Logo" 
                className="h-9 w-auto object-contain dark:brightness-0 dark:invert flex-shrink-0" 
              />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-3">
          {currentNavItems.map((item) => {
            const active = isActive(item.href);
            const linkEl = (
              <Link
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${isCollapsed ? "justify-center px-0" : ""} ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    {linkEl}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.label}>{linkEl}</div>;
          })}
        </nav>

        {/* Bottom - Theme & User */}
        <div className="mt-auto p-4 space-y-3 border-t border-border">
          <div className={`flex items-center gap-2 ${isCollapsed ? "flex-col justify-center" : "px-2"}`}>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/dashboard/settings?tab=profile"
                    className="flex items-center justify-center p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex-shrink-0 overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-xs">
                    <p className="font-semibold">{user?.name || "User"}</p>
                    <p className="text-[10px] text-muted-foreground">{user?.email || "user@email.com"}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                to="/dashboard/settings?tab=profile"
                title="Edit Profile"
                className="flex-1 flex items-center gap-2 hover:bg-muted/50 p-1 rounded-lg transition-colors min-w-0"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex-shrink-0 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-foreground truncate">{user?.name || "User"}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email || "user@email.com"}</p>
                </div>
              </Link>
            )}

            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className="flex-shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors mt-2"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  Log out
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={handleLogout}
                title="Log out"
                className="flex-shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardSidebar;
