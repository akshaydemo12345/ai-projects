import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import EditorPage from "./pages/EditorPage";
import PublishedPage from "./pages/PublishedPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreateProjectFlow from "./pages/CreateProjectFlow";
import CreatePagePage from "./pages/CreatePagePage";
import PageSettingsPage from "./pages/PageSettingsPage";
import LeadsPage from "./pages/LeadsPage";
import MailManagementPage from "./pages/MailManagementPage";
import SettingsPage from "./pages/SettingsPage";
import PlansPage from "./pages/PlansPage";
import BillingPage from "./pages/BillingPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import NotFound from "./pages/NotFound";
import PreviewPage from "./pages/PreviewPage";
import TemplatesPage from "./pages/TemplatesPage";
import PublicLandingPage from "./pages/PublicLandingPage";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const RootHandler = () => {
  const navigate = useNavigate();
  const pg = new URLSearchParams(window.location.search).get('pg');
  
  useEffect(() => {
    if (pg) {
      // Instantly redirect to clean slug URL
      navigate(`/${pg}`, { replace: true });
    }
  }, [pg, navigate]);

  if (pg) return null;
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootHandler />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/editor/:projectId/:pageId" element={<EditorPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<ProjectsPage />} />
                <Route path="projects/new" element={<CreateProjectFlow />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />
                <Route path="projects/:id/create-page" element={<CreatePagePage />} />
                <Route path="projects/:id/pages/:pageId/settings" element={<PageSettingsPage />} />
                <Route path="published" element={<PublishedPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="mail-management" element={<MailManagementPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="plans" element={<PlansPage />} />
                <Route path="billing" element={<BillingPage />} />
              </Route>
            </Route>

            {/* Public Landing Pages — Wildcard to support nested preSlugs */}
            <Route path="/preview/*" element={<PublicLandingPage />} />
            <Route path="/template-preview" element={<PreviewPage />} />
            <Route path="/*" element={<PublicLandingPage />} />


          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
