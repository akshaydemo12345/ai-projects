import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SettingsPage = () => {
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
