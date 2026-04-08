import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Globe, FileText, Copy, CheckCircle2,
  ChevronRight, Rocket, Download, Code2, Puzzle, Monitor,
  Upload, X, ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getProjects, saveProjects, generateToken, type Project } from "./ProjectsPage";

type Step = "form" | "integration";
type IntegrationMethod = "wordpress" | "script" | "iframe";

const categories = [
  "SaaS", "E-commerce", "Agency", "Healthcare",
  "Education", "Finance", "Real Estate", "Other",
];

const CreateProjectFlow = () => {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("form");
  const [tokenCopied, setTokenCopied] = useState(false);
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<IntegrationMethod>("wordpress");

  // Form fields
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("https://");
  const [category, setCategory] = useState("Agency");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Project Name is required.");
      return;
    }
    const newProject: Project = {
      id: Date.now().toString(),
      name: name.trim(),
      url: websiteUrl.trim(),
      category,
      description: description.trim(),
      token: generateToken(),
      pages: [],
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      }),
    };
    const projects = getProjects();
    saveProjects([...projects, newProject]);
    setCreatedProject(newProject);
    setStep("integration");
  };

  const copyToken = () => {
    if (!createdProject) return;
    navigator.clipboard.writeText(createdProject.token);
    setTokenCopied(true);
    toast.success("Token copied!");
    setTimeout(() => setTokenCopied(false), 2500);
  };

  const integrationMethods = [
    {
      id: "wordpress" as const,
      icon: <Puzzle className="h-5 w-5" />,
      label: "WordPress Plugin",
      desc: "Install our plugin for seamless WordPress integration with one click.",
    },
    {
      id: "script" as const,
      icon: <Code2 className="h-5 w-5" />,
      label: "Script (Any Website)",
      desc: "Add one line of JavaScript to embed your page on any website or CMS.",
    },
    {
      id: "iframe" as const,
      icon: <Monitor className="h-5 w-5" />,
      label: "Embed iFrame",
      desc: "Use an iFrame to embed your page anywhere that accepts HTML.",
    },
  ];

  const wordpressSteps = [
    {
      num: 1,
      title: "Install WordPress Plugin",
      desc: `Download and install the "PPC Landing Builder" plugin from WordPress plugin directory.`,
      action: (
        <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 mt-2 transition-colors">
          <Download className="h-3.5 w-3.5" /> Download Plugin
        </button>
      ),
    },
    {
      num: 2,
      title: "Generate Access Token",
      desc: "Copy the access token below and paste it in the plugin settings panel.",
      action: createdProject ? (
        <div
          className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mt-2 cursor-pointer hover:bg-muted/80 transition-colors w-fit"
          onClick={copyToken}
        >
          <span className="text-xs font-mono text-foreground">{createdProject.token}</span>
          {tokenCopied
            ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
            : <Copy className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
        </div>
      ) : null,
    },
    {
      num: 3,
      title: "Download & Activate",
      desc: "Activate plugin, go to Settings → PPC Landing Builder and save your token.",
      action: null,
    },
  ];

  const scriptCode = createdProject
    ? `<script src="https://cdn.ppcbuilder.io/embed.js" data-token="${createdProject.token}" async></script>`
    : "";
  const iframeCode = `<iframe src="https://your-subdomain.ppcbuilder.io/lp/your-page-slug" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ─── Step 1: Project Form ─── */}
      {step === "form" && (
        <div className="max-w-2xl mx-auto py-10 px-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-7 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Project</h1>
            <p className="text-muted-foreground text-sm">
              Set up a client project. Brand colors and logo will apply across all pages.
            </p>
          </div>

          <div className="space-y-6">
            {/* Project Name */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Info</p>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Roofing Company"
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourclient.com"
                    className="h-11 pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Project Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this client do? What's the product/service?"
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>

            <Button
              onClick={handleCreate}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 gap-2"
            >
              <Rocket className="h-5 w-5" /> Create Project
            </Button>
          </div>
        </div>
      )}

      {/* ─── Step 2: Integration Setup ─── */}
      {step === "integration" && createdProject && (
        <div className="max-w-2xl mx-auto py-10 px-6">
          {/* Success banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 mb-7 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                {createdProject.logoUrl && (
                  <img src={createdProject.logoUrl} alt="Logo" className="h-6 w-6 rounded object-contain" />
                )}
                <h1 className="text-lg font-bold text-foreground">Project Created! 🎉</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{createdProject.name}</span> is ready.
                Choose how to integrate your landing pages.
              </p>
            </div>
            {/* Brand color swatches */}
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="h-5 w-5 rounded-full border border-white shadow-sm" style={{ background: createdProject.primaryColor }} title="Primary" />
              <div className="h-5 w-5 rounded-full border border-white shadow-sm" style={{ background: createdProject.secondaryColor }} title="Secondary" />
            </div>
          </div>

          {/* Integration picker */}
          <p className="text-sm font-semibold text-foreground mb-3">
            Choose how you want to integrate landing pages into your website.
          </p>
          <div className="space-y-2 mb-5">
            {integrationMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                  selectedMethod === m.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 bg-card"
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedMethod === m.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${selectedMethod === m.id ? "text-primary" : "text-foreground"}`}>
                    {m.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedMethod === m.id ? "border-primary bg-primary" : "border-border"
                }`}>
                  {selectedMethod === m.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>

          {/* WordPress Steps */}
          {selectedMethod === "wordpress" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <p className="text-sm font-semibold text-foreground">Setup Instructions</p>
              </div>
              <div className="p-5 space-y-5">
                {wordpressSteps.map((s) => (
                  <div key={s.num} className="flex gap-4">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {s.num}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                      {s.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Script Code */}
          {selectedMethod === "script" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
              <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Add to your website's &lt;head&gt;</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(scriptCode); toast.success("Code copied!"); }}
                  className="text-xs text-primary flex items-center gap-1.5 hover:text-primary/80"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
              </div>
              <div className="p-5">
                <pre className="text-xs text-foreground font-mono bg-muted rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-all">{scriptCode}</pre>
              </div>
            </div>
          )}

          {/* iFrame Code */}
          {selectedMethod === "iframe" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
              <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Embed iFrame Code</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(iframeCode); toast.success("Code copied!"); }}
                  className="text-xs text-primary flex items-center gap-1.5 hover:text-primary/80"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
              </div>
              <div className="p-5">
                <pre className="text-xs text-foreground font-mono bg-muted rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-all">{iframeCode}</pre>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12" onClick={() => navigate(`/dashboard/projects/${createdProject.id}`)}>
              View Project
            </Button>
            <Button
              className="h-12 gap-2 bg-primary hover:bg-primary/90"
              onClick={() => navigate(`/dashboard/projects/${createdProject.id}?createPage=1`)}
            >
              <FileText className="h-4 w-4" /> Create First Page <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProjectFlow;
