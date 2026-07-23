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
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Forgot Password Steps: 1 = Email Input, 2 = New Passwords Input
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);

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

        // If the backend auto-logs in the user and returns an accessToken, use it.
        if (response.accessToken && response.data && response.data.user) {
          toast.success("Account created successfully.");
          login(response.accessToken, response.data.user);
          console.log("Auto-login successful after sign-up", response.accessToken, response.data.user);
          // return;
          navigate("/dashboard");
        } else {
          toast.success("Account created successfully.");
          setIsSignUp(false);
          setPassword("");
          setName("");
        }
      } else {
        response = await authApi.login({ email, password });
        toast.success("Welcome back! You have signed in successfully.");
        const { accessToken, data } = response;
        login(accessToken, data.user);
        console.log("Auto-login successful after sign-in", accessToken, data.user);

        navigate("/dashboard");
      }
    } catch (error: any) {
      const backendErrors = Array.isArray(error?.errors) ? error.errors : [];
      const nextFieldErrors = backendErrors.reduce(
        (acc: { email?: string; password?: string; name?: string }, fieldError: any) => {
          if (fieldError?.field) {
            let friendlyFieldMsg = fieldError.message;
            if (fieldError.field === 'email') friendlyFieldMsg = 'Please enter a valid email address.';
            if (fieldError.field === 'password') friendlyFieldMsg = 'Password must be at least 8 characters long.';
            if (fieldError.field === 'name') friendlyFieldMsg = 'Please enter your full name.';
            acc[fieldError.field] = friendlyFieldMsg;
          }
          return acc;
        },
        {}
      );

      if (Object.keys(nextFieldErrors).length) {
        setFieldErrors(nextFieldErrors);
      }

      const errorMsg = error?.message || 'Authentication failed';

      if (backendErrors.length > 0) {
        const firstErr = backendErrors[0];
        let friendlyFirstMsg = firstErr.message;
        if (firstErr.field === 'email') friendlyFirstMsg = 'Please enter a valid email address.';
        else if (firstErr.field === 'password') friendlyFirstMsg = 'Password must be at least 8 characters long.';
        else if (firstErr.field === 'name') friendlyFirstMsg = 'Please enter your full name.';
        toast.error(friendlyFirstMsg || "Please fix the highlighted fields.");
      } else if (errorMsg.toLowerCase().includes("verify") || errorMsg.toLowerCase().includes("verification")) {
        setUnverifiedEmail(email);
        setShowResendPrompt(true);
        toast.error("Please verify your email address to continue.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      toast.success("Verification successful! Now please enter your new password.");
      setForgotStep(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to verify email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (forgotNewPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      toast.success("Your password has been reset successfully! You can now sign in.");

      // Reset forgot flow states
      setIsForgotPassword(false);
      setForgotStep(1);
      setForgotEmail("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      await authApi.resendVerificationEmail({ email: unverifiedEmail });
      toast.success("Verification email sent.");
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
      toast.success("Welcome back! You have signed in successfully.");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMsg = error.message || "Google sign-in failed";

      if (errorMsg.toLowerCase().includes("verify") || errorMsg.toLowerCase().includes("verification")) {
        toast.error("Please verify your email address to continue.");
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
        <div className="w-full max-w-md animate-in fade-in-50 duration-300">

          {/* Main Form Area */}
          {isForgotPassword ? (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Forgot password?
              </h2>

              {forgotStep === 1 ? (
                // Step 1: Input Email
                <div>
                  <p className="text-muted-foreground mb-8">
                    Enter your email address below to verify and reset your account password.
                  </p>

                  <form onSubmit={handleForgotEmailSubmit} className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="mt-1.5 h-11"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Continue"}
                    </Button>

                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setForgotStep(1);
                        }}
                        className="text-sm text-primary font-medium hover:text-primary/80"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Step 2: New Password Inputs
                <div>
                  <p className="text-muted-foreground mb-6">
                    Verification successful for <strong>{forgotEmail}</strong>. Please enter your new login password.
                  </p>

                  <form onSubmit={handleForgotPasswordReset} className="space-y-4">
                    {/* New Password */}
                    <div>
                      <label className="text-sm font-medium text-foreground">New Password</label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showForgotNewPass ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          className="h-11 pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPass((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                          aria-label={showForgotNewPass ? 'Hide password' : 'Show password'}
                        >
                          {showForgotNewPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showForgotConfirmPass ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          className="h-11 pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotConfirmPass((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                          aria-label={showForgotConfirmPass ? 'Hide password' : 'Show password'}
                        >
                          {showForgotConfirmPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Password & Sign In"}
                    </Button>

                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep(1);
                        }}
                        className="text-sm text-primary font-medium hover:text-primary/80"
                      >
                        Back to Step 1 (Change Email)
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div>
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
                        onClick={() => {
                          setIsForgotPassword(true);
                          setForgotStep(1);
                        }}
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
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
