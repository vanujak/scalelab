"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { sessionService } from "@/services/session.service";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  useEffect(() => {
    if (sessionService.getUser()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = isSignup
        ? await authService.register({ name: name.trim(), email: email.trim(), password })
        : await authService.login({ email: email.trim(), password });

      sessionService.setUser(response.user);
      setStatus("success");
      setMessage(`${response.message} Redirecting to dashboard...`);
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Request failed.");
    }
  }

  async function handleGoogleLogin() {
    setStatus("submitting");
    setMessage("");

    try {
      const response = await authService.googleLogin();
      sessionService.setUser(response.user);
      setStatus("success");
      setMessage(`${response.message} Redirecting to dashboard...`);
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Request failed.");
    }
  }

  const inputStyles = "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder-slate-500 focus:border-cyan-500 focus:bg-white/10";
  const labelStyles = "text-sm font-medium text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSignup ? (
        <label className="block space-y-2">
          <span className={labelStyles}>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={status === "submitting"}
            className={inputStyles}
            placeholder="Ada Lovelace"
          />
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className={labelStyles}>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={status === "submitting"}
          className={inputStyles}
          placeholder="you@scalelab.dev"
        />
      </label>

      <label className="block space-y-2">
        <span className={labelStyles}>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          disabled={status === "submitting"}
          className={inputStyles}
          placeholder="At least 8 characters"
        />
      </label>

      <div className="pt-2">
        <Button type="submit" variant="primary" disabled={status === "submitting"}>
          <span className="w-full text-center">
            {status === "submitting" ? "Authenticating..." : isSignup ? "Create account" : "Login securely"}
          </span>
        </Button>
      </div>

      <div className="relative flex items-center items-center py-2">
        <div className="flex-grow border-t border-white/10" />
        <span className="mx-4 flex-shrink text-xs font-medium uppercase tracking-widest text-slate-500">
          Or
        </span>
        <div className="flex-grow border-t border-white/10" />
      </div>

      <div>
        <Button 
          type="button" 
          variant="secondary" 
          disabled={status === "submitting"}
          onClick={handleGoogleLogin}
        >
          <span className="flex w-full items-center justify-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.4901 12.2749C23.4901 11.4249 23.4151 10.5999 23.2651 9.80997H12.0001V14.4599H18.4351C18.1551 15.9399 17.3201 17.2299 16.0501 18.0649L19.9501 21.085C22.2351 18.985 23.4901 15.9149 23.4901 12.2749Z"
                fill="#4285F4"
              />
              <path
                d="M5.26528 14.2949C5.02528 13.5699 4.88528 12.7999 4.88528 11.9999C4.88528 11.1999 5.02528 10.4299 5.26528 9.70496L1.27528 6.60999C0.460281 8.22999 0 10.0599 0 11.9999C0 13.9399 0.460281 15.7699 1.28028 17.3899L5.26528 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0003 24.0001C15.2403 24.0001 17.9653 22.9351 19.9453 21.095L16.0453 18.075C14.9753 18.795 13.6053 19.2501 12.0003 19.2501C8.87028 19.2501 6.21525 17.14 5.26525 14.295L1.27525 17.39C3.25525 21.31 7.31028 24.0001 12.0003 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Sign in with Google
          </span>
        </Button>
      </div>

      {message ? (
        <div className={`rounded-xl p-4 text-sm font-medium border flex justify-center text-center ${status === "error" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
          {message}
        </div>
      ) : null}
    </form>
  );
}
