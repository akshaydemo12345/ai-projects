import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsApi, type Project, type Branding } from "@/services/api";
import { BrandingSettings } from "@/components/branding/BrandingSettings";

export default function ProjectBrandingPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  if (!projectId) {
    return <div>Invalid project</div>;
  }

  // Fetch project data
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getById(projectId),
  });

  // Fetch branding data
  const {
    data: branding,
    isLoading: brandingLoading,
    error: brandingError,
  } = useQuery({
    queryKey: ["branding", projectId],
    queryFn: () => projectsApi.getBranding(projectId),
  });

  if (projectLoading || brandingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading branding settings...</div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Failed to load project</div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/projects/${projectId}`);
  };

  const handleBrandingUpdated = (updatedBranding: Branding) => {
    toast.success("Branding configuration updated!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Project
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">Manage branding and design settings</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <BrandingSettings
          projectId={projectId}
          initialBranding={branding}
          onBrandingUpdated={handleBrandingUpdated}
        />
      </div>
    </div>
  );
}
