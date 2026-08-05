import { Sparkles, CheckCircle2, XCircle, Loader2, Layers, Clock, Check, Layers3, Cpu, ShieldCheck, Globe } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export interface StageItem {
  id: string;
  name: string;
  sectionIndex: number;
}

export const AI_STAGES: StageItem[] = [
  { id: "analyzing", name: "Analyzing Website & Prompt Requirements", sectionIndex: -1 },
  { id: "brand_identity", name: "Extracting Brand Identity & Typography", sectionIndex: -1 },
  { id: "detecting_colors", name: "Detecting & Applying Color Palette", sectionIndex: -1 },
  { id: "generating_header", name: "Generating Header & Navigation", sectionIndex: 0 },
  { id: "writing_hero", name: "Writing Hero Section & Headline Copy", sectionIndex: 1 },
  { id: "creating_features", name: "Creating Features & Services Section", sectionIndex: 2 },
  { id: "testimonials", name: "Generating Testimonials & Social Proof", sectionIndex: 3 },
  { id: "cta_lead_form", name: "Building High-Converting CTA & Lead Form", sectionIndex: 4 },
  { id: "footer", name: "Creating Responsive Footer & Links", sectionIndex: 5 },
  { id: "optimizing_seo", name: "Optimizing SEO & Metadata", sectionIndex: 5 },
  { id: "finalizing", name: "Finalizing Page & Image Assets", sectionIndex: 5 },
];

export const PAGE_STRUCTURE_SECTIONS = [
  { id: "01", name: "Header & Navigation", path: "/header", stageTriggerIndex: 3, isLast: false },
  { id: "02", name: "Hero Banner & CTA", path: "/hero", stageTriggerIndex: 4, isLast: false },
  { id: "03", name: "Features & Services", path: "/features", stageTriggerIndex: 5, isLast: false },
  { id: "04", name: "Testimonials & Social Proof", path: "/testimonials", stageTriggerIndex: 6, isLast: false },
  { id: "05", name: "Lead Form & Contact", path: "/contact", stageTriggerIndex: 7, isLast: false },
  { id: "06", name: "Footer & SEO Meta", path: "/footer", stageTriggerIndex: 8, isLast: true },
];

export const ModernLoader = ({
  isComplete = false,
  onFinished = () => { },
  message = "Analyzing your requirements...",
  externalProgress,
  externalStatus,
  externalStage,
  error = null,
  onDismissError = () => { }
}: {
  isComplete?: boolean;
  onFinished?: () => void;
  message?: string;
  externalProgress?: number;
  externalStatus?: string;
  externalStage?: string;
  statusSteps?: { p: number; t: string }[];
  error?: string | null;
  onDismissError?: () => void;
}) => {
  const [statusText, setStatusText] = useState(externalStatus || message);

  // Sync status text strictly from external prop
  useEffect(() => {
    if (externalStatus) {
      setStatusText(externalStatus);
    } else if (message) {
      setStatusText(message);
    }
  }, [externalStatus, message]);

  // Derive stage index directly from real backend externalStage or progress with NO fake interval
  const currentStageIdx = useMemo(() => {
    if (isComplete) return AI_STAGES.length;

    if (externalStage) {
      const idx = AI_STAGES.findIndex(s => s.id === externalStage);
      if (idx !== -1) return idx;
    }

    if (externalStatus) {
      const lower = externalStatus.toLowerCase();
      const idx = AI_STAGES.findIndex(s =>
        lower.includes(s.id) ||
        s.name.toLowerCase().includes(lower)
      );
      if (idx !== -1) return idx;
    }

    if (typeof externalProgress === "number") {
      if (externalProgress >= 100) return AI_STAGES.length;
      if (externalProgress >= 90) return 10; // finalizing
      if (externalProgress >= 80) return 9;  // optimizing_seo
      if (externalProgress >= 75) return 8;  // footer
      if (externalProgress >= 65) return 7;  // cta_lead_form
      if (externalProgress >= 60) return 6;  // testimonials
      if (externalProgress >= 50) return 5;  // creating_features
      if (externalProgress >= 40) return 4;  // writing_hero
      if (externalProgress >= 25) return 3;  // generating_header
      if (externalProgress >= 18) return 2;  // detecting_colors
      if (externalProgress >= 10) return 1;  // brand_identity
      return 0; // analyzing
    }

    return 0;
  }, [isComplete, externalStage, externalStatus, externalProgress]);

  // Trigger finished callback when generation finishes
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        onFinished();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onFinished]);

  // Helper to determine stage status
  const getStageStatus = (idx: number) => {
    if (isComplete || currentStageIdx > idx) return "completed";
    if (currentStageIdx === idx) return "active";
    return "pending";
  };

  // Helper to determine section status (real status, no pre-marking complete)
  const getSectionStatus = (secStageTriggerIdx: number, isLast = false) => {
    if (isComplete) return "completed";
    if (isLast) {
      if (currentStageIdx >= secStageTriggerIdx) return "active";
      return "pending";
    }
    if (currentStageIdx > secStageTriggerIdx) return "completed";
    if (currentStageIdx === secStageTriggerIdx) return "active";
    return "pending";
  };

  const completedStagesCount = Math.min(AI_STAGES.length, isComplete ? AI_STAGES.length : currentStageIdx);

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4">
        <div className="relative group flex flex-col items-center max-w-md text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500/10 blur-[100px] rounded-full animate-pulse" />

          <div className="relative h-24 w-24 flex items-center justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-red-100 border border-red-200 flex items-center justify-center animate-in zoom-in duration-300">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 mb-4">
            <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">
              Generation Failed
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            We hit a snag
          </h2>
          <p className="text-slate-600 text-xs mt-3 font-medium leading-relaxed">
            {error}
          </p>

          <button
            onClick={onDismissError}
            className="mt-6 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors shadow-lg"
          >
            Go Back & Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50/95 text-slate-800 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto font-sans backdrop-blur-md">
      {/* Background Glows */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-violet-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-5xl my-auto py-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <span className="text-slate-400">Websites</span>
          <span>&rsaquo;</span>
          <span className="text-indigo-600 font-semibold">AI Generation Experience</span>
        </div>

        {/* Main Grid: Left Panel (Live AI Stages Checklist) & Right Panel (Landing Page Structure) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT PANEL: LIVE AI STAGES */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              {/* Header Title + Live Status Badge */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold tracking-wider uppercase mb-2 shadow-sm">
                    <Sparkles className="h-3 w-3 animate-pulse text-indigo-600" /> Real-Time AI Orchestration
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {isComplete ? "Landing Page Complete!" : "Generating Landing Page"}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {isComplete
                      ? "All sections, copy & assets generated. Redirecting to editor..."
                      : "Executing live generation stages in real time. Watch actual progress below."}
                  </p>
                </div>

                {/* AI Status Indicator Badge */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shrink-0 shadow-sm">
                  {!isComplete ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 leading-none">Processing</span>
                        <span className="text-[9px] font-semibold text-indigo-600 uppercase tracking-wider mt-0.5">
                          Stage {Math.min(AI_STAGES.length, currentStageIdx + 1)} / {AI_STAGES.length}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 leading-none">Ready</span>
                        <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider mt-0.5">
                          100% Done
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ACTIVE ACTION CARD */}
              <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4 mb-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-5 w-5 rounded-md bg-indigo-100 flex items-center justify-center">
                    <Cpu className="h-3 w-3 text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Current AI Task
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  {statusText}
                </p>
                {!isComplete && (
                  <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-indigo-100">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                    <span className="text-[10px] text-slate-500 font-medium truncate">
                      Backend worker active • Live execution stream
                    </span>
                  </div>
                )}
              </div>

              {/* LIVE STAGES CHECKLIST */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers3 className="h-3.5 w-3.5 text-indigo-600" />
                    AI Execution Pipeline
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {completedStagesCount} of {AI_STAGES.length} completed
                  </span>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {AI_STAGES.map((stage, idx) => {
                    const status = getStageStatus(idx);
                    return (
                      <div
                        key={stage.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
                          status === "active"
                            ? "bg-indigo-50/90 border-indigo-300 text-slate-900 shadow-sm shadow-indigo-100 scale-[1.01]"
                            : status === "completed"
                            ? "bg-emerald-50/60 border-emerald-200/70 text-slate-800"
                            : "bg-slate-50/70 border-slate-200/60 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {status === "completed" && (
                            <div className="h-6 w-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                          )}
                          {status === "active" && (
                            <div className="h-6 w-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                            </div>
                          )}
                          {status === "pending" && (
                            <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              <Clock className="h-3 w-3 text-slate-400" />
                            </div>
                          )}

                          <span className={`text-xs font-medium truncate ${
                            status === "active" ? "text-indigo-950 font-bold" : status === "completed" ? "text-slate-800" : "text-slate-400"
                          }`}>
                            {stage.name}
                          </span>
                        </div>

                        <div className="shrink-0 ml-2">
                          {status === "completed" && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Check className="h-2.5 w-2.5" /> Done
                            </span>
                          )}
                          {status === "active" && (
                            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                              Active
                            </span>
                          )}
                          {status === "pending" && (
                            <span className="text-[9px] font-medium text-slate-400 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Footer Meta */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-end">
              <span>{isComplete ? "Generation Complete" : "Live Processing"}</span>
            </div>
          </div>

          {/* RIGHT PANEL: LANDING PAGE STRUCTURE */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" /> Landing Page Structure
                </h2>
                <p className="text-[10px] text-slate-500 mt-0.5">Real-time layout assembly preview</p>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                6 Sections
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {PAGE_STRUCTURE_SECTIONS.map((sec) => {
                const status = getSectionStatus(sec.stageTriggerIndex, sec.isLast);
                return (
                  <div
                    key={sec.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                      status === "active"
                        ? "bg-indigo-50/90 border-indigo-300 text-slate-900 shadow-sm shadow-indigo-100 scale-[1.01]"
                        : status === "completed"
                        ? "bg-emerald-50/50 border-emerald-200/70 text-slate-800"
                        : "bg-slate-50/70 border-slate-200/60 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          status === "active"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : status === "completed"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-400 border border-slate-200/60"
                        }`}
                      >
                        {sec.id}
                      </div>

                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate leading-tight ${
                          status === "active" ? "text-indigo-950" : status === "completed" ? "text-slate-900" : "text-slate-400"
                        }`}>
                          {sec.name}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {status === "completed" && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Complete
                        </span>
                      )}
                      {status === "active" && (
                        <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                          <Loader2 className="h-3 w-3 animate-spin" /> Generating...
                        </span>
                      )}
                      {status === "pending" && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Queued
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Structure Summary Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-indigo-600" /> Fully Responsive Component Tree
              </span>
              <span className="text-indigo-600 font-semibold">Ready to Edit</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};