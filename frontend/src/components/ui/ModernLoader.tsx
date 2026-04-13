import { Sparkles } from "lucide-react";

export const ModernLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="relative group">
        {/* Outer Glow Effect */}
        <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full animate-pulse scale-150" />
        <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-pulse delay-700" />
        
        {/* Modern Glassmorphic Logo Container */}
        <div className="relative h-32 w-32 md:h-40 md:w-40 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-105">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-violet-500 rounded-full blur-[40px] animate-blob" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500 rounded-full blur-[40px] animate-blob animation-delay-2000" />
            <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-fuchsia-500 rounded-full blur-[40px] animate-blob animation-delay-4000" />
          </div>

          {/* Logo Box with Gradient */}
          <div className="relative z-10 h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 transform animate-[float_4s_ease-in-out_infinite]">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-white animate-pulse" />
          </div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
        </div>

        {/* Orbiting particles (optional, but adds "AI" feel) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none">
          <div className="absolute top-0 left-1/2 h-2 w-2 bg-violet-400 rounded-full animate-[orbit_3s_linear_infinite]" />
          <div className="absolute top-1/2 right-0 h-1.5 w-1.5 bg-indigo-400 rounded-full animate-[orbit_4s_linear_infinite_reverse]" />
          <div className="absolute bottom-0 left-1/2 h-2.5 w-2.5 bg-fuchsia-400 rounded-full animate-[orbit_5s_linear_infinite]" />
        </div>
      </div>
      
      {/* Custom Styles for animations if not in tailwind.config */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-blob {
          animation: blob 7s infinite alternate;
        }
      `}</style>
    </div>
  );
};
