import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { authApi, projectsApi } from "@/services/api";

/**
 * Landing spot for the auto-login magic link.
 *
 * Flow: user clicks the link in their email -> backend verifies the token,
 * sets the httpOnly refreshToken cookie, and redirects the browser here
 * (a plain top-level navigation, so it can only set a cookie + Location
 * header — it can't run JS or return JSON). This page's job is to turn
 * that cookie into an actual logged-in session:
 *
 *   1. Call /auth/refresh-token (sends the cookie automatically) -> access token
 *   2. Call /auth/profile with that token -> user object
 *   3. Store both via useAuth().login() -> same as a normal login
 *   4. Go directly to Create New Page (/create-page)
 */
const AutoLoginCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode / effect double-invoke firing this twice
    if (ranRef.current) return;
    ranRef.current = true;

    const hydrateSession = async () => {
      try {
        const token = await authApi.refreshSession();
        const profileRes: any = await authApi.getProfile();
        const user = profileRes?.data?.user || profileRes?.user;

        if (!token || !user) {
          throw new Error("Session could not be established");
        }

        login(token, user);

        try {
          const userProjects = await projectsApi.getAll();
          if (userProjects && userProjects.length > 0) {
            const activeId = localStorage.getItem("active_project_id");
            const matched = userProjects.find((p: any) => p._id === activeId);
            const targetProj = matched || userProjects[0];
            if (targetProj?._id) {
              localStorage.setItem("active_project_id", targetProj._id);
              navigate(`/dashboard/projects/${targetProj._id}/create-page`, { replace: true });
              return;
            }
          }
          const res = await projectsApi.create({ name: "My Project", category: "General" });
          const proj = res?.data?.project || res?.project;
          if (proj?._id) {
            localStorage.setItem("active_project_id", proj._id);
            navigate(`/dashboard/projects/${proj._id}/create-page`, { replace: true });
            return;
          }
        } catch (e) {
          console.error("Failed to redirect to create-page in callback:", e);
        }
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Auto-login callback failed:", err);
        setError("This login link is invalid or has expired.");
        setTimeout(() => navigate("/login?error=invalid_link", { replace: true }), 1500);
      }
    };

    hydrateSession();
  }, [login, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-center">
      {error ? (
        <p className="text-sm text-muted-foreground">{error} Redirecting to login…</p>
      ) : (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Logging you in…</p>
        </>
      )}
    </div>
  );
};

export default AutoLoginCallback;