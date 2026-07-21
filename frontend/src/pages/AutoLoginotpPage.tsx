import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/services/api";
import { toast } from "sonner";
import config from "@/config";

/**
 * URL-triggered auto-login.
 *
 * Flow: someone opens .../?email=user@example.com (or /auto-login?email=...)
 *
 * When VITE_STOP_OTP_VERIFICATION_EMAIL=false (OTP verification enabled):
 *   1. On mount, read `email` from the query string
 *   2. Immediately call POST /auth/auto-login/send-otp — no button click needed
 *   3. Show "check your inbox" + a 6-digit code input
 *   4. On submit, call POST /auth/auto-login/verify-otp
 *   5. On success: store the token via useAuth().login() and go to /dashboard
 *
 * When VITE_STOP_OTP_VERIFICATION_EMAIL=true (OTP verification disabled):
 *   1. On mount, read `email` from the query string
 *   2. Immediately call POST /auth/auto-login/authenticate — no OTP involved
 *   3. On success: store the token via useAuth().login() and go straight to
 *      /dashboard, skipping the code-entry UI entirely
 */
const AutoLoginOtpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = (searchParams.get("email") || "").trim();

  const [status, setStatus] = useState<"sending" | "sent" | "verifying" | "authenticating" | "error">("sending");
  const [errorMsg, setErrorMsg] = useState("");
  const [otp, setOtp] = useState("");
  const sentRef = useRef(false);

  // Step 1 + 2: auto-send the OTP the moment we land here with an email
  useEffect(() => {
    if (!email) {
      setStatus("error");
      setErrorMsg("No email address was provided in the link.");
      return;
    }
    if (sentRef.current) return; // guard against double-fire (StrictMode / re-renders)
    sentRef.current = true;

    if (config.features.stopOtpVerificationEmail) {
      // OTP verification disabled — authenticate directly, no code to enter.
      setStatus("authenticating");
      (async () => {
        try {
          const res: any = await authApi.autoLoginDirect(email);
          const token = res?.accessToken;
          const user = res?.data?.user || res?.user;
          if (!token || !user) throw new Error("Login response was incomplete.");

          login(token, user);
          navigate("/dashboard", { replace: true });
        } catch (err: any) {
          setStatus("error");
          setErrorMsg(err?.message || "Something went wrong. Please try again.");
        }
      })();
      return;
    }

    (async () => {
      try {
        await authApi.sendAutoLoginOtp(email);
        setStatus("sent");
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err?.message || "Something went wrong. Please try again.");
      }
    })();
  }, [email, login, navigate]);

  const handleResend = async () => {
    setStatus("sending");
    setErrorMsg("");
    try {
      await authApi.sendAutoLoginOtp(email);
      setStatus("sent");
      toast.success("A new code has been sent.");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  };

  // Step 4 + 5: verify the code and log in
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }
    setStatus("verifying");
    setErrorMsg("");
    try {
      const res: any = await authApi.verifyAutoLoginOtp(email, otp);
      const token = res?.accessToken;
      const user = res?.data?.user || res?.user;
      if (!token || !user) throw new Error("Login response was incomplete.");

      login(token, user);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setStatus("sent"); // back to the code-entry state, not a full error page
      setErrorMsg(err?.message || "OTP verification failed. Please check the code and try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>

        {status === "sending" && (
          <>
            <Loader2 className="mx-auto mb-4 h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Sending your login code…</p>
          </>
        )}

        {status === "authenticating" && (
          <>
            <Loader2 className="mx-auto mb-4 h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Logging you in…</p>
          </>
        )}

        {(status === "sent" || status === "verifying") && (
          <>
            <h1 className="mb-2 text-xl font-semibold">Check your email</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              We've sent a code to <span className="font-medium text-foreground">{email}</span>.
              Enter it below to log in.
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em]"
                autoFocus
              />

              {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

              <Button type="submit" className="w-full" disabled={status === "verifying" || otp.length !== 6}>
                {status === "verifying" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify & Log In"
                )}
              </Button>

              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Didn't get it? Resend code
              </button>
            </form>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mb-2 text-xl font-semibold">Couldn't send your code</h1>
            <p className="mb-6 text-sm text-muted-foreground">{errorMsg}</p>
            <Button variant="outline" onClick={() => navigate("/login", { replace: true })}>
              Back to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AutoLoginOtpPage;