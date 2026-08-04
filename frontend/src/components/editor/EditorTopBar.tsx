import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Star, Eye, Save, Image, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import config from "@/config";

interface EditorTopBarProps {
  title: string;
  onSave: () => void;
  pageTitle?: string;
  onPreview?: () => void;

}

const EditorTopBar = ({ title, onSave, pageTitle, onPreview }: EditorTopBarProps) => {
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const storedUserJson = typeof window !== 'undefined' ? localStorage.getItem('pagecraft_user') : null;
  let storedUser: any = null;
  try { storedUser = storedUserJson ? JSON.parse(storedUserJson) : null; } catch (e) { storedUser = null; }
  useEffect(() => {
    // Debug: log runtime feature flag to confirm env is applied
    try {
      // eslint-disable-next-line no-console
      console.log('runtime: publishEngineEnabled=', config.features.publishEngineEnabled, 'VITE_PUBLISH_ENGINE_ENABLED=', import.meta.env.VITE_PUBLISH_ENGINE_ENABLED);
    } catch (e) {
      // ignore
    }
  }, []);
  
  const handleClaimRequest = async () => {
    setClaimLoading(true);
    try {
      const landingPageUrl = window.location.href;
      const websiteUrl = config.app.url || window.location.origin;

      const token = localStorage.getItem('pagecraft_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${config.api.baseUrl}/pages/claim-request`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          pageTitle: pageTitle || title,
          landingPageUrl,
          websiteUrl,
          clientEmail: storedUser?.email || null,
        }),
      });
      
      if (response.ok) {
        alert('Claim request sent successfully! The admin will review your request.');
        setClaimOpen(false);
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.message || 'Failed to send claim request. Please try again.');
      }
    } catch (error) {
      console.error('Claim request error:', error);
      alert('Error sending claim request');
    } finally {
      setClaimLoading(false);
    }
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center justify-between border-b border-border bg-[hsl(240,20%,12%)] px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span 
          className="text-sm font-semibold text-white cursor-default" 
          title={title}
        >
          {title ? (title.split(' ').length > 3 ? title.split(' ').slice(0, 3).join(' ') + '...' : title) : 'Untitled'}
        </span>
        <div className="flex items-center gap-2 ml-2">
          <Star className="h-4 w-4 text-white/40 hover:text-yellow-400 cursor-pointer transition-colors" />
          <button className="text-white/40 hover:text-white/70 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </button>
          <button className="text-white/40 hover:text-white/70 transition-colors">
            <Image className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          title="Live Preview"
          onClick={onPreview}
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgb(243, 244, 246)",
            border: "1px solid rgb(229, 231, 235)",
            borderRadius: "7px",
            padding: "7px",
            fontSize: "13px",
            justifyContent: "center",
            fontWeight: 500,
            color: "rgb(17, 24, 39)",
            cursor: "pointer",
            gap: "6px"
          }}
        >
          <Eye style={{ width: "15px", height: "15px" }} /> Preview
        </button>
        <button 
          title="Save Changes"
          onClick={onSave}
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgb(17, 24, 39)",
            border: "none",
            borderRadius: "7px",
            padding: "7px",
            fontSize: "23px",
            fontWeight: 500,
            color: "rgb(255, 255, 255)",
            cursor: "pointer",
            opacity: 1,
            gap: "6px"
          }}
        >
          <Save style={{ width: "15px", height: "15px" }} /> Save
        </button>
        {config.features.publishEngineEnabled ? (
          <Link to="/dashboard/published">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs px-4">Publish</Button>
          </Link>
        ) : (
          <Dialog open={claimOpen} onOpenChange={setClaimOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs px-4 flex items-center gap-2">
                <Mail style={{ width: "14px", height: "14px" }} /> Claim
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Claim Page Request</DialogTitle>
                <DialogDescription>
                  Submit a claim request for this page. An administrator will review and approve your request.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Page Title</label>
                  <p className="text-sm text-muted-foreground mt-1">{pageTitle || title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Client Email</label>
                  <p className="text-sm text-muted-foreground mt-1">{storedUser?.email || 'Not signed in'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Landing Page</label>
                  <p className="text-sm text-muted-foreground mt-1 break-all">{window?.location?.href || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Website URL</label>
                  <p className="text-sm text-muted-foreground mt-1">{config.app.url || window.location.origin}</p>
                </div>
                <Button 
                  onClick={handleClaimRequest}
                  disabled={claimLoading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {claimLoading ? 'Sending...' : 'Send Claim Request'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default EditorTopBar;
