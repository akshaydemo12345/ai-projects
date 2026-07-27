import { useEffect, useState } from "react";
import { Loader2, Sparkles, CheckCircle2, FileCode2, Terminal } from "lucide-react";

export const ArtifactLoader = ({
  isComplete = false,
  onFinished = () => { },
  message = "Building your page...",
  error = null,
  onDismissError = () => { }
}: {
  isComplete?: boolean;
  onFinished?: () => void;
  message?: string;
  error?: string | null;
  onDismissError?: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analyzing prompt requirements and industry context...",
    "Extracting brand colors, typography, and styling...",
    "Drafting hero section and compelling value proposition...",
    "Building dynamic feature cards and service blocks...",
    "Adding testimonials and social proof sections...",
    "Generating responsive grid layouts and containers...",
    "Embedding lead capture forms and call-to-actions...",
    "Applying CSS variables and final visual polish...",
  ];

  useEffect(() => {
    let mounted = true;

    if (isComplete) {
      setCurrentStep(steps.length);
      const timer = setTimeout(onFinished, 1500);
      return () => clearTimeout(timer);
    }

    if (error) return;

    // Simulate progress through steps
    const interval = setInterval(() => {
      if (!mounted) return;
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1200); // Step every 1.2s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isComplete, error, onFinished, steps.length]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white border border-red-200 rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-red-600 font-bold text-lg mb-2">Generation Failed</h3>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <button
            onClick={onDismissError}
            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium text-sm border border-red-100"
          >
            Close & Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 font-sans animate-in fade-in duration-500">

      <div className="w-full flex flex-col gap-6">
        {/* AI Response Block */}
        <div className="flex gap-4 self-start w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center shadow-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>

          <div className="flex flex-col gap-3 w-full max-w-[90%] pt-1">
            <p className="text-slate-700 text-sm leading-relaxed font-medium">
              I'm building a conversion-focused landing page based on your requirements. Here's a live look at the construction process:
            </p>

            {/* Artifact Card */}
            <div className="mt-2 w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl transition-all duration-500">
              {/* Artifact Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
                    {isComplete ? "Generation Complete" : "Building Code Artifact"}
                  </span>
                </div>
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Loader2 className="h-4 w-4 text-violet-600 animate-spin" />
                )}
              </div>

              {/* Artifact Body */}
              <div className="p-5 flex flex-col gap-4 min-h-[300px]">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <FileCode2 className="h-5 w-5 text-violet-500" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-slate-800 font-semibold text-sm">landing-page-template.html</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Architected highly-responsive layout with embedded sections</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3.5 pl-2 border-l-2 border-slate-100 ml-2">
                  {steps.map((step, idx) => {
                    const isPast = idx < currentStep;
                    const isCurrent = idx === currentStep && !isComplete;

                    if (idx > currentStep && !isComplete) return null;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 text-sm transition-all duration-300 animate-in fade-in slide-in-from-left-4 -ml-[7.5px]
                           ${isPast || isComplete ? 'text-slate-400' : 'text-slate-700 font-semibold'}
                         `}
                      >
                        {isPast || isComplete ? (
                          <div className="bg-white rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="bg-white rounded-full">
                            <Loader2 className="h-4 w-4 text-violet-600 animate-spin" />
                          </div>
                        )}
                        <span className="truncate">{step}</span>
                      </div>
                    );
                  })}
                </div>

                {isComplete && (
                  <div className="mt-auto pt-6 flex items-center justify-center animate-in fade-in zoom-in duration-500">
                    <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Code Artifact Ready! Redirecting to Editor...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
