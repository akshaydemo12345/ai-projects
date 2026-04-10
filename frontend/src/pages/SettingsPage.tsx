import { useState } from "react";
import { Download, Globe, Shield, Zap, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";

const SettingsPage = () => {
  const [urlCopied, setUrlCopied] = useState(false);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">General Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your workspace preferences.</p>

      <div className="max-w-xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Workspace</h2>
          <div>
            <label className="text-xs text-muted-foreground">Workspace Name</label>
            <Input defaultValue="Priti's Workspace" className="mt-1 h-9 text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <Textarea defaultValue="My landing page workspace" className="mt-1 text-sm" rows={3} />
          </div>
          <Button size="sm">Save Changes</Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Default Domain</h2>
          <div>
            <label className="text-xs text-muted-foreground">Custom Domain</label>
            <Input placeholder="yourdomain.com" className="mt-1 h-9 text-sm" />
          </div>
          <Button size="sm">Connect Domain</Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">WordPress Integration</h2>
              <p className="text-xs text-muted-foreground mt-1">Connect your landing pages directly to your WordPress site.</p>
            </div>
            <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/plugin/download`} download className="block">
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="h-3.5 w-3.5" /> Download Plugin
              </Button>
            </a>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">API Base URL</label>
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value={import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'} 
                  className="bg-muted/50 border-dashed text-xs h-9 font-mono" 
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-9 px-3 border border-border"
                  onClick={async () => {
                    const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                    const success = await copyToClipboard(url);
                    if (success) {
                      setUrlCopied(true);
                      toast.success("API URL copied!");
                      setTimeout(() => setUrlCopied(false), 2000);
                    }
                  }}
                >
                  {urlCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-2">
              <p className="font-medium text-foreground">Steps to connect:</p>
              <ol className="list-decimal ml-4 space-y-1 text-muted-foreground">
                <li>Download and install the <strong>Domain Mapper</strong> plugin on your WP site.</li>
                <li>Go to <strong>Domain Mapper &gt; Settings</strong> in your WP admin.</li>
                <li>Paste your <strong>Project API Token</strong> and use the <strong>API Base URL</strong> above.</li>
                <li>Save settings — your pages will start syncing automatically.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
          <p className="text-xs text-muted-foreground">Permanently delete your workspace and all associated data.</p>
          <Button variant="destructive" size="sm">Delete Workspace</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
