import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, CheckCircle2, Star, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/services/api";
import { signInWithGooglePopup } from "@/services/firebaseClient";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [showResendPrompt, setShowResendPrompt] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; name?: string }>({});

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
        setShowResendPrompt(false);
    setFieldErrors({});
    try {
      let response;
      if (isSignUp) {
        response = await authApi.signup({ name, email, password });
        toast.success("Account created successfully!", {
          description: "Welcome to Buildify! Let's start building your first project.",
        });
                 setIsSignUp(false);
        setPassword("");
        setName("");
      } else {
        response = await authApi.login({ email, password });
        toast.success("Welcome back!", {
          description: "Successfully logged into your account.",
        });
        const { accessToken, data } = response;
        login(accessToken, data.user);
        navigate("/dashboard");
      }
    } catch (error: any) {
      const backendErrors = Array.isArray(error?.errors) ? error.errors : [];
      const nextFieldErrors = backendErrors.reduce(
        (acc: { email?: string; password?: string; name?: string }, fieldError: any) => {
          if (fieldError?.field) {
            acc[fieldError.field] = fieldError.message;
          }
          return acc;
        },
        {}
      );

      if (Object.keys(nextFieldErrors).length) {
        setFieldErrors(nextFieldErrors);
      }

      const errorMsg =
        error?.message ||
        (backendErrors.length > 0 ? backendErrors.map((e: any) => e.message).join(', ') : 'Authentication failed');

      if (backendErrors.length > 0) {
        toast.error("Please fix the highlighted fields.", {
          description: errorMsg,
        });
      } else if (errorMsg.toLowerCase().includes("verify your email") || errorMsg.toLowerCase().includes("email address not verified")) {
        setUnverifiedEmail(email);
        setShowResendPrompt(true);
        toast.error("Email Not Verified", {
          description: "Please verify your email before logging in.",
        });
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      await authApi.resendVerificationEmail({ email: unverifiedEmail });
      toast.success("Email sent!", {
        description: "Please check your inbox for the verification link.",
      });
      setShowResendPrompt(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGooglePopup();
      const idToken = await result.user.getIdToken();
      const response = await authApi.firebaseSignIn({ idToken });

      const { accessToken, data } = response;
      login(accessToken, data.user);
      toast.success("Signed in with Google!", {
        description: "Welcome back to Buildify.",
      });
      navigate("/dashboard");
    } catch (error: any) {
       const errorMsg = error.message || "Google sign-in failed";

      // Check if it's an email verification error
      if (errorMsg.includes("not verified") || errorMsg.includes("email is not verified")) {
        toast.error("Email Not Verified", {
          description: "Please verify your email in your Google Account settings and try again.",
        });
      } else {
        toast.error(errorMsg);
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      const storedUser = localStorage.getItem('pagecraft_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        login(urlToken, userData);
        navigate('/dashboard');
      }
    }
  }, [login, navigate]);


  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Purple Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(260,80%,55%)] p-12 text-white relative overflow-hidden">
        <div>
          <div className="mb-16">
            <img src="/assets/Buildify-logo.png" alt="Buildify" className="h-10 w-auto brightness-0 invert" />
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
            "Buildify cut our landing page creation from weeks to minutes."
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
              className={`pb-3 px-4 text-sm font-medium transition-colors relative ${!isSignUp
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
              className={`pb-3 px-4 text-sm font-medium transition-colors relative ${isSignUp
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

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors mb-6"
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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
                  {fieldErrors.name && (
                  <p className="mt-2 text-sm text-destructive">{fieldErrors.name}</p>
                )}
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
              {fieldErrors.email && (
                <p className="mt-2 text-sm text-destructive">{fieldErrors.email}</p>
              )}
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
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-2 text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>
 {showResendPrompt && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">Email not verified</p>
                  <p className="text-sm text-amber-800 mt-1">
                    We sent a verification email to <strong>{unverifiedEmail}</strong>. 
                    Didn't receive it?
                  </p>
                  <Button
                    onClick={handleResendVerificationEmail}
                    variant="link"
                    className="text-sm text-amber-700 hover:text-amber-900 p-0 h-auto mt-2"
                  >
                    Resend verification email
                  </Button>
                </div>
              </div>
            </div>
          )}
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
