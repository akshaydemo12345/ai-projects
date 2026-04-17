import { Sparkles } from "lucide-react";
import Lottie from "lottie-react";
import { useEffect, useState, useRef } from "react";

export const ModernLoader = () => {
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    fetch("/assets/Loader Count.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load lottie:", err));
  }, []);

  useEffect(() => {
    if (lottieRef.current) {
      // Smart Progress Logic: 
      // Start at a decent speed, then slow down as we get closer to 99%
      let progress = 0;
      const interval = setInterval(() => {
        if (!lottieRef.current) return;
        
        progress += 0.5; // Increment
        
        // Dynamic Speed based on progress
        let speed = 1.0;
        if (progress > 80) speed = 0.3;
        if (progress > 90) speed = 0.1;
        if (progress > 98) speed = 0.02;
        
        lottieRef.current.setSpeed(speed);
        
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [animationData]);

  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
      <div className="relative group flex flex-col items-center">
        {/* Outer Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/10 blur-[100px] rounded-full animate-pulse" />
        
        {/* Lottie Animation Container */}
        <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center">
          {animationData && (
            <Lottie 
              lottieRef={lottieRef}
              animationData={animationData} 
              loop={false} 
              autoplay={true}
              className="w-full h-full"
            />
          )}
          
          {/* Overlay Icon for extra branding */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
             <Sparkles className="h-12 w-12 text-violet-500 animate-spin-slow" />
          </div>
        </div>

        {/* Status Text Block */}
        <div className="mt-8 text-center relative z-10 max-w-md px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-4 animate-bounce">
            <span className="h-2 w-2 bg-violet-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600">AI is at work</span>
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            Crafting Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Digital Experience</span>
          </h2>
          
          <p className="text-gray-500 text-sm mt-4 font-medium leading-relaxed">
            Please wait while our AI engine analyzes your requirements, 
            generates optimized copy, and builds your pixel-perfect components.
          </p>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="h-1.5 w-1.5 bg-violet-300 rounded-full animate-bounce" 
                style={{ animationDelay: `${i * 200}ms` }} 
              />
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
