import { Link } from "react-router-dom";
import { Zap, Star, Eye, Save, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorTopBarProps {
  title: string;
  onSave: () => void;
}

const EditorTopBar = ({ title, onSave }: EditorTopBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center justify-between border-b border-border bg-[hsl(240,20%,12%)] px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-white">{title}</span>
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
        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 gap-1.5 text-xs">
          <Eye className="h-3.5 w-3.5" /> Preview
        </Button>
        <Button variant="ghost" size="sm" onClick={onSave} className="text-white/60 hover:text-white hover:bg-white/10 gap-1.5 text-xs">
          <Save className="h-3.5 w-3.5" /> Save
        </Button>
        <Link to="/dashboard/published">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs px-4">Publish</Button>
        </Link>
      </div>
    </div>
  );
};

export default EditorTopBar;
