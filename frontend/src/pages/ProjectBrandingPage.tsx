import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsApi, type Project, type Branding } from "@/services/api";
import { BrandingSettings } from "@/components/branding/BrandingSettings";

export default function ProjectBrandingPage() {
  // Route is /dashboard/projects/:id/branding — param is `id`
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!projectId) {
    return <div className="p-6 text-red-500">Invalid project ID.</div>;
  }

  // Fetch project data
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getById(projectId),
  });

  // Fetch branding data
  const {
    data: branding,
    isLoading: brandingLoading,
  } = useQuery<Branding>({
    queryKey: ["branding", projectId],
    queryFn: () => projectsApi.getBranding(projectId),
  });

  if (projectLoading || brandingLoading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="flex items-center justify-center min-h-full text-red-500 text-sm p-6">
        Failed to load project. Please go back and try again.
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  const handleBrandingUpdated = (_updatedBranding: Branding) => {
    toast.success("Branding configuration updated!");
  };

  return (
    <div className="flex-1 min-h-full flex flex-col" style={{ background: "#f2f2f2" }}>
      {/* ── Header ── */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-border bg-white dark:bg-slate-900 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="h-8 px-3 text-xs font-semibold inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Branding</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{project.name}</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        <BrandingSettings
          projectId={projectId}
          initialBranding={branding}
          onBrandingUpdated={handleBrandingUpdated}
        />
      </div>
    </div>
  );
}