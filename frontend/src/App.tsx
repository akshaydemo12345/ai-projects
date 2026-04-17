import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import LeadsPage from "./pages/LeadsPage";
import SettingsPage from "./pages/SettingsPage";
import PlansPage from "./pages/PlansPage";
import BillingPage from "./pages/BillingPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import NotFound from "./pages/NotFound";
import PreviewPage from "./pages/PreviewPage";
import PublicLandingPage from "./pages/PublicLandingPage";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/editor/:projectId/:pageId" element={<EditorPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<ProjectsPage />} />
                <Route path="projects/new" element={<CreateProjectFlow />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />
                <Route path="published" element={<PublishedPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="plans" element={<PlansPage />} />
                <Route path="billing" element={<BillingPage />} />
              </Route>
              <Route path="/preview" element={<PreviewPage />} />
            </Route>

            {/* Public Landing Pages & Previews */}
            <Route path="/preview/:slug" element={<PublicLandingPage />} />
            <Route path="/preview/:slug/thank-you" element={<PublicLandingPage />} />
            <Route path="/:slug" element={<PublicLandingPage />} />
            <Route path="/:slug/thank-you" element={<PublicLandingPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
