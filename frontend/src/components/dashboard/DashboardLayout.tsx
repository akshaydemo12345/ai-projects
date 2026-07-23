import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Desktop Sidebar (always visible ≥1280px) ── */}
      <div className="hidden xl:flex">
        <DashboardSidebar />
      </div>

      {/* ── Mobile Sidebar Drawer (<1280px) ── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full xl:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar />
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Mobile top bar with hamburger */}
        <div className="xl:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <img
            src="/assets/Buildify-logo.png"
            alt="Buildify"
            className="h-7 w-auto object-contain dark:brightness-0 dark:invert"
          />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
