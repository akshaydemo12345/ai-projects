import { Sparkles, CheckCircle2 } from "lucide-react";
import Lottie from "lottie-react";
import { useEffect, useState, useRef } from "react";

export const ModernLoader = ({
  isComplete = false,
  onFinished = () => { },
  message = "Analyzing your requirements...",
  externalProgress,
  statusSteps: statusStepsProp,
}: {
  isComplete?: boolean;
  onFinished?: () => void;
  message?: string;
  externalProgress?: number;
  statusSteps?: { p: number; t: string }[];
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(message);

  useEffect(() => {
    if (message) setStatusText(message);
  }, [message]);

  const defaultStatusSteps = [
    { p: 0, t: "Analyzing your requirements..." },
    { p: 20, t: "Extracting brand guidelines..." },
    { p: 40, t: "Generating high-converting copy..." },
    { p: 60, t: "Creating pixel-perfect layout..." },
    { p: 80, t: "Optimizing for mobile devices..." },
    { p: 95, t: "Finalizing your masterpiece..." },
  ];

  const statusSteps = statusStepsProp || defaultStatusSteps;

  useEffect(() => {
    let mounted = true;
    // If external progress is provided, sync to it and skip auto-increment.
    if (typeof externalProgress === "number") {
      setProgress(externalProgress);
      const currentStep = [...statusSteps].reverse().find((s) => externalProgress >= s.p);
      if (currentStep && currentStep.t !== statusText) setStatusText(currentStep.t);
      if (externalProgress >= 100) {
        setTimeout(onFinished, 500);
      }
      return;
    }

    const interval = setInterval(() => {
      if (!mounted) return;
      setProgress((prev) => {
        if (prev >= 100) return 100;

        if (isComplete) {
          const next = prev + 5;
          if (next >= 100) {
            setTimeout(onFinished, 500);
            return 100;
          }
          return next;
        }

        // soft cap for auto-increment fallback so we don't auto-complete to 100
        if (prev >= 99) return 99;
        const next = prev + (prev > 90 ? 0.05 : prev > 70 ? 0.1 : 0.4);
        const currentStep = [...statusSteps].reverse().find((s) => next >= s.p);
        if (currentStep && currentStep.t !== statusText) {
          setStatusText(currentStep.t);
        }
        return next;
      });
    }, 100);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isComplete, statusText, onFinished, externalProgress, statusSteps]);

  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
      <div className="relative group flex flex-col items-center">
        {/* Outer Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/10 blur-[100px] rounded-full animate-pulse" />

        {/* Circular Progress Container */}
        <div className="relative h-64 w-64 md:h-72 md:w-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-gray-100 fill-none"
              strokeWidth="6"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-violet-600 fill-none transition-all duration-300 ease-out"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}%`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}%`}
            />
          </svg>

          {/* Percentage Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-gray-900 tabular-nums">
              {Math.floor(progress)}%
            </span>
            <Sparkles className="h-6 w-6 text-violet-500 mt-2 animate-pulse" />
          </div>
        </div>

        {/* Status Text Block */}
        <div className="mt-8 text-center relative z-10 max-w-md px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-4 animate-bounce">
            <span className="h-2 w-2 bg-violet-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600">
              {isComplete ? "Generation Complete" : `AI is at work`}
            </span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            {isComplete ? "Your Page is Ready!" : statusText}
          </h2>

          <p className="text-gray-500 text-sm mt-4 font-medium leading-relaxed">
            {isComplete
              ? "We've finished building your page. Redirecting you to the editor..."
              : "Please wait while our AI engine builds your pixel-perfect components and optimizes everything for conversion."
            }
          </p>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {isComplete ? (
              <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center animate-in zoom-in duration-300">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            ) : (
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 bg-violet-600 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};