import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, CheckCircle2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = isSignUp 
        ? { name, email, password } 
        : { email, password };

      const response = await (isSignUp 
        ? authService.signup(payload) 
        : authService.login(payload));

      const finalToken = response.accessToken || response.token || response.data?.token;

      if (response.status === "success" && (finalToken && response.data?.user)) {
        authService.setToken(finalToken);
        authService.setUser(response.data.user);
        toast.success(isSignUp ? "Account created successfully!" : "Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "An error occurred");
      }
    } catch (err: any) {
      toast.error("Internal Server Error. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Purple Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(260,80%,55%)] p-12 text-white relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">PageCraft</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4">
            Build landing pages<br />that convert
          </h1>
          <p className="text-white/70 text-lg mb-10">
            AI-powered page builder trusted by 2,000+ makers worldwide.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-white/90" />
              <span className="text-sm font-medium">Generate pages in 60 seconds</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-white/90" />
              <span className="text-sm font-medium">Custom domains & SSL included</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-white/90" />
              <span className="text-sm font-medium">Built-in lead capture & analytics</span>
            </div>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-5">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-sm text-white/90 italic mb-3">
            "PageCraft cut our landing page creation from weeks to minutes."
          </p>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              AK
            </div>
            <div>
              <p className="text-sm font-semibold">Amit Kumar</p>
              <p className="text-xs text-white/60">CEO, TechStartup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login / Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-border">
            <button
              onClick={() => setIsSignUp(false)}
              className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                !isSignUp
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
              {!isSignUp && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                isSignUp
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
              {isSignUp && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignUp
              ? "Start building landing pages in minutes"
              : "Sign in to continue building"}
          </p>

          <button className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors mb-6">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-4 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 h-11"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-primary font-medium hover:text-primary/80"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-primary font-medium hover:text-primary/80"
                >
                  Sign up free
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
